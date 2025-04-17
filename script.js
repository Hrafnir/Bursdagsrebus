document.addEventListener('DOMContentLoaded', () => {
    // Hent referanser til HTML-elementer
    const startButton = document.getElementById('start-button');
    const backgroundMusic = document.getElementById('background-music');
    const pages = document.querySelectorAll('.page'); // Alle "sidene"
    const feedbackDivs = document.querySelectorAll('.feedback');
    const checkButtons = document.querySelectorAll('.check-answer-btn');

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

    // Event listener for startknappen
    startButton.addEventListener('click', () => {
        showPage('post-1-page'); // Vis første post
        // Prøv å spille musikken (kan bli blokkert av nettleser før brukerinteraksjon)
        backgroundMusic.play().catch(error => {
            console.log("Musikkavspilling blokkert av nettleser:", error);
            // Du kan legge til en melding til brukeren her om nødvendig
        });
    });

    // Event listeners for alle "Sjekk svar"-knapper
    checkButtons.forEach(button => {
        button.addEventListener('click', () => {
            const postNumber = button.getAttribute('data-post'); // Få postnummer fra data-attributt
            const inputElement = document.getElementById(`post-${postNumber}-input`);
            const feedbackElement = document.getElementById(`feedback-${postNumber}`);
            const userAnswer = inputElement.value.trim().toUpperCase(); // Les brukerens svar, fjern PÅSKEegg og gjør om til store bokstaver
            const correctCode = correctCodes[`post${postNumber}`]; // Hent riktig kodeord

            if (!userAnswer) {
                feedbackElement.textContent = 'Du må skrive inn et svar!';
                feedbackElement.className = 'feedback error'; // Sett feil-stil
                return; // Ikke gjør mer hvis feltet er tomt
            }

            if (userAnswer === correctCode) {
                // Riktig svar
                feedbackElement.textContent = 'Helt riktig! 🔑 Bra jobba!';
                feedbackElement.className = 'feedback success'; // Sett suksess-stil

                // Vent litt før neste side vises (gir tid til å lese feedback)
                setTimeout(() => {
                    const nextPostNumber = parseInt(postNumber) + 1;
                    if (nextPostNumber <= 5) {
                        showPage(`post-${nextPostNumber}-page`); // Vis neste post
                    } else {
                        showPage('finale-page'); // Vis finalesiden
                        backgroundMusic.pause(); // Stopp musikken på slutten (valgfritt)
                    }
                    // Tøm inputfelt og feedback for neste gang (valgfritt)
                     inputElement.value = '';
                     // feedbackElement.textContent = ''; // Kan fjernes hvis du vil beholde suksessmeldingen
                }, 1500); // Vent 1.5 sekund

            } else {
                // Feil svar
                feedbackElement.textContent = 'Hmm, det stemmer ikke helt. Prøv igjen!';
                feedbackElement.className = 'feedback error'; // Sett feil-stil
                // Rist inputfeltet for visuell feedback
                inputElement.classList.add('shake');
                setTimeout(() => inputElement.classList.remove('shake'), 500); // Fjern riste-klassen etter animasjonen
            }
        });
    });

     // Sørg for at inputfelt tømmes når man går til en ny side (valgfritt, men ryddig)
    // Dette kan gjøres mer sofistikert, men er en enkel løsning
     pages.forEach(page => {
         const input = page.querySelector('input[type="text"]');
         if(input) {
             page.addEventListener('transitionend', () => { // Eller når siden blir synlig
                 if(page.classList.contains('visible')) {
                     // input.value = ''; // Tømmer når siden blir synlig
                 }
             });
         }
     });

    // Sørg for at intro-siden vises ved start (selv om CSS gjør det, ekstra sikkerhet)
    showPage('intro-page');

}); // Slutt på DOMContentLoaded
