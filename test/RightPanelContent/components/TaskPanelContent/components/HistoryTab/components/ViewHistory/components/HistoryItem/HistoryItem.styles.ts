import type { UDSTheme } from '@uds/utils';
import { hexToRGBA } from '@uds/utils';

export const HistoryItemStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base, accent } = palette;

  return {
    root: {
      color: mode === 'dark' ? hexToRGBA(base['0000'], 0.92) : hexToRGBA(base['1400'], 0.92),
      '& > .date': {
        color: mode === 'dark' ? hexToRGBA(base['0000'], 0.6) : 'rgba(40, 43, 45, 0.6)',
      },
      '&.HistoryItem--link > .HistoryCell--link': {
        color: mode === 'dark' ? base['0400'] : base['1400'],
      },
      '&.HistoryItem--link:hover': {
        backgroundColor: mode === 'dark' ? hexToRGBA(accent['600'], 0.6) : accent['100'], //'#e6f6f1'
      },
      '&.HistoryItem': {
        borderBottom: `1px solid ${mode === 'dark' ? base['1300'] : base['0300']}`,
      },
    },
  };
};
