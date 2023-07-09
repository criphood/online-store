import { loadMainPage } from '../components/main/index';
import { loadErrorPage } from '../components/error-page';
import { loadProductPage } from '../components/product-details';
import { loadCartPage } from '../components/cart';
import { PRODUCTS_DB } from '../data/data';
import { showTotalCost } from '../components/cart/local-storage/cart-storage';

const route = (event: Event) => {
  event = event || window.event;
  event.preventDefault();
  handleLocation();
};

const routes: Routes = {
  '/': () => loadMainPage.loadPage(),
  '/cart': () => loadCartPage.loadPage(PRODUCTS_DB),
};

const handleLocation = async () => {
  const path: string = window.location.pathname,
    route = routes[path];

  if (!route) {
    loadErrorPage.loadPage();
  } else {
    route();
  }
};

const clearContent = () => {
  const children = document.querySelector('.main-content')?.childNodes,
    modal = document.querySelector('.modal');

  children?.forEach((item) => {
    item.remove();
  });

  modal?.remove();
};

PRODUCTS_DB.forEach((item) => {
  routes[`/product-${+item.id}`] = () => loadProductPage.renderItem(PRODUCTS_DB, +item.id);
});

window.addEventListener('popstate', () => {
  clearContent();
  handleLocation();
});

handleLocation();

export { clearContent, route, handleLocation };
