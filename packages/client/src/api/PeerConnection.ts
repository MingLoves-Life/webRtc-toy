import { io } from 'socket.io-client';

declare global {
  interface Window {
    id: any;
  }
}

window.id = '';
let getIdsListCallback: ((ids: string[]) => void)[] = [];
let getOfferCallback: ((offer: RTCSessionDescriptionInit) => void)[] = [];
export let getAnswerCallback: ((offer: RTCSessionDescriptionInit) => void)[] = [];

const socket = io(
  import.meta.env.MODE === 'development' ? 'http://localhost:3008' : 'https://web-rtc-toy-server.vercel.app',
  {
    withCredentials: true
  }
);

const post = (key: string, params: Record<string, unknown>) => {
  socket.emit(key, { ...params, id: window.id }, (value: unknown) => {
    console.log('client', key, value);
  });
};

socket.on('connect', () => {
  console.log('client connect', socket.id);
  window.id = socket.id;
});

socket.on('getIdsList', ({ ids }: { ids: string[] }) => {
  console.log('client getIdsList', ids);
  const callBack = getIdsListCallback.pop();
  if (callBack) callBack(ids);
});

socket.on('getOffer', ({ connectId, offer }: { connectId: string; offer: RTCSessionDescriptionInit }) => {
  console.log('client getOffer', connectId, offer);
  const callBack = getOfferCallback.pop();
  if (callBack) callBack(offer);
});

socket.on('getAnswer', ({ id, remotePeerAnswer }: { id: string; remotePeerAnswer: RTCSessionDescriptionInit }) => {
  console.log('client getAnswer', id, remotePeerAnswer);
  const callBack = getAnswerCallback.pop();
  if (callBack) callBack(remotePeerAnswer);
});

export const sendOffer = async (remotePeerOffer: RTCSessionDescriptionInit) => {
  post('sendOffer', { remotePeerOffer });
};

export const sendAnswer = async (remotePeerAnswer: RTCSessionDescriptionInit) => {
  post('sendAnswer', { remotePeerAnswer });
};

export const getIdsList = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    post('getIdsList', {});
    getIdsListCallback.push(resolve);
  });
};

export const getOffer = async (connectId: String): Promise<RTCSessionDescriptionInit> => {
  return new Promise((resolve) => {
    post('getOffer', { connectId });
    getOfferCallback.push(resolve);
  });
};
