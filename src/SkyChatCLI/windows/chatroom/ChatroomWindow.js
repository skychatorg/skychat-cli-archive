const Window = require('./../Window')
const blessed = require('blessed')

class ChatroomWindow extends Window {

    constructor(screen, skyChatClient) {
        super(screen, skyChatClient)
        this.client = skyChatClient
    }

    init() {

        // Chatroom window
        let chatroom = blessed.form({
            parent: this.screen,
            keys: true,
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            autoNext: true
        });

        /// Close button
        this.close = blessed.button({
            parent: chatroom,
            mouse: true,
            keys: true,
            shrink: true,
            padding: {
                left: 1,
                right: 1
            },
            right: 0,
            top: 1,
            name: 'close',
            content: 'X',
            style: {
                bg: this.config.chatroom.closeButton.backgroundColor,
                fg: this.config.chatroom.closeButton.foregroundColor
            }
        });

        // Exit the program when the button is clicked
        this.close.on('press', function() {
            process.exit(0)
        });

        // Message input box
        this.messageInput = blessed.Textarea({
            parent: chatroom,
            width: '100%',
            height: 3,
            bottom: 1,
            bg: this.config.chatroom.messageInput.backgroundColor,
            fg: this.config.chatroom.messageInput.foregroundColor,
            keys: true,
            inputOnFocus: true,
            border: 'line'
        });

        // Send the message when the enter key is pressed
        this.messageInput.key(['enter'], () => {

            let message = this.messageInput.getValue();

            // We check that the message isn't empty.
            if (message == null || message.trim() === '') {
                this.screen.render()
                this.messageInput.clearValue()
            } else {
                this.client.sendMessage(this.messageInput.getValue())
                this.screen.render()
                this.messageInput.clearValue()
            }

        });

        // Where the messages are displayed
        this.messagesBox = blessed.text({
            parent: chatroom,
            padding: {
                left: 1,
                right: 1,
            },
            left: 1,
            right: 21,
            bottom: 5,
            top: 1,
            style: {
                bg: this.config.chatroom.messagesBox.backgroundColor,
                fg: this.config.chatroom.messagesBox.foregroundColor
            },
            keys: true,
            vi: true,
            alwaysScroll: true,
            scrollable: true,
            mouse: true,
            scrollbar: {
                ch: " ",
                track: {
                    bg: this.config.chatroom.scrollbar.color
                },
                style: {
                    inverse: true
                }
            }
        })

        // list of logged-in users
        this.connectedList = blessed.text({
            parent: chatroom,
            padding: {
                left: 1,
                right: 1,
            },
            right: 0,
            width: 20,
            bottom: 5,
            top: 3,
            bg: this.config.chatroom.connectedList.backgroundColor,
            fg: this.config.chatroom.connectedList.foregroundColor,
        })

        // Focus on the message input box when the chatroom is loaded
        this.messageInput.focus()

        // updates the list of connected users
        this.updateConnectedList()
        // updates the list of messages
        this.updateMessages()

        // Update messages when a new message is received
        this.client.on('messages', this.updateMessages.bind(this));

        // Updates the list of logged-in users when one logs out or logs in
        this.client.on('connected-list', this.updateConnectedList.bind(this));
    }


    /**
     * Update the list of messages
     */
    updateMessages() {

        const messagesJSON = this.client.messages;
        let messages = ""

        for (let i = 0; i < messagesJSON.length; i++) {
            let obj = messagesJSON[i];
            let messageTime = new Date(obj.createdTimestamp * 1000);

            // Padding the hours, minutes and zero with 0
            let messageTimeHours = ("0" + messageTime.getHours()).slice(-2)
            let messageTimeMinutes = ("0" + messageTime.getMinutes()).slice(-2)
            let messageTimeSeconds = ("0" + messageTime.getSeconds()).slice(-2)

            // The date of the message is in the format hh:mm:ss
            let formattedTime = `${messageTimeHours}:${messageTimeMinutes}:${messageTimeSeconds}`;
            // The message contains the date, the username and the content
            messages += `[${formattedTime}] ${obj.user.username.toString()}: ${obj.content.toString()}\n`
        }

        this.messagesBox.setContent(messages)
        this.render()

        // Scroll down the message list
        this.messagesBox.scrollTo(this.messagesBox.getScrollHeight())
    }

    /**
     * Updates the list of connected users
     */
    updateConnectedList() {

        const connectedUsersJSON = this.client.connectedList

        let connectedUsers = ""
        for (let i = 0; i < connectedUsersJSON.length; i++) {
            let user = connectedUsersJSON[i];
            connectedUsers += `- ${user.user.username}\n`
        }
        this.connectedList.setContent(connectedUsers)
        this.screen.render()
    }
}

module.exports = ChatroomWindow;
