import * as React from 'react';
import clsx from 'clsx';
import {
  UDSAccordion,
  UDSAccordionContent,
  UDSAccordionHeader,
} from '@uds/react-components';
import { useAppSelector } from '../../../redux/store';
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
import { DescriptionSelectVariants } from '../../consts';
import { TPayloadMessage } from '../../../types/tasksInterfaces';
import { TDescriptionBaseVariant } from '../../contexts/useTaskDiscusContext';
import ButtonDescriptionType from '../ButtonDescriptionType/ButtonDescriptionType';
import { TResponseParsedXml } from '../ButtonDescriptionType/ButtonDescriptionType.types';



const EditTaskDescription: React.FC<Partial<IDescription>> = ({ value, className, onChange, descriptionVariant, setDescriptionVariant, temporaryDisabled=false }) => {
  console.log(`\x1b[36m FFF EditTaskDescription prop value \x1b[0m`,`: `,JSON.stringify(value), descriptionVariant)
  const classes = useClasses(EditTaskDescriptionStyles);
  const textEditorRef = React.useRef<HTMLInputElement>(null)
  const files = useAppSelector(state => state.automationReducer.descriptionSchemas);

  const [isOpen, setIsOpen] = React.useState(true);
  const [viewer, setViewer] = React.useState<any | null>(null);
  const [dataForView, setDataForView] = React.useState<TResponseParsedXml | null>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { attachFiles, checkFilesInSystem } = useFile(
    'file-dialog-attach',
    'file-dialog-write',
    window.skifWebFrontend.backend.esb.files,
  );

  const dialog = useFileDialog(FileDialogMethods.Open, window.skifWebFrontend.fileDialogPool ?? undefined);
  // @ts-ignore
  const fileSystem = useFileSystem();

  // const getSchema = () => {
  //     console.log('FFFF FFF Запуск диалогового окна 1',descriptionVariant, shouldUpdate)

  //     let filePath = '';
  //     //@ts-ignore
  //     dialog({ id: 'file-dialog-attach', name: 'Выберите файл *.xml', accept: '*.xml' })
  //       //@ts-ignore
  //       .then((paths: string[]) => {
  //         return Promise.all(
  //           paths.map(path => {
  //             filePath = path;
  //             return fileSystem.read(path);
  //           }),
  //         );
  //       })
  //       .then(
  //         schemas => {
  //           schemas.forEach(schema => {
  //             console.log(`\x1b[36m schema \x1b[0m`,`: `,schema)
  //             const fileName = filePath.match(/[^\/]+$/);
  //             if (fileName) {
  //               setSchema({ name: fileName[0], content: schema });
  //             }
  //           });
  //         setShouldUpdate(false)
  //         },
  //         e => {
  //           if (e instanceof Error) {
  //             console.log(e.message);
  //           } else {
  //             console.log(JSON.stringify(e, null, 2));
  //           }
  //         },
  //       )
  //       .catch(e => {
  //         console.log(e.message);
  //       });
  // }

  // const getDataForView = () => {
  //   if (schema) {
  //     console.log('FFF getDATAFORVIEW ВНИМАНИЕ 1', schema);
  //     try {
  //       window.skifWebFrontend.backend.esb.messages.schemas.v1reader.xml(schema.content, (response: any) => {
  //         if (!response || response.error) {
  //           throw new Error('Не удалось конвертировать документ для отображения');
  //         }
  //         console.log('FFF ВОТ ТУТ ВОЗВРАЩАЕТСЯ УЖЕ ЗАПОЛНЕНЫЙ ДРУГИМ ДАННЫМ ФАЙЛ', response);
  //         const newDataForView = {
  //           ...response.value as TResponseParsedXml,
  //           payload:JSON.stringify(response.value.blank),
  //         };
  //         setDataForView(newDataForView);

  //       });
  //     } catch (error) {}
  //   }
  // } 

  React.useEffect(() => {
    if (descriptionVariant === 'blank-file' && value && !dataForView) {
      console.log('необходимо найти документ и обновить в отображении');
      const data = JSON.parse(value) as {
          type:string,
          payload:Record<string, TPayloadMessage>
        }
        const currentFile = files[data.type as string]
        console.log(currentFile);
        setDataForView({
          ...currentFile,
          payload:JSON.stringify(data.payload)
        })
    // console.log("FFF получен новый вариант документ",descriptionVariant, value);
    // const needAttachDialog = JSON.parse(value).type.length===0
    // console.log("FFF необходимо запустить диалог? ",needAttachDialog);
    // console.dir(window.skifWebFrontend.backend.esb.messages.schemas)
    //   if(needAttachDialog) {
    //     getSchema()
    //   } else {
    //     const data = JSON.parse(value) as {
    //       type:string,
    //       payload:Record<string, TPayloadMessage>
    //     }
    //       window.skifWebFrontend.backend.esb.messages.schemas.find(data.type, (res)=>{
    //         const response = res as TResponseParsedXml
    //         console.log(`\x1b[36m Получили в ответ на поиск схемы \x1b[0m`,`: `,response)
    //         //TODO ОБНОВЛЕНИЕ ДАННЫХ ЕСЛИ УШЛИ С ВКЛАДКИ ИНФОРМАЦИЯ
    //         // setDataForView(response)
    //       })
    //   }
    } else {
      console.log("FFF текстовое поле вариант изменен на ",descriptionVariant, value);
    } 
  }, [value])
  
  // React.useEffect(() => {
  //   console.log('useeffect 0', value);
    
  // }, [value])

  React.useEffect(() => {
    console.log('useeffect 1', dataForView);
    
    if (dataForView) {
      setDescriptionVariant && setDescriptionVariant('blank-file')
    } else {
      // setDescriptionVariant && setDescriptionVariant('text-editor')
    }
    if(!isOpen) setIsOpen(true)
  }, [dataForView])
  
  // React.useEffect(() => {
  //   console.log('FFFF FFF useeffect ПОИСК СХЕМЫ ПО ТИПУ 0',descriptionVariant, value,shouldUpdate)
  //   if (!isOpen) setIsOpen(true);
  //   if (descriptionVariant !== 'text-editor' && value && !dataForView && !schema && shouldUpdate) {
  //     const data = JSON.parse(value) as {
  //       type:string,
  //       payload:Record<string, TPayloadMessage>
  //     }
  //   console.log('FFFF FFF useeffect ПОИСК СХЕМЫ ПО ТИПУ 1', data)
    
  //   window.skifWebFrontend.backend.esb.messages.schemas.find(data.type, (res)=>{
  //     const response = res as TResponseParsedXml
  //     console.log(`\x1b[36m Получили в ответ на поиск схемы \x1b[0m`,`: `,response)
  //     setDataForView(response)
  //   })

  //   }
  // }, [descriptionVariant, shouldUpdate, value]);

  // React.useEffect(() => {
  //   if (schema) {
  //     console.log(`FFF документ заружен ${schema?.name}, схема получена - `,schema);
  //     getDataForView()
  //   }
  // }, [schema]);

  // React.useEffect(() => {
  //   console.log('FFFF FFF useeffect dataForView 1', dataForView)
  //   if (dataForView && descriptionVariant!=='text-editor') {
  //     onChange && onChange(JSON.stringify({type:dataForView.type, payload:JSON.stringify(dataForView.blank)}))
  //     // setDescriptionVariant && setDescriptionVariant('blank-file')
  //     setTouched(false)
  //   }
  // }, [dataForView]);

  //TODO сделать фокус на uds-text-editor при повторном выборе текстового формата описания

  // React.useEffect(() => {
  //   console.log('FFFF FFF useeffect isOpen 1',isOpen, descriptionVariant, textEditorRef.current)

  //   debugger

  //   if(isOpen &&  descriptionVariant === 'text-editor' && textEditorRef.current) {
  //     textEditorRef.current.focus()
  //   }
  // }, [isOpen, textEditorRef.current])
  


  const handleViewerBlur:React.MouseEventHandler<HTMLDivElement> = (event) => {
    // if (touched) {
      console.log('FFF BLUR AWAY', descriptionVariant);
      if (descriptionVariant !== 'text-editor') {
      console.log('FFF нужно обновить данные в контексте', dataForView)
        // console.log('МЫ ТУТ 01 BLUR AWAY XML avaliable', viewer);

          // if (viewer?.verirfy && !viewer.verify()) return;
          // console.log('МЫ ТУТ 1 ', viewer);
          if (dataForView?.blank) {
            const payload = viewer.read(JSON.stringify(dataForView.blank));
            console.log('FFF нужно обновить данные в контексте', payload)
            // console.log('МЫ ТУТ 2 ', JSON.parse(payload));
            const newDataForView = {
              ...dataForView,
              payload:payload,
            };
            const isDataNeedSave = value ? JSON.stringify(JSON.parse(value).payload) !== newDataForView.payload : false
            if (isDataNeedSave && newDataForView && onChange){
              console.log('onChange', JSON.stringify(newDataForView));
              onChange(JSON.stringify(newDataForView))
            };
        //  }
      // } else {
      //   // console.log('МЫ ТУТ 0 BLUR AWAY TEXTFIELD avaliable', viewer);
      //   // if (onChange && value) onChange(value)
      }
      // setTouched(false)
    }
  };

  const handleUpdateBlank = () => {
    console.log("очистка документа");
    // setSchema(null)
    setDataForView(null)
    setShouldUpdate(true)
    // getSchema()
    // viewer.element.remove();
  }

  const handleSetDescriptionVariant = (newVariant: TDescriptionBaseVariant) => {
    setDescriptionVariant && setDescriptionVariant(newVariant)
  }
  return (
    <UDSAccordion
      isOpen={isOpen}
      className={clsx('TaskDescription', 'br-none', className, classes.root)}
      onToggle={(open)=>{
        setIsOpen(open)
      }}>
      <UDSAccordionHeader 
        className="DescriptionSelect" 
        label={
          <ButtonDescriptionType 
            label={descriptionVariant==='text-editor'?DescriptionSelectVariants[descriptionVariant]:'Бланк'} 
            setType={handleSetDescriptionVariant} 
            updateBlank={handleUpdateBlank}
            setScheme={(file)=>{
              console.log('update schema', file)
              setDataForView(file)
              //@ts-ignore
              // setSchema({ name: file.name, content: file.ui });
            }}
            temporaryDisabled={temporaryDisabled}
            disabledList={[
              ...(descriptionVariant?[descriptionVariant]:[]),
              ...(descriptionVariant && descriptionVariant==='text-editor'?["blank-update"]:[])
            ] as TDescriptionVariant[]}
            clbMenuOpen={setIsMenuOpen}
          />
        } 
      />
      <UDSAccordionContent>
      {/* <UDSButton onClick={getSchema}>res</UDSButton> */}

        {descriptionVariant === 'text-editor' ? (
          <div className="TextEditor">
            {/* TODO: заменить на новый компонент, когда появится */}
            {/* @ts-ignore */}
            <uds-text-editor value={value || null} onBlur={(e)=>{
              console.log('texteditor onChange',e);
              
             e.currentTarget.value && onChange && onChange(e)
            }} ref={textEditorRef}/>
          </div>
        ) : (
          <div 
            className="BlankFile"
            onMouseLeave={isMenuOpen?undefined:handleViewerBlur}
          >
            {dataForView && dataForView?.ui && (
                <DocumentViewer 
                  dataForView={dataForView} 
                  setViewer={setViewer}
                  payload={dataForView.payload ? JSON.parse(dataForView.payload) as Record<string, TPayloadMessage> : null}
                />
            )}
          </div>
        )}
      </UDSAccordionContent>
    </UDSAccordion>
  );
};

export default EditTaskDescription;
