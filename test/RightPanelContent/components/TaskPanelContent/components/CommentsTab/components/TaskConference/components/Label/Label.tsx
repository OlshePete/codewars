import clsx from 'clsx';
import * as React from 'react';
import type { FC } from 'react';
import { LabelStyles } from './Label.styles';
import type { ILabel } from './Label.types';
import './Label.scss';
import { makeStyles, useTheme } from '@uds/utils';
import { CustomCounter } from '../../../../../../../../../counter/CustomCounter';

const useStyles = makeStyles(LabelStyles);
const Label: FC<ILabel> = ({ count = 0 }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <div className={clsx('label', classes.root)}>
      Комментарии
      <CustomCounter count={count} />
    </div>
  );
};

export default Label;
