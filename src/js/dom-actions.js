/**
 * Создание элемента в DOM
 * @param {string} tag - Имя тэга
 * @param {Object} attributes - Объект с атрибутами
 * @param {Array} children - Массив детей для добавления в созданный элемент
 * @return {HTMLElement}
 */
const createElement = (tag, attributes = {}, children = []) => {
  const element = document.createElement(tag);
  const exceptions = new Set(['innerText', 'onclick']);

  for (let [key, value] of Object.entries(attributes)) {
    if (exceptions.has(key)) {
      element[key] = value;
      continue;
    }

    element.setAttribute(key, value);
  }

  for (let child of children) {
    element.appendChild(child);
  }

  return element;
};

/**
 * Обновляет существующий элемент в DOM
 * @param {string | HTMLElement} element - Селектор для поиска или HTMLElement
 * @param {Object} attributes - Объект с атрибутами
 */
const refreshElement = (element, attributes = {}) => {
  const exceptions = new Set(['innerText', 'onclick']);
  
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }


  if (element) {
    for (let [key, value] of Object.entries(attributes)) {
      if (exceptions.has(key)) {
        element[key] = value;
        continue;
      }
  
      el.setAttribute(key, value);
    }
  }
};

/**
 * Переключатель классов
 * @param {string} selector - Селектор для поиска
 * @param {string} className - Имя класса добавления/удаления
 * @param {boolean} isTrue - Условие, по которому будет определяться действие
 */
const classToggle = (selector, className, isTrue) => {
  const element = document.querySelector(selector);
  
  if (isTrue) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
};

/**
 * Переключатель классов
 * @param {string} selector - Селектор для поиска
 * @param {string} attributeName - Имя атрибута добавления/удаления
 * @param {boolean} isTrue - Условие, по которому будет определяться действие
 */
const attributeToggle = (selector, attributeName, isTrue) => {
  const element = document.querySelector(selector);
  
  if (isTrue) {
    element.setAttribute(attributeName, 'true');
  } else {
    element.removeAttribute(attributeName);
  }
};

export {createElement, refreshElement, classToggle, attributeToggle};
