document.addEventListener('DOMContentLoaded', () => {
    // Hent referanser til HTML-elementer
    const startButton = document.getElementById('start-button');
    const backgroundMusic = document.getElementById('background-music');
    const pages = document.querySelectorAll('.page'); // Alle "sidene"
    const feedbackDivs = document.querySelectorAll('.feedback'); // Alle feedback-divs
    const checkButtons = document.querySelectorAll('.check-answer-btn'); // Alle sjekk-knapper

    // ----- DEFINER KODEORDENE HER -----
    // Viktig: Disse MÅ matche det du legger ut fysisk (lapper, bokstaver etc.)
    // og det den voksne sier. Skriv dem med STORE BOKSTAVER her.
    const correctCodes = {
        post1: 'SØLVE',     // Kodeord fra ballongene
        post2: 'SOL',       // Kodeord fra lappen ved Bestas hus (endre om nødvendig)
        post3: 'POTETGULL', // Kodeord fra voksen etter potetløp (endre om nødvendig)
        post4: 'DANSEGLEDE',// Kodeord fra voksen etter dans (endre om nødvendig)
        post5: 'HARE'       // Kodeord fra siste gjemmested (endre om nødvendig)
    };
    // ------------------------------------

    // Funksjon for å vise en spesifikk side og skjule resten
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('visible'); // Skjul alle sider
        });
        const nextPage = document.getElementById(pageId);
        if (nextPage) {
            nextPage.classList.add('visible'); // Vis den ønskede siden
        } else {
            console.error("Kunne ikke finne side med ID:", pageId);
        }
    }

    // Forsøk å spille av muted musikk ved lasting via HTML-attributter
    // Vi stoler på 'autoplay muted' i HTML for den første starten.
    // Et ekstra play()-kall her kan hjelpe i noen scenarioer, men kan også gi konsollfeil.
    console.log("Forsøker å spille av muted musikk via HTML attributter...");
    backgroundMusic.play().catch(e => console.log("Muted autoplay feilet initielt (ofte normalt):", e));

    // Event listener for startknappen
    startButton.addEventListener('click', () => {
        // Fjern mute når brukeren interagerer
        backgroundMusic.muted = false;

        // Prøv å spille igjen hvis den av en eller annen grunn pauset (viktig backup)
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(error => {
                console.log("Musikkavspilling ved klikk feilet:", error);
                // Vurder en bruker-melding her hvis det er kritisk at musikken spiller
            });
        }

        // Vis neste side (første post)
        showPage('post-1-page');
    });

    // Event listeners for alle "Sjekk svar"-knapper
    checkButtons.forEach(button => {
        button.addEventListener('click', () => {
            const postNumber = button.getAttribute('data-post');
            const inputElement = document.getElementById(`post-${postNumber}-input`);
            const feedbackElement = document.getElementById(`feedback-${postNumber}`);
            // Brukerens svar, fjernet mellomrom før/etter, og gjort om til store bokstaver
            const userAnswer = inputElement.value.trim().toUpperCase();
            const correctCode = correctCodes[`post${postNumber}`]; // Hent riktig kodeord

            // Fjern tidligere feedback-klasser og shake
            feedbackElement.className = 'feedback';
            inputElement.classList.remove('shake');

            if (!userAnswer) {
                feedbackElement.textContent = 'Du må skrive inn et svar!';
                feedbackElement.classList.add('error', 'shake'); // Sett feil-stil og legg til shake
                inputElement.classList.add('shake'); // Rist også input
                // Fjern shake-klassen etter animasjonen er ferdig
                setTimeout(() => {
                    feedbackElement.classList.remove('shake');
                    inputElement.classList.remove('shake');
                }, 500);
                return; // Ikke gjør mer hvis feltet er tomt
            }

            if (userAnswer === correctCode) {
                // Riktig svar
                feedbackElement.textContent = 'Helt riktig! 🔑 Bra jobba!';
                feedbackElement.classList.add('success'); // Sett suksess-stil

                // Vent litt før neste side vises (gir tid til å lese feedback)
                setTimeout(() => {
                    const nextPostNumber = parseInt(postNumber) + 1;
                    if (nextPostNumber <= 5) {
                        showPage(`post-${nextPostNumber}-page`); // Vis neste post
                    } else {
                        showPage('finale-page'); // Vis finalesiden
                        if (!backgroundMusic.paused) { // Bare pause hvis den spiller
                           backgroundMusic.pause(); // Stopp musikken på slutten
                           backgroundMusic.currentTime = 0; // Spol tilbake til start (valgfritt)
                        }
                    }
                    // Tøm inputfelt og feedback for neste gang
                    inputElement.value = '';
                    feedbackElement.textContent = ''; // Tømmer feedbacken før neste side
                }, 1500); // Vent 1.5 sekund

            } else {
                // Feil svar
                feedbackElement.textContent = 'Hmm, det stemmer ikke helt. Prøv igjen!';
                feedbackElement.classList.add('error', 'shake'); // Sett feil-stil og legg til shake
                inputElement.classList.add('shake'); // Rist også input
                // Fjern shake-klassen etter animasjonen er ferdig
                setTimeout(() => {
                    feedbackElement.classList.remove('shake');
                    inputElement.classList.remove('shake');
                }, 500);
            }
        });
    });

    // Sørg for at intro-siden vises ved start
    showPage('intro-page');

}); // Slutt på DOMContentLoaded
