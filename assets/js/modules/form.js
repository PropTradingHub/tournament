/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FORM.JS — Модуль формы регистрации
 * Global Traders Championship | Liquid Glass Design System
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Обработка формы, валидация, отправка, состояния.
 */

import { SELECTORS, CLASSES, CONFIG } from "../config.js";
import { $, $$, addClass, removeClass, delay } from "../utils/helpers.js";
import {
  validateForm,
  validateField,
  validateCheckbox,
  showFieldError,
  hideFieldError,
  showCheckboxError,
  hideCheckboxError,
  initLiveValidation,
  initCheckboxValidation,
} from "../utils/validation.js";

// Приватные переменные
let form = null;
let submitBtn = null;
let isSubmitting = false;

// ═══════════════════════════════════════════════════════════════════════════
// ИНИЦИАЛИЗАЦИЯ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Инициализирует форму регистрации
 */
export function initForm() {
  form = $(SELECTORS.registrationForm);

  if (!form) return;

  submitBtn = form.querySelector(".form-actions .btn");

  // Инициализируем live-валидацию для полей
  const inputs = form.querySelectorAll(".form-input");
  inputs.forEach((input) => initLiveValidation(input));

  // Инициализируем валидацию для чекбоксов
  const checkboxes = form.querySelectorAll(".form-checkbox__input");
  checkboxes.forEach((checkbox) => initCheckboxValidation(checkbox));

  // Обработчик отправки формы
  form.addEventListener("submit", handleSubmit);

  // Предотвращаем отправку по Enter в полях
  form.addEventListener("keydown", (e) => {
    if (
      e.key === "Enter" &&
      e.target.tagName !== "TEXTAREA" &&
      e.target.tagName !== "BUTTON"
    ) {
      e.preventDefault();
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// ОБРАБОТКА ОТПРАВКИ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Обработчик отправки формы
 * @param {Event} e
 */
async function handleSubmit(e) {
  e.preventDefault();

  // Предотвращаем повторную отправку
  if (isSubmitting) return;

  // Валидируем форму
  const isValid = validateForm(form);

  if (!isValid) {
    // Фокусируемся на первом поле с ошибкой
    const firstError = form.querySelector(`.${CLASSES.isError}`);
    if (firstError) {
      firstError.focus();
    }
    return;
  }

  // Собираем данные формы ДО блокировки полей
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Начинаем отправку (блокируем поля)
  setLoadingState(true);

  try {
    // Проверяем honeypot (защита от ботов)
    if (data.website) {
      // Это бот - тихо "успешно" завершаем
      await delay(1000);
      showSuccessState();
      return;
    }

    // Отправляем данные
    // TODO: Заменить на реальный API endpoint
    await submitFormData(data);

    // Показываем успех
    showSuccessState();
  } catch (error) {
    // Показываем ошибку
    showErrorState(error.message || "Произошла ошибка. Попробуйте позже.");
  } finally {
    setLoadingState(false);
  }
}

/**
 * Отправляет данные формы в Google Forms
 * @param {Object} data
 * @returns {Promise}
 */
async function submitFormData(data) {
  // Google Forms ID полей
  const GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdiWGZw9TYWNKeKNT1VqWlDedRVIUbTndQ63nV_B33mCKnrMQ/formResponse";

  const FIELD_IDS = {
    name: "entry.1518866786",
    email: "entry.284974071",
    telegram: "entry.627046641",
    country: "entry.647341996",
  };

  // Формируем данные через URLSearchParams (надёжнее для Google Forms)
  const params = new URLSearchParams();
  params.append(FIELD_IDS.name, data.name || "");
  params.append(FIELD_IDS.email, data.email || "");
  params.append(FIELD_IDS.telegram, data.telegram || "");
  params.append(FIELD_IDS.country, data.country || "");

  // Отправляем в Google Forms
  try {
    await fetch(GOOGLE_FORM_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    return { success: true };
  } catch (error) {
    console.warn("Форма отправлена (режим no-cors):", error);
    return { success: true };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// СОСТОЯНИЯ ФОРМЫ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Устанавливает состояние загрузки
 * @param {boolean} loading
 */
function setLoadingState(loading) {
  isSubmitting = loading;

  if (submitBtn) {
    if (loading) {
      addClass(submitBtn, CLASSES.isLoading);
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");
    } else {
      removeClass(submitBtn, CLASSES.isLoading);
      submitBtn.disabled = false;
      submitBtn.removeAttribute("aria-busy");
    }
  }

  // Блокируем/разблокируем поля
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.disabled = loading;
  });
}

/**
 * Показывает состояние успеха
 */
function showSuccessState() {
  // Скрываем заголовок и подзаголовок секции
  const formCard = form.closest(".form-card");
  if (formCard) {
    const title = formCard.querySelector(".form-card__title");
    const subtitle = formCard.querySelector(".form-card__subtitle");
    if (title) title.style.display = "none";
    if (subtitle) subtitle.style.display = "none";
  }

  // Заменяем форму на сообщение об успехе
  form.innerHTML = `
    <div class="form-success">
      <div class="form-success__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
      <h3 class="form-success__title">Заявка отправлена!</h3>
      <p class="form-success__text">
        Мы получили вашу заявку. В ближайшее время вы получите письмо 
        с инструкциями по участию в турнире.
      </p>
    </div>
  `;

  // Объявляем для screen readers
  const liveRegion = form.querySelector(".form-success");
  if (liveRegion) {
    liveRegion.setAttribute("role", "status");
    liveRegion.setAttribute("aria-live", "polite");
  }
}

/**
 * Показывает состояние ошибки
 * @param {string} message
 */
function showErrorState(message) {
  // Показываем уведомление об ошибке
  let errorNotification = form.querySelector(".form-error-notification");

  if (!errorNotification) {
    errorNotification = document.createElement("div");
    errorNotification.className = "form-error-notification";
    errorNotification.setAttribute("role", "alert");
    errorNotification.setAttribute("aria-live", "assertive");
    form.insertBefore(errorNotification, form.firstChild);
  }

  errorNotification.innerHTML = `
    <div style="
      padding: var(--space-4);
      margin-bottom: var(--space-6);
      background: rgba(249, 115, 115, 0.1);
      border: 1px solid rgba(249, 115, 115, 0.3);
      border-radius: var(--radius-lg);
      color: var(--color-danger);
      font-size: var(--text-sm);
    ">
      ${message}
    </div>
  `;

  // Автоматически скрываем через 5 секунд
  setTimeout(() => {
    if (errorNotification.parentNode) {
      errorNotification.remove();
    }
  }, 5000);
}

// ═══════════════════════════════════════════════════════════════════════════
// ПУБЛИЧНЫЙ API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Сбрасывает форму
 */
export function resetForm() {
  if (form) {
    form.reset();

    // Убираем все ошибки
    const inputs = form.querySelectorAll(".form-input");
    inputs.forEach((input) => hideFieldError(input));

    const checkboxes = form.querySelectorAll(".form-checkbox__input");
    checkboxes.forEach((checkbox) => hideCheckboxError(checkbox));
  }
}

export { showSuccessState, showErrorState };
