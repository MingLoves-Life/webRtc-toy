import { ref } from "vue";

const useCanvasChangeBackground = () => {
  let backgroundImageData, localData, localContext;
  let changeBackgroundStatus = ref(false);
  const allowance = ref(40);

  const changeBackground = (data, context) => {
    if (!changeBackgroundStatus.value) return;
    localData = data;
    localContext = context;
    const backgroundImg = document.getElementById("backgroundImg");
    const vCanvas = document.getElementById("vCanvas");
    const video = document.getElementById("localVideo");
    vCanvas.width = getComputedStyle(video).width.slice(0, -2);
    vCanvas.height = getComputedStyle(video).height.slice(0, -2);
    const ctx = vCanvas.getContext("2d");
    ctx.drawImage(backgroundImg, 0, 0, vCanvas.width, vCanvas.height);
    backgroundImageData = ctx.getImageData(0, 0, vCanvas.width, vCanvas.height);
    processFrameDrawToVirtualVideo();
  };

  function processFrameDrawToVirtualVideo() {
    for (let i = 0; i < localData.data.length; i += 4) {
      const r = localData.data[i];
      const g = localData.data[i + 1];
      const b = localData.data[i + 2];
      const a = localData.data[i + 3];
      const bgR = backgroundImageData.data[i];
      const bgG = backgroundImageData.data[i + 1];
      const bgB = backgroundImageData.data[i + 2];
      const bgA = backgroundImageData.data[i + 3];

      const diff = colorDiff([r, g, b], [100, 100, 100]);
      if (diff < allowance.value) {
        localData.data[i] = bgR;
        localData.data[i + 1] = bgG;
        localData.data[i + 2] = bgB;
        localData.data[i + 3] = bgA;
      }
    }
    localContext.putImageData(localData, 0, 0);
  }

  const updateChangeBackgroundStatus = () => {
    changeBackgroundStatus.value = !changeBackgroundStatus.value;
  };

  const updateAllowance = (value) => {
    allowance.value = value;
  };

  return {
    changeBackgroundStatus,
    updateChangeBackgroundStatus,
    changeBackground,
    updateAllowance,
  };
};

function colorDiff(rgba1, rgba2) {
  let d = 0;
  for (let i = 0; i < rgba1.length; i++) {
    d += (rgba1[i] - rgba2[i]) ** 2;
  }
  return Math.sqrt(d);
}

export { useCanvasChangeBackground };
