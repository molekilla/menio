const path = require('path');
const $ = require('cheerio');
const fs = require('fs');
const _ = require('underscore');

export interface RenderCallback {
	(err:any, scope:any, model:any): any;
}

export interface ParseTemplate {
	name:string;
	template: {
		context:any;
		props:any;
	}
}

export class MenioModel {
	private _keys: string[];
	private _mappings: any[];
	private _name: string;
	private _props: any;
	private _documentSelectorIndex:number;
	private _documentSelector:string;

    constructor(options:ParseTemplate) {
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
	}

	static __find(rootScope) {
		return function(selector:string, index:number) {
			let scope;

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

// TODO: Function overloading?
	__render(html, callback: RenderCallback) {
		var $scope = null;
		var $cheerio = $;

		if (_.isString(html)) {
			$scope = $.load(html)(this._documentSelector);
		} else if (_.isObject(html)) {
			$scope = $(html).find(this._documentSelector); // must be DOM
		} else {
			return callback(new Error('Must be Cheerio DOM object'), null, null);
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

		let self = {
			model: {}
		};
		_.extend(self, this._props);


		for (let i = 0; i < this._keys.length; i++) {
			let name = this._keys[i];

			try {
				// DI - scope, cheerio and _
				let opts = this._mappings[i].call(self, $($scope), $cheerio, _);

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
}

export class Menio {
	templateDirectory:string;
	constructor(templateDir:string) {
		this.templateDirectory = templateDir;
	}

	parse(html:string, templateName:string, callback:RenderCallback) {
		var templateInstance = require(path.join(this.templateDirectory, templateName));

		var compiled = new MenioModel({
			name: templateName,
			template: templateInstance
		});
		return compiled.__render(html, callback);

	};

	render(options:{ template:string, data:any, callback:RenderCallback }) {
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

	}
}

