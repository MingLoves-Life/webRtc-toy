<template>
  <button @click="props.webRtc.openCamera">打开摄像头</button>
  <button @click="props.webRtc.updateCamera">切换摄像头</button>
  <button @click="props.webRtc.capture">截图</button>
</template>
<script setup>
import { defineComponent, onMounted } from "vue";
defineComponent({ name: "Camera" });

const props = defineProps(["webRtc"]);

onMounted(() => {
  props.webRtc.openCamera();
});
</script>
