import clsx from 'clsx';
import * as React from 'react';
import { useMemo } from 'react';
import { isLightHex, makeStyles, useTheme } from '@uds/utils';
import { Check2, Plus } from '@uds/icons/16px';
import { UDSButton, UDSInput, UDSListItem } from '@uds/react-components';
import { NoMatches } from '../NoMatches';
import type { IListWithMore } from './ListWithMore.types';
import { ListWithMoreStyles } from './ListWithMore.styles';

const useStyles = makeStyles(ListWithMoreStyles);
const ListWithMore: React.FC<IListWithMore> = ({
  tags,
  search,
  filteredTaskTags,
  selectTag,
  handleSearch,
  handlerOpenCreateTag,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const taskTag = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(tags).filter((value) => {
          const [key] = value;

          return filteredTaskTags[key];
        }),
      ),
    [tags, filteredTaskTags],
  );

  return (
    <div className={clsx('wrapper--dropdown', classes.root)}>
      <UDSInput className={'search'} placeholder="Поиск" value={search} onChange={handleSearch} />
      {Object.keys(taskTag).length > 0 ? (
        <div className="search-list">
          <div className="wrapper--list">
            {Object.keys(taskTag).map((key) => (
              <UDSListItem
                key={key}
                className="list-item"
                value={key}
                style={{ backgroundColor: tags[key].color }}
                onClick={() => selectTag(key, !taskTag[key])}
              >
                <div className="check">
                  {!!taskTag[key] && (
                    <Check2 color={isLightHex(tags[key].color) ? '#ffffff' : '#000000'} />
                  )}
                </div>
                <span
                  className="tag-name"
                  style={{ color: isLightHex(tags[key].color) ? '#ffffff' : '#000000' }}
                >
                  {tags[key].name}
                </span>
              </UDSListItem>
            ))}
          </div>
          <UDSButton
            className="button--createTag"
            onClick={handlerOpenCreateTag}
            size="medium"
            startIcon={<Plus />}
            variant="base"
          >
            Новый тег
          </UDSButton>
        </div>
      ) : (
        <NoMatches handlerOpenCreateTag={handlerOpenCreateTag} />
      )}
    </div>
  );
};

export default ListWithMore;
