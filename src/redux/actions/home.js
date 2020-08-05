import {
  generateActionsByTypes,
  generateStateSelector,
  generateUseStateSelector,
  generateDispatchSelector,
  generateUseDispatchSelector,
  generateConnectSelector,
} from '@/redux/actions';
import TYPES from '@/redux/types/home';
import NAMESPACES from '@/redux/namespaces';

export const actions = generateActionsByTypes(TYPES);

export const createStateSelector = path => generateStateSelector(path, NAMESPACES.HOME);
export const createUseStateSelector = path => generateUseStateSelector(path, NAMESPACES.HOME);

export const createDispatchSelector = filter => generateDispatchSelector(filter, TYPES, actions, NAMESPACES.HOME);
export const createUseDispatchSelector = filter => generateUseDispatchSelector(filter, TYPES, actions, NAMESPACES.HOME);

export const createConnectSelector = generateConnectSelector(createStateSelector, createDispatchSelector);

export default actions;
