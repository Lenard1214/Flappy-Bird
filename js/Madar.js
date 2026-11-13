class Madar {
    #y;
    #sebesseg;
    #meret;

    constructor(y, meret =100) {
        this.setY(y);
        this.setSebesseg(0);
        this.setMeret(meret);
    }

    setY(y) {
        this.#y = y;
    }

    setSebesseg(sebesseg) {
        this.#sebesseg = sebesseg;
    }

    setMeret(meret) {
        this.#meret = meret;
    }

    getY() {
        return this.#y;
    }

    getSebesseg() {
        return this.#sebesseg;
    }

    getMeret() {
        return this.#meret;
    }

    ugrik() {
        this.#sebesseg = -18;
    }

    esik() {
        this.#sebesseg += 1.1;
        this.#y += this.#sebesseg;
    }
}
