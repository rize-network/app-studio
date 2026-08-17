import { useContext } from 'react';
import { WindowSizeContext } from '../providers/WindowSizeContext';

export const useWindowSize = () => useContext(WindowSizeContext);
