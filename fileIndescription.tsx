import * as React from 'react';
import clsx from 'clsx';
import {
  ClickAwayListener,
  UDSAccordion,
  UDSAccordionContent,
  UDSAccordionHeader,
  UDSButton,
  UDSListItem,
  UDSSelect,
} from '@uds/react-components';
import {ButtonDescriptionType} from '../ButtonDescriptionType'
import { useClasses } from '../../hooks';
import { EditTaskDescriptionStyles } from './EditTaskDescription.styles';
import type { IDescription } from './EditTaskDescription.types';
import './EditTaskDescription.scss';
import { DocumentViewer } from '../DocumentViewer';
import {
  File,
  FileDialogMethods,
  type FileSystem,
  useFile,
  useFileDialog,
  useFileSystem,
  useSkifGlobal,
} from '@skif/utils';
import { TSchemasFindValue } from '../../../types/backendInterfaces';
import { DescriptionSelectVariants } from '../../consts';
import { TPayloadMessage } from '../../../types/tasksInterfaces';
import { TDescriptionBaseVariant } from '../../contexts/useTaskDiscusContext';

 export type TDescriptionVariant = {
  [K in keyof typeof DescriptionSelectVariants]: K
}[keyof typeof DescriptionSelectVariants]

export type TResponseParsedXml = TSchemasFindValue & {
  name: string;
  v1type: string;
  type: string;
  payload: string;
  schema: {
    properties: {
      [key: string]: {
        type: string;
        items: {
          type: string;
          properties: {
            [key: string]: {
              type: string;
              default?: any;
              minimum?: number;
              maximum?: number;
            };
          };
        };
      };
    };
  };
};
const arePropsEqual: (prevProps: Partial<IDescription>, nextProps: Partial<IDescription>) => boolean = (prevProps, nextProps) => {
  return prevProps.descriptionVariant === nextProps.descriptionVariant;
};

const EditTaskDescription: React.FC<Partial<IDescription>> = ({ value, className, onChange, descriptionVariant, setDescriptionVariant }) => {
  console.log(`\x1b[36m EditTaskDescription prop value \x1b[0m`,`: `,value, descriptionVariant)
  const classes = useClasses(EditTaskDescriptionStyles);
  const textEditorRef = React.useRef<HTMLInputElement>(null)

  const [schema, setSchema] = React.useState<{ name: string; content: string } | null>(null);
  const [isOpen, setIsOpen] = React.useState(true);
  const [shouldUpdate, setShouldUpdate] = React.useState<boolean>(true)
  const [viewer, setViewer] = React.useState<any | null>(null);
  const [dataForView, setDataForView] = React.useState<TResponseParsedXml | null>(null);

  const { attachFiles, checkFilesInSystem } = useFile(
    'file-dialog-attach',
    'file-dialog-write',
    window.skifWebFrontend.backend.esb.files,
  );

  const dialog = useFileDialog(FileDialogMethods.Open, window.skifWebFrontend.fileDialogPool ?? undefined);
  // @ts-ignore
  const fileSystem = useFileSystem();
  // React.useEffect(() => {
  //   if (value && 'payload' in JSON.parse(value) && 'schema' in JSON.parse(value)) {
  //     debugger
  //     console.log(JSON.parse(value))
  //     setDescriptionVariant('blank-file');
  //     setSchema(JSON.parse(value).schema)
  //     setDataForView(JSON.parse(value).dataForView)
  //   }
  // }, [value])

  React.useEffect(() => {
    console.log('useeffect EditTaskDescription 0',descriptionVariant, shouldUpdate)
    if (!isOpen) setIsOpen(true);
    if ((descriptionVariant === 'blank-file' && shouldUpdate) ) {
      console.log('useeffect descriptionVariant 1',descriptionVariant, shouldUpdate)

      let filePath = '';
      dialog({ id: 'file-dialog-attach', name: 'file-dialog-attach-xml', accept: '*.xml' })
        //@ts-ignore
        .then((paths: string[]) => {
          return Promise.all(
            paths.map(path => {
              filePath = path;
              return fileSystem.read(path);
            }),
          );
        })
        .then(
          schemas => {
            schemas.forEach(schema => {
              const fileName = filePath.match(/[^\/]+$/);
              if (fileName) {
                setSchema({ name: fileName[0], content: schema });
                // console.log('_____________________________')
                // console.log(JSON.stringify(fileName) );
                // console.log(JSON.stringify(schema) );
                // console.log('_____________________________')
                //   dispatch(setScenarioBlank({ name: fileName[0], content: schema}));
              }
            });
          setShouldUpdate(false)
          },
          e => {
            if (e instanceof Error) {
              console.log(e.message);
            } else {
              console.log(JSON.stringify(e, null, 2));
            }
          },
        )
        .catch(e => {
          console.log(e.message);
        });
    } else {
      if (descriptionVariant === 'text-editor' && textEditorRef.current) {
        setSchema(null)
        setDataForView(null)
        // @ts-ignore
        // console.log('###',textEditorRef.current?.children)
        // @ts-ignore
        // textEditorRef.current?.children[0]?.focus()
      }
    }
  }, [descriptionVariant, shouldUpdate]);

  React.useEffect(() => {
    console.log('useeffect EditTaskDescription schema 1', schema)
    if (schema) {
      console.log('$#$#$#$ ВНИМАНИЕ 1', schema);
      try {
        window.skifWebFrontend.backend.esb.messages.schemas.v1reader.xml(schema.content, (response: any) => {
          console.log('$#$#$#$ ВНИМАНИЕ 2-1', response);
          if (!response || response.error) {
            throw new Error('Не удалось конвертировать документ для отображения');
          }
          console.log('$#$#$#$ ВНИМАНИЕ 2-2', response);
          setDataForView(response.value as TResponseParsedXml);
          const newDataForView = {
            ...response.value as TResponseParsedXml,
            payload:JSON.stringify(response.value.blank),
          };
          console.log('МЫ ТУТ 3', newDataForView);
          if (newDataForView && onChange) onChange(JSON.stringify(newDataForView));

        });
      } catch (error) {}
    }
  }, [schema]);

  //TODO сделать фокус на uds-text-editor при повторном выборе текстового формата описания

  // React.useEffect(() => {
  //   console.log('useeffect isOpen 1',isOpen, descriptionVariant, textEditorRef.current)

  //   debugger

  //   if(isOpen &&  descriptionVariant === 'text-editor' && textEditorRef.current) {
  //     textEditorRef.current.focus()
  //   }
  // }, [isOpen, textEditorRef.current])
  


  const handleViewerBlur = (event: MouseEvent | TouchEvent) => {
    debugger
    console.log('МЫ ТУТ 0 BLUR AWAY',event.target, event.currentTarget);
if (descriptionVariant !== 'text-editor') {
  console.log('МЫ ТУТ 01 BLUR AWAY XML avaliable', viewer);

    if (viewer?.verirfy && !viewer.verify()) return;
    console.log('МЫ ТУТ 1 ', viewer);
    if (dataForView?.blank) {
      const payload = viewer.read(JSON.stringify(dataForView.blank));
      console.log('МЫ ТУТ 2 ', JSON.parse(payload));
      const newDataForView = {
        ...dataForView,
        payload:payload,
      };
      console.log('МЫ ТУТ 3', newDataForView);
      if (newDataForView && onChange) onChange(JSON.stringify(newDataForView));
    }
} else {
  console.log('МЫ ТУТ 0 BLUR AWAY TEXTFIELD avaliable', viewer);
  // if (onChange && value) onChange(value)
}
  
  };

  const handleUpdateBlank = () => {
    console.log("очистка документа");
    setSchema(null)
    setDataForView(null)
    setShouldUpdate(true)
  }
  const handleSetDescriptionVariant = (newVariant: TDescriptionBaseVariant) => {
    
    setDescriptionVariant && setDescriptionVariant(newVariant)
  }
  return (
    <UDSAccordion
      isOpen={isOpen}
      className={clsx('TaskDescription', 'br-none', className, classes.root)}
      onToggle={(open)=>{
        console.log('МЫ ТУТ 0 TOGGLE ACCORDION');

        setIsOpen(open)
      }}>
      <UDSAccordionHeader 
      className="DescriptionSelect" 
      label={
        <ButtonDescriptionType 
          label={descriptionVariant==='text-editor'?DescriptionSelectVariants[descriptionVariant]:'Бланк'} 
          setType={handleSetDescriptionVariant} 
          updateBlank={handleUpdateBlank}
          disabledList={[
            ...(descriptionVariant?[descriptionVariant]:[]),
            ...(descriptionVariant && descriptionVariant==='text-editor'?["blank-update"]:[])
          ] as TDescriptionVariant[]}
        />
      } 
      />
      <UDSAccordionContent>
        {descriptionVariant === 'text-editor' ? (
          <div className="TextEditor">
            {/* TODO: заменить на новый компонент, когда появится */}
            {/* @ts-ignore */}
            <uds-text-editor value={value || null} onBlur={(e)=>{
             e.currentTarget.value && onChange && onChange(e)
            }} ref={textEditorRef}/>
          </div>
        ) : (
              <ClickAwayListener  onClickAway={handleViewerBlur} >
          <div className="BlankFile">
            {dataForView && dataForView?.ui && (
                <DocumentViewer 
                  dataForView={dataForView} 
                  setViewer={setViewer}
                  payload={dataForView.payload ? JSON.parse(dataForView.payload) as Record<string, TPayloadMessage> : null}
                />
            )}
          </div>
              </ClickAwayListener>
        )}
      </UDSAccordionContent>
    </UDSAccordion>
  );
};

export default EditTaskDescription;