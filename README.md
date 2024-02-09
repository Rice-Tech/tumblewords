# Tumblewords
Tumblewords is a party game inspired by classroom games like Kahoot and Madlibs. Players can host a game or join a game hosted by a friend using the link, id, or QR code and then collect words by hitting them with a ping pong ball. After players submit their words, the host's device reveals a story with the player-gathered words entered in! Tumblewords was developed for the Global Game Jam 2024.

## Tech Stack
Tumblewords uses React with Typescript on the front-end and Firebase's Firestore for the database. Shadcn and Tailwind CSS provide the UI and styling. The word collection game uses React Three Fiber and Rapier Physics along with several helpful drei componants from the excellent Poimandres group.

## How to Install and Develop locally
Please follow these instructions to code locally (these were written for teammates during the game jam)
Anyone who would like to develop their own version of this program will need to create a Firebase project and add its config information as GitHub secrets.

### Requirements
 - [Node.js] (https://nodejs.org/en)
 - A code editor like [VS Code] (https://code.visualstudio.com/)

### Instructions
 - Install Node.js and VS Code
 - Open VS Code and use CTL-` to open the terminal
 - Install the Prettier extension, the Github extension, and turn on autosave
 - Clone this repository:
  ```
git clone https://github.com/Rice-Tech/wordswisely.git
  ```
 - In the terminal move into the new folder
  ```
   cd wordswisely
   ```
 - Open a new instance of VS Code in the folder code .
 - Close the old window
 - In the new window Crl ` to open the terminal
 - Install the necessary packages:
  ```
   npm install
   ```
- Serve the page on localhost
 ```
 npm run dev
 ```

