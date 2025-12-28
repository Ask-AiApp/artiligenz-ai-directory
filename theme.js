// theme.js — single source of truth for Artiligenz light/dark theme
// Responsibilities:
//  - Set initial theme early (localStorage -> system preference)
//  - Expose window.toggleTheme()
//  - Persist choice to localStorage
//  - Notify listeners (optional) via a CustomEvent

(function () {
  const STORAGE_KEY = 'theme'; // 'dark' | 'light'

  function getStoredTheme() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch (e) {
      return null;
    }
  }

  function getSystemTheme() {
    try {
      return window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch (e) {
      return 'light';
    }
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);

    // Let any components (cy skin, etc.) react if they want to.
    document.dispatchEvent(
      new CustomEvent('theme-changed', { detail: { theme } })
    );
  }

  function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // ignore
    }
    applyTheme(theme);
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  }

  // ---- init: apply theme immediately ----
  const initial = getStoredTheme() || getSystemTheme();
  applyTheme(initial);

  // If user has not chosen a theme, follow system changes live
  try {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq && typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', () => {
        const stored = getStoredTheme();
        if (!stored) applyTheme(getSystemTheme());
      });
    } else if (mq && typeof mq.addListener === 'function') {
      // Safari fallback
      mq.addListener(() => {
        const stored = getStoredTheme();
        if (!stored) applyTheme(getSystemTheme());
      });
    }
  } catch (e) {
    // ignore
  }

  // Sync across tabs/windows
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return;
    const v = e.newValue;
    if (v === 'dark' || v === 'light') applyTheme(v);
  });

  // Export
  window.toggleTheme = toggleTheme;
  window.setTheme = setTheme;
  window.getTheme = function () {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  };
})();
