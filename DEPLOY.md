# Slidev 幻灯片部署与更新指南

## 项目地址

- 在线访问：<https://ghxhub.github.io/wensli-slides/>
- 源码仓库：<https://github.com/ghxhub/wensli-slides>
- 本地路径：`C:\Users\admin\Desktop\miniprogram-1\my-video`

## 仓库结构

| 分支 | 用途 | 内容 |
|---|---|---|
| `main` | 源码（默认分支） | `slides.md`、组件、`public/training-videos/` 视频原文件 |
| `gh-pages` | 部署产物 | `npm run deploy` 自动构建并推送，**不要手动改** |

GitHub Pages 监听 `gh-pages` 分支，每次 deploy 后 30 秒到 2 分钟自动重新发布。

---

## 一、首次配置（每台新机器一次）

### 1. 安装依赖

```powershell
cd C:\Users\admin\Desktop\miniprogram-1\my-video
npm install
```

### 2. 配置 GitHub 认证（推荐 gh CLI）

```powershell
winget install --id GitHub.cli -e --silent
gh auth login
```

`gh auth login` 交互问答按这样选：

- GitHub.com
- HTTPS
- Authenticate Git with your GitHub credentials → **Yes**
- Login with a web browser → 浏览器输入屏幕上的 8 位代码 → Authorize

完成后所有 `git push` 和 `npm run deploy` 自动带凭据。

> 不想装 gh CLI 也可以用 fine-grained PAT：到 <https://github.com/settings/tokens?type=beta> 生成，仓库范围选 `wensli-slides`，权限给 **Contents: Read and write**。第一次 push 时 Windows 弹窗输入用户名 `ghxhub` 和这个 token 即可。

---

## 二、日常更新流程

### 1. 修改内容

编辑 `slides.md`，或往 `public/training-videos/` 加新视频。

### 2. 本地预览（可选但建议）

```powershell
npm run slidev
```

打开 <http://127.0.0.1:3040> 确认改动。

### 3. 提交源码到 main 分支

```powershell
git add .
git commit -m "update: 改了什么"
git push
```

### 4. 一键部署到线上

```powershell
npm run deploy
```

这条命令会自动：

1. 跑 `slidev:build`，产物输出到 `slidev-dist/`
2. 把 `slidev-dist/` 内容推到远程 `gh-pages` 分支

GitHub 检测到分支变化后自动重新发布，访客刷新 <https://ghxhub.github.io/wensli-slides/> 就是新版本。**不需要去 GitHub 网页点任何按钮**。

---

## 三、关键配置说明

### `package.json` 的三个核心脚本

```json
{
  "scripts": {
    "slidev": "slidev slides.md --port 3040 --bind 127.0.0.1",
    "slidev:build": "slidev build slides.md --out slidev-dist --base /wensli-slides/",
    "deploy": "npm run slidev:build && gh-pages -d slidev-dist -b gh-pages -r https://github.com/ghxhub/wensli-slides.git"
  }
}
```

不能随意动的细节：

- `--base /wensli-slides/`：必须和仓库名一致，前后斜杠不能少
- `-b gh-pages`：部署目标分支，固定
- 远端 URL：用 HTTPS，凭据由 gh CLI / GCM 自动注入

### `components/AutoAdvanceVideo.vue` 的 base 处理

视频 `<AutoAdvanceVideo src="/training-videos/xxx.mp4" />` 是运行时字符串，Vite 构建期不会重写。组件里用 `import.meta.env.BASE_URL` 在客户端拼接前缀：

- dev：base = `/`
- 生产：base = `/wensli-slides/`

新增视频引用绝对路径 `/...` 时务必通过 `AutoAdvanceVideo`，不要直接写 `<video src="/...">`，否则部署后 404。

---

## 四、常见问题

### Q1：deploy 后页面白屏、控制台一堆 404

`--base` 配错了。检查 `package.json` 里 `slidev:build` 的 base 是否和仓库名完全一致。

### Q2：视频不播放、控制台报视频 404

绕开了 `AutoAdvanceVideo` 直接写 `<video src="/...">`。改用组件，或手动加 base 前缀。

### Q3：`npm run deploy` 报 403 Permission denied

GitHub 凭据问题：

- 没配认证 → 跑 `gh auth login`
- 用了 PAT 但权限不够 → token 必须有 `Contents: Read and write`
- 凭据缓存了旧 token → `git credential-manager erase`，下次重新输入

### Q4：刷新后还是旧内容

GitHub Pages 部署有 30 秒到 2 分钟延迟。`Ctrl + F5` 强刷绕过浏览器缓存。

### Q5：国内访问慢或偶尔失败

`github.io` 节点在海外，国内首次握手偶发超时，刷新即可。如果整组同事都在国内且对速度敏感，可考虑套 Cloudflare CDN 或迁到 Vercel。

---

## 五、下线 / 撤销分享

不想再公开这份幻灯片：

1. 打开 <https://github.com/ghxhub/wensli-slides/settings/pages>
2. **Source** 改成 **None** → Save

或把整个仓库改私有：Settings → General → Danger Zone → Change visibility。免费账号的私有仓库不能开公开 Pages，改私有后站点直接下线（Pro 账号支持私有仓库 + 公开 Pages）。

---

## 六、改仓库名 / 换账号

需要同步改三处：

1. `package.json` 里 `slidev:build` 的 `--base /<新仓库名>/`
2. `package.json` 里 `deploy` 的 `-r https://github.com/<新账号>/<新仓库名>.git`
3. `git remote set-url origin https://github.com/<新账号>/<新仓库名>.git`

改完跑一次 `npm run deploy` 验证。

---

## 七、文件清单速查

| 文件 / 目录 | 作用 |
|---|---|
| `slides.md` | 幻灯片内容主文件 |
| `components/AutoAdvanceVideo.vue` | 自动播放/暂停视频组件，已处理 base 前缀 |
| `public/training-videos/` | 视频资源目录 |
| `slidev-dist/` | 构建产物（已在 .gitignore） |
| `package.json` | 部署脚本配置 |
| `.gitignore` | 忽略 node_modules、产物、本地缓存 |
| `DEPLOY.md` | 本文件 |
