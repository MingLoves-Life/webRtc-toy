<template>
  <Camera :webRtc="webRtc" />
  <ShareScreen />
  <ChangeBackground :webRtc="webRtc" />

  <Record :webRtc="webRtc" />
  <Devices />
  <PeerConnection :stream="stream" />
  <MediaWrapper />
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";

import Camera from "./components/Camera.vue";
import Devices from "./components/Devices.vue";
import Record from "./components/Record.vue";
import ShareScreen from "./components/ShareScreen.vue";
import ChangeBackground from "./components/ChangeBackground.vue";
import PeerConnection from "./components/PeerConnection.vue";
import MediaWrapper from "./components/MediaWrapper.vue";

import { useWebRtc } from "./hooks/useWebRtc";
import { sendOffer } from "./api/PeerConnection";
onMounted(() => {
  sendOffer()
});

const webRtc = useWebRtc({
  videoSelector: "#localVideo",
  canvasSelect: "#localCanvas",
  captureCanvasSelect: "#captureCanvas",
});

const stream = ref();
const updateStream = (stream) => {
  console.log("updateStream");
  stream.value = stream;
};
</script>
