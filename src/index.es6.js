(() => {
    'use strict';

    const output = document.body.querySelector('.output');
    const buttons = document.body.querySelector('#buttons');
    const prevButton = buttons.querySelector('#previous-channel');
    const nextButton = buttons.querySelector('#next-channel');

    const width = output.width;
    const height = output.height;

    class Television {
        constructor(width, height, renderContext, audioContext) {
            this.width = width;
            this.height = height;
            this.renderContext = renderContext;
            this.audioContext = audioContext;
            this.channel = 1;
        }

        render() {
            this.renderContext.clearRect(0, 0, width, height);
            this._renderPixels();
            this._renderChannelNumber();
        }

        _renderPixels() {
            const { PIXEL_SIZE } = Television;

            this.renderContext.fillStyle = 'white';

            for (let x = 0; x < width; x += PIXEL_SIZE) {
                for (let y = 0; y < height; y += PIXEL_SIZE) {
                    if (Television._shouldFillPixel()) {
                        this.renderContext.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
                    }
                }
            }
        }

        _renderChannelNumber() {
            this.renderContext.fillStyle = 'green';
            this.renderContext.font = '56px slkscr';
            this.renderContext.fillText(this.channel, 20, 50);
        }

        startNoiseAudio() {
            const bufferSource = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();

            bufferSource.buffer = this._createNoiseBuffer();
            gainNode.gain.value = 0.2;
            bufferSource.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            bufferSource.start();
        }

        _createNoiseBuffer() {
            const { AUDIO_SAMPLE_RATE, AUDIO_LENGTH_SECONDS } = Television;
            const bufferLength = AUDIO_SAMPLE_RATE * AUDIO_LENGTH_SECONDS;
            const buffer = this.audioContext.createBuffer(1, bufferLength, AUDIO_SAMPLE_RATE);
            const output = buffer.getChannelData(0);

            for (let i = 0; i < bufferLength; i++) {
                output[i] = Math.random();
            }

            return buffer;
        }

        changeToPrevChannel() {
            this._changeChannel(Television._channelChangeTypes.PREV);
        }

        changeToNextChannel() {
            this._changeChannel(Television._channelChangeTypes.NEXT);
        }

        _changeChannel(type) {
            let channel = this.channel + type;

            if (channel === Television._channelRange.MIN - 1) {
                channel = Television._channelRange.MAX;
            }

            if (channel === Television._channelRange.MAX + 1) {
                channel = Television._channelRange.MIN;
            }

            this.channel = channel;
        }

        static _shouldFillPixel() {
            return Math.random() > 0.3;
        }
    }

    Television._channelChangeTypes = {
        PREV: -1,
        NEXT: 1
    }

    Television._channelRange = {
        MIN: 1,
        MAX: 99
    }

    Television.PIXEL_SIZE = 2;
    Television.AUDIO_SAMPLE_RATE = 44100;
    Television.AUDIO_LENGTH_SECONDS = 300;

    function loop() {
        television.render();
        requestAnimationFrame(loop);
    }

    const television = new Television(
        width,
        height,
        output.getContext('2d'),
        new AudioContext()
    );

    prevButton.onclick = () => television.changeToPrevChannel();
    nextButton.onclick = () => television.changeToNextChannel();

    television.startNoiseAudio();

    loop();
})();