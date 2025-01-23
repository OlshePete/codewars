import * as React from 'react';
import clsx from 'clsx';
import type { FC } from 'react';
import type { ParameterTableRowProps } from './parameterTableRow.types';

const ParameterTableRow: FC<Partial<ParameterTableRowProps>> = ({
  name = '',
  value = '',
  className,
}) => {
  return (
    <div className={clsx('Row', className)}>
      <div className={clsx('Cell')}>
        <p>{name}</p>
      </div>
      <div className={clsx('Cell')}>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default ParameterTableRow;
