import { IProductItem } from '../components/main/interface/Iproducts';

function getSelector(parent: DocumentFragment | Document | Element | HTMLInputElement | ParentNode, selector: string) {
  const item = parent.querySelector(selector);
  if (item instanceof HTMLElement || item instanceof HTMLInputElement) {
    return item;
  } else {
    throw new Error(`Can't find selector: ${selector}`);
  }
}

function getDataBase64() {
  return (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
}

function appendImage(parentSelector: string, className: string, path: string) {
  const img = document.createElement('img'),
    parent = document.querySelector(parentSelector);

  img.classList.add(className);
  img.src = path;

  parent?.append(img);
}

function getIntersectionsInArray(object: { [x: string]: IProductItem[] }) {
  const values = Object.values(object);
  const result: IProductItem[] = [];
  if (values.some((arr) => arr.length === 0)) {
    return result;
  } else {
    let result: IProductItem[] = values[0];
    for (let i = 1; i < values.length; i++) {
      result = [...result.filter((el) => values[i].includes(el))];
    }
    return result;
  }
}

function copyURLtoClipboard() {
  const url = window.location.href;
  const element = document.createElement('textarea');
  element.value = url;
  element.setAttribute('readonly', '');
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  document.body.appendChild(element);
  element.select();
  document.execCommand('copy');
  document.body.removeChild(element);
}

function parseQuery() {
  const url = window.location.href,
    paramObj: { [x: string]: string[] } = {};

  if (url.includes('?')) {
    const query = url.split('?')[1],
      paramsFromUrl = new URLSearchParams(query);

    for (const [key, value] of paramsFromUrl.entries()) {
      paramObj[key] = value.split(',');
    }
  }

  return paramObj;
}

function checkLength(item: HTMLInputElement, amount: number, length: number) {
  const words = item.value.split(' ');

  const isTooShort = words.some((word) => {
    return word.length < length;
  });

  isTooShort || words.length < amount ? item.classList.add('wrong') : item.classList.remove('wrong');
}

function allowOnlyDigits(item: HTMLInputElement) {
  item.value = item.value.replace(/[^\d]/g, '');
}

function reductLength(item: HTMLInputElement, length: number) {
  if (item.value.length > length) {
    item.value = item.value.slice(0, length);
  }
}

function getSumOfArray(arr: number[]) {
  return arr.reduce((acc, val) => acc + val, 0);
}

function getSumOfObject(object: { [x: string]: number }) {
  return getSumOfArray(Object.values(object));
}

function compareStrings(givenValue: string | number, searchValue: string) {
  if (typeof givenValue === 'number') {
    givenValue = `${givenValue}`;
  }
  return givenValue.toLowerCase().includes(searchValue.toLowerCase());
}

function getPromise(data: string) {
  return new Promise((resolve, reject) => {
    data ? resolve(data) : reject(new Error('error'));
  });
}

export {
  getSelector,
  getDataBase64,
  appendImage,
  getIntersectionsInArray,
  copyURLtoClipboard,
  parseQuery,
  checkLength,
  allowOnlyDigits,
  getSumOfArray,
  getSumOfObject,
  getPromise,
  compareStrings,
  reductLength,
};
