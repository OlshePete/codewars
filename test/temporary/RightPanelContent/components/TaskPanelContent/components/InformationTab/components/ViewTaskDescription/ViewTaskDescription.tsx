import * as React from 'react';
import clsx from 'clsx';
import { UDSAccordion, UDSAccordionContent, UDSAccordionHeader } from '@uds/react-components';
import { hexToRGBA, makeStyles, rgbaToHex, useTheme } from '@uds/utils';
import { ViewTaskDescriptionStyles } from './ViewTaskDescription.styles';
import type { IViewDescription } from './ViewTaskDescription.types';
import './ViewTaskDescription.scss';
import { DocumentViewer } from '../DocumentViewer';
import { TPayloadMessage, TResponseParsedXml } from '../../../../../../../types/tasksInterfaces';

const useStyles = makeStyles(ViewTaskDescriptionStyles);
const ViewTaskDescription: React.FC<IViewDescription> = ({
  content,
  className,
  isOpen = true,
  color,
  isDescriptionBlank = false,
  description,
  documentId,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const createMarkup = (html: string) => (
    <div className="ViewTaskWrapperText" dangerouslySetInnerHTML={{ __html: html }}></div>
  );
  let colorTask10 = rgbaToHex(hexToRGBA(color ?? '', 0.1));
  let colorTask20 = rgbaToHex(hexToRGBA(color ?? '', 0.2));
  const [dataForView, setDataForView] = React.useState<TResponseParsedXml | null>(null);

  if (theme.palette.mode === 'dark') {
    colorTask10 = hexToRGBA(colorTask10, 0.2);
    colorTask20 = hexToRGBA(colorTask20, 0.2);
  }

  React.useEffect(() => {
    if (isDescriptionBlank && description) {
      const blankType = description.type;
      window.skifWebFrontend.backend.esb.messages.schemas.find(blankType, (res) => {
        const response = res as TResponseParsedXml;
        setDataForView(response);
      });
    }
  }, [isDescriptionBlank, description]);

  return (
    <UDSAccordion
      isOpen={isOpen}
      className={clsx('ViewTaskDescription', 'br-none', className, classes.root)}
    >
      <UDSAccordionHeader label="Описание задачи" style={{ backgroundColor: colorTask20 }} />
      <UDSAccordionContent style={{ backgroundColor: colorTask10 }}>
        {isDescriptionBlank ? (
          <DocumentViewer
            dataForView={dataForView}
            payload={description?.payload as Record<string, TPayloadMessage>}
            flags={['readonly']}
            documentId={documentId}
          />
        ) : (
          createMarkup(content || '')
        )}
      </UDSAccordionContent>
    </UDSAccordion>
  );
};

export default ViewTaskDescription;
