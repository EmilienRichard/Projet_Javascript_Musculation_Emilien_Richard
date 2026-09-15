// Étape 1 : manipulation directe du DOM
// Pas de framework, pas de state : on lit les inputs et on écrit
// directement dans les éléments de la carte au clic sur le bouton.

document.getElementById('btn-update').addEventListener('click', function () {
  const nom = document.getElementById('exo-nom').value.trim() || 'Exercice sans nom';
  const cat = document.getElementById('exo-cat').value;
  const series = document.getElementById('exo-series').value.trim();
  const intensite = document.getElementById('exo-intensite').value;

  document.getElementById('card-nom').textContent = nom;
  document.getElementById('card-series').textContent = series;
  document.getElementById('card-intensite').textContent = intensite + '% de ton max';

  const badge = document.getElementById('card-badge');
  const catLabel = document.getElementById('card-cat-label');
  const card = document.getElementById('card');

  // attribution des couleurs en fonction du type de séance.

  if (cat === 'upper') {
    badge.textContent = 'Upper';
    catLabel.textContent = 'Haut du corps';
    badge.style.background = '#1e5fa8';
    card.style.borderLeftColor = '#1e5fa8';
  } else {
    badge.textContent = 'Lower';
    catLabel.textContent = 'Bas du corps';
    badge.style.background = '#c1272d';
    card.style.borderLeftColor = '#c1272d';
  }
});
