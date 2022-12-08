class MyIf extends HTMLElement {
    template = `
                <div>
                    <slot></slot>
                </div>
                <template id="toIf">
                    <span>{{label}}</span>
                </template>
                `;
    renderTemplate = '';
    // shadow: ShadowRoot;
    static get observedAttributes() {
        return ['template'];
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        console.log(document.querySelector(`template[id=${newValue}]`));
    }
    constructor() {
        super();
        // this.shadow = this.attachShadow({ mode: 'open' });
        // this.shadow.innerHTML = `${this.template}`;
    }
    connectedCallback() {
        setTimeout(() => {
            console.log(
                this.shadow.querySelector('template[id=toIf]')?.innerHTML
            );
            this.renderTemplate = this.innerHTML;
            this.setBoolean(true);
        });
    }
    // 设置可迭代数据
    setBoolean(render: boolean) {
        setTimeout(() => {
            let t = render ? this.renderTemplate : ``;
            this?.innerHTML = t;
            console.log(t);
        });
    }
}
customElements.define('my-if', MyIf);
export { MyIf };
