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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var fs_2 = __importDefault(require("fs"));
var acorn_jsx_1 = __importDefault(require("acorn-jsx"));
var acorn_1 = require("acorn");
var typescript_1 = require("typescript");
var path_1 = require("path");
var CodeFactory_1 = require("./CodeFactory");
var projectPath = path_1.resolve(__dirname, '..');
var Banana = /** @class */ (function () {
    function Banana(path) {
        this.factory = null;
        this.templatePath = path;
        this.cache_path = path_1.resolve(this.templatePath, "../.cache/");
        this.template_jsx_path = path_1.resolve(this.cache_path, "./my-template.jsx");
    }
    Banana.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var source, jsx, code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_1.promises.readFile(this.templatePath)];
                    case 1:
                        source = _a.sent();
                        this.sourceFile = source.toString();
                        return [4 /*yield*/, this.transformTsxToJsx()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, fs_1.promises.readFile(this.template_jsx_path)];
                    case 3:
                        jsx = _a.sent();
                        // 生成ast
                        this.AST_TSX = Banana.Parser.parse(jsx.toString(), {
                            sourceType: "module",
                        });
                        // todo { 方便查看 后续需要rm }
                        return [4 /*yield*/, fs_1.promises.writeFile(path_1.resolve(this.cache_path, "./ast_data.json"), JSON.stringify(this.AST_TSX))];
                    case 4:
                        // todo { 方便查看 后续需要rm }
                        _a.sent();
                        this.factory = new CodeFactory_1.CodeFactory(this.AST_TSX);
                        code = this.factory.init();
                        fs_2.default.writeFileSync(path_1.resolve(this.cache_path, "./output.js"), code);
                        return [2 /*return*/];
                }
            });
        });
    };
    // tsx => jsx
    Banana.prototype.transformTsxToJsx = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, typescript_1.transpileModule(this.sourceFile, {
                                compilerOptions: {
                                    target: typescript_1.ScriptTarget.ESNext,
                                    jsx: typescript_1.JsxEmit.Preserve,
                                }
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, fs_1.promises.mkdir(this.cache_path).catch(function (err) { return err; })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, fs_1.promises.writeFile(this.template_jsx_path, res.outputText)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.log('Banana.transformTsxToJsx.error: ', err_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Banana.Parser = acorn_1.Parser.extend(acorn_jsx_1.default());
    return Banana;
}());
exports.Banana = Banana;
//# sourceMappingURL=Banana.js.map