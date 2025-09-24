TITRE
Uniformisation des formulaires MonPlanRetraite.ca – Disposition compacte ligne-par-ligne, labels à gauche en une ligne, palette seniors

OBJECTIF (mis à jour)
- Zéro confusion visuelle: chaque ligne contient exactement 1 étiquette (label) et 1 champ.
- Éviter le scroll vertical: densifier l’affichage et limiter la hauteur des sections.
- Empêcher les libellés sur 2 lignes: couper proprement avec ellipsis et fournir une aide/tooltip si nécessaire.
- Conserver une lecture très prévisible pour des utilisateurs de 50–90 ans peu à l’aise en informatique.

PRINCIPE ABSOLU “1 ligne = 1 label + 1 champ”
- Toujours “Label (à gauche) — Champ (à droite)”, sur une seule ligne, en desktop ET en mobile.
- Le label NE DOIT PAS passer sur 2 lignes: il doit être tronqué avec ellipsis si trop long.
- Si l’espace ne permet pas deux paires par ligne, afficher 1 seule paire sur la ligne (PAS d’empilement label au-dessus du champ).

GRILLE ET NOMBRE DE COLONNES (desktop ≥ 1024 px)
- Lignes multi-colonnes (conteneurs): utiliser .mpr-form-row
  - 3 colonnes pour champs courts (Âge, %, Montant court, Nb semaines)
  - 2 colonnes pour champs moyens (Dates, Noms, Montant mensuel)
  - 1 colonne (span-2/3) pour champs longs (Descriptions, sélecteurs complexes)
- Chaque colonne contient un unique couple “label + champ” (class .mpr-field).
- Hauteur cliquable: champs/boutons ≥ 48 px.
- Gaps recommandés: 8 px entre label et champ, 16–20 px entre colonnes et entre lignes.

RESPONSIVE (mobile < 768 px)
- Conserver le schéma “label à gauche — champ à droite” (ne pas empiler verticalement).
- Adapter la grille .mpr-field à deux colonnes proportionnelles (minmax(120px, 45%) 1fr).
- Le label reste tronqué avec ellipsis en cas d’espace réduit.
- Astuce: si le libellé complet est critique, ajouter un tooltip/aide contextuelle accessible (icône “?” ou title).

PATRON HTML/TSX (exemple)
<div className="mpr-form">
  {/* Ligne 3 colonnes (champs courts) */}
  <div className="mpr-form-row cols-3">
    <div className="mpr-field">
      <label htmlFor="age">Âge actuel</label>
      <input id="age" type="number" />
    </div>
    <div className="mpr-field">
      <label htmlFor="rrqActuelle">RRQ actuelle (mois)</label>
      <input id="rrqActuelle" type="text" />
    </div>
    <div className="mpr-field">
      <label htmlFor="rrq70">RRQ à 70 ans (mois)</label>
      <input id="rrq70" type="text" />
    </div>
  </div>

  {/* Ligne 2 colonnes (champs moyens) */}
  <div className="mpr-form-row cols-2">
    <div className="mpr-field">
      <label htmlFor="dateDebut">Date de début</label>
      <input id="dateDebut" type="date" />
    </div>
    <div className="mpr-field">
      <label htmlFor="montantMensuel">Montant mensuel</label>
      <input id="montantMensuel" type="text" />
    </div>
  </div>

  {/* Champ long qui occupe 2 colonnes */}
  <div className="mpr-form-row cols-3">
    <div className="mpr-field span-2">
      <label htmlFor="description">Description</label>
      <input id="description" type="text" />
    </div>
    <div className="mpr-field">
      <label htmlFor="taux">Taux (%)</label>
      <input id="taux" type="number" />
    </div>
  </div>
</div>

CSS À APPLIQUER (ajouter/valider dans senior-unified-styles.css)
:root {
  --mpr-bg: #ffffff;
  --mpr-text: #1a365d;
  --mpr-primary: #4c6ef5;
  --mpr-border: #e2e8f0;
  --mpr-muted: #64748b;

  /* Couleurs de titres (contraste AAA) */
  --mpr-h1: #0f172a;
  --mpr-h2: #1a365d;
  --mpr-h3: #1e3a8a;
  --mpr-h4: #1f2937;
}

/* Titres (tailles seniors) */
h1,.h1{color:var(--mpr-h1);font-size:32px;line-height:1.3;letter-spacing:.3px}
h2,.h2{color:var(--mpr-h2);font-size:28px;line-height:1.35;letter-spacing:.3px}
h3,.h3{color:var(--mpr-h3);font-size:24px;line-height:1.4;letter-spacing:.3px}
h4,.h4{color:var(--mpr-h4);font-size:20px;line-height:1.45;letter-spacing:.3px}

/* Grille uniformisée */
.mpr-form{display:grid;gap:16px}
.mpr-form-row{display:grid;gap:16px;padding:12px;background:var(--mpr-bg);border:1px solid var(--mpr-border);border-radius:8px}
.mpr-form-row.cols-3{grid-template-columns:repeat(3,1fr)}
.mpr-form-row.cols-2{grid-template-columns:repeat(2,1fr)}
.mpr-form-row.cols-1{grid-template-columns:1fr}

/* Champ ligne-par-ligne (1 label + 1 champ) */
.mpr-field{display:grid;grid-template-columns:minmax(160px,200px) 1fr;align-items:center;gap:8px;min-height:48px}
.mpr-field label{color:var(--mpr-text);font-weight:600;font-size:16px;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mpr-field input,.mpr-field select,.mpr-field textarea{min-height:48px;padding:10px 12px;font-size:18px;border:2px solid var(--mpr-border);border-radius:8px;color:var(--mpr-text);background:var(--mpr-bg)}
.mpr-field input:focus,.mpr-field select:focus,.mpr-field textarea:focus{outline:none;border-color:var(--mpr-primary);box-shadow:0 0 0 3px rgba(76,110,245,.15)}
.mpr-field.span-2{grid-column:span 2}
.mpr-field.span-3{grid-column:span 3}

/* Résultats (optionnel) */
.mpr-result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.mpr-result-card{background:#f0f9ff;border:1px solid var(--mpr-primary);border-radius:8px;padding:12px}
.mpr-result-amount{font-size:24px;font-weight:700;color:var(--mpr-primary)}
.mpr-result-label{font-size:14px;color:var(--mpr-muted)}

/* Responsive */
@media (max-width:1279px){.mpr-form-row.cols-3{grid-template-columns:repeat(2,1fr)}}
@media (max-width:767px){
  .mpr-form-row.cols-3,.mpr-form-row.cols-2{grid-template-columns:1fr}
  /* Conserver label à gauche, champ à droite en mobile (ligne par ligne) */
  .mpr-field{grid-template-columns:minmax(120px,45%) 1fr;align-items:center}
}

RÈGLES EXPLICITES POUR LA TRANSFORMATION (à suivre par ChatGPT 5)
1) Pour chaque page de formulaire:
   - Remplacer toute mise en page ad hoc par .mpr-form + .mpr-form-row (cols-3/cols-2/cols-1).
   - Envelopper chaque couple Label+Champ dans .mpr-field (label à gauche, champ à droite).
   - Interdiction d’empiler le label au-dessus du champ (même en mobile). Si l’espace est restreint, le label est tronqué (ellipsis).
   - Utiliser .span-2/.span-3 uniquement pour des champs “longs” (textarea, description) tout en respectant le “1 label + 1 champ” sur la ligne.

2) Choix du nombre de colonnes:
   - Champs courts majoritaires: cols-3
   - Mélange de courts et moyens: cols-2 + spans pour les longs
   - Descriptions/textarea: cols-1 ou cols-3 avec .span-2

3) Accessibilité seniors:
   - Police champs ≥ 18 px, hauteur champs ≥ 48 px
   - Contraste AAA pour H1–H4 via variables --mpr-h1..--mpr-h4
   - Focus visible (shadow 3 px)
   - Labels non-wrap + ellipsis; fournir un tooltip/aide contextuelle pour le libellé complet si nécessaire

4) Espacements et densité:
   - 8 px entre label et champ
   - 16–20 px entre colonnes et lignes
   - Réduire le blanc inutile; éviter les descriptions longues in-situ (préférer tooltips et courts textes d’aide)

5) Boutons:
   - Hauteur ≥ 56 px, texte ≥ 18 px, alignés sur la grille

6) Résumés/Cartes de montants:
   - .mpr-result-grid (3 colonnes), cartes compactes, valeurs en 24 px gras

ALGORITHME D’APPLICATION
- Étape 1: Identifier inputs/selects/textarea et leurs labels.
- Étape 2: Grouper par logique métier dans .mpr-form-row (cols-3/2/1).
- Étape 3: Envelopper chaque paire dans .mpr-field (label avant champ).
- Étape 4: Appliquer .span-2/.span-3 aux champs longs si nécessaire.
- Étape 5: Ajouter ellipsis sur tous les labels; ne jamais wrap.
- Étape 6: Supprimer styles inline/legacy qui contredisent ces règles.

CHECKLIST DE VALIDATION (DoD strict)
- [ ] Chaque ligne affiche exactement un label et un champ; aucun label sur 2 lignes (ellipsis obligatoire)
- [ ] Pas de label au-dessus du champ (mobile inclus)
- [ ] 2–3 paires par ligne quand l’espace le permet; sinon 1 paire par ligne
- [ ] Hauteur champs ≥ 48 px; boutons ≥ 56 px; focus visible
- [ ] Réduction notable du scroll vertical (page compacte)
- [ ] Titres H1–H4 via variables de thème et contraste AAA

COMMANDE COURTE (résumé pour ChatGPT 5)
Uniformiser tous les formulaires en “ligne par ligne” avec .mpr-form + .mpr-form-row (cols-3/cols-2) et .mpr-field: label à gauche (nowrap + ellipsis) et champ à droite, y compris en mobile (grid-template-columns: minmax(120px,45%) 1fr). 3 colonnes pour champs courts, 2 pour moyens, span‑2/3 pour longs. Hauteur champs ≥ 48 px, gaps 16 px, focus visible. Objectif: zéro label sur 2 lignes, zéro empilement label-au-dessus-champ, réduire le scroll.

Remarque d’intégration
Les classes .mpr-* sont neutres et cohabitent avec les styles seniors existants. Harmoniser les pages en remplaçant les conteneurs ad hoc par .mpr-form-row et en enveloppant toutes les paires label+champ dans .mpr-field. Ajouter tooltips pour libellés longs au besoin (sans casser la règle “une ligne = une paire”).
