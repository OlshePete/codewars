import type { UDSTheme } from '@uds/utils';
import { hexToRGBA } from '@uds/utils';

export const HeaderStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base } = palette;

  return {
    root: {
      color: mode === 'dark' ? hexToRGBA(base['0000'], 0.62) : hexToRGBA(base['1400'], 0.62),
      '&.HistoryHeader': {
        borderBottom: `1px solid ${mode === 'dark' ? base['1300'] : base['0300']}`,
      },
    },
  };
};
