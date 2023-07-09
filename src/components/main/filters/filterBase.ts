import { IProductItem } from '../interface/Iproducts';

export type filtersTypes = 'brand' | 'category' | 'price' | 'rating';

export class FilterBase {
  type: filtersTypes;
  products: IProductItem[];
  constructor(type: filtersTypes, products: IProductItem[]) {
    this.type = type;
    this.products = [...products];
  }
  getFilterFieldList(products: IProductItem[]) {
    const fieldsList = products.map((product: IProductItem) => product[this.type]);
    const fieldsListFormatted: (string | number)[] = [...new Set(fieldsList)];
    return fieldsListFormatted;
  }
  getProductsAmountByField(products: IProductItem[]) {
    const fieldsList = products.map((product: IProductItem) => product[this.type]);
    const amountObject: { [x: string]: number } = {};
    for (const elem of fieldsList) {
      if (amountObject[elem] === undefined) {
        amountObject[elem] = 1;
      } else {
        amountObject[elem]++;
      }
    }
    return amountObject;
  }
}
