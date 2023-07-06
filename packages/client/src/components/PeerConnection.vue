<template>
  <button @click="find1">开始查找</button>
  <button @click="find2">开始接收</button>
  <button @click="find3">开始连接</button>
  <button @click="createDataChannel">开始接传文件</button>
  <FileTransfer :channel="channel" />

  <template v-if="sendPhoto">
    <div>传输图片</div>
    <img :src="sendPhoto" />
  </template>
</template>
<script setup>
import { defineComponent } from "vue";

import FileTransfer from "../components/FileTransfer.vue";

import { useCreateDataCannel } from "../hooks/useCreateDataCannel";

defineComponent({ name: "PeerConnection" });

const props = defineProps(["stream"]);

let offerSdp = "";
let answerSdp = "";
let peerConnection;

const { channel, sendPhoto, createDataChannel } = useCreateDataCannel();

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

const createPeerConn = () => {
  peerConnection = new RTCPeerConnection();
  createDataChannel(peerConnection);
  props.stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, props.stream);
  });

  const remoteVideo = document.getElementById("remoteVideo");
  peerConnection.ontrack = (event) => {
    console.log("peerConnection", event);
    remoteVideo.srcObject = event.streams[0];
  };
};

const createOffer = async () => {
  const offer = await peerConnection.createOffer();
  console.log("createOffer", offer);
  await peerConnection.setLocalDescription(offer);
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      offerSdp = JSON.stringify(peerConnection.localDescription);
      localStorage.setItem("offerSdp", offerSdp);
    }
  };
};

const createAnswer = async () => {
  offerSdp = localStorage.getItem("offerSdp");
  console.log("createAnswer offerSdp", offerSdp);
  const offer = JSON.parse(offerSdp);
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  console.log("createAnswer answer", answer);
  await peerConnection.setLocalDescription(answer);
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      answerSdp = JSON.stringify(peerConnection.localDescription);
      localStorage.setItem("answerSdp", answerSdp);
    }
  };
};

const addAnswer = async () => {
  answerSdp = localStorage.getItem("answerSdp");
  console.log("addAnswer answerSdp", answerSdp);
  const answer = JSON.parse(answerSdp);
  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer);
  }
};
</script>
