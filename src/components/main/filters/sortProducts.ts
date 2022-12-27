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
    this.sortComponent.innerHTML = `
      <select class='sort-options-list' name='sort'>
        <option class='sort-options-item' selected disabled value='default'>--Select sort option--</option>
        <option class='sort-options-item' value='price-asc'>Sort by price ↑ </option>
        <option class='sort-options-item' value='price-dsc'>Sort by price ↓ </option>
        <option class='sort-options-item' value='rating-asc'>Sort by rating ↑ </option>
        <option class='sort-options-item' value='rating-dsc'>Sort by rating ↓ </option>
      </select>
    `;
    return this.sortComponent;
  }
  loadSortComponent(root: HTMLElement) {
    this.sortComponent.className = 'sort-container';
    root.append(this.sortComponent);
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
    if (sortValue === 'default') {
      return '';
    } else {
      return `sort=${sortValue}`;
    }
  }
}
