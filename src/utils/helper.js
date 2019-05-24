import { getLocale as getLocaleString } from 'umi-plugin-locale';

export function px2Rem(px) {
  return px / 100;
}

export function px2RemStr(px) {
  return `${px2Rem(px)}rem`;
}

export function getLocale() {
  return getLocaleString();
}

export function getToken() {
  return '';
}
