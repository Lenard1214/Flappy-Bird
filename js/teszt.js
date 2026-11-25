var tIdoMost = 0;
var tIdozito = new Idozito(() => tIdoMost);

console.assert(tIdozito.toString() == "00:00.0", "Hiba az Idozito konstruktorában, mert nem nulláról indul.");

tIdozito.inditas();
tIdoMost = 65400;
console.assert(tIdozito.toString() == "01:05.4", "Hiba az Idozito toString() metódusában, mert rosszul írja ki az időt.");

tIdozito.leallit();
tIdoMost = 90000;
console.assert(tIdozito.getEltelt() == 65400, "Hiba az Idozito leallit() metódusában, mert leállítás után is telik az idő.");



var tHiba = false;
try {
    new JatekElem("felho");
} catch (e) {
    tHiba = true;
}
console.assert(tHiba === true, "Hiba a JatekElem konstruktorában, mert rossz típust is el lehet fogadni.");

var tMadar = JatekElem.ujMadar(450, 100);
console.assert(tMadar.getY() == 450, "Hiba az ujMadar() metódusban, mert nem jó helyre kerül a madár.");

tMadar.ugrik();
tMadar.esik();
console.assert(tMadar.getY() < 450, "Hiba az ugrik() metódusban, mert ugrás után nem felfelé megy a madár.");

for (var i = 0; i < 40; i++) {
    tMadar.esik();
}
console.assert(tMadar.getY() > 450, "Hiba az esik() metódusban, mert a madár nem esik vissza.");

var tAkadaly = JatekElem.ujAkadaly(250, 100, 200, false);
console.assert(tAkadaly.utkozik(300, 850, 40, 900) === true, "Hiba az utkozik() metódusban, mert nem ütközik, pedig az akadály tövénél van a madár.");
console.assert(tAkadaly.utkozik(300, 300, 40, 900) === false, "Hiba az utkozik() metódusban, mert ütközik, pedig magasan van az akadály fölött.");
console.assert(tAkadaly.utkozik(600, 850, 40, 900) === false, "Hiba az utkozik() metódusban, mert ütközik, pedig oldalt messze van az akadálytól.");

tAkadaly.halad(5);
console.assert(tAkadaly.getX() == 245, "Hiba a halad() metódusban, mert az akadály nem balra mozdul.");



var tJatek = ujJatek();
console.assert(tJatek.elet == 3 && tJatek.pont == 0, "Hiba az ujJatek() függvényben, mert nem 3 élettel és 0 ponttal indul.");

jatekLep(tJatek);
console.assert(tJatek.madar.getY() == 450, "Hiba a jatekLep() függvényben, mert nem futó játékban is mozog a madár.");

tJatek.fut = true;
jatekLep(tJatek);
console.assert(tJatek.madar.getY() > 450, "Hiba a jatekLep() függvényben, mert a madár nem esik.");

tJatek = ujJatek();
tJatek.fut = true;
tJatek.szamlalo = 99;
jatekLep(tJatek);
console.assert(tJatek.akadalyok.length == 1, "Hiba a jatekLep() függvényben, mert a 100. lépésben nem jön új akadály.");

tJatek = ujJatek();
tJatek.fut = true;
tJatek.madar.setY(tJatek.magassag);
jatekLep(tJatek);
console.assert(tJatek.elet == 2, "Hiba a jatekLep() függvényben, mert a talaj érintése nem vesz el életet.");

tJatek = ujJatek();
tJatek.fut = true;
tJatek.madar.ugrik();
tJatek.akadalyok.push(JatekElem.ujAkadaly(100, 150, 200, false));
jatekLep(tJatek);
console.assert(tJatek.pont == 1, "Hiba a jatekLep() függvényben, mert az elhagyott akadály nem ér pontot.");

tJatek = ujJatek();
tJatek.fut = true;
sebzes(tJatek);
sebzes(tJatek);
sebzes(tJatek);
console.assert(tJatek.elet == 0 && tJatek.fut === false, "Hiba a sebzes() függvényben, mert 3 sebzés után nem ér véget a játék.");

var tRegi = { pont: 5, ido: "00:30.0" };
console.assert(rekordFrissit(null, tRegi) === tRegi, "Hiba a rekordFrissit() függvényben, mert nincs rekord, de nem az új kerül be.");
console.assert(rekordFrissit(tRegi, { pont: 6, ido: "00:40.0" }).pont == 6, "Hiba a rekordFrissit() függvényben, mert a jobb pontszám nem lesz rekord.");
console.assert(rekordFrissit(tRegi, { pont: 2, ido: "01:00.0" }) === tRegi, "Hiba a rekordFrissit() függvényben, mert a rosszabb pontszám felülírja a rekordot.");

var tKonnyu = ujJatek("konnyu");
var tKozepes = ujJatek("kozepes");
var tNehez = ujJatek("nehez");
console.assert(tKozepes.sebesseg > tKonnyu.sebesseg, "Hiba az ujJatek() függvényben, mert a közepes nem gyorsabb a könnyűnél.");
console.assert(tNehez.sebesseg > tKozepes.sebesseg && tNehez.gyakorisag < tKonnyu.gyakorisag, "Hiba az ujJatek() függvényben, mert a nehéz nem gyorsabb vagy nem sűrűbb.");
console.assert(tNehez.elet == 2 && tNehez.maxElet == 2, "Hiba az ujJatek() függvényben, mert a nehéz szint nem 2 élettel indul.");

console.log("Tesztek lefutottak.");