$ErrorActionPreference = 'Stop'
$CliArgs = @($args)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = (Resolve-Path (Join-Path $scriptDir '..')).Path
$runtimeRoot = Join-Path $projectRoot '.runtime-stilltest'
$runtimeCli = Join-Path $runtimeRoot 'node_modules\@remotion\cli\remotion-cli.js'
$sourceNodeModules = Join-Path $projectRoot 'node_modules'
$runtimeNodeModules = Join-Path $runtimeRoot 'node_modules'
$localChrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'

$rootFiles = @(
  '.gitignore',
  '.prettierrc',
  'eslint.config.mjs',
  'package.json',
  'package-lock.json',
  'README.md',
  'tsconfig.json'
)

$watchedDirs = @('src', 'public')

function Invoke-Robocopy {
  param(
    [string]$Source,
    [string]$Destination,
    [string[]]$ExtraArgs = @()
  )

  New-Item -ItemType Directory -Force -Path $Destination | Out-Null
  $args = @($Source, $Destination, '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/NC', '/NS', '/NP') + $ExtraArgs
  & robocopy @args | Out-Null
  if ($LASTEXITCODE -gt 7) {
    throw "robocopy failed for '$Source' -> '$Destination' with exit code $LASTEXITCODE"
  }
}

function Copy-RootFiles {
  foreach ($relativePath in $rootFiles) {
    $sourcePath = Join-Path $projectRoot $relativePath
    if (-not (Test-Path $sourcePath)) {
      continue
    }

    $destinationPath = Join-Path $runtimeRoot $relativePath
    $destinationDir = Split-Path -Parent $destinationPath
    if ($destinationDir) {
      New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null
    }
    Copy-Item -LiteralPath $sourcePath -Destination $destinationPath -Force
  }

  # Keep the runtime mirror config-free to avoid Windows path resolution issues
  # in Remotion's config bundling step.
  foreach ($configName in @('remotion.config.ts', 'remotion.config.js')) {
    $runtimeConfigPath = Join-Path $runtimeRoot $configName
    if (Test-Path -LiteralPath $runtimeConfigPath) {
      Remove-Item -LiteralPath $runtimeConfigPath -Force
    }
  }
}

function Test-FileHashEqual {
  param(
    [string]$LeftPath,
    [string]$RightPath
  )

  if (-not (Test-Path $LeftPath) -or -not (Test-Path $RightPath)) {
    return $false
  }

  $leftHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $LeftPath).Hash
  $rightHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $RightPath).Hash
  return $leftHash -eq $rightHash
}

function Sync-NodeModulesIfNeeded {
  $sourceLock = Join-Path $projectRoot 'package-lock.json'
  $runtimeLock = Join-Path $runtimeRoot 'package-lock.json'
  $needsNodeModules = -not (Test-Path $runtimeNodeModules) -or -not (Test-FileHashEqual $sourceLock $runtimeLock)

  if ($needsNodeModules) {
    Invoke-Robocopy -Source $sourceNodeModules -Destination $runtimeNodeModules
  }
}

function Sync-ProjectToRuntime {
  New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null
  Sync-NodeModulesIfNeeded
  Copy-RootFiles

  foreach ($directoryName in $watchedDirs) {
    $sourceDir = Join-Path $projectRoot $directoryName
    if (Test-Path $sourceDir) {
      $destinationDir = Join-Path $runtimeRoot $directoryName
      Invoke-Robocopy -Source $sourceDir -Destination $destinationDir
    }
  }
}

function Sync-OnePath {
  param([string]$FullPath)

  $resolvedRoot = [System.IO.Path]::GetFullPath($projectRoot)
  $resolvedPath = [System.IO.Path]::GetFullPath($FullPath)

  if (-not $resolvedPath.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    return
  }

  $relativePath = $resolvedPath.Substring($resolvedRoot.Length).TrimStart('\')
  if ([string]::IsNullOrWhiteSpace($relativePath)) {
    return
  }

  $destinationPath = Join-Path $runtimeRoot $relativePath

  if (Test-Path -LiteralPath $resolvedPath -PathType Container) {
    Invoke-Robocopy -Source $resolvedPath -Destination $destinationPath
    return
  }

  $destinationDir = Split-Path -Parent $destinationPath
  if ($destinationDir) {
    New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null
  }
  Copy-Item -LiteralPath $resolvedPath -Destination $destinationPath -Force
}

function Remove-OnePath {
  param([string]$FullPath)

  $resolvedRoot = [System.IO.Path]::GetFullPath($projectRoot)
  $resolvedPath = [System.IO.Path]::GetFullPath($FullPath)

  if (-not $resolvedPath.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    return
  }

  $relativePath = $resolvedPath.Substring($resolvedRoot.Length).TrimStart('\')
  if ([string]::IsNullOrWhiteSpace($relativePath)) {
    return
  }

  $destinationPath = Join-Path $runtimeRoot $relativePath
  if (Test-Path -LiteralPath $destinationPath) {
    Remove-Item -LiteralPath $destinationPath -Recurse -Force
  }
}

function Start-SyncWatcher {
  $watchers = New-Object System.Collections.Generic.List[System.IO.FileSystemWatcher]
  $eventSubscriptions = New-Object System.Collections.Generic.List[System.Management.Automation.PSEventJob]

  $pathsToWatch = @($rootFiles | ForEach-Object { Join-Path $projectRoot $_ })
  $pathsToWatch += $watchedDirs | ForEach-Object { Join-Path $projectRoot $_ }

  foreach ($pathToWatch in $pathsToWatch) {
    if (-not (Test-Path $pathToWatch)) {
      continue
    }

    $isDirectory = Test-Path -LiteralPath $pathToWatch -PathType Container
    $watchPath = if ($isDirectory) { $pathToWatch } else { Split-Path -Parent $pathToWatch }
    $filter = if ($isDirectory) { '*.*' } else { Split-Path -Leaf $pathToWatch }

    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $watchPath
    $watcher.Filter = $filter
    $watcher.IncludeSubdirectories = $isDirectory
    $watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, DirectoryName, LastWrite, CreationTime'
    $watcher.EnableRaisingEvents = $true
    $watchers.Add($watcher) | Out-Null

    $syncAction = {
      $changePath = if ($Event.SourceEventArgs.FullPath) {
        $Event.SourceEventArgs.FullPath
      } else {
        $Event.MessageData.Path
      }

      try {
        if (Test-Path -LiteralPath $changePath) {
          & $Event.MessageData.SyncPath $changePath
        }
      } catch {
        Write-Warning $_
      }
    }

    $removeAction = {
      $changePath = if ($Event.SourceEventArgs.FullPath) {
        $Event.SourceEventArgs.FullPath
      } else {
        $Event.MessageData.Path
      }

      try {
        & $Event.MessageData.RemovePath $changePath
      } catch {
        Write-Warning $_
      }
    }

    $eventSubscriptions.Add((Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $syncAction -MessageData @{
      Path = $pathToWatch
      SyncPath = ${function:Sync-OnePath}
      RemovePath = ${function:Remove-OnePath}
    })) | Out-Null
    $eventSubscriptions.Add((Register-ObjectEvent -InputObject $watcher -EventName Created -Action $syncAction -MessageData @{
      Path = $pathToWatch
      SyncPath = ${function:Sync-OnePath}
      RemovePath = ${function:Remove-OnePath}
    })) | Out-Null
    $eventSubscriptions.Add((Register-ObjectEvent -InputObject $watcher -EventName Renamed -Action $syncAction -MessageData @{
      Path = $pathToWatch
      SyncPath = ${function:Sync-OnePath}
      RemovePath = ${function:Remove-OnePath}
    })) | Out-Null
    $eventSubscriptions.Add((Register-ObjectEvent -InputObject $watcher -EventName Deleted -Action $removeAction -MessageData @{
      Path = $pathToWatch
      SyncPath = ${function:Sync-OnePath}
      RemovePath = ${function:Remove-OnePath}
    })) | Out-Null
  }

  return @{
    Watchers = $watchers
    Events = $eventSubscriptions
  }
}

function Stop-SyncWatcher {
  param([hashtable]$WatcherState)

  if (-not $WatcherState) {
    return
  }

  foreach ($eventSubscription in $WatcherState.Events) {
    try {
      Unregister-Event -SubscriptionId $eventSubscription.Id -ErrorAction SilentlyContinue
      Remove-Job -Id $eventSubscription.Id -Force -ErrorAction SilentlyContinue
    } catch {
      Write-Warning $_
    }
  }

  foreach ($watcher in $WatcherState.Watchers) {
    try {
      $watcher.EnableRaisingEvents = $false
      $watcher.Dispose()
    } catch {
      Write-Warning $_
    }
  }
}

function Normalize-CliArgs {
  param([string[]]$ArgsToNormalize)

  if (-not $ArgsToNormalize -or $ArgsToNormalize.Count -eq 0) {
    return ,@('studio', 'src/index.ts')
  }

  $normalized = [System.Collections.Generic.List[string]]::new()
  foreach ($arg in @($ArgsToNormalize)) {
    $normalized.Add([string]$arg) | Out-Null
  }

  $commandsWithEntryPoint = @('studio', 'bundle', 'render', 'still', 'compositions', 'benchmark')
  $command = $normalized[0]

  if ($commandsWithEntryPoint -contains $command) {
    $hasExplicitEntryPoint = $false
    if ($normalized.Count -ge 2) {
      $candidate = $normalized[1]
      if ($candidate -match '\.(jsx?|tsx?|mjs|mts|cjs|cts)$') {
        $hasExplicitEntryPoint = $true
      }
    }

    if (-not $hasExplicitEntryPoint) {
      $normalized.Insert(1, 'src/index.ts')
    }
  }

  if ($normalized[0] -in @('render', 'still') -and $normalized.Count -ge 4) {
    $outputArgument = $normalized[3]
    if (-not [System.IO.Path]::IsPathRooted($outputArgument) -and -not $outputArgument.StartsWith('-')) {
      $absoluteOutput = Join-Path $projectRoot $outputArgument
      $outputDir = Split-Path -Parent $absoluteOutput
      if ($outputDir) {
        New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
      }
      $normalized[3] = $absoluteOutput
    }
  }

  if ($normalized[0] -in @('render', 'still', 'studio') -and (Test-Path -LiteralPath $localChrome)) {
    if (-not ($normalized -contains '--browser-executable')) {
      $normalized.Add('--browser-executable') | Out-Null
      $normalized.Add($localChrome) | Out-Null
    }
  }

  return ,($normalized.ToArray())
}

Sync-ProjectToRuntime

$normalizedArgs = @(Normalize-CliArgs -ArgsToNormalize $CliArgs)
$watcherState = $null

try {
  if ($normalizedArgs[0] -eq 'studio') {
    $watcherState = Start-SyncWatcher
  }

  Push-Location $runtimeRoot
  try {
    & node $runtimeCli @normalizedArgs
    exit $LASTEXITCODE
  } finally {
    Pop-Location
  }
} finally {
  Stop-SyncWatcher -WatcherState $watcherState
}
