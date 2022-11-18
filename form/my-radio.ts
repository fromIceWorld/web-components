import { FormControl } from './my-input';

class MyRadio extends HTMLElement {
    value?: string;
    template = `<div></div>`;
    formcontrol?: FormControl;
    controlName?: string;
    options = [];
    constructor() {
        super();
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
}
customElements.define('my-radio', MyRadio);
export { MyRadio };
