# Interface de Correction de Copies avec IA - Style alphaXiv

## Vue d'ensemble

Cette interface moderne permet aux professeurs de visualiser et corriger les copies d'examens avec l'assistance d'une IA intégrée, inspirée du design d'alphaXiv.

## Fonctionnalités principales

### 1. Viewer de Documents
- **Zoom et rotation** : Contrôles intuitifs pour ajuster la vue
- **Support multi-format** : PDF, images (JPG, PNG)
- **Mode plein écran** : Pour une lecture immersive
- **Téléchargement** : Export facile des copies

### 2. Assistant IA Intégré
- **Chat contextuel** : Discussion intelligente sur le contenu de la copie
- **Highlight & Ask** : Sélection de texte pour poser des questions spécifiques
- **Mode Réflexion** : Analyse approfondie par l'IA
- **Suggestions automatiques** : Recommandations d'amélioration

### 3. Barre d'outils complète
- Like et Bookmark pour marquer les copies importantes
- Recherche dans le document
- Contrôles de zoom (50% - 200%)
- Masquage/affichage de l'assistant IA
- Badge de statut (En attente/Corrigé/Vérifié)

### 4. Système d'annotations
- **Surlignage multi-couleurs** : Jaune, vert, bleu, rouge
- **Annotations contextuelles** : Commentaires attachés aux sélections
- **Historique des highlights** : Toutes les annotations sauvegardées

## Architecture des composants

### `/frontend/src/app/dashboard/copies/[id]/page.tsx`
Page principale du viewer de copies avec :
- Header avec informations de la copie
- Viewer de documents (gauche)
- Panneau assistant IA (droite)
- Gestion des états et intégration API

### `/frontend/src/components/document-viewer.tsx`
Composant réutilisable pour afficher des documents :
- Support PDF, image et texte HTML
- Contrôles de zoom et rotation
- Overlay d'annotations
- Mode comparaison (original vs corrigé)

### `/frontend/src/components/ai-chat-panel.tsx`
Panneau de chat avec l'IA :
- Messages avec contexte
- Indicateurs de confiance
- Suggestions de prompts
- Mode réflexion activable

### `/frontend/src/components/annotation-toolbar.tsx`
Outils d'annotation :
- Sélection de couleurs de surlignage
- Input de questions contextuelles
- Actions rapides (Expliquer, Vérifier, Annuler)
- Badges de statut

## Utilisation

### Accès à une copie
```typescript
// Navigation depuis la liste des copies
<Link href={`/dashboard/copies/${copyId}`}>
  <Button variant="outline">
    <Eye className="mr-2" />
    Voir
  </Button>
</Link>
```

### Interaction avec l'IA

1. **Sélection de texte** : 
   - Sélectionnez du texte dans la copie
   - Une barre d'outils apparaît automatiquement
   - Choisissez une couleur ou posez une question

2. **Chat libre** :
   - Tapez directement dans le champ de message
   - L'IA analyse le contexte de la copie
   - Recevez des réponses avec niveau de confiance

3. **Actions rapides** :
   - Onglet "Surligner" : Questions sur sélections
   - Onglet "Contexte" : Ajouter des documents de référence
   - Onglet "Plus" : Barème, historique, suggestions

## API Integration

### Endpoints utilisés

```typescript
// Récupérer une copie
const copy = await copiesAPI.getCopy(copyId);

// Envoyer un message au chatbot
const response = await chatbotAPI.sendMessage({
  message: "Question...",
  context: "Texte sélectionné",
  copy_id: copyId
});
```

## Personnalisation

### Thèmes
L'interface s'adapte automatiquement au mode clair/sombre de VS Code.

### Largeur du panneau IA
Modifiable dans `page.tsx` :
```typescript
<div className="w-[420px] border-l"> // Ajuster la largeur ici
```

### Zoom par défaut
```typescript
const [zoom, setZoom] = useState(100); // Valeur initiale
```

## Performance

- **Lazy loading** des documents PDF
- **Virtualisation** des longs historiques de chat
- **Debouncing** sur la recherche de texte
- **Optimisation** des rendus avec React.memo

## Accessibilité

- Navigation au clavier complète
- Labels ARIA sur tous les boutons
- Contraste respectant WCAG 2.1 AA
- Support des lecteurs d'écran

## Prochaines améliorations

- [ ] Annotations collaboratives en temps réel
- [ ] Export des annotations en PDF
- [ ] Comparaison côte à côte de copies
- [ ] Reconnaissance OCR pour les images
- [ ] Intégration vocale (speech-to-text)
- [ ] Templates de correction personnalisables

## Support

Pour toute question ou problème, consultez la documentation du projet ou ouvrez une issue sur GitHub.
