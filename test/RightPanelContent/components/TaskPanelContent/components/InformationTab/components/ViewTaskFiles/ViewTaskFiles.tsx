import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  UDSAccordion,
  UDSAccordionContent,
  UDSAccordionHeader,
  UDSButton,
} from '@uds/react-components';
import { hexToRGBA, makeStyles, rgbaToHex, useTheme } from '@uds/utils';
import { ViewTaskFilesStyles } from './ViewTaskFiles.styles';
import type { IViewFiles } from './ViewTaskFiles.types';
import './ViewTaskFiles.scss';
import { IBackend, IFile, useFile } from '@skif/utils';
import { SkifFile } from '@skif/react-components';
import { isEqual } from 'lodash';
import { CustomCounter } from '../../../../../../../counter/CustomCounter';

const useStyles = makeStyles(ViewTaskFilesStyles);
const ViewTaskFiles: React.FC<IViewFiles> = ({
  files,
  className,
  color,
  isOpen = true,
  updateFiles,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { downloadFiles } = useFile<IBackend>();
  const [taskFiles, setTaskFiles] = useState<IFile[]>(files);
  const colorTask10 = rgbaToHex(hexToRGBA(color ?? '', 0.1));
  const colorTask20 = rgbaToHex(hexToRGBA(color ?? '', 0.2));
  const [isAllDownloading, setIsAllDownloading] = useState(false);

  const saveAllFiles = () => {
    setIsAllDownloading(true);
    downloadFiles({
      files: taskFiles,
      updateFile: onFilesChange,
      label: 'Сохранение всех файлов',
    }).then((p) => {
      updateFiles(p);
      setIsAllDownloading(false);
    });
  };

  const onFilesChange = (file: IFile) => {
    const { value } = file;
    setTaskFiles((prev) => prev.map((f: IFile) => (f.value === value ? { ...file } : f)));
  };

  const createFiles = () => (
    <div className={clsx('files-box', classes.root)}>
      {taskFiles.map((file) => (
        <SkifFile
          className={clsx(file.isUploaded && 'uploaded')}
          key={file.value}
          readonly
          file={file}
          onChange={onFilesChange}
          onDetach={(f) => {
            // console.log('onDetach', f);
          }}
        />
      ))}
    </div>
  );

  const Label = () => (
    <div className={clsx('label')}>
      Файлы
      <CustomCounter count={files.length} />
    </div>
  );

  useEffect(() => {
    if (
      !isAllDownloading &&
      !taskFiles.every((f) =>
        isEqual(
          f,
          files.find((ff) => ff.value === f.value),
        ),
      )
    )
      setTimeout(() => updateFiles(taskFiles), 0);
  }, [taskFiles]);

  useEffect(() => {
    if (
      !files.every((f) =>
        isEqual(
          f,
          taskFiles.find((ff) => ff.value === f.value),
        ),
      )
    )
      setTaskFiles(files);
  }, [files]);

  return (
    <UDSAccordion
      isOpen={isOpen && files.length > 0}
      className={clsx('ViewTaskFiles', 'br-none', className)}
    >
      <UDSAccordionHeader label={<Label />} style={{ backgroundColor: colorTask20 }} />
      <UDSAccordionContent style={{ backgroundColor: colorTask10 }}>
        {files.length > 0 ? (
          <UDSButton className={clsx('mb-16')} onClick={saveAllFiles}>
            Загрузить все файлы
          </UDSButton>
        ) : (
          <span>Файлы не прикреплены</span>
        )}
        {createFiles()}
      </UDSAccordionContent>
    </UDSAccordion>
  );
};

export default ViewTaskFiles;
