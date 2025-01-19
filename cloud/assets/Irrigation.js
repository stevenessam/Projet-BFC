const weather = require('weather-js');

class Irrigation {

    /** @type {Boolean} */
    #enable = false;

    /** @type {Boolean} */
    #auto = true;

    /**
     * Retourne si le système d'irrigation est activé ou non
     * @returns {Boolean}
     */
    isEnable() {
        return this.#enable;
    }

    /**
     * Active le système d'irrigation
     */
    enable() {
        this.#enable = true;
    }

    /**
     * Désactive le système d'irrigation
     */
    disable() {
        this.#enable = false;
    }

    /**
     * Active le mode automatique
     * @param {Boolean} auto 
     */
    setAuto(auto) {
        this.#auto = auto;
    }

    /**
     * Retourne si le mode auto est activé ou non
     * @returns {Boolean}
     */
    isAuto() {
        return this.#auto;
    }

    /**
     * Regarde si il pleut dans la journée, le lendemain ou non
     * @returns {Promise.<Boolean>}
     */
    hasRain() {
        return new Promise((res, rej) => {
            weather.find({ search: 'Vidauban', degreeType: 'F' }, function (err, result) {
                if (err) rej(err);

                if (result.length) {
                    const data = result[0];

                    let haveRain = false;
                    let state = 0;

                    if (data.current.skytext.includes('rain')) { // aujourd'hui
                        haveRain = true;
                        state = 1;
                    }
                    else if ((data.forecast[0].skytext && data.forecast[0].skytext.includes('rain')) ||
                        (data.forecast[0].skytextday && data.forecast[0].skytextday.includes('rain'))) // demain
                        haveRain = true;

                    res([haveRain, state]);
                }
                else
                    rej();
            });
        });
    }

}

module.exports = Irrigation;