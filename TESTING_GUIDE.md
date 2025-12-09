# Guide de test de l'interface de correction avec IA

## 🧪 Tests de l'interface

### Test 1: Visualisation d'une copie

**Objectif:** Vérifier que l'interface se charge correctement

**Étapes:**
1. Lancez le serveur: `npm run dev`
2. Connectez-vous avec un compte professeur
3. Naviguez vers Dashboard > Examens
4. Sélectionnez un examen
5. Cliquez sur "Voir" pour une copie

**Résultat attendu:**
- ✅ La page se charge sans erreur
- ✅ Le header affiche les informations de la copie
- ✅ Le document est visible (ou placeholder si pas de fichier)
- ✅ Le panneau IA est visible à droite
- ✅ Message de bienvenue de l'IA affiché

### Test 2: Interaction avec l'IA

**Objectif:** Tester le chat avec l'assistant IA

**Étapes:**
1. Dans la copie ouverte, tapez un message dans le champ de chat
2. Cliquez sur Envoyer ou appuyez sur Entrée
3. Attendez la réponse de l'IA

**Résultat attendu:**
- ✅ Le message apparaît dans le chat (côté droit)
- ✅ Indicateur "L'IA réfléchit..." pendant le traitement
- ✅ Réponse de l'IA affichée (côté gauche)
- ✅ Horodatage visible sur chaque message

### Test 3: Sélection de texte et annotation

**Objectif:** Tester la sélection et l'annotation de texte

**Étapes:**
1. Sélectionnez du texte dans le document
2. Vérifiez que l'onglet "Surligner" s'active
3. Le texte sélectionné apparaît dans le panneau
4. Tapez une question sur ce texte
5. Appuyez sur Entrée

**Résultat attendu:**
- ✅ Le texte sélectionné est affiché dans l'onglet "Surligner"
- ✅ Le message inclut le contexte sélectionné
- ✅ La réponse de l'IA prend en compte le contexte

### Test 4: Contrôles de zoom

**Objectif:** Tester les contrôles de visualisation

**Étapes:**
1. Cliquez sur le bouton Zoom +
2. Cliquez sur le bouton Zoom -
3. Vérifiez que le pourcentage s'affiche

**Résultat attendu:**
- ✅ Le document zoom in/out correctement
- ✅ Le pourcentage de zoom s'affiche (50% - 200%)
- ✅ Les boutons se désactivent aux limites

### Test 5: Onglets de l'assistant

**Objectif:** Tester les différents onglets

**Étapes:**
1. Cliquez sur l'onglet "Surligner"
2. Cliquez sur l'onglet "Contexte"
3. Cliquez sur l'onglet "Plus"

**Résultat attendu:**
- ✅ Surligner: Instructions + champ pour texte sélectionné
- ✅ Contexte: Bouton pour ajouter barème
- ✅ Plus: Liens vers historique et suggestions

### Test 6: Masquer/Afficher l'assistant

**Objectif:** Tester le toggle du panneau IA

**Étapes:**
1. Cliquez sur "Masquer l'assistant"
2. Le panneau disparaît
3. Cliquez sur "Afficher l'assistant"
4. Le panneau réapparaît

**Résultat attendu:**
- ✅ Le panneau se cache correctement
- ✅ Plus d'espace pour le document
- ✅ Le panneau réapparaît avec l'état conservé

### Test 7: Boutons d'action (Like, Bookmark)

**Objectif:** Tester les actions rapides

**Étapes:**
1. Cliquez sur le bouton Like (pouce)
2. Cliquez sur le bouton Bookmark (marque-page)
3. Cliquez sur le bouton Download

**Résultat attendu:**
- ✅ Like: L'icône se remplit en rouge
- ✅ Bookmark: L'icône se remplit en jaune
- ✅ Download: Le fichier se télécharge (si disponible)

### Test 8: Badge de statut

**Objectif:** Vérifier l'affichage du statut

**Étapes:**
1. Vérifiez le badge à côté du titre de la copie
2. Le statut doit afficher: En attente / Corrigé / Vérifié

**Résultat attendu:**
- ✅ Badge coloré selon le statut
- ✅ Note affichée si disponible (ex: 75/100)

### Test 9: Suggestions de prompts

**Objectif:** Tester les prompts suggérés

**Étapes:**
1. Dans le panneau IA, cliquez sur "Afficher les suggestions"
2. Cliquez sur un prompt suggéré
3. Le prompt s'ajoute au champ de message

**Résultat attendu:**
- ✅ Les suggestions s'affichent/masquent
- ✅ Cliquer sur une suggestion remplit le champ
- ✅ Les icônes et couleurs sont correctes

### Test 10: Mode Réflexion

**Objectif:** Vérifier l'indicateur de mode réflexion

**Étapes:**
1. Vérifiez la présence du badge "Mode Réflexion"
2. Vérifiez le texte en bas du chat

**Résultat attendu:**
- ✅ Badge "Mode Réflexion" visible en haut du panneau
- ✅ Icône ampoule + texte explicatif en bas

## 🐛 Problèmes connus et solutions

### Le PDF ne s'affiche pas
**Cause:** URL incorrecte ou CORS
**Solution:** Vérifiez l'URL dans les DevTools, configurez CORS backend

### L'IA ne répond pas
**Cause:** API backend non démarrée
**Solution:** Démarrez le backend: `uvicorn main:app --reload`

### Sélection de texte ne fonctionne pas
**Cause:** PDF en iframe bloque les événements
**Solution:** Utilisez le mode texte ou implémentez PDF.js

### Performance lente avec gros PDFs
**Cause:** Chargement complet du PDF
**Solution:** Implémentez le lazy loading ou pagination

## 📊 Checklist de validation

- [ ] Interface se charge sans erreur console
- [ ] Chat fonctionne bidirectionnellement
- [ ] Sélection de texte détectée
- [ ] Zoom fonctionnel
- [ ] Tous les onglets accessibles
- [ ] Toggle panneau IA fonctionne
- [ ] Boutons d'action réactifs
- [ ] Badge de statut correct
- [ ] Suggestions de prompts cliquables
- [ ] Mode réflexion visible
- [ ] Design responsive (mobile, tablet)
- [ ] Thème clair/sombre fonctionne
- [ ] Accessibilité clavier OK
- [ ] Messages d'erreur appropriés
- [ ] Performance acceptable (<3s chargement)

## 🎯 Tests de performance

### Temps de chargement
- **Initial:** < 2 secondes
- **Chat response:** < 5 secondes
- **Zoom:** < 100ms
- **Toggle panneau:** < 200ms

### Utilisation mémoire
- **Baseline:** ~50 MB
- **Avec PDF:** ~150 MB
- **Après 50 messages:** ~200 MB

### Recommandations
- Limitez l'historique de chat à 100 messages
- Utilisez la compression d'images
- Implémentez le lazy loading pour les PDFs volumineux

## 📝 Feedback utilisateur

**Questions à poser aux testeurs:**
1. L'interface est-elle intuitive ?
2. Les contrôles sont-ils faciles à trouver ?
3. L'IA répond-elle de manière pertinente ?
4. Le design est-il agréable visuellement ?
5. Y a-t-il des fonctionnalités manquantes ?

## ✅ Validation finale

Une fois tous les tests passés:
1. Commitez les changements
2. Créez une pull request
3. Demandez une revue de code
4. Déployez en staging
5. Tests utilisateurs
6. Déploiement production
