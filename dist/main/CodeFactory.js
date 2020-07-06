"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var recast = __importStar(require("recast"));
var Traversing_1 = require("./Traversing");
var T = recast.types.namedTypes;
var _a = recast.types.builders, literal = _a.literal, identifier = _a.identifier;
var CodeFactory = /** @class */ (function () {
    function CodeFactory(htmlAst) {
        this.jsx_html_ast = htmlAst;
    }
    /**
     * 查找是根节点是的jsx元素
     */
    CodeFactory.prototype.init = function () {
        recast.visit(this.jsx_html_ast, {
            visitJSXElement: function (path) {
                var node = path.node, parentNode = path.parentPath.node;
                /**
                 *
                 * ReturnStatement
                 * JSXElement
                 * ArrowFunctionExpression
                 */
                if (!T.JSXElement.check(parentNode)) { // 父级不是jsxele的
                    // @ts-ignore
                    console.log('tagname: ', node.openingElement.name.name);
                    var tracer = new Traversing_1.Traversing(node);
                    var code = tracer.init();
                    // console.log('code: ', code, parentNode, node);
                    if (T.VariableDeclarator.check(parentNode)) { // const
                        parentNode.init = identifier(code);
                    }
                    else if (T.ArrowFunctionExpression.check(parentNode)) {
                        parentNode.body = identifier(code);
                    }
                    else if (T.ReturnStatement.check(parentNode)) {
                        parentNode.argument = identifier(code);
                    }
                }
                this.traverse(path);
            },
        });
        return recast.print(this.jsx_html_ast).code;
    };
    return CodeFactory;
}());
exports.CodeFactory = CodeFactory;
//# sourceMappingURL=CodeFactory.js.map