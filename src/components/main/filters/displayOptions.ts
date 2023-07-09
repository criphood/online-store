const DEFAULT_VIEW = 'default';
const LIST_VIEW = 'list';
const TABLE_VIEW = 'table';
export class DisplayOptions {
  displayComponent = document.createElement('div');
  displayValue = DEFAULT_VIEW;

  getDisplayValue() {
    return this.displayValue;
  }
  setDisplayValue(value: string) {
    if (value === TABLE_VIEW || value === LIST_VIEW) {
      this.displayValue = value;
    } else {
      this.displayValue = DEFAULT_VIEW;
    }
  }

  render() {
    this.displayComponent.classList.add('products__display-options');
    this.displayComponent.innerHTML = `
      <span class="products__display-icon active-icon" id="${TABLE_VIEW}"></span>
      <span class="products__display-icon" id="${LIST_VIEW}"></span>`;

    return this.displayComponent;
  }

  makeQuery() {
    const displayValue = this.getDisplayValue();
    if (displayValue === DEFAULT_VIEW) {
      return '';
    } else {
      return `display=${displayValue}`;
    }
  }

  changeProductsView() {
    const displayedProducts = document.querySelector('.product-list');
    if (displayedProducts instanceof HTMLElement) {
      displayedProducts.className = `product-list product-list-${this.getDisplayValue()}`;
    }
    this.addActiveStyle();
  }

  addActiveStyle() {
    let id = this.getDisplayValue();
    if (id === DEFAULT_VIEW) {
      id = TABLE_VIEW;
    }
    const icons = [...document.querySelectorAll('.products__display-icon')];
    const icon = document.getElementById(`${id}`);

    if (icon instanceof HTMLElement) {
      icons.forEach((item) => item.classList.remove('active-icon'));
      icon.className = 'products__display-icon active-icon';
    }
  }
}
