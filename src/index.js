"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var babel = require("@babel/core");
var bluebird = require("bluebird");
var translate = require("@vitalets/google-translate-api");
var glob = require("glob");
var generator_1 = require("@babel/generator");
// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
// 判断是否为对象
var isObject = function (obj) { return typeof obj === 'object' && obj !== null; };
// 深度搜索遍历 AST
var dfs = function (obj) { return __awaiter(void 0, void 0, void 0, function () {
    var keys, i, args, i, data;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (!isObject(obj))
                    return [2 /*return*/];
                keys = Object.keys(obj);
                i = 0;
                _f.label = 1;
            case 1:
                if (!(i < keys.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, dfs(obj[keys[i]])];
            case 2:
                _f.sent();
                _f.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4:
                if (obj.type !== 'CallExpression' || ((_a = obj.callee) === null || _a === void 0 ? void 0 : _a.type) !== 'MemberExpression' || ((_c = (_b = obj.callee) === null || _b === void 0 ? void 0 : _b.object) === null || _c === void 0 ? void 0 : _c.type) !== 'Identifier' || ((_e = (_d = obj.callee) === null || _d === void 0 ? void 0 : _d.object) === null || _e === void 0 ? void 0 : _e.name) !== 'React' || !Array.isArray(obj.arguments))
                    return [2 /*return*/];
                args = Array.prototype.slice.call(obj.arguments, 2);
                if (!args || args.length === 0)
                    return [2 /*return*/];
                i = 2;
                _f.label = 5;
            case 5:
                if (!(i < obj.arguments.length)) return [3 /*break*/, 8];
                if (!isObject(obj.arguments[i]))
                    return [3 /*break*/, 7];
                if (!(obj.arguments[i].type === 'StringLiteral')) return [3 /*break*/, 7];
                return [4 /*yield*/, translate(obj.arguments[i].value, { from: process.env.FROM, to: process.env.TO })];
            case 6:
                data = _f.sent();
                obj.arguments[i].value = encodeURIComponent(data.text);
                _f.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 5];
            case 8: return [2 /*return*/];
        }
    });
}); };
// 将 @vitalets/google-translate-api promisify 化，免去回调地狱处理
bluebird.promisifyAll(translate);
// 输出目录路径
var outputPath = path.join(__dirname, '../', 'output');
// 输出目录
if (!fs.existsSync(outputPath))
    fs.mkdirSync(outputPath);
// 遍历目标文件
glob("example/*.tsx", { root: path.join(__dirname, '../') }, function (err, files) { return __awaiter(void 0, void 0, void 0, function () {
    var fileIndex, filePath, source, ast, code, name_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (err)
                    return [2 /*return*/];
                fileIndex = 0;
                _a.label = 1;
            case 1:
                if (!(fileIndex < files.length)) return [3 /*break*/, 4];
                filePath = path.join(__dirname, '../', files[fileIndex]);
                source = fs.readFileSync(filePath, 'utf-8');
                ast = babel.transformSync(source, {
                    filename: filePath,
                    ast: true,
                    presets: [
                        '@babel/preset-typescript',
                        '@babel/preset-react'
                    ]
                }).ast;
                // 深度搜索遍历 AST，做翻译替换
                return [4 /*yield*/, dfs(ast)
                    // 将 AST 转化为 JS 代码
                ];
            case 2:
                // 深度搜索遍历 AST，做翻译替换
                _a.sent();
                code = generator_1["default"](ast, { retainLines: true, jsescOption: { wrap: true } }).code;
                name_1 = path.parse(filePath).name;
                fs.writeFileSync(path.join(outputPath, name_1 + "." + process.env.TO + ".js"), decodeURIComponent(code), 'utf8');
                _a.label = 3;
            case 3:
                fileIndex++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); });
