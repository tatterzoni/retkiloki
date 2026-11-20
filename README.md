Retkiloki on tehty Pilvipalvelut web-kehityksessä -kurssin täydennystehtäväksi. Sovellus toimii kokonaan omalla koneella, koska Azurea ei käytetty tässä tehtävässä.

toiminta

Käyttäjä lisää retkimerkinnän (päivämäärä, paikka ja muistiinpano) ja näkee aiemmat merkinnät listana, uusin ensin.

Rakenne

Kansiossa api on Azure Functions -rajapinta (TypeScript, Node.js). Kansiossa web on käyttöliittymä (React, Vite ja TypeScript).

Rajapinnassa on kaksi funktiota. Funktio addEntry vastaanottaa POST-pyynnön osoitteeseen /api/addEntry ja lisää merkinnän. Pyynnön runko on JSON, jossa on kentät date, place ja note. Jos tietoja puuttuu, vastaus on 400. Funktio getEntries vastaa GET-pyyntöön osoitteessa /api/getEntries ja palauttaa kaikki merkinnät JSON-muodossa.

Funktiot ovat omissa tiedostoissaan. Merkinnät tallennetaan paikalliseen tiedostoon api/data/entries.json, joka syntyy automaattisesti ensimmäisen merkinnän yhteydessä. Tallennus on eristetty omaan tiedostoonsa (api/src/storage.ts), jotta sen voi myöhemmin vaihtaa tietokantaan.

Ajaminen paikallisesti

API käynnistetään api-kansiosta komennolla:
npm install
npm run build
func start

Käyttöliittymä käynnistetään web-kansiosta komennolla:
npm install
npm run dev

Sovellus löytyy osoitteesta http://localhost:5173.

Testaus

Rajapinta testattiin paikallisesti curl-komennoilla. Tulokset ovat tiedostossa TESTILOKI.md. Merkinnän lisäys vastasi 201, merkintöjen haku vastasi 200 ja virheellinen pyyntö vastasi 400. Käyttöliittymä testattiin selaimessa lisäämällä ja listaamalla merkintöjä.

Miten sama toteutettaisiin Azuressa

Käyttöliittymä vietäisiin Azure Static Web Appiin. Julkaisu tehtäisiin GitHub Actions -työnkululla, joka rakentaa sovelluksen ja vie sen palveluun.

Rajapinta vietäisiin Azure Function Appiin (Linux, Node). Käyttöönotto tehtäisiin VS Coden Azure Functions -laajennuksella.

JSON-tiedoston tilalle voitaisiin ottaa käyttöön tietokanta, esimerkiksi Cosmos DB. Azuressa tiedostoon tallentaminen ei ole luotettava ratkaisu, joten tiedot tallennettaisiin tietokantaan. Muutokset tehtäisiin pääasiassa storage.ts-tiedostoon.

Tietokannan yhteystiedot tallennettaisiin Function Appin sovellusasetuksiin. Käyttöliittymän kutsut ohjattaisiin Function Appin osoitteeseen ja CORS-asetuksiin lisättäisiin Static Web Appin osoite.

Resurssit luotaisiin Azureen, ja niiden määritykset voitaisiin tehdä myös koodina azd-templaatilla.