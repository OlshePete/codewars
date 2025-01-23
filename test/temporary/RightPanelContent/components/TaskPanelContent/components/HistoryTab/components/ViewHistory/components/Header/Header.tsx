import clsx from 'clsx';
import * as React from 'react';
import { HeaderStyles } from './Header.styles';
import type { IHeader } from './Header.types';
import './Header.scss';
import { makeStyles, useTheme } from '@uds/utils';

const useStyles = makeStyles(HeaderStyles);
const Header: React.FC<IHeader> = ({ ...props }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <div className={clsx('HistoryHeader', classes.root)} {...props}>
      <div className="HistoryCell">Время</div>
      <div className="HistoryCell">Автор</div>
      <div className="HistoryCell">Действие</div>
      <div className="HistoryCell" />
    </div>
  );
};

export default Header;
