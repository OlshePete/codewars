import clsx from 'clsx';
import * as React from 'react';
import { isLightHex, makeStyles, useTheme } from '@uds/utils';
import { Check2, Plus } from '@uds/icons/16px';
import { UDSButton, UDSInput, UDSListItem } from '@uds/react-components';
import { NoMatches } from '../NoMatches';
import { ListStyles } from './List.styles';
import type { IList } from './List.types';

const useStyles = makeStyles(ListStyles);
const List: React.FC<IList> = ({
  tags,
  search,
  taskTags,
  filteredTags,
  selectTag,
  handleSearch,
  handlerOpenCreateTag,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <div className={clsx('wrapper--dropdown', classes.root)}>
      <UDSInput className={'search'} placeholder="Поиск" value={search} onChange={handleSearch} />
      {Object.keys(filteredTags).length > 0 ? (
        <div className="search-list">
          <div className="wrapper--list">
            {Object.keys(filteredTags).map((key) => (
              <UDSListItem
                key={key}
                className="list-item"
                value={key}
                style={{ backgroundColor: tags[key].color }}
                onClick={() => selectTag(key, !taskTags[key])}
              >
                <div className="check">
                  {!!taskTags[key] && (
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

export default List;
