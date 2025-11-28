/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HEADER.JS — Модуль навигации
 * Global Traders Championship | Liquid Glass Design System
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Sticky хедер, hide/show при скролле, мобильное меню.
 */

import { CONFIG, SELECTORS, CLASSES } from "../config.js";
import {
  $,
  $$,
  throttle,
  addClass,
  removeClass,
  toggleClass,
} from "../utils/helpers.js";
import {
  getScrollY,
  initActiveSectionDetection,
  lockScroll,
  unlockScroll,
} from "../utils/scroll.js";

// Приватные переменные
let header = null;
let burger = null;
let mobileMenu = null;
let mobileOverlay = null;
let lastScrollY = 0;
let isMenuOpen = false;

// ═══════════════════════════════════════════════════════════════════════════
// ИНИЦИАЛИЗАЦИЯ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Инициализирует модуль хедера
 */
export function initHeader() {
  // Получаем элементы
  header = $(SELECTORS.header);
  burger = $(SELECTORS.headerBurger);
  mobileMenu = $(SELECTORS.headerMobile);
  mobileOverlay = $(SELECTORS.headerMobileOverlay);

  if (!header) return;

  // Инициализируем функционал
  initStickyHeader();
  initMobileMenu();
  initNavLinks();
  initActiveSection();
}

// ═══════════════════════════════════════════════════════════════════════════
// STICKY HEADER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Инициализирует sticky-поведение хедера
 */
function initStickyHeader() {
  lastScrollY = getScrollY();

  // Throttled scroll handler
  const handleScroll = throttle(() => {
    const currentScrollY = getScrollY();

    // Добавляем класс при скролле
    toggleClass(
      header,
      CLASSES.isScrolled,
      currentScrollY > CONFIG.SCROLL_THRESHOLD
    );

    // Hide/show при скролле вверх/вниз
    if (
      currentScrollY > lastScrollY &&
      currentScrollY > CONFIG.SCROLL_THRESHOLD
    ) {
      // Скролл вниз
      if (currentScrollY - lastScrollY > CONFIG.SCROLL_HIDE_DELTA) {
        addClass(header, CLASSES.isHidden);
      }
    } else {
      // Скролл вверх
      removeClass(header, CLASSES.isHidden);
    }

    lastScrollY = currentScrollY;
  }, CONFIG.THROTTLE_LIMIT);

  window.addEventListener("scroll", handleScroll, { passive: true });
}

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Инициализирует мобильное меню
 */
function initMobileMenu() {
  if (!burger || !mobileMenu) return;

  // Клик по бургеру
  burger.addEventListener("click", toggleMenu);

  // Клик по оверлею закрывает меню
  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMenu);
  }

  // Клик по кнопке закрытия внутри меню
  const closeBtn = $(".header__mobile-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  // Закрытие по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen) {
      closeMenu();
    }
  });

  // Закрытие при клике на ссылку
  const mobileLinks = $$(SELECTORS.headerMobileLinks);
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Закрытие при клике на CTA кнопку
  const mobileCta = $(".header__mobile-cta .btn");
  if (mobileCta) {
    mobileCta.addEventListener("click", () => {
      closeMenu();
    });
  }
}

/**
 * Переключает состояние меню
 */
function toggleMenu() {
  if (isMenuOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

/**
 * Открывает мобильное меню
 */
function openMenu() {
  isMenuOpen = true;

  addClass(burger, CLASSES.isActive);
  addClass(mobileMenu, CLASSES.isOpen);

  if (mobileOverlay) {
    addClass(mobileOverlay, CLASSES.isOpen);
  }

  addClass(document.body, CLASSES.menuOpen);
  lockScroll();

  // Обновляем ARIA
  burger.setAttribute("aria-expanded", "true");
  mobileMenu.setAttribute("aria-hidden", "false");

  // Фокус на первую ссылку
  const firstLink = $(SELECTORS.headerMobileLinks);
  if (firstLink) {
    setTimeout(() => firstLink.focus(), 100);
  }
}

/**
 * Закрывает мобильное меню
 */
function closeMenu() {
  isMenuOpen = false;

  removeClass(burger, CLASSES.isActive);
  removeClass(mobileMenu, CLASSES.isOpen);

  if (mobileOverlay) {
    removeClass(mobileOverlay, CLASSES.isOpen);
  }

  removeClass(document.body, CLASSES.menuOpen);
  unlockScroll();

  // Обновляем ARIA
  burger.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");

  // Возвращаем фокус на бургер
  burger.focus();
}

// ═══════════════════════════════════════════════════════════════════════════
// NAV LINKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Инициализирует smooth scroll для навигационных ссылок
 */
function initNavLinks() {
  const navLinks = $$(
    `${SELECTORS.headerLinks}, ${SELECTORS.headerMobileLinks}`
  );

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Проверяем что это anchor-ссылка
      if (href && href.startsWith("#") && href !== "#") {
        e.preventDefault();

        const target = $(href);

        if (target) {
          // Высота хедера для offset
          const headerHeight = header?.offsetHeight || 80;
          const targetPosition =
            target.getBoundingClientRect().top + getScrollY() - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          // Обновляем URL
          history.pushState(null, "", href);
        }
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTIVE SECTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Инициализирует подсветку активной секции в навигации
 */
function initActiveSection() {
  const sections = "section[id]";

  initActiveSectionDetection(
    sections,
    (sectionId) => {
      // Убираем активный класс со всех ссылок
      const allLinks = $$(
        `${SELECTORS.headerLinks}, ${SELECTORS.headerMobileLinks}`
      );
      allLinks.forEach((link) => removeClass(link, CLASSES.isActive));

      // Добавляем активный класс на соответствующие ссылки
      const activeLinks = $$(`a[href="#${sectionId}"]`);
      activeLinks.forEach((link) => addClass(link, CLASSES.isActive));
    },
    header?.offsetHeight || 80
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ПУБЛИЧНЫЙ API
// ═══════════════════════════════════════════════════════════════════════════

export { openMenu, closeMenu, toggleMenu };
