/**
 * app.js — Logika za Secret Santa aplikaciju
 *
 * Opis
 * ----
 * Upravljanje listom uposlenika (dodavanje/brisanje), validacija unosa,
 * spremanje u localStorage i generisanje slučajnih parova.
 *
 * Podaci
 * ------
 * Uposlenik:
 *   - kljuc: normalizovani string (lowercase, trim, single-space)
 *   - imeZaPrikaz: title-case varijanta za UI
 *
 * LocalStorage ključevi
 * ---------------------
 * - secret_santa_uposlenici: lista uposlenika
 * - secret_santa_rezultat: zadnji rezultat generisanja
 */




//uzmi el. sa stranice
const unosIme = document.getElementById("nameInput");
const btnDodaj = document.getElementById("addBtn");
const btnObrisiSve = document.getElementById("clearBtn");
const btnGenerisi = document.getElementById("genBtn");

const listaUposlenika = document.getElementById("employeeList");
const brojac = document.getElementById("count");
const prikazRezultata = document.getElementById("results");
const poruka = document.getElementById("msg");

//kljucevi za localStorage
const KLJUC_UPOSLENICI = "secret_santa_uposlenici";
const KLJUC_REZULTAT = "secret_santa_rezultat";

let uposlenici = ucitajUposlenike();
let zadnjiRezultat = ucitajRezultat();

// prvi prikaz kad se stranica ucita
prikaziUposlenike();
prikaziRezultat(zadnjiRezultat);

/**
 * Normalizuje tekst za internu identifikaciju (ključ).
 *
 * Parameters
 * ----------
 * tekst : string
 *     Ulazni tekst (ime/prezime).
 *
 * Returns
 * -------
 * string
 *     Normalizovan tekst: trim + lowercase + single-space.
 */

function napraviKljuc(tekst) {
  return (tekst || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Pretvara tekst u "Title Case" prema bs-BA lokalizaciji.
 *
 * Parameters
 * ----------
 * tekst : string
 *     Ulazni tekst (ime/prezime).
 *
 * Returns
 * -------
 * string
 *     Formatiran tekst.
 *
 * Notes
 * -----
 * Višestruki razmaci se svode na jedan.
 */

function uTitleCase(tekst) {
  const sredjeno = (tekst || "").trim().replace(/\s+/g, " ");
  if (!sredjeno) return "";
  return sredjeno
    .split(" ")
    .map(rijec => {
      const mala = rijec.toLocaleLowerCase("bs-BA");
      return mala.charAt(0).toLocaleUpperCase("bs-BA") + mala.slice(1);
    })
    .join(" ");
}



function ukloniDuplikate(lista) {
  const mapa = new Map();

  for (const u of lista) {
    if (!u || !u.kljuc) continue;

    if (!mapa.has(u.kljuc)) {
      mapa.set(u.kljuc, u);
    }
  }

  return Array.from(mapa.values());
}
/**
 * Uklanja duplikate iz liste uposlenika po polju `kljuc`.
 *
 * Parameters
 * ----------
 * lista : Array<Object>
 *     Lista objekata oblika { kljuc, imeZaPrikaz }.
 *
 * Returns
 * -------
 * Array<Object>
 *     Lista bez duplikata (zadržava prvi).
 */

function promijesaj(lista) {
  const a = [...lista];

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}
/**
 * Validira ime/prezime.
 *
 * Parameters
 * ----------
 * unos : string
 *     Tekst iz input polja.
 *
 * Returns
 * -------
 * Object
 *     { ispravno: boolean, razlog: string }
 *
 * Notes
 * -----
 * Dozvoljeno: slova (uključujući ČĆĐŠŽ i mala), razmak i crtica.
 * Zabranjeno: brojevi i specijalni znakovi.
 */

function provjeriIme(unos) {
  const s = (unos || "").trim();

  if (!s) {
    return { ispravno: false, razlog: "Unesite ime i/ili prezime." };
  }

  const imaSlovo = /[A-Za-zČĆĐŠŽčćđšž]/.test(s);
  if (!imaSlovo) {
    return { ispravno: false, razlog: "Ime mora sadržati slova." };
  }

  const dozvoljeno = /^[A-Za-zČĆĐŠŽčćđšž\s\-]+$/;
  if (!dozvoljeno.test(s)) {
    return { ispravno: false, razlog: "Neodgovarajuće ime (brojevi i specijalni znakovi nisu dozvoljeni)." };
  }

  if (/--/.test(s)) {
    return { ispravno: false, razlog: "Neodgovarajuće ime (provjerite crtice)." };
  }

  return { ispravno: true, razlog: "" };
}
/**
 * Prikazuje statusnu poruku korisniku.
 *
 * Parameters
 * ----------
 * tekst : string
 *     Sadržaj poruke.
 * tip : ('ok' | 'error' | '')
 *     Stil poruke.
 *
 * Returns
 * -------
 * void
 */
function prikaziPoruku(tekst, tip) {
  if (!poruka) return;

  poruka.textContent = tekst || "";

  // tip moze biti ili "ok" ili "error" 
  if (tip) poruka.className = "msg " + tip;
  else poruka.className = "msg";
}

/**
 * Sprema trenutnu listu uposlenika u localStorage.
 *
 * Returns
 * -------
 * void
 */

function spremiUposlenike() {
  localStorage.setItem(KLJUC_UPOSLENICI, JSON.stringify(uposlenici));
}
/**
 * Učitava listu uposlenika iz localStorage.
 *
 * Returns
 * -------
 * Array<Object>
 *     Lista uposlenika ili prazna lista ako ne postoji/greška.
 */
function ucitajUposlenike() {
  let lista = [];

  try {
    const raw = localStorage.getItem(KLJUC_UPOSLENICI);
    if (raw) {
      lista = JSON.parse(raw);
    }
  } catch (e) {
    lista = [];
  }
  return Array.isArray(lista) ? lista : [];
}
/**
 * Sprema zadnji rezultat generisanja u localStorage.
 *
 * Parameters
 * ----------
 * rez : Object
 *     Rezultat oblika { parovi: Array, bezPara: Array }.
 *
 * Returns
 * -------
 * void
 */
function spremiRezultat(rez) {
  localStorage.setItem(KLJUC_REZULTAT, JSON.stringify(rez));
}
/**
 * Učitava zadnji rezultat generisanja iz localStorage.
 *
 * Returns
 * -------
 * Object | null
 *     Rezultat ili null ako ne postoji.
 */
function ucitajRezultat() {
  let rez = null;

  try {
    const raw = localStorage.getItem(KLJUC_REZULTAT);
    if (raw) {
      rez = JSON.parse(raw);
    }
  } catch (e) {
    rez = null;
  }

  return rez;
}

/**
 * Uklanja jednog uposlenika po ključu, osvježava prikaz i briše zadnji rezultat.
 *
 * Parameters
 * ----------
 * kljuc : string
 *     Normalizovani ključ uposlenika.
 *
 * Returns
 * -------
 * void
 */
function ukloniJednog(kljuc) {
  uposlenici = uposlenici.filter(u => u.kljuc !== kljuc);

  spremiUposlenike();
  prikaziUposlenike();

  //lista se promijenila, brisemo zadnji rezultat da bude razumljivo
  zadnjiRezultat = null;
  localStorage.removeItem(KLJUC_REZULTAT);
  prikaziRezultat(null);

  prikaziPoruku("Uposlenik uklonjen.", "ok");
  setTimeout(() => prikaziPoruku("", ""), 1200);
}
/**
 * Generiše slučajne parove iz liste uposlenika.
 *
 * Parameters
 * ----------
 * listaObjekata : Array<Object>
 *     Lista uposlenika (može sadržavati duplikate).
 *
 * Returns
 * -------
 * Object
 *     Rezultat:
 *       - parovi: Array<{koIzvlaci: Uposlenik, kogaJeIzvukao: Uposlenik}>
 *       - bezPara: Array<Uposlenik>
 *
 * Notes
 * -----
 * - Nema X->X jer se parovi formiraju od dva različita elementa.
 * - Niko ne može izvući istu osobu više puta unutar jednog ciklusa biranja.
 * - Ako je neparan broj uposlenika, jedna osoba ostaje u 'bezPara'.
 */
function generisiParove(listaObjekata) {
  const jedinstveni = ukloniDuplikate(listaObjekata);

  if (jedinstveni.length < 2) {
    return { parovi: [], bezPara: jedinstveni };
  }

  const pool = promijesaj(jedinstveni);

  const parovi = [];
  let bezPara = [];

  for (let i = 0; i < pool.length; i += 2) {
    const a = pool[i];
    const b = pool[i + 1];

    if (!b) {
      bezPara = [a];
      break;
    }

    parovi.push({ koIzvlaci: a, kogaJeIzvukao: b });
  }

  return { parovi, bezPara };
}
/**
 * Renderuje listu uposlenika u UI.
 *
 * Returns
 * -------
 * void
 */
// prikazemo listu zaposlenika
function prikaziUposlenike() {
  const jedinstveni = ukloniDuplikate(uposlenici);

  brojac.textContent = String(jedinstveni.length);
  listaUposlenika.innerHTML = "";

  for (const u of jedinstveni) {
    const li = document.createElement("li");

    const red = document.createElement("div");
    red.className = "listRow";

    const tekst = document.createElement("span");
    tekst.textContent = u.imeZaPrikaz;

    const btnX = document.createElement("button");
    btnX.type = "button";
    btnX.className = "removeBtn";
    btnX.title = "Ukloni";
    btnX.textContent = "x";
    btnX.addEventListener("click", () => ukloniJednog(u.kljuc));

    red.appendChild(tekst);
    red.appendChild(btnX);
    li.appendChild(red);

    listaUposlenika.appendChild(li);
  }
}
/**
 * Renderuje rezultat generisanja (parovi + bez para) u UI.
 *
 * Parameters
 * ----------
 * rez : Object | null
 *     Rezultat ili null.
 *
 * Returns
 * -------
 * void
 */
// prikazi rezultate
function prikaziRezultat(rez) {
  prikazRezultata.innerHTML = "";

  if (!rez) {
    prikazRezultata.innerHTML = '<p class="small">Još nema generisanih parova.</p>';
    return;
  }

  const { parovi, bezPara } = rez;

  const wrap = document.createElement("div");

  const naslov = document.createElement("h3");
  naslov.textContent = "Uparivanje";
  wrap.appendChild(naslov);

  if (parovi && parovi.length) {
    const ul = document.createElement("ul");
    ul.className = "list";

    for (const p of parovi) {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${p.koIzvlaci.imeZaPrikaz}</strong> -> ${p.kogaJeIzvukao.imeZaPrikaz}`;
      ul.appendChild(li);
    }

    wrap.appendChild(ul);
  } else {
    const no = document.createElement("p");
    no.className = "small";
    no.textContent = "Nema dovoljno unosa za generisanje parova.";
    wrap.appendChild(no);
  }

  if (bezPara && bezPara.length) {
    const h4 = document.createElement("h4");
    h4.textContent = "Uposlenik bez para";
    wrap.appendChild(h4);

    const ul2 = document.createElement("ul");
    ul2.className = "list";

    for (const u of bezPara) {
      const li = document.createElement("li");
      li.textContent = u.imeZaPrikaz;
      ul2.appendChild(li);
    }

    wrap.appendChild(ul2);
  }

  prikazRezultata.appendChild(wrap);
}

//dogadjaji
btnDodaj.addEventListener("click", () => {
  const raw = unosIme.value;

  const provjera = provjeriIme(raw);
  if (!provjera.ispravno) {
    prikaziPoruku(provjera.razlog, "error");
    return;
  }

  const kljuc = napraviKljuc(raw);
  const imeZaPrikaz = uTitleCase(raw);

  uposlenici.push({ kljuc, imeZaPrikaz });
  uposlenici = ukloniDuplikate(uposlenici);

  unosIme.value = "";
  spremiUposlenike();
  prikaziUposlenike();

  prikaziPoruku("Dodano.", "ok");
  setTimeout(() => prikaziPoruku("", ""), 1200);
});

unosIme.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    btnDodaj.click();
  }
});

btnObrisiSve.addEventListener("click", () => {
  uposlenici = [];
  zadnjiRezultat = null;

  localStorage.removeItem(KLJUC_UPOSLENICI);
  localStorage.removeItem(KLJUC_REZULTAT);

  prikaziUposlenike();
  prikaziRezultat(null);

  prikaziPoruku("Lista obrisana.", "ok");
  setTimeout(() => prikaziPoruku("", ""), 1200);
});

btnGenerisi.addEventListener("click", () => {
  const jedinstveni = ukloniDuplikate(uposlenici);
  const rez = generisiParove(jedinstveni);

  zadnjiRezultat = rez;
  spremiRezultat(rez);
  prikaziRezultat(rez);

  prikaziPoruku("Parovi generisani.", "ok");
  setTimeout(() => prikaziPoruku("", ""), 1200);
});
