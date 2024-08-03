import {urlSearchUpdate} from "./services.js";

/**
 * Обработчик кнопок фильтрации
 * @param {Event} e - Ивент клика по чекбоксу
 * @param {State} state - Состояние флага изменения адресной строки
 */
export const filterCheckboxHandler = (e, state) => {
  urlSearchUpdate(e.target.name, e.target.checked);
  state.set(!state.get());
};

/**
 * Обработчик добавления товара в корзину
 * @param {number} id - ID товара
 * @param {Object} states - Объект состояний продукции и корзины
 */
export const toCartButtonHandler = (id, states) => {
  if (!states.cart.get().find((item) => item.id === id)) {
    states.cart.set([
      ...states.cart.get(),
      {...states.production.get().find((item) => item.id === id), quantity: 1, isVisible: true}
    ]);
  }
};

/**
 * Обработчик кнопки декремента количества товара в корзине
 * Обновляет значение в состоянии
 * @param {number} id - ID товара
 * @param {State} state - Состояние корзины
 */
export const cartMinusButtonHandler = (id, state) => {
  state.set([
    ...state.get().map((item) => {
      return item.id === id 
        ? {...item, quantity: item.quantity > 1 ? item.quantity - 1 : item.quantity}
        : item
    })
  ]);
};

/**
 * Обработчик кнопки инкремента количества товара в корзине
 * Обновляет значение в состоянии
 * @param {number} id - ID товара
 * @param {State} state - Состояние корзины
 */
export const cartPlusButtonHandler = (id, state) => {
  state.set([
    ...state.get().map((item) => item.id === id ? {...item, quantity: item.quantity + 1} : item),
  ]);
};

/**
 * Обработчик кнопки удаления товара в корзине
 * Делает товар не активным, а затем удаляет по таймеру
 * @param {Event} e - Ивент клика по кнопке
 * @param {number} id - ID товара
 * @param {State} state - Состояние корзины
 * @param {Function} deleteWithDelay - Функция удаляющая товар по таймеру
 */
export const cartVisibilityButtonHandler = (e, id, state, deleteWithDelay) => {
  const card = e.target.parentElement;
  const quantity = e.target.previousElementSibling;

  state.set([
    ...state.get().map((item) => item.id === id ? {...item, isVisible: !item.isVisible} : item),
  ]);
  
  card.classList.toggle('removed');
  quantity.toggleAttribute('inert');

  deleteWithDelay(id);
};
