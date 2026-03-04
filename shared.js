(() => {
  const buttons = document.querySelectorAll('[data-fullscreen-toggle]');
  if (!buttons.length) return;

  const STORAGE_KEY = 'fide_fullscreen_enabled';

  const setLabel = (isFullscreen) => {
    const label = isFullscreen ? 'Sortir du plein écran' : 'Plein écran';
    buttons.forEach((btn) => {
      btn.textContent = label;
      btn.setAttribute('aria-pressed', isFullscreen ? 'true' : 'false');
    });
  };

  const setAttention = (on) => {
    buttons.forEach((btn) => btn.classList.toggle('fs-attn', on));
  };

  const canFullscreen = !!document.documentElement.requestFullscreen;
  if (!canFullscreen) {
    buttons.forEach((btn) => btn.style.display = 'none');
    return;
  }

  const tryEnterFullscreen = async () => {
    if (document.fullscreenElement) return true;
    try {
      await document.documentElement.requestFullscreen();
      setAttention(false);
      return true;
    } catch {
      return false;
    }
  };

  const wanted = localStorage.getItem(STORAGE_KEY) === '1';
  setLabel(!!document.fullscreenElement);

  document.addEventListener('fullscreenchange', () => {
    const isFs = !!document.fullscreenElement;
    setLabel(isFs);
    localStorage.setItem(STORAGE_KEY, isFs ? '1' : '0');
    setAttention(!isFs && localStorage.getItem(STORAGE_KEY) === '1');
  });

  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else {
          await document.documentElement.requestFullscreen();
        }
      } catch {
        // Ignore fullscreen errors (browser or policy restrictions).
      }
    });
  });

  if (wanted && !document.fullscreenElement) {
    tryEnterFullscreen();
    const once = () => {
      tryEnterFullscreen();
      window.removeEventListener('pointerdown', once);
      window.removeEventListener('keydown', once);
    };
    window.addEventListener('pointerdown', once, { once: true });
    window.addEventListener('keydown', once, { once: true });
    setAttention(true);
  }
})();
