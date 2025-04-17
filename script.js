document.addEventListener('DOMContentLoaded', () => {
    // Hent referanser til HTML-elementer
    const startButton = document.getElementById('start-button');
    const backgroundMusic = document.getElementById('background-music');
    const pages = document.querySelectorAll('.page'); // Alle "sidene"
    const feedbackDivs = document.querySelectorAll('.feedback');
    const checkButtons = document.querySelectorAll('.check-answer-btn');

    // ----- DEFINER KODEORDENE HER -----
    const correctCodes = {
        post1: 'SØLVE',
        post2: 'SOL',
        post3: 'POTETGULL',
        post4: 'DANSEGLEDE',
        post5: 'HARE'
    };
    // ------------------------------------

    // Funksjon for å vise en spesifikk side og skjule resten
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('visible');
        });
        const nextPage = document.getElementById(pageId);
        if (nextPage) {
            nextPage.classList.add('visible');
        } else {
            console.error("Kunne ikke finne side med ID:", pageId);
        }
    }

    // --- FORSØK Å SPILLE AV MUTED VED LASTING (via HTML-attributter) ---
    // Vi stoler nå på 'autoplay muted' i HTML.
    // Vi kan legge til en sjekk her hvis vi vil være ekstra sikre,
    // men holder det enkelt foreløpig.
    console.log("Forsøker å spille av muted musikk via HTML attributter...");
    backgroundMusic.play().catch(e => console.log("Muted autoplay feilet initielt:", e)); // Forsøk å spille uansett, nettleser håndterer muted

    // Event listener for startknappen
    startButton.addEventListener('click', () => {
        // --- VIKTIG: FJERN MUTE HER! ---
        backgroundMusic.muted = false;

        // Prøv å spille igjen hvis den av en eller annen grunn ikke startet (backup)
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(error => {
                console.log("Musikkavspilling ved klikk feilet:", error);
            });
        }
        // --------------------------------

        // Vis neste side
        showPage('post-1-page');
    });

    // Event listeners for alle "Sjekk svar"-knapper
    checkButtons.forEach(button => {
        button.addEventListener('click', () => {
            const postNumber = button.getAttribute('data-post');
            const inputElement = document.getElementById(`post-${postNumber}-input`);
            const feedbackElement = document.getElementById(`feedback-${postNumber}`);
            const userAnswer = inputElement.value.trim().toUpperCase();
            const correctCode = correctCodes[`post${postNumber}`];

            if (!userAnswer) {
                feedbackElement.textContent = 'Du må skrive inn et svar!';
                feedbackElement.className = 'feedback error shake'; // Legg til shake direkte
                setTimeout(() => feedbackElement.classList.remove('shake'), 500);
                inputElement.classList.add('shake'); // Rist også input
                setTimeout(() => inputElement.classList.remove('shake'), 500);
                return;
            }

            if (userAnswer === correctCode) {
                feedbackElement.textContent = 'Helt riktig! 🔑 Bra jobba!';
                feedbackElement.className = 'feedback success';

                setTimeout(() => {
                    const nextPostNumber = parseInt(postNumber) + 1;
                    if (nextPostNumber <= 5) {
                        showPage(`post-${nextPostNumber}-page`);
                    } else {
                        showPage('finale-page');
                        if (!backgroundMusic.paused) {
                           backgroundMusic.pause();
                           backgroundMusic.currentTime = 0;
                        }
                    }
                    inputElement.value = '';
                    // feedbackElement.textContent = ''; // Tøm feedback hvis ønskelig
                }, 1500);

            } else {
                feedbackElement.textContent = 'Hmm, det stemmer ikke helt. Prøv igjen!';
                feedbackElement.className = 'feedback error shake'; // Legg til shake direkte
                setTimeout(() => feedbackElement.classList.remove('shake'), 500);
                inputElement.classList.add('shake'); // Rist også input
                setTimeout(() => inputElement.classList.remove('shake'), 500);
            }
        });
    });

    // Sørg for at intro-siden vises ved start
    showPage('intro-page');

}); // Slutt på DOMContentLoaded

// Liten CSS justering for shake på feedback
// Legg til dette i style.css hvis du bruker shake på feedback-div også:
/*
.feedback.shake {
    animation: shake 0.5s;
}
*/
