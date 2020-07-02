const configuration = {
  iceServers: [
      {
            urls: [
                    'stun:stun1.l.google.com:19302'
                  ],
          },
    ],
};

let peerConnection = null;
let roomId = null;
window.dataChannel = null;
let pingCount = 0;

let x = 0, y = 0, z = 0;

window.onload = (event) => {
    document.querySelector('#permission').addEventListener('click', () => {
        if (typeof(DeviceMotionEvent.requestPermission) === 'function') {
            console.log('Request Permission');
            DeviceMotionEvent.requestPermission()
            .then(state => {
                console.log(state);
            });
        }
    });
    console.log(document.querySelector('#accel-info'));
    window.addEventListener('devicemotion', (e) => {
        x = Math.round(e.accelerationIncludingGravity.x * 18);
        y = Math.round(e.accelerationIncludingGravity.y * 18);
        z = Math.round(e.accelerationIncludingGravity.z * 18);
        document.querySelector('#accel-info').innerHTML = x + ', ' + y + ', ' + z;
    });

  document.querySelector('#join-room').addEventListener('click', joinRoom);
    // document.querySelector('#ping-button').addEventListener('click', () => {
        // if (window.dataChannel) {
            // window.dataChannel.send(new Uint8Array([pingCount++]).buffer);
        // }
    // });

  var firebaseConfig = {
      apiKey: "AIzaSyB4YQK2vBUsBqk54k2OZA-WFipUy5PjTt4",
      authDomain: "fir-rtc-c2076.firebaseapp.com",
      databaseURL: "https://fir-rtc-c2076.firebaseio.com",
      projectId: "fir-rtc-c2076",
      storageBucket: "fir-rtc-c2076.appspot.com",
      messagingSenderId: "212605080504",
      appId: "1:212605080504:web:2001619a968914fa62754d"
    };
    firebase.initializeApp(firebaseConfig);
};

async function joinRoom() {
    roomId = document.querySelector('#room-id').value;
    await joinRoomById(roomId);
}

async function joinRoomById(roomId) {
    const db = firebase.firestore();
    const roomRef = db.collection('rooms').doc(roomId);
    const roomSnapshot = await roomRef.get();

    if (roomSnapshot.exists) {
        peerConnection = new RTCPeerConnection(configuration);

        peerConnection.ondatachannel = (event) => {
            window.dataChannel = event.channel;
            window.dataChannel.onmessage = (e) => console.log(new Uint8Array(e.data));
        };

        registerPeerConnectionListeners();

        const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
        peerConnection.addEventListener('icecandidate', event => {
            if (!event.candidate) {
                console.log('Got final candidate!');
                return;
            }
            console.log('Got candidate: ', event.candidate);
            calleeCandidatesCollection.add(event.candidate.toJSON());
        });

        // Set up data stream listener

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
}

function registerPeerConnectionListeners() {
    peerConnection.addEventListener('icegatheringstatechange', () => {
        console.log(
                `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
      });

      peerConnection.addEventListener('connectionstatechange', () => {
          console.log(`Connection state change: ${peerConnection.connectionState}`);
          if (peerConnection.connectionState === 'connected') {
              window.sender = setInterval(() => {
                if (window.dataChannel) {
                    window.dataChannel.send(new Int16Array([x,y,z]).buffer);
                }
              }, 50);
          } else if (peerConnection.connectionState === 'disconnected') {
            clearInterval(window.sender);
          }
        });

      peerConnection.addEventListener('signalingstatechange', () => {
          console.log(`Signaling state change: ${peerConnection.signalingState}`);
        });

      peerConnection.addEventListener('iceconnectionstatechange ', () => {
          console.log(
                  `ICE connection state change: ${peerConnection.iceConnectionState}`);
        });
}
