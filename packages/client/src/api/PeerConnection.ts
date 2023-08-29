import { io } from 'socket.io-client';

let id = '';
let getIdsListCallback: ((ids: string[]) => void)[] = [];
let getOfferCallback: ((offer: RTCSessionDescriptionInit) => void)[] = [];

const socket = io('http://localhost:3008', {
  withCredentials: true
});

const post = (key, params) => {
  socket.emit(key, { ...params, id }, (value) => {
    console.log('client', key, value);
  });
};

socket.on('connect', () => {
  console.log('client connect', socket.id);
  id = socket.id;
});

socket.on('getIdsList', ({ ids }: { ids: string[] }) => {
  console.log('client getIdsList', ids);
  const callBack = getIdsListCallback.pop();
  if (callBack) callBack(ids);
});

socket.on('getOffer', ({ offer }: { offer: RTCSessionDescriptionInit }) => {
  console.log('client getOffer', offer);
  const callBack = getOfferCallback.pop();
  if (callBack) callBack(offer);
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

export const getOffer = async (id): Promise<RTCSessionDescriptionInit> => {
  return new Promise((resolve) => {
    post('getOffer', { id });
    getOfferCallback.push(resolve);
  });
};
