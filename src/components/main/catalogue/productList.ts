import { ProductComponent } from '../catalogue/productItem';
import { IProductItem } from '../interface/Iproducts';

export class ProductList {
  render(products: IProductItem[]) {
    return `
    <div class="product-list">
      ${products.map((product) => new ProductComponent(product).render()).join('')}
    </div>`;
  }
}
