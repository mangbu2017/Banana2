import { print, prettyPrint } from "recast";
import * as recast from "recast";
import {
    namedTypes,
} from "ast-types";
import {
    NodePath,
} from "../../node_modules/ast-types/lib/node-path";
import {DoubleStruct, DoubleStructImpl} from "./DoubleStruct";

const {
    identifier,
    conditionalExpression,
    expression,
    callExpression,
    blockStatement,
    arrowFunctionExpression,
    jsxAttribute,
    jsxIdentifier,
    literal,
    JSXText,
    // 模板字符串
    templateLiteral,
    // 模版字符串-字符串
    templateElement,
    // 模版字符串-变量(表达式)
    memberExpression,
    jsxExpressionContainer,
    jsxMemberExpression,
    jsxElement,
    jsxOpeningElement,
    jsxClosingElement,
    returnStatement,
} = recast.types.builders;
const T = recast.types.namedTypes;

const jsxAttrs = {
    className: 'class',
};

interface TagInfo {
    path: namedTypes.JSXElement;
    code: {
        open: string;
        close: string;
    };
    children?: Array<TagInfo | namedTypes.Expression> | any;
}

interface BE {
    code: string;
    attr?: Array<string>;
}

type BElement = BE | DoubleStruct<BElement>;

export class Traversing {
    private readonly ast: any;
    private struct = new DoubleStructImpl<BE>();
    private code = "`";
    private readonly iteraterFns = {
        "map": true,
    };

    private static readonly emptyStrReg: RegExp = /^\f*$/;

    constructor(ast: any) {
        console.log('Traversing.constructor');
        this.ast = ast;
    }

    public init(): string {
        this.visitAst(this.ast,  this.struct);
        // const code = this.generateCode(this.struct);

        this.code += "`";

        return this.code;
    }

    private allowIterate(key: string) {
        return this.iteraterFns[key] === true;
    }

    private visitAst(ast: any, struct: DoubleStruct<BElement>) {
        try {
            const _this = this;

            recast.visit(ast, {
                visitJSXElement(path) {
                    const res = _this.resolveJSXElement(path);

                    if(res === false)
                        return false;

                    // %%%使用traverse可以遍历到所有节点%%%
                    this.traverse(path);
                    // %%%return false遍历一个就结束了%%%
                },
                visitJSXOpeningElement(path) {

                    const res = _this.resolveJSXOpeningElement(path, struct);

                    if(res === false)
                        return false;
                    // %%%使用traverse可以遍历到所有节点%%%
                    this.traverse(path);
                    // %%%return false遍历一个就结束了%%%
                    // return false;
                },
                visitJSXClosingElement(path) {
                    const res = _this.resolveJSXClosingElement(path, struct);

                    if(res === false)
                        return false;
                    // %%%使用traverse可以遍历到所有节点%%%
                    this.traverse(path);
                    // %%%return false遍历一个就结束了%%%
                    // return false;
                },
                visitJSXExpressionContainer(path: NodePath<namedTypes.JSXExpressionContainer>) {
                    const res = _this.resolveJSXExpressionContainer(path, struct);

                    if(res === false)
                        return false;

                    this.traverse(path);
                },
                visitJSXAttribute(path: NodePath<namedTypes.JSXAttribute>) {
                    const res = _this.resolveJSXAttribute(path, struct);

                    if(res === false)
                        return false;

                    this.traverse(path);
                },
                visitJSXText(path: NodePath<namedTypes.JSXText>) {
                    const res = _this.resolveJSXText(path, struct);

                    if(res === false)
                        return false;

                    this.traverse(path);
                },
                visitReturnStatement(path: NodePath<namedTypes.ReturnStatement>) {
                    const res = _this.resolveReturnStatement(path, struct);

                    if(res === false)
                        return false;

                    this.traverse(path);
                }
            });

        }catch(err) {
            console.log('Traversing.init: ', err);
        }
    }

    /**
     * 不能一下生成
     * @param struct
     */
    private generateCode(struct: DoubleStruct<BE>): string {
        let res = "`";

        function fn(struct: DoubleStruct<BE>) {
            while(struct.queueSize()) {
                const node = struct.pollQueue();

                if(node instanceof DoubleStructImpl) {
                    fn(node);
                }else {
                    if(node.attr) {// 标签
                        const code = `<${node.code}${ node.attr.length ? ' ' + node.attr.join(' ') : ''}>`;
                        res += code;
                    }else {// 子元素
                        res += node.code;
                    }
                }
            }

            while(struct.stackSize()) {
                const node = struct.popStack();

                res += `</${node.code}>`;
            }
        }

        fn(struct);

        return res + '`';
    }

    private generateCode_1(struct: DoubleStruct<BE>): void {
        let res = "";
        /**
         *
         */
        while(struct.queueSize()) {
            const node = struct.pollQueue();

            if(!node || node.code === "template")
                continue;

            if(node.attr) {// 标签
                const code = `<${node.code}${ node.attr.length ? ' ' + node.attr.join(' ') : ''}>`;
                res += code;
            }else {// 子元素
                res += node.code;
            }
        }

        if(struct.stackSize()) {
            const node = struct.popStack();
            if(node.code !== "template") {
                res += `</${node.code}>`;
            }
        }else {
            throw new Error('栈不应为空');
        }

        this.code += res;
    }


    private resolveJSXElement({ node, parentPath }: NodePath<namedTypes.JSXElement>): boolean {
        /**
         * 标签内容是否遍历结束
         */
        if(T.JSXElement.check(parentPath.node)) {
            console.log('indexof jsxelechildren: ', parentPath.node.children.indexOf(node), parentPath.node.children.length);

            const index = parentPath.node.children.indexOf(node);
            const len = parentPath.node.children.length;

            /**
             * 当前节点为父级最后的子节点
             */
            if(len - 1 === index) {
                this.generateCode_1(this.struct);
            }
        }

        if(T.JSXIdentifier.check(node.openingElement.name)) {
            console.log(node.openingElement.name.name);
        }else {
            console.log('')
        }

        return true;
    }

    private resolveJSXOpeningElement({ node, parentPath }: NodePath<namedTypes.JSXOpeningElement>, struct: DoubleStruct<BElement>): boolean {

        if(T.JSXIdentifier.check(node.name)) {
            console.log(`<${node.name.name}>`);
            struct.offerQueue({
                code: node.name.name,
                attr: [],
            });
        }else {
            throw new Error('JSXOpeningElement is not himself');
        }
        return true;
    }

    private resolveJSXClosingElement({ node, parentPath }: NodePath<namedTypes.JSXClosingElement>, struct: DoubleStruct<BElement>): boolean {
        if(T.JSXIdentifier.check(node.name)) {
            console.log(`</${node.name.name}>`);
            struct.pushStack({
                code: node.name.name,
            });
        }else {
            throw new Error('JSXCloseingElement is not himself');
        }

        /**
         * 当前标签没有内容
         */
        if(!parentPath.node.children.length) {
            console.log('我是i标签');
            this.generateCode_1(this.struct);
        }

        return true;
    }

    private resolveJSXText({ node, parentPath }: NodePath<namedTypes.JSXText>, struct: DoubleStruct<BElement>): boolean {
        console.log('indexof jsxelechildren: ', parentPath.node.children.indexOf(node), parentPath.node.children.length);
        const code = print(node).code;
        console.log('jsxtext:', code);

        if(/^\s+$/.test(code)) {
            /**
             * 占位用
             */
            struct.offerQueue(null);
        }

        struct.offerQueue({
            code: code.trim(),
        });

        /**
         * 放在处理逻辑后面
         */
        const index = parentPath.node.children.indexOf(node);
        const len = parentPath.node.children.length;
        if(len - 1 === index) {
            this.generateCode_1(this.struct);
        }

        return true;
    }

    private resolveJSXExpressionContainer({ node, parentPath }: NodePath<namedTypes.JSXExpressionContainer>, struct: DoubleStruct<BElement>): boolean {
        if(T.JSXAttribute.check(parentPath.node)) {
            /**
             * 属性在resolveJSXAttribute中单独处理
             */
            return true;
        }

        console.log('eeeeeeeeeeeeeeeeeeexpression: ', node.expression);
        console.log('indexof jsxelechildren: ', parentPath.node.children.indexOf(node), parentPath.node.children.length);


        if(T.CallExpression.check(node.expression)) {
            const express = node.expression;
            console.log('jsx 调用表达式', node, print(node).code);

            // map遍历必是成员表达式 成员表达式不一定使用map迭代
            if(T.MemberExpression.check(express.callee)) {
                const likeMap = express.arguments[0];
                if(T.FunctionExpression.check(likeMap)) {
                    const body = likeMap.body;
                    if(T.BlockStatement.check(body)) {
                        const len = body.body.length;
                        const returnStatement = body.body[len - 1];

                        if(T.ReturnStatement.check(returnStatement)) {
                            const traver = new Traversing(returnStatement.argument);
                            const code = traver.init();

                            returnStatement.argument = identifier(code);

                            struct.offerQueue({
                                code: '${' + print(express).code + '.join("")}',
                            });

                            console.log('inner code: ', print(express).code);
                        }else {
                            throw new Error("FunctionExpression BlockStatement的最后一条语句不为returnStatement");
                        }
                    }else {
                        console.log(likeMap);
                        throw new Error("FunctionExpression的body不是BlockStatement");
                    }
                }else if(T.ArrowFunctionExpression.check(likeMap)) {
                    const body = likeMap.body;

                    if(T.JSXElement.check(body)) {

                        const traver = new Traversing(body);
                        const code = traver.init();
                        likeMap.body = identifier(code);

                        struct.offerQueue({
                            code: '${' + print(express).code + '.join("")}',
                        });
                    }else if(T.BlockStatement.check(body)) {
                        const len = body.body.length;
                        const returnStatement = body.body[len - 1];

                        if(T.ReturnStatement.check(returnStatement)) {
                            const traver = new Traversing(returnStatement.argument);
                            const code = traver.init();

                            returnStatement.argument = identifier(code);

                            struct.offerQueue({
                                code: '${' + print(express).code + '.join("")}',
                            });

                            console.log('inner code: ', print(express).code);
                        }else {
                            throw new Error("ArrowFunctionExpression BlockStatement的最后一条语句不为returnStatement");
                        }
                    }else {
                        console.log(likeMap);
                        throw new Error("ArrowFunctionExpression body不是JSXElement, 也不是BlockStatement");
                    }
                }else {
                    throw new Error(`${likeMap} is expected to be a function`);
                }
            }else {
                struct.offerQueue({
                    code: '${' + print(express).code + '}',
                });
            }

            /**
             * 内部不走了
             */
            // return false;
        }else if(T.LogicalExpression.check(node.expression) && T.JSXElement.check(node.expression.right)) { // && 逻辑表达式
            // todo 二元需要处理成假值返回 ""
            console.log('LogicalExpressionLogicalExpressionLogicalExpression');
            const express = node.expression;
            const traver = new Traversing(express.right);
            const code = traver.init();

            const newExp = conditionalExpression(express.left, identifier(code), identifier("''"));
            const expCod = print(newExp).code;
            express.right = identifier(code);

            console.log('expCodexpCodexpCod: ', expCod);

            struct.offerQueue({
                code: `$\{${expCod}}`,
            });

            // return false;
        }else {
            const code = print(node).code.replace(/^{|}$/g, "");

            struct.offerQueue({
                code: `$\{${code}}`,
            });
        }

        const index = parentPath.node.children.indexOf(node);
        const len = parentPath.node.children.length;
        if(len - 1 === index) {
            this.generateCode_1(this.struct);
        }
        return true;
    }

    private resolveJSXAttribute({ node, parentPath }: NodePath<namedTypes.JSXAttribute>, struct: DoubleStruct<BElement>): boolean {
        const key = node.name.name;
        const valueNode = node.value;
        let code = "";

        if(T.JSXExpressionContainer.check(valueNode)) { // jsx表达式
            code = prettyPrint(valueNode.expression).code;
            code = `\$\{${code}\}`;
            // console.log(`${key}=\$\{${value}\}`);
        }else if(T.Literal.check(valueNode)) { // 普通字符串属性
            code = valueNode.value as string;
            code = '"' + code + '"';
        }else {
            throw new Error('jsxAttribute value is not JSXExpressionContainer or Literal');
        }

        const res = key + '=' + code;

        const tag = struct.getQueueCurrentElement() as BE;

        tag.attr.push(res);

        return true;
    }

    // 容易死循环
    private resolveReturnStatement({ node, parentPath }: NodePath<namedTypes.ReturnStatement>, struct: DoubleStruct<BElement>): boolean {
        const jsxElementNode = node.argument;

        /**
         * 返回值必须是 jsx标签
         */
        if(!T.JSXElement.check(jsxElementNode)) {
            return true;
        }

        const traver = new Traversing(jsxElementNode);
        const code = traver.init();

        node.argument = identifier(code);

        return true;
    }
}