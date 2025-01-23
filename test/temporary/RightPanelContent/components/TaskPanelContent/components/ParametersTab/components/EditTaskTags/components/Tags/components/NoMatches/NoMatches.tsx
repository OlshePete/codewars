import clsx from 'clsx';
import * as React from 'react';
import { UDSButton } from '@uds/react-components';
import { Plus } from '@uds/icons/16px';
import { NoMatchesStyles } from './NoMatches.styles';
import type { INoMatches } from './NoMatches.types';
import './NoMatches.scss';
import { makeStyles, useTheme } from '@uds/utils';

const useStyles = makeStyles(NoMatchesStyles);
const NoMatches: React.FC<INoMatches> = ({ handlerOpenCreateTag }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <div className={clsx('NoMatches', classes.root)}>
      <div className="wrapper">
        <span className="title">Нет совпадений</span>
        <span className="description">Измените условия поиска или создайте тег</span>
      </div>
      <UDSButton
        className="button--createTag"
        onClick={handlerOpenCreateTag}
        size="medium"
        startIcon={<Plus />}
        variant="base"
      >
        Новый тег
      </UDSButton>
    </div>
  );
};

export default NoMatches;
