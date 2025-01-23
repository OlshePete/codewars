import type { UDSTheme } from '@uds/utils';
import { hexToRGBA } from '@uds/utils';

export const SelectStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base } = palette;

  return {
    root: {
      color: mode === 'dark' ? hexToRGBA(base['0000'], 0.92) : hexToRGBA(base['1400'], 0.92),

      '& .select-box, & .dropdown': {
        backgroundColor: mode === 'dark' ? base['1400'] : base['0000'],
        border: `1px solid${mode === 'dark' ? base['1200'] : base['0300']}`,
        '& > .search': {
          backgroundColor: mode === 'dark' ? base['1400'] : base['0000'],
        },
        '&_error:focus': {
          background:
            mode === 'dark' ? hexToRGBA(base['1400'], 0.92) : hexToRGBA(base['0000'], 0.92),
        },
      },
    },
  };
};
