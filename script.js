// 1. Modélisation par Objets & 6. Persistance localStorage (Réhydratation JSON.parse)
let exercices = JSON.parse(localStorage.getItem('exercices_muscu')) || [
  {
    id: Date.now(),
    nom: "Curl pupitre",
    categorie: "lower",
    intensite: 80,
    series: "2 séries (1-2 RIR)",
    dateAjout: new Date().toISOString()
  }
];

// Fonction de sauvegarde (JSON.stringify)
const sauvegarderExercices = () => {
  localStorage.setItem('exercices_muscu', JSON.stringify(exercices));
};

// 4. Calculs et Statistiques (reduce & Math)
const calculerStats = () => {
  if (exercices.length === 0) return { moyenne: 0, max: 0, min: 0 };

  const totalIntensite = exercices.reduce((somme, exo) => somme + Number(exo.intensite), 0);
  const moyenne = Math.round(totalIntensite / exercices.length);

  const intensites = exercices.map(exo => Number(exo.intensite));
  const max = Math.max(...intensites);
  const min = Math.min(...intensites);

  return { moyenne, max, min };
};

// Fonction principale de rendu dynamique (.map, .filter, Date, Math.round, toLocaleDateString)
const afficherExercices = () => {
  const filtreSelect = document.getElementById('filtre-cat');
  const filtreCat = filtreSelect ? filtreSelect.value : 'all';

  // 3. Filtrage dynamique (.filter)
  const exercicesFiltres = exercices.filter(exo => {
    if (filtreCat === 'all') return true;
    return exo.categorie === filtreCat;
  });

  const listeContainer = document.getElementById('liste-exercices');

  // 2. Transformation et Rendu Fonctionnel (.map)
  listeContainer.innerHTML = exercicesFiltres.map(exo => {
    // 5. Manipulation de Dates (toLocaleDateString)
    const dateFormatee = new Date(exo.dateAjout).toLocaleDateString();
    const intensiteArrondie = Math.round(exo.intensite);
    const couleur = exo.categorie === 'upper' ? '#1e5fa8' : '#c1272d';
    const libelleCat = exo.categorie === 'upper' ? 'Haut du corps' : 'Bas du corps';

    return `
      <div class="card" style="margin-bottom: 16px; border-left-color: ${couleur};">
        <p class="card-name">${exo.nom}</p>
        <div class="card-meta">
          <span class="badge" style="background: ${couleur};">${exo.categorie.toUpperCase()}</span>
          <span>${libelleCat}</span>
          <span style="margin-left: auto; font-size: 0.8rem; color: var(--text-dim);">Ajouté le ${dateFormatee}</span>
        </div>
        <p class="card-sets">${exo.series}</p>
        <p class="card-intensity">${intensiteArrondie.toFixed(2)}% de ton max</p>
      </div>
    `;
  }).join('');

  // Affichage des statistiques (reduce & Math)
  const stats = calculerStats();
  const statsContainer = document.getElementById('stats-container');
  statsContainer.innerHTML = `
    <h3 style="margin-top: 0; font-size: 1.1rem; color: var(--cta);">Statistiques du programme</h3>
    <p style="margin: 4px 0;">Intensité moyenne : <strong>${stats.moyenne}%</strong></p>
    <p style="margin: 4px 0;">Intensité max : <strong>${stats.max}%</strong> | Intensité min : <strong>${stats.min}%</strong></p>
    <p style="margin: 4px 0;">Nombre d'exercices enregistrés : <strong>${exercices.length}</strong></p>
  `;
};

// Gestionnaire d'événement sur le bouton d'ajout
document.getElementById('btn-update').addEventListener('click', function (e) {
  e.preventDefault();

  const nom = document.getElementById('exo-nom').value.trim() || 'Exercice sans nom';
  const categorie = document.getElementById('exo-cat').value;
  const series = document.getElementById('exo-series').value.trim();
  const intensite = Number(document.getElementById('exo-intensite').value) || 0;

  // 5. Horodatage unique avec Date.now() et date ISO
  const nouvelExercice = {
    id: Date.now(),
    nom: nom,
    categorie: categorie,
    intensite: intensite,
    series: series,
    dateAjout: new Date().toISOString()
  };

  // Ajout dans le tableau d'objets
  exercices.push(nouvelExercice);

  // 6. Sauvegarde persistance (localStorage & JSON.stringify)
  sauvegarderExercices();

  // Actualisation de l'affichage
  afficherExercices();
});

// Écouteur pour déclencher le filtre dynamiquement
document.getElementById('filtre-cat').addEventListener('change', () => {
  afficherExercices();
});

// Initialisation au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
  afficherExercices();
});