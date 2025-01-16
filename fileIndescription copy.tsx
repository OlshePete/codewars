import * as React from 'react';
import clsx from 'clsx';
import {
  ClickAwayListener,
  UDSAccordion,
  UDSAccordionContent,
  UDSAccordionHeader,
} from '@uds/react-components';
import {ButtonDescriptionType} from '../ButtonDescriptionType'
import { useClasses } from '../../hooks';
import { EditTaskDescriptionStyles } from './EditTaskDescription.styles';
import type { IDescription } from './EditTaskDescription.types';
import './EditTaskDescription.scss';
import { DocumentViewer } from '../DocumentViewer';
import {
  FileDialogMethods,
  useFile,
  useFileDialog,
  useFileSystem,
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

const EditTaskDescription: React.FC<Partial<IDescription>> = ({ value, className, onChange, descriptionVariant, setDescriptionVariant, temporaryDisabled=false }) => {
  // console.log(`\x1b[36m EditTaskDescription prop value \x1b[0m`,`: `,value, descriptionVariant)
  const classes = useClasses(EditTaskDescriptionStyles);
  const textEditorRef = React.useRef<HTMLInputElement>(null)

  const [schema, setSchema] = React.useState<{ name: string; content: string } | null>(null);
  const [isOpen, setIsOpen] = React.useState(true);
  const [shouldUpdate, setShouldUpdate] = React.useState<boolean>(true)
  const [viewer, setViewer] = React.useState<any | null>(null);
  const [dataForView, setDataForView] = React.useState<TResponseParsedXml | null>(null);
  const [touched, setTouched] = React.useState(false)
  const { attachFiles, checkFilesInSystem } = useFile(
    'file-dialog-attach',
    'file-dialog-write',
    window.skifWebFrontend.backend.esb.files,
  );

  const dialog = useFileDialog(FileDialogMethods.Open, window.skifWebFrontend.fileDialogPool ?? undefined);
  // @ts-ignore
  const fileSystem = useFileSystem();

  const getSchema = () => {
      console.log('useeffect Запуск диалога 0',descriptionVariant, shouldUpdate)

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
                console.log('useeffect Схема получена 1',{ name: fileName[0], content: schema })
                setSchema({ name: fileName[0], content: schema });
                // console.log('_____________________________')
                // console.log(JSON.stringify(fileName) );
                // console.log(schema);
                // console.log('_____________________________')
                //   dispatch(setScenarioBlank({ name: fileName[0], content: schema}));
              }
            });
          // setShouldUpdate(false)
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
  }
  React.useEffect(() => {
    console.log('useeffect вариант изменился 0 - ',descriptionVariant, '/ shouldUpdate - ',shouldUpdate)
    // debugger
    if (!isOpen) setIsOpen(true);
    if (descriptionVariant !== 'text-editor') {
      if( value && !dataForView && !schema) {
        console.log('useeffect пытаемся восстановить данные для отрисовки 0-1', value , dataForView , schema)
        const data = JSON.parse(value) as {
          type:string,
          payload:Record<string, TPayloadMessage>
        }
        console.log('useeffect EditTaskDescription 1', data)
        if (data.type !== 'skif.text' ) {
          console.log('useeffect Восстанавливаем данные 2', data)
          window.skifWebFrontend.backend.esb.messages.schemas.find(data.type, (res: TSchemasFindValue)=>{
            console.log(`\x1b[36m useeffect Получили в ответ на поиск схемы 3 \x1b[0m`,`: `,res)
            const response = res as TResponseParsedXml
            console.log(`\x1b[36m useeffect Получили в ответ на поиск схемы 3-1 \x1b[0m`,`: `,response)
            setDataForView(response)
          })
        } else {
          console.log('useeffect  восстановление данныx отменено', data.type)
          // getDataForView()
        }
      }
    } else {
      console.log('useeffect выбран тип текстового описание, диалог отменен', descriptionVariant)
    }
  }, [descriptionVariant, shouldUpdate, value]);

  const getDataForView = (schema:{ name: string; content: string } | null) => {
    if (schema) {
      console.log('useeffect $#$#$#$ Поиск данные по схеме начало', schema);
      try {
        window.skifWebFrontend.backend.esb.messages.schemas.v1reader.xml(schema.content, (response: any) => {
          console.log('useeffect $#$#$#$ Поиск данные по схеме: ответ от сервера 2-1', response);
          if (!response || response.error) {
            throw new Error('Не удалось конвертировать документ для отображения');
          }
          console.log('useeffect $#$#$#$ Поиск данные по схеме: ответ от сервера 2-2', response);
          const value = response.value as TResponseParsedXml
          const newDataForView = {
            ...value,
            payload:JSON.stringify(value.blank),
            schema: {
              ...value.schema,
              // properties:value.blank
            }
          };
          console.log('useeffect $#$#$#$ МЫ ТУТ 3', newDataForView);
          setDataForView(newDataForView);
          if (newDataForView && onChange) onChange(JSON.stringify(newDataForView));

        });
      } catch (error) {}
    }
  } 
  React.useEffect(() => {
    console.log('useeffect Схема обновлена', schema)
    if (schema) {
      getDataForView(schema)
    } else {
      if (descriptionVariant!=='text-editor') getSchema()
    }
  }, [schema]);
  React.useEffect(() => {
    console.log('useeffect получена dataForView 0', dataForView)
    if (dataForView) {
      onChange && onChange(JSON.stringify({type:dataForView.type, payload:JSON.stringify(dataForView.blank)}))
      // setDescriptionVariant && setDescriptionVariant('blank-file')
      setTouched(false)
    }
  }, [dataForView]);

  //TODO сделать фокус на uds-text-editor при повторном выборе текстового формата описания

  // React.useEffect(() => {
  //   console.log('useeffect isOpen 1',isOpen, descriptionVariant, textEditorRef.current)

  //   debugger

  //   if(isOpen &&  descriptionVariant === 'text-editor' && textEditorRef.current) {
  //     textEditorRef.current.focus()
  //   }
  // }, [isOpen, textEditorRef.current])
  


  const handleViewerBlur = (event: MouseEvent | TouchEvent) => {
    if (touched) {
    console.log('useeffect $$$$$$ Сохраняем данные с документа', descriptionVariant)

      console.log('$$$$$$ onMouseEnter')
      // console.log('МЫ ТУТ 0 BLUR AWAY', descriptionVariant);
      if (descriptionVariant !== 'text-editor') {
        // console.log('МЫ ТУТ 01 BLUR AWAY XML avaliable', viewer);

          if (viewer?.verify && !viewer.verify()) return;
          // console.log('МЫ ТУТ 1 ', viewer);
          if (dataForView?.blank) {
            const payload = viewer.read(JSON.stringify(dataForView.blank));
            // console.log('МЫ ТУТ 2 ', JSON.parse(payload));
            const newDataForView = {
              ...dataForView,
              payload:payload,
            };
            const valueForTest = value ? JSON.parse(value).payload :{}
            console.log('данные', (JSON.stringify(newDataForView.payload ) !== JSON.stringify(valueForTest)),'\n0',value,"\n1", (newDataForView.payload) ,"\n2",valueForTest, JSON.stringify(valueForTest));
            if ((newDataForView.payload !== JSON.stringify(valueForTest)) && onChange) {
              console.log('данные необходимо перезаписать');
              onChange(JSON.stringify(newDataForView))
            } else {
              console.log('данные актуальные');
              setTouched(false)
            }
          }
      }// else {
      //   // console.log('МЫ ТУТ 0 BLUR AWAY TEXTFIELD avaliable', viewer);
      //   // if (onChange && value) onChange(value)
      // }
    }
  };

  const handleUpdateBlank = () => {
    console.log("очистка документа");
    setShouldUpdate(p=>{
      viewer?.element?.remove();
      setSchema(null)
      setDataForView(null)
      return true
    })
  }
  const handleSetDescriptionVariant = (newVariant: TDescriptionBaseVariant) => {
    console.log('click handleSetDescriptionVariant',newVariant,shouldUpdate)
    if (newVariant === 'blank-file' && shouldUpdate) {
        getSchema()
      } else {
      if (newVariant === 'text-editor' && textEditorRef.current) {
        setSchema(null)
        setDataForView(null)
      }
    }
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
            temporaryDisabled={temporaryDisabled}
            disabledList={[
              ...(descriptionVariant?[descriptionVariant]:[]),
              ...(descriptionVariant && descriptionVariant==='text-editor'?["blank-update"]:[])
            ] as TDescriptionVariant[]}
          />
        } 
      />
      <UDSAccordionContent>
            <>
            {descriptionVariant}
        {descriptionVariant === 'text-editor' ? (
          <div className="TextEditor">
            {/* TODO: заменить на новый компонент, когда появится */}
            {/* @ts-ignore */}
            <uds-text-editor value={value || null} onBlur={(e)=>{
             e.currentTarget.value && onChange && onChange(e)
            }} ref={textEditorRef}/>
          </div>
        ) : (
          <ClickAwayListener onClickAway={handleViewerBlur}>

          <div className="BlankFile"
          // onMouseLeave={()=>{}}
          onMouseEnter={()=>setTouched(true)}
          >
            {dataForView && dataForView?.ui && (
              <DocumentViewer 
              dataForView={dataForView} 
              setViewer={setViewer}
              payload={dataForView.payload ? JSON.parse(dataForView.payload) as Record<string, TPayloadMessage> : {}}
              />
              )}
          </div>
              </ClickAwayListener>
            )}
            </>
      </UDSAccordionContent>
    </UDSAccordion>
  );
};

export default EditTaskDescription;