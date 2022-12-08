enum DialogStates {
    visible,
    hiden,
}
class MyDialogModel extends HTMLElement {
    template = `<div class="container" style="display:none;">
                    <div class = "content">
                        <div class="dialog-header">
                            <span class="dialog-header-title"></span>
                            <img src="../menu/close.svg" />
                        </div>
                        <div class="dialog-body">
                            <slot></slot>
                        </div>
                    </div>
                </div>`;
    styleString = `
    .container{
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #0000004d;
    }
    .content{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 2px;
        box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
    }
    .dialog-header{
        height:20px;
        padding: 10px;
    }
    .dialog-body{
        
    }
    .dialog-header > img{
        height: 14px;
        float: right;
        cursor: pointer;
    }
    `;
    shadow: ShadowRoot;
    container?: HTMLElement;
    content?: HTMLElement;
    MyTitle: string = '';
    titleDom?: HTMLElement;
    closeBtn?: HTMLElement;
    state = DialogStates.hiden;
    static get observedAttributes() {
        return ['expend', 'title', 'width', 'height'];
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'expend') {
            let displayValue = newValue === 'true' ? 'block' : 'none';
            this.container!.style.setProperty('display', displayValue);
            this.state =
                newValue === 'true' ? DialogStates.visible : DialogStates.hiden;
        }
        if (name === 'title') {
            this.titleDom!.innerHTML = newValue;
        }
        if (name === 'width' || name === 'height') {
            this.content!.style.setProperty(name, newValue);
        }
    }
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.shadow.innerHTML = `<style>${this.styleString}</style>${this.template}`;
    }
    /**
     * 实例化组件来源于初始组件，在实例化组件时，传入差异数据，再通过init函数启动组件
     */
    // 初始化函数
    init() {
        this.container = this.shadow.querySelector('.container')!;
        this.content = this.shadow.querySelector('.content')!;
        this.titleDom = this.content.querySelector('.dialog-header-title')!;
        this.titleDom.innerHTML = this.MyTitle;
        this.closeBtn = this.content.querySelector('img')!;
        this.initCloseEvent();
    }
    initCloseEvent() {
        this.closeBtn!.addEventListener('click', () => {
            this.changeState(false);
        });
        this.container!.addEventListener('click', () => {
            console.log('container click', this.state);
        });
    }
    // 更改组件状态的入口函数
    private changeState(target: boolean) {
        let nextDisplay = target ? 'block' : 'none';
        this.container!.style.setProperty('display', nextDisplay);
        this.state = target ? DialogStates.visible : DialogStates.hiden;
    }
    // 对外暴露event
    public visibleChange(event: CustomEvent) {
        if (event) {
            const { value, source, nextState, once } = event.detail;
            console.log(value, source, nextState, once);
        }

        this.changeState(true);
    }
    public visible() {
        this.changeState(true);
    }
    public hiden() {
        this.changeState(false);
    }
}
customElements.define('my-dialog-model', MyDialogModel);
export { MyDialogModel };
