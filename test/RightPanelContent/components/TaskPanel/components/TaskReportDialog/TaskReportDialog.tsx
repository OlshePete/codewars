import React, { FC, useEffect, useState } from 'react';
import './TaskReportDialog.scss';
import { TaskReportDialogStyles } from './TaskReportDialog.styles';
import { makeStyles, useTheme } from '@uds/utils';
import { clsx } from 'clsx';
import { ITaskReportDialog } from './TaskReportDialog.types';
import {
  UDSButton,
  UDSDialog,
  UDSDialogActions,
  UDSDialogContent,
  UDSDialogTitle,
  UDSHeader,
} from '@uds/react-components';
import { ReportMessage } from './components/ReportMessage';
import { ReportFiles } from './components/ReportFiles';
import { v4 as uuidv4 } from 'uuid';
import { IFile } from '@skif/utils';
import { IMessageBase } from '../../../../../../../types/automationInterfaces';

const useStyles = makeStyles(TaskReportDialogStyles);

const CLEAR_MESSAGE = {
  payload: {
    value: '',
    files: [],
  },
  type: 'skif.text',
  meta: { id: '' },
};

const getClearMessage = (id: string) => {
  return {
    ...CLEAR_MESSAGE,
    meta: {
      id,
    },
  };
};

const TaskReportDialog: FC<ITaskReportDialog> = ({
  tasks,
  buttonClass,
  buttonLabel = 'Завершить задачу',
  modalLabel = 'Завершение задачи',
  disabled = false,
  onReject,
  onConfirm,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [message, setMessage] = useState<IMessageBase>(getClearMessage(uuidv4()));
  const [open, setOpen] = useState(false);
  const isMulti = Boolean(tasks.length > 1);
  const dialogTitle = modalLabel;
  const subTitle = tasks.map(({ task }) => task.name).join(', ');

  const setFiles = (files: IFile[]) => {
    setMessage((p) => ({
      ...p,
      payload: {
        ...p.payload,
        files: files,
      },
    }));
  };
  const setText = (new_value: string) => {
    setMessage((p) => ({
      ...p,
      payload: {
        ...p.payload,
        value: new_value,
      },
    }));
  };

  useEffect(() => {
    const rootEl = document.getElementById('root') as HTMLDivElement;

    if (rootEl) {
      if (open) {
        rootEl.style.pointerEvents = 'none';
        rootEl.style.position = 'relative';
        rootEl.style.zIndex = '-1';
      } else {
        rootEl.style.pointerEvents = 'inherit';
        rootEl.style.position = 'static';
        rootEl.style.zIndex = 'auto';
      }
    }
    if (!open) setMessage(getClearMessage(uuidv4()));
  }, [open]);

  return (
    <>
      <UDSButton
        onClick={() => setOpen(true)}
        variant="primary"
        className={clsx(buttonClass)}
        disabled={disabled}
      >
        {buttonLabel}
      </UDSButton>
      {open && (
        <>
          <div className="DialogBackdrop" tabIndex={-1} />
          <UDSDialog
            className={clsx(classes.root, 'TaskReportDialog')}
            tabIndex={-1}
            onClose={({ target }) => {
              if (target && (target instanceof HTMLElement || target instanceof SVGElement)) {
                const isCloseBtn =
                  target.classList.contains('UDSDialog_CloseButton') ||
                  target.closest('.UDSDialog_CloseButton');
                if (isCloseBtn) {
                  setOpen(false);
                  onReject();
                }
              }
            }}
          >
            <UDSDialogTitle>
              <UDSHeader className={clsx('DialogTitle')} type="h3">
                {dialogTitle}
              </UDSHeader>
            </UDSDialogTitle>
            <UDSDialogContent className={clsx('ReportBlock')}>
              <UDSHeader className={clsx('SubTitle', isMulti && 'TaskNames')} type="h4">
                {subTitle}
              </UDSHeader>
              <ReportMessage value={message.payload.value} onChange={setText} />
              <ReportFiles files={message.payload.files} onChange={setFiles} />
            </UDSDialogContent>
            <UDSDialogActions>
              <UDSButton
                onClick={() => {
                  onConfirm(message);
                  setOpen(false);
                }}
                variant="primary"
              >
                {buttonLabel ? buttonLabel : 'Сохранить и завершить'}
              </UDSButton>
              <UDSButton
                onClick={() => {
                  onReject();
                  setOpen(false);
                }}
              >
                Отменить
              </UDSButton>
            </UDSDialogActions>
          </UDSDialog>
        </>
      )}
    </>
  );
};

export default TaskReportDialog;
