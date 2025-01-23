import { UDSTheme, hexToRGBA } from '@uds/utils';

export const TaskPanelStyles = (theme: UDSTheme) => {
  const { palette } = theme;
  const { mode, base } = palette;

  return {
    root: {
      backgroundColor: mode === 'dark' ? base['1400'] : hexToRGBA('#F9FCFE'),
      '& > .Header.active,& > .Footer.active': {
        backgroundColor: mode === 'dark' ? hexToRGBA('#2556B6', 0.2) : hexToRGBA('#E9F2FB'),
      },
      '& > .TaskPanelContent.active': {
        backgroundColor: mode === 'dark' ? base['1400'] : 'inherit',
      },
      '& .UDSAccordionHeader': {
        backgroundColor: mode === 'dark' ? hexToRGBA('#2556B6', 0.2) : hexToRGBA('#E9F2FB'),
      },
      '& .UDSAccordionContent': {
        backgroundColor: mode === 'dark' ? base['1400'] : hexToRGBA('#F9FCFE'),
      },
    },
  };
};
