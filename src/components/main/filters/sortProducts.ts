import { getSelector } from '../../../functions/utils';
import { ProductComponent } from '../catalogue/productItem';
import { IProductItem } from '../interface/Iproducts';

export class Sort {
  sortComponent: HTMLElement = document.createElement('div');
  sortValue = 'default';

  getSortValue() {
    return this.sortValue;
  }
  setSortValue(value: string) {
    this.sortValue = value;
    this.setSelectedAttribute();
  }

  render() {
    return `
      <select class='sort-options-list' name='sort'>
        <option class='sort-options-item' selected disabled value='default'>--Select sort option--</option>
        <option class='sort-options-item' value='price-asc'>Sort by price ↑ </option>
        <option class='sort-options-item' value='price-dsc'>Sort by price ↓ </option>
        <option class='sort-options-item' value='rating-asc'>Sort by rating ↑ </option>
        <option class='sort-options-item' value='rating-dsc'>Sort by rating ↓ </option>
      </select>
    `;
  }
  loadSortComponent(root: HTMLElement, products: IProductItem[]) {
    this.sortComponent.className = 'sort-container';
    this.sortComponent.innerHTML = this.render();
    root.append(this.sortComponent);
    this.addListener(products);
  }

  setSelectedAttribute() {
    const allOption = [...this.sortComponent.querySelectorAll('.sort-options-item')] as HTMLOptionElement[];
    allOption.forEach((item) => {
      if (item.value === this.getSortValue()) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
  }
  addListener(products: IProductItem[]) {
    this.sortComponent.addEventListener('change', (e) => {
      const target = e.target as HTMLOptionElement;
      const wishSortValue = target.value;
      this.setSortValue(wishSortValue);
      this.syncURL();
      this.sortDisplayedProducts(products);
      this.setSelectedAttribute();
    });
  }

  sortDisplayedProducts(products: IProductItem[]) {
    const productListNode = getSelector(document, '.product-list');
    const displayedProductsID = [...productListNode.children].map((item) => {
      if (item.getAttribute('id') !== null) {
        return +(item.getAttribute('id') as string);
      }
    });
    productListNode.innerHTML = '';
    this.sortProductsLogic(products)
      .filter((item) => displayedProductsID.includes(item.id))
      .forEach((item) => {
        productListNode.innerHTML += new ProductComponent(item).render();
      });
  }

  sortProductsLogic(products: IProductItem[]) {
    if (this.getSortValue() === 'default') {
      return products.sort((a, b) => a.id - b.id);
    }
    const [keySort, direction] = this.getSortValue().split('-');
    if (keySort === 'price') {
      switch (direction) {
        case 'asc':
          products.sort((a, b) => {
            return a.price - b.price;
          });
          break;
        case 'dsc':
          products.sort((a, b) => {
            return b.price - a.price;
          });
          break;
      }
    }
    if (keySort === 'rating') {
      switch (direction) {
        case 'asc':
          products.sort((a, b) => {
            return a.rating - b.rating;
          });
          break;
        case 'dsc':
          products.sort((a, b) => {
            return b.rating - a.rating;
          });
          break;
      }
    }
    return products;
  }
  makeQuery() {
    const sortValue = this.getSortValue();
    const query = `sort=${sortValue}`;
    return `?${query}`;
  }

  syncURL() {
    const path = window.location.search || document.location.pathname;
    const query = this.makeQuery();
    window.history.pushState({}, '', `${path}${query}`);
  }
}

export const sortComponent = new Sort();
