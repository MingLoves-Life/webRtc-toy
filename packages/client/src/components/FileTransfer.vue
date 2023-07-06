<template>
  <button @click="fileSelect">上传文件</button>
  <input
    type="file"
    id="fileToUpload"
    style="display: none"
    @change="fileSelected"
  />
</template>
<script setup>
import { defineComponent } from "vue";

defineComponent({ name: "FileTransfer" });

const props = defineProps({
  channel: RTCDataChannel,
});

function fileSelect() {
  document.getElementById("fileToUpload").click();
}

function fileSelected() {
  let files = document.getElementById("fileToUpload").files;
  console.log(files[0]);
  var reader = new FileReader();
  reader.readAsDataURL(files[0]);
  reader.onloadend = function (e) {
    props.channel(e.target.result);
  };
}

async function readFileData(file) {
  let offset = 0;
  let buffer = null;
  const chunkSize = pc.sctp.maxMessageSize;
  while (offset < file.size) {
    const slice = file.slice(offset, offset + chunkSize);
    buffer = await slice.arrayBuffer();
    if (dcFile.bufferedAmount > 65535) {
      // 等待缓存队列降到阈值之下
      await new Promise((resolve) => {
        dcFile.onbufferedamountlow = (ev) => {
          log(
            "bufferedamountlow event! bufferedAmount: " + dcFile.bufferedAmount
          );
          resolve(0);
        };
      });
    }

    // 可以发送数据了
    dcFile.send(buffer);
    offset += buffer.byteLength;
    sendProgress.value = offset;

    // 更新发送速率
    const interval = new Date().getTime() - lastReadTime;
    bitrateSpan.textContent = `${Math.round((chunkSize * 8) / interval)}kbps`;
    lastReadTime = new Date().getTime();
  }
}
</script>
