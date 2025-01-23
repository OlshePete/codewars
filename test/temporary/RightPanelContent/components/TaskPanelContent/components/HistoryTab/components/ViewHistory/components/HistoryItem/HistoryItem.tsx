import * as React from 'react';
import clsx from 'clsx';
import { Link } from '@uds/icons/16px';
import { HistoryItemStyles } from './HistoryItem.styles';
import type { IHistoryItem } from './HistoryItem.types';
import './HistoryItem.scss';
import { makeStyles, useTheme } from '@uds/utils';
import { UDSTooltip } from '@uds/react-components';
import { convertToLocalDate } from '../../../../../../../../utils/converters';

const useStyles = makeStyles(HistoryItemStyles);

const HistoryItem: React.FC<IHistoryItem> = ({
  date,
  editor,
  description,
  className,
  onClickItem,
  ...props
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <div
      className={clsx('HistoryItem', className, classes.root)}
      onDoubleClick={() => {
        if (onClickItem && typeof onClickItem === 'function') {
          onClickItem();
        }
      }}
      {...props}
    >
      <div className="HistoryCell date">{convertToLocalDate(date)}</div>
      <div className="HistoryCell editor">
        <UDSTooltip content={editor}>{editor}</UDSTooltip>
      </div>
      <div className={clsx('HistoryCell', description.includes('\n') && 'action')}>
        {description}
      </div>
      <div
        className="HistoryCell HistoryCell--link"
        onClick={() => {
          if (onClickItem && typeof onClickItem === 'function') {
            onClickItem();
          }
        }}
      >
        <Link />
      </div>
    </div>
  );
};

export default HistoryItem;
