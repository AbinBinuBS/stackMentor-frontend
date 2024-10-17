import io from 'socket.io-client';
import { LOCALHOST_URL } from '../constants/constants';

interface Notification {
  _id:string;
  message: string;
  chatId: string;
  senderId: string;
  messageText: string;
}


let socket: any;

export const initializeSocket = (userId: string) => {
  socket = io(LOCALHOST_URL);
  socket.emit('setup', { _id: userId });
  return socket;
};

export const joinChatRoom = (chatId: string) => {
  socket.emit('join chat', chatId);
};

export const  sendMessage = (message: any) => {
  socket.emit('new message', message);
};

export const handleTyping = (chatId: string) => {
  socket.emit('typing', chatId);
};

export const stopTyping = (chatId: string) => {
  socket.emit('stop typing', chatId);
};

export const onMessageReceived = (callback: (message: any) => void) => {
  socket.on('message received', callback);
};

export const onNotificationReceived = (callback: (notification: { _id:string,message: string, chatId: string, senderId: string, messageText: string }) => void) => {
  socket.on('new notification', (notification:Notification) => {
    callback(notification);
  });
};

export const onTyping = (callback: () => void) => {
  socket.on('typing', callback);
};

export const onStopTyping = (callback: () => void) => {
  socket.on('stop typing', callback);
};



export const disconnectSocket = () => {
  socket.disconnect();
};
