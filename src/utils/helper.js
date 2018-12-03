export function px2Rem(px) {
  return px / 100;
}

export function px2RemStr(px) {
  return `${px2Rem(px)}rem`;
}
