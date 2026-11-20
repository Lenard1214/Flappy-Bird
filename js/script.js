var jatek = new JatekKezeles();
var ido = null;
var vesztesModal = new bootstrap.Modal("#vesztesModal");

function hudKiir() {
    var csillagok = document.querySelectorAll(".elet i");

    for (var i = 0; i < csillagok.length; i++) {
        if (i < jatek.getElet()) {
            csillagok[i].className = "bi bi-heart-fill";
        } else {
            csillagok[i].className = "bi bi-heart m";
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
}