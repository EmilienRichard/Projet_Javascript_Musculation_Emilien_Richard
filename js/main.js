// js/main.js
// Point d'entrée : charge les données, branche les événements.

import { Exercice } from './Exercice.js';
import { ExerciceService } from './ExerciceService.js';
import { chargerExercices, sauvegarderExercices } from './stockage.js';
import { afficherListe, afficherStats, afficherMessage } from './affichage.js';

const service = new ExerciceService('data/exercices.json');

// Tableau unique d'instances de la classe Exercice
let exercices = [];

// 3. Filtrage dynamique : filter() sur la catégorie choisie
const rafraichir = () => {
    const filtre = document.querySelector('#filtre-cat').value;
    const liste = exercices.filter((exo) => filtre === 'all' || exo.categorie === filtre);

    afficherListe(liste, exercices.length);
    afficherStats(exercices);
};

// Récupération asynchrone du programme (fichier JSON) : async/await + try...catch
const importerProgramme = async () => {
    afficherMessage('Chargement du programme…');

    try {
        const importes = await service.chargerExercices();

        const nouveaux = importes.filter((exo) =>
            !exercices.some((existant) => existant.nom === exo.nom && existant.categorie === exo.categorie)
        );

        exercices.push(...nouveaux);
        sauvegarderExercices(exercices);
        rafraichir();
        afficherMessage(`${nouveaux.length} exercice(s) importé(s) depuis le fichier JSON.`);
    } catch (erreur) {
        afficherMessage(erreur.message, true);
    }
};

// Les setters de la classe valident la saisie : en cas d'erreur, ils lèvent une exception
const ajouterExercice = (e) => {
    e.preventDefault();

    try {
        const exo = new Exercice(
            document.querySelector('#exo-nom').value,
            document.querySelector('#exo-cat').value,
            document.querySelector('#exo-series').value,
            document.querySelector('#exo-intensite').value,
            document.querySelector('#exo-rir').value
        );

        exercices.push(exo);
        sauvegarderExercices(exercices);
        rafraichir();
        afficherMessage(`« ${exo.nom} » ajouté au programme.`);
        document.querySelector('#exo-nom').value = '';
    } catch (erreur) {
        afficherMessage(erreur.message, true);
    }
};

// Un seul écouteur sur la liste (les cartes sont recréées à chaque rendu)
const gererActions = (e) => {
    const bouton = e.target.closest('[data-action]');
    if (!bouton) return;

    const action = bouton.dataset.action;
    const id = Number(bouton.dataset.id);
    const exo = exercices.find((element) => element.id === id);
    if (!exo) return;

    try {
        if (action === 'supprimer') {
            exercices = exercices.filter((element) => element.id !== id);
        } else if (action === 'augmenter') {
            exo.augmenterIntensite();
        } else if (action === 'diminuer') {
            exo.diminuerIntensite();
        }

        sauvegarderExercices(exercices);
        rafraichir();
        afficherMessage(action === 'supprimer' ? `« ${exo.nom} » supprimé.` : exo.sePresenter());
    } catch (erreur) {
        afficherMessage(erreur.message, true);
    }
};

// 6. Réhydratation au chargement, sinon import du fichier JSON
const demarrer = async () => {
    const sauvegardes = chargerExercices();

    if (sauvegardes !== null) {
        exercices = sauvegardes;
        rafraichir();
        return;
    }

    rafraichir();
    await importerProgramme();
};

document.querySelector('#exercise-form').addEventListener('submit', ajouterExercice);
document.querySelector('#liste-exercices').addEventListener('click', gererActions);
document.querySelector('#filtre-cat').addEventListener('change', rafraichir);
document.querySelector('#btn-import').addEventListener('click', importerProgramme);

demarrer();