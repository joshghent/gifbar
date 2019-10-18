"use strict";

const giphy = require("giphy-api");

const GifProvider = require("../GifProvider");

/**
 * GifProvider for the Giphy API
 * @class {GiphyGifProvider}
 */
module.exports = class GiphyGifProvider extends GifProvider {

    constructor(apiKey) {
        super();

        this.api = giphy(apiKey);
    }

    /**
     * Get a list of trending gifs from the Giphy API.
     *
     * @param limit {Number} (default: 30)
     */
    async trending(limit = 30) {
        return this.api.trending({ "limit":limit });
    }

    /**
     * Search for gifs from the Giphy API that match the query string
     * (Returns an empty list if there are no matching results.)
     *
     * @param query {String}
     * @param limit {Number} (default: 30)
     */
    async search(query, limit = 30) {
        return this.api.search({"q": query, "limit": limit});
    }

};
