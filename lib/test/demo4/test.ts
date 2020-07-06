import { Banana } from "../../main/Banana";
import { rollup } from "rollup";
import { resolve } from "path";

const rollupResolve = require('rollup-plugin-node-resolve');
const testPath = resolve(__dirname, "../../../lib/test/demo4");

const b = new Banana(resolve(testPath, "template.tsx"));

/**
 * && 表达式中的<div></div>没有处理
 */
(async () => {
    await b.init();

    // const bundle = await rollup({
    //     input: resolve(testPath, ".cache/output.js"),
    //     plugins: [rollupResolve()],
    // });
    //
    // await bundle.write({
    //     file: resolve(testPath, ".cache/main.js"),
    //     format: 'iife',
    // });
})();
b.init().catch(err => {
    console.log('Banana.init.error: ', err);
});