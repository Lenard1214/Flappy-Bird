class JatekKezeles {
    #szelesseg = 1600;
    #magassag = 900;
    #madar;
    #madarX = 300;
    #akadalyok = [];
    #elet = 3;
    #pont = 0;
    #sertetlen = 0;
    #fut = false;
    #szamlalo = 0;
    #sebesseg = 5;

    constructor() {
        this.ujJatek();
    }

    getSzelesseg() {
        return this.#szelesseg;
    }

    getMagassag() {
        return this.#magassag;
    }

    getMadar() {
        return this.#madar;
    }

    getMadarX() {
        return this.#madarX;
    }

    getAkadalyok() {
        return this.#akadalyok;
    }

    getElet() {
        return this.#elet;
    }

    getPont() {
        return this.#pont;
    }

    getSertetlen() {
        return this.#sertetlen;
    }

    getFut() {
        return this.#fut;
    }

    ujJatek() {
        this.#madar = new Madar(this.#magassag / 2, 100);
        this.#akadalyok = [];
        this.#elet = 3;
        this.#pont = 0;
        this.#sertetlen = 0;
        this.#szamlalo = 0;
        this.#fut = false;
    }

    inditas() {
        this.#fut = true;
    }

    leallit() {
        this.#fut = false;
    }

    ugrik() {
        this.#madar.ugrik();
    }

    #sebzes() {
        this.#elet--;
        this.#sertetlen = 60;

        if (this.#elet <= 0) {
            this.#elet = 0;
            this.#fut = false;
        }
    }

    lep() {
        if (!this.#fut) return;

        var madar = this.#madar;
        var fel = madar.getMeret() / 2;

        madar.esik();

        this.#szamlalo++;
        if (this.#szamlalo % 100 === 0) {
            var magassag = 200 + Math.random() * 220;
            this.#akadalyok.push(new Akadaly(this.#szelesseg, 150, magassag, Math.random() < 0.5));
        }

        if (madar.getY() < fel) {
            madar.setY(fel);
            madar.setSebesseg(0);
        } else if (madar.getY() > this.#magassag - fel) {
            madar.setY(this.#magassag - fel);
            madar.ugrik();

            if (this.#sertetlen === 0) {
                this.#sebzes();
            }
        }

        for (var i = this.#akadalyok.length - 1; i >= 0; i--) {
            var akadaly = this.#akadalyok[i];
            akadaly.halad(this.#sebesseg);

            if (this.#fut && this.#sertetlen === 0 && akadaly.utkozik(this.#madarX, madar.getY(), madar.getMeret() * 0.4, this.#magassag)) {
                this.#sebzes();
            }

            if (!akadaly.getAtment() && akadaly.getX() + akadaly.getSzelesseg() < this.#madarX - fel) {
                akadaly.setAtment(true);
                this.#pont++;
            }

            if (akadaly.getX() + akadaly.getSzelesseg() < 0) {
                this.#akadalyok.splice(i, 1);
            }
        }

        if (this.#sertetlen > 0) {
            this.#sertetlen--;
        }
    }
}