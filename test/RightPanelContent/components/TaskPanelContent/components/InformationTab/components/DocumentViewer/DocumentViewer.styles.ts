import type { UDSTheme } from '@uds/utils';
import { hexToRGBA } from '@uds/utils';

export const DocumentViewerStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base } = palette;

  return {
    root: {
      color: mode === 'dark' ? hexToRGBA(base['0000'], 0.92) : hexToRGBA(base['1400'], 0.92),
    },
  };
};
