import { useContext } from 'react';
import { WindowSizeContext } from '../providers/WindowSize';

export const useWindowSize = () => useContext(WindowSizeContext);
