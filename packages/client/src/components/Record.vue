<template>
  <button v-if="!props.webRtc.mediaRecorderStatus?.value" @click="props.webRtc.startRecord">
    开始录制
  </button>
  <button v-else @click="props.webRtc.stopRecord">停止录制</button>
</template>
<script setup>
import { defineComponent } from "vue";

defineComponent({ name: "Record" });

const props = defineProps(["webRtc"]);
</script>
