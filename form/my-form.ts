import { FormGroup } from './control/index';

class MyForm extends HTMLElement {
    template = `<div>
                    <slot></slot>
                </div>`;
    styleString = `
    `;
    formgroup = new FormGroup();
    constructor() {
        super();
        console.log(this.childNodes);
    }
    connectedCallback() {
        this.childNodes.forEach((node) => console.log(node));
        console.log('connectedCallback', this.childNodes);
    }
    disconnectedCallback() {}
    adoptedCallback() {}
    attributeChangedCallback() {}
}
const A = 0;
customElements.define('my-form', MyForm);
export { MyForm, FormGroup, A };
