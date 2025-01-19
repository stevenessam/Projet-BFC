class Master {

    /** @type {Number} */
    #lastUpdate = -1;

    /** @type {boolean} */
    #enable = true;

    /**
     * Met à jour le master
     */
    update() {
        this.#lastUpdate = Date.now();
        this.#enable = true;
    }

    /**
     * Retourne la derniere fois que la vigne a été update
     * @returns {Number}
     */
    getLastTime() {
        return this.#lastUpdate;
    }

    /**
     * Active le master
     */
    on() {
        this.#enable = true;
    }

    /**
     * Désactive le master
     */
    off() {
        this.#enable = false;
    }

    /**
     * Retourne si le master est activé ou non
     * @returns {Boolean}
     */
    isEnable() {
        return this.#enable;
    }

}

module.exports = Master;