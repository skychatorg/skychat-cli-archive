const Window = require('./../Window')
const blessed = require('blessed')

class LoginWindow extends Window {

    constructor(screen, skyChatClient) {
        super(screen, skyChatClient)
        this.client = skyChatClient
        this.init()
    }

    init() {

        // Login form
        this.form = blessed.form({
            parent: this.screen,
            keys: true,
            left: 'center',
            top: 'center',
            width: '60%',
            height: '70%',
            autoNext: true,
            border: 'line',
            style: {
                bg: this.config.login.loginWindow.backgroundColor,
                border: {
                    fg: this.config.login.loginWindow.foregroundColor
                }
            }
        });

        // login form title
        this.title = blessed.text({
            parent: this.form,
            top: 0,
            height: 1,
            left: 'center',
            bg: this.config.login.loginWindow.backgroundColor,
            fg: this.config.login.loginWindow.foregroundColor,
            content: 'SKYCHAT',
        })

        /// Close button
        this.close = blessed.button({
            parent: this.form,
            mouse: true,
            keys: true,
            shrink: true,
            padding: {
                left: 1,
                right: 1
            },
            right: 0,
            top: 0,
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

        // Error message
        this.errorMessage = blessed.text({
            parent: this.form,
            bottom: 5,
            height: 3,
            width: '80%',
            left: 'center',
            tags: true,
            bg: this.config.login.loginWindow.backgroundColor,
            fg: this.config.login.loginWindow.foregroundColor,
            content: '',
        })

        // Username field
        this.usernameField = blessed.text({
            parent: this.form,
            top: 2,
            height: 1,
            left: 2,
            right: 2,
            bg: this.config.login.loginWindow.backgroundColor,
            fg: this.config.login.loginWindow.foregroundColor,
            keys: true,
            inputOnFocus: true,
            content: "Username",
        })

        // Username input
        this.usernameInput = blessed.Textbox({
            parent: this.form,
            top: 2,
            height: 1,
            left: this.usernameField.content.length + 4,
            right: 2,
            bg: this.config.login.input.backgroundColor,
            fg: this.config.login.input.foregroundColor,
            keys: true,
            inputOnFocus: true,
        });

        // Password field
        this.passwordField = blessed.text({
            parent: this.form,
            top: 4,
            height: 1,
            left: 2,
            right: 2,
            bg: this.config.login.loginWindow.backgroundColor,
            fg: this.config.login.loginWindow.foregroundColor,
            keys: true,
            inputOnFocus: true,
            content: "Password",
        })

        // Passwrd input
        this.passwordInput = blessed.Textbox({
            parent: this.form,
            top: 4,
            height: 1,
            left: this.passwordField.content.length + 4,
            right: 2,
            bg: this.config.login.input.backgroundColor,
            fg: this.config.login.input.foregroundColor,
            keys: true,
            inputOnFocus: true,
        });

        // submit button
        this.submit = blessed.button({
            parent: this.form,
            mouse: true,
            keys: true,
            shrink: true,
            padding: {
                left: 1,
                right: 1
            },
            left: 'center',
            bottom: 1,
            name: 'submit',
            content: 'submit',
            style: {
                bg: this.config.login.submitButton.backgroundColor,
                fg: this.config.login.submitButton.foregroundColor,
                focus: {
                    bg: this.config.login.submitButton.focusBackgroundColor
                },
                hover: {
                    bg: this.config.login.submitButton.hoverBackgroundColor
                }
            }
        });

        // When the sumbit button is pressed
        let that = this
        this.submit.on('press', function() {
            that.form.submit();
        });


        // When the login form is submitted
        this.client.on('error', this.showErrorMessage.bind(this));

        // When the form is submitted
        this.form.on('submit', function(data) {

            // We check that the username and password are not empty.
            if (that.usernameInput.content.trim() !== '' && that.passwordInput.content.trim() !== '') {
                that.client.login(that.usernameInput.content, that.passwordInput.content)
            } else {
                that.showErrorMessage('Please enter your username and password')
            }
        });
    }

    // Display an error message
    showErrorMessage(errMessage) {
        this.errorMessage.content = `{center}Error : ${errMessage.toString()}{/center}`
        this.screen.render()
    }

    /**
     * Leave the login window
     */
    leave() {
        this.form.destroy()
        this.screen.render()
    }

}

module.exports = LoginWindow;
