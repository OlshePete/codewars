import * as React from 'react';
import clsx from 'clsx';
import { UDSChip } from '@uds/react-components';
import { SelectStyles } from './Select.styles';
import type { ISelect } from './Select.types';
import { makeStyles, useTheme } from '@uds/utils';

const useStyles = makeStyles(SelectStyles);
const Select: React.FC<ISelect> = ({ openSelect, taskTags, handleRemoveChip, handlerShowMore }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <div className={clsx('select', classes.root)}>
      <div role="presentation" className={clsx('select-box')} onClick={(e) => openSelect(e)}>
        {Object.keys(taskTags).length === 0 && <span className="empty">Не выбрано</span>}
        {Object.keys(taskTags).length > 0 && (
          <>
            {Object.keys(taskTags)
              .slice(0, 2)
              .map((key) => {
                return (
                  <UDSChip
                    className={clsx('mr-4')}
                    size="small"
                    type="gray"
                    key={key}
                    variant="deletable"
                    onClose={(e) => handleRemoveChip(e, key)}
                  >
                    {taskTags[key].name}
                  </UDSChip>
                );
              })}
            {Object.keys(taskTags).length > 2 && (
              <div className="show-more">
                <span role="presentation" className="more" onClick={handlerShowMore}>
                  {`и ещё ${Object.keys(taskTags).length - 2}`}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Select;
