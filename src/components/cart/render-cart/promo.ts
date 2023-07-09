import { cartStatement } from '../local-storage/cart-storage';
import { showTotalCost, setState } from '../local-storage/cart-storage';
import { getSelector } from '../../../functions/utils';
import { loadCartPage } from '..';
import { renderModal } from './modal';

function renderPromo() {
  const cart = getSelector(document, '.cart'),
    wrapper = getSelector(cart, '.main__cart'),
    summary = document.createElement('div'),
    codes = cartStatement.codes;

  summary.classList.add('cart__summary');

  summary.innerHTML = `
    <div class="summary__wrapper">
      <div class="cart__summary-header">Summary</div>
      <div class="cart__summary-products">
        <span class="summary-text">Products:</span>
        <span class="summary-amount">${cartStatement.counter}</span>
      </div>
      <div class="cart__summary-total">
        <div class="totals">
          <div class="totals-item">
            <span class="summary-text">Total:</span>
            <span class="summary-price">${showTotalCost()}</span>
          </div>
          <div class="clone__totals-item hide">
            <span class="summary-text">Total:</span>
            <span class="summary-price"></span>
          </div>
        </div>

        <div class="applied__codes">
          <div class="applied__codes-header">Applied codes:</div>
          <div class="applied__codes-inner"></div>
        </div>
      </div>
      <input class="cart__summary-input" type="text" placeholder="Enter promo code">
      <div class="cart__summary-promo">
        <div class="promo-rolling hide">
          <span class="promo-info">RS School - 10%</span>
          <button class="promo-add">ADD</button>
        </div>
        <div class="promo-epam hide">
          <span class="promo-info">EPAM Systems - 10%</span>
          <button class="promo-add">ADD</button>
        </div>
      </div>
      <p class ="cart__promo-examples">Promo for test: "RS", "EPM"</p>
      <button class="product__options-buy">BUY NOW</button>
    </div>
  `;

  wrapper.append(summary);

  const totals = getSelector(document, '.totals-item'),
    clone = getSelector(document, '.clone__totals-item'),
    clonePrice = getSelector(clone, '.summary-price');

  if (codes.length > 0) {
    totals.style.textDecoration = 'line-through';

    clone.classList.remove('hide');
    clone.classList.add('remove');

    const discount = codes.reduce((acc: number, item: string) => {
      return acc + +item.slice(-3, -1);
    }, 0);

    let resultPrice = ((+showTotalCost().slice(1) * (100 - discount)) / 100).toString();

    if (resultPrice.includes('.')) {
      const splitted = resultPrice.split('.');

      while (splitted[1].length < 2) {
        splitted[1] += 0;
      }

      resultPrice = splitted.join('.');
    }

    clonePrice.innerHTML = '€' + resultPrice;

    codes.forEach((code) => {
      const div = document.createElement('div');
      div.classList.add('code');
      div.innerHTML = `
      <div class="code__inner">${code}</div>
      <button class="code__remove">DROP</button>
    `;

      getSelector(document, '.applied__codes-inner').append(div);
    });
  }

  const appliedList = getSelector(document, '.applied__codes-inner'),
    appliedWrapper = getSelector(document, '.applied__codes'),
    promoRolling = getSelector(document, '.promo-rolling'),
    promoEpam = getSelector(document, '.promo-epam');

  Array.from(appliedList.children).forEach((item, i) => {
    item.addEventListener('click', (e) => {
      if (e.target === item.querySelector('.code__remove')) {
        const deletingItem = item.children[0].textContent,
          deletingFromState = cartStatement.codes.find((item) => item === deletingItem);

        if (deletingFromState) {
          cartStatement.codes.splice(cartStatement.codes.indexOf(deletingFromState), 1);
        }

        if (Array.from(appliedList.children).length === 0) {
          appliedWrapper.classList.remove('show');
          appliedWrapper.classList.add('hide');

          totals.style.textDecoration = 'none';
        }

        setState();
        loadCartPage.loadPage();
      }
    });
  });

  addCode(promoRolling, 'RS');
  addCode(promoEpam, 'EPM');

  renderModal();
}

function addCode(codeName: Element, value: string) {
  const promoInput = getSelector(document, '.cart__summary-input'),
    totals = getSelector(document, '.totals-item');

  if (promoInput instanceof HTMLInputElement) {
    promoInput.addEventListener('input', () => {
      if (promoInput.value.toUpperCase() === value) {
        codeName.classList.remove('hide');
        codeName.classList.add('show');
      } else {
        codeName.classList.remove('show');
        codeName.classList.add('hide');
      }
    });
  }

  codeName.addEventListener('click', (e) => {
    if (e.target === getSelector(codeName, '.promo-add')) {
      totals.style.textDecoration = 'line-through';
      cartStatement.codes.push(codeName.children[0].innerHTML);
      cartStatement.codes = Array.from(new Set([...cartStatement.codes]));
      setState();
      loadCartPage.loadPage();
    }
  });
}

export { renderPromo };
