import { ref } from "vue";
import Beach from "../assets/beach.jpeg";

const useCanvasChangeBackground = () => {
  let backgroundImageData, localData, localContext;
  let changeBackgroundStatus = ref(false);
  const changeBackgroundAllowance = ref(40);
  let backgroundImg;
  let vCanvas;

  const getBackgroundImageData = (width, height) => {
    if (!backgroundImg) {
      backgroundImg = createEl("img", { width, height, src: Beach });
    }

    if (!vCanvas) {
      vCanvas = createEl("canvas", { width, height, id: "vCanvas" });
    }
    const ctx = vCanvas.getContext("2d");
    ctx.drawImage(backgroundImg, 0, 0, width, height);
    backgroundImageData = ctx.getImageData(0, 0, width, height);
  };

  const changeBackground = (data, context) => {
    if (!changeBackgroundStatus.value) return;
    localData = data;
    localContext = context;
    const video = document.getElementById("localVideo");
    const width = getComputedStyle(video).width.slice(0, -2);
    const height = getComputedStyle(video).height.slice(0, -2);

    getBackgroundImageData(width, height);

    processFrameDrawToVirtualVideo();
  };

  function processFrameDrawToVirtualVideo() {
    if (!localData?.data || !backgroundImageData?.data) return;
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
      if (diff < changeBackgroundAllowance.value) {
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
    console.log(value);
    changeBackgroundAllowance.value = value;
  };

  return {
    changeBackgroundStatus,
    updateChangeBackgroundStatus,
    changeBackground,
    changeBackgroundAllowance,
    updateAllowance,
  };
};

const colorDiff = (rgba1, rgba2) => {
  let d = 0;
  for (let i = 0; i < rgba1.length; i++) {
    d += (rgba1[i] - rgba2[i]) ** 2;
  }
  return Math.sqrt(d);
};

const createEl = (type, options) => {
  const el = document.createElement(type);
  document.body.appendChild(el);
  el.style = `position: fixed;top: 10000px;left: 10000px;`;
  for (const key in options) {
    if (Object.hasOwnProperty.call(options, key)) el[key] = options[key];
  }
  return el;
};

export { useCanvasChangeBackground };
