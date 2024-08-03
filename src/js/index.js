import {State} from "./state.js";
import createSwiper from "./swiper.js";
import {fetchData, setLocalCartData} from "./services.js";
import {
  fillCartList,
  fillFilterList,
  fillProductionList,
  fillProductsQuantity,
  fillSumm,
  windowToggle
} from "./dynamic-data.js";
import {addEvents} from "./events.js";

const productionState = new State([]);
const cartState = new State([]);
const openWindows = new State({
  isModal: false,
  isCart: false,
  isSort: false,
  isFilters: false,
});
const urlChangeFlag = new State(false);

// Добавление свайпера на страницу
createSwiper();

// Подписка на корзину, для обновления локальных данных
cartState.subscribe(() => setLocalCartData(cartState));

// Подписка на флаг смены url для получения верных данных с MockApi
urlChangeFlag.subscribe(() => fetchData({production: productionState, cart: cartState}));

// Подписка на модальные окна
openWindows.subscribe(() => windowToggle(openWindows));

// Заполнение динамических данных
fillFilterList(urlChangeFlag, 'catalog__filters');
fillFilterList(urlChangeFlag, 'mobile-filters');
fillProductionList({production: productionState, cart: cartState});
fillProductsQuantity(productionState, '.catalog__products-cap-quantity');
fillCartList(cartState);
fillProductsQuantity(cartState, '.header__actions-cart', false);
fillProductsQuantity(cartState, '.cart__products-cap-quantity');
fillSumm(cartState);

// Добавление обработчиков событий на элементы
addEvents([cartState, openWindows, urlChangeFlag]);

// Меняем флаг, чтобы обновить фильтры
urlChangeFlag.set(!urlChangeFlag.get());
