import { FilterComponents } from './filtersComponent';
import { IProductItem } from '../interface/Iproducts';
import { FilterProducts } from './filterProducts';
import { FilterSliderRange } from './filterDualSlider';

class FiltersLoader extends FilterProducts {
  root: HTMLElement | null = document.querySelector('.main-content');
  filterComponent: HTMLElement = document.createElement('div');

  constructor() {
    super();
  }

  loadFilters(products: IProductItem[]) {
    this.filterComponent.innerHTML = new FilterComponents().render(products);
    this.filterComponent.className = 'filters__container';
    this.addListener(products);
    return this.filterComponent;
  }

  loadHelpers() {
    const sortSearchContainer = document.createElement('div');
    sortSearchContainer.className = 'catalogue-helpers';
    this.sortComponent.loadSortComponent(sortSearchContainer);
    this.searchComponent.loadSearchComponent(sortSearchContainer);
    sortSearchContainer.append(this.displayComponent.render());
    return sortSearchContainer;
  }

  setFilterStateFromQuery(products: IProductItem[], stateObj: { [x: string]: string[] }): void {
    this.setDefaultState();

    for (const key in stateObj) {
      switch (key) {
        case 'category':
        case 'brand':
          FilterProducts.activeFilters[key] = stateObj[key];
          stateObj[key].forEach((item) => {
            const input = document.getElementById(`${item}`);
            if (input instanceof HTMLInputElement) {
              input.checked = true;
            } else {
              this.setDefaultState();
            }
          });
          break;

        case 'rating':
        case 'price': {
          const sliderInput = FilterComponents.filterArray.find((el) => el.type === key);
          if (sliderInput instanceof FilterSliderRange) {
            if (+stateObj[key][0] >= 0 && +stateObj[key][1] <= sliderInput.getRangeData()[1]) {
              FilterProducts.activeFilters[key] = stateObj[key];
              sliderInput.setSavedValues(stateObj[key]);
              sliderInput.isActive = true;
            }
          }
          break;
        }
        case 'sort':
          this.sortComponent.setSortValue(`${stateObj[key]}`);
          break;

        case 'search':
          this.searchComponent.setSearchValue(`${stateObj[key]}`);
          this.searchComponent.updateSearchValue();
          break;

        case 'display':
          this.displayComponent.setDisplayValue(`${stateObj[key]}`);
          this.displayComponent.changeProductsView();
          break;
      }
    }
    this.renderFilteredProducts(products);
  }
}
export { FiltersLoader };
