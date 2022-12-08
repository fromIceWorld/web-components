class MyFor extends HTMLElement {
    template = `
                <div>
                    <slot></slot>
                </div>
                <template id="toFor">
                    <span>{{label}}</span>
                </template>
                `;
    iterationTemplate = '';
    options: Array<any> = [];
    // shadow: ShadowRoot;
    static get observedAttributes() {
        return ['template', 'list'];
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (newValue === '[object Object]') {
            return;
        }
        let value = eval(newValue);
        console.log(name, value, Array.isArray(value));
        if (Array.isArray(value)) {
            this.setAttribute(name, {});
        }
    }
    // 劫持setAttribute
    setAttribute(key, value) {
        console.log(key, value, super.setAttribute);
        // if (Array.isArray(value)) {
        //     return;
        // }
        super.setAttribute.call(this, key, value);
    }
    constructor() {
        super();
        // this.shadow = this.attachShadow({ mode: 'open' });
        // this.shadow.innerHTML = `${this.template}`;
    }
    connectedCallback() {
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
                    /{{[^{}]+}}/g,
                    (target: string) => {
                        return (
                            ctx[
                                target.substring(2, target.length - 2).trim()
                            ] || ''
                        );
                    }
                );
            }
            this?.innerHTML = t;
            console.log(t);
        });
    }
}
customElements.define('my-for', MyFor);
export { MyFor };
