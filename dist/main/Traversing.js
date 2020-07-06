"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var recast_1 = require("recast");
var recast = __importStar(require("recast"));
var DoubleStruct_1 = require("./DoubleStruct");
var _a = recast.types.builders, identifier = _a.identifier, conditionalExpression = _a.conditionalExpression, expression = _a.expression, callExpression = _a.callExpression, blockStatement = _a.blockStatement, arrowFunctionExpression = _a.arrowFunctionExpression, jsxAttribute = _a.jsxAttribute, jsxIdentifier = _a.jsxIdentifier, literal = _a.literal, JSXText = _a.JSXText, 
// 模板字符串
templateLiteral = _a.templateLiteral, 
// 模版字符串-字符串
templateElement = _a.templateElement, 
// 模版字符串-变量(表达式)
memberExpression = _a.memberExpression, jsxExpressionContainer = _a.jsxExpressionContainer, jsxMemberExpression = _a.jsxMemberExpression, jsxElement = _a.jsxElement, jsxOpeningElement = _a.jsxOpeningElement, jsxClosingElement = _a.jsxClosingElement, returnStatement = _a.returnStatement;
var T = recast.types.namedTypes;
var jsxAttrs = {
    className: 'class',
};
var Traversing = /** @class */ (function () {
    function Traversing(ast) {
        this.struct = new DoubleStruct_1.DoubleStructImpl();
        this.code = "`";
        this.iteraterFns = {
            "map": true,
        };
        console.log('Traversing.constructor');
        this.ast = ast;
    }
    Traversing.prototype.init = function () {
        this.visitAst(this.ast, this.struct);
        // const code = this.generateCode(this.struct);
        this.code += "`";
        return this.code;
    };
    Traversing.prototype.allowIterate = function (key) {
        return this.iteraterFns[key] === true;
    };
    Traversing.prototype.visitAst = function (ast, struct) {
        try {
            var _this_1 = this;
            recast.visit(ast, {
                visitJSXElement: function (path) {
                    var res = _this_1.resolveJSXElement(path);
                    if (res === false)
                        return false;
                    // %%%使用traverse可以遍历到所有节点%%%
                    this.traverse(path);
                    // %%%return false遍历一个就结束了%%%
                },
                visitJSXOpeningElement: function (path) {
                    var res = _this_1.resolveJSXOpeningElement(path, struct);
                    if (res === false)
                        return false;
                    // %%%使用traverse可以遍历到所有节点%%%
                    this.traverse(path);
                    // %%%return false遍历一个就结束了%%%
                    // return false;
                },
                visitJSXClosingElement: function (path) {
                    var res = _this_1.resolveJSXClosingElement(path, struct);
                    if (res === false)
                        return false;
                    // %%%使用traverse可以遍历到所有节点%%%
                    this.traverse(path);
                    // %%%return false遍历一个就结束了%%%
                    // return false;
                },
                visitJSXExpressionContainer: function (path) {
                    var res = _this_1.resolveJSXExpressionContainer(path, struct);
                    if (res === false)
                        return false;
                    this.traverse(path);
                },
                visitJSXAttribute: function (path) {
                    var res = _this_1.resolveJSXAttribute(path, struct);
                    if (res === false)
                        return false;
                    this.traverse(path);
                },
                visitJSXText: function (path) {
                    var res = _this_1.resolveJSXText(path, struct);
                    if (res === false)
                        return false;
                    this.traverse(path);
                },
                visitReturnStatement: function (path) {
                    var res = _this_1.resolveReturnStatement(path, struct);
                    if (res === false)
                        return false;
                    this.traverse(path);
                }
            });
        }
        catch (err) {
            console.log('Traversing.init: ', err);
        }
    };
    /**
     * 不能一下生成
     * @param struct
     */
    Traversing.prototype.generateCode = function (struct) {
        var res = "`";
        function fn(struct) {
            while (struct.queueSize()) {
                var node = struct.pollQueue();
                if (node instanceof DoubleStruct_1.DoubleStructImpl) {
                    fn(node);
                }
                else {
                    if (node.attr) { // 标签
                        var code = "<" + node.code + (node.attr.length ? ' ' + node.attr.join(' ') : '') + ">";
                        res += code;
                    }
                    else { // 子元素
                        res += node.code;
                    }
                }
            }
            while (struct.stackSize()) {
                var node = struct.popStack();
                res += "</" + node.code + ">";
            }
        }
        fn(struct);
        return res + '`';
    };
    Traversing.prototype.generateCode_1 = function (struct) {
        var res = "";
        /**
         *
         */
        while (struct.queueSize()) {
            var node = struct.pollQueue();
            if (!node || node.code === "template")
                continue;
            if (node.attr) { // 标签
                var code = "<" + node.code + (node.attr.length ? ' ' + node.attr.join(' ') : '') + ">";
                res += code;
            }
            else { // 子元素
                res += node.code;
            }
        }
        if (struct.stackSize()) {
            var node = struct.popStack();
            if (node.code !== "template") {
                res += "</" + node.code + ">";
            }
        }
        else {
            throw new Error('栈不应为空');
        }
        this.code += res;
    };
    Traversing.prototype.resolveJSXElement = function (_a) {
        var node = _a.node, parentPath = _a.parentPath;
        /**
         * 标签内容是否遍历结束
         */
        if (T.JSXElement.check(parentPath.node)) {
            console.log('indexof jsxelechildren: ', parentPath.node.children.indexOf(node), parentPath.node.children.length);
            var index = parentPath.node.children.indexOf(node);
            var len = parentPath.node.children.length;
            /**
             * 当前节点为父级最后的子节点
             */
            if (len - 1 === index) {
                this.generateCode_1(this.struct);
            }
        }
        if (T.JSXIdentifier.check(node.openingElement.name)) {
            console.log(node.openingElement.name.name);
        }
        else {
            console.log('');
        }
        return true;
    };
    Traversing.prototype.resolveJSXOpeningElement = function (_a, struct) {
        var node = _a.node, parentPath = _a.parentPath;
        if (T.JSXIdentifier.check(node.name)) {
            console.log("<" + node.name.name + ">");
            struct.offerQueue({
                code: node.name.name,
                attr: [],
            });
        }
        else {
            throw new Error('JSXOpeningElement is not himself');
        }
        return true;
    };
    Traversing.prototype.resolveJSXClosingElement = function (_a, struct) {
        var node = _a.node, parentPath = _a.parentPath;
        if (T.JSXIdentifier.check(node.name)) {
            console.log("</" + node.name.name + ">");
            struct.pushStack({
                code: node.name.name,
            });
        }
        else {
            throw new Error('JSXCloseingElement is not himself');
        }
        /**
         * 当前标签没有内容
         */
        if (!parentPath.node.children.length) {
            console.log('我是i标签');
            this.generateCode_1(this.struct);
        }
        return true;
    };
    Traversing.prototype.resolveJSXText = function (_a, struct) {
        var node = _a.node, parentPath = _a.parentPath;
        console.log('indexof jsxelechildren: ', parentPath.node.children.indexOf(node), parentPath.node.children.length);
        var code = recast_1.print(node).code;
        console.log('jsxtext:', code);
        if (/^\s+$/.test(code)) {
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
        var index = parentPath.node.children.indexOf(node);
        var len = parentPath.node.children.length;
        if (len - 1 === index) {
            this.generateCode_1(this.struct);
        }
        return true;
    };
    Traversing.prototype.resolveJSXExpressionContainer = function (_a, struct) {
        var node = _a.node, parentPath = _a.parentPath;
        if (T.JSXAttribute.check(parentPath.node)) {
            /**
             * 属性在resolveJSXAttribute中单独处理
             */
            return true;
        }
        console.log('eeeeeeeeeeeeeeeeeeexpression: ', node.expression);
        console.log('indexof jsxelechildren: ', parentPath.node.children.indexOf(node), parentPath.node.children.length);
        if (T.CallExpression.check(node.expression)) {
            var express = node.expression;
            console.log('jsx 调用表达式', node, recast_1.print(node).code);
            // map遍历必是成员表达式 成员表达式不一定使用map迭代
            if (T.MemberExpression.check(express.callee)) {
                var likeMap = express.arguments[0];
                if (T.FunctionExpression.check(likeMap)) {
                    var body = likeMap.body;
                    if (T.BlockStatement.check(body)) {
                        var len_1 = body.body.length;
                        var returnStatement_1 = body.body[len_1 - 1];
                        if (T.ReturnStatement.check(returnStatement_1)) {
                            var traver = new Traversing(returnStatement_1.argument);
                            var code = traver.init();
                            returnStatement_1.argument = identifier(code);
                            struct.offerQueue({
                                code: '${' + recast_1.print(express).code + '.join("")}',
                            });
                            console.log('inner code: ', recast_1.print(express).code);
                        }
                        else {
                            throw new Error("FunctionExpression BlockStatement的最后一条语句不为returnStatement");
                        }
                    }
                    else {
                        console.log(likeMap);
                        throw new Error("FunctionExpression的body不是BlockStatement");
                    }
                }
                else if (T.ArrowFunctionExpression.check(likeMap)) {
                    var body = likeMap.body;
                    if (T.JSXElement.check(body)) {
                        var traver = new Traversing(body);
                        var code = traver.init();
                        likeMap.body = identifier(code);
                        struct.offerQueue({
                            code: '${' + recast_1.print(express).code + '.join("")}',
                        });
                    }
                    else if (T.BlockStatement.check(body)) {
                        var len_2 = body.body.length;
                        var returnStatement_2 = body.body[len_2 - 1];
                        if (T.ReturnStatement.check(returnStatement_2)) {
                            var traver = new Traversing(returnStatement_2.argument);
                            var code = traver.init();
                            returnStatement_2.argument = identifier(code);
                            struct.offerQueue({
                                code: '${' + recast_1.print(express).code + '.join("")}',
                            });
                            console.log('inner code: ', recast_1.print(express).code);
                        }
                        else {
                            throw new Error("ArrowFunctionExpression BlockStatement的最后一条语句不为returnStatement");
                        }
                    }
                    else {
                        console.log(likeMap);
                        throw new Error("ArrowFunctionExpression body不是JSXElement, 也不是BlockStatement");
                    }
                }
                else {
                    throw new Error(likeMap + " is expected to be a function");
                }
            }
            else {
                struct.offerQueue({
                    code: '${' + recast_1.print(express).code + '}',
                });
            }
            /**
             * 内部不走了
             */
            // return false;
        }
        else if (T.LogicalExpression.check(node.expression) && T.JSXElement.check(node.expression.right)) { // && 逻辑表达式
            // todo 二元需要处理成假值返回 ""
            console.log('LogicalExpressionLogicalExpressionLogicalExpression');
            var express = node.expression;
            var traver = new Traversing(express.right);
            var code = traver.init();
            var newExp = conditionalExpression(express.left, identifier(code), identifier("''"));
            var expCod = recast_1.print(newExp).code;
            express.right = identifier(code);
            console.log('expCodexpCodexpCod: ', expCod);
            struct.offerQueue({
                code: "${" + expCod + "}",
            });
            // return false;
        }
        else {
            var code = recast_1.print(node).code.replace(/^{|}$/g, "");
            struct.offerQueue({
                code: "${" + code + "}",
            });
        }
        var index = parentPath.node.children.indexOf(node);
        var len = parentPath.node.children.length;
        if (len - 1 === index) {
            this.generateCode_1(this.struct);
        }
        return true;
    };
    Traversing.prototype.resolveJSXAttribute = function (_a, struct) {
        var node = _a.node, parentPath = _a.parentPath;
        var key = node.name.name;
        var valueNode = node.value;
        var code = "";
        if (T.JSXExpressionContainer.check(valueNode)) { // jsx表达式
            code = recast_1.prettyPrint(valueNode.expression).code;
            code = "${" + code + "}";
            // console.log(`${key}=\$\{${value}\}`);
        }
        else if (T.Literal.check(valueNode)) { // 普通字符串属性
            code = valueNode.value;
            code = '"' + code + '"';
        }
        else {
            throw new Error('jsxAttribute value is not JSXExpressionContainer or Literal');
        }
        var res = key + '=' + code;
        var tag = struct.getQueueCurrentElement();
        tag.attr.push(res);
        return true;
    };
    // 容易死循环
    Traversing.prototype.resolveReturnStatement = function (_a, struct) {
        var node = _a.node, parentPath = _a.parentPath;
        var jsxElementNode = node.argument;
        /**
         * 返回值必须是 jsx标签
         */
        if (!T.JSXElement.check(jsxElementNode)) {
            return true;
        }
        var traver = new Traversing(jsxElementNode);
        var code = traver.init();
        node.argument = identifier(code);
        return true;
    };
    Traversing.emptyStrReg = /^\f*$/;
    return Traversing;
}());
exports.Traversing = Traversing;
//# sourceMappingURL=Traversing.js.map