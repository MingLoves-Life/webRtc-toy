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
</script>
