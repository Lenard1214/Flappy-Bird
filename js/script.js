var jatek = new JatekKezeles();
var idozito = new Idozito();
var ido = null;
var vesztesModal = new bootstrap.Modal(document.getElementById("vesztesModal"));

function hudKiir() {
    var szivek = document.querySelectorAll(".elet i");

    for (var i = 0; i < szivek.length; i++) {
        if (i < jatek.getElet()) {
            szivek[i].className = "bi bi-heart-fill";
        } else {
            szivek[i].className = "bi bi-heart";
        }
    }

    document.querySelector(".pont").textContent = "+" + jatek.getPont();
    document.querySelector(".ido").textContent = idozito.toString();
}

function kirajzol() {
    var jatekter = document.querySelector(".jatekter");
    var arany = jatekter.clientWidth / jatek.getSzelesseg();
    var madar = jatek.getMadar();
    var elem = document.querySelector(".madar");

    elem.style.left = jatek.getMadarX() * arany + "px";
    elem.style.top = madar.getY() * arany + "px";
    elem.style.fontSize = madar.getMeret() * arany + "px";

    if (jatek.getSertetlen() % 10 < 5) {
        elem.style.opacity = 1;
    } else {
        elem.style.opacity = 0.4;
    }

    var akadalyok = jatek.getAkadalyok();
    var html = "";

    for (var i = 0; i < akadalyok.length; i++) {
        var akadaly = akadalyok[i];
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

function leallit() {
    clearInterval(ido);
    ido = null;
    jatek.leallit();
    idozito.leallit();
    gombokBeallit();
    hudKiir();
}

function vegeMutat() {
    var ujRekord = {
        pont: jatek.getPont(),
        ido: idozito.toString()
    };

    var regiRekord = localStorage.getItem("flappyBirdEredmeny");

    if (regiRekord === null || ujRekord.pont > JSON.parse(regiRekord).pont) {
        localStorage.setItem("flappyBirdEredmeny", JSON.stringify(ujRekord));
    }

    document.querySelector(".vegePont").textContent = ujRekord.pont;
    document.querySelector(".vegeIdo").textContent = ujRekord.ido;

    rekordKiir();
    vesztesModal.show();
}

function rekordKiir() {
    var rekord = localStorage.getItem("flappyBirdEredmeny");

    if (rekord !== null) {
        rekord = JSON.parse(rekord);

        document.querySelector(".rekordPont").textContent = rekord.pont;
        document.querySelector(".rekordIdo").textContent = rekord.ido;
    }
}

function lep() {
    jatek.lep();
    kirajzol();

    if (!jatek.getFut()) {
        leallit();
        vegeMutat();
    }
}

function indit() {
    if (ido !== null) return;

    jatek.ujJatek();
    jatek.inditas();
    jatek.ugrik();
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

document.querySelector(".kezdes").addEventListener("click", indit);
document.querySelector(".befejezes").addEventListener("click", befejez);

document.querySelector(".jatekter").addEventListener("pointerdown", () => {
    if (jatek.getFut()) {
        jatek.ugrik();
    }
});

document.addEventListener("keydown", (e) => {
    if (jatek.getFut() && (e.code === "Space" || e.code === "ArrowUp")) {
        e.preventDefault();
        jatek.ugrik();
    }
});



window.addEventListener("resize", kirajzol);

gombokBeallit();
kirajzol();
rekordKiir();