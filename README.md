# ezMosaic

## Demo & Examples

[http://www.ezramorse.com/js/ezMosaic/demo/demo.html](http://www.ezramorse.com/js/ezMosaic/demo/demo.html)

## Example Usage

### HTML

```html
<div class="squareBox">
	<ul class="mosaic">
		<li><img src="img/html5.png"></li>
		<li><img src="img/css3.png"></li>
		<li><img src="img/js.png"></li>
	</ul>
</div>
```

### jQuery (requires GSAP too)

Use the plugin as follows:

```js
// Initialize and Play the Mosaic 
$('.mosaic').ezMosaic();
```

### CSS

The container parent ('squareBox' in this example) sets the dimensions of the mosaic. It is best to set it to a fixed height (or aspect ratio), so that when the images are 
removed from within the size does not readjust. Most my tests were on square boxes so issues may exist with rectangles that should be relatively easy to fix. Prior to the
pixel analysis of the images **they must be visible** in the browser in order to get their dimensions, put them on a canvas and analyze them. Adjust their opacity to make
them invisible

```css
.squareBox {
    width:100%;
    position:relative;
    display:inline-block;
    width:400px;
    height:400px;
    margin:100px;
}

ul.mosaic {
   list-style:none;
}

.moasic img {
   opacity:.01;
}
```

## Arguments
| Name | Default | Description |
| :--------------- | :-------------- | :-------------------------------------------------------- | 
| **size** | 2 | Percent of parent that a single mosaic block should fill. A lower value will produce a more detailed image, but requires more CPU to process and animate |
| **transition** | 1.5  | Time (in seconds) that it takes to readjust mosaic blocks to next image |
| **time** | 5  | Amount of time (in seconds) to show mosaic slide before transition |
| **autoPlay** | true | Boolean flag that controls if animation starts after initialization |
| **autoLoad** | true | Boolean flag to control if the image processing and div creation should begin immediately. Very useful for delaying it so it does not impact other animations during CPU load  |
| **colorTransition** | 0 | Time (in seconds) to change the color of the mosaic during transition animation. A value of 0 reduces overhead. |
| **transitionVariance** | .25 | The variance is the maximum time (in seconds) added to each transition tween to make it appear irregular |
| **repeat** | -1 | The number of times to cycle through transitions, where '-1' is infinite |
| **zMin** | 100 | Minimum z-index to assign to mosaic blocks. Useful for separating them for GPU acceleration  |
| **zMax** | 300 | Maximum z-index to asign to mosaic blocks |
| **alphablend** | false | Accepts {r: x, g: y, b: z} object. This will attempt to manually blend the alpha layer of semi-transparent blocks in order to eliminate animations with divs that require alpha blending in real-time  |
| **alphaThreshhold** | .25 | Ignores blocks that are less visible than the given threshold |
| **ease** | 'Linear.easeNone' | Ease to apply to transitions. Refer to greensock's easing guidelines |
| **dotClass** | 'mosaicDot' | CSS Style to apply to the mosaic blocks |
| **dotStyle** | {padding :'1px'} | Object with CSS properties applied to the main mosaic block |
| **innerDotStyle** | {width:'100%', height:'100%'} | Object with CSS properties applied to the inner mosaic block that contains color |

## Methods
| Name | Description |
| :--------------- | :-------------------------------------------------------- | 
| **createDivs()**| Only needs to be run if 'autoLoad' argument is set to false |
| **play(p)**| Only needs to be run if 'autoPlay' argument is set to false. '*p*' is used to jump to a position in the animation |
| **stop(p)**| Pauses the animation. '*p*' is used to jump to a position in the animation |

## Installation

* Include [Greensock](https://greensock.com/)
* Include 'ezMosaic.js' in your html file (preferably the footer)

## Notes

* Requires jQuery.
* Requires Greensock GSAP.
* This is still in beta form. I just wrote for my site and will support if here is any interest.
* There may be a variety of issues with using images that are not the same size or using bounding parents that have unusual aspect ratios. Fixing most of this is minor (css). I will incorporate any bugfixes for these issues.
* Have fun

## License

This plugin is available under:
[the MIT license](http://mths.be/mit)
[The GPL license](http://www.gnu.org/copyleft/gpl.html)
