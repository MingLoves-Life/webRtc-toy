<template>
  <button @click="shareScreen">屏幕共享</button>
</template>
<script setup>
import { defineComponent } from "vue";

defineComponent({ name: "ShareScreen" });

const shareScreen = () => {
  navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
    const video = document.getElementById("localVideo");
    video.srcObject = stream;
  });
};
</script>
