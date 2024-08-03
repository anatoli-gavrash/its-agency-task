/**
 * Преобразование числа в цену
 * @param {number} number - Число для конвертации
 * @param {number} fractionMin - Минимальная длина дробной части
 * @param {number} fractionMax - Максимальная длина дробной части
 * @param {boolean} isGrouping - Разделение числа на группы
 */
export const convertNumberToPrice = (number, fractionMin = 0, fractionMax = 0, isGrouping = false) => {
  return number.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: fractionMin,
    maximumFractionDigits: fractionMax,
    useGrouping: isGrouping
  });
};

/**
 * Проверка на множественное число, при подсчете количества
 * @param {number} count - Количество
 */
export function isPlural(count) {
  const unit = count % 10;
  const ten = count % 100;

  if ((unit >= 2 && unit <= 4) && (ten < 12 || ten > 14)) {
     return true;
  }

  return false;
};
