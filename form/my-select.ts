class MyOption extends HTMLElement {
    template = `<div class="container" >
                    <slot>
                        <span class="label"></span>
                    </slot>
                </div>`;
    styleString = `
    .container{
        line-height:28px;
        padding: 0 10px;
        cursor: pointer;
    }
    .container:hover{
        background-color: #f5f7fa
    }
    span{
        line-height:28px;
    }
    `;
    shadow: ShadowRoot;
    container: HTMLElement;
    labelDom: Element;
    static get observedAttributes() {
        return ['icon', 'label', 'value'];
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'label') {
            this.labelDom.innerHTML = newValue;
        }
    }
    changeState(selected: boolean) {
        let nextColor = selected ? '#f5f7fa' : '';
        this.container.style.setProperty('background-color', nextColor);
    }
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.shadow.innerHTML = `<style>${this.styleString}</style>${this.template}`;
        this.container = this.shadow.children[1];
        this.labelDom = this.container.querySelector('.label')!;
    }
}
customElements.define('my-option', MyOption);

class MySelect extends HTMLElement {
    template = `
        <div class="container">
            <div class="input-box">
                <div class="select-input shade-board"></div>
                <input class="select-input search-board" placeholder="请选择"></input>
            </div>
            <div class="select-options" style="display:none">
                <slot>
                    <my-option icon="{{icon}}" label="{{label}}" value="{{value}}"></my-option>
                </slot>
            </div>
        </div>
        `;
    styleString = `
    .container{
        height: 28px;
        width: 240px;
    }
    .input-box{
        height: 100%;
        position: relative;
    }
    .select-options{
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        box-sizing: border-box;
        margin: 5px 0;
        padding: 5px 0;
        z-index: 11;
        position: relative;
    }
    .shade-board{
        z-index:1;
        cursor: pointer;
    }
    .select-input{
        height: 100%;
        width: 100%;
        position: absolute;
    }`;
    options: { [key: string]: any }[] = [];
    type = 'normal'; // 普通select
    mode = 'normal'; // options来源
    clear = 'false'; // 是否支持清除
    mumultiple = 'false'; // 是否多选
    group = 'false'; // 是否分组展示
    allowCreate = 'false'; // 是否支持创建
    shadow: ShadowRoot;
    expendDom?: HTMLInputElement;
    shadeDom?: HTMLElement;
    optionsDom: HTMLElement;
    static get observedAttributes() {
        return ['label-key', 'value-key'];
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        console.log(name, oldValue, newValue);
    }
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.innerHTML = `<style>${this.styleString}</style>${this.template}`;
        this.optionsDom = this.shadow.querySelector('.select-options')!;
        if (this.type === 'normal') {
            this.shadeDom = this.shadow.querySelector('.shade-board')!;
            this.expendDom = this.shadow.querySelector('.search-board')!;
        }
        this.shadeDom?.addEventListener('click', () => {
            let nextState =
                this.optionsDom.style.getPropertyValue('display') === 'none'
                    ? 'block'
                    : 'none';
            this.optionsDom.style.setProperty('display', nextState);
            if (nextState === 'block') {
                setTimeout(() =>
                    document.addEventListener(
                        'click',
                        () => {
                            this.optionsDom.style.setProperty(
                                'display',
                                'none'
                            );
                        },
                        {
                            once: true,
                        }
                    )
                );
            }
        });
    }
    connectedCallback() {
        let slot = this.shadow.querySelector('slot');
        console.log(slot?.children, 'slot');
        // 需要异步操作
        setTimeout(() => {
            let defaultTemplate = slot?.innerHTML,
                slotTemplate = this.innerHTML.trim(),
                resultTemplate = slotTemplate || defaultTemplate;
            let optionsTemplate = this.options.map((ctx) => {
                return resultTemplate!.replace(
                    /{{[^{}]+}}/g,
                    (target: string) => {
                        return (
                            ctx[
                                target.substring(2, target.length - 2).trim()
                            ] || ''
                        );
                    }
                );
            });
            this.optionsDom.innerHTML = optionsTemplate.join('');
            this.optionsDom.addEventListener(
                'click',
                (e) => {
                    let path = e.path,
                        index = path.indexOf(this.optionsDom);
                    if (index >= 1) {
                        console.log(
                            path[index - 1],
                            path[index - 1].getAttribute('value')
                        );
                        this.expendDom!.value =
                            path[index - 1].getAttribute('value');
                        // 下发给options 当前选中值
                        Array.from(this.optionsDom.children).forEach(
                            (optionDOM) => {
                                optionDOM.changeState(
                                    optionDOM === path[index - 1]
                                );
                            }
                        );
                    }
                },
                false
            );
        });
        console.log(this.getAttribute('label-key'), 'label-key');
    }
}
customElements.define('my-select', MySelect);

class MySelect1 extends MySelect {
    constructor() {
        super();
        this.options = [
            {
                label: '饺子',
                value: '饺子',
            },
            {
                label: '面条',
                value: '面条',
            },
        ];
    }
}
customElements.define('my-select-1', MySelect1);
export { MySelect, MyOption };
