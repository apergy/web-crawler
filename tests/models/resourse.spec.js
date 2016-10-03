'use strict';

const Resource = require('./../../src/models/resource');

const toResource = (url, children) => new Resource({ url, children });

describe('src/models/resource', function () {
    it('should exist', function () {
        expect(Resource).toBeDefined();
    });

    it('should be a class', function () {
        const instance = new Resource();
        expect(instance).toBeDefined();
    });

    describe('#isSameOriginAs(resource)', function () {
        beforeEach(function () {
            this.instance = new Resource({
                url: 'http://www.google.co.uk'
            });
        });

        it('should exist', function () {
            expect(this.instance.isSameOriginAs).toBeDefined();
        });

        it('should be a function', function () {
            expect(typeof this.instance.isSameOriginAs).toBe('function');
        });

        const expectedMatches = [
            [ 'http://www.google.co.uk', 'http://www.google.co.uk', true ],
            [ 'http://google.co.uk', 'http://google.co.uk', true ],
            [ 'https://www.google.co.uk', 'https://www.google.co.uk', true ],
            [ 'https://google.co.uk', 'https://google.co.uk', true ],
            [ '//google.co.uk', '//google.co.uk', true ],
            [ '/index.html', '/index.html', true ],
            [ 'http://www.google.co.uk', 'http://google.co.uk', false ],
            [ 'https://www.google.co.uk', 'https://google.co.uk', false ],
            [ 'http://www.google.co.uk', 'http://goog.le', false ],
            [ '//google.co.uk', '//google.com', false ],
            [ '/index.html', '//goog.le/index.html', false ],
            [ 'https://google.com/index.html', 'https://google.co.uk/index.html', false ]
        ];

        expectedMatches.forEach(expectedMatch => {
            if (expectedMatch[2]) {
                it(`should match "${expectedMatch[0]}" and "${expectedMatch[1]}"`, function () {
                    const left = new Resource({ url: expectedMatch[0] });
                    const right = new Resource({ url: expectedMatch[1] });
                    expect(left.isSameOriginAs(right)).toEqual(expectedMatch[2]);
                });
            } else {
                it(`should not match "${expectedMatch[0]}" and "${expectedMatch[1]}"`, function () {
                    const left = new Resource({ url: expectedMatch[0] });
                    const right = new Resource({ url: expectedMatch[1] });
                    expect(left.isSameOriginAs(right)).toEqual(expectedMatch[2]);
                });
            }
        });
    });

    describe('#isNew(resource)', function () {
        beforeEach(function () {
            this.instance = toResource('http://www.google.co.uk');
        });

        it('should exist', function () {
            expect(this.instance.isNew).toBeDefined();
        });

        it('should be a function', function () {
            expect(typeof this.instance.isNew).toBe('function');
        });

        describe('When resource has no children', function () {
            const expectedNewUrlResults = [
                [ 'http://www.google.co.uk', 'http://www.google.co.uk', false ],
                [ 'http://www.google.co.uk', 'http://www.google.co.uk/about', true ],
                [ 'http://www.google.com', 'http://www.google.com', false ],
                [ 'http://www.google.com', 'http://www.google.com/about', true ],
                [ 'http://www.amazon.co.uk', 'http://www.amazon.co.uk', false ],
                [ 'http://www.amazon.co.uk', 'http://www.amazon.co.uk/about', true ]
            ];

            expectedNewUrlResults.forEach(expectedNewUrlResult => {
                if (expectedNewUrlResult[2]) {
                    it(`should recognise "${expectedNewUrlResult[1]}" as new`, function () {
                        const left = toResource(expectedNewUrlResult[0]);
                        const right = toResource(expectedNewUrlResult[1]);
                        expect(left.isNew(right)).toEqual(expectedNewUrlResult[2]);
                    });
                } else {
                    it(`should not recognise "${expectedNewUrlResult[1]}" as new`, function () {
                        const left = toResource(expectedNewUrlResult[0]);
                        const right = toResource(expectedNewUrlResult[1]);
                        expect(left.isNew(right)).toEqual(expectedNewUrlResult[2]);
                    });
                }
            });
        });

        describe('When resource has children', function () {
            const expectedNewUrlResults = [
                [
                    [ 'http://www.google.co.uk', // Parent
                        [ 'http://www.google.co.uk/about' ] // Child
                    ],
                    'http://www.google.co.uk/contact',
                    true
                ],
                [
                    [ 'http://www.google.co.uk',
                        [ 'http://www.google.co.uk/about' ]
                    ],
                    'http://www.google.co.uk/about',
                    false
                ]
            ];

            expectedNewUrlResults.forEach(expectedNewUrlResult => {
                if (expectedNewUrlResult[2]) {
                    it(`should recognise "${expectedNewUrlResult[1]}" as new`, function () {
                        const children = expectedNewUrlResult[0][1].map(url => toResource(url));
                        const left = toResource(expectedNewUrlResult[0][0], children);
                        const right = toResource(expectedNewUrlResult[1]);
                        expect(left.isNew(right)).toEqual(expectedNewUrlResult[2]);
                    });
                } else {
                    it(`should not recognise "${expectedNewUrlResult[1]}" as new`, function () {
                        const children = expectedNewUrlResult[0][1].map(url => toResource(url));
                        const left = toResource(expectedNewUrlResult[0][0], children);
                        const right = toResource(expectedNewUrlResult[1]);
                        expect(left.isNew(right)).toEqual(expectedNewUrlResult[2]);
                    });
                }
            });
        });

        describe('When resource has grandchildren', function () {
            const expectedNewUrlResults = [
                [
                    [
                        toResource('http://www.google.co.uk', [
                            toResource('http://www.google.co.uk/about', [
                                toResource('http://www.google.co.uk/account')
                            ])
                        ])
                    ],
                    toResource('http://www.google.co.uk/contact'),
                    true
                ],
                [
                    [
                        toResource('http://www.google.co.uk', [
                            toResource('http://www.google.co.uk/contact', [
                                toResource('http://www.google.co.uk/about')
                            ])
                        ])
                    ],
                    toResource('http://www.google.co.uk/about'),
                    false
                ]
            ];

            expectedNewUrlResults.forEach(expectedNewUrlResult => {
                if (expectedNewUrlResult[2]) {
                    it(`should recognise "${expectedNewUrlResult[1]}" as new`, function () {
                        const left = expectedNewUrlResult[0][0];
                        const right = expectedNewUrlResult[1];
                        expect(left.isNew(right)).toEqual(expectedNewUrlResult[2]);
                    });
                } else {
                    it(`should not recognise "${expectedNewUrlResult[1]}" as new`, function () {
                        const left = expectedNewUrlResult[0][0];
                        const right = expectedNewUrlResult[1];
                        expect(left.isNew(right)).toEqual(expectedNewUrlResult[2]);
                    });
                }
            });
        });
    });

    describe('#addChild(resource)', function () {
        beforeEach(function () {
            this.instance = toResource('http://www.google.co.uk');
        });

        it('should exist', function () {
            expect(this.instance.addChild).toBeDefined();
        });

        it('should be a function', function () {
            expect(typeof this.instance.addChild).toBe('function');
        });

        it('should add a child resource', function () {
            const child = toResource('http://www.googe.co.uk/contact');
            const instance = this.instance.addChild(child);
            expect(instance.children).toContain(child);
        });

        it('should return itself', function () {
            const child = toResource('http://www.googe.co.uk/contact');
            const instance = this.instance.addChild(child);
            expect(instance).toBe(this.instance);
        });
    });

    describe('#toString()', function () {
        beforeEach(function () {
            this.instance = toResource('http://www.google.co.uk');
        });

        it('should exist', function () {
            expect(this.instance.toString).toBeDefined();
        });

        it('should be a function', function () {
            expect(typeof this.instance.toString).toBe('function');
        });

        describe('When resource has no children', function () {
            it('should output the first level correctly', function () {
                expect(this.instance.toString()).toEqual('└─── http://www.google.co.uk');
            });
        });

        describe('When resource has children', function () {
            it('should output the first and second level correctly', function () {
                const instance = toResource('http://www.google.co.uk', [
                    toResource('http://www.google.co.uk/contact')
                ]);
                instance.children[0].level = 1; // TODO: Should be nicer
                expect(instance.toString()).toEqual('└─── http://www.google.co.uk\n    └─── http://www.google.co.uk/contact');
            });
        });
    });
});
