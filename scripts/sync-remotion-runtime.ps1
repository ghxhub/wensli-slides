param(
  [string]$RuntimeRoot = (Join-Path (Resolve-Path (Join-Path $PSScriptRoot '..')).Path '.runtime-stilltest')
)

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = (Resolve-Path (Join-Path $scriptDir '..')).Path

function Invoke-Robocopy {
  param(
    [string]$Source,
    [string]$Destination
  )

  New-Item -ItemType Directory -Force -Path $Destination | Out-Null
  & robocopy $Source $Destination /E /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
  if ($LASTEXITCODE -gt 7) {
    throw "robocopy failed for '$Source' -> '$Destination' with exit code $LASTEXITCODE"
  }
}

New-Item -ItemType Directory -Force -Path $RuntimeRoot | Out-Null

$files = @(
  '.gitignore',
  '.prettierrc',
  'eslint.config.mjs',
  'package.json',
  'package-lock.json',
  'README.md',
  'remotion.config.ts',
  'tsconfig.json'
)

foreach ($relativePath in $files) {
  $sourcePath = Join-Path $projectRoot $relativePath
  if (-not (Test-Path $sourcePath)) {
    continue
  }

  $destinationPath = Join-Path $RuntimeRoot $relativePath
  $destinationDir = Split-Path -Parent $destinationPath
  if ($destinationDir) {
    New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null
  }
  Copy-Item -LiteralPath $sourcePath -Destination $destinationPath -Force
}

Invoke-Robocopy -Source (Join-Path $projectRoot 'src') -Destination (Join-Path $RuntimeRoot 'src')
Invoke-Robocopy -Source (Join-Path $projectRoot 'public') -Destination (Join-Path $RuntimeRoot 'public')
Invoke-Robocopy -Source (Join-Path $projectRoot 'node_modules') -Destination (Join-Path $RuntimeRoot 'node_modules')
