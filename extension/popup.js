'use strict';
const input = document.getElementById('enabled');
const status = document.getElementById('status');
const key = 'chaoxingHoverEnabled';
function render(enabled) {
  input.checked = enabled;
  status.textContent = enabled ? '已开启 · 在学习通课程页生效' : '已关闭 · 使用课程原有播放行为';
}
chrome.storage.local.get(key, result => {
  if (chrome.runtime.lastError) { status.textContent = '读取失败，请重新打开插件。'; return; }
  render(result[key] !== false);
  input.disabled = false;
});
input.addEventListener('change', () => {
  const enabled = input.checked;
  input.disabled = true;
  chrome.storage.local.set({ [key]: enabled }, () => {
    input.disabled = false;
    if (chrome.runtime.lastError) { render(!enabled); status.textContent = '保存失败，请重试。'; return; }
    render(enabled);
  });
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes[key]) render(changes[key].newValue !== false);
});
