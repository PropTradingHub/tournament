/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCROLL.JS — Утилиты для работы со скроллом
 * Global Traders Championship | Liquid Glass Design System
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Smooth scroll, определение позиции скролла, параллакс эффекты.
 */

import { throttle, $ } from "./helpers.js";

// ═══════════════════════════════════════════════════════════════════════════
// ПОЛУЧЕНИЕ ПОЗИЦИИ СКРОЛЛА
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Возвращает текущую позицию вертикального скролла
 * @returns {number}
 */
export function getScrollY() {
  return window.scrollY || window.pageYOffset;
}

/**
 * Возвращает общую высоту документа
 * @returns {number}
 */
export function getDocumentHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
}

/**
 * Возвращает высоту viewport
 * @returns {number}
 */
export function getViewportHeight() {
  return window.innerHeight;
}

/**
 * Проверяет, достиг ли пользователь конца страницы
 * @param {number} offset - Отступ от конца (px)
 * @returns {boolean}
 */
export function isAtBottom(offset = 0) {
  return getScrollY() + getViewportHeight() >= getDocumentHeight() - offset;
}

// ═══════════════════════════════════════════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Плавный скролл к элементу
 * @param {string|Element} target - Селектор или элемент
 * @param {number} offset - Отступ сверху (например, высота хедера)
 * @param {string} behavior - 'smooth' или 'auto'
 */
export function scrollToElement(target, offset = 80, behavior = "smooth") {
  const element = typeof target === "string" ? $(target) : target;

  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + getScrollY() - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior,
  });
}

/**
 * Плавный скролл наверх
 * @param {string} behavior
 */
export function scrollToTop(behavior = "smooth") {
  window.scrollTo({
    top: 0,
    behavior,
  });
}

/**
 * Инициализирует smooth scroll для anchor-ссылок
 * @param {string} selector - Селектор ссылок (по умолчанию все внутренние #ссылки)
 * @param {number} offset - Отступ сверху
 */
export function initSmoothScroll(selector = 'a[href^="#"]', offset = 80) {
  const links = document.querySelectorAll(selector);

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Пропускаем если это просто #
      if (href === "#") return;

      const target = $(href);

      if (target) {
        e.preventDefault();
        scrollToElement(target, offset);

        // Обновляем URL (без перезагрузки)
        history.pushState(null, "", href);
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL DIRECTION DETECTION
// ═══════════════════════════════════════════════════════════════════════════

let lastScrollY = 0;
let scrollDirection = "down";
let scrollDirectionCallbacks = [];

/**
 * Определяет направление скролла
 * @returns {string} 'up' или 'down'
 */
export function getScrollDirection() {
  return scrollDirection;
}

/**
 * Инициализирует отслеживание направления скролла
 */
export function initScrollDirectionTracking() {
  const handleScroll = throttle(() => {
    const currentScrollY = getScrollY();

    if (currentScrollY > lastScrollY) {
      scrollDirection = "down";
    } else if (currentScrollY < lastScrollY) {
      scrollDirection = "up";
    }

    // Вызываем все зарегистрированные callbacks
    scrollDirectionCallbacks.forEach((cb) =>
      cb(scrollDirection, currentScrollY)
    );

    lastScrollY = currentScrollY;
  }, 50);

  window.addEventListener("scroll", handleScroll, { passive: true });
}

/**
 * Регистрирует callback на изменение направления скролла
 * @param {Function} callback - Функция (direction, scrollY) => {}
 */
export function onScrollDirectionChange(callback) {
  scrollDirectionCallbacks.push(callback);
}

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL PROGRESS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Возвращает прогресс скролла страницы (0-1)
 * @returns {number}
 */
export function getScrollProgress() {
  const scrollY = getScrollY();
  const maxScroll = getDocumentHeight() - getViewportHeight();

  if (maxScroll <= 0) return 0;

  return Math.min(Math.max(scrollY / maxScroll, 0), 1);
}

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL LOCK (для модалов)
// ═══════════════════════════════════════════════════════════════════════════

let scrollLockPosition = 0;

/**
 * Блокирует скролл страницы
 */
export function lockScroll() {
  scrollLockPosition = getScrollY();

  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollLockPosition}px`;
  document.body.style.width = "100%";
}

/**
 * Разблокирует скролл страницы
 */
export function unlockScroll() {
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";

  window.scrollTo(0, scrollLockPosition);
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTIVE SECTION DETECTION (для навигации)
// ═══════════════════════════════════════════════════════════════════════════

let activeSectionObserver = null;
let activeSectionCallback = null;

/**
 * Инициализирует определение активной секции
 * @param {string} sectionSelector - Селектор секций
 * @param {Function} callback - Callback (sectionId) => {}
 * @param {number} offset - Отступ сверху
 */
export function initActiveSectionDetection(
  sectionSelector,
  callback,
  offset = 100
) {
  activeSectionCallback = callback;

  const sections = document.querySelectorAll(sectionSelector);

  const observerOptions = {
    root: null,
    rootMargin: `-${offset}px 0px -50% 0px`,
    threshold: 0,
  };

  activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && activeSectionCallback) {
        activeSectionCallback(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    if (section.id) {
      activeSectionObserver.observe(section);
    }
  });
}

/**
 * Уничтожает observer активных секций
 */
export function destroyActiveSectionDetection() {
  if (activeSectionObserver) {
    activeSectionObserver.disconnect();
    activeSectionObserver = null;
    activeSectionCallback = null;
  }
}
