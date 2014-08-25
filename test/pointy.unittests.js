describe('pointy.js', function () {
    var el = $('#test');

    var isCalled = function (pointerEvent, nativeEvent, nativeEventProps, cb) {
        var called = false;
        var teardown = true;

        if ($.isFunction(nativeEventProps)) {
            cb = nativeEventProps;
            nativeEventProps = null;
        }

        function flagIfCalled(event) {
            if (called) {
                chai.assert.fail('should never call this flag write');
                teardown = false;
            }

            called = true;

            if (cb) {
                cb(event);
            }
        }

        // bind to the pointer event
        el.on(pointerEvent, flagIfCalled);

        // trigger native event, should trigger the pointer event and call workIt
        el.triggerNative(nativeEvent, nativeEventProps);

        // confirm flagIfCalled was called
        chai.assert.isTrue(called);

        if (teardown) {
            // ensure that you can teardown (unbind) the pointer event
            el.off(pointerEvent, flagIfCalled);

            el.triggerNative(nativeEvent);

            chai.assert.isTrue(teardown);
        }
    };

    describe('touch transformation', function () {
        it('should trigger a pointerdown when a touchstart is triggered', function () {
            isCalled('pointerdown', 'touchstart', function (event) {
                chai.assert.equal(event.pointerType, 'touch');
                chai.assert.equal(event.buttons, 1);
            });
        });

        it('should trigger a pointermove when a touchmove is triggered', function () {
            isCalled('pointermove', 'touchmove', function (event) {
                chai.assert.equal(event.pointerType, 'touch');
                chai.assert.equal(event.buttons, 1);
            });
        });

        it('should trigger a pointerup when a touchend is triggered', function () {
            isCalled('pointerup', 'touchend', function (event) {
                chai.assert.equal(event.pointerType, 'touch');
                chai.assert.equal(event.buttons, 0);
            });
        });

        it('should trigger a pointercancel when a touchcancel is triggered', function () {
            isCalled('pointercancel', 'touchcancel', function (event) {
                chai.assert.equal(event.pointerType, 'touch');
            });
        });
    });

    describe('mouse transformation', function () {
        it('should trigger a pointerdown when a mousedown is triggered', function () {
            isCalled('pointerdown', 'mousedown', { button: 1 }, function (event) {
                chai.assert.equal(event.pointerType, 'mouse');
                chai.assert.equal(event.buttons, 1);
            });
        });

        it('should trigger a pointermove when a mousemove is triggered', function () {
            isCalled('pointermove', 'mousemove', function (event) {
                chai.assert.equal(event.pointerType, 'mouse');
                chai.assert.equal(event.buttons, 1);
            });
        });

        it('should trigger a pointerover when a mouseover is triggered', function () {
            isCalled('pointerover', 'mouseover', function (event) {
                chai.assert.equal(event.pointerType, 'mouse');
                chai.assert.equal(event.buttons, 1);
            });
        });

        it('should trigger a pointerout when a mouseout is triggered', function () {
            isCalled('pointerout', 'mouseout', function (event) {
                chai.assert.equal(event.pointerType, 'mouse');
                chai.assert.equal(event.buttons, 1);
            });
        });

        it('should trigger a pointerup when a mouseup is triggered', function () {
            isCalled('pointerup', 'mouseup', { button: 1 }, function (event) {
                chai.assert.equal(event.pointerType, 'mouse');
                chai.assert.equal(event.buttons, 0);
            });
        });
    });

    describe('buttons property', function () {
        // ensure we turn off all pointer events
        function offs() {
            el.off('pointerdown').off('pointerup').off('pointermove');
        }

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

            el.one('pointerdown', function () {
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

            el.one('pointerdown', function () {
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

            el.one('pointerup', function () {
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

            el.one('pointerup', function () {
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
