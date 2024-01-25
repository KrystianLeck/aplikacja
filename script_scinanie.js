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
    const material = document.getElementById("material").value;
    const obciazenie = parseFloat(document.getElementById("obciazenie").value);
    const dlugosc = parseFloat(document.getElementById("dlugosc").value);
    const przemieszczenie = parseFloat(document.getElementById("przemieszczenie").value);
	const ksztalt = document.getElementById("ksztalt").value;
	let przekroj, srednica, szerokosc, wysokosc, odksztalcenie;
    if (ksztalt === "kolowy") {
        srednica = parseFloat(document.getElementById("srednica").value);
        if (isNaN(srednica) || srednica <= 0) {
            alert("Proszę wypełnić wszystkie pola formularza poprawnymi danymi.");
            return;
        }
        const srednicaM = srednica / 1000; 
        przekroj = Math.PI * Math.pow(srednicaM / 2, 2); 
		odksztalcenie = (przemieszczenie/1000) / srednicaM; 
		
    } else {
        szerokosc = parseFloat(document.getElementById("szerokosc").value);
        wysokosc = parseFloat(document.getElementById("wysokosc").value);
        if (isNaN(szerokosc) || isNaN(wysokosc) || szerokosc <= 0 || wysokosc <= 0) {
            alert("Proszę wypełnić wszystkie pola formularza poprawnymi danymi.");
            return;
        }
        const szerokoscM = szerokosc / 1000; 
        const wysokoscM = wysokosc / 1000; 
        przekroj = szerokoscM * wysokoscM;
		odksztalcenie = (przemieszczenie/1000) / wysokoscM; 
    }
	
	 if (!material || isNaN(obciazenie) || isNaN(dlugosc) || isNaN(przemieszczenie) || obciazenie <= 0 || dlugosc <= 0 || przemieszczenie <= 0) {
        alert("Proszę wypełnić wszystkie pola formularza poprawnymi danymi.");
        return;
    }
let wynik = '';
    switch (material) {
        case "St0s":
            wynik = obliczSt0s(obciazenie, przemieszczenie, dlugosc, przekroj, odksztalcenie);
            break;
        case "St3s":
            wynik = obliczSt3s(obciazenie, przemieszczenie, dlugosc, przekroj, odksztalcenie);
            break;
        case "St4s":
            wynik = obliczSt4s(obciazenie, przemieszczenie, dlugosc, przekroj, odksztalcenie);
            break;
        case "St5":
            wynik = obliczSt5(obciazenie, przemieszczenie, dlugosc, przekroj, odksztalcenie);
            break;
        case "St6":
           wynik = obliczSt6(obciazenie, przemieszczenie, dlugosc, przekroj, odksztalcenie);
            break;
        case "St7":
          wynik = obliczSt7(obciazenie, przemieszczenie, dlugosc, przekroj, odksztalcenie);
            break;
        case "10":
            wynik = oblicz10(obciazenie, przemieszczenie, dlugosc, przekroj, odksztalcenie);
            break;
        default:
            wynik = "Nieznany rodzaj badania.";
    }
 document.getElementById("raport").style.display = "block";
    document.getElementById("wynik").innerHTML = wynik;
	const raportSection = document.getElementById("raport");
    raportSection.scrollIntoView({ behavior: "smooth" });
	generujPDF(obciazenie, srednica, szerokosc, wysokosc, dlugosc, przemieszczenie, wybranyKsztalt, material, wynik);
}
function obliczSt0s(obciazenie, przemieszczenie, dlugosc, przekroj, odksztalcenie){
    let wynik = '';
	const moment = obciazenie * (dlugosc/1000); // Moment ścinający
	const naprezenie = (obciazenie/ przekroj)/1000000;
	const modul= naprezenie / odksztalcenie;
	const ks = 65; // Dopuszczalne naprężenie
    const reMin = 195; // Granica plastyczności
    const rmMin = 320; // Granica wytrzymałości
	 wynik += `<h1>Próba ścinania</h1>\n`;
    if (naprezenie < ks) {
  wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa<br>\n`;
        wynik += `<b>Moment ścinający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moduł Kirchhoffa</b> wynosi: ${modul} MPa <br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie >= ks && naprezenie < reMin) {
         wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło wartość naprężenia, przy której materiał przechodzi w stan plastyczny a odkształcenie staje się nieodwracalne. Materiał zaczyna ulegać trwałemu odkształceniu, które nie zniknie po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else if (naprezenie >= reMin && naprezenie < rmMin) {
        wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną granicę plastyczności stali. Gdy stal przekroczy tę wartość, zaczyna płynąć, a odkształcenie staje się trwałe i nieodwracalne. W tym punkcie, materiał zaczyna płynąć, co oznacza, że odkształcenie jest trwałe, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
        wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną wartość wytrzymałości na ścinanie dla danego materiału. Po przekroczeniu wartości tej wartości, materiał osiąga maksymalne naprężenie, jakie może wytrzymać przed zerwaniem. W tym punkcie, materiał jest najbardziej rozciągnięty i najprawdopodobniej dojdzie do zerwania.\n`;
    }
generujWykres(naprezenie, odksztalcenie, ks, reMin, rmMin);
    return wynik;
}
function obliczSt3s(obciazenie, przemieszczenie, dlugosc, przekroj, odksztalcenie){
    let wynik = '';
	const moment = obciazenie * (dlugosc/1000); // Moment ścinający
	const naprezenie = (obciazenie / przekroj)/1000000;
	const modul= naprezenie / odksztalcenie;
	const ks = 75; // Dopuszczalne naprężenie
    const reMin = 235; // Granica plastyczności
    const rmMin = 380; // Granica wytrzymałości
	wynik += `<h1>Próba ścinania</h1>\n`;
    if (naprezenie < ks) {
  wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa<br>\n`;
        wynik += `<b>Moment ścinający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moduł Kirchhoffa</b> wynosi: ${modul} MPa <br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie >= ks && naprezenie < reMin) {
         wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło wartość naprężenia, przy której materiał przechodzi w stan plastyczny a odkształcenie staje się nieodwracalne. Materiał zaczyna ulegać trwałemu odkształceniu, które nie zniknie po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else if (naprezenie >= reMin && naprezenie < rmMin) {
        wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną granicę plastyczności stali. Gdy stal przekroczy tę wartość, zaczyna płynąć, a odkształcenie staje się trwałe i nieodwracalne. W tym punkcie, materiał zaczyna płynąć, co oznacza, że odkształcenie jest trwałe, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
       wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną wartość wytrzymałości na ścinanie dla danego materiału. Po przekroczeniu wartości tej wartości, materiał osiąga maksymalne naprężenie, jakie może wytrzymać przed zerwaniem. W tym punkcie, materiał jest najbardziej rozciągnięty i najprawdopodobniej dojdzie do zerwania.\n`;
    }
generujWykres(naprezenie, odksztalcenie, ks, reMin, rmMin);
    return wynik;
}
function obliczSt4s(obciazenie, przemieszczenie, dlugosc, przekroj, odksztalcenie){
    let wynik = '';
	const moment = obciazenie * (dlugosc/1000); // Moment ścinający
	const naprezenie = (obciazenie / przekroj)/1000000;
	const modul= naprezenie / odksztalcenie;
	const ks = 85; // Dopuszczalne naprężenie
    const reMin = 275; // Granica plastyczności
    const rmMin = 440; // Granica wytrzymałości
	wynik += `<h1>Próba ścinania</h1>\n`;
    if (naprezenie < ks) {
  wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa<br>\n`;
        wynik += `<b>Moment ścinający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moduł Kirchhoffa</b> wynosi: ${modul} MPa <br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie >= ks && naprezenie < reMin) {
         wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło wartość naprężenia, przy której materiał przechodzi w stan plastyczny a odkształcenie staje się nieodwracalne. Materiał zaczyna ulegać trwałemu odkształceniu, które nie zniknie po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else if (naprezenie >= reMin && naprezenie < rmMin) {
        wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną granicę plastyczności stali. Gdy stal przekroczy tę wartość, zaczyna płynąć, a odkształcenie staje się trwałe i nieodwracalne. W tym punkcie, materiał zaczyna płynąć, co oznacza, że odkształcenie jest trwałe, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
         wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną wartość wytrzymałości na ścinanie dla danego materiału. Po przekroczeniu wartości tej wartości, materiał osiąga maksymalne naprężenie, jakie może wytrzymać przed zerwaniem. W tym punkcie, materiał jest najbardziej rozciągnięty i najprawdopodobniej dojdzie do zerwania.\n`;
    }
generujWykres(naprezenie, odksztalcenie, ks, reMin, rmMin);
    return wynik;
}
function obliczSt5(obciazenie, przemieszczenie, dlugosc, przekroj, odksztalcenie){
    let wynik = '';
	const moment = obciazenie * (dlugosc/1000); // Moment ścinający
	const naprezenie = (obciazenie / przekroj)/1000000;
	const modul= naprezenie / odksztalcenie;
	const ks = 90; // Dopuszczalne naprężenie
    const reMin = 225; // Granica plastyczności
    const rmMin = 380; // Granica wytrzymałości
	wynik += `<h1>Próba ścinania</h1>\n`;
    if (naprezenie < ks) {
  wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa<br>\n`;
        wynik += `<b>Moment ścinający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moduł Kirchhoffa</b> wynosi: ${modul} MPa <br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie >= ks && naprezenie < reMin) {
         wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło wartość naprężenia, przy której materiał przechodzi w stan plastyczny a odkształcenie staje się nieodwracalne. Materiał zaczyna ulegać trwałemu odkształceniu, które nie zniknie po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else if (naprezenie >= reMin && naprezenie < rmMin) {
        wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną granicę plastyczności stali. Gdy stal przekroczy tę wartość, zaczyna płynąć, a odkształcenie staje się trwałe i nieodwracalne. W tym punkcie, materiał zaczyna płynąć, co oznacza, że odkształcenie jest trwałe, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
        wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną wartość wytrzymałości na ścinanie dla danego materiału. Po przekroczeniu wartości tej wartości, materiał osiąga maksymalne naprężenie, jakie może wytrzymać przed zerwaniem. W tym punkcie, materiał jest najbardziej rozciągnięty i najprawdopodobniej dojdzie do zerwania.\n`;
    }
generujWykres(naprezenie, odksztalcenie, ks, reMin, rmMin);
    return wynik;
}
function obliczSt6(obciazenie, przemieszczenie, dlugosc, przekroj, odksztalcenie){
    let wynik = '';
	const moment = obciazenie * (dlugosc/1000); // Moment ścinający
	const naprezenie = (obciazenie / przekroj)/1000000;
	const modul= naprezenie / odksztalcenie;
	const ks = 105; // Dopuszczalne naprężenie
    const reMin = 335; // Granica plastyczności
    const rmMin = 590; // Granica wytrzymałości
	wynik += `<h1>Próba ścinania</h1>\n`;
    if (naprezenie < ks) {
  wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa<br>\n`;
        wynik += `<b>Moment ścinający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moduł Kirchhoffa</b> wynosi: ${modul} MPa <br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie >= ks && naprezenie < reMin) {
         wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło wartość naprężenia, przy której materiał przechodzi w stan plastyczny a odkształcenie staje się nieodwracalne. Materiał zaczyna ulegać trwałemu odkształceniu, które nie zniknie po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else if (naprezenie >= reMin && naprezenie < rmMin) {
        wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną granicę plastyczności stali. Gdy stal przekroczy tę wartość, zaczyna płynąć, a odkształcenie staje się trwałe i nieodwracalne. W tym punkcie, materiał zaczyna płynąć, co oznacza, że odkształcenie jest trwałe, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
         wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną wartość wytrzymałości na ścinanie dla danego materiału. Po przekroczeniu wartości tej wartości, materiał osiąga maksymalne naprężenie, jakie może wytrzymać przed zerwaniem. W tym punkcie, materiał jest najbardziej rozciągnięty i najprawdopodobniej dojdzie do zerwania.\n`;
    }
generujWykres(naprezenie, odksztalcenie, ks, reMin, rmMin);
    return wynik;
}
function obliczSt7(obciazenie, przemieszczenie, dlugosc, przekroj, odksztalcenie){
    let wynik = '';
	const moment = obciazenie * (dlugosc/1000); // Moment ścinający
	const naprezenie = (obciazenie / przekroj)/1000000;
	const modul= naprezenie / odksztalcenie;
	const ks = 115; // Dopuszczalne naprężenie
    const reMin = 225; // Granica plastyczności
    const rmMin = 380; // Granica wytrzymałości
	wynik += `<h1>Próba ścinania</h1>\n`;
    if (naprezenie < ks) {
  wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa<br>\n`;
        wynik += `<b>Moment ścinający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moduł Kirchhoffa</b> wynosi: ${modul} MPa <br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie >= ks && naprezenie < reMin) {
         wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło wartość naprężenia, przy której materiał przechodzi w stan plastyczny a odkształcenie staje się nieodwracalne. Materiał zaczyna ulegać trwałemu odkształceniu, które nie zniknie po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else if (naprezenie >= reMin && naprezenie < rmMin) {
        wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną granicę plastyczności stali. Gdy stal przekroczy tę wartość, zaczyna płynąć, a odkształcenie staje się trwałe i nieodwracalne. W tym punkcie, materiał zaczyna płynąć, co oznacza, że odkształcenie jest trwałe, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
         wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną wartość wytrzymałości na ścinanie dla danego materiału. Po przekroczeniu wartości tej wartości, materiał osiąga maksymalne naprężenie, jakie może wytrzymać przed zerwaniem. W tym punkcie, materiał jest najbardziej rozciągnięty i najprawdopodobniej dojdzie do zerwania.\n`;
    }
generujWykres(naprezenie, odksztalcenie, ks, reMin, rmMin);
    return wynik;
}
function obliczSt10(obciazenie, przemieszczenie, dlugosc, przekroj, odksztalcenie){
    let wynik = '';
	const moment = obciazenie * (dlugosc/1000); // Moment ścinający
	const naprezenie = (obciazenie / przekroj)/1000000;
	const modul= naprezenie / odksztalcenie;
	const ks = 65; // Dopuszczalne naprężenie
    const reMin = 205; // Granica plastyczności
    const rmMin = 335; // Granica wytrzymałości
	wynik += `<h1>Próba ścinania</h1>\n`;
    if (naprezenie < ks) {
  wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa<br>\n`;
        wynik += `<b>Moment ścinający</b> wynosi: ${moment.toFixed(2)} Nm <br>\n`;
		wynik += `<b>Moduł Kirchhoffa</b> wynosi: ${modul} MPa <br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie >= ks && naprezenie < reMin) {
         wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło wartość naprężenia, przy której materiał przechodzi w stan plastyczny a odkształcenie staje się nieodwracalne. Materiał zaczyna ulegać trwałemu odkształceniu, które nie zniknie po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else if (naprezenie >= reMin && naprezenie < rmMin) {
        wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną granicę plastyczności stali. Gdy stal przekroczy tę wartość, zaczyna płynąć, a odkształcenie staje się trwałe i nieodwracalne. W tym punkcie, materiał zaczyna płynąć, co oznacza, że odkształcenie jest trwałe, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
        wynik += `<b>Naprężenie ścinające</b> wynosi: ${naprezenie.toFixed(2)} MPa więc przekroczyło minimalną wartość wytrzymałości na ścinanie dla danego materiału. Po przekroczeniu wartości tej wartości, materiał osiąga maksymalne naprężenie, jakie może wytrzymać przed zerwaniem. W tym punkcie, materiał jest najbardziej rozciągnięty i najprawdopodobniej dojdzie do zerwania.\n`;
    }
generujWykres(naprezenie, odksztalcenie, ks, reMin, rmMin);
    return wynik;
}
	function generujWykres(naprezenie_pr, odksztalcenie, ks, reMin, rmMin) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const naprezeniePoRmMin = rmMin - 0.05 * rmMin;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['0%', 'Naprężenie dopuszczalne', 'Re Min', 'Rm Min', 'Zerwanie'],
            datasets: [{
                label: 'Naprężenie (MPa)',
                data: [0, ks, reMin, rmMin, naprezeniePoRmMin],
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
function generujPDF(obciazenie, srednica, szerokosc, wysokosc, dlugosc, przemieszczenie, wybranyKsztalt, material, wynik) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const tytul = `Proba scinania`;
    const danewejsciowe = `Dane wejsciowe:`;
	const danewyjsciowe = `Dane wyjsciowe:`;	
    const ob = `Obciazenie: ${obciazenie}N`;
    const dp = `Dlugosc poczatkowa: ${dlugosc}mm`;
    const p = `Przemieszczenie poprzeczne: ${przemieszczenie}mm`;
    doc.text(tytul, 10, 10);
    doc.text(danewejsciowe, 10, 20);
    doc.text(ob, 10, 30);
    doc.text(dp, 10, 40);
    doc.text(p, 10, 50);
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
    setTimeout(function() {
        var canvas = document.getElementById('myChart');
        var chartImageBase64 = canvas.toDataURL('image/png');
		const wykres = `Wykres ukazujacy wartosci graniczne naprezenia dla stali ${material}`;
		doc.text(wykres, 10, 150);
        doc.addImage(chartImageBase64, 'PNG', 10, 160, 125, 100); // 

        doc.save('raport.pdf');
    }, 1000); 

}



	
