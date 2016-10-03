'use strict';

const $ = require('cheerio');
var request = require('request');
const noop = require('lodash/noop');
const defaults = require('lodash/defaults');

const Resource = require('./models/resource');

class WebCrawler {
    /**
     * Assigns given defaulted options to the current instance
     * @param  {Object} options
     * @return {Void}
     */
    constructor (options) {
        Object.assign(this, defaults(options, {
            callback: noop
        }));
    }

    /**
     * Loads a resource, parses the response body for "<a>" tags and
     * then creates a new resource from the "href" attribute - the
     * configured callback is called with the parent and new resource
     * @param  {Resource} resource
     * @return {Void}
     */
    load (resource) {
        request(resource.url, (error, response, body) => {
            $('a', body).each((index, a) => {
                const url = $(a).attr('href');
                if (url) {
                    const newResource = new Resource({
                        url,
                        level: resource.level + 1
                    });
                    return this.callback(null, resource, newResource);
                }
            });
        });
    }
}

module.exports = WebCrawler;
