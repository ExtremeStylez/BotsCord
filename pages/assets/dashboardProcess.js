var Socket = new WebSocket('wss://gateway.discord.gg/?encoding=json&v=10');
var app = {};
var appFunction = {};
app.guilds = new Map();
app.channels = new Map();
app.privateChannels = new Map();
app.users = new Map();
var hBeatInterval = 1000;
var token = '';
var botEvent = document.body;
var debug = true;
var data = {
  token: '',
  intents: 3276799,
  properties: {
    $os: 'windows',
    $browser: 'JSCord',
    $device: 'JSCord',
  },
  // compress: false,
  large_threshold: 50,
};

function readyHandle(p) {
  readyHandler(p);
}
function guildHandle(p) {
  guildHandler(p);
}

botEvent.addEventListener('ready', readyHandle, false);
botEvent.addEventListener('guild_create', guildHandle, false);

function startProcess(info) {
  var Socket = new WebSocket('wss://gateway.discord.gg/?encoding=json&v=10');
  token = info;
  data.token = token;
}
Socket.onopen = function () {
  console.log(
    '%c[Gateway] %cConnection established',
    'color:purple; font-weight: bold;',
    'color:#000;'
  );
};
Socket.onmessage = function (e) {
  var event = JSON.parse(e.data).t;

  if (event === 'READY') {
    console.log(JSON.parse(e.data).d); //.channels.cache.filter(c => c.type = 1));
    for (var i in JSON.parse(e.data).d.private_channels) {
      if (JSON.parse(e.data).d.private_channels[i].recipients[0]) {
        app.privateChannels.set(
          JSON.parse(e.data).d.private_channels[i].id,
          JSON.parse(e.data).d.private_channels[i]
        );
      }
    }
    app.user = JSON.parse(e.data).d.user;
    if (!app.user.bot) {
      var guild = JSON.parse(e.data).d.guilds;
      for (var d in guild) {
        guildCreateMap(guild[d]);
      }
    }
    botEvent.dispatchEvent(
      new CustomEvent('ready', { detail: { ready: Date.now() } })
    );
  }
  if (event === 'GUILD_CREATE') {
    var guild = JSON.parse(e.data).d;
    guildCreateMap(guild);
    botEvent.dispatchEvent(new CustomEvent('guild_create', { detail: guild }));
  }
  if (event === 'CHANNEL_CREATE') {
    var channel = JSON.parse(e.data).d;
    console.log(channel);
    // botEvent.dispatchEvent(new CustomEvent('guild_create', {detail: guild}))
  }
  if (event === 'MESSAGE_CREATE') {
    var msg = JSON.parse(e.data).d;
    console.log(msg);

    if (!msg.guild_id) {
      // DM
    }
    var msgObj = {};
    msgObj.content = msg.content;
  }
  if (JSON.parse(e.data).op === 10) {
    if (debug)
      console.log(
        '%c[Gateway] %c[Hello] via ' +
          JSON.parse(e.data).d._trace +
          ', heartbeat interval: ' +
          JSON.parse(e.data).d['heartbeat_interval'],
        'color:purple; font-weight: bold;',
        'color:#000;'
      );

    Socket.send(JSON.stringify({ op: 1, d: 0 }));
    if (debug)
      console.log(
        '%c[Gateway] %cHeartbeat',
        'color:purple; font-weight: bold;',
        'color:#000;'
      );

    Socket.send(JSON.stringify({ op: 2, d: data }));
    if (debug)
      console.log(
        '%c[Gateway] %cIndentify',
        'color:purple; font-weight: bold;',
        'color:#000;'
      );

    hBeatInterval = JSON.parse(e.data).d['heartbeat_interval'];
  }

  if (JSON.parse(e.data).op === 11) {
    setTimeout(() => {
      Socket.send(JSON.stringify({ op: 1, d: 0 }));
      if (debug)
        console.log(
          '%c[Gateway] %cHeartbeat',
          'color:purple; font-weight: bold;',
          'color:#000;'
        );
    }, hBeatInterval);
  }
};

function guildCreateMap(guild) {
  var guildObj = {};

  console.log(guild);
  guildObj.members = new Map();
  guildObj.channels = new Map();
  guildObj.roles = new Map();
  guildObj.mfa = guild.mfa_level;
  guildObj.emojis = guild.emojis;
  guildObj.region = guild.region;
  guildObj.owner = guild.owner_id;
  guildObj.large = guild.large;
  guildObj.id = guild.id;
  guildObj.name = guild.name;
  guildObj.icon = guild.icon;
  guildObj.memberCount = guild.member_count;
  for (var i in guild.roles) {
    var roleData = {};
    roleData.name = guild.roles[i].name;
    roleData.hoist = guild.roles[i].hoist;
    roleData.color = guild.roles[i].color.toString(16);
    roleData.id = guild.roles[i].id;
    roleData.managed = guild.roles[i].managed;
    roleData.mentionable = guild.roles[i].mentionable;
    roleData.permissions = guild.roles[i].permissions;
    roleData.position = guild.roles[i].position;
    guildObj.roles.set(roleData.id, roleData);
  }
  for (var i in guild.members) {
    var memberData = {};
    memberData.user = guild.members[i].user;
    memberData.nick = null || guild.members[i].nick;
    memberData.joinedAt = guild.members[i].joined_at;
    memberData.deaf = guild.members[i].deaf;
    memberData.mute = guild.members[i].mute;
    memberData.roles = guild.members[i].roles;
    var permm = {};
    memberData.permissions = {};
    for (var c in guild.members[i].roles) {
      var temp = [];
      guildObj.roles.forEach((role) => {
        temp.push({ position: role.position, color: role.color, id: role.id });
      });
      temp = temp.sort(function (a, b) {
        return a.position - b.position;
      });
      for (var d in temp) {
        if (memberData.roles.indexOf(temp[d].id) > -1) {
          var fetchPerm = getPerm(guildObj.roles.get(temp[d].id).permissions);
          for (var e in fetchPerm) {
            permm[fetchPerm[e].name] = fetchPerm[e].value;
          }
          memberData.permissions = permm;
          if (Object.keys(permm).length === 0) memberData.permissions = 0;
        }
      }
    }
    memberData.status = 'offline';
    memberData.game = null;
    for (var d in guild.presences) {
      if (guild.presences[d].user.id === memberData.user.id) {
        memberData.status = guild.presences[d].status;
        memberData.game = guild.presences[d].game;
      }
    }
    guildObj.members.set(guild.members[i].user.id, memberData);
    if (!app.users.has(memberData.user.id)) {
      var userData = memberData.user;
      userData.status = memberData.status;
      userData.game = memberData.game;
      app.users.set(memberData.user.id, userData);
      botEvent.dispatchEvent(
        new CustomEvent('presence_update', { detail: memberData })
      );
    } else {
      if (app.users.get(memberData.user.id).game === null) {
        var userData = memberData.user;
        userData.status = memberData.status;
        userData.game = memberData.game;
        app.users.set(memberData.user.id, userData);
        botEvent.dispatchEvent(
          new CustomEvent('presence_update', { detail: memberData })
        );
      }
    }
  }

  var categoryData = {};
  categoryData[guild.id] = {
    name: 'uncategorized',
    id: guild.id,
    position: 0,
    type: 4,
    channels: [],
  };
  guild.channels
    .filter((c) => c.type === 4)
    .forEach((c) => {
      categoryData[c.id] = {
        name: c.name,
        id: c.id,
        position: c.position + 1,
        type: c.type,
        permissions: c.permission_overwrites,
        channels: [],
      };
    });

  for (var i in guild.channels) {
    var channelData = {};

    if (guild.channels[i].type === 0) {
      channelData.name = guild.channels[i].name;
      channelData.id = guild.channels[i].id;
      channelData.position = guild.channels[i].position;
      channelData.lastMessageID = guild.channels[i].last_message_id;
      channelData.lastPinDate = guild.channels[i].last_pin_timestamp;
      channelData.topic = guild.channels[i].topic;
      channelData.type = guild.channels[i].type;
      channelData.nsfw = guild.channels[i].nsfw;
      channelData.permissions = guild.channels[i].permission_overwrites;
      channelData.parentID = guild.channels[i].parent_id;
      channelData.guild = guildObj;

      if (!guild.channels[i].parent_id)
        categoryData[guild.id].channels.push(channelData);
      else categoryData[guild.channels[i].parent_id].channels.push(channelData);
    } else if (guild.channels[i].type === 2) {
      channelData.name = guild.channels[i].name;
      channelData.id = guild.channels[i].id;
      channelData.position = guild.channels[i].position;
      channelData.type = guild.channels[i].type;
      channelData.nsfw = guild.channels[i].nsfw;
      channelData.permissions = guild.channels[i].permission_overwrites;
      channelData.parentID = guild.channels[i].parent_id;
      channelData.userLimit = guild.channels[i].user_limit;
      channelData.bitrate = guild.channels[i].bitrate;
      channelData.guild = guildObj;

      if (channelData.parentID === null)
        categoryData[guild.id].channels.push(channelData);
      else categoryData[channelData.parentID].channels.push(channelData);
      // guildObj.channels.set(guild.channels[i].id, channelData)
    }

    // if (i === (guild.channels.length - 1)) guildObj.channels.set(guild.channels.id, categoryData);
  }
  Object.keys(categoryData).forEach((key) => {
    app.channels.set(key, categoryData[key]);
    guildObj.channels.set(key, categoryData[key]);
  });

  /*guildObj.channels.forEach((channel) => {
    
    app.channels.set(channel.id, channel)
  })*/
  app.guilds.set(guild.id, guildObj);
}

function getPerm(perm) {
  var result = [];
  this.perm = perm;
  for (var d of Object.keys(perms)) {
    if (!d.startsWith('all')) {
      if (this.perm & perms[d]) {
        result.push({ name: d, value: true });
      }
    }
  }
  return result;
}
var perms = {
  createInstantInvite: 1,
  kickMembers: 1 << 1,
  banMembers: 1 << 2,
  administrator: 1 << 3,
  manageChannels: 1 << 4,
  manageGuild: 1 << 5,
  readMessages: 1 << 10,
  sendMessages: 1 << 11,
  sendTTSMessages: 1 << 12,
  manageMessages: 1 << 13,
  embedLinks: 1 << 14,
  attachFiles: 1 << 15,
  readMessageHistory: 1 << 16,
  mentionEveryone: 1 << 17,
  externalEmojis: 1 << 18,
  voiceConnect: 1 << 20,
  voiceSpeak: 1 << 21,
  voiceMuteMembers: 1 << 22,
  voiceDeafenMembers: 1 << 23,
  voiceMoveMembers: 1 << 24,
  voiceUseVAD: 1 << 25,
  changeNickname: 1 << 26,
  manageNicknames: 1 << 27,
  manageRoles: 1 << 28,
  manageEmojis: 1 << 30,
  all: 0b1111111111101111111110000111111,
  allGuild: 0b1111100000000000000000000111111,
  allText: 0b0010000000001111111110000010001,
  allVoice: 0b0010011111100000000000000010001,
};
