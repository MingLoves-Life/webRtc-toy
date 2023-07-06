<template>
  <button @click="getStream">打开摄像头</button>
  <button @click="updateCamera">切换摄像头</button>
  <button @click="capture">截图</button>
  <div>截图</div>
  <canvas id="captureCanvas"></canvas>
</template>
<script setup>
import { nextTick, defineComponent } from "vue";

defineComponent({ name: "Camera" });

const emit = defineEmits(["updateStream", "ChangeBackground"]);

const getStream = async () => {
 const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
  });
  emit("updateStream", stream);
  const video = document.getElementById("localVideo");
  video.srcObject = stream;
  video.onplay = () => {
    nextTick(() => drawCanvas(video));
  };
};

const drawCanvas = (video) => {
  const canvas = document.getElementById("localCanvas");

  canvas.width = getComputedStyle(video).width.slice(0, -2);
  canvas.height = getComputedStyle(video).height.slice(0, -2);

  const draw = () => {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const realData = ctx.getImageData(0, 0, vCanvas.width, vCanvas.height);
    emit("ChangeBackground", realData, ctx);
    requestAnimationFrame(draw);
  };
  draw();
};

const updateCamera = async () => {
  await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { exact: "environment" } },
  });
};

const capture = () => {
  const video = document.getElementById("localVideo");
  const canvas = document.getElementById("captureCanvas");
  canvas.width = getComputedStyle(video).width.slice(0, -2);
  canvas.height = getComputedStyle(video).height.slice(0, -2);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
};
</script>
