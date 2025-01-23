import React from 'react';
import './Footer.scss';
import clsx from 'clsx';
import { FooterStyles } from './Footer.styles';
import { makeStyles, useTheme } from '@uds/utils';

export interface IFooterLayout extends React.HTMLProps<HTMLDivElement> {}

const useStyles = makeStyles(FooterStyles);
const FooterLayout: React.FC<Partial<IFooterLayout>> = ({ children, className, ...props }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <footer className={clsx('Footer', className, classes.root)} {...props}>
      {children}
    </footer>
  );
};

export default FooterLayout;
