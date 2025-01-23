import type { UDSTheme } from '@uds/utils';
import { hexToRGBA } from '@uds/utils';

export const TimePickerBlockStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base, error } = palette;

  return {
    root: {},
    menu: {
      border: `1px solid ${mode === 'dark' ? hexToRGBA(base['0000'], 0.02) : base['0300']}`,
    },
    menuContent: {
      background: mode === 'dark' ? hexToRGBA(base['1600'], 0.92) : hexToRGBA(base['0000'], 0.92),
      '&>.LeftColumn': {
        borderRight: `1px solid ${mode === 'dark' ? hexToRGBA(base['0000'], 0.02) : base['0300']}`,
      },
      '& .rc-picker-time-panel-cell:hover': {
        background: mode === 'dark' ? hexToRGBA(base['0000'], 0.04) : hexToRGBA(base['1400'], 0.08),
      },
      '& .rc-picker-time-panel-cell > .rc-picker-time-panel-cell-inner': {
        color: mode === 'dark' ? hexToRGBA(base['0000'], 0.92) : hexToRGBA(base['1400'], 0.92),
      },
      '& .rc-picker-time-panel-cell.rc-picker-time-panel-cell-selected > .rc-picker-time-panel-cell-inner':
        {
          color: mode === 'dark' ? hexToRGBA(base['1400'], 0.92) : hexToRGBA(base['0000'], 0.92),
        },
    },
    timePicker: {
      borderColor: mode === 'dark' ? base['1050'] : base['0500'],
      backgroundColor:
        mode === 'dark' ? hexToRGBA(base['0000'], 0.02) : hexToRGBA(base['1400'], 0.02),
      color: palette.text.main,

      '&:hover': {
        borderColor: mode === 'dark' ? base['0900'] : base['1000'],
      },
      '&:focus': {
        borderColor: palette.primary.dark,
      },
      '&:disabled': {
        borderColor: mode === 'dark' ? base['1200'] : base['0300'],
        backgroundColor:
          mode === 'dark' ? hexToRGBA(base['0000'], 0.04) : hexToRGBA(base['1400'], 0.04),
        color: palette.text.disabled,

        '&::placeholder, &::-webkit-input-placeholder': {
          color: palette.text.disabled,
        },
      },
      '&::placeholder, &::-webkit-input-placeholder': {
        color: palette.text.secondary,
      },
    },
    error: {
      '&.error': {
        backgroundColor: hexToRGBA(error.light, 0.1),
        borderColor: error.main,

        '&:focus': {
          backgroundColor:
            mode === 'dark' ? hexToRGBA(base['1400'], 0.02) : hexToRGBA(base['0000'], 0.02),
        },

        '&:disabled': {
          borderColor: mode === 'dark' ? base['1200'] : base['0300'],
          backgroundColor:
            mode === 'dark' ? hexToRGBA(base['0000'], 0.04) : hexToRGBA(base['1400'], 0.04),
          color: palette.text.disabled,

          '&::placeholder, &::-webkit-input-placeholder': {
            color: palette.text.disabled,
          },
        },
      },
    },
  };
};
