# Web Crawler [![Build Status](https://travis-ci.org/apergy/web-crawler.svg?branch=master)](https://travis-ci.org/apergy/web-crawler)
A simple node app to do a quick crawl through a website to produce a sitemap.

## Requirements
Please ensure you have NodeJS v6.7.0 installed, this has been developed and
tested in this version only. It may work in older version, but do so at your
own risk.

## Installation
You will need to do the following steps in order to get up and running. Ensure you
have the project directory as your current working directory within your terminal.
- `npm install`

## Testing
The test suite consists of running linting, unit tests and unit tests with coverage
- `npm test` will run them all
- `npm run test:eslint` will run the linting
- `npm run test:unit` will run the jasmine unit tests
- `npm run test:coverage` will run unit tests with istanbul coverage

## Running the crawler
*WARNING*: Large sites will take considerably longer to complete, if you want to
see if it works quickly, I'd suggest a website with no more than 500-1000 internal pages.
- `node index.js https://twitter.com/`

### To do
- Make crawler take into account `href` attributes that do not contain full hostname.
- Make crawler ignore urls that may result in a downloading unexpected files.
- Make the crawler use an internal queue, to ensure nothing lock up.
- Add ability to catalog a pages static assets before continuing to crawl.
- Add a CLI tool e.g. `web-crawl https://www.google.co.uk`.
- Add an indeterminate progress meter to user confidence it is running ok.
