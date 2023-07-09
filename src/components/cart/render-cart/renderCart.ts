import { cartStatement, countAmountOfItems } from '../local-storage/cart-storage';
import { paginate } from './pagination';

let paginationData: HTMLDivElement[] = [];

function renderCartInner() {
  paginationData = [];
  countAmountOfItems();

  const productsAmount = cartStatement.inCartAmount,
    products = Object.keys(productsAmount);

  products.forEach((product, i) => {
    const parsedProduct = JSON.parse(product),
      wrapper = document.createElement('div'),
      amount = productsAmount[product];

    wrapper.classList.add('cart__inner-item');
    wrapper.innerHTML = `
      <div class="cart__inner-index">${i + 1}</div>
      <img class="cart__inner-thumbnail" src="${parsedProduct.thumbnail}"></img>
      <div class="cart__inner-description">
        <div class="product__title">${parsedProduct.title}</div>
        <div class="product__description">${parsedProduct.description}</div>
        <div class="product__rest">
          <div class="product__rest-prop">Rating: ${parsedProduct.rating}</div>
          <div class="product__rest-prop">Price: €${parsedProduct.price}</div>
          <div class="product__rest-prop">Discount: ${parsedProduct.discountPercentage}%</div>
        </div>
      </div>
      <div class="cart__inner-amount">
        <div class="stock">Stock: ${parsedProduct.stock}</div>
        <div class="amount__changers">
          <button class="amount__changers-decrease">-</button>
          <div class="amount__changers-number">${amount}</div>
          <button class="amount__changers-increase">+</button>
        </div>
        <div class="item__cost">€${parsedProduct.price * amount}</div>
      </div>
    `;

    wrapper.dataset.index = parsedProduct.id;
    paginationData.push(wrapper);
  });

  paginate();
}

export { renderCartInner, paginationData };
