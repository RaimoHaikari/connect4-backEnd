# Neljä suora

Neljän suora pelin node.js:llä toteutettu backend toiminnallisuus.

## Palvelin

### Luokat

#### AI

Tietokoneen siirron määrittävä luokka. Pohjana toimii minimax-algoritmi.

Lähtökohtana on ajatus, että kumpikin pelaaja haluaa voittaa ja pyrkii tekemään kannaltaan mahdollisimman hyviä siirtoja. Siirron hyvyyttä arvioidaan pisteyttämällä pelilaudalla siirron jälkeen vallitseva tilanne.

Pisteytyksen perusperiaate on, että mikäli asema on pelaajan kannalta edullinen, arvosana on positiivinen luku. Mikäli puolestaan tietokone on voitolla, arvosana on negatiivinen luku. Sitä suurempi/pienempi luku on, mitä selkeämpi asema on. Kuinka luku lasketaan, määritellään evaluointifunktiolla.

##### minmax

Minimax on raa'an voiman menetelmä, jossa tutkitaan kaikki mahdolliset tilat, joihin lähtötilanteesta voidaan päätyä, kun käytävissä ovat kaikki mahdolliset siirrot ja niiden vastasiirrot.

Kuinka pitkälle tulevaisuuteen kurkistetaan määritellään hakusyvyydellä.

Tässä sovelluksessa minmax-algoritmi on jaettu kahteen osaan:

- ABMinValue, joka potentiaalisista vaihtoehdoista valitsee sen, johon liittyy mahdollisimman pieni arvo
- ABMaxValue, vastaavasti valitsee sen vaihtoehdon, joka palauttaa suurimman arvon.

Näin ollen:

- ABMinValue, valitsee tietokoneen kannalta parhaan siirron
- ABMaxValue, valitsee pelaajan kannalta parhaan siirron.


Molemmat funktiot palauttavat objektin, joka sisältää:

- valitun siirron, eli parhaan sarakkeen järjestysnumeron
- em. siirrolle lasketun arvon.

Sovellus hakee tietokoneen parasta siirtoa, joten liikkeelle lähdetään kutsumalla ABMinValue-funktiota.
Rekursion edetessä kohti hakusyvyyttä ABMinValue ja ABMaxValue kutsuvat toisiaan vuorotellen.

Evaluointifunktiota kutsutaan aina kun ollaan edetty hakusyvyyteen. 

Lopputilat suodattuvat hakupolussa ylempänä oleville tasoille siten, että kullakin tasolla valitaan aina se sarake, jota kautta on saavutettavissa paras tarjolla oleva lopputila, kunnes juuressa tehty valinta palautetaan tietokoneen siirtona.

