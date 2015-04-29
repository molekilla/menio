var path = require('path');
var $ = require('cheerio');
var fs = require('fs');
var _ = require('underscore');

var MenioModel = function (options) {
    this._keys = _.keys(options.template.props);
    this._mappings = _.values(options.template.props);
    this._name = options.name;
    this._props = options.template.props;

    // set document context
    if (options.template.context) {

        if (_.isString(options.template.context)) {
            this._documentSelector = options.template.context;
        } else {
            this._documentSelector = options.template.context.selector;
            this._documentSelectorIndex = options.template.context.index;
        }
    } else {
        throw new Error('Missing template context');
    }
};

MenioModel.__find = function (rootScope) {
    return function (selector, index) {
        var scope;

        if (!selector) {
            throw new Error('Missing selector');
        }

        if (index) {
            scope = $(rootScope.find(selector)[index]);
        } else {
            scope = $(rootScope.find(selector));
        }

        scope.$find = MenioModel.__find(scope);
        return scope;
    };
};

MenioModel.prototype.__render = function (html, callback) {
    var $scope = null;
    var $cheerio = $;

    if (_.isString(html)) {
        $scope = $.load(html)(this._documentSelector);
    } else if (typeof Object) {
        $scope = $(html).find(this._documentSelector); // must be DOM
    } else {
        throw new Error('Must be Cheerio DOM object');
    }

    if (this._documentSelectorIndex) {
        try {
            $scope = $($scope[this._documentSelectorIndex]);
        } catch (e) {
            throw new Error('No selector index at "' + this._documentSelectorIndex + '"');
        }
    }

    // monkey patch $scope
    $scope.$find = MenioModel.__find($scope);

    var self = {
        model: {}
    };
    _.extend(self, this._props);


    for (var i = 0; i < this._keys.length; i++) {
        var name = this._keys[i];

        try {
            // DI - scope, cheerio and _
            var opts = this._mappings[i].call(self, $($scope), $cheerio, _);

            // only call next if callback and next
            if (callback && opts && opts.next) {
                callback(null, opts.$scope, self.model);
                return;
            } else {
                if (!self.model[name]) {
                    self.model[name] = opts;
                }
            }
        } catch (e) {
            throw e;
        }

    }

    if (callback) {
        return callback(null, null, self.model);
    } else {
        return self.model;
    }

};

var Menio = function (templateDir) {
    this.templateDirectory = templateDir;
};

Menio.prototype.parse = function (html, templateName, callback) {
    var templateInstance = require(path.join(this.templateDirectory, templateName));

    var compiled = new MenioModel({
        name: templateName,
        template: templateInstance
    });
    return compiled.__render(html, callback);

};

Menio.prototype.render = function (options) {
    if (!options.template) {
        throw new Error('Missing options.template');
    }
    if (!options.data) {
        throw new Error('Missing options.data');
    }

    var templateInstance = require(path.join(this.templateDirectory, options.template));

    var compiled = new MenioModel({
        name: options.template,
        template: templateInstance
    });

    return compiled.__render(options.data, options.callback);

};

module.exports = Menio;