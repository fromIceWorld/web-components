interface controlOptions {
    value?: any;
    updateOn?: string;
    regexpExp?: string;
}
class FormControl {
    value: string = '';
    updateOn: string = '';
    regexpExp: string = '';
    private valid: boolean = true;
    regexp?: RegExp;
    constructor(private native: HTMLElement, options: controlOptions = {}) {
        const { value, updateOn, regexpExp } = options;
        this.initRegExp(regexpExp);
        this.initValue(value);
        this.watchHost();
        this.initUpdateEvent(updateOn);
    }
    // 初始化数据
    initValue(value = this.value) {
        this.value = value;
        (this.native as HTMLInputElement).value = value;
    }
    // 添加校验事件
    initUpdateEvent(event = this.updateOn) {
        if (!event) {
            return;
        }
        this.native.addEventListener(event, (e) => {
            this.value = (e.target as any).value;
            this.validate();
        });
    }
    initRegExp(regexpExp = this.regexpExp) {
        this.regexp = new RegExp(regexpExp);
    }
    // 校验
    validate() {
        this.valid = this.regexp!.test(this.value);
    }
    // 监听宿主数据
    watchHost() {
        const { tagName } = this.native;
        switch (tagName) {
            case 'INPUT':
            case 'SELECT':
                this.watchText();
                break;
        }
    }
    watchText(type: string = 'change') {
        this.native.addEventListener(type, (e) => {
            this.value = (e.target as any).value;
        });
    }
}

class FormGroup {
    controls: { [key: string]: FormControl } = {};
    constructor() {}
    register(key: string, control: FormControl) {
        if (this.controls[key]) {
            throw new Error('formcontrol 重复');
        }
        this.controls[key] = control;
    }
    get(key: string) {
        return this.controls[key];
    }
}
export { FormGroup, FormControl, controlOptions };
