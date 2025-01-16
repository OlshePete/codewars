import * as React from 'react';
import { HTMLAttributes, useEffect, useState } from 'react';
import type { FC } from 'react';
import clsx from 'clsx';
import {
  UDSButton,
  UDSTooltip,
  UDSTitle,
} from '@uds/react-components';
import { Download, FolderOpen as FolderOpen16, ArrowUp, ArrowDown } from '@uds/icons/16px';
import { isNumber, makeStyles, useTheme } from '@uds/utils';
import { useFile, useSkifGlobal } from '@skif/utils';
import { SkifFile } from '@skif/react-components';
import type { File } from '@skif/utils';
import { SkifBaseFileStyles } from '../SkifFileBase/SkifBaseFile.styles';

export interface SkifFileProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name: string,
  readonly: boolean,
  required: boolean,
  tooltip: string,
  value: File[];
  maxLength: number;
  accept: string;
  isOpen: boolean,

  onToggle(isOpen: boolean): void,

  onChange(files: File[]): void,
}

const useStyles = makeStyles(SkifBaseFileStyles);

export const SkifFileRefView: FC<SkifFileProps> = ({
  name,
  value = [],
  maxLength,
  accept,
  readonly = false,
  required = false,
  isOpen = false,
  tooltip,
  onToggle,
  onChange,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [privateFiles, setPrivateFiles] = useState(value || []);
  const [isAllDownloaded, setIsAllDownloaded] = useState(false);
  const [pathsFiles, setPathsFiles] = useState(
    Array.isArray(value) ? value.map((item) => item.path) : [],
  );

  const { backend } = useSkifGlobal();

  const {
    attachFiles,
    downloadFiles,
    checkFilesInSystem,
  } = useFile();

  const updateFiles = (response: File[]) => {
    const updatedFiles = [...response];

    setPrivateFiles(updatedFiles);

    if (onChange && typeof onChange === 'function') {
      onChange(updatedFiles);
    }

    setPathsFiles([...updatedFiles.map(({ path }: File) => path)]);
  };

  const updateFile = (response: File) => {
    const updatedFiles = [...privateFiles];

    const index = updatedFiles.findIndex((item) => item.value === response.value);

    if (index < 0) return;

    updatedFiles.splice(index, 1, response);

    updateFiles(updatedFiles);
  };

  const updateFileHandler = (file: File) => {
    setPrivateFiles((prev) => {
      const index = prev.findIndex((item) => item.value === file.value);

      if (index < 0) return prev;

      const updatedFiles = [...prev];
      updatedFiles.splice(index, 1, file);

      return updatedFiles;
    });

    setPathsFiles((prev) => {
      const index = prev.findIndex((item) => item === file.path);

      if (index < 0) return prev;

      const updatedFiles = [...prev];
      updatedFiles.splice(index, 1, file.path);

      return updatedFiles;
    });
  };

  const createNotification = (message: string, level: number = 0) => {
    // @ts-ignore
    backend?.notifications?.push({
      level,
      message,
      destination: {
        journal: true,
        popup: false,
      },
    });
  };

  const onClickToggleHandler = () => {
    if (onToggle && typeof onToggle === 'function') {
      onToggle(!isOpen);
    }
  };

  const onClickAddFilesHandler = () => {
    attachFiles({ paths: pathsFiles, accept, maxLength, label: 'Прикрепление файлов' })
      .then((response) => {
        const newFiles = response.filter(
          (item) => item.status === 'fulfilled',
        ).map((item) => item.value);

        updateFiles([...privateFiles, ...newFiles]);
      })
      .catch((error) => {
        console.log(error?.message);
      });
  };

  const onClickDownloadAllFileHandler = () => {
    if (privateFiles.length === 0) return;

    downloadFiles({ files: privateFiles, label: 'Загрузка файлов', updateFile: updateFileHandler })
      .then((response) => {
        updateFiles(response);
        createNotification(`Файлы "${response.map((file) => file.isUploaded
          && file.name).join(', ')}" успешно загружены`);
      })
      .catch((error) => {
        createNotification(error.message, 3);
      });
  };

  const onClickOpenFolderAllFileHandler = () => {
    const allPathFolder = new Set<string>();

    privateFiles.forEach((item) => {
      allPathFolder.add(item.path.substring(0, item.path.lastIndexOf('/')));
    });

    allPathFolder.forEach((item) => {
      backend?.fs?.manager(item);
    });
  };

  const onChangeHandler = (file: File) => {
    updateFile(file);
  };

  const onDetachFileHandler = (id: string) => {
    const updatedFiles = privateFiles.filter((item) => item.value !== id);

    setPrivateFiles(updatedFiles);

    if (onChange && typeof onChange === 'function') {
      onChange(updatedFiles);
    }

    setPathsFiles([...updatedFiles.map(({ path }: File) => path)]);
  };

  useEffect(() => {
    checkFilesInSystem(value || [])
      .then((response) => {
        setPrivateFiles(response);
        setPathsFiles(response.map((item) => item.path) || []);
      })
      .catch((error) => {
        console.log(error?.message);
      });

    setIsAllDownloaded(privateFiles.every((item) => item.isUploaded));
  }, [value]);

  return (
    <UDSTooltip
      className={clsx('SkifFileRef_Tooltip')}
      content={tooltip}
    >
      <div className={clsx('RollupComponent_Wrapper', classes.root)}>
        <div
          className={clsx(
            'RollupComponent_Header',
            isOpen && classes.isOpen,
          )}
        >
          <div className={clsx('RollupComponent_Group')}>
            <UDSButton
              className={clsx('ToggleBtn')}
              variant="base"
              startIcon={isOpen ? <ArrowUp /> : <ArrowDown />}
              onClick={onClickToggleHandler}
            />
            {(name || required) && (
              <UDSTitle
                className={clsx('Name')}
              >
                {`${name || ''} ${required ? '*' : ''}`}
              </UDSTitle>
            )}
          </div>
          <div className={clsx('RollupComponent_Group')}>
            {!readonly ? (
              <UDSButton
                variant="base"
                className={clsx('BtnAddFile')}
                onClick={onClickAddFilesHandler}
                disabled={isNumber(maxLength) && privateFiles.length >= maxLength}
              >
                Прикрепить файл
              </UDSButton>
            ) : (
              isAllDownloaded ? (
                <UDSTooltip
                  position="bottom"
                  content="Открыть папку"
                >
                  <UDSButton
                    variant="base"
                    className={clsx('BtnOpenFolder')}
                    onClick={onClickOpenFolderAllFileHandler}
                    startIcon={<FolderOpen16 />}
                    disabled={privateFiles.length === 0}
                  />
                </UDSTooltip>
              ) : (
                <UDSTooltip
                  position="bottom"
                  content="Скачать все"
                >
                  <UDSButton
                    variant="base"
                    className={clsx('BtnDownloadAll')}
                    disabled={privateFiles.length === 0}
                    onClick={onClickDownloadAllFileHandler}
                    startIcon={<Download />}
                  />
                </UDSTooltip>
              )
            )}
          </div>
        </div>
        {isOpen && (
          <div className={clsx('RollupComponent_Block')}>
            {privateFiles.length > 0 ? privateFiles.map((item) => (
              <SkifFile
                key={item.value || item.path}
                className={clsx('File')}
                file={item}
                readonly={readonly}
                onChange={onChangeHandler}
                onDetach={onDetachFileHandler}
              />
            )) : (
              <div className={clsx('RollupComponent_EmptyBlock')}>Не задано</div>
            )}
          </div>
        )}
      </div>
    </UDSTooltip>
  );
};
