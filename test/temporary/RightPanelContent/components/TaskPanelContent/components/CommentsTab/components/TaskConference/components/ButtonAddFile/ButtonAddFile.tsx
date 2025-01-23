import * as React from 'react';
import clsx from 'clsx';
import { UDSButton } from '@uds/react-components';
import { ButtonAddFileStyles } from './ButtonAddFile.styles';
import type { IButtonAddFile } from './ButtonAddFile.types';
import './ButtonAddFile.scss';
import { IFile, useFile } from '@skif/utils';
import { Attachment } from '@uds/icons/16px';
import { makeStyles, useTheme } from '@uds/utils';
import { filterUndefinedPaths } from '../../../../../../../TaskPanel/components/TaskReportDialog/utils/filesUtils';

const useStyles = makeStyles(ButtonAddFileStyles);
const ButtonAddFile: React.FC<Partial<IButtonAddFile>> = ({
  files = [],
  paths = [],
  className,
  disabled = false,
  setFiles,
  onlyIcon = false,
  label = 'Прикрепить файлы',
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { attachFiles } = useFile();
  const handlerButton = () => {
    const pathList = filterUndefinedPaths(paths);
    attachFiles({
      paths: pathList,
      accept: '*',
      label: 'Прикрепление файлов',
    })
      .then((response) => {
        const attachedFiles = response
          .filter((item) => item.status === 'fulfilled')
          .map((item) => 'value' in item && item.value)
          .filter(Boolean) as IFile[];

        if (setFiles && typeof setFiles === 'function') {
          setFiles([...files, ...attachedFiles]);
        }
      })
      .catch((error) => {
        console.log(error?.message);
      });
  };

  return (
    <UDSButton
      variant="secondary"
      className={clsx('ButtonAddFiles', className, classes.root)}
      disabled={disabled}
      startIcon={onlyIcon ? <Attachment /> : undefined}
      onClick={handlerButton}
    >
      {!onlyIcon ? label : ''}
    </UDSButton>
  );
};

export default ButtonAddFile;
