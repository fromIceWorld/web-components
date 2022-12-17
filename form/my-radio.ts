import { FormControl } from './my-input';

class MyRadio extends HTMLElement {
    static index = 0;
    static tagNamePrefix: string = 'my-radio';
    value?: string;
    template = `<div><slot></slot></div>`;
    styleString = `
    `;
    formcontrol?: FormControl;
    controlName?: string;
    options = [];
    shadow: ShadowRoot;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.shadow.innerHTML = `<style>${this.styleString}</style>${this.template}`;
    }
    connectedCallback() {
        this.controlName = this.getAttribute('formcontrol') || '';
        if (this.controlName) {
            this.formcontrol = new FormControl(this);
        }
        this.initOptions();
        this.initEvent();
    }
    initOptions() {
        let checkTarget: any;
        let children = this.options.map((item) => {
            const { value, label, checked } = item;
            if (checked) {
                checkTarget = item;
                this.value = this.formcontrol!.value = value;
            }
            return `
                <input type='radio' id='${value}' name = '${
                this.controlName
            }' value='${value}' ${checked ? 'checked' : ''}/>
                <label for='${value}'>${label}</label>
            `;
        });
        this.innerHTML = children.join('');
    }
    initEvent() {
        [...this.children].forEach((child) => {
            if (child instanceof HTMLInputElement) {
                child.addEventListener('change', (e) => {
                    this.value = this.formcontrol!.value = (
                        e.target as any
                    ).value;
                    console.log('my-radio change', this.value);
                });
            }
        });
    }
    disconnectedCallback() {}
    static extends(option) {
        const { html, css } = option;
        const index = MyRadio.index++,
            tagName = `${MyRadio.tagNamePrefix}-${index}`;
        const { attributes, properties } = html;
        const { options } = properties;
        const { formcontrol } = attributes;
        return {
            html: `<${tagName} formcontrol='${formcontrol}'></${tagName}>`,
            js: `class MyRadio${index} extends MyRadio{
                constructor(){
                    super();
                    this.options = ${options}
                }
            }
            customElements.define('${tagName}',MyRadio${index});
            `,
        };
    }
}
customElements.define('my-radio', MyRadio);
export { MyRadio };
