# pointy.js: Pointer Events polyfill for jQuery [![Build Status](https://secure.travis-ci.org/vistaprint/PointyJS.png?branch=master)](http://travis-ci.org/vistaprint/PointyJS)

[View the project page](http://vistaprint.github.io/PointyJS)

pointy.js is a polyfill for the [pointer events API](http://www.w3.org/TR/pointerevents/). pointy.js targets support
for all browsers including IE7+; it works by transforming touch and mouse events into pointer events on devices
that don't natively support pointer events. 

pointy.js allows you to attach only to pointer events and let it deal with support all the other types of events. You no longer need to handle mouse and touch events separately.

pointy.js has no dependencies other than jQuery.

[Download pointy.js](http://vistaprint.github.io/PointyJS/pointyjs.zip)

## Compatibility

This library is developed by [Vistaprint](http://www.vistaprint.com) and is used on our production website. Though it should work on all browsers, we specifically test against the following browsers:

* Internet Explorer 7+
* Chrome 11+
* Chrome on Android
* Android Browser (4.0+)
* Firefox 23+
* Safari 5+
* iOS Mobile Safari 6+

pointy.js even supports IE10, which implemented MSPointerEvents prior to the W3C standardized submission. There are a few minor differences between MSPointerEvents and the standardized Pointer Events, so pointy.js transforms all of those MSPointer events into standardized pointer events just like it does for mouse and touch events.

## Why use pointy.js?

### Standardizes pointer events across all browsers

pointy.js is also useful when working with devices that support pointer events natively. It adds utilities and standardizes events similar to how jQuery does with mouse events.

### Handles edge-cases well

There are numerous edge cases which arise when handling both mouse and touch events. For example: when calling ``preventDefault()`` on a ``touchstart`` or ``touchend`` event, pointy.js will prevent the emulated mouse event that follows (mousedown and mouseup, respectively), and also prevents the native click event from being triggered. In contrast, calling ``preventDefault`` on a ``mousedown`` or ``mouseup`` event does not prevent the native click event from firing. Additionally, there is no native way to cancel the click event from being triggered from pointer events. pointy.js fixes this by adding the utility method ``preventClick()`` to the event object.

## Usage

### Inclusion

Include pointy.js in your JavaScript bundle or add it to your HTML page:

```html
<!-- pointy.js requires jQuery -->
<script type="text/javascript" src="/path/to/pointy.js"></script>
```

Additionally, pointy.guestures can be included, which supports a number of high-level events built on top of pointer events:

```html
<script type="text/javascript" src="/path/to/pointy.gestures.js"></script>
```

The script must me loaded prior to binding to any pointer events of any element on the page.

### Events

#### Included by pointy.js

##### pointerdown

This event is fired when a pointer enters the active state, and abstracts the `mousedown` and `touchstart` events.

For mouse devices, this occurs when the device goes from no buttons depressed to at least one button depressed. Subsequent button pressing on mouse devices only trigger a `pointermove` event. 

For touch and pen devices, this event occurs when an initial touch occurs.

##### pointerup

This event is fired when a pointer leaves the active state, and abstracts the `mouseup` and `touchend` events. For mouse devices, this is when the device goes from at least one button depressed to no buttons depressed. For touch and pen devices, this occurs when touch contact is removed.

##### pointercancel

This event is fired when a pointer is determined to be unlikely to produce further events. For example, on a mobile device, this occurs when the user starts to touch and then proceeds to zoom or pan the page. Other times this may be triggered is when the device's screen orientation is changed while a pointer is active, or if the user starts using more inputs than the device supports (such as on five-finger contact screens and the user attempts to use more than five fingers).

While pointy.js abstracts `touchcancel` events, there is no mouse equivalent. pointy.js does not attempt to detect situations that may cause a `pointercancel` event directly. User agents are responsible for determining when it thinks it should trigger cancel events, as such, each device may trigger cancel events for different reasons.

##### pointermove

This event abstracts the `mousemove` and `touchmove` events, and is fired when a pointer changes coordinates, button state, pressure, tilt, or contact geometry.

##### pointerover

This event abstracts `mouseover`, and is fired when a pointing device is moved into the hit test boundaries of an element.

Note: There is no touch equivalent for this event. 

##### pointerout

This event abstracts `mouseout`, and is fired when a pointing device is moved out of the hit test boundaries of an element.

Note: There is no touch equivalent for this event. 

##### pointerenter

This event is fired when a pointing device hits the boundaries of an element or one of its descendants. This is similar to `pointerover`, except that `pointerover` does not consider descendants.

pointy.js abstracts `MSPointerOver` for IE10, otherwise it uses jQuery's `mouseenter` polyfill.

There is no touch equivalent to this event.

##### pointerleave

This event is fired when a pointing device leaves the hit test boundaries of an element and all of its descendants.
This is similar to `pointerout`, except that `pointerout` does not consider descendants.

pointy.js abstracts `MSPointerOut` for IE10, otherwise it uses jQuery's `mouseleave` polyfill

There is no touch equivalent to this event.

#### Included by pointy.gestures.js

pointy.js offers a gestures library which adds utilities similar to [jQuery mobile's touch events](http://api.jquerymobile.com/category/events).

##### press

This event is fired after a quick, complete interaction event. This is similar to JQM's `tap` event.

A `press` is determined immediately upon `pointerend`, and avoids the 300ms delay on touch devices. pointy.js internally determines the interaction to be complete.

##### presshold

This event is fired after a sustained, complete interaction event (sometimes referred to as a long press). This is similar to JQM's `taphold`.

A `presshold` is defined as a pointer being held in place without significant pointer movement for 750ms.

`$.event.special.press.pressholdThreshold` (default 750) - This value dictates how long (in ms) the user must hold their press before the `presshold` event is fired.

##### sweep

This event is fired when a horizontal drag occurs within a short duration. The event object will contain ``direction`` indicating right or left. This is similar to JQM's `swipe` event.

##### sweepleft

This event is fired when a `sweep` event occurs moving in the left direction. This is similar to JQM's `swipeleft` event.

##### sweepright

This event is fired when a `sweep` event occurs moving in the right direction. This is similar to JQM's `swiperight` event.

### The `touch-action` CSS property

pointy.js does not implement a polyfill for the `touch-action` CSS property. We recommend setting `touch-action` to `none` for all elements you indent to attach pointer events to through pointy.js. This ensures you receive the same events across devices that support native pointer events and those that don't natively.

### Event object

The ``jQuery.Event`` object passed is modified by pointy.js to standardize it between all the user input APIs (mouse, touch and pointer events).

#### Pointer Type

``event.pointerType`` will be: `touch`, `pen`, or `mouse`.

#### Buttons

``event.buttons`` is a bitmask of buttons currently depressed. [See spec](http://www.w3.org/TR/pointerevents/#chorded-button-interactions).

Values:

* ``0`` no buttons are pressed.
* ``1`` means either touch contact (finger), pen or the left-mouse button is depressed.
* ``2`` means the right-mouse button is depressed.
* ``4`` means the middle-mouse button is depressed.
* ``8`` means the x1 (back mouse button) is depressed.
* ``18`` means the x1 (forward mouse button) is depressed.
* ``32`` means the eraser button on a pen is depressed.

The bitmask of these identifies which buttons are pressed. For example: if both the left and right mouse buttons are depressed, ``event.buttons`` will be 3.

#### Pointer ID

``event.pointerId`` is a standardized identifier to keep track of various pointers.

``pointerId`` is always 1 for a mouse. It however provides a unique identifer for touch-driven events, which you can compare across the `pointerdown`, `pointermove` and `pointerend` events to keep track of separate fingers.

#### Pressure, width, height

``event.pressure`` is a normalized pressure of the pointer represented as a float in the range of [0,1]. When the hardware does not support pressure detection, the value will be 0.5 when any pointer is active (i.e. user is currently touching or a button is down) and 0 otherwise.

``event.width`` and ``event.height`` represent the contact geometry for a pointer. When the hardware cannot provide this, the value will be 0.

#### Preventing click events

``event.preventClick()`` is a utility to stop the native click event that follows a pointer event.

This utility especially useful when attempting to prevent navigation from within a pointer event. An example of this:

```js
$('a').on('press', function (event) {
	if (event.pointerType === 'touch') {
		event.preventClick();
		toggleDropDownMenu();
	}
});
```

You can check whether `preventClick()` has been called on a click event using ``event.isClickPrevented()``. These utilities can be used from `pointerdown`, `pointerup`, `pointermove`, `press`, `presshold`, `swipe`, `swipeleft`, and `swiperight`.

Note: The click event cannot always be prevented completely. In cases where pointy.js cannot prevent it from being triggered, it will call `event.preventDefault()` and `event.stopPropagation()` on the event.

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

For more examples, see [Skinny.js](https://github.com/vistaprint/SkinnyJS) which uses pointy.js within many of its plugins.

## Origin
pointy.js was written at [Vistaprint](http://www.vistaprint.com).

Vistaprint empowers more than 15 million micro businesses and consumers annually with affordable, professional options to make an impression. With a unique business model supported by proprietary technologies, high-volume production facilities, and direct marketing expertise, Vistaprint offers a wide variety of products and services that micro businesses can use to expand their business. A global company, Vistaprint employs over 4,100 people, operates more than 25 localized websites globally and ships to more than 130 countries around the world. Vistaprint's broad range of products and services are easy to access online, 24 hours a day at www.vistaprint.com.