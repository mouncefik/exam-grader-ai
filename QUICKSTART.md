# Guide de Démarrage - Interface de Correction avec IA

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
cd frontend
npm install
```

### 2. Configuration de l'environnement

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Lancement du serveur de développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📋 Fonctionnalités du nouveau design

### Interface de visualisation de copies

1. **Accéder à une copie**
   - Allez dans Dashboard > Examens
   - Sélectionnez un examen
   - Cliquez sur "Voir" pour une copie

2. **Utiliser l'assistant IA**
   - Sélectionnez du texte dans la copie
   - Posez une question dans le panneau de droite
   - L'IA analyse et répond avec contexte

3. **Annoter une copie**
   - Sélectionnez du texte
   - Choisissez une couleur de surlignage
   - Ajoutez un commentaire

4. **Naviguer dans le document**
   - Utilisez les contrôles de zoom (+/-)
   - Recherchez dans le document
   - Téléchargez la copie

## 🎨 Personnalisation du design

### Modifier les couleurs de surlignage

Éditez `/frontend/src/components/annotation-toolbar.tsx` :

```typescript
const highlightColors = [
  { color: 'yellow', label: 'Jaune', class: 'bg-yellow-200' },
  { color: 'green', label: 'Vert', class: 'bg-green-200' },
  // Ajoutez vos couleurs ici
];
```

### Ajuster la taille du panneau IA

Dans `/frontend/src/app/dashboard/copies/[id]/page.tsx` :

```typescript
<div className="w-[420px] border-l"> // Changez 420px
```

### Modifier les suggestions de l'IA

Dans `/frontend/src/components/ai-chat-panel.tsx` :

```typescript
const prompts = [
  { icon: BookOpen, text: "Votre prompt personnalisé", color: "text-blue-500" },
  // Ajoutez vos prompts
];
```

## 🔧 Composants réutilisables

### DocumentViewer

```tsx
import { DocumentViewer } from '@/components/document-viewer';

<DocumentViewer
  documentUrl="/path/to/document.pdf"
  documentType="pdf"
  onTextSelect={(text, position) => {
    // Gérer la sélection
  }}
/>
```

### AIChatPanel

```tsx
import { AIChatPanel } from '@/components/ai-chat-panel';

<AIChatPanel
  messages={messages}
  onSendMessage={handleSend}
  isSending={false}
  thinkingMode={true}
  context={{
    copyId: "123",
    studentName: "Jean Dupont"
  }}
/>
```

### StatCard

```tsx
import { StatCard } from '@/components/stats-cards';

<StatCard
  title="Total de copies"
  value={42}
  description="dans cet examen"
  trend="up"
  trendValue="+12%"
/>
```

## 📱 Design responsive

Le design s'adapte automatiquement :
- **Desktop** : Vue complète avec panneau latéral
- **Tablet** : Panneau réductible
- **Mobile** : Vue en onglets

## 🎯 Cas d'usage

### Correction rapide

1. Ouvrez la copie
2. Lisez en scrollant
3. Sélectionnez les erreurs
4. Surlignez en rouge
5. Posez des questions à l'IA si besoin

### Analyse approfondie

1. Activez le mode "Réflexion"
2. Ajoutez le barème en contexte
3. Discutez avec l'IA sur chaque réponse
4. Prenez note des suggestions
5. Appliquez la correction

### Correction collaborative

1. Marquez la copie avec un bookmark
2. Partagez le lien
3. Utilisez les annotations pour communiquer
4. L'historique est sauvegardé

## 🐛 Dépannage

### Le PDF ne s'affiche pas
- Vérifiez que l'URL est correcte
- Assurez-vous que le fichier est accessible
- Vérifiez les CORS du serveur backend

### L'IA ne répond pas
- Vérifiez la connexion au backend
- Consultez la console pour les erreurs
- Vérifiez que l'API chatbot est configurée

### Problèmes de performance
- Réduisez la taille des PDFs
- Limitez l'historique de chat
- Utilisez la virtualisation pour les longues listes

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

## 🤝 Contribution

Pour contribuer à améliorer l'interface :

1. Créez une branche feature
2. Testez vos modifications
3. Soumettez une pull request
4. Documentez vos changements

## 📄 License

Ce projet utilise la licence MIT.
