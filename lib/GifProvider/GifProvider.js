/**
 * @interface {GifProvider}
 */
module.exports = class GifProvider {

    // This is an 'interface' to define what methods a GifProvider has.
    //  Don't use this directly; instead, use one of the implementations.

    /**
     * @param limit {Number} (default: 30)
     */
    async trending(limit = 30) {
        // do nothing
        return Promise.resolve([]);
    }

    /**
     * @param query {String} (default: '')
     * @param limit {Number} (default: 30)
     */
    async search(query = '', limit = 30) {
        // do nothing
        return Promise.resolve([]);
    }
};
