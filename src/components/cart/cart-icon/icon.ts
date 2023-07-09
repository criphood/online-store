import { setState, cartStatement, showTotalCost } from '../local-storage/cart-storage';
import { getSelector } from '../../../functions/utils';

const cartButton = getSelector(document, '.header__container-cart'),
  cartCounter = getSelector(cartButton, '.cart-count');

renderCartIcon();

function renderCartIcon() {
  cartCounter.textContent = cartStatement.counter.toString();
  showTotalCost();
}

function decreaseCartIcon() {
  cartStatement.counter--;
  renderCartIcon();
  setState();
}

function increaseCartIcon() {
  cartStatement.counter++;
  renderCartIcon();
  setState();
}

export { increaseCartIcon, cartCounter, cartButton, decreaseCartIcon, renderCartIcon };
