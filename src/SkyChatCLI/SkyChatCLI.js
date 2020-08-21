const LoginWindow = require("./windows/login/LoginWindow");
const ChatroomWindow = require("./windows/chatroom/ChatroomWindow");
const blessed = require("blessed");
const skychat = require("skychat-node");

/**
 * A CLI for the redsky.fr chatroom
 */
class SkychatCLI {
    constructor() {
        this.skyChatClient = new skychat.SkyChatClient({
            host: "skychat.redsky.fr",
            secure: true,
        });
    }

    async init(callback) {

        // Connect to the skychat
        await this.skyChatClient.connect();

        // Create the screen
        this.screen = blessed.screen({
            smartCSR: true,
        });
        callback.bind(this)();
    }

    /**
     *  Login to the redsky.fr account
     */
    start() {

        // Login window
        let loginWindow = new LoginWindow(this.screen, this.skyChatClient);
        this.screen.render()

        // Display the chatroom once the user is authenticated
        this.skyChatClient.on('auth-token', () => {
            this.skyChatClient.joinRoom(0)
            loginWindow.leave()
            let chatroomWindow = new ChatroomWindow(this.screen, this.skyChatClient)
            chatroomWindow.init()
            chatroomWindow.render()
        });
    }
}

module.exports = SkychatCLI;
