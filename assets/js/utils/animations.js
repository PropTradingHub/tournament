/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANIMATIONS.JS — Утилиты для анимаций
 * Global Traders Championship | Liquid Glass Design System
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Scroll-reveal анимации через Intersection Observer.
 */

import { CONFIG, SELECTORS, CLASSES } from "../config.js";
import { prefersReducedMotion, $$ } from "./helpers.js";

// ═══════════════════════════════════════════════════════════════════════════
// INTERSECTION OBSERVER ДЛЯ SCROLL-АНИМАЦИЙ
// ═══════════════════════════════════════════════════════════════════════════

let scrollObserver = null;

/**
 * Инициализирует scroll-анимации для элементов с [data-aos]
 */
export function initScrollAnimations() {
  // Не запускаем если пользователь предпочитает reduced motion
  if (prefersReducedMotion()) {
    // Сразу показываем все элементы без анимации
    const elements = $$(SELECTORS.aosElements);
    elements.forEach((el) => el.classList.add(CLASSES.aosAnimate));
    return;
  }

  // Настройки Observer
  const observerOptions = {
    root: null, // viewport
    rootMargin: `0px 0px -${CONFIG.AOS_OFFSET}px 0px`,
    threshold: 0.1,
  };

  // Callback при пересечении
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Добавляем класс анимации
        entry.target.classList.add(CLASSES.aosAnimate);

        // Прекращаем наблюдение (анимация один раз)
        scrollObserver.unobserve(entry.target);
      }
    });
  };

  // Создаём Observer
  scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

  // Наблюдаем за всеми [data-aos] элементами
  const elements = $$(SELECTORS.aosElements);
  elements.forEach((el) => scrollObserver.observe(el));
}

/**
 * Уничтожает Observer (для cleanup)
 */
export function destroyScrollAnimations() {
  if (scrollObserver) {
    scrollObserver.disconnect();
    scrollObserver = null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// STAGGER АНИМАЦИИ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Добавляет stagger-задержки для группы элементов
 * @param {string} selector - CSS селектор группы элементов
 * @param {number} baseDelay - Базовая задержка между элементами (мс)
 */
export function initStaggerAnimation(
  selector,
  baseDelay = CONFIG.STAGGER_DELAY
) {
  const elements = $$(selector);

  elements.forEach((el, index) => {
    el.style.transitionDelay = `${index * baseDelay}ms`;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// АНИМАЦИЯ ЭЛЕМЕНТА
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Анимирует элемент с помощью CSS классов
 * @param {Element} element - DOM элемент
 * @param {string} animationClass - Класс анимации
 * @param {number} duration - Длительность (мс)
 * @returns {Promise}
 */
export function animateElement(
  element,
  animationClass,
  duration = CONFIG.ANIMATION_DURATION
) {
  return new Promise((resolve) => {
    element.classList.add(animationClass);

    setTimeout(() => {
      element.classList.remove(animationClass);
      resolve();
    }, duration);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// FADE АНИМАЦИИ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Плавно показывает элемент
 * @param {Element} element
 * @param {number} duration
 * @returns {Promise}
 */
export function fadeIn(element, duration = 300) {
  return new Promise((resolve) => {
    element.style.opacity = "0";
    element.style.display = "";
    element.style.transition = `opacity ${duration}ms ease-out`;

    // Force reflow
    element.offsetHeight;

    element.style.opacity = "1";

    setTimeout(() => {
      element.style.transition = "";
      resolve();
    }, duration);
  });
}

/**
 * Плавно скрывает элемент
 * @param {Element} element
 * @param {number} duration
 * @returns {Promise}
 */
export function fadeOut(element, duration = 300) {
  return new Promise((resolve) => {
    element.style.transition = `opacity ${duration}ms ease-out`;
    element.style.opacity = "0";

    setTimeout(() => {
      element.style.display = "none";
      element.style.transition = "";
      element.style.opacity = "";
      resolve();
    }, duration);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE АНИМАЦИИ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Slide down (разворачивание)
 * @param {Element} element
 * @param {number} duration
 * @returns {Promise}
 */
export function slideDown(element, duration = 300) {
  return new Promise((resolve) => {
    element.style.display = "";
    const height = element.scrollHeight;

    element.style.overflow = "hidden";
    element.style.height = "0";
    element.style.transition = `height ${duration}ms ease-out`;

    // Force reflow
    element.offsetHeight;

    element.style.height = `${height}px`;

    setTimeout(() => {
      element.style.height = "";
      element.style.overflow = "";
      element.style.transition = "";
      resolve();
    }, duration);
  });
}

/**
 * Slide up (сворачивание)
 * @param {Element} element
 * @param {number} duration
 * @returns {Promise}
 */
export function slideUp(element, duration = 300) {
  return new Promise((resolve) => {
    const height = element.scrollHeight;

    element.style.overflow = "hidden";
    element.style.height = `${height}px`;
    element.style.transition = `height ${duration}ms ease-out`;

    // Force reflow
    element.offsetHeight;

    element.style.height = "0";

    setTimeout(() => {
      element.style.display = "none";
      element.style.height = "";
      element.style.overflow = "";
      element.style.transition = "";
      resolve();
    }, duration);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SHAKE АНИМАЦИЯ (для ошибок)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Анимация shake для элемента (для отображения ошибки)
 * @param {Element} element
 */
export function shakeElement(element) {
  element.classList.add("animate-shake");

  element.addEventListener(
    "animationend",
    () => {
      element.classList.remove("animate-shake");
    },
    { once: true }
  );
}
