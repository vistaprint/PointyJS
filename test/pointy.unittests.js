describe('pointy.js', function () {
    var el = $('#test');

    // ensure we turn off all pointer events
    function offs() {
        el.off('pointerdown').off('pointerup').off('pointermove');
    }

    function test(pointerEvent, nativeEvents) {
        var groovy = false,
            teardown = true;

        function workIt() {
            if (groovy) {
                chai.assert.fail();
                teardown = false;
            }

            groovy = true;
        }

        // bind to the pointer event
        el.on(pointerEvent, workIt);

        // run all the native events that map to this pointer event
        $.each(nativeEvents, function (i, nativeEvent) {
            it('should call a ' + pointerEvent + ' when a ' + nativeEvent + ' is triggered', function () {
                // reset groovy here for this next test
                groovy = false;

                // trigger native event, should trigger the pointer event and call workIt
                el.triggerNative(nativeEvent);

                // confirm workIt was called
                chai.assert.isTrue(groovy);
            });

            // we have a special case for the touchstart to prevent mousedown
            if (pointerEvent == 'pointerdown' && nativeEvent == 'touchstart') {
                it('calling touchstart should prevent the next mousedown event', function () {
                    groovy = false;
                    el.triggerNative('mousedown');
                    chai.assert.isFalse(groovy);
                });
            }
        });

        // ensure that you can teardown (unbind) the pointer event
        it('teardown ' + pointerEvent, function () {
            el.off(pointerEvent, workIt);

            $.each(nativeEvents, function (i, nativeEvent) {
                el.triggerNative(nativeEvent);
            });

            chai.assert.isTrue(teardown);
        });
    }

    describe('pointerdown', function () {
        test('pointerdown', ['mousedown', 'touchstart']);

        // send a pointerup event to clear the event state
        el.triggerNative('mouseup');
    });

    describe('pointerup', function () {
        test('pointerup', ['mouseup', 'touchend']);
    });

    describe('pointermove', function () {
        test('pointermove', ['touchmove', 'mousemove']);
    });

    describe('hover (pointerover, pointerout)', function () {
        test('pointerover', ['mouseover']);
        test('pointerout', ['mouseout']);
    });

    describe('buttons property', function () {
        it('on pointerdown, buttons should be 1 to indicate left mouse button', function () {
            offs();

            var buttons = 0;

            el.one('pointerdown', function (event) {
                buttons = event.buttons;
            });

            el.triggerNative('mousedown', { button: 1 });

            chai.assert.equal(buttons, 1);
        });

        it('on second button down, buttons should be bitmask 3 to indicate both 1 and 2 (left and right)', function () {
            offs();

            var buttons = 0;

            el.one('pointermove', function (event) {
                buttons = event.buttons;
            });

            el.one('pointerdown', function (event) {
                chai.assert.fail(); // pointerdown should not be called on corded button downs
            });

            el.triggerNative('mousedown', { button: 2 });

            chai.assert.equal(buttons, 3);
        });

        it('on middle button down, buttons should be bitmask 7 to indicate both 1, 2 and 4', function () {
            offs();

            var buttons = 0;

            el.one('pointermove', function (event) {
                buttons = event.buttons;
            });

            el.one('pointerdown', function (event) {
                chai.assert.fail(); // pointerdown should not be called on corded button downs
            });

            el.triggerNative('mousedown', { button: 4 });

            chai.assert.equal(buttons, 1 | 2 | 4);
        });

        it('on mouseup of middle button (button 4), it should still indicate 3 for 1 and 2 being down', function () {
            offs();

            var buttons = 0;

            el.one('pointermove', function (event) {
                buttons = event.buttons;
            });

            el.one('pointerup', function (event) {
                chai.assert.fail(); // pointerdown should not be called on corded button downs
            });

            el.triggerNative('mouseup', { button: 4 });

            chai.assert.equal(buttons, 3);
        });

        it('on mouseup of right button (button 2), it should still indicate left button (button 1) as down', function () {
            offs();

            var buttons = 0;

            el.one('pointermove', function (event) {
                buttons = event.buttons;
            });

            el.one('pointerup', function (event) {
                chai.assert.fail(); // pointerdown should not be called on corded button downs
            });

            el.triggerNative('mouseup', { button: 2 });

            chai.assert.equal(buttons, 1);
        });

        it('on mouseup of left button (button 1), it should fire a pointerup event', function () {
            offs();

            var fired = false;

            el.one('pointerup', function (event) {
                fired = event.buttons === 0;
            });

            el.triggerNative('mouseup', { button: 1 });

            chai.assert.isTrue(fired);
        });
    });
});
