/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LEADERBOARD.JS — Модуль лидерборда
 * Global Traders Championship | Liquid Glass Design System
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Рендер таблицы и карточек лидерборда, обновление данных.
 */

import { SELECTORS, DEMO_LEADERBOARD_DATA } from "../config.js";
import { $, formatCurrency, formatPercent } from "../utils/helpers.js";

// Приватные переменные
let tableBody = null;
let cardsContainer = null;
let currentData = [];

// ═══════════════════════════════════════════════════════════════════════════
// ИНИЦИАЛИЗАЦИЯ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Инициализирует модуль лидерборда
 */
export function initLeaderboard() {
  tableBody = $(SELECTORS.leaderboardTable);
  cardsContainer = $(SELECTORS.leaderboardCards);

  // Загружаем демо-данные
  // TODO: Заменить на API запрос
  loadLeaderboardData(DEMO_LEADERBOARD_DATA);
}

/**
 * Загружает и отображает данные лидерборда
 * @param {Array} data - Массив данных участников
 */
export function loadLeaderboardData(data) {
  currentData = data;

  // Сортируем по PnL (убывание)
  const sortedData = [...data].sort((a, b) => b.pnl - a.pnl);

  // Рендерим таблицу и карточки
  renderTable(sortedData);
  renderCards(sortedData);
}

// ═══════════════════════════════════════════════════════════════════════════
// РЕНДЕР ТАБЛИЦЫ (Desktop)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Рендерит таблицу лидерборда
 * @param {Array} data
 */
function renderTable(data) {
  if (!tableBody) return;

  const rows = data
    .map((item, index) => {
      const rank = index + 1;
      const rankClass = getRankClass(rank);
      const medal = getMedal(rank);
      const pnlClass =
        item.pnl >= 0
          ? "leaderboard__pnl--positive"
          : "leaderboard__pnl--negative";

      return `
      <tr class="leaderboard__row ${rankClass}" data-aos="fade-up" data-aos-delay="${
        index * 50
      }">
        <td class="leaderboard__td">
          <div class="leaderboard__rank">
            ${
              medal
                ? `<span class="leaderboard__medal" aria-hidden="true">${medal}</span>`
                : ""
            }
            <span class="leaderboard__rank-number">${rank}</span>
          </div>
        </td>
        <td class="leaderboard__td">
          <span class="leaderboard__trader">${escapeHtml(item.trader)}</span>
        </td>
        <td class="leaderboard__td">
          <span class="leaderboard__capital">${formatCurrency(
            item.capital
          )}</span>
        </td>
        <td class="leaderboard__td">
          <span class="leaderboard__pnl ${pnlClass}">${formatPercent(
        item.pnl
      )}</span>
        </td>
        <td class="leaderboard__td">
          <span class="leaderboard__maxdd">${formatPercent(item.maxDD)}</span>
        </td>
        <td class="leaderboard__td">
          <span class="leaderboard__best">${formatPercent(
            item.bestChallenge
          )}</span>
        </td>
        <td class="leaderboard__td">
          <span class="leaderboard__flag" aria-label="${item.country}">${
        item.flag
      }</span>
        </td>
      </tr>
    `;
    })
    .join("");

  tableBody.innerHTML = rows;
}

// ═══════════════════════════════════════════════════════════════════════════
// РЕНДЕР КАРТОЧЕК (Mobile)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Рендерит карточки лидерборда для мобильных
 * @param {Array} data
 */
function renderCards(data) {
  if (!cardsContainer) return;

  const cards = data
    .map((item, index) => {
      const rank = index + 1;
      const rankClass = getRankCardClass(rank);
      const medal = getMedal(rank);
      const pnlClass =
        item.pnl >= 0
          ? "leaderboard-card__pnl-value--positive"
          : "leaderboard-card__pnl-value--negative";

      return `
      <article class="leaderboard-card ${rankClass}" data-aos="fade-up" data-aos-delay="${
        index * 50
      }">
        <div class="leaderboard-card__header">
          ${
            medal
              ? `<span class="leaderboard-card__medal" aria-hidden="true">${medal}</span>`
              : ""
          }
          <span class="leaderboard-card__rank">#${rank}</span>
          <span class="leaderboard-card__trader">${escapeHtml(
            item.trader
          )}</span>
          <span class="leaderboard-card__flag" aria-label="${item.country}">${
        item.flag
      }</span>
        </div>
        
        <div class="leaderboard-card__pnl">
          <span class="leaderboard-card__pnl-value ${pnlClass}">${formatPercent(
        item.pnl
      )}</span>
          <span class="leaderboard-card__pnl-label">PnL общий</span>
        </div>
        
        <div class="leaderboard-card__stats">
          <div class="leaderboard-card__stat">
            <span class="leaderboard-card__stat-value">${formatCurrency(
              item.capital
            )}</span>
            <span class="leaderboard-card__stat-label">Капитал</span>
          </div>
          <div class="leaderboard-card__stat">
            <span class="leaderboard-card__stat-value">${formatPercent(
              item.maxDD
            )}</span>
            <span class="leaderboard-card__stat-label">MaxDD</span>
          </div>
          <div class="leaderboard-card__stat">
            <span class="leaderboard-card__stat-value">${formatPercent(
              item.bestChallenge
            )}</span>
            <span class="leaderboard-card__stat-label">Лучший</span>
          </div>
        </div>
      </article>
    `;
    })
    .join("");

  cardsContainer.innerHTML = cards;
}

// ═══════════════════════════════════════════════════════════════════════════
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Возвращает CSS класс для ряда таблицы по рангу
 * @param {number} rank
 * @returns {string}
 */
function getRankClass(rank) {
  switch (rank) {
    case 1:
      return "leaderboard__row--rank-1";
    case 2:
      return "leaderboard__row--rank-2";
    case 3:
      return "leaderboard__row--rank-3";
    default:
      return "";
  }
}

/**
 * Возвращает CSS класс для карточки по рангу
 * @param {number} rank
 * @returns {string}
 */
function getRankCardClass(rank) {
  switch (rank) {
    case 1:
      return "leaderboard-card--rank-1";
    case 2:
      return "leaderboard-card--rank-2";
    case 3:
      return "leaderboard-card--rank-3";
    default:
      return "";
  }
}

/**
 * Возвращает эмодзи медали по рангу
 * @param {number} rank
 * @returns {string}
 */
function getMedal(rank) {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return "";
  }
}

/**
 * Экранирует HTML для безопасного вывода
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ═══════════════════════════════════════════════════════════════════════════
// ПУБЛИЧНЫЙ API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Обновляет данные лидерборда
 * @param {Array} newData
 */
export function updateLeaderboard(newData) {
  loadLeaderboardData(newData);
}

/**
 * Возвращает текущие данные
 * @returns {Array}
 */
export function getCurrentData() {
  return currentData;
}
