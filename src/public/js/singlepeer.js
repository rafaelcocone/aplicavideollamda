var $urlIO =  window.location.hostname == "localhost" ? 'https://localhost:4000' : 'https://mrbisne.com:4000' ;
const socket = io($urlIO);

let localVideo = document.getElementById("local-video")
let remoteVideo = document.getElementById("remote-video")
let $sendMensage = $('#chat_message')

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

      socket.emit('join-room', ROOM_ID, userId)

    listen()
    //socket.emit('join-room', ROOM_ID, id)
   
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

     //evento de enviar mesajes
     $('#chat_message').keydown( (e)  => {
        if(e.which == 13 && $sendMensage.val().length !== 0 ){
            socket.emit('message', {mensaje:$sendMensage.val(), name: room_name });
            $sendMensage.val('');
        }
    })

    ///resibir mensajes de otros usuario por chat
    socket.on('createMessage', message => {
    
        $('.chat__messages_list').append(
            $('<li/>')
                .addClass('chat__message')
                .append(`<b>${message.name}:</b> ${message.mensaje}`)
        )
        scrollToBottom();
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

/********************************************************************** */
//funciones y enevtos de chat

// moverse al fondo del chat chando aparece un mensage
const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
  }
  
  document.getElementById('main__controles_salir')
      .addEventListener('click', (e) => {
        window.open($urlIO+"/profile",'_self')    
    });
  
  document.getElementById('main__controles_salir')
    .addEventListener('click', (e) => {
      window.open($urlIO+"/profile",'_self')    
  });


    //detectar coneccion de nuevo usuaio
    socket.on('user-connected', (userId) => {
    otroUsurio = userId
    $('.main__startCall').toggle();
    })



/********************************************************************** */
init(id_usuario)

