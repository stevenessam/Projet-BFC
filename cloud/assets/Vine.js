class Vine {

    /** @type {Boolean} */
    #enable = false;

    /** @type {Boolean} */
    #sick = false;

    /** @type {Number} */
    #value = 0;

    /** @type {Number} */
    #lastUpdate = -1;

    /**
     * Retourne si la vigne est activé ou non
     * @returns {Boolean}
     */
    isEnable() {
        return this.#enable;
    }

    /**
     * Active la vigne
     */
    enable() {
        this.#enable = true;
    }

    /**
     * Change la valeur de la vigne
     * @param {Number} value 
     */
    setValue(value) {
        this.#value = value;
        this.#lastUpdate = Date.now();
    }

    /**
     * Recupere la valeur de la vigne
     * @returns {Number}
     */
    getValue() {
        return this.#value;
    }

    /**
     * Retourne la derniere fois que la vigne a été update
     * @returns {Number}
     */
    getLastTime() {
        return this.#lastUpdate;
    }

    /**
     * Informe si la vigne est malade ou non
     * @param {Boolean} sick 
     */
    setSick(sick) {
        this.#sick = sick;
    }

    /**
     * 
     * @returns {Boolean}
     */
    getSick() {
        return this.#sick;
    }

}

module.exports = Vine;