# EspressioneDanza — sito web

## Cos'è

Sito statico di presentazione della scuola: una sola pagina con corsi, insegnanti, galleria, mappa e contatti. **Non serve installare nulla**: per vederlo basta aprire `index.html` con il browser (doppio clic). Tutti i testi e le foto attuali sono **segnaposto** da sostituire con i contenuti reali.

## Come sostituire i contenuti

Ogni punto da personalizzare è marcato in `index.html` con un commento `<!-- SOSTITUISCI: ... -->`. Cerca la parola `SOSTITUISCI` nel file e segui questa tabella:

| Cosa | Dove (in `index.html`) | Come |
|---|---|---|
| **Telefono** | Sezione *Contatti* | Cambia sia il testo visibile `+39 333 0000000` sia il link `href="tel:+393330000000"` (formato internazionale, senza spazi) |
| **WhatsApp** | Bottone nell'*hero* e in *Contatti* | Sostituisci `393330000000` in entrambi i link `https://wa.me/...` (prefisso 39 + numero, senza `+` né spazi) |
| **Email** | Sezione *Contatti* | Cambia `info@espressionedanza.it` sia nel testo sia in `href="mailto:..."` |
| **Indirizzo** | Sezione *Dove siamo* | Cambia via, CAP e città nel blocco `<address>`, e la query del link "Apri in Google Maps" |
| **Indicazioni** | Sezione *Dove siamo* | Aggiorna la frase su mezzi pubblici e parcheggio |
| **Mappa** | Sezione *Dove siamo* | Vedi sotto: *Aggiornare la mappa* |
| **Orari dei corsi** | Le 3 card nella sezione *Corsi* | Una riga per corso, formato libero |
| **Orari segreteria** | Sezione *Contatti* | Testo libero |
| **Insegnanti** | Sezione *Insegnanti* | Nome, ruolo e bio in ogni card; per le foto vedi sotto |
| **Foto della galleria** | Sezione *Galleria* | Vedi sotto: *Sostituire le foto* |
| **Social** | Sezione *Contatti* | Sostituisci gli URL dei 4 link (Instagram, Facebook, TikTok, YouTube). Per eliminarne uno, cancella l'intero `<li>...</li>` |
| **P.IVA** | Footer | Sostituisci `00000000000` |
| **Titolo e descrizione Google** | `<head>` in alto | Aggiorna `<title>` e `<meta name="description">` se cambi città o testi |

### Aggiornare la mappa

1. Vai su [openstreetmap.org](https://www.openstreetmap.org) e cerca l'indirizzo della scuola.
2. Clicca **Condividi** (icona a destra), spunta **Includi marcatore**, scegli formato **HTML** e copia l'indirizzo che compare dentro `src="..."`.
3. Incolla quell'URL nel `src` dell'`<iframe>` nella sezione *Dove siamo*.

## Sostituire le foto

1. Copia le foto reali nella cartella `img/` (formato JPG, lato lungo di almeno **1200 px**; per gli insegnanti foto verticali, proporzione 3:4).
2. Nella *Galleria*, per ogni riquadro aggiorna **entrambi** i riferimenti: l'`href` del link `<a class="foto" ...>` e il `src` dell'`<img>` al suo interno (devono puntare allo stesso file). Aggiorna anche l'`alt` con una breve descrizione reale della foto.
3. Per gli *Insegnanti*, cambia il `src` dell'immagine di ogni card e l'`alt` con il nome reale.
4. Quando tutte le foto sono state sostituite, puoi cancellare i file `img/placeholder-*.svg`.

## Sostituire le icone social

I badge attuali (IG / FB / TT / YT) sono monogrammi disegnati apposta per stare bene con il resto. Se preferisci i loghi ufficiali: scarica gli SVG da [simpleicons.org](https://simpleicons.org), salvali in `img/` e sostituisci lo `<span aria-hidden="true">IG</span>` dentro ogni badge con `<img src="img/instagram.svg" alt="" width="20" height="20">` (lascia lo `<span class="sr-only">` com'è).

## Font

I font (Syne e Work Sans) sono **auto-ospitati** nella cartella `fonts/`: nessuna richiesta a Google a ogni visita (scelta consigliata per il GDPR). Se la cartella venisse persa, il sito continua a funzionare con i font di sistema.

## Pubblicare il sito

Il sito è fatto solo di file statici: va bene qualsiasi hosting. Tre strade:

**GitHub Pages (gratis)**
1. Crea un repository su GitHub e carica tutti i file (oppure `git push` se usi già git).
2. Nel repository: *Settings → Pages → Build and deployment → Deploy from a branch*, scegli il branch e la cartella `/ (root)`.
3. Dopo qualche minuto il sito è su `https://<utente>.github.io/<repository>/`.

**Netlify (gratis)**
1. Vai su [app.netlify.com/drop](https://app.netlify.com/drop).
2. Trascina l'intera cartella del sito nella pagina.
3. Fine: Netlify ti dà subito un indirizzo (personalizzabile).

**Hosting classico (FTP)**
1. Collegati con un client FTP (es. FileZilla) ai dati forniti dal tuo provider.
2. Carica **tutto il contenuto** della cartella (index.html, css/, js/, img/, fonts/) dentro `public_html/` (o `www/`).
3. Il sito è raggiungibile sul tuo dominio.

---

*Cartella `docs/`: specifica e piano di lavoro usati per costruire il sito — non serve pubblicarla (non è comunque un problema se resta).*
