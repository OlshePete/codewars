import { UDSTheme } from '@uds/utils';

const SkifPanelContainerStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base, text } = palette;

  return {
    root: {
      color: text.main,
      backgroundColor: mode === 'dark' ? base['1400'] : base['0000'],
      border: `1px solid${mode === 'dark' ? base['1200'] : base['0300']}`,
    },
  };
};

export default SkifPanelContainerStyles;
