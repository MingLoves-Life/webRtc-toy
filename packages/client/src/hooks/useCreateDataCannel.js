import { ref } from "vue";

const useCreateDataCannel = () => {
  let channel = ref();
  let sendPhoto = ref();
  const createDataChannel = (peerConnection) => {
    console.log("createDataChannel");
    const dataChannel = peerConnection.createDataChannel("fileTransfer", {
      ordered: true,
    });
    channel.value = dataChannel;
    receive(peerConnection);
    send(dataChannel);
  };

  return { channel, sendPhoto, createDataChannel };
};

// 接收方事件
const receive = (peerConnection) => {
  peerConnection.ondatachannel = function (event) {
    const { channel } = event;

    channel.onopen = function (event) {
      console.log("接收方文件通道已打开", event);
      channel.send("接收方接收测试数据");
    };

    channel.onmessage = function (event) {
      console.log("接收方接收数据", event.data);
      sendPhoto.value = event.data;
    };
  };
};

// 发送方事件
const send = (dataChannel) => {
  dataChannel.onopen = (event) => {
    console.log("发送方文件通道已打开", event);
    dataChannel.send("发送方发送测试数据");
  };

  dataChannel.onclose = (event) => {
    ElMessage.warning("文件通道已关闭");
  };

  dataChannel.onerror = (event) => {
    ElMessage.error("文件通道发生错误");
  };

  dataChannel.onmessage = (event) => {
    console.log("发送方 onmessage", event.data);
  };
};
export { useCreateDataCannel };
