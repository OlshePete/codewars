import React, { useMemo } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { themes, makeDesignAccentColors } from '@uds/react-components';
import { createTheme, ThemeProvider, UDSThemeOptions } from '@uds/utils';
import { TaskRoutes } from '../components/TaskRoutes';
import { store } from '../../redux/store';
import { useAppSelector } from '../../redux/store';
import { IBackend } from '../../types/backendInterfaces';
import { PanelProvider } from '../pages/SubtasksPage/contexts/usePanelContext';
import { PanelProvider as PanelSubtaskProvider } from '../pages/TasksPage/contexts/usePanelContext';
import { SubtaskTypeProvider } from '../pages/SubtasksPage/contexts/useSubtaskType';
import { BackendProvider, FileDialogPool, FilePool, SkifGlobalProvider } from '@skif/utils';
import { Backend } from '../../backendEmulator';
import { PopperMenuProvider } from '../contexts/usePopperMenuContext';
import { TableWidthProvider } from '../contexts/useTableWidthContext';
import { ROUTES, Themes } from '../consts';
import { selectTheme } from '../../redux/selectors/appSelector';

export interface IApp {
  mode?: 'light' | 'dark';
  scheme?: 'green' | 'blue' | 'violet';
  backend?: IBackend;
  filePool:FilePool;
  fileDialogPool:FileDialogPool;
}
const App: React.FC<IApp> = ({ backend = new Backend(), scheme = 'green', fileDialogPool, filePool }) => {
  
  const mode = useAppSelector(selectTheme);

  const baseTheme = mode === Themes.Dark ? themes.dark : themes.light;

  const theme = useMemo(() => createTheme(baseTheme as UDSThemeOptions, makeDesignAccentColors(scheme, mode, baseTheme)), [mode, scheme]);

  //TODO: пересмотреть архитектуру приложения с PanelProvider и PanelSubtaskProvider
  console.dir(window.skifWebFrontend)
  return (
    <SkifGlobalProvider<IBackend> backend={backend as IBackend} filePool={filePool} fileDialogPool={fileDialogPool} >
        <PanelProvider>
          <PanelSubtaskProvider>
            <SubtaskTypeProvider>
              <BackendProvider backend={backend as IBackend}>
                <ThemeProvider theme={theme}>
                  {/* <CssBaseline /> */}
                  <MemoryRouter initialEntries={[ROUTES.TasksPage]}>
                    <PopperMenuProvider>    
                      <TableWidthProvider>
                        <TaskRoutes />
                      </TableWidthProvider>
                    </PopperMenuProvider>
                  </MemoryRouter>
                </ThemeProvider>
              </BackendProvider>
            </SubtaskTypeProvider>
          </PanelSubtaskProvider>
        </PanelProvider>
    </SkifGlobalProvider>

  );
};

export default App;