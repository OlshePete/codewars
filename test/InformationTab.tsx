import * as React from 'react';
import clsx from 'clsx';

import { useClasses } from '../../../../../hooks';
import { InformationTabStyles } from './InformationTab.styles';

import { PanelContentLayout } from '../../../../../layouts/PanelContent';
import { TaskErrors, useTaskDiscusContext } from '../../../../../contexts/useTaskDiscusContext';

import { EditTaskDescription } from '../../../../../components/EditTaskDescription';
import { EditTaskFiles } from '../../../../../components/EditTaskFiles';
import { EditTaskName } from '../../../../../components/EditTaskName';

import './InformationTab.scss';

const InformationTab: React.FC = () => {
  const classes = useClasses(InformationTabStyles);

  const { task, errors,  descriptionVariant, setName, setDescription, setFiles, setError, setDescriptionVariant } = useTaskDiscusContext();
  const descriptionVariant1 = task?.task.discus.description.type
  console.log('COMPONENT RERENDER',descriptionVariant,descriptionVariant1)
// console.log('Information Tab',task?.task.discus.description, descriptionVariant)
return (
    <PanelContentLayout className={clsx("InformationTab", classes.root)}>
      <EditTaskName
        value={task?.task.name || ''}
        error={errors.name}
        onInput={(event) => {
          setName(event.currentTarget.value);
          setError(TaskErrors.Name, null);
        }}
      />
      <EditTaskDescription
        className={clsx('Accordion')}
        value={descriptionVariant === 'text-editor'? task?.task.discus?.description?.payload?.value || '':JSON.stringify({payload:task?.task.discus.description.payload, type:task?.task.discus.description.type})}
        descriptionVariant={descriptionVariant}
        setDescriptionVariant={setDescriptionVariant}        
        onChange={(event) => {
          console.log("##### ALERT onChange description 1", descriptionVariant)
          console.log("##### ALERT onChange description 2", event)
          if (typeof event !== 'string') {
            setDescription(event.currentTarget.value)
          } else {
            setDescription(event)
          }
        }}
      />
      {
        descriptionVariant === 'text-editor' && <EditTaskFiles
          className={clsx('Accordion')}
          files={task?.task.discus?.description?.payload?.files || []}
          setFiles={setFiles}
        />
      }
    
    </PanelContentLayout>
  );
};

export default InformationTab;
