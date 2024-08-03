import {attributeToggle, classToggle, createElement, refreshElement} from "./dom-actions.js";
import {convertNumberToPrice, isPlural} from "./utils.js";
import {
  cartMinusButtonHandler,
  cartPlusButtonHandler,
  cartVisibilityButtonHandler,
  filterCheckboxHandler,
  toCartButtonHandler
} from "./handlers.js";

/**
 * Заполнение полей количества товаров продукции и корзины
 * @param {State} state - Состояние флага адресной строки
 * @param {string} className - Селектор для поиска
 */
export const fillFilterList = (state, className) => {
  const search = new URLSearchParams(window.location.search);
  const filterList = document.querySelector(`.${className}`);
  const filters = [
    {name: 'isNew', text: 'Новинки'},
    {name: 'isAvailable', text: 'Есть в наличии'},
    {name: 'isContracts', text: 'Контрактные'},
    {name: 'isExclusive', text: 'Эксклюзивные'},
    {name: 'isSale', text: 'Распродажа'}
  ];

  filterList.innerHTML = '';

  filters.forEach((filter) => {
    filterList.append(
      createElement('label', {class: `${className}-label`}, [
        createElement('input', {
          class: `${className}-label-input`,
          type: 'checkbox',
          name: filter.name,
          ...(search.get(filter.name) ? {checked: true} : {}),
          onclick: (e) => filterCheckboxHandler(e, state)
        }),
        createElement('div', {class: `${className}-label-marker`}),
        createElement('span', {class: `${className}-label-span`, innerText: filter.text})
      ])
    );
  });
};

/**
 * Заполнение списка товаров
 * @param {State} states - Состояния продукции и корзины
 */
export const fillProductionList = (states) => {
  const productionListElement = document.querySelector('.catalog__products-list');

  const listener = (states) => {
    productionListElement.innerHTML = '';

    states.production.get().forEach(({id, name, image, price}) => {
      productionListElement.append(
        createElement('li', {class: 'catalog__products-list-card catalog-card', id: `catalog-id-${id}`}, [
          createElement('img', {class: 'catalog-card__image', src: image, alt: name}),
          createElement('h3', {class: 'catalog-card__title', innerText: name}),
          createElement('div', {class: 'catalog-card__bottom'}, [
            createElement('p', {class: 'catalog-card__bottom-price', innerText: convertNumberToPrice(price)}),
            createElement('button', {
              class: 'catalog-card__bottom-button',
              type: 'button',
              innerText: '+',
              onclick: () => toCartButtonHandler(id, states)
            })
          ])
        ])
      );
    });
  };

  // Подписка на состояние продукции для динамического обновления
  states.production.subscribe(() => listener(states));
};

/**
 * Заполнение корзины с товарами
 * @param {State} state - Состояние корзины
 */
export const fillCartList = (state) => {
  const cartListElement = document.querySelector('.cart__products-list');
  let timerId = null;
  
  /**
   * Обновление счетчика товара
   * @param {number} id - ID товара
   */
  const refreshQuantity = (id) => {
    refreshElement(`#cart-id-${id} .cart-card__quantity-value`,
      {innerText: state.get().find((item) => item.id === id).quantity}
    );
  };
  
  /**
   * Удаление товара с задержкой
   * @param {number} id - ID товара
   */
  const deleteWithDelay = (id) => {
    if (state.get().find(((item) => item.id === id)).isVisible) {
      clearTimeout(timerId);
      timerId = null;
    } else {
      if (!timerId) {
        timerId = setTimeout(() => {
          state.set([...state.get().filter((item) => item.id !== id)]);
          
          clearTimeout(timerId);
          timerId = null;
        }, 3000);
      }
    }
  };
  
  const listener = (state) => {
    cartListElement.innerHTML = '';

    state.get().forEach(({id, name, image, price, quantity, isVisible}) => {
      cartListElement.append(
        createElement('li', {class: `cart__products-list-card cart-card${isVisible ? '' : ' removed'}`, id: `cart-id-${id}`}, [
          createElement('img', {class: 'cart-card__image', src: image, alt: name}),
          createElement('div', {class: 'cart-card__data'}, [
            createElement('h4', {class: 'cart-card__data-title', innerText: name}),
            createElement('p', {class: 'cart-card__data-price', innerText: convertNumberToPrice(price)})
          ]),
          createElement('div', {
            class: 'cart-card__quantity',
            ...(isVisible ? {} : (() => {deleteWithDelay(id); return {inert: true}})())
          }, [
            createElement('button', {
              class: 'cart-card__quantity-minus',
              type: 'button',
              onclick: () => {
                cartMinusButtonHandler(id, state);
                refreshQuantity(id);
              }
            }),
            createElement('p', {class: 'cart-card__quantity-value', type: 'button', innerText: quantity}),
            createElement('button', {
              class: 'cart-card__quantity-plus',
              type: 'button',
              onclick: () => {
                cartPlusButtonHandler(id, state);
                refreshQuantity(id);
              }
            })
          ]),
          createElement('div', {
            class: 'cart-card__remove',
            type: 'button',
            onclick: (e) => cartVisibilityButtonHandler(e, id, state, deleteWithDelay)
          })
        ])
      );
    });
  };

  // Подписка на состояние продукции для динамического обновления
  state.subscribe(() => listener(state));
};

/**
 * Заполнение полей количества товаров продукции и корзины
 * @param {State} state - Состояние продукции или корзины
 */
export const fillProductsQuantity = (state, selector, isText = true) => {
  const listener = () => {
    // В зависимости количества добавляем разное окончание
    const text = isText ? ` Товар${isPlural(state.get().length) ? 'а' : 'ов'}` : '';

    refreshElement(selector, {innerText: `${state.get().length}${text}`});
  };

  state.subscribe(listener);
};

/**
 * Подсчет суммы всех товаров в корзине
 * @param {State} state - Состояние корзины
 */
export const fillSumm = (state) => {
  const listener = () => {
    const items = state.get().filter((item) => item.isVisible);
    const summ = items.reduce((summ, item) => summ += item.price * item.quantity, 0);
    
    refreshElement('.cart__order-total-summ', {innerText: convertNumberToPrice(summ, 0, 0, true)});
  };

  state.subscribe(listener);
};

/**
 * Переключатель модальных окон
 * @param {State} state - Состояние модальных окон
 */
export const windowToggle = (state) => {
  // В зависимости от состояния показываются или скрываются окна
  classToggle('body', 'hidden', state.get().isModal);
  classToggle('.modal', 'show', state.get().isModal);
  attributeToggle('.modal', 'inert', !state.get().isModal);
  attributeToggle('.header', 'inert', state.get().isModal);
  attributeToggle('.main', 'inert', state.get().isModal);

  classToggle('.sort-list', 'show', state.get().isSort);
  attributeToggle('.sort-list', 'inert', !state.get().isSort);

  classToggle('.cart', 'show', state.get().isCart);
  attributeToggle('.cart', 'inert', !state.get().isCart);

  classToggle('.mobile-filters', 'show', state.get().isFilters);
  attributeToggle('.mobile-filters', 'inert', !state.get().isFilters);
};
