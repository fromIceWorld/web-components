class MyIf extends HTMLElement {
    template = `
                <div>
                    <slot></slot>
                </div>
                `;
    renderTemplate = '';
    // shadow: ShadowRoot;
    static get observedAttributes() {
        return ['template', 'expend'];
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'expend') {
            this.setBoolean(newValue === 'true');
        }
    }
    constructor() {
        super();
        // this.shadow = this.attachShadow({ mode: 'open' });
        // this.shadow.innerHTML = `${this.template}`;
    }
    connectedCallback() {
        setTimeout(() => {
            this.setBoolean(true);
        });
    }
    // 设置可迭代数据
    setBoolean(render: boolean) {
        setTimeout(() => {
            let t = render ? this.renderTemplate : ``;
            this?.innerHTML = t;
        });
    }
}
customElements.define('my-if', MyIf);
export { MyIf };
