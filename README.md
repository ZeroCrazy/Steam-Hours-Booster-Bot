# Steam Hours Booster Bot

<p align="center">
  <img src="https://i.imgur.com/B6lYCLH.png" />
</p>

<p align="center">
  <strong>Steam Hours Booster Bot - Community</strong>
  <br>
  Download the latest version on <a href='https://github.com/ZeroCrazy/Steam-Hours-Booster-Bot/releases'>Releases</a>
</p>

<p align="center">
  This project is developed by ZeroCrazy <i>(based on <a target='_blank' href='https://github.com/SwayerPT/Steam-Boost-Hour-Bot'>Swayer</a>)</i> with the aim of automating Steam game playtime to enhance your profile activity. It features automatic playtime management, Steam Guard integration, customizable game lists, and real-time notifications for friend requests, items, and trades.
</p>

---

## Installation Guide

### Prerequisites

Before you start, ensure you have the following installed on your system:

1. **[Node.js](https://nodejs.org/)**: This project requires Node.js to run. Download and install the latest LTS version from the official Node.js website.

### Steps to Install

1. **Clone the Repository**

    ```bash
    git clone https://github.com/ZeroCrazy/Steam-Hours-Booster-Bot.git
    cd Steam-Hours-Booster-Bot
    ```

2. **Install Dependencies**

    Install the required Node.js dependencies by running:

    ```bash
    npm install
    ```

    This command reads the `package.json` file and installs the necessary packages.

3. **Configure the Bot**

    Open the `steam_app.js` file and update the configuration settings as needed (e.g., Steam credentials, game IDs).

4. **Run the Bot**

    To start the bot, you can use the following command in your terminal:

    ```bash
    node steam_app.js
    ```

    Alternatively, you can use the provided `.bat` file to start the bot on Windows. Double-click `start.bat` to run the bot.

---

## FAQ

**Do I get VAC banned or is this a cheat?**  
No, this bot uses official Steam modules and Node.js, similar to the Steam Auth App for your Windows system. It simulates game playtime without breaching Steam’s terms.

**Is this bot saving information about my account?**  
No, the bot only requires your username and password during startup, which are used for login purposes and are not stored externally.

**Does the creator or the community have access to my account?**  
No, the bot operates locally on your machine, and your details cannot be tracked or accessed by the creator or the community.

**Are there any limitations on the number of games?**  
Yes, Steam allows a maximum of 25 games to be idled per account. If you exceed this limit, it may affect your Steam game hours and could potentially lead to issues with your account.

**Can I use this bot for unlimited games?**  
No, exceeding the limit of 25 games can cause automatic bugs or issues with Steam’s game hours reporting. Stick to the limit to avoid problems.

**Is there any external storage of information?**  
No, all data and interactions are handled locally. No external servers or databases are used to store your information.

---

## License

This project is licensed under the [GNU General Public License v3.0 (GPLv3)](LICENSE). See the `LICENSE` file for more details.

## Contributions

Contributions are welcome! Please refer to the [CONTRIBUTING](CONTRIBUTING.md) guide for more information on how to contribute to this project.

---

## Questions?

Feel free to reach out via:
- GitHub Issues: [here](https://github.com/ZeroCrazy/Steam-Hours-Booster-Bot/issues)
- Steam Community: [ZeroCrazy](https://steamcommunity.com/profiles/76561199439998413)

## Donations

If you appreciate the work and want to support further development, you can donate via Steam Trade: [Donate Here](https://steamcommunity.com/tradeoffer/new/?partner=1479732685&token=JQZUsTj8)

---

Thank you for using Steam Hours Booster Bot!
