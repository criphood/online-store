/**
 * @jest-environment jsdom
 */

import { Search } from '../components/main/filters/search';
import { PRODUCTS_DB } from '../data/data';

describe('search methods', () => {
  const searchComponent = new Search();

  afterEach(() => {
    searchComponent.resetSearch();
  });

  test('should return default value of searchComponent', () => {
    expect(searchComponent.getSearchValue()).toEqual('');
  });

  test('should set value of searchComponent', () => {
    const testValue = 'testValue';
    searchComponent.setSearchValue(testValue);
    expect(searchComponent.getSearchValue()).toEqual(testValue);
  });

  test('should return array of items matching searchInput', () => {
    const searchValue = 'samsung';
    searchComponent.setSearchValue(searchValue);
    expect(searchComponent.searchProducts(PRODUCTS_DB).length).toEqual(2);
  });

  test('should return array of items matching searchInput in respect of letter case', () => {
    const searchValue = 'OpPo';
    searchComponent.setSearchValue(searchValue);
    expect(searchComponent.searchProducts(PRODUCTS_DB).length).toEqual(1);
  });

  test('should return array of items matching searchInput', () => {
    const searchValue = 'iphone';
    searchComponent.setSearchValue(searchValue);
    expect(searchComponent.searchProducts(PRODUCTS_DB).length).toEqual(2);
  });
});
