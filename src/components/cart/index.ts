import { IProductItem } from '../main/interface/Iproducts';
import { cartStatement } from './local-storage/cart-storage';
import { getSelector } from '../../functions/utils';
import { clearContent } from '../../router/router';
import { countAmountOfItems } from './local-storage/cart-storage';
import { showTotalCost } from './local-storage/cart-storage';
import { renderCartInner } from './render-cart/renderCart';
import { renderPromo } from './render-cart/promo';

class CartPage {
  loadPage(elements?: IProductItem[] | string[]) {
    clearContent();
    this.renderCart();

    const container = getSelector(document, '.cart');

    if (cartStatement.counter === 0) {
      container.innerHTML = 'Cart is empty.';
    } else {
      container.innerHTML = `
        <div class="main__cart">
          <div class="cart__products">
            <div class="cart__products-header">
              <div class="header__name">Products in Cart</div>
              <div class="items__amount">
                <div class="items__amount-text">Items on page:</div>
                <input class="items__amount-num" value="${cartStatement.itemsPerPage}"></input>
              </div>
              <div class="page">
                <div class="page__text">Page:</div>
                <button class="page__back"><</button>
                <div class="page__current">${cartStatement.currentPage}</div>
                <button class="page__forward">></button>
              </div>
            </div>
            <div class="cart__inner"></div>
          </div>
        </div>
      `;

      countAmountOfItems();
      renderCartInner();
      renderPromo();
      showTotalCost();
    }
  }

  renderCart() {
    clearContent();
    const main = getSelector(document, '.main-content'),
      div = document.createElement('div');

    div.classList.add('cart');

    main.append(div);
  }
}

const loadCartPage = new CartPage();

export { loadCartPage, CartPage };
