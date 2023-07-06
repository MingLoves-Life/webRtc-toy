<template>
  <Camera @updateStream="updateStream" @ChangeBackground="ChangeBackgroundRef?.changBack" />
  <ShareScreen />
  <ChangeBackground ref="ChangeBackgroundRef" />

  <Record :stream="stream" />
  <Devices />
  <PeerConnection />
  <div>本地摄像头</div>
  <video id="localVideo" muted autoplay width="200" style="transform: scaleX(-1)"></video>
  <div>远程摄像头</div>
  <video id="remoteVideo" muted autoplay width="200" style="transform: scaleX(-1)"></video>
  <div>本地canvas</div>
  <canvas id="localCanvas"></canvas>
  <div>合成canvas</div>
  <canvas id="vCanvas"></canvas>
</template>

<script setup>
import { ref, onMounted } from "vue";

import Camera from "./components/Camera.vue";
import Devices from "./components/Devices.vue";
import Record from "./components/Record.vue";
import ShareScreen from "./components/ShareScreen.vue";
import ChangeBackground from "./components/ChangeBackground.vue";
import PeerConnection from "./components/PeerConnection.vue";

onMounted(() => {
  fetch("http://localhost:3008/post", {
    method: "post",
    body: JSON.stringify({ test: 1 }),
  });
});

const ChangeBackgroundRef = ref();

let stream = ref();
const updateStream = (stream) => (stream.value = stream);
</script>

<style scoped></style>
