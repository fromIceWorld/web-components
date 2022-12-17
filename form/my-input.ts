import { FormControl, FormGroup } from './control/index';
import { MyForm } from './my-form';

class MyInput extends HTMLInputElement {
    static index = 0;
    static tagNamePrefix: string = 'my-input-box';
    regexp: string = '';
    reg?: RegExp;
    updateOn: string = 'change'; // 默认 【change】 时校验
    controlName?: string;
    // form表单
    formgroup?: FormGroup;
    formcontrol?: FormControl;
    parent?: MyForm;
    static get observedAttributes() {
        return ['value'];
    }
    constructor() {
        super();
    }
    connectedCallback() {
        console.log('自定义input');
        this.controlName = this.getAttribute('formcontrol') || '';
        if (this.controlName) {
            this.formcontrol = new FormControl(this);
        }
        // 初始化正则
        this.initReg();
        this.getUpForm();
        this.initEvents();
    }
    attributeChangedCallback() {}

    // 获取上级form 收集，注册
    getUpForm() {
        let parent = this.parentElement;
        while (parent) {
            const { tagName, parentElement } = parent;
            let formgroup;
            if (tagName.startsWith('MY-FORM') && this.controlName) {
                this.formgroup = formgroup = (parent as MyForm).formgroup!;
                formgroup.register(this.controlName, this.formcontrol!);
                this.parent = parent as MyForm;
                return;
            }
            parent = parentElement;
        }
    }
    // 初始化正则
    initReg() {
        this.reg = new RegExp(this.regexp);
    }
    initEvents() {
        // 添加 变更校验事件
        this.initValidation();
    }
    // 变更校验事件
    initValidation() {
        this.addEventListener(this.updateOn, (e) => {
            let value = (e.target as any).value,
                valid = this.reg!.test(value);
            console.log('my-input change', valid);
        });
    }
    // form 触发 校验
    validation() {}
    /**
     *
     * @param option { html:any, css:any}
     * @returns {
     *  html: string
     *  js: string
     * }
     */
    static extends(option) {
        const { html, css } = option;
        const index = MyInput.index++,
            tagName = `${MyInput.tagNamePrefix}-${index}`;
        const { attributes, properties } = html;
        const { placeholder, formcontrol } = attributes;
        const { value, updateOn, regexp } = properties;
        let config = {
            html: `<input 
                        is=${tagName}
                        type="text"
                        placeholder="${placeholder}"
                        formcontrol="${formcontrol}"
                   />`,
            js: `class MyInput${index} extends MyInput{
                constructor(){
                    super();
                    this.value = '${value}';
                    this.regexp = '${regexp}';
                    this.updateOn = '${updateOn}';
                }
            };
            customElements.define('${tagName}',MyInput${index},{ extends: 'input' });
            `,
        };
        return config;
    }
    // 暴露对外接口
    public validate() {}
    public setValue() {}
    public focus() {}
    public clear() {}
}
customElements.define('my-input', MyInput, { extends: 'input' });

export { MyInput, FormControl };
