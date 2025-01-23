import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';

export interface ISkifPanelContainerProviderProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?(value: boolean, event?: React.MouseEvent<HTMLHeadElement>): void;
  width: number;
  setWidth:(value:number)=>void
}

const initialState: Omit<ISkifPanelContainerProviderProps, 'children'> = {
  isOpen: false,
  width: 800,
  setWidth: () => {}, 
};

const SkifPanelContainerContext =
  createContext<Omit<ISkifPanelContainerProviderProps, 'children'>>(initialState);

const SkifPanelContainerProvider = ({
  children,
  isOpen=false,
  onToggle,
}: Partial<ISkifPanelContainerProviderProps>) => {
  const [isOpenBox, setIsOpenBox] = React.useState(isOpen);
  const [width, setWidth] = React.useState(800)

  const handlerToggle = (newValue: boolean, event: React.MouseEvent<HTMLHeadElement>) => {
    if (onToggle && typeof onToggle === 'function') {
      onToggle(newValue, event);
    }

    if (!event?.defaultPrevented) {
      setIsOpenBox(newValue);
    }
  };

  React.useEffect(() => {
    if (isOpen !== isOpenBox) {
      setIsOpenBox(isOpen);
    }
  }, [isOpen]);

  const contextValue = useMemo(
    () => {
      return ({ isOpen: isOpenBox, onToggle: handlerToggle, width, setWidth })
    },
    [isOpenBox, isOpen, onToggle, width, setWidth],
  );

  return (
    <SkifPanelContainerContext.Provider value={contextValue}>
      {children}
    </SkifPanelContainerContext.Provider>
  );
};

const useSkifPanelContainer = () => {
  const context = useContext(SkifPanelContainerContext);

  if (context === undefined) {
    throw new Error('useSkifPanelContainer must be used within a SkifPanelContainerProvider');
  }
  return context;
};

export { SkifPanelContainerProvider, useSkifPanelContainer };
