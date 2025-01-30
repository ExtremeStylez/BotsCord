const tips = [
  'You can use Discord to chat while gaming!',
  'Press Ctrl + / to see all keyboard shortcuts.',
  'You can customize your Discord theme in User Settings.',
  'Use /giphy to send GIFs in your messages.',
  'Discord has a built-in game launcher for some games.',
  'You can create custom emojis for your server.',
  'Use Markdown to format your messages.',
  'Discord Nitro gives you access to more features!',
  'You can share your screen during voice calls.',
  'Use the search bar to find specific messages quickly.',
];

document.addEventListener('DOMContentLoaded', () => {
  let progress = 0;
  const progressBar = document.getElementById('progress');
  const loadingTip = document.getElementById('loadingTip');

  const tipInterval = setInterval(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    loadingTip.textContent = randomTip;
  }, 3000);
  const loadInterval = setInterval(() => {
    progress += Math.random() * 15; // 15;
    progressBar.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(loadInterval);
      clearInterval(tipInterval);
      //('OTcwMTY0MDQzMjcwNzM3OTUx.GzyayA.GJbkv779M5REQwrx-5hIH3Rn22-kAkEDHj8Ias');
      // });
      progressBar.style.width = '100%';
      document.getElementById('discordLoader').style.display = 'none';
      handleSwipe();
    }
  }, 1000);

  var script = document.createElement('script');
  script.src = '/dashboardProcess.js';
  script.charset = 'utf-8';

  document.head.appendChild(script);
  script.onload = function () {
    const aApp = JSON.parse(document.querySelector('.sidebar').dataset.obj);
    startProcess(aApp.token);
  };
});

async function handleSwipe() {
  const sidebar = document.querySelector('.sidebar');
  let touchStartX = 0;
  let touchEndX = 0;

  document
    .querySelector('#showChannelSidebar')
    .addEventListener('click', (e) => {
      e.preventDefault();

      console.log('hi');
      if (!sidebar.classList.contains('open')) sidebar.classList.add('open');
      else sidebar.classList.remove('open');
    });

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;
    const threshold = 50;

    if (Math.abs(swipeDistance) > threshold) {
      if (swipeDistance > 0) {
        sidebar.classList.add('open');
      } else {
        sidebar.classList.remove('open');
      }
    }
  });

  /*document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') &&
            !e.target.closest('.sidebar')) {
            sidebar.classList.remove('open');
        }
    });*/
}
