<template>
  <button @click="startFind">开始查找</button>
  <button @click="find2">开始接收</button>
  <button @click="find3">开始连接</button>
  <button @click="createDataChannel">开始接传文件</button>
  <FileTransfer :channel="channel" />

  <template v-if="sendPhoto">
    <div>传输图片</div>
    <img :src="sendPhoto" />
  </template>

  <div v-for="id in ids" @click="startConnect(id)">{{ id }}</div>
</template>
<script setup lang="ts">
import { defineComponent, toRef, ref, Ref } from 'vue';
import { sendOffer, getIdsList, getOffer, sendAnswer } from '../api/PeerConnection';
import FileTransfer from '../components/FileTransfer.vue';
import { useCreateDataCannel } from '../hooks/useCreateDataCannel';

defineComponent({ name: 'PeerConnection' });

let offerSdp = '';
let answerSdp = '';
let peerConnection: RTCPeerConnection;

const props = defineProps(['stream']);
const stream = toRef(props, 'stream');
const ids: Ref<string[]> = ref([]);

const { channel, sendPhoto, createDataChannel } = useCreateDataCannel();

const startFind = async () => {
  createPeerConnection();
  await createOffer();
};

const find2 = async () => {
  createPeerConnection();
  await createAnswer();
};

const find3 = async () => {
  await addAnswer();
};

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection();
  createDataChannel(peerConnection);

  stream.value.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream.value);
  });

  const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
  peerConnection.ontrack = (event) => {
    console.log('peerConnection', event);
    if (remoteVideo) remoteVideo.srcObject = event.streams[0];
  };
};

const createOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate && peerConnection?.localDescription) sendOffer(peerConnection.localDescription);
  };
};

const createAnswer = async () => {
  const idsList = await getIdsList();
  ids.value = idsList;
};

const startConnect = async (id: string) => {
  const offer = await getOffer(id);
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  console.log('createAnswer answer', answer);
  await peerConnection.setLocalDescription(answer);
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate && peerConnection.localDescription) sendAnswer(peerConnection.localDescription);
  };
};

const addAnswer = async () => {
  answerSdp = localStorage.getItem('answerSdp');
  console.log('addAnswer answerSdp', answerSdp);
  const answer = JSON.parse(answerSdp);
  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer);
  }
};
</script>
