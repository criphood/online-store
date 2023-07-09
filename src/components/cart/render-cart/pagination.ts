import { getSelector } from '../../../functions/utils';
import { cartStatement, setState } from '../local-storage/cart-storage';
import { addAmountChangers } from './amountChangers';
import { paginationData } from './renderCart';
import { parseQuery } from '../../../functions/utils';

export function paginate() {
  const currentPageDiv = getSelector(document, '.page__current'),
    forwardButton = getSelector(document, '.page__forward'),
    backButton = getSelector(document, '.page__back'),
    amountItemsInput = document.querySelector('.items__amount-num'),
    productsOnScreen = getSelector(document, '.cart__inner'),
    paramsObj = parseQuery(),
    limit = +paramsObj.limit || cartStatement.itemsPerPage;

  let currentPage = +paramsObj.page || cartStatement.currentPage;

  currentPageDiv.innerHTML = currentPage.toString();

  if (amountItemsInput instanceof HTMLInputElement) {
    amountItemsInput.value = limit.toString();
    amountItemsInput.addEventListener('change', () => {
      cartStatement.itemsPerPage = +amountItemsInput.value;
      displayList(paginationData, cartStatement.itemsPerPage, currentPage);
      setState();
      setQuery();
    });
  }

  displayList(paginationData, limit, currentPage);

  forwardButton.addEventListener('click', () => {
    currentPage++;
    displayOtherPage();
    setQuery();
  });

  backButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayOtherPage();
      setQuery();
    }
  });

  function displayList(data: HTMLDivElement[], rowPerPage: number, page: number) {
    productsOnScreen.innerHTML = '';
    page--;

    const start = rowPerPage * page,
      end = start + rowPerPage,
      paginatedData = data.slice(start, end);

    if (paginatedData.length === 0) {
      currentPage--;
      displayOtherPage();
      setQuery();
    }

    paginatedData.forEach((item) => {
      productsOnScreen.append(item);
    });

    addAmountChangers();
  }

  function displayOtherPage() {
    currentPageDiv.innerHTML = currentPage.toString();
    cartStatement.currentPage = currentPage;
    setState();
    displayList(paginationData, cartStatement.itemsPerPage, currentPage);
  }

  function setQuery() {
    if (window.location.href.includes('cart')) {
      const url = new URL(window.location.href);
      url.searchParams.set('page', cartStatement.currentPage.toString());
      url.searchParams.set('limit', cartStatement.itemsPerPage.toString());
      history.pushState({}, '', url.search);
    }
  }
}
