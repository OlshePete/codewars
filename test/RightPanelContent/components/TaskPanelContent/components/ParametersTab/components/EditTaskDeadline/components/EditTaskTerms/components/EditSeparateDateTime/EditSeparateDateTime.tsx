import { UDSDatePicker, UDSTitle } from '@uds/react-components';
import React, { FC, useEffect, useState } from 'react';
import './EditSeparateDateTime.scss';
import clsx from 'clsx';
import { TimePickerBlock } from '../TimePickerBlock';
import {
  extractDateAndTime,
  isDateOrTimeInPast,
} from '../../../../../../../../../../../kanban/utils/converters';

interface IEditaSeparateDateTimeProps {
  value: number | undefined;
  onChange: (newValue: number) => void;
  error?: string;
  disabled?: boolean;
}
interface ISeparateDateTimeErrors {
  date: string | null;
  time: string | null;
}
const DEFAULT_ERRORS: ISeparateDateTimeErrors = { time: null, date: null };
const EditSeparateDateTime: FC<IEditaSeparateDateTimeProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [date, setDate] = useState<number | undefined>(undefined);
  const [time, setTime] = useState<number | '' | undefined>('');
  const [errors, setErrors] = useState(DEFAULT_ERRORS);

  const onChangeDeadlineDate = (event: React.SyntheticEvent<HTMLElement, Event>, value: number) => {
    setDate(extractDateAndTime(value).date);
  };
  const onChangeDeadlineTime = (value: number | '') => {
    let newValue = value;

    if (Number.isNaN(newValue)) newValue = '';
    setTime(newValue);
  };
  const increaseDateByDay = () => {
    if (!date) return;
    setDate(date + 86400);
  };

  useEffect(() => {
    const { date, time } = extractDateAndTime(value);

    setDate(date);
    setTime(time);
  }, [value]);

  useEffect(() => {
    if (error === 'Невозможно поставить задачу в прошлом') {
      const { date: dateError, time: timeError } = isDateOrTimeInPast(date, time);
      setErrors({
        date: dateError ? 'Ошибка' : null,
        time: dateError || timeError ? 'Ошибка' : null,
      });
    }

    if (!error) setErrors(DEFAULT_ERRORS);
  }, [error]);

  useEffect(() => {
    if (!date && time === '') setErrors(DEFAULT_ERRORS);

    if (date && time && date > 0) {
      onChange(date + time);
      setErrors(DEFAULT_ERRORS);
    } else {
      if (date && !time) {
        onChange(date + 0);
        setTime(0);
        setErrors(DEFAULT_ERRORS);
      }

      if ((time || time === 0) && !date) {
        setErrors({
          date: 'Введите дату',
          time: null,
        });
      }
    }
  }, [date, time]);

  return (
    <div className={clsx('DateTimeBlock', (errors.date || errors.time) && 'invalid')}>
      <UDSDatePicker
        value={date}
        onChange={onChangeDeadlineDate}
        error={errors.date}
        disabled={disabled}
      />
      <TimePickerBlock
        time={time}
        increaseDateByDay={increaseDateByDay}
        onTimeChange={onChangeDeadlineTime}
        error={errors.time}
        disabled={disabled}
      />
      {(errors.date || errors.time) && (
        <UDSTitle isInvalid={true} className="error-title">
          {' '}
          {error ? error : errors.date ? errors.date : errors.time}
        </UDSTitle>
      )}
    </div>
  );
};

export default EditSeparateDateTime;
