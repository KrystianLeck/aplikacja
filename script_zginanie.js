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
    const ugiecie = parseFloat(document.getElementById("ugiecie").value);
    const srednica = parseFloat(document.getElementById("srednica").value);
    // Weryfikacja wartości wejściowych
    if (!material || isNaN(obciazenie) || isNaN(dlugosc) || isNaN(ugiecie) ||
        (ksztalt === "kolowy" && isNaN(srednica)) ||
        (ksztalt !== "kolowy" && (isNaN(szerokosc) || isNaN(wysokosc)))) {
        alert("Proszę wypełnić wszystkie wymagane pola formularza poprawnymi danymi.");
        return;
    }
    if (obciazenie <= 0 || dlugosc <= 0 || ugiecie <= 0 ||
        (ksztalt === "kolowy" && srednica <= 0) ||
        (ksztalt !== "kolowy" && (szerokosc <= 0 || wysokosc <= 0))) {
        alert("Proszę wypełnić wszystkie wymagane pola formularza poprawnymi danymi.");
        return;
    }
    let wynik = '';
    switch (material) {
        case "St0s":
            wynik = obliczSt0s(obciazenie, dlugosc, srednica, ugiecie, ksztalt, szerokosc, wysokosc);
            break;
       case "St3s":
            wynik = obliczSt0s(obciazenie, dlugosc, srednica, ugiecie, ksztalt, szerokosc, wysokosc);
            break;
			case "St4s":
            wynik = obliczSt0s(obciazenie, dlugosc, srednica, ugiecie, ksztalt, szerokosc, wysokosc);
            break;
			case "St5s":
            wynik = obliczSt0s(obciazenie, dlugosc, srednica, ugiecie, ksztalt, szerokosc, wysokosc);
            break;
			case "St6s":
            wynik = obliczSt0s(obciazenie, dlugosc, srednica, ugiecie, ksztalt, szerokosc, wysokosc);
            break;
			case "St7s":
            wynik = obliczSt0s(obciazenie, dlugosc, srednica, ugiecie, ksztalt, szerokosc, wysokosc);
            break;
        default:
            wynik = "Nieznany rodzaj badania.";
			case "10":
            wynik = obliczSt0s(obciazenie, dlugosc, srednica, ugiecie, ksztalt, szerokosc, wysokosc);
            break;
    }
    document.getElementById("raport").style.display = "block";
    document.getElementById("wynik").innerHTML = wynik;
    const raportSection = document.getElementById("raport");
    raportSection.scrollIntoView({ behavior: "smooth" });
	generujPDF(obciazenie, srednica, szerokosc, wysokosc, dlugosc, ugiecie, wybranyKsztalt, material, wynik);
}
function obliczSt0s(obciazenie, dlugosc, srednica, ugiecie, ksztalt, szerokosc, wysokosc) {
    // Obliczenie naprężenia (MPa)
    let wynik = '';
	const kg = 120; // Dopuszczalne naprężenie
    const reMin = 195; // Granica plastyczności
    const rmMin = 320; // Granica wytrzymałości
	const srednicaM = srednica / 1000; // Konwersja średnicy na metry
	const moment = obciazenie * (dlugosc/1000); // Moment zginający
	let mom_bez;
	let c ;
	let naprezenie;
	wynik +=  `<h1>Próba zginania</h1>\n`
	if (ksztalt === "kolowy") { 
	mom_bez = (Math.PI * Math.pow(srednicaM, 4) / 64).toFixed(10); // Moment bezwładności w m^4
	c = srednicaM/2;
	 naprezenie = ((moment * c  / mom_bez)/1000000); // Naprężenie zginające
	}
	else 
	{
	szerokosc = szerokosc /1000;
	wysokosc = wysokosc /1000;
	 mom_bez = (szerokosc * Math.pow(wysokosc, 3)) / 12;
	 c = wysokosc/2;
	 naprezenie = ((moment * c / mom_bez)/1000000); // Naprężenie zginające
	}
	    const ugiecieM = ugiecie/1000;
    const odksztalcenie = ugiecieM/ dlugosc; // Odkształcenie (przybliżone)
    const modul = naprezenie / odksztalcenie; // Moduł Younga
	
    if (naprezenie < kg) {
		wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa<br>\n`;
		wynik += `<b>Moduł Younga</b> wynosi: ${modul.toFixed(2)} Mpa <br>\n`;
        wynik += `<b>Moment zginajacy</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie >= kg && naprezenie < reMin) {
         wynik += `<b>Naprężenie zginanie</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło wartość naprężenia, przy której materiał przechodzi w stan plastyczny a odkształcenie staje się nieodwracalne. Materiał zaczyna ulegać trwałemu odkształceniu, które nie zniknie po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else if (naprezenie >= reMin && naprezenie < rmMin ) {
        wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną granicę plastyczności stali. Gdy stal przekroczy tę wartość, zaczyna płynąć, a odkształcenie staje się trwałe i nieodwracalne. W tym punkcie, materiał zaczyna płynąć, co oznacza, że odkształcenie jest trwałe, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
        wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną wartość wytrzymałości na zginanie dla danego materiału. Po przekroczeniu wartości tej wartości, materiał osiąga maksymalne naprężenie, jakie może wytrzymać przed zerwaniem. W tym punkcie, materiał jest najbardziej rozciągnięty i najprawdopodobniej dojdzie do zerwania.\n`;
    }
generujWykres(naprezenie, odksztalcenie, kg, reMin, rmMin);
    return wynik;
}
function obliczSt3s(obciazenie, dlugosc, srednica, ugiecie, ksztalt, szerokosc, wysokosc) {
    // Obliczenie naprężenia (MPa)
    let wynik = '';
	const kg = 145; // Dopuszczalne naprężenie
    const reMin = 225; // Granica plastyczności
    const rmMin = 380; // Granica wytrzymałości
	const srednicaM = srednica / 1000; // Konwersja średnicy na metry
	const moment = obciazenie * (dlugosc/1000); // Moment zginający
	let mom_bez;
	let c ;
	let naprezenie;
	wynik +=  `<h1>Próba zginania</h1>\n`
	if (ksztalt === "kolowy") { 
	mom_bez = (Math.PI * Math.pow(srednicaM, 4) / 64).toFixed(10); // Moment bezwładności w m^4
	c = srednicaM/2;
	 naprezenie = ((moment * c  / mom_bez)/1000000); // Naprężenie zginające
	}
	else 
	{
		szerokosc = szerokosc /1000;
	wysokosc = wysokosc /1000;
	 mom_bez = (szerokosc * Math.pow(wysokosc, 3)) / 12;
	 c = wysokosc/2;
	 naprezenie = ((moment * c / mom_bez)/1000000); // Naprężenie zginające
	}
	    const ugiecieM = ugiecie/1000;
    const odksztalcenie = ugiecieM/ dlugosc; // Odkształcenie (przybliżone)
    const modul = naprezenie / odksztalcenie; // Moduł Younga
    if (naprezenie < kg) {
       wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa<br>\n`;
		wynik += `<b>Moduł Younga</b> wynosi: ${modul.toFixed(2)} Mpa <br>\n`;
        wynik += `<b>Moment zginajacy</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie >= kg && naprezenie < reMin) {
         wynik += `<b>Naprężenie zginanie</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło wartość naprężenia, przy której materiał przechodzi w stan plastyczny a odkształcenie staje się nieodwracalne. Materiał zaczyna ulegać trwałemu odkształceniu, które nie zniknie po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else if (naprezenie >= reMin && naprezenie < rmMin ) {
        wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną granicę plastyczności stali. Gdy stal przekroczy tę wartość, zaczyna płynąć, a odkształcenie staje się trwałe i nieodwracalne. W tym punkcie, materiał zaczyna płynąć, co oznacza, że odkształcenie jest trwałe, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
        wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną wartość wytrzymałości na zginanie dla danego materiału. Po przekroczeniu wartości tej wartości, materiał osiąga maksymalne naprężenie, jakie może wytrzymać przed zerwaniem. W tym punkcie, materiał jest najbardziej rozciągnięty i najprawdopodobniej dojdzie do zerwania.\n`;
    }
generujWykres(naprezenie, odksztalcenie, kg, reMin, rmMin);
    return wynik;
}
  function obliczSt4s(obciazenie, dlugosc, srednica, ugiecie, ksztalt, szerokosc, wysokosc) {
    // Obliczenie naprężenia (MPa)
    let wynik = '';
	const kg = 155; // Dopuszczalne naprężenie
    const reMin = 275; // Granica plastyczności
    const rmMin = 440; // Granica wytrzymałości
const srednicaM = srednica / 1000; // Konwersja średnicy na metry
	const moment = obciazenie * (dlugosc/1000); // Moment zginający
	let mom_bez;
	let c ;
	let naprezenie;
	wynik +=  `<h1>Próba zginania</h1>\n`
	if (ksztalt === "kolowy") { 
	mom_bez = (Math.PI * Math.pow(srednicaM, 4) / 64).toFixed(10); // Moment bezwładności w m^4
	c = srednicaM/2;
	 naprezenie = ((moment * c  / mom_bez)/1000000); // Naprężenie zginające
	}
	else 
	{
		szerokosc = szerokosc /1000;
	wysokosc = wysokosc /1000;
	 mom_bez = (szerokosc * Math.pow(wysokosc, 3)) / 12;
	 c = wysokosc/2;
	 naprezenie = ((moment * c / mom_bez)/1000000); // Naprężenie zginające
	}
	    const ugiecieM = ugiecie/1000;
    const odksztalcenie = ugiecieM/ dlugosc; // Odkształcenie (przybliżone)
    const modul = naprezenie / odksztalcenie; // Moduł Younga
    if (naprezenie <kg) {
      wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa<br>\n`;
		wynik += `<b>Moduł Younga</b> wynosi: ${modul.toFixed(2)} Mpa <br>\n`;
        wynik += `<b>Moment zginajacy</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie >= kg && naprezenie < reMin) {
         wynik += `<b>Naprężenie zginanie</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło wartość naprężenia, przy której materiał przechodzi w stan plastyczny a odkształcenie staje się nieodwracalne. Materiał zaczyna ulegać trwałemu odkształceniu, które nie zniknie po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else if (naprezenie >= reMin && naprezenie < rmMin ) {
        wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną granicę plastyczności stali. Gdy stal przekroczy tę wartość, zaczyna płynąć, a odkształcenie staje się trwałe i nieodwracalne. W tym punkcie, materiał zaczyna płynąć, co oznacza, że odkształcenie jest trwałe, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
       wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną wartość wytrzymałości na zginanie dla danego materiału. Po przekroczeniu wartości tej wartości, materiał osiąga maksymalne naprężenie, jakie może wytrzymać przed zerwaniem. W tym punkcie, materiał jest najbardziej rozciągnięty i najprawdopodobniej dojdzie do zerwania.\n`;
    }
generujWykres(naprezenie, odksztalcenie, kg, reMin, rmMin);
    return wynik;
}
  function obliczSt5(obciazenie, dlugosc, srednica, ugiecie, ksztalt, szerokosc, wysokosc) {
    // Obliczenie naprężenia (MPa)
    let wynik = '';
	const kg = 170; // Dopuszczalne naprężenie
    const reMin = 295; // Granica plastyczności
    const rmMin = 490; // Granica wytrzymałości
	const srednicaM = srednica / 1000; // Konwersja średnicy na metry
	const moment = obciazenie * (dlugosc/1000); // Moment zginający
	let mom_bez;
	let c ;
	let naprezenie;
	wynik +=  `<h1>Próba zginania</h1>\n`
	if (ksztalt === "kolowy") { 
	mom_bez = (Math.PI * Math.pow(srednicaM, 4) / 64).toFixed(10); // Moment bezwładności w m^4
	c = srednicaM/2;
	 naprezenie = ((moment * c  / mom_bez)/1000000); // Naprężenie zginające
	}
	else 
	{
		szerokosc = szerokosc /1000;
	wysokosc = wysokosc /1000;
	 mom_bez = (szerokosc * Math.pow(wysokosc, 3)) / 12;
	 c = wysokosc/2;
	 naprezenie = ((moment * c / mom_bez)/1000000); // Naprężenie zginające
	}
	    const ugiecieM = ugiecie/1000;
    const odksztalcenie = ugiecieM/ dlugosc; // Odkształcenie (przybliżone)
    const modul = naprezenie / odksztalcenie; // Moduł Younga
    if (naprezenie <kg) {
   wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa<br>\n`;
		wynik += `<b>Moduł Younga</b> wynosi: ${modul.toFixed(2)} Mpa <br>\n`;
        wynik += `<b>Moment zginajacy</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie >= kg && naprezenie < reMin) {
         wynik += `<b>Naprężenie zginanie</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło wartość naprężenia, przy której materiał przechodzi w stan plastyczny a odkształcenie staje się nieodwracalne. Materiał zaczyna ulegać trwałemu odkształceniu, które nie zniknie po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else if (naprezenie >= reMin && naprezenie < rmMin ) {
        wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną granicę plastyczności stali. Gdy stal przekroczy tę wartość, zaczyna płynąć, a odkształcenie staje się trwałe i nieodwracalne. W tym punkcie, materiał zaczyna płynąć, co oznacza, że odkształcenie jest trwałe, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
        wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną wartość wytrzymałości na zginanie dla danego materiału. Po przekroczeniu wartości tej wartości, materiał osiąga maksymalne naprężenie, jakie może wytrzymać przed zerwaniem. W tym punkcie, materiał jest najbardziej rozciągnięty i najprawdopodobniej dojdzie do zerwania.\n`;
    }
generujWykres(naprezenie, odksztalcenie, kg, reMin, rmMin);
    return wynik;
}
 function obliczSt6(obciazenie, dlugosc, srednica, ugiecie, ksztalt, szerokosc, wysokosc){
    // Obliczenie naprężenia (MPa)
    let wynik = '';
	const kg = 195; // Dopuszczalne naprężenie
    const reMin = 335; // Granica plastyczności
    const rmMin = 590; // Granica wytrzymałości
	const srednicaM = srednica / 1000; // Konwersja średnicy na metry
	const moment = obciazenie * (dlugosc/1000); // Moment zginający
	let mom_bez;
	let c ;
	let naprezenie;
	wynik +=  `<h1>Próba zginania</h1>\n`
	if (ksztalt === "kolowy") { 
	mom_bez = (Math.PI * Math.pow(srednicaM, 4) / 64).toFixed(10); // Moment bezwładności w m^4
	c = srednicaM/2;
	 naprezenie = ((moment * c  / mom_bez)/1000000); // Naprężenie zginające
	}
	else 
	{
		szerokosc = szerokosc /1000;
	wysokosc = wysokosc /1000;
	 mom_bez = (szerokosc * Math.pow(wysokosc, 3)) / 12;
	 c = wysokosc/2;
	 naprezenie = ((moment * c / mom_bez)/1000000); // Naprężenie zginające
	}
	    const ugiecieM = ugiecie/1000;
    const odksztalcenie = ugiecieM/ dlugosc; // Odkształcenie (przybliżone)
    const modul = naprezenie / odksztalcenie; // Moduł Younga
    if (naprezenie < kg) {
		wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa<br>\n`;
		wynik += `<b>Moduł Younga</b> wynosi: ${modul.toFixed(2)} Mpa <br>\n`;
        wynik += `<b>Moment zginajacy</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie>= kg && naprezenie < reMin) {
         wynik += `<b>Naprężenie zginanie</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło wartość naprężenia, przy której materiał przechodzi w stan plastyczny a odkształcenie staje się nieodwracalne. Materiał zaczyna ulegać trwałemu odkształceniu, które nie zniknie po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else if (naprezenie >= reMin && naprezenie < rmMin ) {
       wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną granicę plastyczności stali. Gdy stal przekroczy tę wartość, zaczyna płynąć, a odkształcenie staje się trwałe i nieodwracalne. W tym punkcie, materiał zaczyna płynąć, co oznacza, że odkształcenie jest trwałe, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
        wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną wartość wytrzymałości na zginanie dla danego materiału. Po przekroczeniu wartości tej wartości, materiał osiąga maksymalne naprężenie, jakie może wytrzymać przed zerwaniem. W tym punkcie, materiał jest najbardziej rozciągnięty i najprawdopodobniej dojdzie do zerwania.\n`;
    }
generujWykres(naprezenie, odksztalcenie, kg, reMin, rmMin);
    return wynik;
}
      function obliczSt7(obciazenie, dlugosc, srednica, ugiecie, ksztalt, szerokosc, wysokosc) {
    let wynik = '';
	const kg = 210; // Dopuszczalne naprężenie
    const reMin = 365; // Granica plastyczności
    const rmMin = 690; // Granica wytrzymałości
const srednicaM = srednica / 1000; // Konwersja średnicy na metry
	const moment = obciazenie * (dlugosc/1000); // Moment zginający
	let mom_bez;
	let c ;
	let naprezenie;
	wynik +=  `<h1>Próba zginania</h1>\n`
	if (ksztalt === "kolowy") { 
	mom_bez = (Math.PI * Math.pow(srednicaM, 4) / 64).toFixed(10); // Moment bezwładności w m^4
	c = srednicaM/2;
	 naprezenie = ((moment * c  / mom_bez)/1000000); // Naprężenie zginające
	}
	else 
	{
		szerokosc = szerokosc /1000;
	wysokosc = wysokosc /1000;
	 mom_bez = (szerokosc * Math.pow(wysokosc, 3)) / 12;
	 c = wysokosc/2;
	 naprezenie = ((moment * c / mom_bez)/1000000); // Naprężenie zginające
	}
	    const ugiecieM = ugiecie/1000;
    const odksztalcenie = ugiecieM/ dlugosc; // Odkształcenie (przybliżone)
    const modul = naprezenie / odksztalcenie; // Moduł Younga
    if (naprezenie < kg) {
       wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa<br>\n`;
		wynik += `<b>Moduł Younga</b> wynosi: ${modul.toFixed(2)} Mpa <br>\n`;
        wynik += `<b>Moment zginajacy</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie >= kg && naprezenie < reMin) {
         wynik += `<b>Naprężenie zginanie</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło wartość naprężenia, przy której materiał przechodzi w stan plastyczny a odkształcenie staje się nieodwracalne. Materiał zaczyna ulegać trwałemu odkształceniu, które nie zniknie po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else if (naprezenie >= reMin && naprezenie < rmMin ) {
        wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną granicę plastyczności stali. Gdy stal przekroczy tę wartość, zaczyna płynąć, a odkształcenie staje się trwałe i nieodwracalne. W tym punkcie, materiał zaczyna płynąć, co oznacza, że odkształcenie jest trwałe, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
        wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną wartość wytrzymałości na zginanie dla danego materiału. Po przekroczeniu wartości tej wartości, materiał osiąga maksymalne naprężenie, jakie może wytrzymać przed zerwaniem. W tym punkcie, materiał jest najbardziej rozciągnięty i najprawdopodobniej dojdzie do zerwania.\n`;
    }
generujWykres(naprezenie, odksztalcenie, kg, reMin, rmMin);
    return wynik;
}
 function oblicz10(obciazenie, dlugosc, srednica, ugiecie, ksztalt, szerokosc, wysokosc) {
    let wynik = '';
	const kg = 125; // Dopuszczalne naprężenie
    const reMin = 205; // Granica plastyczności
    const rmMin = 335; // Granica wytrzymałości
const srednicaM = srednica / 1000; // Konwersja średnicy na metry
	const moment = obciazenie * (dlugosc/1000); // Moment zginający
	let mom_bez;
	let c ;
	let naprezenie;
	wynik +=  `<h1>Próba zginania</h1>\n`
	if (ksztalt === "kolowy") { 
	mom_bez = (Math.PI * Math.pow(srednicaM, 4) / 64).toFixed(10); // Moment bezwładności w m^4
	c = srednicaM/2;
	 naprezenie = ((moment * c  / mom_bez)/1000000); // Naprężenie zginające
	}
	else 
	{
		szerokosc = szerokosc /1000;
	wysokosc = wysokosc /1000;
	 mom_bez = (szerokosc * Math.pow(wysokosc, 3)) / 12;
	 c = wysokosc/2;
	 naprezenie = ((moment * c / mom_bez)/1000000); // Naprężenie zginające
	}
	    const ugiecieM = ugiecie/1000;
    const odksztalcenie = ugiecieM/ dlugosc; // Odkształcenie (przybliżone)
    const modul = naprezenie / odksztalcenie; // Moduł Younga
    if (naprezenie < kg) {
        wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa<br>\n`;
		wynik += `<b>Moduł Younga</b> wynosi: ${modul.toFixed(2)} Mpa <br>\n`;
        wynik += `<b>Moment zginajacy</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moment bezwładności polarny</b> wynosi: ${mom_bez} m<sup>4</sup> <br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie >= kg && naprezenie < reMin) {
         wynik += `<b>Naprężenie zginanie</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło wartość naprężenia, przy której materiał przechodzi w stan plastyczny a odkształcenie staje się nieodwracalne. Materiał zaczyna ulegać trwałemu odkształceniu, które nie zniknie po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else if (naprezenie >= reMin && naprezenie < rmMin ) {
        wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną granicę plastyczności stali. Gdy stal przekroczy tę wartość, zaczyna płynąć, a odkształcenie staje się trwałe i nieodwracalne. W tym punkcie, materiał zaczyna płynąć, co oznacza, że odkształcenie jest trwałe, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
        wynik += `<b>Naprężenie zginające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną wartość wytrzymałości na zginanie dla danego materiału. Po przekroczeniu wartości tej wartości, materiał osiąga maksymalne naprężenie, jakie może wytrzymać przed zerwaniem. W tym punkcie, materiał jest najbardziej rozciągnięty i najprawdopodobniej dojdzie do zerwania.\n`;
    }
generujWykres(naprezenie, odksztalcenie, kg, reMin, rmMin);
    return wynik;
	} 
	function generujWykres(naprezenie_pr, odksztalcenie, kg, reMin, rmMin) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const naprezeniePoRmMin = rmMin - 0.05 * rmMin;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['0%', 'Naprężenie dopuszczalne', 'Re Min', 'Rm Min', 'Zerwanie'],
            datasets: [{
                label: 'Naprężenie (MPa)',
                data: [0, kg, reMin, rmMin, naprezeniePoRmMin],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                pointRadius: [5, 5, 5, 5, 0],
                pointHoverRadius: [5, 5, 5, 5, 0],
                pointBackgroundColor: 'rgb(75, 192, 192)',
                segment: {
                    borderColor: ctx => {
                        const index = ctx.p0DataIndex; // p0DataIndex oznacza indeks punktu początkowego segmentu
                        if (index === 0) return 'rgb(153, 255, 51)';
                        if (index === 1) return 'rgb(255, 204, 0)';
                        if (index === 2) return 'rgb(255, 153, 51)';
                        if (index === 3) return 'rgb(204, 0, 0)';
                        return 'rgb(75, 192, 192)';
                    }
                }
            }]
        },
        options: {
            responsive: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Naprężenie [MPa]'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Etap Próby'
                    }
                }
            }
        }
    });
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
function generujPDF(obciazenie, srednica, szerokosc, wysokosc, dlugosc, ugiecie, wybranyKsztalt, material, wynik) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const tytul = `Proba zginania`;
    const danewejsciowe = `Dane wejsciowe:`;
	const danewyjsciowe = `Dane wyjsciowe:`;	
    const ob = `Obciazenie: ${obciazenie}N`;
    const dp = `Dlugosc poczatkowa: ${dlugosc}mm`;
    const u = `Maksymalne ugiecie: ${ugiecie}mm`;
    doc.text(tytul, 10, 10);
    doc.text(danewejsciowe, 10, 20);
    doc.text(ob, 10, 30);
    doc.text(dp, 10, 40);
    doc.text(u, 10, 50);
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
            doc.text(w, 10, 70); 
			doc.text(danewyjsciowe, 10, 90);
	const wynikCzystyTekst = usunPolskieZnaki(wynik.replace(/<[^>]*>?/gm, ''));
    const linieTekstu = wynikCzystyTekst.split('\n'); // Dzieli tekst na linie na podstawie znaku nowej linii
	const podzielonyTekst = doc.splitTextToSize(linieTekstu, 180);
		doc.text(podzielonyTekst, 10, 100);
        }
    setTimeout(function() {
        var canvas = document.getElementById('myChart');
        var chartImageBase64 = canvas.toDataURL('image/png');
		const wykres = `Wykres ukazujacy wartosci graniczne naprezenia dla stali ${material}`;
		doc.text(wykres, 10, 150);
        doc.addImage(chartImageBase64, 'PNG', 10, 160, 125, 100); // 

        doc.save('raport.pdf');
    }, 1000); 

}
