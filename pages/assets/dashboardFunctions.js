const cardContainer = document.getElementById('cardContainer');
const appCards = document.querySelectorAll('.appCard');
const addModal = document.getElementById('addModal');
const editModal = document.getElementById('editModal');
const tokenInput = document.getElementById('tokenInput');
const submitApp = document.getElementById('submitApp');
const cancelAdd = document.getElementById('cancelAdd');
const addCard = document.querySelector('.addCard');

window.addEventListener('click', (e) => {
  if (e.target === addModal) {
    addModal.style.display = 'none';
  }
  if (e.target === editModal) {
    editModal.style.display = 'none';
  }
  document.querySelectorAll('.dropdownMenu').forEach((menu) => {
    menu.style.display = 'none';
  });
});

addCard.addEventListener('click', () => (addModal.style.display = 'block'));
cancelAdd.addEventListener('click', () => {
  addModal.style.display = 'none';
  tokenInput.value = '';
});
submitApp.addEventListener('click', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const token = tokenInput.value;

  if (token == '' || !token || token == ' ') {
    return showToast('Please fill in the token field!', 'error');
  }

  try {
    const bot = await fetch('/api/app/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const result = await bot.json();

    if (result.message && result.message == 'exists')
      return showToast('You already have this app linked!', 'error');
    if (result.message && result.message == '401: Unauthorized')
      return showToast('Invalid token was provided!', 'error');
    if (!result.success)
      return showToast('Error occured, try again later!', 'error');

    const app = result.data.bot;
    const newApp = document.createElement('div');
    newApp.className = 'appCard';
    newApp.dataset.id = app.id;
    newApp.onclick = () => switchAccount(token);
    let avatarContent;
    if (app.avatar) {
      avatarContent = `<img src='https://cdn.discordapp.com/avatars/${app.id}/${app.avatar}.png' alt='${app.username}'>`;
    } else {
      const firstLetter = app.username.charAt(0).toUpperCase();
      avatarContent = firstLetter;
    }

    newApp.innerHTML = `
            <div class='cardHeader'>
                <div class='cardAvatar'>${avatarContent}</div>
                <h3 class='cardTitle'>${app.username}</h3>
            </div>
            <div class='cardBody'>
                <p class='cardDescription'>${result.data.description || 'No description'}</p>
            </div>
            <div class='cardFooter'>
                <button class='cardMenu' aria-label='Application options'>⋯</button>
            </div>
           <div class='dropdownMenu'>
               <button class='refreshApplication'>Refresh</button>
               <button class='editApplication'>Edit</button>
               <button class='removeApplication'>Remove</button>
           </div>
        `;
    const menuButton = newApp.querySelector('.cardMenu');
    const dropdownMenu = newApp.querySelector('.dropdownMenu');

    menuButton.onclick = (e) => {
      e.stopPropagation();
      dropdownMenu.style.display =
        dropdownMenu.style.display === 'block' ? 'none' : 'block';
    };
    cardContainer.insertBefore(newApp, cardContainer.lastElementChild);

    tokenInput.value = '';
    addModal.style.display = 'none';

    return showToast('Successfully added new app!', 'success');
  } catch (err) {
    console.log(err);
    return showToast('Server error, try again later!', 'error');
  }
});

appCards.forEach((card) => {
  const menuButton = card.querySelector('.cardFooter .cardMenu');
  const dropdownMenu = card.querySelector('.dropdownMenu');
  const removeApp = card.querySelector('.removeApplication');
  const refreshApp = card.querySelector('.refreshApplication');
  const editApp = card.querySelector('.editApplication');

  menuButton.onclick = (e) => {
    e.stopPropagation();

    dropdownMenu.style.display =
      dropdownMenu.style.display === 'block' ? 'none' : 'block';
  };

  refreshApp.onclick = (e) => {
    e.stopPropagation();
    const appName = card.querySelector('.cardTitle').innerText;

    card.dataset.id = 'app.id';
    card.querySelector('.cardAvatar').innerHTML =
      'app.avatar' != 'app.avatar'
        ? `<img alt='app.username' src='https://cdn.discordapp.com/avatars/app.id/app.avatar.png' />`
        : 'app.username'.charAt(0).toUpperCase();
    card.querySelector('.cardTitle').innerText = 'app.username';
    card.querySelector('.cardDescription').innerText = 'app.description';

    showToast(`Updated changed made to "${appName}"`, 'success');

    dropdownMenu.style.display = 'none';
  };
  editApp.onclick = (e) => {
    e.stopPropagation();

    editModal.style.display = 'block';
    dropdownMenu.style.display = 'none';
  };
  removeApp.onclick = async (e) => {
    e.stopPropagation();
    const appName = card.querySelector('.cardTitle').innerText;
    const id = card.dataset.id;
    const bot = await fetch('/api/app/remove', {
      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ id }),
    });

    card.remove();
    showToast(`Removed app, "${appName}"`, 'success');

    dropdownMenu.style.display = 'none';
  };
});

async function switchAccount(token) {
  console.log(token);

  try {
    const bot = await fetch('/api/auth/app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const result = await bot.json();

    if (result.message && result.message == 'exists')
      return showToast('You already have this app linked!', 'error');

    showToast('Successfully logged in!', 'success');
    return (window.location.href = '/channels/@me');
  } catch (err) {
    console.log(err);
    return showToast('Server error, try again later!', 'error');
  }
}
