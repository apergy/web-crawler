'use strict';

const url = require('url');

const defaults = require('lodash/defaults');
const every = require('lodash/every');
const repeat = require('lodash/repeat');

class Resource {
    /**
     * Assigns given defaulted options to the current instance
     * @param  {Object} options
     * @return {Void}
     */
    constructor (options) {
        Object.assign(this, defaults(options, {
            level: 0,
            url: null,
            children: []
        }));
    }

    /**
     * Returns whether the current resource url has the
     * same origin as the given resource url or not
     * @param  {Resource} resource
     * @return {Boolean}
     */
    isSameOriginAs (resource) {
        const left = url.parse(this.url, false, true);
        const right = url.parse(resource.url, false, true);
        return left.host === right.host;
    }

    /**
     * Returns whether the given resource is new, by checking
     * the current resource url and recursively checking its children
     * @param  {Resource} resource
     * @return {Boolean}
     */
    isNew (resource) {
        const left = url.parse(this.url, false, true);
        const right = url.parse(resource.url, false, true);

        if (this.children.length === 0) {
            return left.pathname !== right.pathname;
        } else {
            return left.pathname !== right.pathname &&
                every(this.children.map(child => child.isNew(resource)));
        }
    }

    /**
     * Adds a child resource to the current resource then returns
     * the current resource for easy chaining of methods
     * @param {Resource} resource
     * @return {Resource}
     */
    addChild (resource) {
        this.children = this.children.concat([ resource ]);
        return this;
    }

    /**
     * Returns a console string tree representation of the all the
     * resource urls, this happens recursively taking into account level
     * @return {String}
     */
    toString () {
        const spaces = repeat('    ', this.level) + '└───';
        const children = this.children.reduce((acc, child) => acc + child.toString(), '');
        return (this.level !== 0 ? '\n' : '') + spaces + ' ' + this.url + children;
    }
}

module.exports = Resource;
