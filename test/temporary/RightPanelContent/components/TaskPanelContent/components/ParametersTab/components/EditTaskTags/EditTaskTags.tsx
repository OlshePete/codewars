import * as React from 'react';
import clsx from 'clsx';
import { UDSAccordion, UDSAccordionHeader, UDSAccordionContent } from '@uds/react-components';
import { hexToRGBA, makeStyles, rgbaToHex, useTheme } from '@uds/utils';
import { EditTaskTagsStyles } from './EditTaskTags.styles';
import { Tags } from './components/Tags';
import type { IMembers } from './EditTaskTags.types';
import './EditTaskTags.scss';

const useStyles = makeStyles(EditTaskTagsStyles);
const EditTaskTags: React.FC<IMembers> = ({ tags, taskTags, color, className, setTags }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const colorTask10 = rgbaToHex(hexToRGBA(color ?? '', 0.1));
  const colorTask20 = rgbaToHex(hexToRGBA(color ?? '', 0.2));

  return (
    <UDSAccordion isOpen className={clsx('Members', 'br-none', className, classes.root)}>
      <UDSAccordionHeader label="Теги" style={{ backgroundColor: colorTask20 }} />
      <UDSAccordionContent style={{ backgroundColor: colorTask10 }}>
        <Tags tags={tags} taskTags={taskTags} setTags={setTags} />
      </UDSAccordionContent>
    </UDSAccordion>
  );
};

export default EditTaskTags;
