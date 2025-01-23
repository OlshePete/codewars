import * as React from 'react';
import { createContext, FC, ReactNode, useContext, useMemo, useState } from 'react';
import { PanelTypes } from '../consts';
import { useAppSelector } from '../../../../redux/hook';

export interface IPanelContext {
  type: PanelTypes;
  setType: (value: PanelTypes) => void;
  isEdit: boolean;
  setEdit: (newStatus: boolean) => void;
}

const PanelContext = createContext<IPanelContext | undefined>(undefined);

export interface IPanelProvider {
  children: ReactNode;
}

const PanelProvider: FC<IPanelProvider> = ({ children }) => {
  const [type, setType] = useState(PanelTypes.NewTask);
  const [isEdit, setEdit] = useState(false);
  const task = useAppSelector((state) => state.appSlice.observedTask);
  const value = useMemo(() => ({ type, setType, isEdit, setEdit }), [type, isEdit]);

  React.useEffect(() => {
    if (task && isEdit) setEdit(false);
  }, [task]);

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
};

const usePanelContext = () => {
  const context = useContext(PanelContext);

  if (context === undefined) {
    throw new Error('usePanelType must be used within a PanelProvider');
  }

  return context;
};

export { PanelProvider, usePanelContext };
