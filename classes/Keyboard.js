class Keyboard {

    #readLineSync

    constructor() {

        this.#readLineSync = require('readline-sync');

    }

    /*
     * Kysytään käyttäjältä mihin sarakkeeseen pelimerkki asetetaan
     */
    getMove(msg) {

        let sarakkeet = ['A','B','C','D','E','F','G'];
        var col = this.#readLineSync.keyInSelect(sarakkeet, msg);

        if(col === -1)
            return null

        return col
    }
}

module.exports = Keyboard