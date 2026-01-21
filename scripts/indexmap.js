const base62 = require('base62');

/**
 * @typedef {string} Index
 */

/**
 * @template K, V
 */
module.exports = class {
    constructor(indexPrefix = '') {
        this.indexPrefix = indexPrefix;
        /** @type {Map<K, Index>} */
        this.indexMapping = new Map;
        /** @type {Map<Index, V>} */
        this.valueMapping = new Map;
    }

    /**
     * @param {K} key
     * @param {V} value
     */
    set(key, value) {
        if (!this.indexMapping.has(key)) this.indexMapping.set(key, this.indexPrefix + base62.encode(this.indexMapping.size));
        this.valueMapping.set(this.indexMapping.get(key), value);
    }

    /**
     * @param {K} key
     * @returns {boolean}
     */
    has(key) {
        return this.indexMapping.has(key);
    }

    /**
     * @param {K} key
     * @returns {boolean}
     */
    getIndex(key) {
        return this.indexMapping.get(key);
    }

    /**
     * @param {K} key
     * @returns {V}
     */
    getValue(key) {
        return this.valueMapping.get(this.getIndex(key));
    }

    clear() {
        this.indexMapping.clear();
        this.valueMapping.clear();
    }
};