var NEHEZSEGEK = {
    konnyu:  { nev: "Könnyű",  sebesseg: 5,  elet: 3, gyakorisag: 100, magMin: 200, magMax: 420, tema: "nappal",  leiras: "Napközben, lassú tempó, 3 élet." },
    kozepes: { nev: "Közepes", sebesseg: 7,  elet: 3, gyakorisag: 100, magMin: 200, magMax: 420, tema: "nappal",  leiras: "Napközben, gyorsabb madár, 3 élet." },
    nehez:   { nev: "Nehéz",   sebesseg: 10, elet: 2, gyakorisag: 48,  magMin: 240, magMax: 480, tema: "ejszaka", leiras: "Éjszaka, nagyon gyors madár, sok és magasabb tüske, csak 2 élet." }
};

var SZELESSEG = 1600;
var MAGASSAG = 900;
var MADAR_X = 300;

var gameInterval = null;
var idozito = new Idozito();
var vesztesModal = new bootstrap.Modal(document.getElementById("vesztesModal"));

var jatekter = document.querySelector(".jatekter");
var madarElem = document.querySelector(".madar");
var akadalyokElem = document.querySelector(".akadalyok");
var eletElem = document.querySelector(".elet");
var pontElem = document.querySelector(".pont");
var idoElem = document.querySelector(".ido");
var kezdesBtn = document.querySelector(".kezdes");
var befejezesBtn = document.querySelector(".befejezes");
var radioGombok = document.querySelectorAll("input[name=nehezseg]");

var nehezseg;
var beallitas;
var madar;
var akadalyok;
var elet;
var pont;
var sertetlen;
var szamlalo;

function kivalasztottNehezseg() {
    return document.querySelector("input[name=nehezseg]:checked").value;
}

function ujJatek() {
    nehezseg = kivalasztottNehezseg();
    beallitas = NEHEZSEGEK[nehezseg];
    madar = JatekElem.ujMadar(450, 100);
    akadalyok = [];
    elet = beallitas.elet;
    pont = 0;
    sertetlen = 0;
    szamlalo = 0;
}

function sebzes() {
    elet--;
    sertetlen = 60;
}

function jatekLep() {
    var fel = madar.getMeret() / 2;

    madar.esik();
    szamlalo++;

    if (szamlalo % beallitas.gyakorisag == 0) {
        var magassag = beallitas.magMin + Math.random() * (beallitas.magMax - beallitas.magMin);
        var fent = Math.random() < 0.5;
        akadalyok.push(JatekElem.ujAkadaly(SZELESSEG, 150, magassag, fent));
    }

    if (madar.getY() < fel) {
        madar.setY(fel);
        madar.setSebesseg(0);
    } else if (madar.getY() > MAGASSAG - fel) {
        madar.setY(MAGASSAG - fel);
        madar.ugrik();
        if (sertetlen == 0) {
            sebzes();
        }
    }

    for (var i = akadalyok.length - 1; i >= 0; i--) {
        var akadaly = akadalyok[i];
        akadaly.halad(beallitas.sebesseg);

        if (sertetlen == 0 && akadaly.utkozik(MADAR_X, madar.getY(), madar.getMeret() * 0.4, MAGASSAG)) {
            sebzes();
        }

        if (!akadaly.getAtment() && akadaly.getX() + akadaly.getSzelesseg() < MADAR_X - fel) {
            akadaly.setAtment(true);
            pont++;
        }

        if (akadaly.getX() + akadaly.getSzelesseg() < 0) {
            akadalyok.splice(i, 1);
        }
    }

    if (sertetlen > 0) {
        sertetlen--;
    }
}

function kirajzol() {
    var arany = jatekter.clientWidth / SZELESSEG;

    madarElem.style.left = MADAR_X * arany + "px";
    madarElem.style.top = madar.getY() * arany + "px";
    madarElem.style.width = madar.getMeret() * arany + "px";
    madarElem.style.opacity = sertetlen % 10 < 5 ? 1 : 0.4;

    var dolles = Math.max(-25, Math.min(40, madar.getSebesseg() * 2));
    madarElem.style.transform = "translate(-50%, -50%) rotate(" + dolles + "deg)";

    jatekter.classList.toggle("ejszaka", beallitas.tema == "ejszaka");

    var html = "";
    for (var i = 0; i < akadalyok.length; i++) {
        var a = akadalyok[i];
        var irany = a.getFent() ? "fent" : "lent";
        html += `<div class="akadaly ${irany}" style="left: ${a.getX() * arany}px; width: ${a.getSzelesseg() * arany}px; height: ${a.getMagassag() * arany}px;"></div>`;
    }
    akadalyokElem.innerHTML = html;

    var szivek = "";
    for (var j = 0; j < beallitas.elet; j++) {
        szivek += '<i class="bi ' + (j < elet ? "bi-heart-fill" : "bi-heart") + '"></i>';
    }
    eletElem.innerHTML = szivek;

    pontElem.textContent = "+" + pont;
    idoElem.textContent = idozito.toString();
}

function gombokBeallit() {
    var fut = gameInterval != null;

    kezdesBtn.disabled = fut;
    befejezesBtn.disabled = !fut;
    for (var i = 0; i < radioGombok.length; i++) {
        radioGombok[i].disabled = fut;
    }
    document.querySelector(".takaro").classList.toggle("rejtett", fut);
}

function rekordokOlvas() {
    var szoveg = localStorage.getItem("flappyBirdRekordok");
    if (szoveg == null) {
        return {};
    }
    return JSON.parse(szoveg);
}

function rekordKiir() {
    var rekordok = rekordokOlvas();
    var aktiv = kivalasztottNehezseg();
    var html = "";

    for (var kulcs in NEHEZSEGEK) {
        var r = rekordok[kulcs];
        var pontSzoveg = r ? r.pont : "–";
        var idoSzoveg = r ? r.ido : "–";
        html += '<tr class="' + (kulcs == aktiv ? "aktiv" : "") + '"><td>' + NEHEZSEGEK[kulcs].nev + "</td><td>" + pontSzoveg + "</td><td>" + idoSzoveg + "</td></tr>";
    }
    document.querySelector(".rekord-tabla tbody").innerHTML = html;
}

function nehezsegValtas() {
    document.querySelector(".nehezseg-leiras").textContent = NEHEZSEGEK[kivalasztottNehezseg()].leiras;

    if (gameInterval == null) {
        ujJatek();
        kirajzol();
    }
    rekordKiir();
}

function start() {
    if (gameInterval != null) return;

    document.activeElement.blur();

    ujJatek();
    madar.ugrik();
    idozito.nullaz();
    idozito.inditas();

    gameInterval = setInterval(() => {
        jatekLep();
        kirajzol();

        if (elet <= 0) {
            stop();
        }
    }, 20);

    gombokBeallit();
    kirajzol();
}

function stop() {
    if (gameInterval == null) return;

    clearInterval(gameInterval);
    gameInterval = null;
    idozito.leallit();
    gombokBeallit();
    kirajzol();

    var ido = idozito.toString();
    var rekordok = rekordokOlvas();
    var regi = rekordok[nehezseg];
    var ujRekord = regi == undefined || pont > regi.pont;

    if (ujRekord) {
        rekordok[nehezseg] = { pont: pont, ido: ido };
        localStorage.setItem("flappyBirdRekordok", JSON.stringify(rekordok));
    }
    rekordKiir();

    document.querySelector(".vegeSzint").textContent = "Nehézség: " + beallitas.nev;
    document.querySelector(".vegePont").textContent = pont;
    document.querySelector(".vegeIdo").textContent = ido;
    document.querySelector(".ujRekord").hidden = !(ujRekord && pont > 0);
    vesztesModal.show();
}

function ugras() {
    if (gameInterval != null) {
        madar.ugrik();
    }
}

kezdesBtn.addEventListener("click", start);
befejezesBtn.addEventListener("click", stop);
jatekter.addEventListener("pointerdown", ugras);
window.addEventListener("resize", kirajzol);

for (var i = 0; i < radioGombok.length; i++) {
    radioGombok[i].addEventListener("change", nehezsegValtas);
}

document.addEventListener("keydown", (e) => {
    if ((e.code == "Space" || e.code == "ArrowUp") && gameInterval != null) {
        e.preventDefault();
        ugras();
    }
});

gombokBeallit();
nehezsegValtas();