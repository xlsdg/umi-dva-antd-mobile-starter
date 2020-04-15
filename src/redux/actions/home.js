import {
  generateActionsByTypes,
  generateDispatchesByTypes,
  generateStateSelector,
  generateLoadingSelector,
} from '@/redux/actions';
import TYPES from '@/redux/types/home';
import NAMESPACES from '@/redux/namespaces';

export const actions = generateActionsByTypes(TYPES);
export const dispatches = generateDispatchesByTypes(TYPES, actions, NAMESPACES.HOME);
export const createStateSelector = path => generateStateSelector(path, NAMESPACES.HOME);
export const createLoadingSelector = generateLoadingSelector(TYPES, NAMESPACES.HOME);
export default actions;
