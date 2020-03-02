import { generateActionsByTypes } from '@/redux/actions/index';
import * as TYPES from '@/redux/types/home';

export default {
  ...generateActionsByTypes(TYPES),
};
