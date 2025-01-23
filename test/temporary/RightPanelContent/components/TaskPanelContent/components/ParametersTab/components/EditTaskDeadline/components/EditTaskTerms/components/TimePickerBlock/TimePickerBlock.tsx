import { ClickAwayListener, UDSButton, UDSMenu, useClientRect } from '@uds/react-components';
import moment, { Moment } from 'moment';
import { PickerPanel } from 'rc-picker';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import ruRU from './locale/ru_RU';
import momentGenerateConfig from './generate/moment';
import 'rc-picker/assets/index.css';
import './TimePickerBlock.scss';
import { Time } from '@uds/icons/16px';
import { TimePickerBlockStyles } from './TimePickerBlock.styles';
import { makeStyles, useTheme } from '@uds/utils';
import clsx from 'clsx';
import { debounce } from 'lodash';
import { extractDateAndTime, getTimeString } from '../../../../../../../../../../utils/converters';

interface ITimePickerProps {
  time: number | '' | undefined;
  onTimeChange: (newValue: number | '') => void;
  error: string | null;
  disabled?: boolean;
  increaseDateByDay: () => void;
}

const useStyles = makeStyles(TimePickerBlockStyles);
const TimePickerBlock: FC<ITimePickerProps> = ({
  time,
  onTimeChange,
  error,
  disabled,
  increaseDateByDay,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const defaultValue = time ? moment.unix(time) : moment('2000-01-01', 'YYYY-MM-DD');
  const [open, setOpen] = useState(false);
  const [value, setValue] = React.useState<Moment | undefined>(defaultValue);
  const [timeValue, setTimeValue] = useState<number | ''>('');
  const [rect, ref] = useClientRect<HTMLDivElement>();

  const updateTime = (newTime: Moment) => {
    const extracted = extractDateAndTime(newTime.unix());
    onTimeChange(extracted.time ?? 0);
    setValue(newTime);

    if (extracted.time === 0) setTimeValue(0);
  };

  const onSelect = (newValue: Moment) => {
    if (newValue) {
      updateTime(newValue);
    }
  };

  const onChange = (newValue: Moment | Moment[]) => {
    if (Array.isArray(newValue)) return;

    if (newValue) {
      updateTime(newValue);
    }
  };

  const sharedProps = {
    generateConfig: momentGenerateConfig,
    value,
    onSelect,
    onChange,
    locale: ruRU,
  };
  const handleSetTime = (event: MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    const minutesToAdd = +id;
    const originalTime = moment(value);
    const newTime = moment(value).add(minutesToAdd, 'minutes');

    if (newTime.date() !== originalTime.date() || newTime.day() !== originalTime.day()) {
      increaseDateByDay();
    }

    updateTime(newTime);
  };
  const handleSetCurrentTime = () => {
    updateTime(moment());
  };
  const handleTimePickerClick = () => {
    setOpen((p) => !p);
  };
  useEffect(() => {
    const momentTime = extractDateAndTime(value?.unix()).time;

    if (time && (momentTime || momentTime === 0)) {
      const newTime = moment(value).add(time - momentTime, 'seconds');
      setValue(newTime);
      setTimeValue(time);
    } else {
      setValue(moment('2000-01-01', 'YYYY-MM-DD'));
    }
  }, [time]);

  useEffect(() => {
    const debouncedFunction = debounce(() => {
      onTimeChange(timeValue);
    }, 500);
    debouncedFunction();

    return () => {
      debouncedFunction.cancel();
    };
  }, [timeValue]);

  return (
    <div className={clsx(classes.root)}>
      <div className="GroupedTimePickerInput" ref={ref}>
        <input
          type="time"
          value={typeof timeValue === 'string' ? '' : getTimeString(timeValue)}
          className={clsx(
            'UDSInput',
            'medium',
            'UDSTimePicker',
            classes.timePicker,
            error && classes.error,
            error && 'error',
          )}
          onChange={(event) => {
            const { value } = event.target;
            const newValue = (Number(value.split(':')[0]) * 60 + Number(value.split(':')[1])) * 60;
            setTimeValue(newValue);
          }}
          disabled={disabled}
        />
        <UDSButton onClick={handleTimePickerClick} startIcon={<Time />} disabled={disabled} />
      </div>

      {open && (
        <ClickAwayListener
          onClickAway={() => {
            setOpen(false);
          }}
          mouseEvent="onMouseDown"
        >
          <UDSMenu
            coordinates={{ top: rect?.bottom ?? 0, left: rect?.left }}
            size="medium"
            withCorner={false}
            className={clsx('PickerContainerMenu', classes.menu)}
            style={{
              zIndex: 1000,
            }}
            onMouseLeave={(e) => {
              setOpen(false);
              e.preventDefault();
            }}
          >
            <div className={clsx('PickerContainer', classes.menuContent)}>
              <div className="LeftColumn">
                <PickerPanel
                  {...sharedProps}
                  mode="time"
                  multiple={false}
                  onHover={() => {}}
                  showTime={{
                    use12Hours: false,
                    showSecond: false,
                    format: 'hh:mm A',
                  }}
                />
                <div className="BottomButton">
                  <UDSButton id="1440" onClick={handleSetCurrentTime} style={{ width: '100%' }}>
                    Текущее время
                  </UDSButton>
                </div>
              </div>
              <div className="ActionButtons">
                <UDSButton id="1" onClick={handleSetTime}>
                  +1 мин
                </UDSButton>
                <UDSButton id="5" onClick={handleSetTime}>
                  +5 мин
                </UDSButton>
                <UDSButton id="15" onClick={handleSetTime}>
                  +15 мин
                </UDSButton>
                <UDSButton id="60" onClick={handleSetTime}>
                  +60 мин
                </UDSButton>
                <UDSButton id="240" onClick={handleSetTime}>
                  +4 часа
                </UDSButton>
                {/* <UDSButton id="1440" onClick={handleSetTime}>
                  +24 часа
                </UDSButton> */}
              </div>
            </div>
          </UDSMenu>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default TimePickerBlock;
