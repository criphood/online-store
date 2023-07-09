import { showTotalCost } from '../cart/local-storage/cart-storage';
import { getSelector } from '../../functions/utils';
import { clearContent } from '../../router/router';
import { loadCartPage } from '../cart';
import { cartStatement } from '../cart/local-storage/cart-storage';

class ErrorPage {
  loadPage() {
    const element = document.querySelector('.main-content');
    const errorPage = document.createElement('article');

    errorPage.classList.add('error');
    errorPage.innerHTML = `
      <div class="error__number">
        404
      </div>

      <div class="error__description">
        The page you are looking for doesn't exist.
      </div>
    `;

    element?.append(errorPage);

    showTotalCost();

    getSelector(document, '.header__container-cart').addEventListener('click', () => {
      clearContent();
      loadCartPage.loadPage(cartStatement.inCart);
    });
  }
}

const loadErrorPage = new ErrorPage();

export { loadErrorPage };
