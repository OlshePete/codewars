import React, { FC, useState } from 'react';
import './ReportMessage.scss';
import {
  EditorState,
  UDSAccordion,
  UDSAccordionContent,
  UDSAccordionHeader,
  UDSTextEditor,
  UDSTextEditorProvider,
  convertRawToHTML,
  getEditorState,
} from '@uds/react-components';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@uds/utils';
import { TaskReportMessageStyles } from './ReportMessage.styles';

const useStyles = makeStyles(TaskReportMessageStyles);

const ReportMessage: FC<{ value: string; onChange: (new_value: string) => void }> = ({
  value,
  onChange,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [textEditorValue, setTextEditorValue] = useState<EditorState>(getEditorState(value ?? ''));
  return (
    <UDSAccordion className={clsx(classes.root, 'ReportMessageAccordion')} isOpen>
      <UDSAccordionHeader label="Комментарий" tabIndex={1} />
      <UDSAccordionContent className={clsx('ReportMessageAccordionContent')}>
        <UDSTextEditorProvider
          editorState={textEditorValue}
          onChange={(newValue) => {
            setTextEditorValue(newValue);
            const content = convertRawToHTML(newValue);
            try {
              if (content && onChange) onChange(content);
            } catch (error) {
              console.error(error);
            }
          }}
        >
          <UDSTextEditor
            value={textEditorValue}
            onClick={(e) => e.stopPropagation()}
            tabIndex={2}
          />
        </UDSTextEditorProvider>
      </UDSAccordionContent>
    </UDSAccordion>
  );
};

export default ReportMessage;
