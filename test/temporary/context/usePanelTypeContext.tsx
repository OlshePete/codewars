import * as React from 'react';
import { createContext, FC, ReactNode, useContext, useMemo, useState } from 'react';
import { PanelTypes } from '../const';

export interface IPanelTypeContext {
  type: PanelTypes;
  setType: (value: PanelTypes) => void;
  isEdit: boolean;
  setEdit: (newStatus: boolean) => void;
}

const PanelContext = createContext<IPanelTypeContext | undefined>(undefined);

export interface IPanelTypeProvider {
  children: ReactNode;
}

const PanelTypeProvider: FC<IPanelTypeProvider> = ({ children }) => {
  const [type, setType] = useState(PanelTypes.NewTask);
  const [isEdit, setEdit] = useState(false);
  const value = useMemo(() => ({ type, setType, isEdit, setEdit }), [type, isEdit]);

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
};

const usePanelTypeContext = () => {
  const context = useContext(PanelContext);

  if (context === undefined) {
    throw new Error('usePanelType must be used within a PanelProvider');
  }

  return context;
};

export { PanelTypeProvider, usePanelTypeContext };
