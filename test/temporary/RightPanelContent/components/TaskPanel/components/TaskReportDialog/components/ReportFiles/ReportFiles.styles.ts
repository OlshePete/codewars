import type { UDSTheme } from '@uds/utils';
import { hexToRGBA } from '@uds/utils';

export const TaskReportFilesStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base } = palette;

  return {
    root: {
      '&>.ReportFilesAccordionContent': {
        background: mode === 'dark' ? hexToRGBA(base['1500'], 1) : hexToRGBA(base['0000'], 1),
        borderColor: mode === 'dark' ? hexToRGBA(base['1300'], 1) : hexToRGBA(base['0300'], 1),
      },
    },
  };
};
