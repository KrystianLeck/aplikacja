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
function generujRaport(wybranyKsztalt ) {
    const material = document.getElementById("material").value;
    const obciazenie = parseFloat(document.getElementById("obciazenie").value);
    const dlugosc = parseFloat(document.getElementById("dlugosc").value);
    const dlugosck = parseFloat(document.getElementById("dlugosck").value);
    const ksztalt = document.getElementById("ksztalt").value;

    let przekroj, srednica, szerokosc, wysokosc;

   if (ksztalt === "kolowy") {
        srednica = parseFloat(document.getElementById("srednica").value);
        if (isNaN(srednica) || srednica <= 0) {
            alert("Proszę wypełnić wszystkie pola formularza poprawnymi danymi.");
            return;
        }
        const srednicaM = srednica / 1000; 
        przekroj = Math.PI * Math.pow(srednicaM / 2, 2); 
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
    }

    if (!material || isNaN(obciazenie) || isNaN(dlugosc) || isNaN(dlugosck) || obciazenie <= 0 || dlugosc <= 0 || dlugosck <= 0) {
        alert("Proszę wypełnić wszystkie pola formularza poprawnymi danymi.");
        return;
    }
    let wynik = '';
    switch (material) {
        case "St0s":
            wynik = obliczSt0s(obciazenie, dlugosck, dlugosc, przekroj);
            break;
        case "St3s":
            wynik = obliczSt3s(obciazenie, dlugosck, dlugosc, przekroj);
            break;
        case "St4s":
            wynik = obliczSt4s(obciazenie, dlugosck, dlugosc, przekroj);
            break;
        case "St5":
            wynik = obliczSt5(obciazenie, dlugosck, dlugosc, przekroj);
            break;
        case "St6":
           wynik = obliczSt6(obciazenie, dlugosck, dlugosc, przekroj);
            break;
        case "St7":
          wynik = obliczSt7(obciazenie, dlugosck, dlugosc, przekroj);
            break;
        case "10":
            wynik = oblicz10(obciazenie, dlugosck, dlugosc, przekroj);
            break;
        default:
            wynik = "Nieznany rodzaj materiału.";
    }
    document.getElementById("raport").style.display = "block";
    document.getElementById("wynik").innerHTML = wynik;
	const raportSection = document.getElementById("raport");
    raportSection.scrollIntoView({ behavior: "smooth" });
	generujPDF(obciazenie, srednica, szerokosc, wysokosc, dlugosc, dlugosck, wybranyKsztalt, material, wynik);
}
function obliczSt0s(obciazenie, dlugosck, dlugosc, przekroj) {
    // Obliczenie naprężenia (MPa)
    let wynik = '';
    const naprezenie_pr = (obciazenie / przekroj)/1000000;
    const odksztalcenie = (dlugosc - dlugosck) / dlugosc;
    const modul = naprezenie_pr / odksztalcenie;
	const kr = 100; 
    const reMin = 195; 
    const rmMin = 320; 
	 wynik += `<h1>Próba ściskania</h1>\n`;
    if (naprezenie_pr < kr) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa<br>\n`;
        wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
        wynik += `<b>Moduł Younga</b> wynosi: ${modul.toFixed(2)} Mpa <br>\n`;
    } else if (naprezenie_pr >= kr && naprezenie_pr < reMin) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło wartość naprężenia dopuszczalnego na ściskanie , materiał zacznie ulegać odkształceniu plastycznemu, co oznacza, że odkształcenie będzie trwałe i nieodwracalne, nawet po usunięciu obciążenia.<br>`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
   } else if (naprezenie_pr >= reMin && naprezenie_pr < rmMin) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło granicę plastyczności , materiał zacznie płynąć, co oznacza, że odkształcenie będzie postępować bez zwiększania naprężenia. W praktyce oznacza to, że materiał zacznie się odkształcać w sposób niekontrolowany i może ulec uszkodzeniu.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
	} else {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło granicę wytrzymałości na ściskanie, materiał ulegnie zerwaniu. W przypadku próby ściskania, materiał może pęknąć lub ulec innym formom katastrofalnego uszkodzenia.\n`;
    }
	generujWykres(naprezenie_pr, odksztalcenie, kr, reMin, rmMin);
    return wynik;
}
function obliczSt3s(obciazenie, dlugosck, dlugosc, przekroj) {
    // Obliczenie naprężenia (MPa)
    let wynik = '';
    const naprezenie_pr = (obciazenie / przekroj)/1000000;
    const odksztalcenie = (dlugosc - dlugosck) / dlugosc;
    const modul = naprezenie_pr / odksztalcenie;
	const kr = 120; // Dopuszczalne naprężenie
    const reMin = 235; // Granica plastyczności
    const rmMin = 380; // Granica wytrzymałości
	wynik += `<h1>Próba ściskania</h1>\n`;
    if (naprezenie_pr < kr) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa<br>\n`;
        wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
        wynik += `<b>Moduł Younga</b> wynosi: ${modul.toFixed(2)} Mpa <br>\n`;
    } else if (naprezenie_pr >= kr && naprezenie_pr < reMin) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło wartość naprężenia dopuszczalnego na ściskanie , materiał zacznie ulegać odkształceniu plastycznemu, co oznacza, że odkształcenie będzie trwałe i nieodwracalne, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie_pr >= reMin && naprezenie_pr < rmMin) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło granicę plastyczności , materiał zacznie płynąć, co oznacza, że odkształcenie będzie postępować bez zwiększania naprężenia. W praktyce oznacza to, że materiał zacznie się odkształcać w sposób niekontrolowany i może ulec uszkodzeniu.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else {
         wynik += `<b>Naprężenie ściskającee</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło granicę wytrzymałości na ściskanie, materiał ulegnie zerwaniu. W przypadku próby ściskania, materiał może pęknąć lub ulec innym formom katastrofalnego uszkodzenia.\n`;
    }
	generujWykres(naprezenie_pr, odksztalcenie, kr, reMin, rmMin);
    return wynik;
}
function obliczSt4s(obciazenie, dlugosck, dlugosc, przekroj) {
    let wynik = '';
    const naprezenie_pr = (obciazenie / przekroj)/1000000;
    const odksztalcenie = (dlugosc - dlugosck) / dlugosc;
    const modul = naprezenie_pr / odksztalcenie;
	const kr = 130; // Dopuszczalne naprężenie
    const reMin = 275; // Granica plastyczności
    const rmMin = 440; // Granica wytrzymałości
	wynik += `<h1>Próba ściskania</h1>`;
    if (naprezenie_pr < kr) {
         wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa<br>\n`;
        wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
        wynik += `<b>Moduł Younga</b> wynosi: ${modul.toFixed(2)} Mpa <br>\n`;
    } else if (naprezenie_pr >= kr && naprezenie_pr < reMin) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło wartość naprężenia dopuszczalnego na ściskanie , materiał zacznie ulegać odkształceniu plastycznemu, co oznacza, że odkształcenie będzie trwałe i nieodwracalne, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie_pr >= reMin && naprezenie_pr < rmMin) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło granicę plastyczności , materiał zacznie płynąć, co oznacza, że odkształcenie będzie postępować bez zwiększania naprężenia. W praktyce oznacza to, że materiał zacznie się odkształcać w sposób niekontrolowany i może ulec uszkodzeniu.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else {
         wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło granicę wytrzymałości na ściskanie, materiał ulegnie zerwaniu. W przypadku próby ściskania, materiał może pęknąć lub ulec innym formom katastrofalnego uszkodzenia.\n`;
    }
	generujWykres(naprezenie_pr, odksztalcenie, kr, reMin, rmMin);
    return wynik;
}
  function obliczSt5(obciazenie, dlugosck, dlugosc, przekroj) {
    let wynik = '';
    const naprezenie_pr = (obciazenie / przekroj)/1000000;
    const odksztalcenie = (dlugosc - dlugosck) / dlugosc;
    const modul = naprezenie_pr / odksztalcenie;
	const kr = 145; // Dopuszczalne naprężenie
    const reMin = 295; // Granica plastyczności
    const rmMin = 490; // Granica wytrzymałości
	wynik += `<h1>Próba ściskania</h1>\n`;
    if (naprezenie_pr < kr) {
          wynik += `Naprężenie rozciągające wynosi: ${naprezenie_pr.toFixed(2)} MPa<br>\n`;
        wynik += `Odkształcenie materiału wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
        wynik += `Moduł Younga wynosi: ${modul.toFixed(2)} Mpa <br>\n`;
    } else if (naprezenie_pr >= kr && naprezenie_pr < reMin) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło wartość naprężenia dopuszczalnego na ściskanie , materiał zacznie ulegać odkształceniu plastycznemu, co oznacza, że odkształcenie będzie trwałe i nieodwracalne, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie_pr >= reMin && naprezenie_pr < rmMin) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło granicę plastyczności , materiał zacznie płynąć, co oznacza, że odkształcenie będzie postępować bez zwiększania naprężenia. W praktyce oznacza to, że materiał zacznie się odkształcać w sposób niekontrolowany i może ulec uszkodzeniu.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else {
         wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło granicę wytrzymałości na ściskanie, materiał ulegnie zerwaniu. W przypadku próby ściskania, materiał może pęknąć lub ulec innym formom katastrofalnego uszkodzenia.\n`;
    }
	generujWykres(naprezenie_pr, odksztalcenie, kr, reMin, rmMin);
    return wynik;
}
 function obliczSt6(obciazenie, dlugosck, dlugosc, przekroj) {
    let wynik = '';
    const naprezenie_pr = (obciazenie / przekroj)/1000000;
    const odksztalcenie = (dlugosc - dlugosck) / dlugosc;
    const modul = naprezenie_pr / odksztalcenie;
	const kr = 160; // Dopuszczalne naprężenie
    const reMin = 335; // Granica plastyczności
    const rmMin = 590; // Granica wytrzymałości
		wynik += `<h1>Próba ściskania</h1>\n`;
    if (naprezenie_pr < kr) {
         wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa<br>\n`;
        wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
        wynik += `<b>Moduł Younga</b> wynosi: ${modul.toFixed(2)} Mpa <br>\n`;
    } else if (naprezenie_pr >= kr && naprezenie_pr < reMin) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło wartość naprężenia dopuszczalnego na ściskanie , materiał zacznie ulegać odkształceniu plastycznemu, co oznacza, że odkształcenie będzie trwałe i nieodwracalne, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie_pr >= reMin && naprezenie_pr < rmMin) {
       wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło granicę plastyczności , materiał zacznie płynąć, co oznacza, że odkształcenie będzie postępować bez zwiększania naprężenia. W praktyce oznacza to, że materiał zacznie się odkształcać w sposób niekontrolowany i może ulec uszkodzeniu.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło granicę wytrzymałości na ściskanie, materiał ulegnie zerwaniu. W przypadku próby ściskania, materiał może pęknąć lub ulec innym formom katastrofalnego uszkodzenia.\n`;
    }
	generujWykres(naprezenie_pr, odksztalcenie, kr, reMin, rmMin);
    return wynik;
}
      function obliczSt7(obciazenie, dlugosck, dlugosc, przekroj) {
    let wynik = '';
    const naprezenie_pr = (obciazenie / przekroj)/1000000;
    const odksztalcenie = (dlugosc - dlugosck) / dlugosc;
    const modul = naprezenie_pr / odksztalcenie;
	const kr = 175; // Dopuszczalne naprężenie
    const reMin = 365; // Granica plastyczności
    const rmMin = 690; // Granica wytrzymałości
	wynik += `<h1>Próba ściskania</h1>\n`;
    if (naprezenie_pr < kr) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa<br>\n`;
        wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
        wynik += `<b>Moduł Younga</b> wynosi: ${modul.toFixed(2)} Mpa <br>\n`;
    } else if (naprezenie_pr >= kr && naprezenie_pr < reMin) {
       wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło wartość naprężenia dopuszczalnego na ściskanie , materiał zacznie ulegać odkształceniu plastycznemu, co oznacza, że odkształcenie będzie trwałe i nieodwracalne, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie_pr >= reMin && naprezenie_pr < rmMin) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło granicę plastyczności , materiał zacznie płynąć, co oznacza, że odkształcenie będzie postępować bez zwiększania naprężenia. W praktyce oznacza to, że materiał zacznie się odkształcać w sposób niekontrolowany i może ulec uszkodzeniu.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło granicę wytrzymałości na ściskanie, materiał ulegnie zerwaniu. W przypadku próby ściskania, materiał może pęknąć lub ulec innym formom katastrofalnego uszkodzenia.\n`;
    }
	generujWykres(naprezenie_pr, odksztalcenie, kr, reMin, rmMin);
    return wynik;
}
 function oblicz10(obciazenie, dlugosck, dlugosc, przekroj) {
    let wynik = '';
    const naprezenie_pr = (obciazenie / przekroj)/1000000;
    const odksztalcenie = (dlugosc - dlugosck) / dlugosc;
    const modul = naprezenie_pr / odksztalcenie;
	const kr = 105; // Dopuszczalne naprężenie
    const reMin = 205; // Granica plastyczności
    const rmMin = 335; // Granica wytrzymałości
	wynik += `<h1>Próba ściskania</h1>\n`;
    if (naprezenie_pr < kr) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa<br>\n`;
        wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
        wynik += `<b>Moduł Younga</b> wynosi: ${modul.toFixed(2)} Mpa <br>\n`;
    } else if (naprezenie_pr >= kr && naprezenie_pr < reMin) {
        wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło wartość naprężenia dopuszczalnego na ściskanie , materiał zacznie ulegać odkształceniu plastycznemu, co oznacza, że odkształcenie będzie trwałe i nieodwracalne, nawet po usunięciu obciążenia.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else if (naprezenie_pr >= reMin && naprezenie_pr < rmMin) {
       wynik += `<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło granicę plastyczności , materiał zacznie płynąć, co oznacza, że odkształcenie będzie postępować bez zwiększania naprężenia. W praktyce oznacza to, że materiał zacznie się odkształcać w sposób niekontrolowany i może ulec uszkodzeniu.<br>\n`;
		wynik += `<b>Odkształcenie materiału</b> wynosi: ${odksztalcenie.toFixed(2)} <br>\n`;
    } else {
         wynik += `<<b>Naprężenie ściskające</b> wynosi: ${naprezenie_pr.toFixed(2)} MPa więc przekroczyło granicę wytrzymałości na ściskanie, materiał ulegnie zerwaniu. W przypadku próby ściskania, materiał może pęknąć lub ulec innym formom katastrofalnego uszkodzenia.\n`;
    }
	generujWykres(naprezenie_pr, odksztalcenie, kr, reMin, rmMin);
    return wynik;
} 
function generujWykres(naprezenie_pr, odksztalcenie, kr, reMin, rmMin) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const naprezeniePoRmMin = rmMin - 0.05 * rmMin;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['0%', 'Naprężenie dopusczalne', 'Re Min', 'Rm Min', 'Zerwanie'],
            datasets: [{
                label: 'Naprężenie (MPa)',
                data: [0, kr, reMin, rmMin, naprezeniePoRmMin],
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
function generujPDF(obciazenie, srednica, szerokosc, wysokosc, dlugosc, dlugosck, wybranyKsztalt, material, wynik) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tytul = `Proba sciskania`;
    const danewejsciowe = `Dane wejsciowe:`;
	const danewyjsciowe = `Dane wyjsciowe:`;	
    const ob = `Obciazenie: ${obciazenie}N`;
    const dp = `Dlugosc poczatkowa: ${dlugosc}mm`;
    const dk = `Dlugosc koncowa: ${dlugosck}mm`;
    doc.text(tytul, 10, 10);
    doc.text(danewejsciowe, 10, 20);
    doc.text(ob, 10, 30);
    doc.text(dp, 10, 40);
    doc.text(dk, 10, 50);
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



