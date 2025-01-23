import { UDSTheme, hexToRGBA } from '@uds/utils';

export const TaskConferenceStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base } = palette;

  return {
    root: {
      '& .EmptyMessageList>span': {
        color: mode === 'dark' ? hexToRGBA(base['0000'], 0.54) : hexToRGBA(base['1400'], 0.6),
      },
    },
  };
};
