"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $ = require('cheerio');
var MenioComponent = (function () {
    function MenioComponent() {
    }
    MenioComponent.prototype.getPageState = function () {
        return '';
    };
    MenioComponent.prototype.render = function () {
        return null;
    };
    MenioComponent.prototype.createNode = function (cheerio, el) {
        var selector = el.tag;
        if (el.attrs) {
            for (var key in el.attrs) {
                if (key !== 'id' && key !== 'class') {
                    if (el.attrs[key]) {
                        selector += "[" + key + "=" + el.attrs[key] + "]";
                    }
                    else {
                        selector += "[" + key + "]";
                    }
                }
                else if (key === 'id') {
                    selector += " #" + el.attrs[key];
                }
                else if (key === 'class') {
                    selector += " ." + el.attrs[key];
                }
            }
        }
        console.log(selector);
        if (typeof cheerio.find === 'function') {
            el.node = cheerio.find(selector);
            console.log(cheerio.contents().html());
        }
        else {
            el.node = cheerio(selector);
        }
    };
    MenioComponent.prototype.parse = function (parent, el) {
        var _this = this;
        var cheerio;
        var root = this.render();
        if (parent) {
            this.createNode(parent.node, el);
            root = el;
        }
        else {
            cheerio = $.load(this.getPageState(), {
                normalizeWhitespace: true,
                lowerCaseAttributeNames: true,
                lowerCaseTags: true,
                recognizeSelfClosing: true
            });
            this.createNode(cheerio, root);
        }
        root.children.forEach(function (child, index) {
            console.log(child);
            if (child.html) {
                console.log(root.node.html());
            }
            else {
                _this.parse(root, child);
            }
        });
        return root;
    };
    return MenioComponent;
}());
exports.MenioComponent = MenioComponent;
var MenioDOMElement = (function () {
    function MenioDOMElement(tag, attrs, children, node) {
        if (node === void 0) { node = null; }
        this.tag = tag;
        this.attrs = attrs;
        this.children = children;
        this.node = node;
    }
    return MenioDOMElement;
}());
exports.MenioDOMElement = MenioDOMElement;
var MenioElementFactory = (function () {
    function MenioElementFactory() {
    }
    MenioElementFactory.createEl = function (tag, attrs, children) {
        return new MenioDOMElement(tag, attrs, children);
    };
    return MenioElementFactory;
}());
exports.MenioElementFactory = MenioElementFactory;
var Test = (function (_super) {
    __extends(Test, _super);
    function Test() {
        _super.apply(this, arguments);
    }
    Test.prototype.getPageState = function () {
        return "<table border=\"0\"><tr>{html}</tr></table>";
    };
    Test.prototype.render = function () {
        return MenioElementFactory.createEl('table', { border: 0 }, [
            MenioElementFactory.createEl('tr', null, [{ html: true }])
        ]);
    };
    return Test;
}(MenioComponent));
exports.Test = Test;
//# sourceMappingURL=jsxMenio.js.map