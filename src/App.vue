<template>
  <button @click="getStream">打开摄像头</button>
  <button @click="changeBackground">更换背景</button>
  <input v-model="allowance" type="text" style="width:40px">
  <button @click="updateCamera">切换摄像头</button>
  <button @click="shareScreen">屏幕共享</button>
  <button @click="startRecord">开始录制</button>
  <button @click="stopRecord">停止录制</button>
  <button @click="capture">截图</button>
  <button @click="find1">开始查找</button>
  <button @click="find2">开始接收</button>
  <button @click="find3">开始连接</button>
  <button @click="getDevice">获取设备列表</button>
  <div>替换背景图片</div>
  <img id="backgroundImg" :src="Beach" style="width: 200px;">
  <div>本地摄像头</div>
  <video id="localVideo" muted autoplay width="200" style="transform: scaleX(-1);"></video>
  <div>远程摄像头</div>
  <video id="remoteVideo" muted autoplay width="200" style="transform: scaleX(-1);"></video>
  <div>本地canvas</div>
  <canvas id="localCanvas"></canvas>
  <div>合成canvas</div>
  <canvas id="vCanvas"></canvas>
  <div>截图</div>
  <canvas id="captureCanvas"></canvas>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import Beach from "./assets/beach.jpeg";


const getDevice = () => {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    console.log(devices)
  })
}

const capture = () => {
  const video = document.getElementById('localVideo')
  const canvas = document.getElementById('captureCanvas')
  canvas.width = getComputedStyle(video).width.slice(0, -2);
  canvas.height = getComputedStyle(video).height.slice(0, -2);
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
}

let stream
const getStream = async () => {
  stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
  const video = document.getElementById('localVideo')
  video.srcObject = stream
  video.onplay = () => {
    nextTick(() => drawCanvas(video))
  }
}

let peerConn

const createPeerConn = () => {
  peerConn = new RTCPeerConnection()
  stream.getTracks().forEach((track) => {
    peerConn.addTrack(track, stream)
  })

  const remoteVideo = document.getElementById('remoteVideo')
  peerConn.ontrack = (event) => {
    console.log('peerConn', event);
    remoteVideo.srcObject = event.streams[0]
  }
}
const find1 = async () => {
  createPeerConn()
  await createOffer()
}
const find2 = async () => {
  createPeerConn()
  await createAnswer()
}
const find3 = async () => {
  await addAnswer()
}

let offerSdp = ''
let answerSdp = ''

const createOffer = async () => {
  const offer = await peerConn.createOffer()
  console.log('createOffer', offer);
  await peerConn.setLocalDescription(offer)
  peerConn.onicecandidate = async (event) => {
    if (event.candidate) {
      offerSdp = JSON.stringify(peerConn.localDescription)
      localStorage.setItem('offerSdp', offerSdp)
    }
  }
}

const createAnswer = async () => {
  offerSdp = localStorage.getItem('offerSdp')
  console.log('createAnswer offerSdp', offerSdp);
  const offer = JSON.parse(offerSdp)
  await peerConn.setRemoteDescription(offer)
  const answer = await peerConn.createAnswer()
  console.log('createAnswer answer', answer);
  await peerConn.setLocalDescription(answer)
  peerConn.onicecandidate = async (event) => {
    if (event.candidate) {
      answerSdp = JSON.stringify(peerConn.localDescription)
      localStorage.setItem('answerSdp', answerSdp)

    }
  }
}

const addAnswer = async () => {
  answerSdp = localStorage.getItem('answerSdp')
  console.log('addAnswer answerSdp', answerSdp);
  const answer = JSON.parse(answerSdp)
  if (!peerConn.currentRemoteDescription) {
    peerConn.setRemoteDescription(answer)
  }
}

let rData, rCtx, change
const drawCanvas = (video) => {
  const canvas = document.getElementById('localCanvas')

  canvas.width = getComputedStyle(video).width.slice(0, -2);
  canvas.height = getComputedStyle(video).height.slice(0, -2);

  const draw = () => {
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    rData = ctx.getImageData(0, 0, vCanvas.width, vCanvas.height)
    rCtx = ctx
    if (change) changeBack()
    requestAnimationFrame(draw)
  }

  draw()
}

const changeBack = () => {
  const backgroundImg = document.getElementById('backgroundImg')
  const vCanvas = document.getElementById('vCanvas')
  const video = document.getElementById('localVideo')
  vCanvas.width = getComputedStyle(video).width.slice(0, -2);
  vCanvas.height = getComputedStyle(video).height.slice(0, -2);
  const ctx = vCanvas.getContext('2d')
  ctx.drawImage(backgroundImg, 0, 0, vCanvas.width, vCanvas.height)
  const backgroundImageData = ctx.getImageData(0, 0, vCanvas.width, vCanvas.height)
  processFrameDrawToVirtualVideo(backgroundImageData)
}

const changeBackground = () => {
  change = true
}

const allowance = ref(40)
function processFrameDrawToVirtualVideo(backgroundImageData) {
  for (let i = 0; i < rData.data.length; i += 4) {
    const r = rData.data[i]
    const g = rData.data[i + 1]
    const b = rData.data[i + 2]
    const a = rData.data[i + 3]
    const bgR = backgroundImageData.data[i]
    const bgG = backgroundImageData.data[i + 1]
    const bgB = backgroundImageData.data[i + 2]
    const bgA = backgroundImageData.data[i + 3]

    const diff = colorDiff([r, g, b], [100, 100, 100])
    if (diff < allowance.value) {
      rData.data[i] = bgR
      rData.data[i + 1] = bgG
      rData.data[i + 2] = bgB
      rData.data[i + 3] = bgA
    }
  }
  rCtx.putImageData(rData, 0, 0)
}


function colorDiff(rgba1, rgba2) {
  let d = 0
  for (let i = 0; i < rgba1.length; i++) {
    d += (rgba1[i] - rgba2[i]) ** 2
  }
  return Math.sqrt(d)
}



let mediaRecorder
const startRecord = () => {
  mediaRecorder = new MediaRecorder(stream)
  mediaRecorder.start()
  mediaRecorder.ondataavailable = (e) => {
    downloadRecord(e.data)
  }
}

const stopRecord = () => {
  mediaRecorder.stop()
}

const downloadRecord = (blob) => {
  console.log(blob);
  let a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'record.mp4'
  a.click()
  URL.revokeObjectURL(a.href)
  a = null
}

const shareScreen = () => {
  navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
    const video = document.getElementById('localVideo')
    video.srcObject = stream
  })
}

const updateCamera = async () => {
  await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'environment' } } })
}




</script>



<style scoped></style>
