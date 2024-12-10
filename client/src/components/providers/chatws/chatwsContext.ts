import { createContext } from 'react';

export type groupDataType = {
  id?: string ;
  title: string;
  description: string;
  chatflag: boolean;
  ownerid: number | null;
  users: string[];
};
type ChatwsContextType = {
  sendData: (text: string, groupId: string | undefined) => void;
  sendDataDraw: (text: string) => void;
  sendGroupData(groupData: groupDataType): void;
  editMessage: (messageId: number, newText: string, groupId: number) => void;
  deleteMessage: (messageId: number, groupId: number) => void;
};

const ChatwsContext = createContext<ChatwsContextType>({
  sendData: () => {},
  sendDataDraw: () => {},
  sendGroupData: () => {},
  editMessage: () => {},
  deleteMessage: () => {},
});

export default ChatwsContext;
