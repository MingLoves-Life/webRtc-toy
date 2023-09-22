declare global {
  interface Window {
    _id: any;
  }
}

window._id = '';

const baseUrl =
  import.meta.env.MODE === 'development' ? 'http://localhost:80' : 'https://web-rtc-toy-server.vercel.app';

const post = (key: string, params: Record<string, unknown> = {}) => {
  const config = { ...params, ...(window?._id ? { id: window?._id } : {}) };
  return fetch(`${baseUrl}/${key}`, { method: 'POST', body: JSON.stringify(config) })
    .then((res) => res.json())
    .then(({ data }) => data);
};

post('connection').then(({ id }) => {
  window._id = id;
});

// socket.on('getIdsList', ({ ids }: { ids: string[] }) => {
//   console.log('client getIdsList', ids);
//   const callBack = getIdsListCallback.pop();
//   if (callBack) callBack(ids);
// });

// socket.on('getOffer', ({ connectId, offer }: { connectId: string; offer: RTCSessionDescriptionInit }) => {
//   console.log('client getOffer', connectId, offer);
//   const callBack = getOfferCallback.pop();
//   if (callBack) callBack(offer);
// });

// socket.on('getAnswer', ({ id, remotePeerAnswer }: { id: string; remotePeerAnswer: RTCSessionDescriptionInit }) => {
//   console.log('client getAnswer', id, remotePeerAnswer);
//   const callBack = getAnswerCallback.pop();
//   if (callBack) callBack(remotePeerAnswer);
// });

export const sendOffer = async (remotePeerOffer: RTCSessionDescriptionInit) => {
  post('sendOffer', { remotePeerOffer });
};

export const sendAnswer = async (remotePeerAnswer: RTCSessionDescriptionInit) => {
  post('sendAnswer', { remotePeerAnswer });
};

export const getIdsList = async (): Promise<{ idsList: string[] }> => {
  return post('getIdsList');
};

export const getOffer = async (connectId: String): Promise<RTCSessionDescriptionInit> => {
  return new Promise((resolve) => {
    post('getOffer', { connectId });
  });
};
