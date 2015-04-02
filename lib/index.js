var path = require('path');
var $ = require('cheerio');
var fs = require('fs');
var  _ = require('underscore');

var MenioModel = function(options) {
  this._keys =_.keys(options.template.props);
  this._mappings = _.values(options.template.props);
  this._name = options.name;
  this._props = options.template.props;

  // set document context
  if (options.template.context) {
    this._documentSelector = options.template.context;
  } else {
    throw new Error('Missing template context');
  }
};

MenioModel.prototype.__render = function(html, callback) {
  var $scope = null;
  var $cheerio = $;
  console.log(typeof html);
  if (_.isString(html)) {
    $scope = $.load(html)(this._documentSelector);
  } else if (typeof Object) {
    $scope = $(html).find(this._documentSelector); // must be DOM
  } else {
    throw new Error('Must be Cheerio DOM object');
  }

  var self = {
    model: {}
  };
    _.extend(self, this._props);


  for (var i=0;i<this._keys.length;i++) {
    var name = this._keys[i];

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
  }

  if (callback) {
        return callback(null, null, self.model);
  } else {
    return self.model;
  }

};

var Menio = function(templateDir) {
    this.templateDirectory = templateDir;
};

Menio.prototype.parse = function(html, templateName, callback) {
  var templateInstance = require(path.join(this.templateDirectory, templateName));

  var compiled = new MenioModel({ name: templateName, template: templateInstance });
  return compiled.__render(html, callback);

};


module.exports = Menio;
