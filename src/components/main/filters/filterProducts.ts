import { FilterComponents } from './filtersComponent';
import { IProductItem } from '../interface/Iproducts';
import { copyURLtoClipboard, getIntersectionsInArray, getSelector } from '../../../functions/utils';
import { ProductComponent } from '../catalogue/productItem';
import { Search } from './search';
import { Sort } from './sortProducts';
import { FilterSliderRange } from './filterDualSlider';
import { DisplayOptions } from './displayOptions';
import { ProductPage } from '../../product-details';

class FilterProducts extends FilterComponents {
  static activeFilters: { [x: string]: (string | number)[] };
  static stateArray: { [x: string]: IProductItem[] };
  searchComponent: Search;
  sortComponent: Sort;
  displayComponent: DisplayOptions;

  constructor() {
    super();
    this.setDefaultState();
    this.searchComponent = new Search();
    this.sortComponent = new Sort();
    this.displayComponent = new DisplayOptions();
  }

  setDefaultState() {
    FilterProducts.activeFilters = { category: [], brand: [], price: [], rating: [] };
    FilterProducts.stateArray = {};
  }

  addListener(products: IProductItem[]) {
    this.filterComponent.addEventListener('input', (e) => {
      const target = e.target;
      if (target instanceof HTMLInputElement && target.type === 'range') {
        const inputSlider = FilterComponents.filterArray.find(
          (el) =>
            el instanceof FilterSliderRange && (el.sliderInputOneID === target.id || el.sliderInputTwoID === target.id)
        );
        if (inputSlider instanceof FilterSliderRange) {
          inputSlider.setValue(target.value, target.id);
          const actualValues = inputSlider.getValue();
          FilterProducts.activeFilters[target.name] = actualValues;
          inputSlider.isActive = true;
        }
      }
      if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        const allInputs = [...document.querySelectorAll('input[type=checkbox')] as HTMLInputElement[];
        updateFiltersObj(allInputs);
      }
      this.syncURL();
      this.renderFilteredProducts(products);
    });

    this.filterComponent.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (target.classList.contains('filter__button')) {
        const buttonID = target.getAttribute('id');
        const buttonText = target.textContent;
        switch (buttonID) {
          case 'copy':
            copyURLtoClipboard();
            target.textContent = 'Link copied!';
            target.classList.add('filter__button-copied');
            setTimeout(() => {
              target.textContent = buttonText;
              target.classList.remove('filter__button-copied');
            }, 1000);
            break;
          case 'reset':
            this.setDefaultState();
            this.sortComponent.setSortValue('default');
            this.searchComponent.resetSearch();
            this.resetFilters();
            this.syncURL();
            this.renderFilteredProducts(products);
            break;
        }
      }
    });

    this.searchComponent.render().addEventListener('input', (e) => {
      const searchInput = e.target;
      if (searchInput instanceof HTMLInputElement) {
        this.searchComponent.setSearchValue(searchInput.value);
        this.renderFilteredProducts(products);
        this.syncURL();
      }
    });

    this.sortComponent.render().addEventListener('change', (e) => {
      const target = e.target;
      if (target instanceof HTMLSelectElement) {
        const wishSortValue = target.value;
        this.sortComponent.setSortValue(wishSortValue);
        this.sortComponent.setSelectedAttribute();
        this.renderFilteredProducts(products);
        this.syncURL();
      }
    });

    this.displayComponent.render().addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof HTMLElement) {
        this.displayComponent.setDisplayValue(target.id);
        this.displayComponent.changeProductsView();
        this.syncURL();
      }
    });
  }

  renderFilteredProducts(products: IProductItem[]) {
    const productsArr = getProductsAllFilters(products);

    const isNotActive = Object.values(FilterProducts.activeFilters).every((item) => item.length == 0);
    const productsList = getSelector(document, '.product-list');
    const newProductsHTML = '';

    const allCounts = [...document.querySelectorAll('.checkbox-amount-active')] as HTMLElement[];
    allCounts.forEach((span) => (span.innerHTML = ' 0 / '));

    const updateProductsList = (productsArray: IProductItem[], htmlString: string) => {
      this.sortComponent.sortProductsLogic(productsArray);
      this.updateFiltersAmount(productsArray);
      this.updateFoundProductsTotal(productsArray);
      htmlString =
        productsArray.length === 0
          ? 'products not found'
          : productsArray.map((product) => new ProductComponent(product).render()).join('');

      productsList.innerHTML = htmlString;
      new ProductPage().loadPage(productsArray);
    };

    if (this.searchComponent.isActiveSearch()) {
      switch (isNotActive) {
        case true: {
          const foundProducts = this.searchComponent.searchProducts(products);
          updateProductsList(foundProducts, newProductsHTML);
          break;
        }
        case false: {
          const foundProducts = this.searchComponent.searchProducts(productsArr);
          updateProductsList(foundProducts, newProductsHTML);
          break;
        }
      }
    }

    if (!this.searchComponent.isActiveSearch()) {
      if (isNotActive) {
        updateProductsList(products, newProductsHTML);
      }
      if (!isNotActive) {
        updateProductsList(productsArr, newProductsHTML);
      }
    }
  }

  makeFiltersQuery() {
    const query = Object.entries(FilterProducts.activeFilters)
      .map(([key, value]) => {
        if (value.length) {
          return `${key}=${value}`;
        }
      })
      .filter((item) => item !== undefined)
      .join('&');
    return `${query}`;
  }

  generateCommonQuery() {
    const queryAll = [
      this.makeFiltersQuery(),
      this.sortComponent.makeQuery(),
      this.searchComponent.makeQuery(),
      this.displayComponent.makeQuery(),
    ]
      .filter((str) => str)
      .join('&');
    const query = queryAll.length === 0 ? '' : `?${queryAll}`;
    return query;
  }

  syncURL() {
    const path = document.location.pathname;
    const query = this.generateCommonQuery();
    window.history.pushState('filters', '', `${path}${query}`);
  }
}
export { FilterProducts };

// FUNCTIONS //

function getProductsAllFilters(products: IProductItem[]) {
  for (const key in FilterProducts.activeFilters) {
    const filterField = FilterProducts.activeFilters[key];
    if (filterField.length) {
      let keyInProduct: keyof IProductItem;
      if (key === 'category' || key === 'brand') {
        keyInProduct = key;
        FilterProducts.stateArray[key] = products.filter((item) => {
          return filterField.some((value) => item[keyInProduct] === value);
        });
      }

      if (key === 'price' || key === 'rating') {
        keyInProduct = key;
        FilterProducts.stateArray[key] = products.filter((item) => {
          return item[key] <= +filterField[1] && item[key] >= +filterField[0];
        });
      }
    } else {
      delete FilterProducts.stateArray[key];
    }
  }
  const allFilterProducts = getIntersectionsInArray(FilterProducts.stateArray);
  return allFilterProducts;
}

function updateFiltersObj(inputArr: HTMLInputElement[]) {
  return inputArr
    .filter((input) => input.type === 'checkbox' || input.type === 'range')
    .forEach((input) => {
      const key = input.name;
      const type = input.type;
      switch (type) {
        case 'checkbox':
          updateActiveFilters(input.checked === true, key, input.id);
          break;
        case 'range':
          updateActiveFilters(true, key, input.value);
          break;
      }
    });
}

function updateActiveFilters(condition: boolean, key: string, inputValue: string) {
  if (condition) {
    if (!FilterProducts.activeFilters[key].includes(inputValue)) {
      FilterProducts.activeFilters[key].push(inputValue);
    }
  } else {
    if (FilterProducts.activeFilters[key].includes(inputValue)) {
      const indexNotChecked = FilterProducts.activeFilters[key].indexOf(inputValue);
      FilterProducts.activeFilters[key].splice(indexNotChecked, 1);
    }
  }
}
