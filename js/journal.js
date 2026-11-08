// js/journal.js
// Journal de séance : tableaux parallèles, boucle for, switch, rest, déstructuration.

import { echapper } from './affichage.js';

// Tableaux parallèles : l'indice i décrit la même série dans les 4 tableaux
let journalNoms = [];
let journalCharges = [];
let journalReps = [];
let journalRessentis = [];

const CLE_JOURNAL = 'journal_muscu';

// ---------- Persistance (localStorage + JSON) ----------

const sauvegarderJournal = () => {
    const donnees = {
        noms: journalNoms,
        charges: journalCharges,
        reps: journalReps,
        ressentis: journalRessentis
    };
    localStorage.setItem(CLE_JOURNAL, JSON.stringify(donnees));
};

export const chargerJournal = () => {
    try {
        const donnees = JSON.parse(localStorage.getItem(CLE_JOURNAL)) ?? {};
        journalNoms = donnees.noms ?? [];
        journalCharges = donnees.charges ?? [];
        journalReps = donnees.reps ?? [];
        journalRessentis = donnees.ressentis ?? [];
    } catch (erreur) {
        console.error('Journal illisible :', erreur);
    }
};

// ---------- Messages et contrôle de saisie ----------

const afficherMessageJournal = (texte, estErreur = false) => {
    const out = document.querySelector('#message-journal');
    out.textContent = texte;
    out.classList.toggle('erreur', estErreur);
};

// Paramètre Rest (...champs) : nombre variable de valeurs à contrôler
// Valeur falsy (chaîne vide, 0, NaN) => champ non valide
const tousRemplis = (...champs) => {
    for (let i = 0; i < champs.length; i++) {
        if (!champs[i]) {
            return false;
        }
    }
    return true;
};

// Contrôle en temps réel (oninput dans le HTML)
export const verifierChargeEnDirect = (valeur) => {
    if (Number(valeur) < 0) {
        afficherMessageJournal('La charge ne peut pas être négative.', true);
    } else {
        afficherMessageJournal('');
    }
};

// ---------- Actions (appelées par les attributs onsubmit / onclick) ----------

export const ajouterSerie = (e) => {
    e.preventDefault();

    const nom = document.querySelector('#journal-nom').value.trim();
    const charge = Number(document.querySelector('#journal-charge').value);
    const reps = Number(document.querySelector('#journal-reps').value);
    const ressenti = document.querySelector('#journal-ressenti').value;

    if (!tousRemplis(nom, charge, reps)) {
        afficherMessageJournal("Renseigne l'exercice, une charge et un nombre de répétitions.", true);
    } else if (charge < 0) {
        afficherMessageJournal('La charge ne peut pas être négative.', true);
    } else if (reps !== Math.round(reps)) {
        afficherMessageJournal('Le nombre de répétitions doit être un nombre entier.', true);
    } else {
        // .push() : chaque saisie est ajoutée à chacun des tableaux parallèles
        journalNoms.push(nom);
        journalCharges.push(charge);
        journalReps.push(reps);
        journalRessentis.push(ressenti);

        sauvegarderJournal();
        afficherJournal();
        afficherMessageJournal(`Série « ${nom} » ajoutée au journal.`);

        document.querySelector('#journal-nom').value = '';
        document.querySelector('#journal-charge').value = '';
        document.querySelector('#journal-reps').value = '';
    }
};

// Suppression sans mutation : filter() recrée chaque tableau sans l'indice supprimé
export const supprimerSerie = (indice) => {
    journalNoms = journalNoms.filter((_, i) => i !== indice);
    journalCharges = journalCharges.filter((_, i) => i !== indice);
    journalReps = journalReps.filter((_, i) => i !== indice);
    journalRessentis = journalRessentis.filter((_, i) => i !== indice);

    sauvegarderJournal();
    afficherJournal();
};

// ---------- Affichage : boucle for + innerHTML + switch + ternaire ----------

export const afficherJournal = () => {
    const out = document.querySelector('#liste-journal');

    if (journalNoms.length === 0) {
        out.innerHTML = '<p class="vide">Aucune série enregistrée dans le journal.</p>';
        return;
    }

    let html = '';

    for (let i = 0; i < journalNoms.length; i++) {
        // Déstructuration de tableau : on extrait les 4 infos de la série i
        const [nom, charge, reps, ressenti] = [
            journalNoms[i],
            journalCharges[i],
            journalReps[i],
            journalRessentis[i]
        ];

        // switch : couleur et libellé selon le ressenti
        let couleur;
        let libelle;
        switch (ressenti) {
            case 'facile':
                couleur = '#2e8b57';
                libelle = 'Facile';
                break;
            case 'dur':
                couleur = '#c1272d';
                libelle = "À l'échec";
                break;
            default:
                couleur = '#e8b93a';
                libelle = 'Bon';
        }

        const volume = (charge * reps).toFixed(2);

        html += `
      <article class="card" style="border-left-color: ${couleur}; margin-bottom: 12px;">
        <div class="card-head">
          <div>
            <p class="card-name">${echapper(nom)}</p>
            <div class="card-meta">
              <span class="badge" style="background: ${couleur};">${libelle}</span>
            </div>
          </div>
          <button type="button" class="btn-small btn-delete" onclick="supprimerSerie(${i})">Supprimer</button>
        </div>
        <p class="card-sets">${charge} kg × ${reps} répétition${reps > 1 ? 's' : ''}</p>
        <p class="card-intensity">Volume : ${volume} kg</p>
      </article>
    `;
    }

    out.innerHTML = html;
};
