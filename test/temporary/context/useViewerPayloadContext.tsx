import React, { createContext, useContext, useState } from 'react';
import { TResponseParsedXml } from '../types/tasksInterfaces';

interface ViewerContextProps {
  viewer: any;
  setViewer: (viewer: any) => void;
  dataForView: TResponseParsedXml | null;
  setDataForView: (viewer: any) => void;
  errors: any;
  setErrors: (errors: any) => void;
  value: string;
  setValue: (new_value: string) => void;
  savePayload: () => TResponseParsedXml | null;
}

const ViewerContext = createContext<ViewerContextProps | undefined>(undefined);

export const ViewerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [value, setValue] = useState<string>('');
  const [viewer, setViewer] = React.useState<any | null>(null);
  const [dataForView, setDataForView] = React.useState<TResponseParsedXml | null>(null);
  const [errors, setErrors] = useState<any>({});
  const savePayload = () => {
    const isValid = viewer.verify();

    if (!isValid) setErrors({ description: 'Заполните обязательные поля документа' });
    else {
      setErrors({});
    }

    if (dataForView?.blank) {
      const payload = viewer.read(JSON.stringify(dataForView.blank));
      const newDataForView = {
        ...dataForView,
        payload: payload,
      };
      setDataForView(newDataForView);

      return newDataForView;
    }

    return null;
  };

  return (
    <ViewerContext.Provider
      value={{
        viewer,
        setViewer,
        dataForView,
        setDataForView,
        errors,
        setErrors,
        value,
        setValue,
        savePayload,
      }}
    >
      {children}
    </ViewerContext.Provider>
  );
};

export const useViewerContext = () => {
  const context = useContext(ViewerContext);

  if (!context) {
    throw new Error('useViewerContext must be used within a ViewerProvider');
  }

  return context;
};
