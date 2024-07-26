class MyContainer extends HTMLElement {
    static index = 0;
    static tagNamePrefix: string = 'my-container';
    template = `<span><slot></slot></span>`;
    static extends(option: { html: any; css: any }) {
        const { html, css } = option;
        const index = MyContainer.index++,
            tagName = `${MyContainer.tagNamePrefix}-${index}`;
        const { style } = css;
        const flexDirection = style['flex-direction'];
        return {
            html: `<${tagName} style="display:flex;${
                flexDirection
                    ? flexDirection === 'row'
                        ? 'flex-direction:row'
                        : 'flex-direction:column'
                    : ''
            }"></${tagName}>`,
            js: ``,
        };
    }
}
export { MyContainer };
