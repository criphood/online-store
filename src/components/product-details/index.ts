import { getSelector } from '../../functions/utils';
import { IProductItem } from '../main/interface/Iproducts';
import { loadThumbnail, loadImages } from './images/images';
import { cartStatement, setState, countAmountOfItems, showTotalCost } from '../cart/local-storage/cart-storage';
import { increaseCartIcon } from '../cart/cart-icon/icon';
import { loadCartPage } from '../cart';

class ProductPage {
  loadPage(elements: IProductItem[]) {
    const items = Array.from(document.getElementsByClassName('product-item'));

    items.forEach((item) => {
      const buttonBuy = getSelector(item, '.product-item__buy');
      toggleBuyButtonStyle(buttonBuy);

      item.addEventListener('click', (e) => {
        const target = e.target;

        if (target instanceof HTMLElement) {
          const product = target.closest('.product-item');

          if (target === getSelector(item, '.product-item__details') && product) {
            this.renderItem(elements, +product.id);
            window.history.pushState({}, '', `product-${+product.id}`);
          }

          if (target === buttonBuy && product) {
            const findedItem = findById(elements, +product.id);

            toggleCartItem(elements, +product.id);

            if (findedItem) {
              buttonBuy.innerHTML = setBuyButtonState(findedItem);
              toggleBuyButtonStyle(buttonBuy);
            }
          }
        }
      });
    });
  }

  renderItem(elements: IProductItem[], x: number) {
    elements.forEach((item: IProductItem) => {
      if (item.id === x) {
        getSelector(document, '.main-content').innerHTML = `
          <div class="container__details">
            <div class="crumbs">
              <div class="crumbs__item">Store</div>
              <div class="crumbs__arrow">></div>
              <div class="crumbs__item">${item.category}</div>
              <div class="crumbs__arrow">></div>
              <div class="crumbs__item">${item.brand}</div>
              <div class="crumbs__arrow">></div>
              <div class="crumbs__item">${item.title}</div>
            </div>
            <div class="product">
              <div class="product__title">${item.title}</div>
              <div class="product__info">
                <div class="product__info-images">
                  <div class="side__images"></div>
                  <div class="head__image"></div>
                </div>
                <div class="product__info-details">
                  <div class="details">
                    <div class="details__header">Description:</div>
                    <div class="details__inner">${item.description}</div>
                  </div>
                  <div class="details">
                    <div class="details__header">Discount Percentage:</div>
                    <div class="details__inner">${item.discountPercentage}</div>
                  </div>
                  <div class="details">
                    <div class="details__header">Rating:</div>
                    <div class="details__inner">${item.rating}</div>
                  </div>
                  <div class="details">
                    <div class="details__header">Stock:</div>
                    <div class="details__inner">${item.stock}</div>
                  </div>
                  <div class="details">
                    <div class="details__header">Brand:</div>
                    <div class="details__inner">${item.brand}</div>
                  </div>
                  <div class="details">
                    <div class="details__header">Category:</div>
                    <div class="details__inner">${item.category}</div>
                  </div>
                  <div class="product__options">
                    <div class="product__options-price">€${item.price}</div>
                    <div class="product__options-buttons">
                      <button class="product__options-add">${setBuyButtonState(item)}</button>
                      <button class="product__options-buy">BUY NOW</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

        const addToCartButton = getSelector(document, '.product__options-add'),
          buyNowButton = getSelector(document, '.product__options-buy');

        toggleBuyButtonStyle(addToCartButton);

        addToCartButton.addEventListener('click', () => {
          toggleCartItem(elements, item.id);
          addToCartButton.innerHTML = setBuyButtonState(item);
          toggleBuyButtonStyle(addToCartButton);
        });

        buyNowButton.addEventListener('click', () => {
          addToCart(elements, item.id);
          setState();
          history.pushState({}, '', '/cart');
          loadCartPage.loadPage();
          const cart = getSelector(document, '.cart'),
            buyButton = getSelector(cart, '.product__options-buy');
          buyButton.click();
        });

        this.appendImages(item);
      }
    });
  }

  appendImages(product: IProductItem) {
    loadThumbnail(product.thumbnail);
    loadImages(product.images);
  }
}

function findById(elems: IProductItem[], index: number) {
  return elems.find((el) => el.id === index);
}

function toggleCartItem(items: IProductItem[], id: number) {
  const productsInCart = cartStatement.inCart,
    product = JSON.stringify(findById(items, id));

  if (!productsInCart.includes(product)) {
    productsInCart.push(product);
    increaseCartIcon();
  } else {
    cartStatement.inCart = productsInCart.filter((el) => el !== product);
  }

  countAmountOfItems();
  showTotalCost();
  setState();
}

function addToCart(items: IProductItem[], id: number) {
  const productsInCart = cartStatement.inCart,
    product = JSON.stringify(findById(items, id));

  if (!productsInCart.includes(product)) {
    productsInCart.push(product);
    increaseCartIcon();
  }

  countAmountOfItems();
  showTotalCost();
  setState();
}

function toggleBuyButtonStyle(item: HTMLElement) {
  if (item.innerHTML === 'remove from cart'.toUpperCase()) {
    item.classList.add('product-item__added');
  } else {
    item.classList.remove('product-item__added');
  }
}

function setBuyButtonState(element: IProductItem) {
  const productsInCart = cartStatement.inCart,
    current = JSON.stringify(element);

  if (productsInCart.includes(current)) {
    return 'REMOVE FROM CART';
  } else {
    return 'ADD TO CART';
  }
}

interface ProductInCart {
  item: IProductItem;
  amount: number;
}

const loadProductPage = new ProductPage();

export { loadProductPage, ProductInCart, setBuyButtonState, ProductPage };
