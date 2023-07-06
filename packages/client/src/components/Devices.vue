<template>
  <button @click="getDevice">获取设备列表</button>
</template>
<script setup>
import { defineComponent } from "vue";

defineComponent({ name: "Devices" });

const getDevice = () => {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    console.log(devices);
  });
};
</script>
