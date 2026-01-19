# Secret Santa

## Opis projekta

Secret Santa je web aplikacija za slučajno uparivanje uposlenika u parove za darivanje.
Aplikacija omogućava unos liste uposlenika, generisanje slučajnih parova i prikaz rezultata.
Podaci se čuvaju lokalno u pregledniku korištenjem 'localStorage', tako da ostaju dostupni i nakon ponovnog učitavanja stranice.

Cilj projekta je demonstracija rada sa DOM-om, obrade korisničkog unosa, upravljanja stanjem aplikacije i osnovne logike u JavaScript-u.

---

## Funkcionalnosti

- Dodavanje uposlenika uz validaciju unosa
- Sprječavanje duplikata (ne razlikuje velika i mala slova)
- Brisanje pojedinačnih uposlenika i kompletne liste
- Generisanje slučajnih parova
- Prikaz uposlenika bez para (u slučaju neparnog broja unosa)
- Automatsko spremanje liste i zadnjih generisanih parova u 'localStorage'

---

## Tehnologije

- HTML5  
- CSS3  
- JavaScript (ES6+)  
- Web Storage API ('localStorage')

---

## Struktura projekta

```text
secret-santa/
├── assets/
│   └── djedmraz.jpg
├── docs/
│   ├── jsdoc/
│   │   ├── fonts/
│   │   ├── scripts/
│   │   ├── styles/
│   │   ├── app.js.html
│   │   ├── global.html
│   │   └── index.html
│   ├── arhitektura.png
│   └── sekvencijskidijagram.jpg
├── app.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── styles.css
 ```

Sve putanje u projektu su relativne, što omogućava pokretanje aplikacije na drugom računaru bez izmjena u kodu.


---

## Opis rješenja

### Unos i validacija uposlenika
- Unos ne smije biti prazan
- Mora sadržati slova
- Dozvoljeni znakovi: slova (uključujući č, ć, đ, š, ž), razmak i crtica ('-')
- Zabranjeni su brojevi i specijalni znakovi
- Duplikati se uklanjaju normalizacijom unosa (trim, lowercase, jedinstveni razmaci)

### Generisanje parova
- Lista uposlenika se nasumično miješa
- Parovi se formiraju po dva uposlenika ('A → B')
- Ako postoji neparan broj uposlenika, jedan ostaje bez para i prikazuje se posebno

### Čuvanje podataka
- Lista uposlenika se čuva pod ključem 'secret_santa_uposlenici'
- Zadnje generisani parovi se čuvaju pod ključem 'secret_santa_rezultat'

---

## Arhitektura aplikacije

Aplikacija je podijeljena na tri logičke cjeline:

1. **Korisnički interfejs (UI)**  
   Prikaz unosa, liste uposlenika, poruka i rezultata.

2. **Logika aplikacije**  
   Validacija unosa, normalizacija imena, generisanje parova i upravljanje stanjem aplikacije.

3. **Pohrana podataka**  
   Spremanje i učitavanje podataka iz 'localStorage'.

---

## Dijagrami

## Dijagram arhitekture

Dijagram arhitekture prikazuje osnovnu strukturu aplikacije i odnos između njenih
glavnih komponenti: korisničkog interfejsa, aplikacione logike i sloja za pohranu podataka.

Korisnički interfejs (HTML i CSS) zadužen je isključivo za prikaz podataka i prikupljanje
korisničkih akcija, koje se dalje prosljeđuju aplikacionoj logici. Logika aplikacije,
implementirana u JavaScript-u, obrađuje korisničke događaje, vrši validaciju i generisanje
parova, te upravlja stanjem aplikacije.

Sloj za pohranu podataka (`localStorage`) koristi se za trajno čuvanje liste uposlenika i
zadnje generisanih parova. Pristup `localStorage`-u vrši isključivo aplikaciona logika,
što osigurava jasnu separaciju odgovornosti između komponenti.

Dijagram arhitekture izrađen je u alatu draw.io i priložen kao dio tehničke dokumentacije.
<div align="center">

<img src=".../arhitektura.png" width="700">

</div>

## Sekvencijski dijagram

Sekvencijski dijagram prikazuje tok interakcije između korisnika, korisničkog interfejsa,
aplikacione logike i 'localStorage' tokom dvije glavne funkcionalnosti aplikacije:
dodavanja uposlenika i generisanja parova.

Tok započinje korisničkom akcijom (unos imena ili klik na dugme), nakon čega UI
prosljeđuje događaj aplikacionoj logici. Unutar logike se vrši validacija i
normalizacija unosa, odnosno miješanje liste i generisanje parova. Nakon obrade,
podaci se spremaju u 'localStorage', a rezultat se vraća korisničkom interfejsu
radi prikaza ažurirane liste ili generisanih parova.

Dijagram jasno razdvaja odgovornosti između UI-a, logike aplikacije i sloja za
pohranu podataka, što olakšava razumijevanje toka aplikacije i njene arhitekture.
<div align="center">

<img src=".../sekvencijskidijagram.jpg" width="700">

</div>

---

## Pokretanje aplikacije

### Opcija 1: Lokalni server (preporučeno)
1. Otvoriti projekat u Visual Studio Code
2. Instalirati ekstenziju **Live Server**
3. Pokrenuti 'index.html' putem Live Servera

### Opcija 2: Direktno pokretanje
- Otvoriti 'index.html' u web pregledniku  
(Napomena: ponašanje 'localStorage' može zavisiti od browsera)

---

## Ograničenja

- Aplikacija je frontend-only rješenje
- 'localStorage' nije namijenjen za čuvanje osjetljivih podataka
- Podaci nisu dijeljeni između različitih uređaja ili preglednika

---

## Moguće nadogradnje

- Autentikacija i autorizacija korisnika
- Izvoz rezultata (CSV / PDF)
- Naprednija pravila uparivanja

---
## Dokumentacija

Tehnička dokumentacija aplikacije generisana je pomoću alata **JSDoc**.

Dokumentacija sadrži:
- opis strukture projekta
- opis aplikacione logike
- dokumentovane JavaScript funkcije
- arhitekturni i sekvencijski dijagram

### Lokacija dokumentacije

Generisana HTML dokumentacija nalazi se u folderu: docs/jsdoc/

Glavna ulazna stranica dokumentacije je: docs/jsdoc/index.html

### Kako otvoriti dokumentaciju

1. Otvoriti root folder projekta ('secret-santa')
2. Doći u u folder 'docs/jsdoc'
3. Otvoriti fajl 'index.html' u web pregledniku

Alternativno, dokumentaciju je moguće otvoriti iz terminala:

```bash
start docs/jsdoc/index.html

```