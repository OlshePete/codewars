import * as React from 'react';
import clsx from 'clsx';
import { UDSTab, UDSTabs } from '@uds/react-components';
import { TabsPanelStyles } from './TabsPanel.styles';
import type { ITabsPanel } from './TabsPanel.types';
import { makeStyles, useTheme } from '@uds/utils';
import { TabsNames } from '../../../../../types/panelInterfaces';
import { usePanelDataContext } from '../../../../../context/usePanelDataContext';

const useStyles = makeStyles(TabsPanelStyles);
const TabsPanel: React.FC<ITabsPanel> = ({
  activeTab = TabsNames.Information,
  onChange,
  className,
  colorTask,
  hideHistory,
  disableComments = false,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const {tabsList} = usePanelDataContext()
  const onChangeTab = (event: React.FormEvent<HTMLElement>, value: TabsNames) => {
    onChange(value);
  };

  return (
    <UDSTabs
      className={clsx('Tabs', className, classes.root)}
      value={activeTab}
      onChange={onChangeTab}
    >

      
      {tabsList.includes(TabsNames.Information) ? <UDSTab
        className={clsx('width-100')}
        label="Информация"
        value={TabsNames.Information}
        style={{ backgroundColor: colorTask }}
      /> : <></>}
      
      {tabsList.includes(TabsNames.Parameters) ?<UDSTab
        className={clsx('width-100')}
        label="Параметры"
        value={TabsNames.Parameters}
        style={{ backgroundColor: colorTask }}
      />: <></>}
      
      {(hideHistory || !tabsList.includes(TabsNames.History) ) ? (
        <></>
      ) : (
        <UDSTab
          className={clsx('width-100')}
          label="История"
          value={TabsNames.History}
          style={{ backgroundColor: colorTask }}
        />
      )}
      {disableComments  || !tabsList.includes(TabsNames.Comments) ? (
        <></>
      ) : (
        <UDSTab
          className={clsx('width-100', 'CommentsTab')}
          label="Комментарии"
          value={TabsNames.Comments}
          style={{ backgroundColor: colorTask }}
        />
      )}
    </UDSTabs>
  );
};

export default TabsPanel;
