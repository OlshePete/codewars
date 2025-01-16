import React, { SyntheticEvent, useEffect, useState } from 'react';
import './EditTaskDateTimeSeparate.scss';
import { EditTaskDateTimeSeparateStyles } from './EditTaskDateTimeSeparate.styles';
import { IEditTaskDateTimeSeparateProps } from './EditTaskDateTimeSeparate.types';
import { makeStyles, useTheme } from '@uds/utils';
import { UDSButton, UDSDatePicker, UDSTimePicker, UDSTitle } from '@uds/react-components';
import { Clock } from '@uds/icons/16px';
import clsx from 'clsx';

const isDateOrTimeInPast = (dateValue: number | undefined, timeValue: number | undefined | '') => {
    const now = new Date().getTime() / 1000; // current timestamp in seconds
    const nowTimestamp = extractDateAndTime(now)
    const dateNow = nowTimestamp.date
    const timeNow = nowTimestamp.time

    const result = {
      date: false,
      time: false,
    };
  
    if (dateValue !== undefined && dateNow) {
      if (dateValue < dateNow) {
        result.date = true; 
        result.time = true;
      }
      if (dateValue === dateNow && timeNow && timeValue) {
        if (timeNow > timeValue) result.time = true
      }
    }
    return result;
  };
function extractDateAndTime(timestamp: number | undefined): Record<'date'|'time', number | null> {
  if (!timestamp) return { date: null, time: null };
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const dateTimestamp = new Date(year, month, day).getTime() / 1000;
  const timeTimestamp = hour * 3600 + minute * 60 + second;

  return {
    date: dateTimestamp,
    time: timeTimestamp-(timeTimestamp%60),
  };
}
const DEFAULT_ERRORS = {time:null, date:null}
const useStyles = makeStyles(EditTaskDateTimeSeparateStyles);
const EditTaskDateTimeSeparate: React.FC<Partial<IEditTaskDateTimeSeparateProps>> = ({
  title,
  value,
  onChange,
  error,
  children
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [dateValue, setDateValue] = useState<number | undefined>(value!==null && extractDateAndTime(value)?.date || undefined);
  const [timeValue, setTimeValue] = useState<number | undefined | ''>(value!==null && extractDateAndTime(value)?.time || '');
  const [errors, setErrors] = useState<Record<'time'|'date',null| string>>(DEFAULT_ERRORS)
  
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>, val: number | '') => {
    setTimeValue(val);
    validate()
  };
  const handleDateChange = (event: SyntheticEvent<HTMLElement, Event>, val: number) => {
    setDateValue(val);
    if (!timeValue) setTimeValue(0)
    validate()
  };
  const setCurrentTime = () =>{
    const dateNow = new Date().getTime() / 1000
    const {date, time} = extractDateAndTime(dateNow)
    setDateValue(date ?? undefined)
    setTimeValue(time ?? '')
}
  const validate = () => {
    if( timeValue && !dateValue){
        setErrors(p=>({...p, date:'Выберите дату'}))
        return false
    } else {
        setErrors(DEFAULT_ERRORS)
    }
    return true
}
  useEffect(() => {
    const isValid = validate()
    if (isValid && onChange && (dateValue && timeValue)) {
      console.log('test', { dateValue, timeValue });
      onChange(dateValue + timeValue)
    }
    
  }, [dateValue, timeValue]);


useEffect(() => {
    console.log({title,error});
    if (error) {
        if (error==='Невозможно поставить задачу в прошлом') {
            const isInPast = isDateOrTimeInPast(dateValue,timeValue)
            if(isInPast.date || isInPast.time) setErrors(p=>({
                date:isInPast.date?'Дата в прошлом':null,
                time:isInPast.time?'Время в прошлом':null,
            })); else {
            setErrors(p=>({
                date:'Даты одинаковые',
                time:'Даты одинаковые',
            }))
        } 
            
            // нужна функция для проверки: что именно в прошлом дата, время или дата и время 
        } 
    } else {
        setErrors(DEFAULT_ERRORS)
    }
}, [error]);

useEffect(() => {
    if (value!==null) {
        const updatedValue = extractDateAndTime(value)
        setTimeValue(updatedValue.time ?? undefined)
        setDateValue(updatedValue.date ?? undefined)
    }
}, [value]);
console.log(`\x1b[36m errors \x1b[0m`,`: `,errors)
  return (
    <div className={clsx(classes.root, 'Container')}>
      <UDSTitle>
        {title}
      </UDSTitle>
      <div className={clsx('TimeBox')} onBlur={validate}>
        <UDSTimePicker value={timeValue} onChange={handleTimeChange} error={errors.time} />
      </div>
      <div className={clsx('DateBox')}>
        <UDSDatePicker value={dateValue} onChange={handleDateChange} error={errors.date} />
      </div>
      <UDSButton startIcon={<Clock />} onClick={setCurrentTime} />
      {children}
     {(errors.date || errors.time ) &&  <UDSTitle isInvalid={true}> {errors.date ? errors.date : errors.time}</UDSTitle>}
    </div>
  );
};

export default EditTaskDateTimeSeparate;
