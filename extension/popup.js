document.addEventListener('DOMContentLoaded', () => {
  const scrapeBtn = document.getElementById('scrapeBtn');
  const sendBtn = document.getElementById('sendBtn');
  const titleInput = document.getElementById('productTitle');
  const priceInput = document.getElementById('productPrice');
  const descInput = document.getElementById('productDescription');
  const imgInput = document.getElementById('productImage');
  const imgThumbnail = document.getElementById('imgThumbnail');
  const imgPlaceholder = document.getElementById('imgPlaceholder');
  const statusContainer = document.getElementById('statusContainer');

  let currentSourceUrl = '';

  // Helpers
  function showStatus(message, type) {
    statusContainer.textContent = message;
    statusContainer.className = 'status-container'; // Reset
    
    if (type === 'success') {
      statusContainer.classList.add('status-success');
    } else if (type === 'error') {
      statusContainer.classList.add('status-error');
    } else {
      statusContainer.classList.add('status-info');
    }
    statusContainer.style.display = 'flex';
  }

  function clearStatus() {
    statusContainer.style.display = 'none';
    statusContainer.textContent = '';
  }

  function updateImagePreview(url) {
    if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:'))) {
      imgThumbnail.src = url;
      imgThumbnail.style.display = 'block';
      imgPlaceholder.style.display = 'none';
    } else {
      imgThumbnail.src = '';
      imgThumbnail.style.display = 'none';
      imgPlaceholder.style.display = 'flex';
    }
  }

  // Update preview image when user types in URL
  imgInput.addEventListener('input', () => {
    updateImagePreview(imgInput.value.trim());
  });

  // Scrape Button Click Handler
  scrapeBtn.addEventListener('click', async () => {
    clearStatus();
    scrapeBtn.disabled = true;
    scrapeBtn.textContent = 'Scraping...';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        throw new Error('No active tab found.');
      }

      // Check if page can be scripted (avoid chrome://, about:, file:// if restricted, etc.)
      if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
        throw new Error('Cannot scrape system pages. Please navigate to a product web page.');
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });

      if (results && results[0] && results[0].result) {
        const data = results[0].result;
        
        // Populate inputs
        titleInput.value = data.title || '';
        priceInput.value = data.price || '';
        descInput.value = data.description || '';
        imgInput.value = data.imageUrl || '';
        currentSourceUrl = data.sourceUrl || tab.url;

        updateImagePreview(data.imageUrl);
        
        // Enable send button
        sendBtn.disabled = false;
        showStatus('Product scraped successfully! You can review and edit fields before sending.', 'success');
      } else {
        throw new Error('Scraping returned no data.');
      }
    } catch (error) {
      showStatus(error.message || 'Scraping failed.', 'error');
      sendBtn.disabled = true;
    } finally {
      scrapeBtn.disabled = false;
      scrapeBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
        Scrape Product
      `;
    }
  });

  // Send Button Click Handler
  sendBtn.addEventListener('click', () => {
    clearStatus();
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    const payload = {
      title: titleInput.value.trim(),
      price: priceInput.value.trim(),
      description: descInput.value.trim(),
      imageUrl: imgInput.value.trim(),
      sourceUrl: currentSourceUrl
    };

    chrome.runtime.sendMessage({ action: 'sendProduct', data: payload }, (response) => {
      // Check for runtime errors
      if (chrome.runtime.lastError) {
        showStatus(`Extension communication error: ${chrome.runtime.lastError.message}`, 'error');
        sendBtn.disabled = false;
        sendBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Send to Website
        `;
        return;
      }

      if (response && response.success) {
        showStatus('Product data successfully transmitted to external database!', 'success');
        // Keep button disabled on success to prevent double submission
      } else {
        const errMsg = response && response.error ? response.error : 'Unknown server or network error.';
        showStatus(`Failed to transmit product: ${errMsg}`, 'error');
        sendBtn.disabled = false;
        sendBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Send to Website
        `;
      }
    });
  });
});
