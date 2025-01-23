import * as React from 'react';
import { List } from './components/List';
import { CreateTag } from './components/CreateTag';
import { ListWithMore } from './components/ListWithMore';
import { DropDownChildren } from './Tags.types';
import { ITaskTag } from '../../../../../../../../../../../types/tasksInterfaces';

interface IGetDropDownChildren {
  key: DropDownChildren;
  search: string;
  tags: Record<string, ITaskTag>;
  taskTags: Record<string, ITaskTag>;
  filteredTags: Record<string, ITaskTag>;
  filteredTaskTags: Record<string, ITaskTag>;
  handlerOpenCreateTag: () => void;
  handlerCancelTagCreation: () => void;
  createTag: (name: string, color: string) => void;
  selectTag: (key: string, checked: boolean | undefined) => void;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>, value: string | undefined) => void;
}

export const getDropDownChildren = ({
  key,
  search,
  tags,
  taskTags,
  filteredTags,
  filteredTaskTags,
  createTag,
  selectTag,
  handleSearch,
  handlerOpenCreateTag,
  handlerCancelTagCreation,
}: IGetDropDownChildren): JSX.Element => {
  const children = {
    [DropDownChildren.List]: (
      <List
        search={search}
        tags={tags}
        taskTags={taskTags}
        selectTag={selectTag}
        handleSearch={handleSearch}
        filteredTags={filteredTags}
        handlerOpenCreateTag={handlerOpenCreateTag}
      />
    ),
    [DropDownChildren.ListWithMore]: (
      <ListWithMore
        search={search}
        tags={tags}
        filteredTaskTags={filteredTaskTags}
        selectTag={selectTag}
        handleSearch={handleSearch}
        handlerOpenCreateTag={handlerOpenCreateTag}
      />
    ),
    [DropDownChildren.CreateTag]: (
      <CreateTag
        createTag={createTag}
        search={search}
        handleSearch={handleSearch}
        handlerCancelTagCreation={handlerCancelTagCreation}
      />
    ),
  };

  return children[key];
};
