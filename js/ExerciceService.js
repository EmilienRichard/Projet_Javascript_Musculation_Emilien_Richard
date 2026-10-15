// js/ExerciceService.js
// Service HTTP : récupère le programme depuis un fichier JSON avec fetch + async/await.

import { Exercice } from './Exercice.js';

export class ExerciceService {
    #url;

    constructor(url) {
        this.#url = url;
    }

    async chargerExercices() {
        try {
            const reponse = await fetch(this.#url);

            // fetch ne rejette pas la promesse sur une erreur HTTP (404, 500...) : on teste reponse.ok
            if (!reponse.ok) {
                throw new Error(`Erreur HTTP ${reponse.status} (${reponse.statusText})`);
            }

            const donnees = await reponse.json();

            if (!Array.isArray(donnees)) {
                throw new Error("le fichier JSON doit contenir un tableau d'exercices.");
            }

            return donnees.map((element) => Exercice.depuisJSON(element));
        } catch (erreur) {
            throw new Error(`Chargement impossible (${this.#url}) : ${erreur.message}`);
        }
    }
}