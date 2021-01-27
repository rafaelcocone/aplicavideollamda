var $urlIO =  window.location.hostname == "localhost" ? 'https://localhost:4000' : 'https://mrbisne.com:4000' ;
const socket = io($urlIO);

let localVideo = document.getElementById("local-video")
let remoteVideo = document.getElementById("remote-video")

localVideo.style.opacity = 0
remoteVideo.style.opacity = 0

localVideo.onplaying = () => { localVideo.style.opacity = 1 }
remoteVideo.onplaying = () => { remoteVideo.style.opacity = 1 }

let peer
let otroUsurio = undefined
const init = (userId) => {
    /*peer = new Peer(userId, {
        host: 'localhost',
        secure:true, 
        port: 3005,
        path: '/myapp'
    })*/

    peer = new Peer(userId,  {
        host: 'mrbisne.com',
       secure:true, 
       port: '3005',
       path: '/myapp',
       debug: 3,
       config: {'iceServers':[
                      {'url': 'turn:mrbisne.com', username: 'mrtest', credential: 'mrpass' }
               ]}
      })



    listen()
    //socket.emit('join-room', ROOM_ID, id)
    socket.emit('join-room', 'singlepeer', userId)
}

let localStream
const listen = () => {
    peer.on('call', (call) => {

        navigator.getUserMedia({
            audio: true, 
            video: true
        }, (stream) => {
            localVideo.srcObject = stream
            localStream = stream

            call.answer(stream)
            call.on('stream', (remoteStream) => {
                remoteVideo.srcObject = remoteStream

                remoteVideo.className = "primary-video"
                localVideo.className = "secondary-video"

            })

        })
        
    })
}


const startCall = () => {   
    let otherUserId = otroUsurio.userId
    navigator.getUserMedia({
        audio: true,
        video: true
    }, (stream) => {

        localVideo.srcObject = stream
        localStream = stream

        const call = peer.call(otherUserId, stream)
        call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream

            remoteVideo.className = "primary-video"
            localVideo.className = "secondary-video"
        })

    })
}


//mute a un video
const muteUnmute = () => {
    const enabled = localStream.getAudioTracks()[0].enabled;
    if (enabled) {
      localStream.getAudioTracks()[0].enabled = false;
    } else {
      localStream.getAudioTracks()[0].enabled = true;
    }
    $('.main__mute_button').toggle();
  }
  
  //activar y ddeactivar video
  const playStop = () => {
    let enabled = localStream.getVideoTracks()[0].enabled;
    if (enabled) {
      localStream.getVideoTracks()[0].enabled = false;
    } else {
      localStream.getVideoTracks()[0].enabled = true;
    }
    $('.main__video_button').toggle();
  }

  /******************************* */
init(id_usuario)

    //detectar coneccion de nuevo usuaio
    socket.on('user-connected', (userId) => {
        otroUsurio = userId
        $('.main__startCall').toggle();
      })