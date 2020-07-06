interface T {
    name: {
        key: string;
        value: string;
    };
    arr: Array<{
        title: string;
    }>;
    age: number;
    attr: string;
}

const flag = true;

export class Person {
    public static render = ({name, arr, age, attr}: T) => (
        <div class={attr} not-jsx="true">
            fuckyou
            <h1 fuck={flag ? 'selected' : ''}>{name.value}
                <span>{`i am ${age} years old, my name is ${name.key}.`}</span>fuckyoutoo
            </h1>
            <ul>
                {
                    arr.map(function ({ title }) {
                        const a = 1;
                        let foo = 10;
                        while (foo) {
                            foo --;
                        }

                        return (<li>{title} {a}</li>)
                    })
                }
            </ul>
        </div>
    );
}

function test1(url) {
    return url;
}

console.log(Person)
const html = Person.render({
    name: {
        key: "person",
        value: "lyh",
    },
    arr: [{title: "lyh"}, {title: "skx"}, {title: "dty"}],
    age: 18,
    attr: 'aishasha',
});

window.onload = () => {
    const div = document.createElement('div');
    console.log(div);
    div.innerHTML = html;
    const $body = document.getElementsByTagName('body')[0];
    console.log($body);
    $body.append(div);
}
