import { FilterBase, filtersTypes } from './filterBase';
import { IProductItem } from '../interface/Iproducts';

export class FilterCheckbox extends FilterBase {
  root: HTMLElement;
  constructor(type: filtersTypes, products: IProductItem[]) {
    super(type, products);
    this.root = document.createElement('div');
  }

  render() {
    let filtersListHTML = '';
    const filterItems = this.getFilterFieldList(this.products);
    const amountObject = this.getProductsAmountByField(this.products);

    filterItems.forEach((filterItem) => {
      filtersListHTML += `
      <div class='filter__checkbox-item'>
          <input class='filter__checkbox-input' 
                 type='checkbox' 
                 name='${this.type}' 
                 id ='${filterItem}'>
          <label class='filter__checkbox-label' for='${filterItem}'>${filterItem}
          <div class='checkbox-amount-container'>
            <span class='checkbox-amount-active'> ${amountObject[filterItem]}/ </span>
            <span class='checkbox-amount'>${amountObject[filterItem]}</span>
          </div>
          </label>
      </div>`;
    });
    this.root.innerHTML +=
      `<div class='filter__checkbox-container'>
        <h3 class='filter__title'>${this.type.toUpperCase()}</h3>` +
      `<div class='filter__list'>${filtersListHTML}</div>
      </div>`;
    return this.root.innerHTML;
  }

  updateAmount(products: IProductItem[]) {
    const amountObject = this.getProductsAmountByField(products);
    for (const key in amountObject) {
      const label = [...document.querySelectorAll(`.filter__checkbox-label`)] as HTMLElement[];
      label.forEach((el) => {
        const activeAmount = el.querySelector('.checkbox-amount-active') as HTMLElement;
        if (el.getAttribute('for') === key) {
          activeAmount.innerHTML = `${amountObject[key]} / `;
        }
      });
    }
  }

  setDefaultState() {
    const allInputs = [...document.getElementsByTagName('input')];
    allInputs.forEach((item) => (item.checked = false));
  }
}
