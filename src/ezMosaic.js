/**
 * An image carousel effect using jQuery and Greensock
 *
 * Divides an image into squares and moves them around to form the next image in the sequence
 *
 * @date        2014-11-30
 * @version     0.0.1
 * @copyright   Copyright (c) 2014 Ezra Morse <me@ezramorse.com>
 * @license     Released under the MIT and GPL licenses
 * @author      Ezra Morse <me@ezramorse.com>
 */
(function( $ ) {
    $.fn.ezMosaic = function (options) {

        var t = this;
        t.options = $.extend({
            size: 2,
            transition: 1.5,
            autoPlay: true,
            autoLoad: true,
            colorTransition: 0,
            transitionVariance:.25,
            time: 5,
            repeat: -1,
            zMin: 100,
            zMax: 300,
            alphaBlend: false,
            ease: 'Linear.easeNone',
            assigment: 'random',
	    dotClass: 'mosaicDot',
            dotStyle: {
                'padding' :'1px'
            },
            innerDotStyle: {
                width:'100%',
                height:'100%'
            },
            alphaThreshhold:.25,
            slides: []
        }, options);

        var e = this.filter("ul").first();

        t.element = e;

        t.imagesLoaded  = false;
        t.imagesProcessed = false;
        t.divsCreated = false;
        t.maxDots = 0;
        t.dotData = [];
        t.dotDataFinished = [];
        t.dots = [];

        t.tl = new TimelineMax({repeat: t.options.repeat});
        t.tl.pause(0, true);

        t._init = function () {

            if (!t.imagesLoaded)
                return this;

            var replacement = $('<div class="'+t.element[0].className+'"/>');
            t.element.replaceWith(replacement);
            t.element = replacement;

            for (var i = 0; i < t.options.slides.length; i++) {

                var img = t.options.slides[i].image;
                var iHeight = t.options.slides[i].height;
                var iWidth = t.options.slides[i].width;

                var canvas = $('<canvas/>')[0];

                canvas.width = t.width;
                canvas.height = t.height;

                if (iWidth / iHeight >= t.width / t.height) {
                    var h = iHeight / (iWidth / t.width);
                    canvas.getContext('2d').drawImage(img, 0, (t.height - h) / 2, t.width, h);
                } else {
                    var w = iWidth / (iHeight / t.height);
                    canvas.getContext('2d').drawImage(img, (t.width - w) / 2, 0, w, t.height);
                }

                var d = [];
                var fx = 0;
                var fy = 0;
                var dots = 0;

                t.dotData[i] = [];
                var pD = canvas.getContext('2d').getImageData(0, 0, t.width, t.height).data;

                var pixelSize = Math.floor((t.options.size/100) * t.width);
                for (var y = 0; y < t.height; y += pixelSize) {
                    t.dotData[i][fy] = [];
                    for (var x = 0; x < t.width; x += pixelSize) {
                        var p = [0, 0, 0, 0];
                        var f = 0;
                        for (var dy = 0; dy < pixelSize && y + dy < t.height; dy++)
                            for (var dx = 0; dx < pixelSize && x + dx < t.width; dx++) {

                                var o = ((y + dy) * t.width * 4) + (x + dx) * 4;
                                p[0] += pD[o];
                                p[1] += pD[o + 1];
                                p[2] += pD[o + 2];
                                p[3] += pD[o + 3];
                                f++;
                            }

                        var pf = false;

                        if (f > 0) {
                            p[0] = p[0] / f;
                            p[1] = p[1] / f;
                            p[2] = p[2] / f;
                            p[3] = (p[3] / f) / 255;
                            if (p[3] > t.options.alphaThreshhold) {

                                if (t.options.alphaBlend) {
                                    var pt = [];
                                    pt[0] = parseInt((p[0] * p[3] * 100) + (t.options.alphaBlend.r * 100 * (1 - p[3])))/100;
                                    pt[1] = parseInt((p[1] * p[3] * 100) + (t.options.alphaBlend.g * 100 * (1 - p[3])))/100;
                                    pt[2] = parseInt((p[2] * p[3] * 100) + (t.options.alphaBlend.b * 100 * (1 - p[3])))/100;
                                    pt[3] = 1;

                                    p = pt;
                                }

                                pf = p;
                                dots++;
                            }
                        }
                        t.dotData[i][fy][fx] = pf;
                        fx++;
                    }
                    fy++;
                    fx = 0;
                }

                if (t.maxDots < dots)
                    t.maxDots = dots;
                $(canvas).remove();
                t.dotDataFinished.push(i);
                if (t.dotDataFinished.length >= t.options.slides.length) {
                    t.imagesProcessed = true;
                    if (t.options.autoLoad)
                        return t.createDivs();
                    else
                        return this;
                }

            }

        };

        t.createDivs = function () {

            if (!t.imagesProcessed)
                return this;

            var css = {
                position: 'absolute',
                width: t.options.size+'%',
                height: t.options.size+'%'
            };
            $.extend(css, t.options.dotStyle);

            var dot = $('<div/>', {css: css, class:t.options.dotClass });
            var innerDot = $('<div/>', {css: t.options.innerDotStyle});

            //dot.append(innerDot);
            for (k = 0; k < t.maxDots; k++) {
                var newDot = dot.clone();
                var newInner = innerDot.clone();
                var z = parseInt(Math.random()*(t.options.zMax - t.options.zMin) + t.options.zMin);
                newDot.css('z-index', z);
                newDot.append(newInner);
                t.element.append(newDot);
                t.dots.push({dot: newDot, inner: newInner, steps: []});
            }

            switch (t.options.assignment) {

                case 'random' :
                default       : for (var k = 0; k < t.dotData.length; k++) {
                    var dotPositions = [];
                    for (var y = 0; y < t.dotData[k].length; y++) {

                        for (var x = 0; x < t.dotData[k][y].length; x++) {

                            if (t.dotData[k][y][x] !== false) {
                                dotPositions.push({color: t.dotData[k][y][x], x: x, y: y});
                            }
                        }
                    }
                    var positionsRandomized = [];

                    while (dotPositions.length > 0) {
                        var idx = Math.floor(Math.random() * dotPositions.length);

                        positionsRandomized.push(dotPositions[idx]);
                        dotPositions.splice(idx, 1);
                    }

                    for (var j=0; j < t.dots.length; j++) {
                        if (j < positionsRandomized.length) {
                            t.dots[j].steps[k] = positionsRandomized[j];

                        }
                    }
                }
                    break;
            }

            var w = t.width;
            var h = t.height;
            var idx = 0;

            for (var j=0; j < t.dots.length; j++) {
                for (var k = 0; k <= t.options.slides.length; k++) {
                    if (k == t.options.slides.length)
                        idx = 0;
                    else idx = k;

                    if (idx in t.dots[j].steps) {
                        var d = {
                            rotation: 90*k,
                            top: t.dots[j].steps[idx].y* t.options.size + '%',
                            left: t.dots[j].steps[idx].x* t.options.size + '%',
                            delay: (t.options.time * k),
                            ease: t.options.ease
                        };
                        var d2 = {
                            'background-color': 'rgba('+
                                parseInt(t.dots[j].steps[idx].color[0])+','+
                                parseInt(t.dots[j].steps[idx].color[1])+','+
                                parseInt(t.dots[j].steps[idx].color[2])+','+
                                t.dots[j].steps[idx].color[3]+')',
                            delay: (t.options.time * k),
                            ease: t.options.ease
                        }

                        if (k > 0) {
                            var v = ((Math.random() * 2 * t.options.transitionVariance) - t.options.transitionVariance);
                            d.delay += (k - 1) * t.options.transition + v;
                            d2.delay += (k - 1) * t.options.transition + v;
                        }

                        if (k == 0) {
                            t.tl.insert(TweenMax.set(t.dots[j].dot, d));
                            t.tl.insert(TweenMax.set(t.dots[j].inner, d2));
                        } else {
                            t.tl.insert(TweenMax.to(t.dots[j].dot, t.options.transition, d));
                            t.tl.insert(TweenMax.to(t.dots[j].inner, t.options.colorTransition, d2));
                        }

                    } else {
                        var d = {
                            rotation: 90*k,
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            delay: (t.options.time * k),
                            ease: t.options.ease
                        };

                        var d2 = {
                                'background-color': 'rgba(' +
                                    parseInt(Math.random() * 255) + ',' +
                                    parseInt(Math.random() * 255) + ',' +
                                    parseInt(Math.random() * 255) + ',' +
                                    0 + ')',
                                delay: (t.options.time * k),
                                ease: t.options.ease
                        };

                        if (t.options.alphaBlend) {
                            d2['background-color'] = 'rgba(' +
                                t.options.alphaBlend.r + ',' +
                                t.options.alphaBlend.g + ',' +
                                t.options.alphaBlend.b + ',' +
                                0 + ')';
                        }

                            if (k > 0) {
                            var v = ((Math.random() * 2 * t.options.transitionVariance) - t.options.transitionVariance);
                            d.delay += (k - 1) * t.options.transition + v;
                            d2.delay += (k - 1) * t.options.transition + v;
                        }

                        if (k == 0) {
                            t.tl.insert(TweenMax.set(t.dots[j].dot, d));
                            t.tl.insert(TweenMax.set(t.dots[j].inner, d2));
                        } else {
                            t.tl.insert(TweenMax.to(t.dots[j].dot, t.options.transition, d));
                            t.tl.insert(TweenMax.to(t.dots[j].inner, t.options.colorTransition, d2));
                        }

                    }

                }

            }

            if (t.options.autoPlay)
                t.tl.play(0);

            t.divsCreated = true;

            return this;
        };

        t.stop = function (p) {

            var pos = null;
            if (p)
                pos = p;


            t.tl.pause(pos);

            return this;

        };

        t.play = function (p) {

            var pos = null;
            if (p)
                pos = p;

            if (!t.imagesLoaded)
                return this;

            if (!t.imagesProcessed)
                t._init();

            if (!t.divsCreated)
                t.createDivs();

            t.tl.play(pos);

            return this;
        };

        t.images = e.find('li img');
        t.images.fadeTo(0,.001);

        var iv = setInterval( function () {

            var fail = false;

            t.images.each(function (j, i) {
                if ($(i).innerHeight() < 1) {
                    fail = true;
                }
            });

            if (t.element.is(':visible') && !fail) {
                clearInterval(iv);

                t.height = t.element.parent().innerHeight();
                t.width = t.element.parent().innerWidth();

                t.images.each(function (j, i) {
                    $(i).attr('crossOrigin', 'anonymous');
                    t.options.slides.push({image: i, height: $(i).innerHeight(), width: $(i).innerWidth()});
                    $(i).hide();
                });

                t.imagesLoaded = true;

                if (t.options.autoLoad)
                    t._init();
            }
        }, 100);

        return this;

     }
}( jQuery ));
