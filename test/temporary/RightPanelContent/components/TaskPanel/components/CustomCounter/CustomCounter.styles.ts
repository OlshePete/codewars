import type { UDSTheme } from '@uds/utils';

export const CustomCounterStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { base, accent } = palette;

  return {
    root: {
      '&.accent': {
        background: accent['700'],
      },
      background: base['1000'],
    },
  };
};
