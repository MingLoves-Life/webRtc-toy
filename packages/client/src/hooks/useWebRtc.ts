import { nextTick, defineComponent, onMounted, watchEffect, ref, Ref } from 'vue';
import { useCanvasChangeBackground } from './useCanvasChangeBackground';
import { useMediaRecorder } from './useMediaRecorder';

type UseWebRtcProps = {
  videoSelector: string;
  canvasSelect: string;
  captureCanvasSelect: string;
};

const useWebRtc = ({ videoSelector, canvasSelect, captureCanvasSelect }: UseWebRtcProps) => {
  let stream: Ref<MediaStream | undefined> = ref();
  let localVideo, localCanvas;

  const canvasChangeBackground = useCanvasChangeBackground();

  const { startRecord, stopRecord, mediaRecorderStatus } = useMediaRecorder();

  onMounted(() => {
    localVideo = document.querySelector(videoSelector);
    localCanvas = document.querySelector(canvasSelect);
  });

  const getStream = async () => {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' }
    });
  };

  const drawCanvas = () => {
    const canvas = document.querySelector(canvasSelect) as HTMLCanvasElement;

    const width = +getComputedStyle(localVideo).width.slice(0, -2);
    const height = +getComputedStyle(localVideo).height.slice(0, -2);

    localCanvas.width = width;
    localCanvas.height = height;

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(localVideo, 0, 0, width, height);
        const realData = ctx.getImageData(0, 0, width, height);
        canvasChangeBackground.changeBackground(realData, ctx);
        requestAnimationFrame(draw);
      }
    };

    draw();
  };

  const openCamera = async () => {
    await getStream();
    localVideo.srcObject = stream.value;
    localVideo.onplay = () => {
      nextTick(() => drawCanvas());
    };
  };

  const capture = () => {
    const captureCanvas = document.querySelector(captureCanvasSelect) as HTMLCanvasElement;

    captureCanvas.width = +getComputedStyle(localVideo).width.slice(0, -2);
    captureCanvas.height = +getComputedStyle(localVideo).height.slice(0, -2);

    const ctx = captureCanvas.getContext('2d');
    if (ctx) ctx.drawImage(localVideo, 0, 0, captureCanvas.width, captureCanvas.height);
  };

  const updateCamera = async () => {
    await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: 'environment' } }
    });
  };

  return {
    stream,
    openCamera,
    capture,
    updateCamera,
    ...canvasChangeBackground,
    startRecord: () => startRecord(stream),
    stopRecord,
    mediaRecorderStatus
  };
};

export { useWebRtc };
