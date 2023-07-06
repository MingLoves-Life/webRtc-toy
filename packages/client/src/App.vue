<template>
  <Camera :webRtc="webRtc" />
  <ShareScreen />
  <ChangeBackground :webRtc="webRtc" />

  <Record :stream="stream" />
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

onMounted(() => {
  fetch("http://localhost:3008/post", {
    method: "post",
    body: JSON.stringify({ test: 1 }),
  });
});

const ChangeBackgroundRef = ref();

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
