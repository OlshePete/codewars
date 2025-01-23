import type { HTMLAttributes } from 'react';

export interface ParameterTableRowProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  value: string;
}
