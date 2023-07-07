<template>
  <button @click="props.webRtc.updateChangeBackgroundStatus">
    {{ (props.webRtc.changeBackgroundStatus.value ? "取消" : "") + "更换背景" }}
  </button>
  <input
    v-model="props.webRtc.changeBackgroundAllowance.value"
    type="text"
    style="width: 40px"
  />
  <template v-if="props.webRtc.changeBackgroundStatus.value">
    <div>替换背景图片</div>
    <img id="backgroundImg" :src="Beach" style="width: 200px" />
  </template>
</template>
<script setup>
import { defineComponent } from "vue";
import Beach from "../assets/beach.jpeg";

defineComponent({ name: "ChangeBackground" });

const props = defineProps(["webRtc"]);
</script>
