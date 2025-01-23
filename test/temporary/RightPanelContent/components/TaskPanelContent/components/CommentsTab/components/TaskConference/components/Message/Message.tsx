import React, { FC, useEffect, useState } from 'react';
import './Message.scss';
import { makeStyles, useTheme } from '@uds/utils';
import { MessageStyles } from './Message.styles';
import clsx from 'clsx';
import { SkifFile } from '@skif/react-components';
import { IFile } from '@skif/utils';
import { isEqual } from 'lodash';
import { ITaskMessage } from '../../../../../../../../../types/automationInterfaces';
import { getMessageDateTimeString } from '../../../../../../../../utils/converters';
import { getMemberInitials } from '../../../../utils/conferenceUtils';
import { getUserFullName } from '../../../../../../../../utils/getUserFullName';
import { usePanelDataContext } from '../../../../../../../../../context/usePanelDataContext';
import { usePanelCommentsContext } from '../../../../../../../../../context/usePanelCommentsContext';

const useStyles = makeStyles(MessageStyles);

export const Message: FC<{ message: ITaskMessage; selfId: string; isDeferMessage: boolean }> = ({
  message,
  selfId,
  isDeferMessage = false,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { setMessageLocal } = usePanelCommentsContext();
  const { users } = usePanelDataContext()
  const user = users[message.endpoint.user] ?? null;
  const [files, setFiles] = useState(message.message.payload.files ?? []);
  const name = getUserFullName(user);
  const logoName = getMemberInitials(user);

  const text = message.message.payload.value;

  const { time } = getMessageDateTimeString(message.attributes?.sent);

  const onFilesChange = (file: IFile) => {
    const { value } = file;
    setFiles(files.map((f: IFile) => (f.value === value ? file : f)));
  };

  useEffect(() => {
    if (!isEqual(files, message.message.payload.files)) {
        setMessageLocal({
          ...message,

          message: {
            ...message.message,

            payload: {
              ...message.message.payload,

              files: files,
            },
          },
        })
    }
  }, [files]);

  return (
    <div
      className={clsx(
        'MessageContainer',
        message.endpoint.user === selfId && 'SelfMessage',
        classes.root,
      )}
    >
      <div className={'AuthorLogo'}>{logoName}</div>
      <div className={'MessageContent'}>
        <div className={clsx('MessageHeader')}>
          <div className="name">{name}</div>
          <div className={clsx('time', isDeferMessage && 'hide')}>{time}</div>
        </div>
        <div className="MessageText" dangerouslySetInnerHTML={{ __html: `${text}` }} />
        {files && files.length > 0 && (
          <div className={clsx('MessageFiles')}>
            {(files as IFile[]).map((file) => {
              return (
                <SkifFile
                  key={file.value}
                  readonly={true}
                  file={file}
                  onChange={onFilesChange}
                  onDetach={() => {}}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
