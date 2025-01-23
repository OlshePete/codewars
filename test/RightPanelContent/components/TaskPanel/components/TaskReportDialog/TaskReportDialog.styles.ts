import type { UDSTheme } from '@uds/utils';
import { hexToRGBA } from '@uds/utils';

export const TaskReportDialogStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base } = palette;

  return {
    root: {
      borderColor: mode === 'dark' ? base['1400'] : hexToRGBA(base['0300'], 1),
      '&>.UDSDialogTitle': {
        borderColor: mode === 'dark' ? base['1400'] : hexToRGBA(base['0300'], 1),
      },
      '&>*,&>**>*': {
        borderColor: mode === 'dark' ? base['1400'] : hexToRGBA(base['0300'], 1),
      },
      '& .UDSAccordionHeader': {
        backgroundColor: mode === 'dark' ? base['1600'] : base['0000'],
      },
    },
  };
};
