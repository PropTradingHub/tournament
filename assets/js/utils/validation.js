/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VALIDATION.JS — Валидация форм
 * Global Traders Championship | Liquid Glass Design System
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Функции валидации для формы регистрации.
 */

import { VALIDATION_MESSAGES, CLASSES } from "../config.js";
import { addClass, removeClass, $ } from "./helpers.js";
import { shakeElement } from "./animations.js";

// ═══════════════════════════════════════════════════════════════════════════
// ВАЛИДАТОРЫ ОТДЕЛЬНЫХ ПОЛЕЙ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Проверяет обязательное поле
 * @param {string} value
 * @returns {boolean}
 */
export function isRequired(value) {
  return (
    value !== null && value !== undefined && value.toString().trim() !== ""
  );
}

/**
 * Проверяет email
 * @param {string} value
 * @returns {boolean}
 */
export function isEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Проверяет Telegram username
 * @param {string} value
 * @returns {boolean}
 */
export function isTelegram(value) {
  // Telegram username: начинается с @, 5-32 символа, буквы, цифры, _
  const telegramRegex = /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/;
  return telegramRegex.test(value);
}

/**
 * Проверяет минимальную длину
 * @param {string} value
 * @param {number} min
 * @returns {boolean}
 */
export function minLength(value, min) {
  return value.length >= min;
}

/**
 * Проверяет максимальную длину
 * @param {string} value
 * @param {number} max
 * @returns {boolean}
 */
export function maxLength(value, max) {
  return value.length <= max;
}

// ═══════════════════════════════════════════════════════════════════════════
// ВАЛИДАЦИЯ КОНКРЕТНЫХ ПОЛЕЙ ФОРМЫ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Валидирует поле и возвращает сообщение об ошибке
 * @param {HTMLInputElement} input
 * @returns {string|null} - Сообщение об ошибке или null если валидно
 */
export function validateField(input) {
  const value = input.value.trim();
  const type = input.type;
  const name = input.name;
  const required = input.hasAttribute("required");

  // Проверка обязательности
  if (required && !isRequired(value)) {
    return VALIDATION_MESSAGES.required;
  }

  // Если поле пустое и не обязательное — валидно
  if (!value && !required) {
    return null;
  }

  // Проверка по типу поля
  switch (type) {
    case "email":
      if (!isEmail(value)) {
        return VALIDATION_MESSAGES.email;
      }
      break;
  }

  // Проверка по имени поля
  switch (name) {
    case "telegram":
      if (value && !isTelegram(value)) {
        return VALIDATION_MESSAGES.telegram;
      }
      break;

    case "name":
    case "nickname":
      if (!minLength(value, 2)) {
        return VALIDATION_MESSAGES.minLength(2);
      }
      if (!maxLength(value, 50)) {
        return VALIDATION_MESSAGES.maxLength(50);
      }
      break;
  }

  return null; // Валидно
}

/**
 * Валидирует checkbox
 * @param {HTMLInputElement} checkbox
 * @returns {string|null}
 */
export function validateCheckbox(checkbox) {
  if (checkbox.hasAttribute("required") && !checkbox.checked) {
    return VALIDATION_MESSAGES.checkbox;
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// ОТОБРАЖЕНИЕ ОШИБОК
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Показывает ошибку для поля
 * @param {HTMLInputElement} input
 * @param {string} message
 */
export function showFieldError(input, message) {
  // Добавляем класс ошибки
  addClass(input, CLASSES.isError);

  // Устанавливаем aria-атрибуты
  input.setAttribute("aria-invalid", "true");

  // Находим контейнер ошибки
  const errorContainer =
    $(`#${input.id}-error`) || input.parentElement.querySelector(".form-error");

  if (errorContainer) {
    errorContainer.textContent = message;
  }

  // Анимация shake
  shakeElement(input);
}

/**
 * Скрывает ошибку для поля
 * @param {HTMLInputElement} input
 */
export function hideFieldError(input) {
  // Убираем класс ошибки
  removeClass(input, CLASSES.isError);

  // Убираем aria-атрибуты
  input.removeAttribute("aria-invalid");

  // Очищаем контейнер ошибки
  const errorContainer =
    $(`#${input.id}-error`) || input.parentElement.querySelector(".form-error");

  if (errorContainer) {
    errorContainer.textContent = "";
  }
}

/**
 * Показывает ошибку для checkbox
 * @param {HTMLInputElement} checkbox
 * @param {string} message
 */
export function showCheckboxError(checkbox, message) {
  const container = checkbox.closest(".form-checkbox");

  if (container) {
    addClass(container, CLASSES.isError);
  }

  checkbox.setAttribute("aria-invalid", "true");

  // Находим контейнер ошибки
  const errorContainer = container?.querySelector(".form-error");

  if (errorContainer) {
    errorContainer.textContent = message;
  }
}

/**
 * Скрывает ошибку для checkbox
 * @param {HTMLInputElement} checkbox
 */
export function hideCheckboxError(checkbox) {
  const container = checkbox.closest(".form-checkbox");

  if (container) {
    removeClass(container, CLASSES.isError);
  }

  checkbox.removeAttribute("aria-invalid");

  const errorContainer = container?.querySelector(".form-error");

  if (errorContainer) {
    errorContainer.textContent = "";
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ВАЛИДАЦИЯ ВСЕЙ ФОРМЫ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Валидирует всю форму
 * @param {HTMLFormElement} form
 * @returns {boolean} - true если форма валидна
 */
export function validateForm(form) {
  let isValid = true;

  // Валидируем все inputs
  const inputs = form.querySelectorAll(".form-input");
  inputs.forEach((input) => {
    const error = validateField(input);

    if (error) {
      showFieldError(input, error);
      isValid = false;
    } else {
      hideFieldError(input);
    }
  });

  // Валидируем все checkboxes
  const checkboxes = form.querySelectorAll(".form-checkbox__input");
  checkboxes.forEach((checkbox) => {
    const error = validateCheckbox(checkbox);

    if (error) {
      showCheckboxError(checkbox, error);
      isValid = false;
    } else {
      hideCheckboxError(checkbox);
    }
  });

  return isValid;
}

// ═══════════════════════════════════════════════════════════════════════════
// LIVE VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Инициализирует live-валидацию для поля
 * @param {HTMLInputElement} input
 */
export function initLiveValidation(input) {
  // Валидация при потере фокуса
  input.addEventListener("blur", () => {
    const error = validateField(input);

    if (error) {
      showFieldError(input, error);
    } else {
      hideFieldError(input);
    }
  });

  // Убираем ошибку при вводе
  input.addEventListener("input", () => {
    if (input.classList.contains(CLASSES.isError)) {
      hideFieldError(input);
    }
  });
}

/**
 * Инициализирует live-валидацию для checkbox
 * @param {HTMLInputElement} checkbox
 */
export function initCheckboxValidation(checkbox) {
  checkbox.addEventListener("change", () => {
    const error = validateCheckbox(checkbox);

    if (error) {
      showCheckboxError(checkbox, error);
    } else {
      hideCheckboxError(checkbox);
    }
  });
}
