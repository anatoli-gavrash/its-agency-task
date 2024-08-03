import {refreshElement} from "./dom-actions.js";
import {fillFilterList} from "./dynamic-data.js";
import {fetchData, urlSearchUpdate} from "./services.js";

export const addEvents = ([cartState, openWindows, urlChangeFlag]) => {
  const cartButton = document.querySelector('.header__actions-cart');
  const sortButton = document.querySelector('.catalog__products-cap-sort');
  const modal = document.querySelector('.modal');
  const sortList = document.querySelector('.sort-list');
  const cartCloseButton = document.querySelector('.cart__close');
  const cartClear = document.querySelector('.cart__products-cap-clear');
  const mobileFiltersButton = document.querySelector('.catalog__products-cap-filters');

  // Подгрузка актуальных данных при движении по итории в браузере
  window.addEventListener('popstate', () => {
    fetchData({production: productionState, cart: cartState});
    fillFilterList(urlChangeFlag, 'catalog__filters');
    fillFilterList(urlChangeFlag, 'mobile-filters');
  });

  // Обработка клика по кнопке корзины в шапке сайта
  cartButton.addEventListener('click', () => {
    openWindows.set({
      ...openWindows.get(),
      isModal: true,
      isCart: true
    });
  });

  // Обработка кнопки сортировки над списком товаров
  sortButton.addEventListener('click', () => {
    openWindows.set({
      ...openWindows.get(),
      isModal: true,
      isSort: true
    });
  });

  // Зарытие всех окон при клике по тёмной зоне модального окна
  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      const newState = {...openWindows.get()}

      for (let key in newState) {
        newState[key] = false;
      }

      openWindows.set(newState);
    }
  });

  // Обработка окна фильтрации
  sortList.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-value')) {
      const newState = {...openWindows.get()}

      // Добавление параметров сортировки в адресную строку
      urlSearchUpdate('sortBy', e.target.dataset.value);
      urlSearchUpdate('order', e.target.dataset.order);
      // Изменение флага состояния, чтобы обновить данные на странице
      urlChangeFlag.set(!urlChangeFlag.get());

      // Закрытие окна сортировки и модального окна
      for (let key in newState) {
        newState[key] = false;
      }

      // Обновление состояния открытых окон
      openWindows.set(newState);

      // Обновление данных в кнопке открытия окна сортировки
      refreshElement('.catalog__products-cap-sort', {innerText: e.target.innerText});
    }
  });

  // Обработка кнопки закрытия корзины
  cartCloseButton.addEventListener('click', () => {
    openWindows.set({
      ...openWindows.get(),
      isModal: false,
      isCart: false
    });
  });

  // Обработка кнопки очищения корзины
  cartClear.addEventListener('click', () => {
    cartState.set([]);
  });

  // Обработка кнопки открытия фильтров на мобильной версии
  mobileFiltersButton.addEventListener('click', () => {
    openWindows.set({
      ...openWindows.get(),
      isModal: true,
      isFilters: true
    });
  });
};
