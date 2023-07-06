<template>
  <button @click="props.webRtc.updateChangeBackgroundStatus">
    {{ changeStatus ? "取消" : "" }}更换背景
  </button>
  <input v-model="allowance" type="text" style="width: 40px" />
  <template v-if="props.webRtc.changeBackgroundStatus">
    <div>替换背景图片</div>
    <img id="backgroundImg" :src="Beach" style="width: 200px" />
  </template>
</template>
<script setup>
import { defineComponent, ref } from "vue";
import Beach from "../assets/beach.jpeg";

defineComponent({ name: "ChangeBackground" });
const props = defineProps(["webRtc"]);

const allowance = ref(40);
</script>
