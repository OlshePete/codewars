import type { HTMLAttributes, MouseEvent } from 'react';

type ExcludedProps = 'onChange' | 'onPause';

export interface SkifPanelContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, ExcludedProps> {
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  setWidth?: (newWidth:number)=>void;
  isOpen?:boolean;
  onToggle?(value: boolean, event: MouseEvent<HTMLHeadElement>): void;
}

export type SkifPanelContainerPropsRef = HTMLDivElement;
