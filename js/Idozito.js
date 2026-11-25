class Idozito {
    #ora;
    #kezdet;
    #eltelt;
    #fut;

    constructor(ora = () => performance.now()) {
        this.#ora = ora;
        this.nullaz();
    }

    getFut() {
        return this.#fut;
    }

    getEltelt() {
        if (this.#fut) {
            return this.#eltelt + (this.#ora() - this.#kezdet);
        }
        return this.#eltelt;
    }

    inditas() {
        if (this.#fut) return;

        this.#kezdet = this.#ora();
        this.#fut = true;
    }

    leallit() {
        if (!this.#fut) return;

        this.#eltelt += this.#ora() - this.#kezdet;
        this.#fut = false;
    }

    nullaz() {
        this.#eltelt = 0;
        this.#kezdet = 0;
        this.#fut = false;
    }

    toString() {
        var tized = Math.floor(this.getEltelt() / 100);
        var perc = Math.floor(tized / 600);
        var masodperc = Math.floor((tized % 600) / 10);

        return String(perc).padStart(2, "0") + ":" + String(masodperc).padStart(2, "0") + "." + (tized % 10);
    }
}
