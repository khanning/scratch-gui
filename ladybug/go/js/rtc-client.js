const configuration = {
    iceServers: [{
        urls: ['stun:stun1.l.google.com:19302'],
    }]
};

const MSG_TYPES = {
    sensors: 1,
    broadcast: 2
};

const firebaseConfig = {
    apiKey: "AIzaSyB4YQK2vBUsBqk54k2OZA-WFipUy5PjTt4",
    authDomain: "fir-rtc-c2076.firebaseapp.com",
    databaseURL: "https://fir-rtc-c2076.firebaseio.com",
    projectId: "fir-rtc-c2076",
    storageBucket: "fir-rtc-c2076.appspot.com",
    messagingSenderId: "212605080504",
    appId: "1:212605080504:web:2001619a968914fa62754d"
};

let peerConnection = null;
let roomId = null;
let pingCount = 0;

let x = 0, y = 0, z = 0;

let RTCClient = {
    listeners: [],
    broadcast(text) {
        var broadcastBuffer = new TextEncoder().encode(text);
        var tmp = new Uint8Array(broadcastBuffer.length+2);
        tmp[0] = MSG_TYPES.broadcast;
        for (let i=0; i<broadcastBuffer.length; i++) {
            tmp[i+2] = broadcastBuffer[i];
        }
    },
    // accelPermission() {
        // if (typeof(DeviceMotionEvent.requestPermission) === 'function') {
            // console.log('Request Permission');
            // DeviceMotionEvent.requestPermission()
            // .then(state => {
                // console.log(state);
            // });
        // }
        // window.addEventListener('devicemotion', (e) => {
            // x = Math.round(e.accelerationIncludingGravity.x * 18);
            // y = Math.round(e.accelerationIncludingGravity.y * 18);
            // z = Math.round(e.accelerationIncludingGravity.z * 18);
            // document.querySelector('#accel-info').innerHTML = x + ', ' + y + ', ' + z;
        // });
    // },
    init() {
        firebase.initializeApp(firebaseConfig);
    },
    send(data) {
        if (this.dataChannel && this.dataChannel.readyState === 'open') {
            console.log('sending');
            this.dataChannel.send(data.buffer);
        }
    },
    addListener(callback) {
        this.listeners.push(callback);
    },
    async joinRoom(roomId) {
        const db = firebase.firestore();
        const roomRef = db.collection('rooms').doc(roomId);
        const roomSnapshot = await roomRef.get();

        if (roomSnapshot.exists) {
            peerConnection = new RTCPeerConnection(configuration);

            peerConnection.ondatachannel = (event) => {
                this.dataChannel = event.channel;
                this.dataChannel.onmessage = (e) => {
                    const data = new Uint8Array(e.data);
                    this.listeners.forEach(l => l(data));
                }
            };

            this.registerPeerConnectionListeners();

            const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
            peerConnection.addEventListener('icecandidate', event => {
                if (!event.candidate) {
                    console.log('Got final candidate!');
                    return;
                }
                console.log('Got candidate: ', event.candidate);
                calleeCandidatesCollection.add(event.candidate.toJSON());
            });

            const offer = roomSnapshot.data().offer;
            console.log('Got offer', offer);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            const roomWithAnswer = {
                answer: {
                    type: answer.type,
                    sdp: answer.sdp,
                },
            };
            await roomRef.update(roomWithAnswer);

            roomRef.collection('callerCandidates').onSnapshot(snapshot => {
              snapshot.docChanges().forEach(async change => {
                if (change.type === 'added') {
                  let data = change.doc.data();
                  console.log('Got new remote ICE candidate:', data);
                  await peerConnection.addIceCandidate(new RTCIceCandidate(data));
                }
              });
            });
        }
    },
    registerPeerConnectionListeners() {
        peerConnection.addEventListener('icegatheringstatechange', () => {
            console.log(`ICE gathering state changed: ${peerConnection.iceGatheringState}`);
        });
        peerConnection.addEventListener('connectionstatechange', () => {
            console.log(`Connection state change: ${peerConnection.connectionState}`);
            // if (peerConnection.connectionState === 'connected') {
                // window.sender = setInterval(() => {
                    // if (window.dataChannel) {
                        // window.dataChannel.send(new Int16Array([MSG_TYPES.sensors,x,y,z]).buffer);
                    // }
                // }, 50);
            // } else if (peerConnection.connectionState === 'disconnected') {
                // clearInterval(window.sender);
            // }
        });
        peerConnection.addEventListener('signalingstatechange', () => {
            console.log(`Signaling state change: ${peerConnection.signalingState}`);
        });
        peerConnection.addEventListener('iceconnectionstatechange ', () => {
            console.log(`ICE connection state change: ${peerConnection.iceConnectionState}`);
        });
    }
};
