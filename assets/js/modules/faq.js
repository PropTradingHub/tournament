/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FAQ.JS — Модуль аккордеона FAQ
 * Global Traders Championship | Liquid Glass Design System
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Аккордеон с доступностью и плавными анимациями.
 */

import { SELECTORS, CLASSES } from "../config.js";
import { $$, addClass, removeClass, toggleClass } from "../utils/helpers.js";

// ═══════════════════════════════════════════════════════════════════════════
// ИНИЦИАЛИЗАЦИЯ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Инициализирует FAQ аккордеон
 */
export function initFaq() {
  const faqItems = $$(SELECTORS.faqItems);

  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector(
      SELECTORS.faqTriggers.replace(".faq__item ", "")
    );
    const content = item.querySelector(".faq__content");

    if (!trigger || !content) return;

    // Устанавливаем начальные ARIA атрибуты
    const contentId =
      content.id || `faq-content-${Math.random().toString(36).substr(2, 9)}`;
    content.id = contentId;

    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", contentId);
    content.setAttribute("aria-hidden", "true");

    // Обработчик клика
    trigger.addEventListener("click", () => {
      toggleFaqItem(item, trigger, content);
    });

    // Обработчик клавиатуры
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFaqItem(item, trigger, content);
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// TOGGLE FAQ ITEM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Переключает состояние FAQ элемента
 * @param {Element} item - FAQ item контейнер
 * @param {Element} trigger - Кнопка-триггер
 * @param {Element} content - Контент ответа
 */
function toggleFaqItem(item, trigger, content) {
  const isOpen = item.classList.contains(CLASSES.isOpen);

  if (isOpen) {
    closeFaqItem(item, trigger, content);
  } else {
    // Опционально: закрываем другие открытые элементы
    // closeAllFaqItems();

    openFaqItem(item, trigger, content);
  }
}

/**
 * Открывает FAQ элемент
 * @param {Element} item
 * @param {Element} trigger
 * @param {Element} content
 */
function openFaqItem(item, trigger, content) {
  addClass(item, CLASSES.isOpen);
  trigger.setAttribute("aria-expanded", "true");
  content.setAttribute("aria-hidden", "false");
  content.removeAttribute("hidden");
}

/**
 * Закрывает FAQ элемент
 * @param {Element} item
 * @param {Element} trigger
 * @param {Element} content
 */
function closeFaqItem(item, trigger, content) {
  removeClass(item, CLASSES.isOpen);
  trigger.setAttribute("aria-expanded", "false");
  content.setAttribute("aria-hidden", "true");
}

/**
 * Закрывает все FAQ элементы
 */
function closeAllFaqItems() {
  const faqItems = $$(SELECTORS.faqItems);

  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq__trigger");
    const content = item.querySelector(".faq__content");

    if (trigger && content) {
      closeFaqItem(item, trigger, content);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// ПУБЛИЧНЫЙ API
// ═══════════════════════════════════════════════════════════════════════════

export { closeAllFaqItems };
