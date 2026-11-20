var jatek = new JatekKezeles();
var ido = null;
var vesztesModal = new bootstrap.Modal("#vesztesModal");

function hudKiir() {
    var csillagok = document.querySelectorAll(".elet i");

    for (var i = 0; i < csillagok.length; i++) {
        if (i < jatek.getElet()) {
            csillagok[i].className = "bi bi-star-fill";
        } else {
            csillagok[i].className = "bi bi-star";
        }
    }

    document.querySelector(".pont").textContent = "+" + jatek.getPont();
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
    gombokBeallit();
}

function vegeMutat() {
    document.querySelector(".vegePont").textContent = jatek.getPont();
    vesztesModal.show();
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
    jatek.ugrik();
});

document.addEventListener("keydown", (e) => {
    if (jatek.getFut() && (e.code === "Space" || e.code === "ArrowUp")) {
        e.preventDefault();
        jatek.ugrik();
    }
});

window.addEventListener("resize", kirajzol);

kirajzol();