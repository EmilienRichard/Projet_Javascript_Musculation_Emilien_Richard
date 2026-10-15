// js/stockage.js
// Persistance : synchronisation du tableau d'exercices avec localStorage.

import { Exercice } from './Exercice.js';

const CLE_STOCKAGE = 'programme_muscu';

export const sauvegarderExercices = (exercices) => {
    // JSON.stringify() appelle automatiquement toJSON() de chaque Exercice
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(exercices));
};

// Renvoie un tableau d'instances, ou null si rien n'est sauvegardé (ou données illisibles)
export const chargerExercices = () => {
    try {
        const donnees = JSON.parse(localStorage.getItem(CLE_STOCKAGE));
        return donnees === null ? null : donnees.map((element) => Exercice.depuisJSON(element));
    } catch (erreur) {
        console.error('Données locales illisibles :', erreur);
        return null;
    }
};