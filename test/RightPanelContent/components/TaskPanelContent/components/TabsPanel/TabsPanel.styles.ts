import { UDSTheme } from '@uds/utils';

export const TabsPanelStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base } = palette;

  return {
    root: {
      backgroundColor: mode === 'dark' ? base['1400'] : 'inherit',
    },
  };
};
