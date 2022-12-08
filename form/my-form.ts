import { FormGroup } from './control/index';

class MyForm extends HTMLElement {
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
const A = 0;
customElements.define('my-form', MyForm);
export { MyForm, FormGroup, A };
