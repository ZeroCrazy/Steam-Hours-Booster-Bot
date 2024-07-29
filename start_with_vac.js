const SteamUser = require('steam-user');
const fs = require('fs');
const readlineSync = require('readline-sync');
const chalk = require('chalk');
const axios = require('axios'); // Library for making HTTP requests
const client = new SteamUser();

// Bot settings
const settings = {
  "acceptRandomFriendRequests": true,
  "acceptItemNotify": true,
  "acceptTradesNotify": true,
  "acceptReplies": true,
  "games": [252490] // 730 => Counter-Strike 2, 252490 => Rust
};

// Initial variables and messages
console.log(' ');
console.log(chalk.black.bold.bgWhite('    Steam Hours Booster Bot    '));
console.log(' ');
console.log(chalk.black.bold.bgWhite('      Steam Login             '));
console.log(' ');

// Request login credentials
console.log(' ');
const username = readlineSync.question(chalk.gray.bold(' Username: '));
console.log(' ');
const password = readlineSync.question(chalk.gray.bold(' Password: '), { hideEchoBack: true });
console.log(' ');

// Check if the user has Steam Guard enabled
const hasSteamGuard = readlineSync.keyInYNStrict('Do you have Steam Guard enabled?');
console.log(' ');

// Function to get the game name from AppID
async function getGameName(appId) {
  try {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
    const data = response.data;
    
    if (data[appId] && data[appId].success) {
      return data[appId].data.name;
    } else {
      return 'Game not found';
    }
  } catch (error) {
    console.error('Error fetching game information:', error);
    return 'Error fetching game information';
  }
}

// Store user information
const userNames = {};

function startLogin() {
  client.logOn({
    accountName: username,
    password: password
  });

  client.on('loggedOn', () => {
    console.log(chalk.green('Logged on Steam Client.'));
    client.setPersona(SteamUser.EPersonaState.Away);
    client.gamesPlayed(CountGamesUsed(settings.games));
    startTime = Date.now(); // Initialize start time
  });

  client.on('steamGuard', (domain, callback) => {
    if (hasSteamGuard) {
      const steamGuardCode = readlineSync.question(chalk.gray.bold(' Steam Guard Code: '));
      callback(steamGuardCode);
    } else {
      console.log(chalk.red('Steam Guard is required but not provided.'));
      shutdown();
    }
  });
  console.log(' ');

  // Tiempo de juego
  const playTimes = settings.games.reduce((acc, gameId) => {
    acc[gameId] = { start: null, total: 0 };
    return acc;
  }, {});

  let startTime;

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  async function displayPlayTimes() {
    const now = Date.now();
    const elapsedTime = Math.floor((now - startTime) / 1000); // Tiempo transcurrido desde que el bot se inició
    
    for (const gameId of settings.games) {
      const playTime = playTimes[gameId];
      if (playTime.start) {
        playTime.total += (now - playTime.start) / 1000;
      }
      
      const gameName = await getGameName(gameId);
      console.log(`**Total play on ${gameName} (${gameId}):** ${formatTime(elapsedTime)}`);
    }
  }

  // Mostrar tiempos y actualizar cada minuto
  setInterval(displayPlayTimes, 60000);

  client.on('error', (err) => {
    handleError(err);
  });

  client.on('friendMessage', async (steamID, message) => {
    const now = new Date();
    const timeString = now.toISOString().substr(11, 8); // hh:mm:ss format
    
    // Get the user's name
    const userName = userNames[steamID.getSteamID64()] || 'Unknown';
    
    // Received message
    const receivedMessage = chalk.yellow(`${timeString} - [MESSAGE 📥][${userName}] ${message}`);
    console.log(receivedMessage);
    
    // Respond to the message
    const responseMessage = await handleFriendMessage(steamID, message);
    
    // Sent message
    if (responseMessage) {
      const sentMessage = chalk.blue(`${timeString} - [MESSAGE 📤][${userName}] ${responseMessage}`);
      console.log(sentMessage);
      
      // Send the response message
      client.chatMessage(steamID, responseMessage);
    }
  });
}

async function handleFriendMessage(steamID, message) {
  if (settings.acceptReplies) {
    const responses = {
      'hello': 'Hi! I\'m busy right now, please wait a moment',
      'play': 'Not now... I\'m making missions',
      'Why': 'Because I\'m doing something',
      'yo': 'Yoo, wait a moment ;D',
      'Do you want to play?': 'Not now',
      'Whatsup': 'hey',
      'Are you there?': 'Yes, but I\'m leaving... bye',
      '...': 'Not now!',
      'yes': 'Or not'
    };
    if (responses[message]) {
      return responses[message];
    } else {
      return 'I did not understand your message.';
    }
  }
  return null;
}

// Function to shuffle games array
function CountGamesUsed(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to handle errors
function handleError(err) {
  console.error('An error occurred:', err);

  switch (err.eresult) {
    case SteamUser.EResult.InvalidPassword:
      log(chalk.red('Login Denied - User or Password Wrong.'));
      break;
    case SteamUser.EResult.AlreadyLoggedInElsewhere:
      log(chalk.red('Login Denied - Already logged in!'));
      break;
    case SteamUser.EResult.AccountLogonDenied:
      log(chalk.red('Login Denied - SteamGuard is required.'));
      break;
    case SteamUser.EResult.RateLimitExceeded:
      log(chalk.yellow('Rate limit exceeded. Retrying in 60 seconds...'));
      setTimeout(() => {
        startLogin();
      }, 60000);
      break;
    default:
      log(chalk.red('An unknown error occurred: ' + err.message));
      break;
  }

  // Log off and shut down
  log(chalk.green('Logging off Steam Client...'));
  client.logOff();
  client.once('disconnected', () => {
    process.exit(1); // Exit with error code
  });
  setTimeout(() => {
    process.exit(1); // Exit with error code if not disconnected
  }, 5000);
}

// Handle connection events
if (fs.existsSync('servers')) {
  SteamUser.servers = JSON.parse(fs.readFileSync('servers'));
  log(chalk.green('Connecting...'));
}

client.on('connected', () => {
  log(chalk.green('Initializing...'));
});

client.on('accountLimitations', (limited, communityBanned, locked) => {
  if (limited) {
    if (settings.games.length < 5) {
      log(chalk.blue('This Account is Limited.'));
      log(chalk.green('Initializing ' + settings.games.length + ' game(s) and playing on ' + settings.games + '.'));
    } else {
      log('Exceeded the limit ' + settings.games.length + ' of 5 Games.');
      log(chalk.red('Exceeded the limit ' + settings.games.length + ' of 5 Limited Games...'));
      log(chalk.red('Logging off...'));
      client.logOff();
      shutdown();
    }
  } else if (settings.games.length < 25) {
    log(chalk.green('Initializing ' + settings.games.length + ' game(s) and playing on ' + settings.games + '.'));
  } else {
    log(chalk.red('Exceeded the limit ' + settings.games.length + ' of 25 Limited Games...'));
    log(chalk.red('Logging off...'));
    client.logOff();
    shutdown();
  }

  if (communityBanned) {
    log(chalk.red('[BOT] Not able to proceed with banned accounts.'));
    log(chalk.red('Connection Lost!'));
    client.logOff();
    shutdown();
  } else if (locked) {
    log(chalk.red('[BOT] Not able to proceed with locked accounts.'));
    log(chalk.red('Connection Lost!'));
    client.logOff();
    shutdown();
  }
});

// Start login process
startLogin();

// Function to log messages
function log(message) {
  console.log(message);
}

// Function to shut down the bot
function shutdown() {
  console.log(chalk.red('Shutting down...'));
  client.logOff();
  process.exit(1);
}
