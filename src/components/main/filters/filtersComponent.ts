import { IProductItem } from '../interface/Iproducts';
import { FilterCheckbox } from './filterCheckbox';
import { FilterSliderRange } from './filterDualSlider';

class FilterComponents {
  static typesList: string[];
  static filterArray: (FilterCheckbox | FilterSliderRange)[];
  filterComponent: HTMLElement = document.createElement('div');

  constructor() {
    FilterComponents.typesList = ['category', 'brand', 'price', 'rating'];
    FilterComponents.filterArray = [];
  }

  render(products: IProductItem[]) {
    let innerHTMLFilters = this.addFoundProductsTotal() + this.addButtons();

    FilterComponents.typesList.forEach((type) => {
      if (type === 'brand' || type === 'category') {
        const checkboxFilter = new FilterCheckbox(type, products);
        innerHTMLFilters += checkboxFilter.render();
        FilterComponents.filterArray.push(checkboxFilter);
      }
      if (type === 'price' || type === 'rating') {
        const sliderFilter = new FilterSliderRange(type, products);
        innerHTMLFilters += sliderFilter.render();
        FilterComponents.filterArray.push(sliderFilter);
      }
    });
    return innerHTMLFilters;
  }

  loadFilters(products: IProductItem[]) {
    this.filterComponent.innerHTML = this.render(products);
    this.filterComponent.className = 'filters__container';
    return this.filterComponent;
  }

  addButtons() {
    return `<div class='filter__button-container'>
              <div class='filter__button' id='reset'>Reset filters</div>
              <div class='filter__button' id='copy'>Copy filters</div>
            </div>`;
  }
  addFoundProductsTotal() {
    return `<div class='filter__found-count'>
              <p>Found: <span class='filter__found-count-item'> </span> </p>
            </div>`;
  }
  updateFoundProductsTotal(products: IProductItem[]) {
    const foundCount = document.querySelector('.filter__found-count-item');
    if (foundCount instanceof HTMLElement) {
      foundCount.textContent = `${products.length}`;
    }
  }

  updateFiltersAmount(products: IProductItem[]) {
    FilterComponents.filterArray.forEach((el) => {
      if (el instanceof FilterCheckbox) {
        el.updateAmount(products);
      }
      if (el instanceof FilterSliderRange) {
        el.updateState(products);
      }
    });
  }

  resetFilters() {
    FilterComponents.filterArray.forEach((el) => el.setDefaultState());
  }
}

export { FilterComponents };
