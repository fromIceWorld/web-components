enum ButtonSTATES {
    normal, // 普通状态
    loading, // loading状态
    disabled, // 禁用状态
}
let defaultConfig: CustomEventInit = {
    bubbles: false,
    cancelable: true,
    composed: true,
    detail: {},
};
class MyButton extends HTMLElement {
    icon?: string;
    name?: string;
    type?: string;
    shape?: string;
    textDom?: Text;
    btnDom?: HTMLElement;
    state: ButtonSTATES = ButtonSTATES.normal;
    subscribers: HTMLElement[] = []; //订阅者
    shadow: ShadowRoot;
    container: Element;
    template = `
        <div class="my-button"></div>
    `;
    styleString = `
        .my-button{
            display: inline-block;
            background-color: var(--button-background-color);
            border-color: var(--button-background-color);
            color: var(--button-color);
            cursor: pointer;
            padding: 2px 15px;
            font-size: 14px;
            border-radius: 3px;
        }
    `;
    outputClick = new CustomEvent('click');
    static get observedAttributes() {
        return ['icon', 'name', 'type', 'shape'];
    }
    /**
     *
     * @param type
     * @param additionConfig
     */
    // event事件
    private emit(type: string, additionConfig: CustomEventInit = {}) {
        const event = new CustomEvent(
            type,
            Object.assign(defaultConfig, additionConfig)
        );
        this.dispatchEvent(event);
    }
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.shadow.innerHTML = `<style>${this.styleString}</style>${this.template}`;
        this.container = this.shadow.children[1];
    }
    /*
      初始化内部事件，同时emit出去
    */
    // click
    initClickEvent() {
        if (this.btnDom) {
            return;
        }
        this.btnDom = this.shadow.querySelector('.my-button')!;
        this.btnDom?.addEventListener('click', (e) => {
            this.emit('whenClick', {
                detail: {
                    value: 'my-button emit',
                    source: this,
                    nextState: 'normal',
                    once: false,
                },
            });
        });
    }

    connectedCallback() {
        console.log(this);
        this.initConfig();
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'icon':
                this.icon = newValue;
                this.initIcon(!oldValue);
                break;
            case 'name':
                this.name = newValue;
                this.initIcon(!oldValue);
                break;
            case 'type':
                this.type = newValue;
                this.initIcon(!oldValue);
                break;
        }
    }
    // 按钮的添加 click回调函数
    /**
     *
     * @param e click事件
     * @param target 所触发的组件
     * @param method 所触发的方法
     */
    whenclick(e, target: string, method: string): void {
        const targetComponent = document.querySelector(target);
        this.changeState(ButtonSTATES.loading); // 更改按钮状态;
        if (targetComponent) {
            // 监听target状态。
            targetComponent.subscribe((res) => {
                this.changeState(ButtonSTATES.normal);
            });
            // 触发target的method。
            targetComponent[method]();
        }
    }

    initConfig() {
        this.initIcon(true);
        this.initName(true);
        this.initType(true);
        this.initShape(true);
    }
    initIcon(isInit: boolean) {
        let [icon, name] = this.getIconAndName();
        if (isInit) {
            if (this.icon) {
                icon = document.createElement('icon');
                if (name) {
                    this.container!.insertBefore(icon, name);
                } else {
                    this.container.appendChild(icon);
                }
            }
        } else {
            icon!.src = this.icon;
        }
    }
    initName(isInit: boolean) {
        let text = document.createTextNode(this.name!);
        if (isInit) {
            if (this.name) {
                let name = document.createElement('span');
                this.textDom = text;
                name.appendChild(text);
                this.container.appendChild(name);
            }
        } else {
            this.textDom?.replaceWith(text);
            this.textDom = text;
        }
    }
    initType(isInit: boolean) {}
    initShape(isInit: boolean) {}
    getIconAndName() {
        let children = this.container.children,
            icon: Element,
            name;
        [...children].forEach((child) => {
            const { tagName } = child;
            if (tagName === 'ICON') {
                icon = child;
            } else if (tagName === 'SPAN') {
                name = child;
            }
        });
        return [icon, name];
    }
    // 更改当前组件状态，分发给订阅者
    changeState(status: ButtonSTATES) {
        console.log(status);
    }
    // 暴露出对外状态接口
    public loading() {
        this.changeState(ButtonSTATES.loading);
    }
    public disabled() {
        this.changeState(ButtonSTATES.disabled);
    }
}
customElements.define('my-button', MyButton);
export { MyButton };
