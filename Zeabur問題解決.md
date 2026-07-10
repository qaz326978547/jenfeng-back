{
"build": {
"root": "nodejs"
},
"services": {
"api": {
"build": {
"root": "nodejs"
}
}
}
}

这个配置的作用：

"root": "nodejs" 告诉 Zeabur 构建系统，应用的根目录是 nodejs 文件夹
这样 Zeabur 就会正确识别这是一个 Node.js 后端应用，而不是 SPA
它会使用 nodejs 目录中的 package.json 和 Dockerfile 来构建和运行应用
接下来的步骤：

将这个文件添加到你的 Git 仓库根目录 (https://github.com/qaz326978547/jenfeng-back)

文件名：zeabur.json
位置：仓库根目录（与 nodejs 文件夹同级）
提交并推送到 nodejs-prod 分支
