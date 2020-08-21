const SkychatCLI = require('./SkyChatCLI/SkyChatCLI')

let client = new SkychatCLI();

client.init(function() {
    this.start()
});
