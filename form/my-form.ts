import { FormGroup } from './control/index';

class MyForm extends HTMLElement {
    static index = 0;
    static tagNamePrefix: string = 'my-form';
    template = `<div>
                    <slot></slot>
                </div>`;
    styleString = `
    `;
    formgroup = new FormGroup();
    subscribers: Function[] = []; //订阅者
    // shadow: ShadowRoot;
    constructor() {
        super();
        // this.shadow = this.attachShadow({ mode: 'open' });
        // this.shadow.innerHTML = `<style>${this.styleString}</style>${this.template}`;
        console.log(this.childNodes);
    }
    subscribe(subscriberFn: Function) {
        this.subscribers.push(subscriberFn);
    }

    connectedCallback() {
        this.childNodes.forEach((node) => console.log(node));
        console.log('connectedCallback', this.childNodes);
    }
    disconnectedCallback() {}
    adoptedCallback() {}
    attributeChangedCallback() {}
    /**
     *
     * @param option { options:string}
     * @returns {
     *  html: string
     *  js: string
     *  tagName: string
     * }
     */
    static extends(option) {
        const { html, css } = option;
        const index = MyForm.index++,
            tagName = `${MyForm.tagNamePrefix}-${index}`;
        const { attributes, properties } = html,
            { formgroup } = attributes;
        const { api } = properties;
        const { style } = css,
            flexDirection = style['flex-direction'];

        return {
            html: `<${tagName} formgroup="${formgroup}" style="display:flex;${
                flexDirection
                    ? flexDirection === 'row'
                        ? 'flex-direction:row'
                        : 'flex-direction:column'
                    : ''
            }"></${tagName}>`,
            js: `class MyForm${index} extends MyForm{
                    constructor(){
                        super();
                        this.api = '${api}'
                    }
                 }
                 customElements.define('${tagName}',MyForm${index})
                 `,
        };
    }
    public submit() {
        console.log('submit');
        this.subscribers.forEach((sub) => {
            sub();
        });
    }
    public reset() {
        console.log('submit');
        this.subscribers.forEach((sub) => {
            sub();
        });
    }
}
customElements.define('my-form', MyForm);
export { MyForm, FormGroup };
