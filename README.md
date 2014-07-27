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

##### pointerdown

Dispatched when a pointer enters the active state. For mouse devices, this is when the device goes from no buttons depressed to at least one button depressed. Subsequent button pressing on mouse devices only trigger a `pointermove` event. For touch and pen devices, this is when physical contact is made.

Pointy abstracts `mousedown` and `touchstart` events.

##### pointerup

Dispatched when a pointer leaves the active state. For mouse devices, this is when the device goes from at least one button depressed to no buttons depressed. For touch and pen devices, this is when physical contact is removed.

Pointy abstracts `mouseup` and `touchend` events.

##### pointercancel

Dispatched when a pointer is determined to be unlikely to produce further events. Such as on a mobile device, when the user starts to touch and then proceeds to zoom or pan the page. Other times this may be triggered is when the device's screen orientation is changed while a pointer is active, the user starts using more inputs than the device supports (such as on five-finger contact screens and the user attempts to use more than five fingers).

Pointy abstracts `touchcancel` events, there is no mouse equivalent. Pointy does not attempt detect situations that may cause a `pointercancel` event directly. User agents are responsible for determining when it thinks it should trigger cancel events, as such, each device may trigger cancel events for different reasons.

##### pointermove

Dispatched when a pointer changes coordinates, button state, pressure, tilt, or contact geometry.

Pointy abstracts `mousemove` and `touchmove` events.

##### pointerover

Dispatched when a pointing device is moved into the hit test boundaries of an element.

Pointy abstracts `mouseover`, there is no touch equivalent.

##### pointerout

Dispatched when a pointing device is moved out of the hit test boundaries of an element.

Pointy abstracts `mouseout`, there is no touch equivalent.

##### pointerenter

Dispatched when a pointing device hits the boundaries of an element or one of its descendants.
This is similar to `pointerover`, however `pointerover` does not consider descendants.

Pointy abstracts `MSPointerOver` for IE10, otherwise it uses jQuery's `mouseenter` polyfill, there is no touch equivalent.

##### pointerleave

Dispatched when a pointing device is moved off of the hit test boundaries of an element and all of its descendants.
This is similar to `pointerout`, however `pointerout` does not consider descendants.

Pointy abstracts `MSPointerOut` for IE10, otherwise it uses jQuery's `mouseleave` polyfill, there is no touch equivalent.

#### Included by pointy.gestures.js

Pointy offers a gestures library which adds utilities similar to [jQuery mobile's touch events](http://api.jquerymobile.com/category/events).

##### press

Dispatched after a quick, complete interaction event. This is similar to JQM's `tap` event.

A `press` is determined immediately upon `pointerend`, which means it fires without the 300ms delay on touch devices but by this time we have already determined it to be a complete interaction.

##### presshold

Dispatched after a sustained complete interaction event. Sometimes referred to as a long press. This is similar to JQM's `taphold`.

A `presshold` is determined by holding without significant pointer movement for 750ms.

`$.event.special.press.pressholdThreshold` (default 750) - This value dictates how long (in ms) the user must hold their press before the `presshold` event is dispatched.

##### sweep

Dispatched when a horizontal drag occurs within a short time duration. The event object will contain ``direction`` indicating right or left. This is similar to JQM's `swipe` event.

##### sweepleft

Dispatched when a sweep event occurs moving in the left direction. This is similar to JQM's `swipeleft` event.

##### sweepright

Dispatched when a sweep event occurs moving in the right direction. This is similar to JQM's `swiperight` event.

### The `touch-action` CSS property

Pointy does not implement a polyfill for the `touch-action` CSS property. We recommend setting `touch-action` to `none` for all elements you indent to attach pointer events to through Pointy. This ensures you receive the same events across devices that support native pointer events and those that don't natively.

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

#### Pressure, Width, Height

``event.pressure`` is a noramlized pressure of the pointer represented as a float in the range of [0,1]. When the hardware does not support pressure detection, the value will be 0.5 when any pointer is active (i.e. user is currently touching or a button is down) and 0 otherwise.

``event.width`` and ``event.height`` represent the contact geometry for a pointer. When the hardware cannot provide this, the value will be 0.

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