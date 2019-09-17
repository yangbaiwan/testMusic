import fetch from './fetch';

export function songMenuSelect(yclass, page=1) {
  return fetch('https://year.wdkid.com/index.php/Index/songMenuSelect', {
    yclass: yclass,
    page: page
  })
}
