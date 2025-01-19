const Vine = require("./Vine");

class VineLine {

    /** @type {Array.<Vine>} */
    #line = new Array();

    /**
     * Ajoute une vigne à la ligne
     * @param {Vine} vine 
     */
    add(vine) {
        this.#line.push(vine);
    }

    /**
     * Retourne la liste des vignes sous forme de tableau
     * @returns {Array.<Vine>}
     */
    toArray() {
        return this.#line;
    }

}

module.exports = VineLine;