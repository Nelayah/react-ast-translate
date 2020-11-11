import * as fs from 'fs';
import * as path from 'path';
import * as babel from "@babel/core";
import * as bluebird from "bluebird";
import * as translate from '@vitalets/google-translate-api';
import * as glob from 'glob';
import generate from "@babel/generator";

// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
// 判断是否为对象
const isObject = obj => typeof obj === 'object' && obj !== null;

// 深度搜索遍历 AST
const dfs = async obj => {
  if (!isObject(obj)) return;

  const keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    await dfs(obj[keys[i]]);
  }

  if (obj.type !== 'CallExpression' || obj.callee?.type !== 'MemberExpression' || obj.callee?.object?.type !== 'Identifier' || obj.callee?.object?.name !== 'React' || !Array.isArray(obj.arguments)) return;

  const args = Array.prototype.slice.call(obj.arguments, 2);

  if (!args || args.length  === 0) return;

  for (let i = 2; i < obj.arguments.length; i++) {
    if (!isObject(obj.arguments[i])) continue;
    if (obj.arguments[i].type === 'StringLiteral') {
      const data = await translate(obj.arguments[i].value, {from: process.env.FROM, to: process.env.TO});
      obj.arguments[i].value = encodeURIComponent(data.text);
    }
  }
}

// 将 @vitalets/google-translate-api promisify 化，免去回调地狱处理
bluebird.promisifyAll(translate);

// 输出目录路径
const outputPath = path.join(__dirname, '../', 'output');

// 输出目录
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);

// 遍历目标文件
glob("example/*.tsx", {root: path.join(__dirname, '../')}, async (err, files) => {
  if (err) return;
  for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
    const filePath = path.join(__dirname, '../', files[fileIndex]);
    const source = fs.readFileSync(filePath, 'utf-8');

    // 将 JS 代码代码转化为 AST
    const {ast} = babel.transformSync(source, {
      filename: filePath,
      ast: true,
      presets: [
        '@babel/preset-typescript',
        '@babel/preset-react'
      ] 
    });

    // 深度搜索遍历 AST，做翻译替换
    await dfs(ast)
    
    // 将 AST 转化为 JS 代码
    const {code} = generate(ast, { retainLines: true, jsescOption: {wrap: true} });
    const {name} = path.parse(filePath);
    fs.writeFileSync(path.join(outputPath, `${name}.${process.env.TO}.js`), decodeURIComponent(code), 'utf8');
  }
});