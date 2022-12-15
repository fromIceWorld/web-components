class MyFor extends HTMLElement {
    template = `
                <div>
                    <slot></slot>
                </div>
                `;
    iterationTemplate = '';
    cache: Map<string, HTMLElement> = new Map(); //缓存
    cacheOptions: Array<any> = [];
    options: Array<any> = [];
    // shadow: ShadowRoot;
    static get observedAttributes() {
        return ['template', 'list'];
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'list') {
            if (newValue === '[object Object]') {
                return;
            }
            console.log(this.children);
            let value = eval(newValue);
            console.log(name, value, Array.isArray(value));
            if (Array.isArray(value)) {
                this.setAttribute(name, {});
            }
        }
    }
    // 劫持setAttribute
    setAttribute(key, value) {
        console.log(key, value, super.setAttribute);
        // if (Array.isArray(value)) {
        //     return;
        // }
        super.setAttribute.call(this, key, value);
    }
    constructor() {
        super();
        // this.shadow = this.attachShadow({ mode: 'open' });
        // this.shadow.innerHTML = `${this.template}`;
    }
    connectedCallback() {
        console.log(this.children);

        setTimeout(() => {
            this.iterationTemplate = this.innerHTML;
            this.setIteration(this.options);
        });
    }
    // 对比新旧数据
    diff(list: any[]) {
        let newCache = new Map();
        let newDOMs: Element[] = list.map((ctx) => {
            let id = JSON.stringify(ctx);
            if (this.cache.has(id)) {
                newCache.set(id, this.cache.get(id));
                return this.cache.get(id)!;
            } else {
                let s = this.iterationTemplate!.replace(
                    /{{[^{}]+}}/g,
                    (target: string) => {
                        return (
                            ctx[
                                target.substring(2, target.length - 2).trim()
                            ] || ''
                        );
                    }
                );
                let dom = document.createElement('div');
                dom.innerHTML = s;
                newCache.set(id, dom.children[0]);
                return dom.children[0];
            }
        });
        this.cache = newCache;
        // 对比新旧DOM;
        let preDOMs = this.children;
        let i = 0,
            j = preDOMs.length - 1;
        let p = 0,
            q = newDOMs.length - 1;
        while (i <= j && p <= q) {
            if (preDOMs[i] === newDOMs[p]) {
                // 起始 <=> 起始
                i++;
                p++;
            } else if (preDOMs[j] === newDOMs[q]) {
                // 结尾 <=> 结尾
                j--;
                q--;
            } else if (preDOMs[i] === newDOMs[q]) {
                // 起始 <=> 结尾
                preDOMs[i].replaceWith(newDOMs[q]);
                i++;
                q--;
            } else if (preDOMs[j] === newDOMs[p]) {
                // 结尾 <=> 起始
                preDOMs[j].replaceWith(newDOMs[p]);
                j--;
                p++;
            } else {
                preDOMs[i].replaceWith(newDOMs[p]);
                i++;
                p++;
            }
        }
        // 当有新增，减少的节点时
        if (i > j) {
            if (p <= q) {
                preDOMs[j].after(...newDOMs.slice(p, q + 1));
            }
        }
        if (p > q) {
            if (i <= j) {
                for (; i <= j; i++) {
                    preDOMs[i].remove();
                }
            }
        }
    }
    // 设置可迭代数据
    //TODO:配置缓存
    setIteration(list) {
        setTimeout(() => {
            this.diff(list);
            // this?.innerHTML = t;
        });
    }
}
customElements.define('my-for', MyFor);
export { MyFor };
