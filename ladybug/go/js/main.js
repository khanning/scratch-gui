window.onload = () => {
    sliderVal = 0;
    touchValues = [0, 0];
    sensorChange = false;

    let tmpImageData = new Uint8Array(480*360*4);
    let tmpImageCount = 0;
    let tmpImageLen = 0;

    UI.init();
    UI.addEventListener((e) => {
        console.log(e);
        if (e.type === 'command') {
            if (e.name === 'connect') {
                if (!e.value || e.value.length === 0) return;
                RTCClient.joinRoom(e.value);
            } if (e.name === 'greenflag' || e.name === 'stopall') {
                var code = 0;
                if (e.name === 'greenflag') code = 1;
                else if (e.name === 'stopall') code = 2;
                const out = new Int16Array([0, code]);
                RTCClient.send(out);
            }
        } else if (e.type === 'broadcast') {
            var broadcastBuffer = new TextEncoder().encode(e.name);
            var tmp = new Uint8Array(broadcastBuffer.length+2);
            tmp[0] = 2;
            for (let i=0; i<broadcastBuffer.length; i++) {
                tmp[i+2] = broadcastBuffer[i];
            }
            RTCClient.send(tmp);
        } else if (e.type === 'sensor') {
            if (e.name === 'slider') {
                sliderVal = e.val;
                sensorChange = true;
            } if (e.name === 'touchpad') {
                touchValues[0] = e.val[0];
                touchValues[1] = e.val[1];
                sensorChange = true;
            }
        }
    });
    RTCClient.init();
    RTCClient.addListener((data) => {
        UI.updateStage(String.fromCharCode.apply(null, data));
        // if (data[0] === tmpImageCount++) {
            // tmpImageData.set(data.slice(1), tmpImageLen);
            // tmpImageLen += data.length-1;
            // if (tmpImageCount === 7) {
                // UI.updateStage(tmpImageData);
                // tmpImageCount = 0;
                // tmpImageLen = 0;
            // }
        // } else {
            // console.log('Error image out of order');
            // tmpImageCount = 0;
            // tmpImageLen = 0;
        // }
    });

    setInterval(() => {
        if (!sensorChange) return
        sensorChange = false;
        var out = new Int16Array([1, 2, sliderVal, touchValues[0], touchValues[1]]);
        RTCClient.send(out);
    }, 50);
};
