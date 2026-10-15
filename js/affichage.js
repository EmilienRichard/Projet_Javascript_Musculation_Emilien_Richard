// js/affichage.js
// Rendu HTML : liste (map), statistiques (reduce + Math) et messages.

import { Exercice } from './Exercice.js';

// Le texte saisi passe par innerHTML : on neutralise les caractères HTML
const echapper = (texte) => String(texte).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

const formaterPourcent = (valeur) => `${valeur.toFixed(2)} %`;

export const afficherMessage = (texte, estErreur = false) => {
    const out = document.querySelector('#message');
    out.textContent = texte;
    out.classList.toggle('erreur', estErreur);
};

// 2. Rendu fonctionnel : map() transforme chaque Exercice en carte HTML
export const afficherListe = (liste, total) => {
    const conteneur = document.querySelector('#liste-exercices');

    document.querySelector('#compteur').textContent =
        `${liste.length} exercice(s) affiché(s) sur ${total}`;

    if (liste.length === 0) {
        conteneur.innerHTML = '<p class="vide">Aucun exercice à afficher.</p>';
        return;
    }

    conteneur.innerHTML = liste.map((exo) => {
        const cat = exo.infosCategorie;

        return `
      <article class="card" style="border-left-color: ${cat.couleur};">
        <div class="card-head">
          <div>
            <p class="card-name">${echapper(exo.nom)}</p>
            <div class="card-meta">
              <span class="badge" style="background: ${cat.couleur};">${cat.nom}</span>
              <span>${cat.label}</span>
              <span class="card-date">Ajouté le ${exo.dateAjoutLocale}</span>
            </div>
          </div>
          <button type="button" class="btn-small btn-delete" data-action="supprimer" data-id="${exo.id}">Supprimer</button>
        </div>
        <p class="card-sets">${exo.series} série${exo.series > 1 ? 's' : ''} (${echapper(exo.rir)} RIR)</p>
        <p class="card-intensity">${formaterPourcent(exo.intensite)} de ton max</p>
        <div class="card-actions">
          <button type="button" class="btn-small" data-action="diminuer" data-id="${exo.id}">− ${Exercice.PAS_INTENSITE} %</button>
          <button type="button" class="btn-small" data-action="augmenter" data-id="${exo.id}">+ ${Exercice.PAS_INTENSITE} %</button>
        </div>
      </article>
    `;
    }).join('');
};

// 4. Statistiques : reduce() pour les cumuls, Math.max / Math.min pour les extrêmes
const calculerStats = (liste) => {
    if (liste.length === 0) return null;

    const totalSeries = liste.reduce((somme, exo) => somme + exo.series, 0);
    const totalIntensite = liste.reduce((somme, exo) => somme + exo.intensite, 0);
    const intensites = liste.map((exo) => exo.intensite);

    return {
        nombre: liste.length,
        totalSeries: totalSeries,
        moyenne: totalIntensite / liste.length,
        max: Math.max(...intensites),
        min: Math.min(...intensites)
    };
};

export const afficherStats = (liste) => {
    const conteneur = document.querySelector('#stats-container');
    const stats = calculerStats(liste);

    if (stats === null) {
        conteneur.innerHTML = '<h3>Statistiques du programme</h3><p>Aucun exercice enregistré.</p>';
        return;
    }

    conteneur.innerHTML = `
    <h3>Statistiques du programme</h3>
    <p>Exercices enregistrés : <strong>${stats.nombre}</strong> | Séries au total : <strong>${stats.totalSeries}</strong></p>
    <p>Intensité moyenne : <strong>${formaterPourcent(stats.moyenne)}</strong></p>
    <p>Intensité max : <strong>${formaterPourcent(stats.max)}</strong> | Intensité min : <strong>${formaterPourcent(stats.min)}</strong></p>
  `;
};