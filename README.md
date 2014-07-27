# Pointy: Pointer Events polyfill for jQuery [![Build Status](https://secure.travis-ci.org/vistaprint/PointyJS.png?branch=master)](http://travis-ci.org/vistaprint/PointyJS)

[View the project page](http://vistaprint.github.io/PointyJS)

Pointy is a polyfill for the [pointer events API](http://www.w3.org/TR/pointerevents/). Pointy targets support
for all browsers including IE7+; it works by transforming touch and mouse events into pointer events on devices
that don't natively support pointer events. All you need to do is bind to pointer events and let Pointy do the rest.

Pointy has no dependencies other than jQuery.

[Download pointy.js](http://vistaprint.github.io/PointyJS/pointyjs.zip)

## Compatibility

This library is developed by [Vistaprint](http://www.vistaprint.com) and is tried and tested. It should work on all browsers, however, we target support for the following browsers:

* Internet Explorer 7+
* Chrome 11+
* Chrome on Android
* Android Browser (4.0+)
* Firefox 23+
* Safari 5+
* iOS Mobile Safari 6+

### Makes Pointer Events better

Pointy.js is also useful when working with devices that support pointer events natively. It adds utilities and standardizes events similar to how jQuery does with mouse events.

### Handles edge-cases well

There are many little edge cases when you try to work with mouse and touch events at the same time. Such as when you call ``preventDefault`` on a touchstart or touchend, it will prevent the emulated mouse event that follows (mousedown and mouseup, respectively), and then it also cancels the native click event from triggering. Whereas, calling ``preventDefault`` on a mousedown or a mouseup event does not prevent the native click event from trigger. Additionally, there is no native way to cancel the click event from trigger from pointer events. Pointy fixes this by adding the utility method ``preventClick`` to the Event object passed.

### Internet Explorer 10

IE10 implemented MSPointerEvents, which was prior to the w3 standardized submission. There are a few minor differences between MSPointerEvents and the standardized Pointer Events, so Pointy transforms all of those MSPointer events into standardized pointer events just like it does for mouse and touch events.

## Inclusion

Include pointy.js in your JavaScript bundle or add it to your HTML page like this:

```html
<!-- pointy.js requires jQuery -->
<script type="text/javascript" src="/path/to/pointy.js"></script>
```

If you intend to use it, you can include the additional gestures library.

```html
<script type="text/javascript" src="/path/to/pointy.gestures.js"></script>
```

The script must me loaded prior to binding to any pointer events of any element on the page.

### Minified

Run `grunt build` to build a minifed version of Pointy using [Uglify](https://github.com/mishoo/UglifyJS). The minified file is saved to `dist/pointy.min.js` and `dist/pointy.gestures.min.js` (optional) or you can download a pre-minified version: [pointy.min.js](http://vistaprint.github.io/PointyJS/dist/pointy.min.js) and [pointy.gestures.min.js](http://vistaprint.github.io/PointyJS/dist/pointy.gestures.min.js).

## Usage

Pointy allows you to attach only to pointer events and let it deal with support all the other types of events. You no longer attach to mouse or touch events, only attach to pointer events.

### Events

#### Included by pointy.js

* `pointerdown`: abstraction on top of mousedown and touchstart
* `pointerup`: abstraction on top of mouseup and touchend
* `pointermove`: abstraction on top of mousemove and touchmove
* `pointerover`: abstraction on top of mouseover (no touch equivalent)
* `pointerout`: abstraction on top of mouseout (no touch equivalent)

### Included by pointy.gestures.js

Pointy offers an extension file, called `pointy.gestures.js`, which adds utilities similar to [jQuery mobile's touch events](http://api.jquerymobile.com/category/events).

* `press`: Triggered after a quick, complete interaction event. (similar to JQM's `tap`)
* `presshold`: Triggered after a sustained complete interaction event. (similar to JQM's `taphold`)
* `sweep`: Triggered when a horizontal drag occurs within a short time duration. The event object will contain ``direction`` indicating right or left. (similar to JQM's `swipe`)
* `sweepleft`: Triggered when a sweep event occurs moving in the left direction. (similar to JQM's `swipeleft`)
* `sweepright`: Triggered when a sweep event occurs moving in the right direction. (similar to JQM's `swiperight`)

### Event object

The ``jQuery.Event`` object passed is modified by Pointy to standardize it between all the user input apis (mouse, touch and pointer events).

#### Pointer Type

``event.pointerType`` will be: touch, pen or mouse.

#### Buttons

``event.buttons`` will be a bitmask of buttons currently depressed. [See spec](http://www.w3.org/TR/pointerevents/#chorded-button-interactions).

Values:

* ``0`` no buttons are pressed.
* ``1`` means either touch contact (finger), pen or the left-mouse button is depressed.
* ``2`` means the right-mouse button is depressed.
* ``4`` means the middle-mouse button is depressed.
* ``8`` means the x1 (back mouse button) is depressed.
* ``18`` means the x1 (forward mouse button) is depressed.
* ``32`` means the eraser button on a pen is depressed.

The bitmask of these identifies which buttons are pressed, such as, if both the left and right mouse buttons are depressed ``event.buttons`` will be 3.

#### Pointer ID

``event.pointerId`` standardized identifier to keep track of various pointers.

The ``pointerId`` is always 1 for the mouse. It however provides a unique identifer for touch-driven events, which you can compare across the pointerdown, pointermove and pointerend events to keep track of separate fingers.

#### Prevent Click

``event.preventClick()`` is a utility to prevent the native click event following a pointer event from stopping itself. This can be used to prevent navigation on a ``pointerdown`` event, or from within the ``press`` gesture event you can prevent navigation only on touch devices like this:

```js
$('a').on('pointerdown', function (event) {
	if (event.pointerType === 'touch') {
		event.preventClick();
		toggleDropDownMenu();
	}
});
```

You can check whether the following click event has been prevented using ``event.isClickPrevented()``.

### Examples

```js
$('a').on('pointerdown', function (event) {

	// Getting coordinates
	var top = event.clientX;
	var left = event.clientY;

	// Detecting the underlying event
	var underlyingEvent = e.originalEvent; // could be a MouseDown event, TouchStart event, or actual PointerDown event.

	// continue on your way...
});
```

```js
// opening a context menu
$('a').on({
	// if they either press down for awhile; like people do on mobile devices.
	'presshold': openMenu,
	// or we can get the contextmenu event, such as from right clicking
	'contextmenu': openMenu
});
```

For more examples, look at [Skinny.js](https://github.com/vistaprint/SkinnyJS) which uses pointy.js within many of its plugins.

## Origin
pointy.js was written at [Vistaprint](http://www.vistaprint.com).

Vistaprint empowers more than 15 million micro businesses and consumers annually with affordable, professional options to make an impression. With a unique business model supported by proprietary technologies, high-volume production facilities, and direct marketing expertise, Vistaprint offers a wide variety of products and services that micro businesses can use to expand their business. A global company, Vistaprint employs over 4,100 people, operates more than 25 localized websites globally and ships to more than 130 countries around the world. Vistaprint's broad range of products and services are easy to access online, 24 hours a day at www.vistaprint.com.