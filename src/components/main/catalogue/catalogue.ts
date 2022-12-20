import { ProductList } from './productList';
import { IProductItem } from '../interface/Iproducts';
import { sortComponent } from '../filters/sortProducts';

export class Catalogue {
  catalogue: ProductList;
  root: HTMLElement | null = document.querySelector('.main-content'); // согласовать селектор в зависимости от главной страницы!
  catalogueComponent: HTMLElement = document.createElement('div');

  constructor() {
    this.catalogue = new ProductList();
  }

  renderHelpers(products: IProductItem[]) {
    const sortSearchContainer = document.createElement('div');
    sortSearchContainer.className = 'catalogue-sorters';
    sortComponent.loadSortComponent(sortSearchContainer, products);
    return sortSearchContainer;
  }

  loadCatalogue(products: IProductItem[]) {
    this.catalogueComponent.className = 'catalogue__container';
    const productsContainer = document.createElement('div');
    productsContainer.className = 'products-container';
    productsContainer.innerHTML = this.catalogue.render(products);
    this.catalogueComponent.append(productsContainer);
    this.catalogueComponent.prepend(this.renderHelpers(products));
    return this.catalogueComponent;
  }
}
