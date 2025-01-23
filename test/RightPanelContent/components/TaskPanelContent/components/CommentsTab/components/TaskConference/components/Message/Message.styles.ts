import { UDSTheme, hexToRGBA } from '@uds/utils';

export const MessageStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base } = palette;

  return {
    root: {
      color: mode === 'dark' ? hexToRGBA(base['0000'], 0.92) : hexToRGBA(base['1400'], 0.92),
      '&>div': {
        background: mode === 'dark' ? 'rgba(37, 86, 182, 0.2)' : hexToRGBA('#8666D0', 0.2),
      },
      '& .AuthorLogo': {
        color: mode === 'dark' ? hexToRGBA(base['0000'], 0.92) : hexToRGBA(base['1400'], 0.92),
      },
      '&:not(.SelfMessage)>div': {
        background: mode === 'dark' ? base['1100'] : base['0200'],
      },
      '& .time': {
        color: mode === 'dark' ? hexToRGBA(base['0000'], 0.54) : hexToRGBA(base['1400'], 0.6),
      },
    },
  };
};
