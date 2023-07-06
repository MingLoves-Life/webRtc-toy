<template>
  <button @click="changeBackground">{{ change ? "取消" : "" }}更换背景</button>
  <input v-model="allowance" type="text" style="width: 40px" />
  <template v-if="change">
    <div>替换背景图片</div>
    <img id="backgroundImg" :src="Beach" style="width: 200px" />
  </template>
</template>
<script setup>
import { defineComponent, ref } from "vue";
import Beach from "../assets/beach.jpeg";

defineComponent({ name: "ChangeBackground" });

const allowance = ref(40);
const change = ref(false);

const changeBackground = () => (change.value = !change.value);

let realData, realCtx;

const changeBack = (data, context) => {
  if (!change.value) return;
  realData = data;
  realCtx = context;
  const backgroundImg = document.getElementById("backgroundImg");
  const vCanvas = document.getElementById("vCanvas");
  const video = document.getElementById("localVideo");
  vCanvas.width = getComputedStyle(video).width.slice(0, -2);
  vCanvas.height = getComputedStyle(video).height.slice(0, -2);
  const ctx = vCanvas.getContext("2d");
  ctx.drawImage(backgroundImg, 0, 0, vCanvas.width, vCanvas.height);
  const backgroundImageData = ctx.getImageData(
    0,
    0,
    vCanvas.width,
    vCanvas.height
  );
  processFrameDrawToVirtualVideo(backgroundImageData);
};

function processFrameDrawToVirtualVideo(backgroundImageData) {
  for (let i = 0; i < realData.data.length; i += 4) {
    const r = realData.data[i];
    const g = realData.data[i + 1];
    const b = realData.data[i + 2];
    const a = realData.data[i + 3];
    const bgR = backgroundImageData.data[i];
    const bgG = backgroundImageData.data[i + 1];
    const bgB = backgroundImageData.data[i + 2];
    const bgA = backgroundImageData.data[i + 3];

    const diff = colorDiff([r, g, b], [100, 100, 100]);
    if (diff < allowance.value) {
      realData.data[i] = bgR;
      realData.data[i + 1] = bgG;
      realData.data[i + 2] = bgB;
      realData.data[i + 3] = bgA;
    }
  }
  realCtx.putImageData(realData, 0, 0);
}

function colorDiff(rgba1, rgba2) {
  let d = 0;
  for (let i = 0; i < rgba1.length; i++) {
    d += (rgba1[i] - rgba2[i]) ** 2;
  }
  return Math.sqrt(d);
}

defineExpose({ changeBack });
</script>
