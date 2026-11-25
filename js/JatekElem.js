class JatekElem {
    #tipus;
    #x;
    #y;
    #szelesseg;
    #magassag;
    #meret;
    #sebesseg;
    #fent;
    #atment;

    constructor(tipus) {
        if (tipus !== "madar" && tipus !== "akadaly") {
            throw new Error("A JatekElem típusa csak \"madar\" vagy \"akadaly\" lehet.");
        }

        this.#tipus = tipus;
        this.setX(0);
        this.setY(0);
        this.setSzelesseg(0);
        this.setMagassag(0);
        this.setMeret(0);
        this.setSebesseg(0);
        this.setFent(false);
        this.setAtment(false);
    }

    static ujMadar(y, meret = 100) {
        var elem = new JatekElem("madar");

        elem.setY(y);
        elem.setMeret(meret);

        return elem;
    }

    static ujAkadaly(x, szelesseg, magassag, fent) {
        var elem = new JatekElem("akadaly");

        elem.setX(x);
        elem.setSzelesseg(szelesseg);
        elem.setMagassag(magassag);
        elem.setFent(fent);

        return elem;
    }

    setX(x) {
        this.#x = x;
    }

    setY(y) {
        this.#y = y;
    }

    setSzelesseg(szelesseg) {
        this.#szelesseg = szelesseg;
    }

    setMagassag(magassag) {
        this.#magassag = magassag;
    }

    setMeret(meret) {
        this.#meret = meret;
    }

    setSebesseg(sebesseg) {
        this.#sebesseg = sebesseg;
    }

    setFent(fent) {
        this.#fent = fent;
    }

    setAtment(atment) {
        this.#atment = atment;
    }

    getTipus() {
        return this.#tipus;
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }

    getSzelesseg() {
        return this.#szelesseg;
    }

    getMagassag() {
        return this.#magassag;
    }

    getMeret() {
        return this.#meret;
    }

    getSebesseg() {
        return this.#sebesseg;
    }

    getFent() {
        return this.#fent;
    }

    getAtment() {
        return this.#atment;
    }

    isMadar() {
        return this.#tipus === "madar";
    }

    isAkadaly() {
        return this.#tipus === "akadaly";
    }





    ugrik() {
        if (!this.isMadar()) return;

        this.#sebesseg = -18;
    }

    esik() {
        if (!this.isMadar()) return;

        this.#sebesseg += 1.1;
        this.#y += this.#sebesseg;
    }


    
    

    halad(sebesseg) {
        if (!this.isAkadaly()) return;

        this.#x -= sebesseg;
    }

    utkozik(madarX, madarY, sugar, jatekMagassag) {
        if (!this.isAkadaly()) return false;

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
