import React, { FC } from 'react';
import './ReportFiles.scss';
import {
  UDSAccordion,
  UDSAccordionContent,
  UDSAccordionHeader,
  UDSScroll,
} from '@uds/react-components';
import clsx from 'clsx';
import { IFile } from '@skif/utils';
import { SkifFile } from '@skif/react-components';
import { makeStyles, useTheme } from '@uds/utils';
import { TaskReportFilesStyles } from './ReportFiles.styles';
import { ButtonAddFile } from '../ButtonAddFile';
import { CustomCounter } from '../../../CustomCounter';

const useStyles = makeStyles(TaskReportFilesStyles);

const ReportFiles: FC<{ files: IFile[]; onChange: (new_files: IFile[]) => void }> = ({
  files,
  onChange,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const handleChangeFile = (file: IFile) => {
    onChange && onChange(files.map((f) => (f.value === file.value ? file : f)));
  };
  const handleDetachFile = (id: string) => {
    onChange && onChange(files.filter((file) => file.value !== id));
  };
  return (
    <UDSAccordion className={clsx(classes.root, 'ReportFilesAccordion')} isOpen>
      <UDSAccordionHeader
        label={
          <>
            Файлы <CustomCounter count={files.length} />
          </>
        }
      />
      <UDSAccordionContent className={clsx('ReportFilesAccordionContent')}>
        <ButtonAddFile files={files} setFiles={onChange} label={'Добавить файл'} />
        <div className="ReportFilesList">
          {files &&
            files.length > 0 &&
            files.map((file, index) => {
              return (
                <SkifFile
                  key={'ReportFiles' + index}
                  readonly={false}
                  file={file}
                  onChange={handleChangeFile}
                  onDetach={handleDetachFile}
                />
              );
            })}
          <UDSScroll />
        </div>
      </UDSAccordionContent>
    </UDSAccordion>
  );
};

export default ReportFiles;
