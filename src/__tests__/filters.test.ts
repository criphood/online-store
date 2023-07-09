import { FilterBase } from '../components/main/filters/filterBase';
import { PRODUCTS_DB } from '../data/data';

describe('FilterBase methods', () => {
  const filterCategory = new FilterBase('category', PRODUCTS_DB);

  test('should be an instance of FilterBase', () => {
    expect(filterCategory).toBeInstanceOf(FilterBase);
  });

  test('should contain category smartphones', () => {
    const expectedCategories = ['smartphones', 'laptops', 'sunglasses'];
    expect(filterCategory.getFilterFieldList(PRODUCTS_DB)).toEqual(expect.arrayContaining(expectedCategories));
  });

  test('should not contain repeated categories', () => {
    const filterLaptops = filterCategory.getFilterFieldList(PRODUCTS_DB).filter((item) => item === 'laptops');
    expect(filterLaptops.length).toEqual(1);
  });

  test('should count items per category', () => {
    const itemsTotalPerCategory = filterCategory.getProductsAmountByField(PRODUCTS_DB);
    const itemsSunglasses = itemsTotalPerCategory['sunglasses'];
    expect(itemsSunglasses).toEqual(5);
  });
});
