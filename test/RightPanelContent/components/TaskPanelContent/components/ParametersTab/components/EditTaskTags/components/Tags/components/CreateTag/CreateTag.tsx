import clsx from 'clsx';
import * as React from 'react';
import { useState } from 'react';
import { isLightHex, makeStyles, useTheme } from '@uds/utils';
import { CheckChip } from '@uds/icons/12px';
import { UDSInput, UDSTitle, UDSHeader, UDSButton } from '@uds/react-components';
import { CreateTagStyles } from './CreateTag.styles';
import type { ICreateTag } from './CreateTag.types';
import './CreateTag.scss';
import { TaskColor } from '../../../../../../../../../../../../../types/tasksInterfaces';

const useStyles = makeStyles(CreateTagStyles);
const CreateTag: React.FC<ICreateTag> = ({
  search,
  createTag,
  handleSearch,
  handlerCancelTagCreation,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [currentColor, setCurrentColor] = useState(Object.values(TaskColor)[0]);

  const handlerSelectColor = (color: TaskColor) => {
    setCurrentColor(color);
  };

  const onCLickCreate = () => {
    createTag(search, currentColor);
  };

  return (
    <div className={clsx('CreateTag', classes.root)}>
      <UDSHeader className="marginBottom" type="h4">
        Новый тег
      </UDSHeader>
      <div className="marginBottom">
        <UDSTitle className="title">Название</UDSTitle>
        <UDSInput name="Название" placeholder="Поиск" value={search} onChange={handleSearch} />
      </div>
      <div className="marginBottom">
        <UDSTitle className="title">Цвет</UDSTitle>
        <div className="color">
          {Object.entries(TaskColor).map((value) => {
            const [name, color] = value;
            const isColorLight = isLightHex(color);

            return (
              <div
                key={name}
                className="colorItem"
                style={{ backgroundColor: color }}
                onClick={() => handlerSelectColor(color)}
              >
                {currentColor === color && (
                  <CheckChip color={isColorLight ? '#ffffff' : '#000000'} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="marginBottom">
        <UDSTitle className="title">Предварительный просмотр</UDSTitle>
        <div
          className="chip"
          style={{
            backgroundColor: currentColor,
            color: isLightHex(currentColor) ? '#ffffff' : '#000000',
          }}
        >
          {search.length === 0 ? '~' : search}
        </div>
      </div>
      <div className="buttons">
        <UDSButton
          className="button"
          onClick={onCLickCreate}
          disabled={search.length === 0}
          variant="secondary"
        >
          Создать
        </UDSButton>
        <UDSButton className="button" onClick={handlerCancelTagCreation} variant="secondary">
          Отменить
        </UDSButton>
      </div>
    </div>
  );
};

export default CreateTag;
