(function () {
    'use strict';

    var output = document.body.querySelector('.output');
    var buttons = document.body.querySelector('#buttons');
    var onButton = buttons.querySelector('#on');
    var offButton = buttons.querySelector('#off');
    var prevButton = buttons.querySelector('#previous-channel');
    var nextButton = buttons.querySelector('#next-channel');

    var width = output.width;
    var height = output.height;
    var television;

    function Television(width, height, context) {
        this.width = width;
        this.height = height;
        this.context = context;
        this.channel = 1;

        context.fillStyle = 'white';
    }

    Television.prototype.update = function update() {
        var PIXEL_SIZE = Television.PIXEL_SIZE;

        this.context.clearRect(0, 0, width, height);

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                if (Television._shouldFillPixel()) {
                    this.context.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
                }
            }
        }
    };

    Television.prototype.switchOn = function switchOn() {

    };

    Television.prototype.switchOff = function switchOff() {

    };

    Television.prototype.changeToPrevChannel = function changeToPrevChannel() {
        this._changeChannel(Television._channelChangeTypes.PREV);
    };

    Television.prototype.changeToNextChannel = function changeToNextChannel() {
        this._changeChannel(Television._channelChangeTypes.NEXT);        
    };

    Television.prototype._changeChannel = function _changeChannel(type) {
        var channel = this.chanel + type;

        if (channel === Television._channelRange.MIN - 1) {
            channel = 10;
        }

        if (channel === Television._channelRange.MAX + 1) {
            channel = 1;
        }

        this.channel = channel;
    };

    Television._shouldFillPixel = function _shouldFillPixel() {
        return Math.random() > 0.3;
    };

    Television._channelChangeTypes = {
        PREV: -1,
        NEXT: 1
    };

    Television._channelRange = {
        MIN: 1,
        MAX: 10
    };

    Television.PIXEL_SIZE = 1;

    function loop() {
        television.update();
        requestAnimationFrame(loop);
    }

    television = new Television(width, height, output.getContext('2d'));
    
    onButton.onclick = television.switchOn.bind(television);
    offButton.onclick = television.switchOff.bind(television);
    prevButton.onclick = television.changeToPrevChannel.bind(television);
    nextButton.onclick = television.changeToNextChannel.bind(television);

    loop();
}());