import clsx from 'clsx';
import * as React from 'react';
import './TaskConference.scss';
import { hexToRGBA, makeStyles, rgbaToHex, useTheme } from '@uds/utils';
import { TaskConferenceStyles } from './TaskConference.styles';
import { Message } from './components/Message';
import { UDSButton, UDSInput, UDSScroll, UDSTitle, UDSTooltip } from '@uds/react-components';
import { Sent } from '@uds/icons/16px';
import { v4 as uuidv4 } from 'uuid';
import { IFile } from '@skif/utils';
import { SkifFile } from '@skif/react-components';
import { getColorTask } from '../../../../../../utils/getColorTask';
import { ButtonAddFile } from './components/ButtonAddFile';
import { getTagsTask } from '../../../../../../utils/getTagsTask';
import { TasksStatus } from '../../../../../../../types/tasksInterfaces';
import { ITaskMessage } from '../../../../../../../types/automationInterfaces';
import { usePanelDataContext } from '../../../../../../../context/usePanelDataContext';
import { useTaskPanelContext } from '../../../../../../../context/useTaskPanelContext';
import { usePanelCommentsContext } from '../../../../../../../context/usePanelCommentsContext';
import { groupMessagesByDate, loadConference, sortMessagesByTimestamp } from '../../utils/conferenceUtils';

const useStyles = makeStyles(TaskConferenceStyles);

export const TaskConference: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const messageBlockRef = React.useRef<HTMLDivElement>(null);
  const { userId } = usePanelDataContext();
  const {conferences, messagesAll, messagesDefer, setDeferMessage, loadConference:loadConferenceClb } = usePanelCommentsContext(); 
  const { task } = useTaskPanelContext();
  const [sortedTaskMessages, setSortedTaskMessages] = React.useState(
    conferences && task?.task.id
      ? sortMessagesByTimestamp(messagesAll[task.task.id], messagesDefer[task.task.id])
      : null,
  );
  const [inputValue, setInputValue] = React.useState<string>('');
  const [files, setFiles] = React.useState<IFile[]>([]);

  const gropuedMessages = groupMessagesByDate(sortedTaskMessages);
  const tags = getTagsTask(task);
  const colorTask10 =
    theme.palette.mode === 'dark' ? '' : rgbaToHex(hexToRGBA(getColorTask(tags), 0.1));

  const messagesCount = sortedTaskMessages ? Object.values(sortedTaskMessages).length : 0;
  const isReadonly =
    task?.task.state.status === TasksStatus.Archived ||
    task?.task.state.status === TasksStatus.Succeed;

  const sendMessage = () => {
    if (!inputValue && files.length === 0) return;

    const newMessage: Partial<ITaskMessage> = {
      endpoint: {
        user: userId,
        conference: task?.task.id,
      },
      message: {
        meta: {
          id: uuidv4(),
        },
        payload: {
          value: inputValue,
          files,
        },
        type: 'skif.text',
      },
    };
    console.log('идет отправка сообщения ', newMessage);
    setDeferMessage({ ...newMessage, attributes: { sent: new Date().getTime() } } as ITaskMessage);
    loadConference(loadConferenceClb, task?.task.id);
    setInputValue('');
    setFiles([]);
  };

  React.useEffect(() => {
    if (!task?.task.id) return;

    if (!conferences || !conferences[task?.task.id]) {
      console.log('конференция не найдена', task?.task.id);
    } else {
      if (conferences[task?.task.id]) {
        console.log('конференция успешно найдена');
        loadConference(loadConferenceClb, task.task.id);
      }
    }
  }, [conferences, loadConference, task?.task.id]);

  React.useEffect(() => {
    console.log('Отложенные сообщение обновились в компоненте', messagesDefer);
    
    setSortedTaskMessages(
      conferences && task?.task.id
        ? sortMessagesByTimestamp(messagesAll[task.task.id], messagesDefer[task.task.id])
        : null,
    );
  }, [conferences, messagesAll, messagesDefer, task]);

  React.useEffect(() => {
    if (messageBlockRef.current?.children)
      messageBlockRef.current.scrollTop = messageBlockRef.current.scrollHeight;
  }, [sortedTaskMessages, messageBlockRef.current]);

  return (
    <div className={clsx('TaskConference', classes.root)} style={{ background: colorTask10 }}>
      <div className={clsx('Messages')} ref={messageBlockRef}>
        {messagesCount === 0 && (
          <UDSTitle className={'EmptyMessageList'} style={{ margin: 'auto' }}>
            нет сообщений
          </UDSTitle>
        )}
        {messagesCount > 0 &&
          sortedTaskMessages &&
          gropuedMessages &&
          Object.keys(gropuedMessages ?? {}).map((messageDate) => {
            const messageList = gropuedMessages[messageDate];

            return (
              <React.Fragment key={messageDate}>
                <div className={'MessageDateGroup'}>{messageDate}</div>
                {messageList.map((message) => {
                  const isDeferMessage = Object.keys(
                    messagesDefer[task?.task.id ?? ''] || {},
                  ).includes(message.message.meta.id);

                  return (
                    <Message
                      key={message.message.meta.id}
                      message={message}
                      selfId={userId}
                      isDeferMessage={isDeferMessage}
                    />
                  );
                })}
              </React.Fragment>
            );
          })}
        <UDSScroll />
      </div>
      {!isReadonly && (
        <div className={clsx('InputBlock')}>
          <UDSTooltip content="Прикрепить файл">
            <ButtonAddFile files={files} setFiles={setFiles} onlyIcon={true} />
          </UDSTooltip>
          <UDSInput
            className={clsx('MessageInput')}
            placeholder="Добавить комментарий"
            value={inputValue}
            onChange={(e, newValue) => setInputValue(newValue)}
            onKeyUpCapture={(e) => {
              const { code } = e;

              if (code === 'Enter' || code === 'NumpadEnter') sendMessage();
            }}
          />
          <UDSTooltip content="Отправить">
            <UDSButton startIcon={<Sent />} onClick={sendMessage} />
          </UDSTooltip>
        </div>
      )}
      {files.length > 0 && (
        <div className={clsx('FilesBlock')}>
          {files.map((file) => {
            return (
              <SkifFile
                key={file.value}
                file={file}
                readonly={false}
                onChange={() => {}}
                onDetach={(id: string) =>
                  setFiles((prev) => prev.filter((file) => file.value !== id))
                }
              />
            );
          })}
          <UDSScroll />
        </div>
      )}
    </div>
  );
};
