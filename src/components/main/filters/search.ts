import { IProductItem } from '../interface/Iproducts';

export class Search {
  searchComponent: HTMLElement = document.createElement('div');
  searchValue = '';

  getSearchValue() {
    return this.searchValue;
  }

  isActiveSearch() {
    if (this.getSearchValue().length < 2) {
      return false;
    }
    return true;
  }

  setSearchValue(value: string) {
    this.searchValue = value;
  }

  addListener(products: IProductItem[]) {
    this.searchComponent.addEventListener('input', (e) => {
      const searchInput = e.target;
      if (searchInput instanceof HTMLInputElement) {
        this.setSearchValue(searchInput.value);
        this.searchProducts(products);
        this.syncURL();
      }
    });
  }
  render() {
    return `
      <div name='search-products'>
          <input type='search' 
                id='search' 
                name='search-products'
                placeholder='Search the products..'>
       </div>
    `;
  }
  loadSearchComponent(root: HTMLElement, products: IProductItem[]) {
    this.searchComponent.className = 'search-container';
    this.searchComponent.innerHTML = this.render();
    root.append(this.searchComponent);
    this.addListener(products);
    return this.searchComponent;
  }

  searchProducts(products: IProductItem[]) {
    const regEx = new RegExp(`${this.getSearchValue()}`, 'gi');
    const result = products.filter((product) => {
      return (
        regEx.test(product.title) ||
        regEx.test(product.brand) ||
        regEx.test(product.category) ||
        regEx.test(product.description) ||
        regEx.test(`${product.discountPercentage}`) ||
        regEx.test(`${product.price}`) ||
        regEx.test(`${product.rating}`) ||
        regEx.test(`${product.stock}`)
      );
    });

    return result;
  }
  makeQuery() {
    const searchValue = this.getSearchValue();
    const query = `search=${searchValue}`;
    return `?${query}`;
  }

  syncURL() {
    const path = document.location.pathname;
    const query = this.makeQuery();
    window.history.pushState({}, '', `${path}${query}`);
  }
}

export const searchComponent = new Search();
