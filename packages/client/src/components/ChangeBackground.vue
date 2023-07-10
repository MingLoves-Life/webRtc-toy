<template>
  <button @click="props.webRtc.updateChangeBackgroundStatus">
    {{ (props.webRtc.changeBackgroundStatus.value ? "取消" : "") + "更换背景" }}
  </button>
  <input
    v-model="props.webRtc.changeBackgroundAllowance.value"
    type="text"
    style="width: 40px"
  />
</template>
<script setup>
import { defineComponent } from "vue";

defineComponent({ name: "ChangeBackground" });

const props = defineProps(["webRtc"]);
</script>
