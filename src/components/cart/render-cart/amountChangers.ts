import { loadCartPage } from '..';
import { PRODUCTS_DB } from '../../../data/data';
import { getSelector } from '../../../functions/utils';
import { loadProductPage } from '../../product-details';
import { cartStatement, countAmountOfItems, setState, showTotalCost } from '../local-storage/cart-storage';

export function addAmountChangers() {
  const renderedProducts: Element[] = Array.from(document.getElementsByClassName('cart__inner-item')),
    productsInCart = cartStatement.inCart;

  renderedProducts.forEach((product) => {
    if (product && product instanceof HTMLElement) {
      const index = product.dataset.index;

      product.onclick = (e) => {
        for (let i = 0; i < productsInCart.length; i++) {
          const parsedItem = JSON.parse(productsInCart[i]);

          if (e.target === getSelector(product, '.amount__changers-decrease') && index == parsedItem.id) {
            productsInCart.splice(i, 1);
            countAmountOfItems();
            showTotalCost();
            setState();
            loadCartPage.loadPage(productsInCart);
            break;
          }

          if (
            e.target === getSelector(product, '.product__title') ||
            e.target === getSelector(product, '.cart__inner-thumbnail')
          ) {
            if (index) loadProductPage.renderItem(PRODUCTS_DB, +index);
            window.history.pushState({}, '', `product-${index}`);
            break;
          }

          if (e.target === getSelector(product, '.amount__changers-increase') && index == parsedItem.id) {
            const amountItem = getSelector(product, '.amount__changers-number');

            if (parsedItem.stock > +amountItem.innerHTML) {
              productsInCart.push(productsInCart[i]);
            } else {
              alert('No more items in stock :(');
            }

            productsInCart.forEach((item, j) => {
              const lastPushed = productsInCart.slice(-1).pop();
              if (item === lastPushed) {
                productsInCart.splice(j, 0, lastPushed);
                productsInCart.pop();
              }
            });

            countAmountOfItems();
            showTotalCost();
            setState();
            loadCartPage.loadPage(productsInCart);
            break;
          }
        }
      };
    }
  });
}
