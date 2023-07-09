import { FiltersLoader } from '../filters/filtersLoader';
import { IProductItem } from '../interface/Iproducts';
import { Catalogue } from './catalogue';

export class MainRender {
  root: HTMLElement;
  filters: FiltersLoader;
  productsList: Catalogue;

  constructor(root: HTMLElement) {
    this.root = root;
    this.filters = new FiltersLoader();
    this.productsList = new Catalogue();
  }

  load(products: IProductItem[]) {
    const container = document.createElement('div');
    container.className = 'products_container';
    container.append(this.filters.loadHelpers(), this.productsList.loadCatalogue(products));
    this.root.append(this.filters.loadFilters(products), container);
  }
}
