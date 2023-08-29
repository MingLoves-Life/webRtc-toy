const post = async (path, body) => {
  fetch("http://localhost:3008/" + path, {
    method: 'post',
    body: JSON.stringify(body),
  });
};

export const sendOffer = async (peerConnection, remotePeerId) => {
  await post("post", { test: 2 });
};
