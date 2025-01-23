import { UDSTheme } from '@uds/utils';

export const HistoryTabStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base } = palette;

  return {
    root: {
      '& .HistoryCell--link': {
        color: mode === 'dark' ? base['0000'] : 'inherit',
      },
    },
  };
};
