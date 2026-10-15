// js/Exercice.js
// Classe métier : un exercice du programme de musculation.
// Champs privés (#), accesseurs get/set qui valident la saisie, méthodes d'instance.

export class Exercice {
    // Membres statiques (cf. Vehicule.nombreDeVehicules)
    static nombreExercices = 0;
    static PAS_INTENSITE = 2.5;
    static CATEGORIES = {
        lower: { nom: 'Lower', label: 'Bas du corps', couleur: '#c1272d' },
        upper: { nom: 'Upper', label: 'Haut du corps', couleur: '#1e5fa8' }
    };

    // Champs privés : inaccessibles depuis l'extérieur de la classe
    #id;
    #nom;
    #categorie;
    #series;
    #intensite;
    #rir;
    #dateAjout;

    constructor(nom, categorie, series, intensite, rir = '1-2', id = null, dateAjout = null) {
        // Ces affectations passent par les setters : la validation est automatique
        this.nom = nom;
        this.categorie = categorie;
        this.series = series;
        this.intensite = intensite;
        this.rir = rir;

        // Identifiant basé sur le temps (le compteur évite les doublons dans la même milliseconde)
        this.#id = id ?? Date.now() + Exercice.nombreExercices;
        // Date de création au format ISO
        this.#dateAjout = dateAjout ?? new Date().toISOString();

        Exercice.nombreExercices++;
    }

    // ---------- Accesseurs ----------

    // Lecture seule : pas de setter, l'id ne peut pas être modifié
    get id() {
        return this.#id;
    }

    get dateAjout() {
        return this.#dateAjout;
    }

    get dateAjoutLocale() {
        return new Date(this.#dateAjout).toLocaleDateString('fr-FR');
    }

    get infosCategorie() {
        return Exercice.CATEGORIES[this.#categorie];
    }

    get nom() {
        return this.#nom;
    }
    set nom(valeur) {
        if (typeof valeur !== 'string' || valeur.trim() === '') {
            throw new Error("Le nom de l'exercice est obligatoire.");
        }
        this.#nom = valeur.trim();
    }

    get categorie() {
        return this.#categorie;
    }
    set categorie(valeur) {
        if (!Object.keys(Exercice.CATEGORIES).includes(valeur)) {
            throw new Error('Catégorie invalide : "lower" ou "upper" attendu.');
        }
        this.#categorie = valeur;
    }

    get series() {
        return this.#series;
    }
    set series(valeur) {
        const nombre = Math.round(Number(valeur));
        if (String(valeur).trim() === '' || Number.isNaN(nombre) || nombre < 1 || nombre > 20) {
            throw new Error('Le nombre de séries doit être compris entre 1 et 20.');
        }
        this.#series = nombre;
    }

    get intensite() {
        return this.#intensite;
    }
    set intensite(valeur) {
        const nombre = Number(valeur);
        if (String(valeur).trim() === '' || Number.isNaN(nombre) || nombre < 0 || nombre > 100) {
            throw new Error("L'intensité doit être comprise entre 0 et 100 %.");
        }
        this.#intensite = nombre;
    }

    get rir() {
        return this.#rir;
    }
    set rir(valeur) {
        this.#rir = String(valeur).trim() || '1-2';
    }

    // ---------- Méthodes d'instance ----------

    // Surcharge progressive : le setter vérifie que l'intensité reste entre 0 et 100
    augmenterIntensite(points = Exercice.PAS_INTENSITE) {
        this.intensite = this.#intensite + points;
    }

    diminuerIntensite(points = Exercice.PAS_INTENSITE) {
        this.intensite = this.#intensite - points;
    }

    sePresenter() {
        return `${this.#nom} (${this.infosCategorie.nom}) : ${this.#series} séries (${this.#rir} RIR) à ${this.#intensite.toFixed(2)} % du max`;
    }

    // JSON.stringify() ignore les champs privés : toJSON() indique quoi sérialiser
    toJSON() {
        return {
            id: this.#id,
            nom: this.#nom,
            categorie: this.#categorie,
            series: this.#series,
            intensite: this.#intensite,
            rir: this.#rir,
            dateAjout: this.#dateAjout
        };
    }

    // Reconstruit une instance à partir d'un objet JSON (localStorage ou fichier distant)
    static depuisJSON(donnees) {
        return new Exercice(
            donnees.nom,
            donnees.categorie,
            donnees.series,
            donnees.intensite,
            donnees.rir,
            donnees.id,
            donnees.dateAjout
        );
    }
}