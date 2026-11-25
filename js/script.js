


var NEHEZSEGEK = {
    konnyu:  { nev: "Könnyű",  sebesseg: 5,  elet: 3, gyakorisag: 100, magMin: 200, magMax: 420, tema: "nappal",  leiras: "Napközben, lassú tempó, 3 élet." },
    kozepes: { nev: "Közepes", sebesseg: 7,  elet: 3, gyakorisag: 100, magMin: 200, magMax: 420, tema: "nappal",  leiras: "Napközben, gyorsabb madár, 3 élet." },
    nehez:   { nev: "Nehéz",   sebesseg: 10, elet: 2, gyakorisag: 48,  magMin: 240, magMax: 480, tema: "ejszaka", leiras: "Éjszaka, nagyon gyors madár, sok és magasabb tüske, csak 2 élet." }
};

function ujJatek(nehezseg = "konnyu") {
    var beallitas = NEHEZSEGEK[nehezseg] || NEHEZSEGEK.konnyu;

    return {
        szelesseg: 1600,
        magassag: 900,
        madar: JatekElem.ujMadar(450, 100),
        madarX: 300,
        akadalyok: [],
        nehezseg: nehezseg,
        maxElet: beallitas.elet,
        elet: beallitas.elet,
        gyakorisag: beallitas.gyakorisag,
        magMin: beallitas.magMin,
        magMax: beallitas.magMax,
        tema: beallitas.tema,
        pont: 0,
        sertetlen: 0,
        szamlalo: 0,
        sebesseg: beallitas.sebesseg,
        fut: false
    };
}


function sebzes(jatek) {
    jatek.elet--;
    jatek.sertetlen = 60;

    if (jatek.elet <= 0) {
        jatek.elet = 0;
        jatek.fut = false;
    }
}


function akadalyHozzaad(jatek, veletlen) {
    var magassag = jatek.magMin + veletlen() * (jatek.magMax - jatek.magMin);
    var fent = veletlen() < 0.5;

    jatek.akadalyok.push(JatekElem.ujAkadaly(jatek.szelesseg, 150, magassag, fent));
}


function szelekEllenoriz(jatek) {
    var madar = jatek.madar;
    var fel = madar.getMeret() / 2;

    if (madar.getY() < fel) {
        madar.setY(fel);
        madar.setSebesseg(0);
    } else if (madar.getY() > jatek.magassag - fel) {
        madar.setY(jatek.magassag - fel);
        madar.ugrik();

        if (jatek.sertetlen === 0) {
            sebzes(jatek);
        }
    }
}


function akadalyokKezel(jatek) {
    var madar = jatek.madar;
    var fel = madar.getMeret() / 2;

    for (var i = jatek.akadalyok.length - 1; i >= 0; i--) {
        var akadaly = jatek.akadalyok[i];
        akadaly.halad(jatek.sebesseg);

        var utkozott = akadaly.utkozik(jatek.madarX, madar.getY(), madar.getMeret() * 0.4, jatek.magassag);
        if (jatek.fut && jatek.sertetlen === 0 && utkozott) {
            sebzes(jatek);
        }

        var elhagyta = akadaly.getX() + akadaly.getSzelesseg() < jatek.madarX - fel;
        if (!akadaly.getAtment() && elhagyta) {
            akadaly.setAtment(true);
            jatek.pont++;
        }

        if (akadaly.getX() + akadaly.getSzelesseg() < 0) {
            jatek.akadalyok.splice(i, 1);
        }
    }
}


function jatekLep(jatek, veletlen = Math.random) {
    if (!jatek.fut) return;

    jatek.madar.esik();
    jatek.szamlalo++;

    if (jatek.szamlalo % jatek.gyakorisag === 0) {
        akadalyHozzaad(jatek, veletlen);
    }

    szelekEllenoriz(jatek);
    akadalyokKezel(jatek);

    if (jatek.sertetlen > 0) {
        jatek.sertetlen--;
    }
}


function rekordFrissit(regi, uj) {
    if (regi === null || uj.pont > regi.pont) {
        return uj;
    }
    return regi;
}


/* ---------- Rekordok tárolása (hibatűrő localStorage) ---------- */

var TAROLO_KULCS = "flappyBirdRekordok";
var memoriaRekordok = {};   // tartalék, ha a localStorage nem elérhető

function rekordokOlvas() {
    try {
        var szoveg = localStorage.getItem(TAROLO_KULCS);
        var adat = szoveg ? JSON.parse(szoveg) : {};

        if (adat === null || typeof adat !== "object" || Array.isArray(adat)) {
            return memoriaRekordok;
        }

        var tiszta = {};
        for (var kulcs in NEHEZSEGEK) {
            var r = adat[kulcs];
            if (r && typeof r.pont === "number" && typeof r.ido === "string") {
                tiszta[kulcs] = { pont: r.pont, ido: r.ido };
            }
        }
        memoriaRekordok = tiszta;
    } catch (hiba) {
        // tiltott / hibás tárhely: marad a memóriában tárolt érték
    }
    return memoriaRekordok;
}

function rekordokMent(rekordok) {
    memoriaRekordok = rekordok;
    try {
        localStorage.setItem(TAROLO_KULCS, JSON.stringify(rekordok));
    } catch (hiba) {
        // nem sikerült menteni, de a játék tovább működik
    }
}


/* ---------- Megjelenítés és vezérlés ---------- */

var jatek = ujJatek();
var idozito = new Idozito();
var ido = null;
var vesztesModal = new bootstrap.Modal(document.getElementById("vesztesModal"));

function kivalasztottNehezseg() {
    return document.querySelector("input[name=nehezseg]:checked").value;
}

function hudKiir() {
    var szivek = "";
    for (var i = 0; i < jatek.maxElet; i++) {
        szivek += '<i class="bi ' + (i < jatek.elet ? "bi-heart-fill" : "bi-heart") + '"></i>';
    }
    document.querySelector(".elet").innerHTML = szivek;

    document.querySelector(".pont").textContent = "+" + jatek.pont;
    document.querySelector(".ido").textContent = idozito.toString();
}

function kirajzol() {
    var arany = document.querySelector(".jatekter").clientWidth / jatek.szelesseg;
    var madar = document.querySelector(".madar");

    madar.style.left = jatek.madarX * arany + "px";
    madar.style.top = jatek.madar.getY() * arany + "px";
    madar.style.width = jatek.madar.getMeret() * arany + "px";
    madar.style.opacity = jatek.sertetlen % 10 < 5 ? 1 : 0.4;

    var dolles = Math.max(-25, Math.min(40, jatek.madar.getSebesseg() * 2));
    madar.style.transform = "translate(-50%, -50%) rotate(" + dolles + "deg)";

    document.querySelector(".jatekter").classList.toggle("ejszaka", jatek.tema === "ejszaka");

    var html = "";
    for (var akadaly of jatek.akadalyok) {
        var irany = akadaly.getFent() ? "fent" : "lent";
        html += `<div class="akadaly ${irany}" style="left: ${akadaly.getX() * arany}px; width: ${akadaly.getSzelesseg() * arany}px; height: ${akadaly.getMagassag() * arany}px;"></div>`;
    }
    document.querySelector(".akadalyok").innerHTML = html;

    hudKiir();
}

function gombokBeallit() {
    var fut = ido !== null;

    document.querySelector(".kezdes").disabled = fut;
    document.querySelector(".befejezes").disabled = !fut;

    for (var r of document.querySelectorAll("input[name=nehezseg]")) {
        r.disabled = fut;
    }

    document.querySelector(".takaro").classList.toggle("rejtett", fut);
}

function nehezsegFrissit() {
    var nehezseg = kivalasztottNehezseg();

    document.querySelector(".nehezseg-leiras").textContent = NEHEZSEGEK[nehezseg].leiras;

    if (ido === null) {
        jatek = ujJatek(nehezseg);
        kirajzol();
    }
    rekordKiir();
}

function rekordKiir() {
    var rekordok = rekordokOlvas();
    var aktiv = kivalasztottNehezseg();
    var html = "";

    for (var kulcs in NEHEZSEGEK) {
        var r = rekordok[kulcs];
        html += '<tr class="' + (kulcs === aktiv ? "aktiv" : "") + '"><td>' + NEHEZSEGEK[kulcs].nev + "</td><td>" +
            (r ? r.pont : "–") + "</td><td>" + (r ? r.ido : "–") + "</td></tr>";
    }
    document.querySelector(".rekord-tabla tbody").innerHTML = html;
}

function leallit() {
    clearInterval(ido);
    ido = null;
    jatek.fut = false;
    idozito.leallit();
    gombokBeallit();
    hudKiir();
}

function vegeMutat() {
    var uj = { pont: jatek.pont, ido: idozito.toString() };
    var rekordok = rekordokOlvas();
    var regi = rekordok[jatek.nehezseg] || null;
    var frissitett = rekordFrissit(regi, uj);
    var ujRekord = frissitett === uj && uj.pont > 0;

    rekordok[jatek.nehezseg] = frissitett;
    rekordokMent(rekordok);

    document.querySelector(".vegeSzint").textContent = "Nehézség: " + NEHEZSEGEK[jatek.nehezseg].nev;
    document.querySelector(".vegePont").textContent = uj.pont;
    document.querySelector(".vegeIdo").textContent = uj.ido;
    document.querySelector(".ujRekord").hidden = !ujRekord;

    rekordKiir();
    vesztesModal.show();
}

function lep() {
    jatekLep(jatek);
    kirajzol();

    if (!jatek.fut) {
        leallit();
        vegeMutat();
    }
}

function indit() {
    if (ido !== null) return;

    if (document.activeElement) document.activeElement.blur();

    jatek = ujJatek(kivalasztottNehezseg());
    jatek.fut = true;
    jatek.madar.ugrik();
    idozito.nullaz();
    idozito.inditas();
    ido = setInterval(lep, 20);

    gombokBeallit();
    kirajzol();
}

function befejez() {
    if (ido === null) return;

    leallit();
    vegeMutat();
}

function ugras() {
    if (jatek.fut) {
        jatek.madar.ugrik();
    }
}

document.querySelector(".kezdes").addEventListener("click", indit);
document.querySelector(".befejezes").addEventListener("click", befejez);
document.querySelector(".jatekter").addEventListener("pointerdown", ugras);
window.addEventListener("resize", kirajzol);

for (var radio of document.querySelectorAll("input[name=nehezseg]")) {
    radio.addEventListener("change", nehezsegFrissit);
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        if (ido !== null) {
            e.preventDefault();
            ugras();
        }
    }
});

gombokBeallit();
nehezsegFrissit();