(function () {
    'use strict';

    var output = document.body.querySelector('.output');
    var buttons = document.body.querySelector('#buttons');
    var prevButton = buttons.querySelector('#previous-channel');
    var nextButton = buttons.querySelector('#next-channel');

    var width = output.width;
    var height = output.height;
    var television;

    function Television(width, height, renderContext, audioContext) {
        this.width = width;
        this.height = height;
        this.renderContext = renderContext;
        this.audioContext = audioContext;
        this.channel = 1;
    }

    Television.prototype.render = function render() {
        this.renderContext.clearRect(0, 0, width, height);
        this._renderPixels();
        this._renderChannelNumber();
    };

    Television.prototype._renderPixels = function renderPixels() {
        var PIXEL_SIZE = Television.PIXEL_SIZE;

        this.renderContext.fillStyle = 'white';

        for (var x = 0; x < width; x += PIXEL_SIZE) {
            for (var y = 0; y < height; y += PIXEL_SIZE) {
                if (Television._shouldFillPixel()) {
                    this.renderContext.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
                }
            }
        }
    };

    Television.prototype._renderChannelNumber = function _renderChannelNumber() {
        this.renderContext.fillStyle = 'green';
        this.renderContext.font = '56px slkscr';
        this.renderContext.fillText(this.channel, 20, 50);
    };

    Television.prototype.startNoiseAudio = function startNoiseAudio() {
        var AUDIO_SAMPLE_RATE = Television.AUDIO_SAMPLE_RATE;
        var AUDIO_LENGTH_SECONDS = Television.AUDIO_LENGTH_SECONDS;

        var bufferLength = AUDIO_SAMPLE_RATE * AUDIO_LENGTH_SECONDS;
        var buffer = this.audioContext.createBuffer(1, bufferLength, AUDIO_SAMPLE_RATE);
        var output = buffer.getChannelData(0);

        for (var i = 0; i < bufferLength; i++) {
            output[i] = Math.random();
        }

        var bufferSource = this.audioContext.createBufferSource();
        var gainNode = this.audioContext.createGain();

        bufferSource.buffer = buffer;
        gainNode.gain.value = 0.2;
        bufferSource.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        bufferSource.start();
    };

    Television.prototype.changeToPrevChannel = function changeToPrevChannel() {
        this._changeChannel(Television._channelChangeTypes.PREV);
    };

    Television.prototype.changeToNextChannel = function changeToNextChannel() {
        this._changeChannel(Television._channelChangeTypes.NEXT);
    };

    Television.prototype._changeChannel = function _changeChannel(type) {
        var channel = this.channel + type;

        if (channel === Television._channelRange.MIN - 1) {
            channel = Television._channelRange.MAX;
        }

        if (channel === Television._channelRange.MAX + 1) {
            channel = Television._channelRange.MIN;
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
        MAX: 99
    };

    Television.PIXEL_SIZE = 2;
    Television.AUDIO_SAMPLE_RATE = 44100;
    Television.AUDIO_LENGTH_SECONDS = 300;

    function loop() {
        television.render();
        requestAnimationFrame(loop);
    }

    television = new Television(
        width,
        height,
        output.getContext('2d'),
        new AudioContext()
    );

    prevButton.onclick = television.changeToPrevChannel.bind(television);
    nextButton.onclick = television.changeToNextChannel.bind(television);

    television.startNoiseAudio();

    loop();
}());