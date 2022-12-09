class MyDeepFor extends HTMLElement {
    template = `
                <div>
                    <slot></slot>
                </div>
                `;
    iterationTemplate = '';
    options: Array<any> = [];
    // shadow: ShadowRoot;
    static get observedAttributes() {
        return ['template', 'list'];
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'list') {
            if (newValue === '[object Object]') {
                return;
            }
            let value = JSON.parse(newValue.replace(/'/g, '"'));
            if (value.length === 0) {
                return;
            }
            console.log(name, value, Array.isArray(value));
            if (Array.isArray(value)) {
                this.options = value;
                this.setIteration(this.options);
                // this.setAttribute(name, {});
            }
        }
        if (name === 'template' && newValue) {
            this.iterationTemplate = [
                ...document.querySelector(`template[id=${newValue}]`).content
                    .children,
            ]
                .map((dom) => dom.outerHTML)
                .join('');
        }
    }
    // 劫持setAttribute
    // setAttribute(key, value) {
    // console.log(key, value, super.setAttribute);
    // if (Array.isArray(value)) {
    //     return;
    // }
    // super.setAttribute.call(this, key, value);
    // }
    constructor() {
        super();
        console.log(this.innerHTML);
        // this.shadow = this.attachShadow({ mode: 'open' });
        // this.shadow.innerHTML = `${this.template}`;
    }
    connectedCallback() {
        console.log(
            document.querySelector('template[id=label]'),
            [...document.querySelector('template[id=label]').content.children]
                .map((dom) => dom.outerHTML)
                .join()
        );
        setTimeout(() => {
            this.iterationTemplate = this.innerHTML;
            this.setIteration(this.options);
        });
    }
    // 设置可迭代数据
    setIteration(list) {
        setTimeout(() => {
            let t = ``;
            for (let ctx of list) {
                t += this.iterationTemplate!.replace(
                    /{{([^{}]+)}}/g,
                    (source, target: string) => {
                        return JSON.stringify(ctx[target.trim()] || '').replace(
                            /"/g,
                            "'"
                        );
                    }
                );
            }
            this?.innerHTML = t;
            console.log(t);
        });
    }
}
customElements.define('my-deep-for', MyDeepFor);
export { MyDeepFor };
