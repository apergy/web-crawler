'use strict';

const rewire = require('rewire');

const WebCrawler = rewire('./../src/crawler');

describe('src/crawler', function () {
    it('should exist', function () {
        expect(WebCrawler).toBeDefined();
    });

    it('should be a class', function () {
        const instance = new WebCrawler();
        expect(instance).toBeDefined();
    });

    describe('#load(resource)', function () {
        beforeEach(function () {
            this.fakeRequest = jasmine.createSpy('fake-request');
            this.fakeCallback = jasmine.createSpy('fake-callback');
        });

        beforeEach(function () {
            this.revert = WebCrawler.__set__({
                request: this.fakeRequest
            });

            this.instance = new WebCrawler({
                callback: this.fakeCallback
            });
        });

        afterEach(function () {
            this.revert();
        });

        it('should exist', function () {
            expect(this.instance.load).toBeDefined();
        });

        it('should be a function', function () {
            expect(typeof this.instance.load).toBe('function');
        });

        describe('When no links found', function () {
            it('should not call the callback', function () {
                this.fakeRequest.and.callFake((url, callback) => {
                    return callback(null, {}, `
                        <body>
                            <h1>Nothing here...</h1>
                        </body>
                    `);
                });
                this.instance.load('http://www.empty-page.com');
                expect(this.fakeCallback).not.toHaveBeenCalled();
            });
        });

        describe('When empty link is found', function () {
            it('should not call the callback', function () {
                this.fakeRequest.and.callFake((url, callback) => {
                    return callback(null, {}, `
                        <body>
                            <h1>Nothing here...</h1>
                            <a href="">Yup, nothing...</a>
                        </body>
                    `);
                });
                this.instance.load('http://www.empty-page.com');
                expect(this.fakeCallback).not.toHaveBeenCalled();
            });
        });

        describe('When one link is found', function () {
            it('should call the callback once', function () {
                this.fakeRequest.and.callFake((url, callback) => {
                    return callback(null, {}, `
                        <body>
                            <h1>Ooo, something...</h1>
                            <a href="http://www.google.co.uk">Google</a>
                        </body>
                    `);
                });
                this.instance.load('http://www.non-empty-page.com');
                expect(this.fakeCallback).toHaveBeenCalled();
                expect(this.fakeCallback.calls.count()).toEqual(1);
            });
        });

        describe('When a few links are found', function () {
            it('should call the callback a few times', function () {
                this.fakeRequest.and.callFake((url, callback) => {
                    return callback(null, {}, `
                        <body>
                            <h1>Ooo, lots...</h1>
                            <a href="http://www.google.co.uk">Google</a>
                            <a href="http://www.yahoo.co.uk">Yahoo</a>
                            <a href="http://www.amazon.co.uk">Yahoo</a>
                        </body>
                    `);
                });
                this.instance.load('http://www.full-page.com');
                expect(this.fakeCallback).toHaveBeenCalled();
                expect(this.fakeCallback.calls.count()).toEqual(3);
            });
        });
    });
});
