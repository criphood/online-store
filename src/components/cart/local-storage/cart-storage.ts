import { getSelector, getSumOfObject } from '../../../functions/utils';
import { renderCartIcon, cartCounter } from '../cart-icon/icon';

let cartStatement: Cart;

if (localStorage.getItem('cartStatement')) {
  cartStatement = getState();
} else {
  cartStatement = {
    inCart: [],
    inCartAmount: {},
    counter: 0,
    itemsPerPage: 3,
    currentPage: 1,
    codes: [],
  };
}

function setState() {
  localStorage.setItem('cartStatement', JSON.stringify(cartStatement));
}

function getState() {
  return JSON.parse(<string>localStorage.getItem('cartStatement'));
}

function countAmountOfItems() {
  cartStatement.inCartAmount = cartStatement.inCart.reduce((item: Amount, id) => {
    item[id] = (item[id] || 0) + 1;
    if (item[id] === 0) delete item[id];
    return item;
  }, {});

  cartStatement.counter = getSumOfObject(cartStatement.inCartAmount);

  getSelector(document, '.cart-count').textContent = cartStatement.counter.toString();
}

function showTotalCost() {
  let sum = 0;

  cartStatement.inCart.forEach((item: string) => {
    sum += +JSON.parse(item).price;
  });

  const result = `€${sum.toString()}`;

  getSelector(document, '.money-counter').innerHTML = result;

  return result;
}

interface Cart {
  inCart: string[];
  inCartAmount: Amount;
  counter: number;
  itemsPerPage: number;
  currentPage: number;
  codes: string[];
}

type Amount = { [key: string]: number };

export { cartStatement, getState, setState, Cart, Amount, countAmountOfItems, showTotalCost };
