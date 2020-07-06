import {PathLike, promises as fsPromise} from "fs";
import fs from "fs";
import acornJsx from "acorn-jsx";
import {Parser} from "acorn";
import {ScriptTarget, transpileModule, JsxEmit } from "typescript";
import {resolve} from "path";
import { CodeFactory } from "./CodeFactory";

const projectPath = resolve(__dirname, '..');

export class Banana {
    path: PathLike;
    AST_TSX: any;
    // tsx文件源码
    sourceFile: string;
    // tsx文件位置
    private readonly templatePath: string;
    // 缓存文件夹位置
    private readonly cache_path: string;
    private readonly template_jsx_path: string;
    private factory: CodeFactory = null;


    static Parser: any = Parser.extend(acornJsx());

    public constructor(path: string) {
        this.templatePath = path;
        this.cache_path = resolve(this.templatePath, "../.cache/");
        this.template_jsx_path = resolve(this.cache_path, "./my-template.jsx");
    }

    public async init() {
        const source:Buffer = await fsPromise.readFile(this.templatePath);
        this.sourceFile = source.toString();

        await this.transformTsxToJsx();

        const jsx = await fsPromise.readFile(this.template_jsx_path);

        // 生成ast
        this.AST_TSX = Banana.Parser.parse(jsx.toString(), {
            sourceType: "module",
        });

        // todo { 方便查看 后续需要rm }
        await fsPromise.writeFile(resolve(this.cache_path, "./ast_data.json"), JSON.stringify(this.AST_TSX));

        this.factory = new CodeFactory(this.AST_TSX);

        const code = this.factory.init();

        fs.writeFileSync(resolve(this.cache_path, "./output.js"), code);
    }

    // tsx => jsx
    private async transformTsxToJsx() {
        try {
            const res = await transpileModule(this.sourceFile, {
                compilerOptions: {
                    target: ScriptTarget.ESNext,
                    jsx: JsxEmit.Preserve,
                }
            });

            await fsPromise.mkdir(this.cache_path).catch(err => err);

            await fsPromise.writeFile(this.template_jsx_path, res.outputText);

        }catch(err) {
            console.log('Banana.transformTsxToJsx.error: ', err);
        }
    }
}