# 关键词检索器

网页端原型采用第三版界面风格，支持文件拖拽、关键词词库添加/修改/删除和扫描结果展示。

## Windows 桌面版（推荐）

最终使用者不需要执行构建。将此工程推送到 GitHub 后，在 **Actions → Build offline Windows installer → Run workflow** 运行云端 Windows 构建；完成后下载产物 `keyword-scanner-offline-windows-installer`，通过 U 盘复制到离线电脑。

如果需要在自有联网 Windows 构建机上直接构建，可在工程目录运行：

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\build-windows.ps1
```

完成后，`release` 文件夹内会生成完整离线 Windows 安装包。安装一次后，每位用户可通过桌面“关键词检索器”图标直接启动；应用会在本机自动启动扫描引擎，文件不会上传至云端，也不会在首次 OCR 时下载模型。

GitHub 云构建会自动提供 Windows、Python 与 Node.js。首次构建会下载并封装 Electron、OCR 中文模型与文档解析组件，因此安装包体积较大；生成后的安装包可复制到完全离线的 Windows 电脑上使用。

## 开发预览

```bash
npm run dev
```

## 文档扫描后端

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app:app --reload --port 8000
```

后端使用 Docling 与 RapidOCR（PP-OCR）在本地提取 DOC/DOCX、XLS/XLSX、PPT/PPTX、TXT、PDF 等文本；扫描 PDF 时启用简体中文 OCR。ZIP 会在临时目录安全解压后递归扫描。
