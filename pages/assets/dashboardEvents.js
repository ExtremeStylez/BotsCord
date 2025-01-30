var activeGuild;

var readyHandler = function (p) {
  var name = app.user.global_name || app.user.username;
  var username = app.user.username;
  document.querySelectorAll('.appName').forEach((a) => (a.innerText = name));
  document
    .querySelectorAll('.appUsername')
    .forEach((a) => (a.innerText = username));
  if (app.user.avatar)
    document
      .querySelectorAll('.appAvatar')
      .forEach(
        (a) =>
          (a.children[0].src = `https://cdn.discordapp.com/avatars/${app.user.id}/${app.user.avatar}.png`)
      );
};

var guildHandler = function (p) {
  var guild = p.detail;

  // GUILD SIDEBAR
  var guildSidebar = document.querySelector('.guildSidebar');
  var guildVar = document.createElement('div');

  guildVar.innerHTML = `<div class='guildIcon' data-guild='${guild.id}' onclick='switchGuild("${guild.id}", "${guild.name}")'>
      ${guild.icon ? `<img src='https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${guild.icon.startsWith('a_') ? 'gif' : 'png'}' />` : `<span>${guild.name[0].toUpperCase()}</span>`}
    </div>`;
  guildVar.firstChild.style.setProperty('--sName', `"${guild.name}"`);
  guildSidebar.insertBefore(
    guildVar.firstChild,
    guildSidebar.children[guildSidebar.children.length - 1]
  );
};

function switchGuild(id, name) {
  var guild = app.guilds.get(id);
  activeGuild = guild.id;
  var guildChannels = [];
  var categories = [...guild.channels.values()];

  document.querySelector('.channelContainer').innerHTML = '';

  categories.forEach((cat) => {
    var channels = cat.channels;

    channels.forEach((c) => {
      if (c.id === guild.id) return guildChannels.push(c);
      if (guild.members.get(app.user.id).permissions['administrator'])
        return guildChannels.push(c);

      console.log(guild.members.get(app.user.id).roles.length);
      if (c.permissions.length > 0) {
        for (var i in c.permissions) {
          var perms = c.permissions[i];
          console.log(perms.type, perms.id !== guild.id); //guild.members.get(app.user.id).roles.indexOf(perms.id))
          if ((perms.type = 1)) console.log(perms);
          if ((perms.type = 0)) {
            if (perms.id === guild.id) {
              var channelPerms = getPerm(perms.deny);
              if (channelPerms.length === 0) return guildChannels.push(c);

              var check = '';
              for (var d in channelPerms) {
                if (channelPerms[d].name !== 'readMessages')
                  check = 'readMessages';
              }
              if ((check = 'readMessages')) return guildChannels.push(c);
            }
            if (
              guild.members.get(app.user.id).roles.length > 0 &&
              perms.id !== guild.id
            ) {
              if (
                guild.members.get(app.user.id).roles.indexOf(perms.id) > -1 ||
                guild.members.get(app.user.id).permissions['readMessages']
              ) {
                var channelPerms = getPerm(perms.deny);
                if (perms.deny === 0) return guildChannels.push(c);
                var check = '';
                for (var d in channelPerms) {
                  if (channelPerms[d].name !== 'readMessages')
                    check = 'readMessages';
                }
                if ((check = 'readMessages')) return guildChannels.push(c);
              }
            } else {
              if (perms[i] === app.user.id) {
              }
            }
          } else if ((perms.type = 1)) {
            var channelPerms = getPerm(perms.deny);
            if (perms.deny === 0) return guildChannels.push(c);
            var check = '';
            for (var d in channelPerms) {
              if (channelPerms[d].name !== 'readMessages')
                check = 'readMessages';
            }
            if ((check = 'readMessages')) return guildChannels.push(c);
          }
        }
      } else guildChannels.push(c);
    });
  });
  guildChannels = guildChannels.sort(function (a, b) {
    return a.position - b.position;
  });
  categories = categories.filter((c) => {
    const hasChannels = c.channels.some((ch) => guildChannels.includes(ch));

    return hasChannels;
  });

  categories = categories.sort(function (a, b) {
    return a.position - b.position;
  });
  for (var i in categories) {
    var c = categories[i];

    if (c.id === guild.id) {
      var cItem = document.createElement('ul');
      cItem.classList.add('uncategorizedChannels');
      cItem.id = 'uncategorizedChannels';
      cItem.dataset.category = c.id;

      /*cItem.innerHTML = `<div class='categoryName'>
                <svg class='categoryArrow' width="12" height="12" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5.22 8.72a.75.75 0 000 1.06l6.25 6.25a.75.75 0 001.06 0l6.25-6.25a.75.75 0 00-1.06-1.06L12 14.44 6.28 8.72a.75.75 0 00-1.06 0z"></path>
                </svg>
                ${c.name}
            </div>
            <ul></ul>`;*/

      document.querySelector('.channelContainer').appendChild(cItem);
    } else {
      var cItem = document.createElement('div');
      cItem.classList.add('channelCategory');
      cItem.dataset.category = c.id;

      cItem.innerHTML = `<div class='categoryName'>
                <svg class='categoryArrow' width="12" height="12" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5.22 8.72a.75.75 0 000 1.06l6.25 6.25a.75.75 0 001.06 0l6.25-6.25a.75.75 0 00-1.06-1.06L12 14.44 6.28 8.72a.75.75 0 00-1.06 0z"></path>
                </svg>
                ${c.name}
            </div>
            <ul></ul>`;

      document.querySelector('.channelContainer').appendChild(cItem);
    }
  }
  for (var i in guildChannels) {
    var c = guildChannels[i];
    var cItem = document.createElement('li');
    cItem.classList.add('channel');
    cItem.dataset.channel = c.id;

    cItem.innerHTML = `<div class='channelContent' onclick='switchChannel("${c.id}")'>
            <span class='channelIcon'>#</span>
            <span class='channelName'>${c.name}</span>
        </div>`;

    if (!c.parentID || c.parentID === guild.id)
      document.querySelector(`#uncategorizedChannels`).appendChild(cItem);
    else
      document
        .querySelector(`.channelCategory[data-category="${c.parentID}"]`)
        .children[1].appendChild(cItem);
  }

  // ChannelBar Handling
  var active = document.querySelector('.guildIcon.active');
  var selected = document.querySelector(`.guildIcon[data-guild="${id}"]`);

  active.classList.remove('active');
  selected.classList.add('active');

  document.querySelector('.serverName').innerText = name;
  document.querySelector('.channelSidebar').classList.remove('disabled');
  document.querySelector('.dmSidebar').classList.add('disabled');
}
function switchDMs() {
  let active = document.querySelector('.guildIcon.active');
  let selected = document.querySelector(`#dms`);

  active.classList.remove('active');
  selected.classList.add('active');

  document.querySelector('.channelSidebar').classList.add('disabled');
  document.querySelector('.dmSidebar').classList.remove('disabled');
}
async function switchChannel(id, name) {
  try {
    var response = await fetch(`/api/channel/${id}/messages`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    var res = await response.json();

    if (!res.success) return showToast('Server error, try again!', 'error');
    if ((res.length = 0))
      return (document.querySelector('.contentContainer').innerHTML = '');
    var msgs = res.results.reverse();

    document.querySelector('.contentContainer').innerHTML = '';
    msgs.forEach((msg) => {
      var cItem = document.createElement('div');
      cItem.innerHTML = `<span>
                ${msg.content}
            </span>`;
      document.querySelector('.contentContainer').append(cItem);
    });
  } catch (err) {
    console.log(err);
  }
  /*apiCall('GET', `https://discord.com/api/v10/channels/${id}/messages?limit=50`, {
        authorization: token
    }).then((msgs) => {
        console.log(msgs);
    }).catch((err) => {
        console.error(err);
    });*/
}

function apiCall(method, url, headers = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Resolve with parsed JSON if possible
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (error) {
            resolve(xhr.responseText); // Return raw response if JSON parsing fails
          }
        } else {
          reject(new Error(`HTTP error ${xhr.status}: ${xhr.statusText}`));
        }
      }
    };

    xhr.onerror = function (e) {
      reject(new Error(`Network error: ${e.message || 'Unknown error'}`));
    };

    xhr.open(method, url, true); // Always use async (true)

    // Set Authorization header if provided
    if (headers.authorization) {
      xhr.setRequestHeader('Authorization', `Bot ${headers.authorization}`);
    }

    // Set Content-Type header for JSON payloads
    if (!headers.contentType && headers.body) {
      xhr.setRequestHeader('Content-Type', 'application/json');
    } else if (
      headers.contentType &&
      headers.contentType !== 'multipart/form-data'
    ) {
      xhr.setRequestHeader('Content-Type', headers.contentType);
    }

    // Handle payloads
    if (headers.contentType === 'multipart/form-data') {
      xhr.send(headers.formdata); // Use FormData object directly
    } else if (headers.body) {
      xhr.send(JSON.stringify(headers.body)); // Send JSON payload
    } else {
      xhr.send(); // Send without a payload
    }
  });
}
