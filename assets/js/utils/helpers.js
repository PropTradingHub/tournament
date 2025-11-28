/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HELPERS.JS — Вспомогательные утилиты
 * Global Traders Championship | Liquid Glass Design System
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Debounce, throttle, форматирование чисел и другие общие функции.
 */

// ═══════════════════════════════════════════════════════════════════════════
// DEBOUNCE — Выполнить функцию после паузы
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Создаёт debounced версию функции
 * @param {Function} fn - Функция для debounce
 * @param {number} delay - Задержка в мс
 * @returns {Function}
 */
export function debounce(fn, delay = 150) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// THROTTLE — Выполнять функцию не чаще чем раз в N мс
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Создаёт throttled версию функции
 * @param {Function} fn - Функция для throttle
 * @param {number} limit - Минимальный интервал в мс
 * @returns {Function}
 */
export function throttle(fn, limit = 100) {
  let inThrottle = false;

  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ФОРМАТИРОВАНИЕ ЧИСЕЛ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Форматирует число как валюту (USD)
 * @param {number} value - Число
 * @returns {string}
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Форматирует число как процент со знаком
 * @param {number} value - Число
 * @param {number} decimals - Количество знаков после запятой
 * @returns {string}
 */
export function formatPercent(value, decimals = 2) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Форматирует большие числа (1000 -> 1K, 1000000 -> 1M)
 * @param {number} value - Число
 * @returns {string}
 */
export function formatCompact(value) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}

// ═══════════════════════════════════════════════════════════════════════════
// РАБОТА С КЛАССАМИ CSS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Проверяет наличие CSS класса
 * @param {Element} element
 * @param {string} className
 * @returns {boolean}
 */
export function hasClass(element, className) {
  return element.classList.contains(className);
}

/**
 * Добавляет CSS класс
 * @param {Element} element
 * @param {string} className
 */
export function addClass(element, className) {
  element.classList.add(className);
}

/**
 * Удаляет CSS класс
 * @param {Element} element
 * @param {string} className
 */
export function removeClass(element, className) {
  element.classList.remove(className);
}

/**
 * Переключает CSS класс
 * @param {Element} element
 * @param {string} className
 * @param {boolean} force - Опционально: true = добавить, false = удалить
 */
export function toggleClass(element, className, force) {
  element.classList.toggle(className, force);
}

// ═══════════════════════════════════════════════════════════════════════════
// УТИЛИТЫ DOM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Короткий селектор querySelector
 * @param {string} selector
 * @param {Element} parent
 * @returns {Element|null}
 */
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Короткий селектор querySelectorAll
 * @param {string} selector
 * @param {Element} parent
 * @returns {NodeList}
 */
export function $$(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

// ═══════════════════════════════════════════════════════════════════════════
// ПРОВЕРКА УСТРОЙСТВ И БРАУЗЕРОВ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Проверяет, предпочитает ли пользователь reduced motion
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Проверяет, является ли устройство мобильным
 * @returns {boolean}
 */
export function isMobile() {
  return window.innerWidth < 768;
}

/**
 * Проверяет, является ли устройство планшетом
 * @returns {boolean}
 */
export function isTablet() {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Проверяет, является ли устройство десктопом
 * @returns {boolean}
 */
export function isDesktop() {
  return window.innerWidth >= 1024;
}

/**
 * Проверяет поддержку backdrop-filter
 * @returns {boolean}
 */
export function supportsBackdropFilter() {
  return CSS.supports("backdrop-filter", "blur(1px)");
}

// ═══════════════════════════════════════════════════════════════════════════
// ГЕНЕРАЦИЯ УНИКАЛЬНЫХ ID
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Генерирует уникальный ID
 * @param {string} prefix - Префикс ID
 * @returns {string}
 */
export function generateId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// ЗАДЕРЖКИ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Промис-обёртка для setTimeout
 * @param {number} ms - Миллисекунды
 * @returns {Promise}
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════════════════
// CLIPBOARD
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Копирует текст в буфер обмена
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// РАБОТА С URL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Получает параметр из URL
 * @param {string} name - Имя параметра
 * @returns {string|null}
 */
export function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/**
 * Получает hash из URL (без #)
 * @returns {string}
 */
export function getHash() {
  return window.location.hash.slice(1);
}
