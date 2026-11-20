class Akadaly {
    #x;
    #szelesseg;
    #magassag;
    #fent;
    #atment;

    constructor(x, szelesseg, magassag, fent) {
        this.setX(x);
        this.setSzelesseg(szelesseg);
        this.setMagassag(magassag);
        this.setFent(fent);
        this.setAtment(false);
    }

    setX(x) {
        this.#x = x;
    }

    setSzelesseg(szelesseg) {
        this.#szelesseg = szelesseg;
    }

    setMagassag(magassag) {
        this.#magassag = magassag;
    }

    setFent(fent) {
        this.#fent = fent;
    }

    setAtment(atment) {
        this.#atment = atment;
    }

    getX() {
        return this.#x;
    }

    getSzelesseg() {
        return this.#szelesseg;
    }

    getMagassag() {
        return this.#magassag;
    }

    getFent() {
        return this.#fent;
    }

    getAtment() {
        return this.#atment;
    }

    halad(sebesseg) {
        this.#x -= sebesseg;
    }

    utkozik(madarX, madarY, sugar, jatekMagassag) {
        var kozepX = this.#x + this.#szelesseg / 2;
        var tavolsag = this.#fent ? madarY : jatekMagassag - madarY;

        if (tavolsag - sugar > this.#magassag) {
            return false;
        }

        var szint = Math.max(0, Math.min(tavolsag, this.#magassag));
        var felSzelesseg = (this.#szelesseg / 2) * (1 - szint / this.#magassag);

        return Math.abs(madarX - kozepX) < felSzelesseg + sugar * 0.6;
    }
}
