import { ref } from "vue";

const useMediaRecorder = () => {
  let mediaRecorder = ref();
  const mediaRecorderStatus = ref(false);

  const startRecord = (stream) => {
    mediaRecorderStatus.value = true;
    console.log(stream);
    mediaRecorder.value = new MediaRecorder(stream);
    mediaRecorder.value.start();
    mediaRecorder.value.ondataavailable = (e) => {
      downloadRecord(e.data);
    };
  };

  const stopRecord = () => {
    console.log("停止录制");
    mediaRecorder.value.stop();
    mediaRecorder.value = null;
    mediaRecorderStatus.value = false;
  };

  const downloadRecord = (blob) => {
    console.log(blob);
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "record.mp4";
    a.click();
    URL.revokeObjectURL(a.href);
    a = null;
  };

  return { startRecord, stopRecord, mediaRecorderStatus };
};

export { useMediaRecorder };
