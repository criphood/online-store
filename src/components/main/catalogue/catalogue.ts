import { ProductList } from './productList';
import { IProductItem } from '../interface/Iproducts';

export class Catalogue {
  catalogue: ProductList;
  root: HTMLElement | null = document.querySelector('.main-content');
  catalogueComponent: HTMLElement = document.createElement('div');

  constructor() {
    this.catalogue = new ProductList();
  }

  loadCatalogue(products: IProductItem[]) {
    this.catalogueComponent.className = 'catalogue__container';
    const productsContainer = document.createElement('div');
    productsContainer.className = 'products-container';
    productsContainer.innerHTML = this.catalogue.render(products);
    this.catalogueComponent.append(productsContainer);
    return this.catalogueComponent;
  }
}
