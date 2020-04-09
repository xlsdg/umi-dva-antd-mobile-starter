import { generateActionsByTypes, generateDispatchesByTypes, createStateSelector } from '@/redux/actions';
import TYPES from '@/redux/types/home';
import NAMESPACES from '@/redux/namespaces';

export const actions = generateActionsByTypes(TYPES);
export const dispatches = generateDispatchesByTypes(TYPES, actions, NAMESPACES.HOME);
export const createHomeStateSelector = path => createStateSelector(path, NAMESPACES.HOME);
export default actions;
