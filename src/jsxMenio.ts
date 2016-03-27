const $: CheerioAPI = require('cheerio');

export class MenioComponent {
    state: any;
    getPageState(): string {
        return '';
    }
    render(): MenioDOMElement {
        return null;
    }

    createNode(cheerio: Cheerio | CheerioStatic, el: MenioDOMElement) {
        let selector = el.tag;
        if (el.attrs) {
            for (let key in el.attrs) {
                if (key !== 'id' && key !== 'class') {
                    if (el.attrs[key]) {
                    selector += `[${key}=${el.attrs[key]}]`;
                    } else {
                        selector += `[${key}]`;
                    }
                }
                else if (key === 'id') {
                    selector += ` #${el.attrs[key]}`;
                } else if (key === 'class') {
                    selector += ` .${el.attrs[key]}`;
                }
            }
        }
        console.log(selector);
        if (typeof (cheerio as Cheerio).find === 'function') {
            el.node = (cheerio as Cheerio).find(selector);
        } else {
            el.node = (cheerio as CheerioStatic)(selector);
        }
    }


    parse(parent: MenioDOMElement, el: MenioDOMElement) {
        let cheerio: Cheerio | CheerioStatic;
        let root = this.render();

        if (parent) {
            this.createNode(parent.node, el);
            root = el;
        } else {
            cheerio = $.load(this.getPageState(), { 
                normalizeWhitespace: true,
                lowerCaseAttributeNames: true,
                lowerCaseTags: true,
                recognizeSelfClosing: true
            });
            this.createNode(cheerio, root);
        }


        root.children.forEach((child, index) => {
            console.log(child);
            if (child.html) {
                console.log(root.node.html());
            } else {
                this.parse(root, child);
            }
        });


        return root;
        // 
    }
}

export class MenioDOMElement {
    constructor(
        public tag: string,
        public attrs: any,
        public children: Array<MenioDOMElement | any>,
        public node: Cheerio = null) {
    }
}

export class MenioElementFactory {

    static createEl(
        tag: string,
        attrs: any,
        children: Array<MenioDOMElement | any>): MenioDOMElement {
        return new MenioDOMElement(tag, attrs, children);
    }
}

export class Test extends MenioComponent {
    state: {};

    getPageState() {
        return `<table border="0"><tr>{html}</tr></table>`;
    }

    render() {
        return MenioElementFactory.createEl('table', { border: 0 }, [
            MenioElementFactory.createEl('tr', null, [{ html: true }])
        ]);
    }
}