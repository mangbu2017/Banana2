"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flag = true;
var Person = /** @class */ (function () {
    function Person() {
    }
    Person.render = function (_a) {
        var name = _a.name, arr = _a.arr, age = _a.age, attr = _a.attr;
        return (<div class={attr} not-jsx="true">
            fuckyou
            <h1 fuck={flag ? 'selected' : ''}>{name.value}
                <span>{"i am " + age + " years old, my name is " + name.key + "."}</span>fuckyoutoo
            </h1>
            <ul>
                {arr.map(function (_a) {
            var title = _a.title;
            var a = 1;
            var foo = 10;
            while (foo) {
                foo--;
            }
            return (<li>{title} {a}</li>);
        })}
            </ul>
        </div>);
    };
    return Person;
}());
exports.Person = Person;
function test1(url) {
    return url;
}
console.log(Person);
var html = Person.render({
    name: {
        key: "person",
        value: "lyh",
    },
    arr: [{ title: "lyh" }, { title: "skx" }, { title: "dty" }],
    age: 18,
    attr: 'aishasha',
});
window.onload = function () {
    var div = document.createElement('div');
    console.log(div);
    div.innerHTML = html;
    var $body = document.getElementsByTagName('body')[0];
    console.log($body);
    $body.append(div);
};
//# sourceMappingURL=template.jsx.map