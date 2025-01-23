import clsx from 'clsx';
import React from 'react';
import './Header.scss';
import { HeaderStyles } from './Header.styles';
import { makeStyles, useTheme } from '@uds/utils';

export interface IHeaderLayout extends React.HTMLProps<HTMLDivElement> {}

const useStyles = makeStyles(HeaderStyles);
const HeaderLayout: React.FC<Partial<IHeaderLayout>> = ({ children, className, ...props }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <header className={clsx('Header', className, classes.root)} {...props}>
      {children}
    </header>
  );
};

export default HeaderLayout;
