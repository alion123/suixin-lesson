# 随心听课 · 学习通网页版播放助手

**明确适用于学习通（超星）网页版课程播放器。** 本仓库包含浏览器插件、Windows 安装助手源码，以及可直接部署到 Cloudflare 的介绍和下载网站。

鼠标移出页面时继续正常播放，保留手动暂停。当前版本 0.2.0，面向 Windows 上的 Tabbit、Microsoft Edge 和 Google Chrome。不是学习通桌面客户端或手机插件，与学习通/超星无隶属关系。

## Cloudflare Pages：连接 GitHub 部署（推荐）

在 Cloudflare 的 **Workers & Pages → 创建应用 → Pages → 连接 Git** 中选择此仓库。

| 设置项 | 填写值 |
| --- | --- |
| 生产分支 | `main` |
| Framework preset / 框架预设 | `None` |
| Root directory / 根目录 | 留空（仓库根目录） |
| Build command / 构建命令 | `npm run build` |
| Build output directory / 输出目录 | `dist` |
| 环境变量 / 密钥 | 不需要 |

保存并部署后，使用 Cloudflare 返回的 `https://你的项目.pages.dev` 地址访问。此网站无需 ChatGPT 登录；是否额外开启 Cloudflare Access 由你自己的 Cloudflare 设置决定。以后推送代码会触发 Git 集成部署。

此项目没有框架依赖，`npm run build` 只检查文件完整性。也可按 [Cloudflare 静态 HTML 文档](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/) 将构建命令设为 `exit 0`，输出目录仍为 `dist`。

### 直接上传，不连接 Git

打开 **Pages → 使用直接上传创建项目**，上传 `dist` 文件夹的内容。注意：站点根层级要有 `index.html`，不要上传整个源码仓库。

也可以在本地登录后执行：

```sh
npx wrangler login
npm run deploy:pages
```

### 如果使用 Workers 静态资源

本仓库另外提供 `wrangler.workers.jsonc`：

```sh
npx wrangler login
npm run deploy:workers
```

在 Workers 的 Git 构建界面中，构建命令设 `npm run build`，部署命令设 `npx wrangler deploy --config wrangler.workers.jsonc`。请勿在 Workers 中把 Pages 命令当作默认部署命令。

## 插件安装：3步搞定

1. 从网站下载 Windows 安装助手，打开后选择浏览器，点“准备文件并打开安装页”。
2. 在扩展管理页打开“开发者模式”，点“加载未打包的扩展程序”。
3. 在文件夹框粘贴助手复制的路径并确认，刷新学习通课程页，手动播放。

也可直接加载仓库的 `extension` 文件夹。页面右上角出现 **“随心听课：开”** 即已运行。

已有旧版：覆盖原扩展目录，重新加载原扩展，再刷新课程页面。不要同时加载两份。

## 目录

```text
dist/                         Cloudflare 网站（含下载文件）
extension/                    浏览器扩展源码
installer/InstallAssistant.cs Windows 安装助手源码
scripts/verify.mjs            部署前检查
wrangler.toml                 Pages 配置
wrangler.workers.jsonc        Workers 静态资源配置
```

## 行为边界

插件针对已实测播放器的页面离开 `mouseout` 事件；不修改系统光标、不覆盖媒体暂停方法、不伪造焦点或学习进度。手动暂停、课程交互和网络中断照常处理。不保证最小化、休眠或切换标签后仍能播放；学校配置或播放器更新可能需要重新适配。

插件仅使用本地开关存储和学习通页面脚本权限，没有账号密码读取、网络上传或远程代码。网站为静态文件，不需要服务器、数据库或 API 密钥。

## 检查及本地预览

```sh
npm run check
python -m http.server 8080 --directory dist
```
