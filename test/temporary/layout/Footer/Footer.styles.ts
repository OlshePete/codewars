import { UDSTheme } from '@uds/utils';

export const FooterStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base, text } = palette;

  return {
    root: {
      color: text.main,
      borderTop: `1px solid${mode === 'dark' ? base['1200'] : base['0300']}`,
    },
  };
};
