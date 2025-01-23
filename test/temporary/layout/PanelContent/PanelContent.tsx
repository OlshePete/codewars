import React from 'react';
import clsx from 'clsx';
import './PanelContent.scss';
import { UDSScroll } from '@uds/react-components';

export interface IPanelContentLayout extends React.HTMLProps<HTMLDivElement> {}

const PanelContentLayout: React.FC<IPanelContentLayout> = ({ children, className, ...props }) => (
  <div className={clsx('PanelContentLayout', className)} {...props}>
    {children}
    <UDSScroll />
  </div>
);

export default PanelContentLayout;