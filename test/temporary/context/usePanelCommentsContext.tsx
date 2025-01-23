import React, { createContext, useContext, ReactNode, useMemo, useEffect, useState } from 'react';
import { useTaskPanelContext } from './useTaskPanelContext';
import { usePanelDataContext } from './usePanelDataContext';
import { getMembersList } from '../../utils/conferenceUtils';
import { ITaskConference, ITaskMessage } from '../types/automationInterfaces';

interface PanelCommentsContextType {
  conferences: Record<string, ITaskConference>;
  messagesAll: Record<string, Record<string, ITaskMessage>>;
  setDeferMessage: (message: ITaskMessage) => void;
  setMessageLocal: (message: ITaskMessage) => void;
  messagesDefer: Record<string, Record<string, ITaskMessage>>;
  loadConference: (props: any, count: number) => void;
}

const PanelCommentsContext = createContext<PanelCommentsContextType | undefined>(undefined);

interface PanelCommentsProviderProps {
  conferences: Record<string, ITaskConference>;
  messagesAll: Record<string, Record<string, ITaskMessage>>;
  addConference: (conf: ITaskConference) => void;
  setMessageLocal: (message: ITaskMessage) => void;
  sendMessage: (message: ITaskMessage) => void;
  loadConference: (props: any, count: number) => void;
  children: ReactNode;
}

export const PanelCommentsProvider: React.FC<PanelCommentsProviderProps> = ({
  conferences,
  messagesAll,
  setMessageLocal,
  addConference,
  loadConference,
  sendMessage,
  children,
}) => {
  const [messagesDefer, setMessagesDeferContext] = useState<
    Record<string, Record<string, ITaskMessage>>
  >({});
  const { task } = useTaskPanelContext();
  const { users, subtasks } = usePanelDataContext();

  const setDeferMessage = (message: ITaskMessage) => {
    const messId = message.message.meta.id;
    const confId = message.endpoint.conference as string;
    const conference = conferences[confId] ?? null;
    if (conference) {
      sendMessage(message);
    }
    if (!messagesDefer[confId]) messagesDefer[confId] = {};
    messagesDefer[confId][messId] = message;

    setMessagesDeferContext((prevMessagesDefer) => {
      const updatedMessagesDefer = { ...prevMessagesDefer };

      if (!updatedMessagesDefer[confId]) {
        updatedMessagesDefer[confId] = {};
      }
      updatedMessagesDefer[confId][messId] = message;
      return updatedMessagesDefer;
    });
  };

  useEffect(() => {
    const confIds = Object.keys(messagesDefer);
    if (!task) return;
    confIds.forEach((confId, index) => {
      if (conferences[confId]) {
        const confDeferMessages = messagesDefer[confId];
        Object.keys(confDeferMessages).forEach((messageId) => {
          const message = confDeferMessages[messageId];
          sendMessage(message);
        });
      } else {
        const membersList = getMembersList(task, users, subtasks);
        const newConf = {
          id: confId,
          name: task?.task.name,
          members: membersList,
        };
        // @ts-ignore
        addConference(newConf);
      }
    });
  }, [messagesDefer, conferences]);

  useEffect(() => {
    const confIds = Object.keys(messagesDefer);
    const sendedMessages: string[] = [];
    confIds.forEach((confId, index) => {
      if (messagesDefer[confId] && messagesAll[confId]) {
        const confDeferMessages = messagesDefer[confId];
        Object.keys(confDeferMessages).forEach((messageId) => {
          if (confDeferMessages[messageId] && messagesAll[confId][messageId]) {
            sendedMessages.push(messageId);
          }
        });
      }
    });
    if (sendedMessages.length > 0) {
      setMessagesDeferContext((prevDeferMessages) => {
        const updatedMessagesDefer = { ...prevDeferMessages };

        Object.keys(updatedMessagesDefer).forEach((confId) => {
          if (updatedMessagesDefer[confId]) {
            updatedMessagesDefer[confId] = Object.keys(updatedMessagesDefer[confId])
              .filter((messageId) => !sendedMessages.includes(messageId))
              .reduce(
                (acc, messageId) => {
                  acc[messageId] = updatedMessagesDefer[confId][messageId];
                  return acc;
                },
                {} as Record<string, ITaskMessage>,
              );
          }
        });
        return updatedMessagesDefer;
      });
    }
  }, [messagesAll]);

  useEffect(() => {
    const confId = task?.task.id;
    const data = {
      equal: {
        endpoint: {
          conference: confId,
        },
      },
    };
    confId && loadConference(data, 0);
  }, [task, messagesDefer]);

  const value = useMemo(
    () => ({
      conferences,
      messagesAll,
      messagesDefer,
      setDeferMessage,
      setMessageLocal,
      loadConference
    }),
    [conferences, messagesAll, messagesDefer,loadConference, setMessageLocal, setDeferMessage],
  );

  return <PanelCommentsContext.Provider value={value}>{children}</PanelCommentsContext.Provider>;
};

export const usePanelCommentsContext = (): PanelCommentsContextType => {
  const context = useContext(PanelCommentsContext);
  if (!context) {
    throw new Error('usePanelCommentsContext must be used within a PanelCommentsProvider');
  }
  return context;
};
