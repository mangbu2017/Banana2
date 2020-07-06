import * as recast from "recast";
import { Traversing } from "./Traversing";
const T = recast.types.namedTypes;

const {
    literal,
    identifier,
} = recast.types.builders;


export class CodeFactory {
    private readonly jsx_html_ast: any;
    constructor(htmlAst: any) {
        this.jsx_html_ast = htmlAst;
    }

    /**
     * 查找是根节点是的jsx元素
     */
    public init() {
        recast.visit(this.jsx_html_ast, {
            visitJSXElement(path) {
                const { node, parentPath: { node: parentNode } } = path;
                /**
                 *
                 * ReturnStatement
                 * JSXElement
                 * ArrowFunctionExpression
                 */
                if(!T.JSXElement.check(parentNode)) { // 父级不是jsxele的
                    // @ts-ignore
                    console.log('tagname: ', node.openingElement.name.name);

                    const tracer = new Traversing(node);
                    const code = tracer.init();
                    // console.log('code: ', code, parentNode, node);

                    if(T.VariableDeclarator.check(parentNode)) { // const
                        parentNode.init = identifier(code);
                    }else if(T.ArrowFunctionExpression.check(parentNode)) {
                        parentNode.body = identifier(code);
                    }else if(T.ReturnStatement.check(parentNode)) {
                        parentNode.argument = identifier(code);
                    }
                }

                this.traverse(path);
            },
        });

        return recast.print(this.jsx_html_ast).code;
    }
}