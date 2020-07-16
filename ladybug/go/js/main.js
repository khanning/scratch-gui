window.onload = () => {
    UI.init();
    UI.addEventListener((e) => {
        if (e.type === 'command' && e.name === 'connect') {
            if (!e.value || e.value.length === 0) return;
            RTCClient.joinRoom(e.value);
            return;
        }
        var data = JSON.stringify(e);
        let buffer = new TextEncoder().encode(data);
        RTCClient.send(buffer);
    });
    RTCClient.init();
    RTCClient.addConnectionListener(state => {
        if (state === 'connected') {
            UI.setConnected(true);
        } else if (state === 'disconnected') {
            UI.setConnected(false);
        } else {
            console.log(state);
        }
    });
    RTCClient.addListener((data) => {
        UI.updateStage(String.fromCharCode.apply(null, data));
    });
    if (DeviceMotionEvent) {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            // Request permission for iOS Safari 13+
            DeviceOrientationEvent.requestPermission()
            .then(state => {
                if (state === 'granted') {
                    window.addEventListener('devicemotion', (e) => {
                        UI.updateMotion(
                            e.accelerationIncludingGravity.x,
                            e.accelerationIncludingGravity.y,
                            e.accelerationIncludingGravity.z
                        );
                    });
                }
            })
            .catch(e => {
                UI.motionNeedsPermission();
            });
        } else {
            window.addEventListener('devicemotion', (e) => {
                UI.updateMotion(
                    e.accelerationIncludingGravity.x,
                    e.accelerationIncludingGravity.y,
                    e.accelerationIncludingGravity.z
                );
            });
        }
    }
};
