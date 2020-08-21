const blessed = require("blessed");

class Window {
    constructor(screen, client) {

        // Load configuration file
        this.config = require('./../../../config.json');

        this.skyChatClient = client;
        this.screen = screen;
    }

    /**
     * Refresh the window
     */
    render() {
        this.screen.render();
    }
}

module.exports = Window;
