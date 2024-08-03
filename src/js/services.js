/**
 * @param {string} key - Ключ в localStorage
 * @return {any}
 */
const getLocalData = (key = '') => {
  return JSON.parse(localStorage.getItem(key));
};

/**
 * @param {string} key - Ключ в localStorage
 * @param {any} data - Любой тип данных для добавления в localStorage
 */
const setLocalData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * @param {State} state - Объект с состоянием продуктов
 */
const setLocalCartData = (state) => {
  setLocalData('cart', state.get().map((item) => [item.id, item.quantity, item.isVisible]));
};

const getPaints = async () => {
  const sort = window.location.search;
  const url = new URL(`https://66a1261d7053166bcabe27e1.mockapi.io/api/paints${sort ? sort : ''}`);

  try {
    const data = await fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })

    return data.ok ? data.json() : [];
  } catch (error) {
    console.log('Ошибка при запросе:', error);
  }
};

/**
 * @param {Array} ids - ID массив для точечного запроса данных с MockApi
 */
const getPaintsById = async (ids = []) => {
  const requests = ids.map((id) => fetch(`https://66a1261d7053166bcabe27e1.mockapi.io/api/paints?id=${id}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  }));

  try {
    const responses = await Promise.all(requests);
    const data = await Promise.all(responses.map((res) => res.json()));
    
    return data.map((item) => item[0]);
  } catch (error) {
    console.log('Ошибка при запросе:', error);
  }
};

/**
 * @param {Object} states - Объект с состояниями продуктов и корзины
 */
const fetchData = async (states) => {
  const localData = getLocalData('cart') || [];
  const localDataIds = localData.map(([id]) => id);

  states.production.set(await getPaints());

  // Получение данных по id и объединение с данными из localStorage
  states.cart.set((await getPaintsById(localDataIds)).map((item) => {
    const [, quantity, isVisible] = localData.find(([id]) => id === item.id);
    return {...item, quantity, isVisible};
  }));
};

/**
 * @param {string} key - Параметр поискового запроса
 * @param {string} value - Значение поискового запроса
 */
const urlSearchUpdate = (key, value) => {
  const url = new URL(window.location);

  //Удаляем параметр, если значение не передано
  value ? url.searchParams.set(key, value) : url.searchParams.delete(key);

  window.history.pushState(null, null, url);
};

export {setLocalCartData, fetchData, urlSearchUpdate};
