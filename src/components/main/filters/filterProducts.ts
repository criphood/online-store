import { FilterComponents } from './filtersComponent';
import { IProductItem } from '../interface/Iproducts';
import { getIntersectionsInArray, getSelector } from '../../../functions/utils';
import { ProductList } from '../catalogue/productList';
import { sortComponent } from './sortProducts';

class FilterProducts extends FilterComponents {
  static activeFilters: { [x: string]: string[] };
  static stateArray: { [x: string]: number[] };

  constructor() {
    super();
    this.setDefaultState(); // потом проверять, есть ли в query или LS сохраненные фильтры, если нет - обнулять
  }

  setDefaultState() {
    FilterProducts.activeFilters = { category: [], brand: [], price: [], rating: [] };
    FilterProducts.stateArray = { category: [], brand: [], price: [], rating: [] };
  }

  addListener(products: IProductItem[]) {
    this.filterComponent.addEventListener('input', () => {
      const allInputs = [...document.getElementsByTagName('input')];
      updateFiltersObj(allInputs);
      this.syncURL(FilterProducts.activeFilters);
      this.renderFilteredProducts(products);
    });

    this.filterComponent.addEventListener('click', (e) => {
      const allInputs = [...document.getElementsByTagName('input')];
      const target = e.target as HTMLElement;
      if (target.classList.contains('filter__button')) {
        const buttonID = target.getAttribute('id');
        switch (buttonID) {
          case 'copy':
            break;
          case 'reset':
            this.setDefaultState();
            sortComponent.setSortValue('default');
            allInputs.forEach((item) => (item.checked = false));
            this.renderFilteredProducts(products);
            this.syncURL({});
            break;
        }
      }
    });
  }

  renderFilteredProducts(products: IProductItem[]) {
    const idFilteredProducts = getIDbyFilter(products);
    const productsArr = [...products].filter((item) => idFilteredProducts.includes(item.id));
    const isNotActive = Object.values(FilterProducts.stateArray).every((item) => item.length == 0);
    const allCounts = [...document.querySelectorAll('.checkbox-amount-active')] as HTMLElement[];
    let newProducts = '';
    allCounts.forEach((span) => (span.innerHTML = ' 0/ '));

    const updateProductsList = (productsArray: IProductItem[]) => {
      sortComponent.sortProductsLogic(productsArray);
      newProducts = new ProductList().render(productsArray);
      this.updateFiltersAmount(productsArray);
      this.updateFoundProductsTotal(productsArray);
    };

    if (idFilteredProducts.length !== 0) {
      updateProductsList(productsArr);
    }

    if (idFilteredProducts.length === 0 && !isNotActive) {
      newProducts = 'products not found';
      this.updateFoundProductsTotal(productsArr);
    }

    if (idFilteredProducts.length === 0 && isNotActive) {
      updateProductsList(products);
    }

    const productsContainer = getSelector(document, '.products-container');
    productsContainer.innerHTML = newProducts;
  }

  makeQuery(filters: { [x: string]: string[] }) {
    const query = Object.entries(filters)
      .map(([key, value]) => {
        return `${key}=${value}`;
      })
      .join('&');
    return `?${query}`;
  }

  syncURL(filters: { [x: string]: string[] }) {
    const path = document.location.pathname;
    const query = this.makeQuery(filters);
    window.history.replaceState(filters, '', `${path}${query}`);
  }
}
export { FilterProducts };

// FUNCTIONS //

function getIDbyFilter(products: IProductItem[]) {
  for (const key in FilterProducts.activeFilters) {
    const filterField = FilterProducts.activeFilters[key];
    let keyInProduct: keyof IProductItem = 'category';
    if (key === 'brand') {
      keyInProduct = 'brand';
    }

    FilterProducts.stateArray[key] = products
      .filter((item) => {
        return filterField.some((value) => item[keyInProduct] === value);
      })
      .map((item) => item.id);
  }

  const idArr = getIntersectionsInArray(FilterProducts.stateArray);

  return idArr;
}

// находим на странице все input с checkbox:true
// собираем из них объект для дальнейшей фильтрации по базе данных по ключу "название фильтра": [значения];
// присваиваем статическому свойству класса этот объект,
// т.о. он будет доступен для формирования query

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
          updateActiveFilters(input.value >= input.min && input.value <= input.max, key, input.value);
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
