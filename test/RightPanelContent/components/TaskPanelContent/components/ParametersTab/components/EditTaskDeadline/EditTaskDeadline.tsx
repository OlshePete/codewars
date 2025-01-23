import React from 'react';
import clsx from 'clsx';
import { UDSAccordion, UDSAccordionContent, UDSAccordionHeader } from '@uds/react-components';
import { hexToRGBA, rgbaToHex } from '@uds/utils';
import { EditTaskTerms } from './components/EditTaskTerms';
import type { IDeadline } from './EditTaskDeadline.types';
import './EditTaskDeadline.scss';

const EditTaskDeadline: React.FC<Partial<IDeadline>> = ({
  timeframe,
  setTimeframe,
  errors,
  setError,
  className,
  color,
  startDisabled = false,
}) => {
  const colorTask10 = rgbaToHex(hexToRGBA(color ?? '', 0.1));
  const colorTask20 = rgbaToHex(hexToRGBA(color ?? '', 0.2));

  return (
    <UDSAccordion className={clsx('EditTaskDeadline', 'Accordion', 'br-none', className)} isOpen>
      <UDSAccordionHeader label="Срок выполнения" style={{ backgroundColor: colorTask20 }} />
      <UDSAccordionContent style={{ backgroundColor: colorTask10 }}>
        <EditTaskTerms
          timeframe={timeframe}
          errors={errors}
          setTimeframe={setTimeframe}
          setError={setError}
          startDisabled={startDisabled}
        />
      </UDSAccordionContent>
    </UDSAccordion>
  );
};

export default EditTaskDeadline;
