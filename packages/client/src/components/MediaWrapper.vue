<template>
  <div class="media-wrapper">
    <div>
      <div>本地摄像头</div>
      <video id="localVideo" muted autoplay width="200"></video>
    </div>

    <div>
      <div>远程摄像头</div>
      <video id="remoteVideo" muted autoplay width="200"></video>
    </div>

    <div>
      <div>本地canvas</div>
      <canvas id="localCanvas"></canvas>
    </div>

    <div>
      <div>截图</div>
      <canvas id="captureCanvas"></canvas>
    </div>
  </div>
</template>
<script setup>
import { defineComponent } from "vue";
defineComponent({ name: "MediaWrapper" });
</script>
<style scoped>
video {
  transform: scaleX(-1);
}

canvas {
  transform: scaleX(-1);
}

.media-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
