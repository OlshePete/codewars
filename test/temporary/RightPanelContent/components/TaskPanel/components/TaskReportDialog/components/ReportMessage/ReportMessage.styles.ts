import type { UDSTheme } from '@uds/utils';
import { hexToRGBA } from '@uds/utils';

export const TaskReportMessageStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base } = palette;

  return {
    root: {
      '&>.ReportMessageAccordionContent': {
        borderColor: mode === 'dark' ? hexToRGBA(base['1300'], 1) : hexToRGBA(base['0300'], 1),
        '& > .UDSTextEditor > .UDSTextEditor__Editor': {
          background: mode === 'dark' ? hexToRGBA(base['1500'], 1) : hexToRGBA(base['0000'], 1),
        },
      },
    },
  };
};
