document.addEventListener('DOMContentLoaded', async function() {
  try {
    const result = await chrome.storage.local.get('aiAnswer');
    console.log(result);
    if (result) {
      const mydiv = document.querySelector('div');
      if (mydiv) {
        mydiv.textContent = result.aiAnswer;
      }
    } else {
      console.log('没有找到 aiAnswer');
    }
  } catch (error) {
    console.error('读取 storage 出错:', error);
  }
});