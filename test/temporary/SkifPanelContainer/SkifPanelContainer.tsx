import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import clsx from 'clsx';
import './SkifPanelContainer.scss';
import { SkifPanelContainerProps } from './SkifPanelContainer.types';
import { useSkifPanelContainer } from './SkifPanelContainerContext';
import { makeStyles, useTheme } from '@uds/utils';
import SkifPanelContainerStyles from './SkifPanelContainer.styles';

const useStyles = makeStyles(SkifPanelContainerStyles);
export const SkifPanelContainer: FC<SkifPanelContainerProps> = ({
  minWidth = 420,
  maxWidth = Math.min(window.innerWidth / 2.5, 800),
  children,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { isOpen: openPanel } = useSkifPanelContainer();
  const [widthForm, setPanelWidth] = useState(minWidth);
  const [startX, setStartX] = useState(0);
  const maxPanelWidth = maxWidth;
  const shutter = useRef<HTMLDivElement>(null);

  const mouseDownShutterResizingElement = (event: React.MouseEvent) => {
    event.preventDefault();
    setStartX(event.clientX);
    document.addEventListener('mouseup', mouseUpShutterResizingElement);
    document.addEventListener('mousemove', mouseMoveShutterResizingElement);
  };

  const mouseMoveShutterResizingElement = (event: MouseEvent) => {
    const deltaX = startX - event.clientX;
    const changeWidth = widthForm + deltaX;
    event.preventDefault();
    if (setPanelWidth && typeof setPanelWidth === 'function') {
      if (changeWidth <= minWidth) {
        setPanelWidth(minWidth);
      } else if (changeWidth >= maxPanelWidth) {
        setPanelWidth(maxPanelWidth);
      } else setPanelWidth(changeWidth);
    }
    setStartX(event.clientX);
  };

  const mouseUpShutterResizingElement = () => {
    document.removeEventListener('mouseup', mouseUpShutterResizingElement);
    document.removeEventListener('mousemove', mouseMoveShutterResizingElement);
  };

  useEffect(() => {
    if (shutter?.current) {
      setStartX(shutter.current.getBoundingClientRect().left);
    }
  });

  if (!openPanel) return <></>;
  return (
    <div
      className={clsx('RightPanel', classes.root)}
      style={{ maxWidth: `${widthForm}px`, minWidth: `${widthForm}px` }}
    >
      <div
        ref={shutter}
        role="presentation"
        className="shutter-resizing-element"
        onMouseDown={(event: React.MouseEvent) => {
          mouseDownShutterResizingElement(event);
        }}
      />
      {children}
    </div>
  );
};
