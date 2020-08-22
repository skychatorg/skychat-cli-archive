class Messages {

    constructor(message, session) {

        this.message = message;
        this.user = message.user.username;
        // Username color (the color of the '~Server' username is not defined)
        this.userColor = this.user !== '~Server' ? message.user.data.plugins.color.main : 'white';
        this.createdTimestamp = message.createdTimestamp;

        // First level quotation
        this.firstQuote = message.quoted;
        this.firstQuoteContent = this.firstQuote ? message.quoted.content : null;
        this.firstQuoteUer = this.firstQuote ? message.quoted.user.username : null;

        // Second level quotation
        this.secondQuote = this.message.quoted ? message.quoted.quoted : null;
        this.secondQuoteContent = this.secondQuote ? message.quoted.quoted.content : null;
        this.secondQuoteUsername = this.secondQuote ? message.quoted.quoted.user.username : null;

    }

    /**
     * Format the message
     */
    format() {

        let formattedMessage = '';

        let messageTime = new Date(this.createdTimestamp * 1000);

        // Padding the hours, minutes and zero with 0
        let messageTimeHours = ("0" + messageTime.getHours()).slice(-2);
        let messageTimeMinutes = ("0" + messageTime.getMinutes()).slice(-2);
        let messageTimeSeconds = ("0" + messageTime.getSeconds()).slice(-2);

        // The date of the message is in the format hh:mm:ss
        let formattedTime = `${messageTimeHours}:${messageTimeMinutes}:${messageTimeSeconds}`;

        // Second level quotation
        if (this.secondQuote) {
            formattedMessage += `[${formattedTime}] ${this.message.user.username.toString()}: || ${this.secondQuoteContent} \n`
        }

        // First level quotation
        if (this.firstQuote) {
            if (this.secondQuote) {
                formattedMessage += ' '.repeat(formattedTime.length + this.user.length + 5) + `| ${this.firstQuoteContent} \n`
                formattedMessage += ' '.repeat(formattedTime.length + this.user.length + 4) + `${this.message.content} \n`
            } else {
                formattedMessage += `[${formattedTime}] {${this.userColor}-fg}${this.message.user.username.toString()}{/${this.userColor}-fg}: | ${this.firstQuoteContent} \n`
                formattedMessage += ' '.repeat(formattedTime.length + this.user.length + 6) + `${this.message.content} \n`
            }
        } else {
            // Message
            formattedMessage += `[${formattedTime}] {${this.userColor}-fg}${this.message.user.username.toString()}{/${this.userColor}-fg}: ${this.message.content}\n`
        }

        return formattedMessage;
    }

}

module.exports = Messages;
