(() => {
  'use strict';
  // Only operate within a student course page, including its same-origin frames.
  try {
    if (!/(?:^|\/)mycourse\/studentstudy(?:$|\/)/.test(new URL(top.location.href).pathname)) return;
  } catch { return; }
  if (globalThis.__chaoxingHover) return;
  const key = 'chaoxingHoverEnabled';
  const state = { enabled: true, blocked: 0 };
  globalThis.__chaoxingHover = state;
  let button;
  function render() {
    if (!button) return;
    button.textContent = state.enabled ? '随心听课：开' : '随心听课：关';
    button.setAttribute('aria-pressed', String(state.enabled));
    button.style.background = state.enabled ? '#176b49' : '#505968';
    button.title = '点击切换；只阻止鼠标离开页面造成的暂停。手动暂停照常有效。';
  }
  // Do not override media.pause(), visibility state, progress, or focus.
  window.addEventListener('mouseout', event => {
    if (state.enabled && event.relatedTarget == null && !event.toElement) {
      state.blocked++;
      event.stopImmediatePropagation();
    }
  }, true);
  const storage = globalThis.chrome?.runtime?.id && globalThis.chrome?.storage?.local;
  if (storage) {
    storage.get(key, result => {
      if (chrome.runtime.lastError) return;
      if (typeof result[key] === 'boolean') state.enabled = result[key];
      render();
    });
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes[key]) {
        state.enabled = changes[key].newValue !== false;
        render();
      }
    });
  }
  if (window !== top) return;
  function mount() {
    if (!document.body || button) return;
    button = document.createElement('button');
    button.id = 'chaoxing-hover-toggle';
    button.type = 'button';
    button.style.cssText = 'position:fixed;right:20px;top:12px;z-index:2147483647;color:white;border:1px solid #ffffff80;border-radius:8px;padding:8px 12px;font:13px/1.4 system-ui;cursor:pointer;box-shadow:0 2px 8px #0003;';
    button.addEventListener('click', () => {
      state.enabled = !state.enabled;
      render();
      if (storage) storage.set({ [key]: state.enabled });
    });
    document.body.appendChild(button);
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
