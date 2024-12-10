import { useCallback, useEffect, useMemo, useRef } from 'react';
import ChatwsContext, { groupDataType } from './chatwsContext';
import { useAppDispatch, useAppSelector } from '../../providers/hooks';
import { UserStatusEnum } from '../../../schemas/authSchema';
import { RootState } from '../store';

type ChatwsProviderProps = {
  children: JSX.Element;
};

export default function ChatwsProvider({ children }: ChatwsProviderProps): JSX.Element {
  const status = useAppSelector((state: RootState) => state.auth.user.status);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    function socketInit(): void {
      if (status !== UserStatusEnum.logged) return;

      const socket = new WebSocket('http://localhost:3000');
      socket.onopen = () => {
        console.log('Соединение открыто');
      };
      socket.onclose = () => {
        console.log('Сокет закрылся');
        if (status === UserStatusEnum.logged) {
          reconnectTimeout.current = setTimeout(socketInit, 3000);
        }
      };
      socket.onerror = console.error;
      socket.onmessage = (message) => {
        const action = JSON.parse(message.data as string);
        console.log(`Получено сообщение:`, action);
        dispatch(action);
      };
      socketRef.current = socket;
    }

    socketInit();

    return () => {
      const socket = socketRef.current;
      if (socket) {
        socket.close();
        console.log('Сокет закрыт при логауте');
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [status, dispatch]);

  const sendData = useCallback((text: string, groupId: string | undefined) => {
    const socket = socketRef.current;
    if (!socket) return;
    const action = {
      type: 'NEW_MESSAGE',
      payload: {
        text: text,
        groupid: groupId,
      },
    };
    socket.send(JSON.stringify(action));
  }, []);

  const editMessage = useCallback((messageId: number, newText: string, groupId: number) => {
    const socket = socketRef.current;
    if (!socket) return;
    const action = {
      type: 'EDIT_MESSAGE',
      payload: {
        messageId,
        text: newText,
        groupid: groupId,
      },
    };
    socket.send(JSON.stringify(action));
  }, []);

  const deleteMessage = useCallback((messageId: number, groupId: number) => {
    const socket = socketRef.current;
    if (!socket) return;
    const action = {
      type: 'DELETE_MESSAGE',
      payload: {
        messageId,
        groupid: groupId,
      },
    };
    socket.send(JSON.stringify(action));
  }, []);

  const sendGroupData = useCallback((groupData: groupDataType) => {
    const socket = socketRef.current;
    if (!socket) return;

    const action = {
      type: 'NEW_GROUP',
      payload: groupData,
    };

    socket.send(JSON.stringify(action));
  }, []);

  const sendDataDraw = useCallback((text: string) => {
    const socket = socketRef.current;
    if (!socket) return;
    const action = {
      type: 'NEW_DRAW',
      payload: text,
    };
    socket.send(JSON.stringify(action));
  }, []);

  const contextData = useMemo(
    () => ({ sendData, sendDataDraw, editMessage, sendGroupData, deleteMessage }),
    [sendData, sendDataDraw, editMessage, deleteMessage],
  );

  return <ChatwsContext.Provider value={contextData}>{children}</ChatwsContext.Provider>;
}
