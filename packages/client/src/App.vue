<template>
  <button @click="getStream">打开摄像头</button>
  <button @click="updateCamera">切换摄像头</button>
  <button @click="capture">截图</button>

  <ShareScreen />
  <ChangeBackground ref="ChangeBackgroundRef" />

  <Record :stream="stream" />

  <button @click="find1">开始查找</button>
  <button @click="find2">开始接收</button>
  <button @click="find3">开始连接</button>

  <button @click="createDataChannel">开始接传文件</button>
  <FileTransfer :channel="channel" />
  <Devices />

  <div>本地摄像头</div>
  <video
    id="localVideo"
    muted
    autoplay
    width="200"
    style="transform: scaleX(-1)"
  ></video>
  <div>远程摄像头</div>
  <video
    id="remoteVideo"
    muted
    autoplay
    width="200"
    style="transform: scaleX(-1)"
  ></video>
  <div>本地canvas</div>
  <canvas id="localCanvas"></canvas>
  <div>合成canvas</div>
  <canvas id="vCanvas"></canvas>
  <div>截图</div>
  <canvas id="captureCanvas"></canvas>
  <div>传输图片</div>
  <img :src="sendPhoto" />
</template>

<script setup>
import { nextTick, ref, onMounted, reactive } from "vue";

import Devices from "./components/Devices.vue";
import Record from "./components/Record.vue";
import FileTransfer from "./components/FileTransfer.vue";
import ShareScreen from "./components/ShareScreen.vue";
import ChangeBackground from "./components/ChangeBackground.vue";

import { useCreateDataCannel } from "./hooks/useCreateDataCannel";

onMounted(() => {
  fetch("http://localhost:3008/post", {
    method: "post",
    body: JSON.stringify({ test: 1 }),
  });
});

const ChangeBackgroundRef = ref();

const capture = () => {
  const video = document.getElementById("localVideo");
  const canvas = document.getElementById("captureCanvas");
  canvas.width = getComputedStyle(video).width.slice(0, -2);
  canvas.height = getComputedStyle(video).height.slice(0, -2);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
};

let stream = ref();
const getStream = async () => {
  stream.value = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
  });
  const video = document.getElementById("localVideo");
  video.srcObject = stream.value;
  video.onplay = () => {
    nextTick(() => drawCanvas(video));
  };
};

let peerConn;
let sendPhoto = ref("");
const { channel, createDataChannel } = useCreateDataCannel(peerConn);
const createPeerConn = () => {
  peerConn = new RTCPeerConnection();
  createDataChannel();
  stream.value.getTracks().forEach((track) => {
    peerConn.addTrack(track, stream.value);
  });

  const remoteVideo = document.getElementById("remoteVideo");
  peerConn.ontrack = (event) => {
    console.log("peerConn", event);
    remoteVideo.srcObject = event.streams[0];
  };
};

const find1 = async () => {
  createPeerConn();
  await createOffer();
};
const find2 = async () => {
  createPeerConn();
  await createAnswer();
};
const find3 = async () => {
  await addAnswer();
};

let offerSdp = "";
let answerSdp = "";

const createOffer = async () => {
  const offer = await peerConn.createOffer();
  console.log("createOffer", offer);
  await peerConn.setLocalDescription(offer);
  peerConn.onicecandidate = async (event) => {
    if (event.candidate) {
      offerSdp = JSON.stringify(peerConn.localDescription);
      localStorage.setItem("offerSdp", offerSdp);
    }
  };
};

const createAnswer = async () => {
  offerSdp = localStorage.getItem("offerSdp");
  console.log("createAnswer offerSdp", offerSdp);
  const offer = JSON.parse(offerSdp);
  await peerConn.setRemoteDescription(offer);
  const answer = await peerConn.createAnswer();
  console.log("createAnswer answer", answer);
  await peerConn.setLocalDescription(answer);
  peerConn.onicecandidate = async (event) => {
    if (event.candidate) {
      answerSdp = JSON.stringify(peerConn.localDescription);
      localStorage.setItem("answerSdp", answerSdp);
    }
  };
};

const addAnswer = async () => {
  answerSdp = localStorage.getItem("answerSdp");
  console.log("addAnswer answerSdp", answerSdp);
  const answer = JSON.parse(answerSdp);
  if (!peerConn.currentRemoteDescription) {
    peerConn.setRemoteDescription(answer);
  }
};

let rData, rCtx, change;
const drawCanvas = (video) => {
  const canvas = document.getElementById("localCanvas");

  canvas.width = getComputedStyle(video).width.slice(0, -2);
  canvas.height = getComputedStyle(video).height.slice(0, -2);

  const draw = () => {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const realData = ctx.getImageData(0, 0, vCanvas.width, vCanvas.height);
    ChangeBackgroundRef.value.changeBack(realData, ctx);
    requestAnimationFrame(draw);
  };
  draw();
};

const updateCamera = async () => {
  await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { exact: "environment" } },
  });
};
</script>

<style scoped></style>
