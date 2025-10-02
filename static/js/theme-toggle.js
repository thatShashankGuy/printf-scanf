(function () {
  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;

  var storageKey = 'theme-preference';

  function getPreferredTheme() {
    try {
      var stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (err) {
      /* ignore storage errors */
    }
    return 'dark';
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    toggle.setAttribute('data-theme-active', theme);
    toggle.setAttribute('aria-pressed', theme === 'dark');
    toggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Activate light mode' : 'Activate dark mode'
    );
  }

  function persist(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (err) {
      /* ignore storage errors */
    }
  }

  var theme = getPreferredTheme();
  applyTheme(theme);

  toggle.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    persist(next);
  });

  try {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', function (event) {
        var stored = null;
        try {
          stored = localStorage.getItem(storageKey);
        } catch (err) {
          /* ignore */
        }
        if (stored === 'light' || stored === 'dark') {
          return;
        }
        var next = event.matches ? 'dark' : 'light';
        applyTheme(next);
      });
  } catch (err) {
    /* matchMedia events not supported */
  }
})();
