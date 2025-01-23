import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { ViewerFactory } from '@skif/document-viewer';
import { DocumentViewerStyles } from './DocumentViewer.styles';
import type { IDocumentViewer } from './DocumentViewer.types';
import './DocumentViewer.scss';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@uds/utils';

const useStyles = makeStyles(DocumentViewerStyles);
const DocumentViewer: React.FC<IDocumentViewer> = ({
  dataForView,
  flags,
  setViewer,
  documentId = 'document-viewer',
  payload = {},
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [viewer] = useState(ViewerFactory.getInstance());
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dataForView && viewerRef.current) {
      const { viewer: createdViewer } = viewer.create(viewerRef.current);

      if (setViewer) {
        setViewer(createdViewer);
      }

      viewerRef.current!.innerHTML = '';
      createdViewer.theme = theme.palette.mode;
      createdViewer.render();
      createdViewer.show({
        html: dataForView.ui,
        writeData: JSON.stringify(payload),
        flags,
      });
      //TODO перенести верификацию в другое место, добиться чтобы изначально был не провалидирован
      createdViewer.verify();
    } else {
      viewer?.element?.remove();
    }
  }, [dataForView, viewerRef.current]);

  return <div id={documentId} className={clsx('DocumentViewer', classes.root)} ref={viewerRef} />;
};

export default DocumentViewer;
