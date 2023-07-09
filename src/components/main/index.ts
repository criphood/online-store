import { MainRender } from './catalogue/index';
import { Loader } from './catalogue/loader';
import { IApiResponse, IProductItem } from './interface/Iproducts';
import { clearContent } from '../../router/router';
import { cartButton } from '../cart/cart-icon/icon';
import { loadCartPage } from '../cart';
import { getSelector, parseQuery } from '../../functions/utils';
import { showTotalCost } from '../cart/local-storage/cart-storage';
import { Preloader } from '../main/preloader/preloader';

class MainPage extends Loader {
  title = 'Online Store';
  constructor() {
    super('https://dummyjson.com/products?limit=100');
    document.title = this.title;
  }
  loadPage() {
    clearContent();

    const preloader = new Preloader();
    preloader.setPreloader();

    this.fetchData(this.baseLink)
      .then((data: IApiResponse) => data.products)
      .then((products: IProductItem[]) => {
        const element = document.querySelector('.main-content') as HTMLElement;

        preloader.removePreloader();

        const mainContent = new MainRender(element);
        mainContent.load(products);

        const paramObj = parseQuery();
        mainContent.filters.setFilterStateFromQuery(products, paramObj);

        showTotalCost();
      });
  }
}

const loadMainPage = new MainPage(),
  homePage = getSelector(document, '.header__container-home');

homePage.onclick = () => {
  clearContent();
  history.pushState({}, '', '/');
  loadMainPage.loadPage();
};

cartButton.addEventListener('click', () => {
  history.pushState({}, '', '/cart');
  loadCartPage.loadPage();
});

export { loadMainPage };
