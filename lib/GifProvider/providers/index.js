// Add each provider here to have it discovered by the factory

// 1. Import the class
const GiphyGifProvider = require("./GiphyGifProvider");

module.exports = [

    // 2. Add an entry; include a name and an instance
    { name: "giphy", class: new GiphyGifProvider("bH5Z69mu6KFkaxvRmNgi1kPtL02Cemin") }, // todo move ApiKey to pipeline
];
