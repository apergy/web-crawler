'use strict';

const Resource = require('./src/models/resource');
const WebCrawler = require('./src/crawler');

// Take the url from the cli or default it...
const url = process.argv[2] || 'https://twitter.com/';

// The root resource to start from...
const rootResource = new Resource({ url });

const crawler = new WebCrawler({
    callback: function (error, parent, resource) {
        if (rootResource.isSameOriginAs(resource) && rootResource.isNew(resource)) {
            crawler.load(resource);
            parent.addChild(resource);
        }
    }
});

// Get the show on the road...
crawler.load(rootResource);

process.on('exit', function () {
    // Once finished pretty print the console sitemap
    process.stdout.write(rootResource.toString() + '\n');
});
