import clsx from 'clsx';
import * as React from 'react';
import type { FC } from 'react';
import { parameterTableStyles } from './parameterTable.styles';
import type { ParameterTableProps } from './parameterTable.types';
import './parameterTable.scss';
import { makeStyles, useTheme } from '@uds/utils';

const useStyles = makeStyles(parameterTableStyles);
const ParameterTable: FC<ParameterTableProps> = ({ children, className }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <div className={clsx('Table', className, classes.root)}>
      <div className={clsx('Body')}>{children}</div>
    </div>
  );
};

export default ParameterTable;
