'use strict';

const { includes } = require('lodash');

const providersList = require('./providers');

/**
 * Factory for GifProviders
 * @class {GifProviderFactory}
 */
module.exports = class GifProviderFactory {

    /**
     * Takes an array of source names and returns an array of providers which match.
     * @param sources {Array<String>}
     */
    static getProviders(sources = []) {
        return providersList.filter( provider => includes(sources, provider.name) )
            .map( provider => provider.class );
    }
};
