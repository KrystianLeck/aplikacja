function aktualizujWidocznoscPol() {
    const wybranyKsztalt = document.getElementById("ksztalt").value;
    const poleSrednica = document.getElementById("kolowyDims");
    const poleProstokat = document.getElementById("prostokatnyDims");

    if (wybranyKsztalt === "kolowy") {
        poleSrednica.style.display = "block";
        poleProstokat.style.display = "none";
    } else {
        poleSrednica.style.display = "none";
        poleProstokat.style.display = "block";
    }
}

document.getElementById("ksztalt").addEventListener("change", aktualizujWidocznoscPol);
document.addEventListener("DOMContentLoaded", aktualizujWidocznoscPol);

function generujRaport(wybranyKsztalt) {
	const ksztalt = document.getElementById("ksztalt").value;
    const szerokosc = parseFloat(document.getElementById("szerokosc").value);
    const wysokosc = parseFloat(document.getElementById("wysokosc").value);
    const material = document.getElementById("material").value;
    const obciazenie = parseFloat(document.getElementById("obciazenie").value);
    const dlugosc = parseFloat(document.getElementById("dlugosc").value);
    const kat = parseFloat(document.getElementById("kat").value);
    const srednica = parseFloat(document.getElementById("srednica").value);

    if (!material || isNaN(obciazenie) || isNaN(dlugosc) || isNaN(kat) ||
        (ksztalt === "kolowy" && isNaN(srednica)) ||
        (ksztalt !== "kolowy" && (isNaN(szerokosc) || isNaN(wysokosc)))) {
        alert("Proszę wypełnić wszystkie wymagane pola formularza poprwanymi danymi.");
        return;
    }

    if (obciazenie <= 0 || dlugosc <= 0 || kat <= 0 ||
        (ksztalt === "kolowy" && srednica <= 0) ||
        (ksztalt !== "kolowy" && (szerokosc <= 0 || wysokosc <= 0))) {
        alert("Proszę wypełnić wszystkie wymagane pola formularza poprawnymi danymi.");
        return;
    }

let wynik = '';
    switch (material) {
        case "St0s":
            wynik = obliczSt0s(obciazenie, dlugosc, srednica, kat, ksztalt, szerokosc, wysokosc);
            break;
        case "St3s":
            wynik = obliczSt3s(obciazenie, dlugosc, srednica, kat, ksztalt, szerokosc, wysokosc);
            break;
        case "St4s":
            wynik = obliczSt3s(obciazenie, dlugosc, srednica, kat, ksztalt, szerokosc, wysokosc);
            break;
			case "St5":
            wynik = obliczSt3s(obciazenie, dlugosc, srednica, kat, ksztalt, szerokosc, wysokosc);
            break;
			case "St6":
            wynik = obliczSt3s(obciazenie, dlugosc, srednica, kat, ksztalt, szerokosc, wysokosc);
            break;
			case "St7":
            wynik = obliczSt3s(obciazenie, dlugosc, srednica, kat, ksztalt, szerokosc, wysokosc);
            break;
        case "10":
            wynik = oblicz10(obciazenie, dlugosc, srednica, kat, ksztalt, szerokosc, wysokosc);
            break;
        default:
            wynik = "Nieznany rodzaj materiału.";
    }
    document.getElementById("raport").style.display = "block";
    document.getElementById("wynik").innerHTML = wynik;
    const raportSection = document.getElementById("raport");
    raportSection.scrollIntoView({ behavior: "smooth" });
	generujPDF(obciazenie, srednica, szerokosc, wysokosc, dlugosc, kat, wybranyKsztalt, wynik);
}
function obliczSt0s(obciazenie, dlugosc, srednica, kat, ksztalt, szerokosc, wysokosc){
    // Obliczenie naprężenia (MPa)
    let wynik = '';
	   let mom_bez;
	   let mom_bez_I;
	   let c;
	   wynik += `<h1>Próba skręcania</h1>\n`;
	const katRad = kat * (Math.PI / 180); // Konwersja kąta na radiany
    const moment = obciazenie * dlugosc; // Moment skręcający w Nm
	 if (ksztalt === "kolowy") {
        const srednicaM = srednica / 1000; // Konwersja średnicy na metry
        mom_bez = (Math.PI * Math.pow(srednicaM, 4) / 32).toFixed(10); // Moment bezwładności polarny dla przekroju kołowego
		c = srednicaM / 2;
		mom_bez_I = (Math.PI * Math.pow(srednicaM, 4) / 64).toFixed(10); 
    } else {
        const szerokoscM = szerokosc / 1000; // Konwersja szerokości na metry
        const wysokoscM = wysokosc / 1000; // Konwersja wysokości na metry
        mom_bez = ((szerokoscM * Math.pow(wysokoscM, 3) + wysokoscM * Math.pow(szerokoscM, 3)) / 12).toFixed(10); // Moment bezwładności polarny dla przekroju prostokątnego
		mom_bez_I = (szerokoscM * Math.pow(wysokoscM, 3)) / 12;
		c = (Math.max(szerokosc, wysokosc) / 2000);
    }
const naprezenie = ((moment * c) / mom_bez / 1000000).toFixed(2);
    if (naprezenie < 65) {
		wynik += `<b>Naprężenie styczne</b> wynosi: ${naprezenie} MPa<br>\n`;
		wynik += `<b>Moment skręcający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Moment bezwładności</b> wynosi: ${mom_bez_I} m<sup>4</sup> <br>\n`;
            } else if (naprezenie >= 65) {
        wynik += `<b>Naprężenie styczne</b> wynosi: ${naprezenie} MPa, więc przekroczyło wartość naprężenia dopuszczalnego na skręcanie. Materiał zacznie ulegać odkształceniu plastycznemu, co oznacza, że odkształcenie będzie trwałe i nieodwracalne, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Moment skręcający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Moment bezwładności</b> wynosi: ${mom_bez_I} m<sup>4</sup> <br>\n`;
	}
    return wynik;
}
function obliczSt3s(obciazenie, dlugosc, srednica, kat, ksztalt, szerokosc, wysokosc){
    // Obliczenie naprężenia (MPa)
       let wynik = '';
	   let mom_bez;
	   let mom_bez_I;
	   let c;
  wynik += `<h1>Próba skręcania</h1>\n`;
	const katRad = kat * (Math.PI / 180); // Konwersja kąta na radiany
    const moment = obciazenie * dlugosc; // Moment skręcający w Nm
	 if (ksztalt === "kolowy") {
        const srednicaM = srednica / 1000; // Konwersja średnicy na metry
        mom_bez = (Math.PI * Math.pow(srednicaM, 4) / 32).toFixed(10); // Moment bezwładności polarny dla przekroju kołowego
		c = srednicaM / 2;
		mom_bez_I = (Math.PI * Math.pow(srednicaM, 4) / 64).toFixed(10); 
    } else {
        const szerokoscM = szerokosc / 1000; // Konwersja szerokości na metry
        const wysokoscM = wysokosc / 1000; // Konwersja wysokości na metry
        mom_bez = ((szerokoscM * Math.pow(wysokoscM, 3) + wysokoscM * Math.pow(szerokoscM, 3)) / 12).toFixed(10); // Moment bezwładności polarny dla przekroju prostokątnego
		mom_bez_I = (szerokoscM * Math.pow(wysokoscM, 3)) / 12;
		c = (Math.max(szerokosc, wysokosc) / 2000);
    }
const naprezenie = ((moment * c) / mom_bez / 1000000).toFixed(2);
    if (naprezenie < 75) {
		wynik += `<b>Naprężenie styczne</b> wynosi: ${naprezenie} MPa<br>\n`;
		wynik += `<b>Moment skręcający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Moment bezwładności</b> wynosi: ${mom_bez_I} m<sup>4</sup> <br>\n`;
            } else if (naprezenie >= 75) {
       wynik += `<b>Naprężenie styczne</b> wynosi: ${naprezenie} MPa, więc przekroczyło wartość naprężenia dopuszczalnego na skręcanie. Materiał zacznie ulegać odkształceniu plastycznemu, co oznacza, że odkształcenie będzie trwałe i nieodwracalne, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Moment skręcający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Moment bezwładności</b> wynosi: ${mom_bez_I} m<sup>4</sup> <br>\n`;
	}
    return wynik;
}
function obliczSt4s(obciazenie, dlugosc, srednica, kat, ksztalt, szerokosc, wysokosc){
    // Obliczenie naprężenia (MPa)
let wynik = '';
	   let mom_bez;
	   let mom_bez_I;
	   let c;
	     wynik += `<h1>Próba skręcania</h1>\n`;
	const katRad = kat * (Math.PI / 180); // Konwersja kąta na radiany
    const moment = obciazenie * dlugosc; // Moment skręcający w Nm
	 if (ksztalt === "kolowy") {
        const srednicaM = srednica / 1000; // Konwersja średnicy na metry
        mom_bez = (Math.PI * Math.pow(srednicaM, 4) / 32).toFixed(10); // Moment bezwładności polarny dla przekroju kołowego
		c = srednicaM / 2;
		mom_bez_I = (Math.PI * Math.pow(srednicaM, 4) / 64).toFixed(10); 
    } else {
        const szerokoscM = szerokosc / 1000; // Konwersja szerokości na metry
        const wysokoscM = wysokosc / 1000; // Konwersja wysokości na metry
        mom_bez = ((szerokoscM * Math.pow(wysokoscM, 3) + wysokoscM * Math.pow(szerokoscM, 3)) / 12).toFixed(10); // Moment bezwładności polarny dla przekroju prostokątnego
		mom_bez_I = (szerokoscM * Math.pow(wysokoscM, 3)) / 12;
		c = (Math.max(szerokosc, wysokosc) / 2000);
	
    }
const naprezenie = ((moment * c) / mom_bez / 1000000).toFixed(2);
    if (naprezenie < 85) {
		wynik += `<b>Naprężenie styczne</b> wynosi: ${naprezenie} MPa<br>\n`;
		wynik += `<b>Moment skręcający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Moment bezwładności</b> wynosi: ${mom_bez_I} m<sup>4</sup> <br>\n`;
            } else if (naprezenie >= 85) {
      wynik += `<b>Naprężenie styczne</b> wynosi: ${naprezenie} MPa, więc przekroczyło wartość naprężenia dopuszczalnego na skręcanie. Materiał zacznie ulegać odkształceniu plastycznemu, co oznacza, że odkształcenie będzie trwałe i nieodwracalne, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Moment skręcający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Moment bezwładności</b> wynosi: ${mom_bez_I} m<sup>4</sup> <br>\n`;;
  	}
    return wynik;
}
function obliczSt5(obciazenie, dlugosc, srednica, kat, ksztalt, szerokosc, wysokosc){
    // Obliczenie naprężenia (MPa)
      let wynik = '';
	   let mom_bez;
	   let mom_bez_I;
	   let c;
	     wynik += `<h1>Próba skręcania</h1>\n`;
	const katRad = kat * (Math.PI / 180); // Konwersja kąta na radiany
    const moment = obciazenie * dlugosc; // Moment skręcający w Nm
	 if (ksztalt === "kolowy") {
        const srednicaM = srednica / 1000; // Konwersja średnicy na metry
        mom_bez = (Math.PI * Math.pow(srednicaM, 4) / 32).toFixed(10); // Moment bezwładności polarny dla przekroju kołowego
		c = srednicaM / 2;
		mom_bez_I = (Math.PI * Math.pow(srednicaM, 4) / 64).toFixed(10); 
    } else {
        const szerokoscM = szerokosc / 1000; // Konwersja szerokości na metry
        const wysokoscM = wysokosc / 1000; // Konwersja wysokości na metry
        mom_bez = ((szerokoscM * Math.pow(wysokoscM, 3) + wysokoscM * Math.pow(szerokoscM, 3)) / 12).toFixed(10); // Moment bezwładności polarny dla przekroju prostokątnego
		mom_bez_I = (szerokoscM * Math.pow(wysokoscM, 3)) / 12;
		c = (Math.max(szerokosc, wysokosc) / 2000);
    }
const naprezenie = ((moment * c) / mom_bez / 1000000).toFixed(2);
    if (naprezenie < 90) {
        
		wynik += `<b>Naprężenie styczne</b> wynosi: ${naprezenie} MPa<br>\n`;
		wynik += `<b>Moment skręcający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Moment bezwładności</b> wynosi: ${mom_bez_I} m<sup>4</sup> <br>\n`;
            } else if (naprezenie >= 90) {
        wynik += `<b>Naprężenie styczne</b> wynosi: ${naprezenie} MPa, więc przekroczyło wartość naprężenia dopuszczalnego na skręcanie. Materiał zacznie ulegać odkształceniu plastycznemu, co oznacza, że odkształcenie będzie trwałe i nieodwracalne, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Moment skręcający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Moment bezwładności</b> wynosi: ${mom_bez_I} m<sup>4</sup> <br>\n`;
	}
    return wynik;
}
function obliczSt6(obciazenie, dlugosc, srednica, kat, ksztalt, szerokosc, wysokosc){
    // Obliczenie naprężenia (MPa)
    let wynik = '';
	   let mom_bez;
	   let mom_bez_I;
	   let c;
	     wynik += `<h1>Próba skręcania</h1>\n`;
	const katRad = kat * (Math.PI / 180); // Konwersja kąta na radiany
    const moment = obciazenie * dlugosc; // Moment skręcający w Nm
	 if (ksztalt === "kolowy") {
        const srednicaM = srednica / 1000; // Konwersja średnicy na metry
        mom_bez = (Math.PI * Math.pow(srednicaM, 4) / 32).toFixed(10); // Moment bezwładności polarny dla przekroju kołowego
		c = srednicaM / 2;
		mom_bez_I = (Math.PI * Math.pow(srednicaM, 4) / 64).toFixed(10); 
    } else {
        const szerokoscM = szerokosc / 1000; // Konwersja szerokości na metry
        const wysokoscM = wysokosc / 1000; // Konwersja wysokości na metry
        mom_bez = ((szerokoscM * Math.pow(wysokoscM, 3) + wysokoscM * Math.pow(szerokoscM, 3)) / 12).toFixed(10); // Moment bezwładności polarny dla przekroju prostokątnego
		mom_bez_I = (szerokoscM * Math.pow(wysokoscM, 3)) / 12;
		c = (Math.max(szerokosc, wysokosc) / 2000);
    }
const naprezenie = ((moment * c) / mom_bez / 1000000).toFixed(2);
    if (naprezenie < 105) {
		wynik += `<b>Naprężenie styczne</b> wynosi: ${naprezenie} MPa<br>\n`;
		wynik += `<b>Moment skręcający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Moment bezwładności</b> wynosi: ${mom_bez_I} m<sup>4</sup> <br>\n`;
            } else if (naprezenie >= 105) {
       wynik += `<b>Naprężenie styczne</b> wynosi: ${naprezenie} MPa, więc przekroczyło wartość naprężenia dopuszczalnego na skręcanie. Materiał zacznie ulegać odkształceniu plastycznemu, co oznacza, że odkształcenie będzie trwałe i nieodwracalne, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Moment skręcający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Moment bezwładności</b> wynosi: ${mom_bez_I} m<sup>4</sup> <br>\n`;
	}
    return wynik;
}
function obliczSt7(obciazenie, dlugosc, srednica, kat, ksztalt, szerokosc, wysokosc){
    // Obliczenie naprężenia (MPa)
    let wynik = '';
	   let mom_bez;
	   let mom_bez_I;
	   let c;
	     wynik += `<h1>Próba skręcania</h1>\n`;
	const katRad = kat * (Math.PI / 180); // Konwersja kąta na radiany
    const moment = obciazenie * dlugosc; // Moment skręcający w Nm
	 if (ksztalt === "kolowy") {
        const srednicaM = srednica / 1000; // Konwersja średnicy na metry
        mom_bez = (Math.PI * Math.pow(srednicaM, 4) / 32).toFixed(10); // Moment bezwładności polarny dla przekroju kołowego
		c = srednicaM / 2;
		mom_bez_I = (Math.PI * Math.pow(srednicaM, 4) / 64).toFixed(10); 
    } else {
        const szerokoscM = szerokosc / 1000; // Konwersja szerokości na metry
        const wysokoscM = wysokosc / 1000; // Konwersja wysokości na metry
        mom_bez = ((szerokoscM * Math.pow(wysokoscM, 3) + wysokoscM * Math.pow(szerokoscM, 3)) / 12).toFixed(10); // Moment bezwładności polarny dla przekroju prostokątnego
		mom_bez_I = (szerokoscM * Math.pow(wysokoscM, 3)) / 12;
		c = (Math.max(szerokosc, wysokosc) / 2000);
    }
const naprezenie = ((moment * c) / mom_bez / 1000000).toFixed(2);
    	if (naprezenie < 115) {
		wynik += `<b>Naprężenie styczne</b> wynosi: ${naprezenie} MPa<br>\n`;
		wynik += `<b>Moment skręcający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Moment bezwładności</b> wynosi: ${mom_bez_I} m<sup>4</sup> <br>\n`;
            } else if (naprezenie >= 115) {
        wynik += `<b>Naprężenie styczne</b> wynosi: ${naprezenie} MPa, więc przekroczyło wartość naprężenia dopuszczalnego na skręcanie. Materiał zacznie ulegać odkształceniu plastycznemu, co oznacza, że odkształcenie będzie trwałe i nieodwracalne, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Moment skręcający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Moment bezwładności</b> wynosi: ${mom_bez_I} m<sup>4</sup> <br>\n`;
	}
    return wynik;
}
function oblicz10(obciazenie, dlugosc, srednica, kat, ksztalt, szerokosc, wysokosc){
    // Obliczenie naprężenia (MPa)
    let wynik = '';
	   let mom_bez;
	   let mom_bez_I;
	   let c;
	     wynik += `<h1>Próba skręcania</h1>\n`;
	const katRad = kat * (Math.PI / 180); // Konwersja kąta na radiany
    const moment = obciazenie * dlugosc; // Moment skręcający w Nm
	 if (ksztalt === "kolowy") {
        const srednicaM = srednica / 1000; // Konwersja średnicy na metry
        mom_bez = (Math.PI * Math.pow(srednicaM, 4) / 32).toFixed(10); // Moment bezwładności polarny dla przekroju kołowego
		c = srednicaM / 2;
		mom_bez_I = (Math.PI * Math.pow(srednicaM, 4) / 64).toFixed(10); 
    } else {
        const szerokoscM = szerokosc / 1000; // Konwersja szerokości na metry
        const wysokoscM = wysokosc / 1000; // Konwersja wysokości na metry
        mom_bez = ((szerokoscM * Math.pow(wysokoscM, 3) + wysokoscM * Math.pow(szerokoscM, 3)) / 12).toFixed(10); // Moment bezwładności polarny dla przekroju prostokątnego
		mom_bez_I = (szerokoscM * Math.pow(wysokoscM, 3)) / 12;
		c = (Math.max(szerokosc, wysokosc) / 2000);
    }
const naprezenie = ((moment * c) / mom_bez / 1000000).toFixed(2);
    	if (naprezenie < 65) {
		wynik += `<b>Naprężenie styczne</b> wynosi: ${naprezenie} MPa<br>\n`;
		wynik += `<b>Moment skręcający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Moment bezwładności</b> wynosi: ${mom_bez_I} m<sup>4</sup> <br>\n`;
            } else if (naprezenie >= 65) {
        wynik += `<b>Naprężenie styczne</b> wynosi: ${naprezenie} MPa, więc przekroczyło wartość naprężenia dopuszczalnego na skręcanie. Materiał zacznie ulegać odkształceniu plastycznemu, co oznacza, że odkształcenie będzie trwałe i nieodwracalne, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Moment skręcający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Moment bezwładności</b> wynosi: ${mom_bez_I} m<sup>4</sup> <br>\n`;
	}
    return wynik;
}
function usunPolskieZnaki(tekst) {
    return tekst.replace(/ą/g, 'a').replace(/ć/g, 'c')
                .replace(/ę/g, 'e').replace(/ł/g, 'l')
                .replace(/ń/g, 'n').replace(/ó/g, 'o')
                .replace(/ś/g, 's').replace(/ż/g, 'z')
                .replace(/ź/g, 'z')
                .replace(/Ą/g, 'A').replace(/Ć/g, 'C')
                .replace(/Ę/g, 'E').replace(/Ł/g, 'L')
                .replace(/Ń/g, 'N').replace(/Ó/g, 'O')
                .replace(/Ś/g, 'S').replace(/Ż/g, 'Z')
                .replace(/Ź/g, 'Z');
}  
function generujPDF(obciazenie, srednica, szerokosc, wysokosc, dlugosc, kat, wybranyKsztalt, wynik) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.addFont('Arial', 'normal', 'unicode');
    doc.setFont('Arial');
    const tytul = `Statyczna proba rozciagania`;
    const danewejsciowe = `Dane wejsciowe:`;
	const danewyjsciowe = `Dane wyjsciowe:`;	
    const ob = `Obciazenie: ${obciazenie}N`;
    const dp = `Dlugosc poczatkowa: ${dlugosc}m`;
    const k = `Kat: ${kat}stopni`;
    doc.text(tytul, 10, 10);
    doc.text(danewejsciowe, 10, 20);
    doc.text(ob, 10, 30);
    doc.text(dp, 10, 40);
    doc.text(k, 10, 50);
    if (srednica) {
        const s = `Srednica: ${srednica}mm`;
        doc.text(s, 10, 60);
		doc.text(danewyjsciowe, 10, 80);
const wynikCzystyTekst = usunPolskieZnaki(wynik.replace(/<[^>]*>?/gm, ''));
    const linieTekstu = wynikCzystyTekst.split('\n'); // Dzieli tekst na linie na podstawie znaku nowej linii
	const podzielonyTekst = doc.splitTextToSize(linieTekstu, 180);
doc.text(podzielonyTekst, 10, 90);
    }
		
        if (szerokosc) {
            const sz = `Szerokosc: ${szerokosc}mm`;
            doc.text(sz, 10, 60);
        }
        if (wysokosc) {
            const w = `Wysokosc: ${wysokosc}mm`;
            doc.text(w, 10, 70); // jeśli szerokość istnieje, umieść wysokość poniżej; jeśli nie, na tej samej pozycji
			doc.text(danewyjsciowe, 10, 90);
const wynikCzystyTekst = usunPolskieZnaki(wynik.replace(/<[^>]*>?/gm, ''));
    const linieTekstu = wynikCzystyTekst.split('\n'); // Dzieli tekst na linie na podstawie znaku nowej linii
	const podzielonyTekst = doc.splitTextToSize(linieTekstu, 180);

doc.text(podzielonyTekst, 10, 100);
        }
    doc.save('raport.pdf');
}

