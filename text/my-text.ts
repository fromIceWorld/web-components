class MyText extends HTMLElement {
    static index = 0;
    static tagNamePrefix: string = 'my-text';
    template = `<span><slot></slot></span>`;
    static extends(option) {
        const { html, css } = option;
        const index = MyText.index++,
            tagName = `${MyText.tagNamePrefix}-${index}`;
        const { attributes, properties } = html,
            { text } = properties;
        return {
            html: `<${tagName}>${text}</${tagName}>`,
            js: `
            class MyText${index} extends MyText{
                constructor(){
                    super();
                }
            };
            customElements.define('${tagName}', MyText${index});
            `,
        };
    }
}
export { MyText };
