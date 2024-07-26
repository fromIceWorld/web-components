import { FormGroup } from './control/index';
let defaultConfig: CustomEventInit = {
    bubbles: false,
    cancelable: true,
    composed: true,
    detail: {},
};
class FormComponent extends HTMLElement {
    static index = 0;
    static tagNamePrefix: string = 'my-form';
    template = `<div>
                    <slot></slot>
                </div>`;
    styleString = `
    `;
    api: string = '';
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

    // submit
    public submit() {
        let xhr = new XMLHttpRequest(),
            that = this;
        xhr.open('get', this.api);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                let { code, data } = JSON.parse(xhr.responseText);
                if (code === 200) {
                    that.emit('200', {});
                    console.log(code, data);
                } else if (code === 500) {
                    that.emit('500', {});
                    console.log(code, data);
                }
            }
        };
        xhr.send();
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
    public patchValue() {
        console.log('patchValue');
        this.subscribers.forEach((sub) => {
            sub();
        });
    }
    static extends(option) {
        const { html, css } = option;
        const index = FormComponent.index++,
            tagName = `${FormComponent.tagNamePrefix}-${index}`;
        const { formgroup, api } = html;
        const { style } = css,
            flexDirection = style['flex-direction'];
        return {
            html: `<${tagName} formgroup="${
                formgroup.value
            }" style="display:flex;${
                flexDirection
                    ? flexDirection === 'row'
                        ? 'flex-direction:row'
                        : 'flex-direction:column'
                    : ''
            }"></${tagName}>`,
            js: `class FormComponent${index} extends FormComponent{
                    constructor(){
                        super();
                        this.api = '${api.value}'
                    }
                 }
                 customElements.define('${tagName}',FormComponent${index});
                 `,
        };
    }
    // event事件
    private emit(type: string, additionConfig: CustomEventInit = {}) {
        const event = new CustomEvent(
            type,
            Object.assign(defaultConfig, additionConfig)
        );
        this.dispatchEvent(event);
    }
}
window['FormComponent'] = FormComponent;
customElements.define('my-form', FormComponent);
export { FormComponent, FormGroup };
