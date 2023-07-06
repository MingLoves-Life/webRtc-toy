<template>
  <button v-if="!mediaRecorder" @click="startRecord">开始录制</button>
  <button v-else @click="stopRecord">停止录制</button>
</template>
<script setup>
import { defineComponent,ref } from "vue";

defineComponent({ name: "Record" });

const props = defineProps({
  stream: MediaStream,
});

let mediaRecorder=ref();

const startRecord = () => {
  console.log("开启录制");
  mediaRecorder.value = new MediaRecorder(props.stream);
  mediaRecorder.value .start();
  mediaRecorder.value .ondataavailable = (e) => {
    downloadRecord(e.data);
  };
};

const stopRecord = () => {
  console.log("停止录制");
  mediaRecorder.value .stop();
  mediaRecorder.value  = null;
};

const downloadRecord = (blob) => {
  console.log(blob);
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "record.mp4";
  a.click();
  URL.revokeObjectURL(a.href);
  a = null;
};
</script>
