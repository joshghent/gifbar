'use strict';

const Promise = require('bluebird');
const { flatten } = require('lodash');

const GifProvider = require('./GifProvider');

module.exports = class GifProviderWrapper extends GifProvider {

    /**
     * Create a new provider wrapper.
     * The order the providers are given will denote their order in search results.
     * @param providers {Array<GifProvider>}
     */
    constructor(providers = []) {
        super();

        this.providers = providers;
    }

    /**
     * Get a list of trending gifs from all wrapped providers.
     * (Returns an empty list if no wrapped API support trending gifs, or all return empty lists)
     *
     * @param limit {Number} (default: 30)
     */
    async trending(limit = 30) {
        return Promise.map(this.providers, provider => {
            return provider.trending(limit)
                // todo .then( format the response to something standard  )
                //  only need to format once there's multiple providers implemented
                //  lets format to match the giphy response as that's already expected elsewhere
                .catch( () => [] );
        } )
            .then( results => flatten(results) );
    }

    /**
     * Search for gifs that match the query string from all wrapped providers.
     * (Returns an empty list if there are no matching results from any wrapped API.)
     *
     * @param query {String}
     * @param limit {Number} (default: 30)
     */
    async search(query, limit = 30) {
        return Promise.map(this.providers, provider => {
            return provider.search(query, limit)
                // todo .then( format the response to something standard  )
                //  only need to format once there's multiple providers implemented
                //  lets format to match the giphy response as that's already expected elsewhere
                .catch( () => [] )
                .then( results => flatten(results) );
        } )
            .then( results => flatten(results) );
    }
};
