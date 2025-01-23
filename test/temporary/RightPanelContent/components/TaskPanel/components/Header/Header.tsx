import clsx from 'clsx';
import * as React from 'react';
import { UDSButton, UDSHeader } from '@uds/react-components';
import { Close } from '@uds/icons/12px';
import { HeaderStyles } from './Header.styles';
import type { IHeader } from './Header.types';
import './Header.scss';
import { makeStyles, useTheme } from '@uds/utils';
import { useSkifPanelContainer } from '../../../../../SkifPanelContainer/SkifPanelContainerContext';
import { HeaderLayout } from '../../../../../layout/Header';

const useStyles = makeStyles(HeaderStyles);
const Header: React.FC<Partial<IHeader>> = ({ name, className, ...props }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { onToggle } = useSkifPanelContainer();
  const closePanel = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onToggle && typeof onToggle === 'function' && onToggle(false,e)
  }
  return (
    <HeaderLayout className={clsx(className, classes.root)} {...props}>
      <UDSHeader type="h4">{name}</UDSHeader>
      <div className="header__buttons">
        <UDSButton
          variant="base"
          size="small"
          startIcon={<Close />}
          onClick={closePanel}
        />
      </div>
    </HeaderLayout>
  );
};

export default Header;
