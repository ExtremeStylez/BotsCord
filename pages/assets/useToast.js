function showToast(message, type = 'info', duration = 3000) {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');

  toast.className = `toast ${type}`;
  toast.innerHTML = `
        ${message}
        <button class="toastClose" onclick="this.parentElement.remove()">&times;</button>
    `;

  toastContainer.appendChild(toast);

  // Trigger reflow
  toast.offsetHeight;
  toast.classList.add('toastShow');

  setTimeout(() => {
    toast.classList.remove('toastShow');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}
