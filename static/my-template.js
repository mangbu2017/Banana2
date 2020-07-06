const flag = true;
const other = React.createElement(
    "p",
    { style: flag ? "checked" : "" },
    React.createElement(
        "strong",
        null,
        "otherName"
    )
);
export class Person {}
Person.render = ({ name, arr, age, attr }) => React.createElement(
    "div",
    { "class": attr, "not-jsx": "true" },
    "fuckyou",
    React.createElement(
        "h1",
        { fuck: flag ? 'selected' : '' },
        name.value,
        React.createElement(
            "span",
            null,
            `i am ${age} years old, my name is ${name.key}.`
        ),
        "fuckyoutoo"
    ),
    React.createElement(
        "ul",
        null,
        arr.map(function ({ title }) {
            const a = 1;
            return React.createElement(
                "li",
                null,
                title,
                " ",
                a
            );
        })
    )
);
function test1(url) {
    return url;
}
// arr.map(({ title }) => {
//     const a = 1;
//     return (<li>{title} {a}</li>)
// })