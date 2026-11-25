


function ujJatek() {
    return {
        szelesseg: 1600,
        magassag: 900,
        madar: JatekElem.ujMadar(450, 100),
        madarX: 300,
        akadalyok: [],
        elet: 3,
        pont: 0,
        sertetlen: 0,   
        szamlalo: 0,    
        sebesseg: 5,    
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
    var magassag = 200 + veletlen() * 220;
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

    if (jatek.szamlalo % 100 === 0) {
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



var jatek = ujJatek();
var idozito = new Idozito();
var ido = null;          
var vesztesModal = new bootstrap.Modal(document.getElementById("vesztesModal"));

function hudKiir() {
    var szivek = document.querySelectorAll(".elet i");

    for (var i = 0; i < szivek.length; i++) {
        szivek[i].className = i < jatek.elet ? "bi bi-heart-fill" : "bi bi-heart";
    }

    document.querySelector(".pont").textContent = "+" + jatek.pont;
    document.querySelector(".ido").textContent = idozito.toString();
}

function kirajzol() {
    var arany = document.querySelector(".jatekter").clientWidth / jatek.szelesseg;
    var madar = document.querySelector(".madar");

    madar.style.left = jatek.madarX * arany + "px";
    madar.style.top = jatek.madar.getY() * arany + "px";
    madar.style.fontSize = jatek.madar.getMeret() * arany + "px";
    madar.style.opacity = jatek.sertetlen % 10 < 5 ? 1 : 0.4;   

    var html = "";
    for (var akadaly of jatek.akadalyok) {
        var irany = akadaly.getFent() ? "fent" : "lent";
        html += `<div class="akadaly ${irany}" style="left: ${akadaly.getX() * arany}px; width: ${akadaly.getSzelesseg() * arany}px; height: ${akadaly.getMagassag() * arany}px;"></div>`;
    }
    document.querySelector(".akadalyok").innerHTML = html;

    hudKiir();
}

function gombokBeallit() {
    document.querySelector(".kezdes").disabled = ido !== null;
    document.querySelector(".befejezes").disabled = ido === null;
}

function rekordKiir() {
    var rekord = JSON.parse(localStorage.getItem("flappyBirdEredmeny"));

    if (rekord !== null) {
        document.querySelector(".rekordPont").textContent = rekord.pont;
        document.querySelector(".rekordIdo").textContent = rekord.ido;
    }
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
    var regi = JSON.parse(localStorage.getItem("flappyBirdEredmeny"));

    localStorage.setItem("flappyBirdEredmeny", JSON.stringify(rekordFrissit(regi, uj)));

    document.querySelector(".vegePont").textContent = uj.pont;
    document.querySelector(".vegeIdo").textContent = uj.ido;

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

    jatek = ujJatek();
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

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        ugras();
    }
});

gombokBeallit();
kirajzol();
rekordKiir();
