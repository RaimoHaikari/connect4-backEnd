# Neljä suora

Neljän suora pelin node.js:llä toteutettu backend toiminnallisuus.

## Palvelin

### Luokat

#### AI

**Muuttujat**

*static evaluationFunction*

**Funktiot**

*static isTerminalNode(board)*  
*static GoalTest(board, depth, piece)*  
*static ABMaxValue(board, depth, alpha, beta, node)*  
*static ABMinValue(board, depth, alpha, beta, node)*  

**Yleiskuvaus**

Tietokoneen siirron määrittävä luokka. Pohjana toimii minimax-algoritmi.

Lähtökohtana on ajatus, että kumpikin pelaaja haluaa voittaa ja pyrkii tekemään kannaltaan mahdollisimman hyviä siirtoja. Siirron hyvyyttä arvioidaan pisteyttämällä pelilaudalla siirron jälkeen vallitseva tilanne.

<a name="pisteytys">***Pisteytyksen perusperiaate on, että mikäli asema on pelaajan kannalta edullinen, arvosana on positiivinen luku. Mikäli puolestaan tietokone on voitolla, arvosana on negatiivinen luku.***</a> Sitä suurempi/pienempi luku on, mitä selkeämpi asema on. Kuinka luku lasketaan, määritellään evaluointifunktiolla.

##### evaluationFunction

Pelilaudan tilan arviointiin käytettävä funktio.

Luokka AI tarjoaa yleisluonteisen toiminnallisuuden, jonka avulla voidaan toteuttaa eri pelejä. Pelikohtainen Board-luokan ilmentymä määrittelee kunkin pelilaudan ominaisuudet ja evaluointifunktio pelitilanteen arvioinnin. Evaluointifunktio implementoidaan luokalla, joka toteuttaa rajapinnan scorePosition(board, piece).

Käytössä olevaan evaluointifunktioon päästään käsiksi muuttujan evaluationFunction kautta.

##### minmax

Minimax on raa'an voiman menetelmä, jossa tutkitaan kaikki mahdolliset tilat, joihin lähtötilanteesta voidaan päätyä, kun käytävissä ovat kaikki mahdolliset siirrot ja niiden vastasiirrot.

Kuinka pitkälle tulevaisuuteen kurkistetaan määritellään hakusyvyydellä.

Tässä sovelluksessa minimax algoritmi on jaettu kahteen osaan:

- ABMinValue, joka potentiaalisista vaihtoehdoista valitsee sen, johon liittyy mahdollisimman pieni arvo
- ABMaxValue, vastaavasti valitsee sen vaihtoehdon, joka palauttaa suurimman arvon.

Näin ollen:

- ABMinValue, valitsee tietokoneen kannalta parhaan siirron
- ABMaxValue, valitsee pelaajan kannalta parhaan siirron.


Molemmat funktiot palauttavat objektin, joka sisältää:

- valitun siirron, eli parhaan sarakkeen järjestysnumeron
- em. siirrolle lasketun arvon.

**Suorituksen kulku**

Sovellus hakee tietokoneen kannalta parasta siirtoa, joten liikkeelle lähdetään kutsumalla ABMinValue-funktiota.

Funktion toiminta jakaantuu kahteen osaa, esimmäisessä vaiheessa selvitetään ollaanko saavutettu lopputila. Lopputilalla tarkoitetaan joko:

- pelin päättymistä jommankumman pelaajan voittoon tai tasapeliin
- valitun hakusyvyyden saavuttamista.

Jos jompikumpi vaihtoehdoista toteutuu, palautetaan [asianmukainen arvo](#pisteytys). Päinvastaisessa tilanteessa jatketaan funktion jälkimmäiseen osaan, jonka tarkoitus on käydä läpi kaikki käytettävissä olevat siirtovaihtoehdot ja valita näistä paras.

Tässä jälkimmäisessä vaiheessa alkuperäisestä hakusyvyydestä vähennetään yksi ja tätä uutta arvoa käytetään tehtävien funktiokutsujen yhteydessä hakusyvyyden kertovan parametrin arvona. Näin varmistetaan, että hakusyvyys jossain vaiheessa saavutetaan, kun rekursion edetessä ABMinValue ja ABMaxValue kutsuvat toisiaan vuorotellen.

Kokeiluvaiheen aikana pidetään kirjaa parhaasta toistaiseksi löydetystä siirrosta.

Kokeilu toteutetaan silmukalla, jossa:

- asetetaan pelimerkki ruutuun
- kutsutaan ABMaxValue-funktiota ja välitetään pelilaudalla vallitseva tilanne parametrinä
- mikäli saatu palautusarvo on parempi kuin toistaiseksi paras tiedossa ollut siirto, päivitään parhaan siirron arvoa
- otetaan pelimerkki pois ruudusta

Kun kaikki vaihtoehdot on käyty läpi, palautetaan tieto siitä mikä siirto palautti parhaan arvon.

Edellä kuvattiin mitä tapahtuu yksittäisen ABMinValue kutsun aikana. Yleensä pyritään suunnittelemaan muutama siirto eteenpäin ja valitaan se vaihtoehto, jonka oletetaan johtavan parhaaseen lopputulemaan.

Kuinka pitkälle tulevaisuuteen kurkistetaan, ts. kuinka monta siirtovuoroa eteenpäin lasketaan, määritellään hakusyvyydellä.

Matkalla kohti valittua hakusyvyyttä funktiot ABMaxValue ja ABMinValue kutsuvat toisiaan vuorotellen. Kumpikin algoritmi valitsee tarjolla olevista vaihtoehdoista kannaltaan parhaan ja palauttaa tiedon valinnastaan kutsuhierarkiassa ylempänä olevalle tasolle, kunnes juuressa tehty valinta palautetaan tietokoneen siirtona.

![MinMax -algoritmin ajo, kun hakusyvyytenä on 1](/assets/miniMax_01.svg "MinMax -algoritmin suoritus")

Kuva esittää minimax algoritmin kulun, kun hakusyvyytenä on 1, jolloin maksimaalista arvoa hakeva ABMaxValue-funktio ei esitä takaisinkutsua ABMinValue-funktiolle.

##### GoalTest

Tutkitaan ollaanko saavutettu lopputila. Lopputila tarkoittaa sitä, että jompikumpi pelaaja voittaisi pelin tai on saavutettu rekursion maksimisyvyys.

![GoalTest](/assets/goalTest.svg "GoalTest funktio")

Funktio palauttaa objektin, jonka score-kentän arvo on jokin seuraavista:

|score |Tarkoittaa|
|:--- | :--- |
|pelaajan maksimipisteet| Pelaaja voittaa. Suuri luku, jonka arvo on määritelty Settings -luokassa.|
|tietokoneen maksimipisteet|Tietokone voittaa. Mahdollisimman pieni luku, jonka arvo on määritelty Settings-luokassa.|
|tasapeli|Peli päättyy ratkaisemattomaan. Neutraali luku, jonka arvon määritelty Settings-luokassa.|
|arvio pelilaudan tilasta|Evaluointifunktion määrittämä pistearvo pelilaudalla vallitsevasta tilanteesta. Vaihteluväli: suurempi kuin tietokoneen voitto ja pienempi kuin pelaajan voitto.|
|undefined|Peli ei ole päättymässä, eikä olla saavutettu hakusyvyyttä.|

#####  isTerminalNode

Peli päättyy mikäli:

- jompikumpi pelaajista voittaa
- jäljellä ei ole enää vapaita ruutuja

Pelilaudan tilan tallentavan luokan (Board) winningMove- ja getOpenCols funktioiden avulla selvitetään onko jokin kolmesta vaihtoehdosta toteutunut.


Funktio palauttaa objektin, jonka:

<table>
    <thead>
        <tr>
            <th>Kenttä</th>
            <th>Arvo</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>terminalNode</td>
            <td>true|false</td>
        <tr>
        <tr>
            <td>winningPiece</td>
            <td>
                <ul>
                    <li>PLAYER_PIECE. Settings-luokassa määritelty pelaajan pelimerkin kertova arvo.</li>
                    <li>AI_PIECE. Settings-luokassa määritelty tietoneen pelimerkin kertova arvo.</li>
                    <li>undefined</li>
                </ul>
            </td>
  </tbody>
</table>

![isTerminalNode](/assets/isTerminalNode.svg "isTerminalNode funktio")


