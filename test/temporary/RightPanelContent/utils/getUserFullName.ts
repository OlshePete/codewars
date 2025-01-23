import { IUser } from "../../types/esbInterfaces";

export const getUserFullName = (user?: IUser) => {
    if (!user) return '';
  
    const { surname, name, lastname } = user;
  
    if (surname) {
      if (name) {
        if (lastname) {
          return `${surname} ${name} ${lastname}`;
        }
  
        return `${surname} ${name}`;
      }
  
      if (lastname) {
        return `${surname} ${lastname}`;
      }
  
      return `${surname}`;
    }
  
    if (!surname) {
      if (name) {
        if (lastname) {
          return `${name} ${lastname}`;
        }
  
        return `${name}`;
      }
  
      return `${lastname || ''}`;
    }
  
    return '';
  };