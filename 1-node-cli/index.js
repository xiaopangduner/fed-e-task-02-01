#!/usr/bin/env node
// 入口标识

const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const ejs = require('ejs')

// 命令行交互获取项目名称
inquirer.prompt([{
  type: 'input',
  name: 'name',
  question: 'project name'
}]).then(res => {
  // 模板目录
  const tmpDir = path.join(__dirname, 'templates')
  // 目标目录
  const targetDir = process.cwd()

  // 读取模板目录中的文件
  fs.readdir(tmpDir, (err, files) => {
    if (err) { throw err }
    files.forEach(file => {
      // 在模板目录中的模板文件中的<%= name %>中插入用户输入的名称
      ejs.renderFile(path.join(tmpDir, file), res, (err, result) => {
        if (err) { throw err }
        // 将渲染完成的内容写入到目标目录的文件中
        fs.writeFileSync(path.join(targetDir, file), result)
      })
    })
  })
})

