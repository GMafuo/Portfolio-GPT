import { responses } from '@/data/responses'

// Mots-clés simplifiés pour chaque catégorie
const CATEGORIES = {
  projets: ['projet', 'projets', 'réalisation', 'réalisations', 'développé', 'créé'],
  competences: ['compétence', 'compétences', 'skill', 'skills', 'technologie', 'technologies', 'savoir', 'observer', 'regarder', 'voir'],
  parcours: ['parcours', 'formation', 'études', 'école', 'université', 'diplôme', 'education'],
  contact: ['contact', 'email', 'mail', 'téléphone', 'coordonnées', 'joindre', 'contacter']
}

// Mapping des catégories vers les réponses
const CATEGORY_RESPONSES = {
  projets: responses.projects,
  competences: responses.skills,
  parcours: responses.education,
  contact: responses.contact
}

// Détection de la catégorie demandée
const detectCategory = (message) => {
  const lowercaseMsg = message.toLowerCase()
  
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(keyword => lowercaseMsg.includes(keyword))) {
      return category
    }
  }
  return null
}

export const handleMessage = (message) => {
  // Gestion des commandes spéciales
  if (message.startsWith('/')) {
    return
  }

  // Détection de la catégorie
  const category = detectCategory(message)
  
  if (category) {
    return {
      type: 'assistant',
      content: `${CATEGORY_RESPONSES[category]}

Souhaitez-vous découvrir autre chose ? Je peux vous parler de :
- 💼 Mes **projets**
- 🚀 Mes **compétences**
- 🎓 Mon **parcours**
- 📫 Mes informations de **contact**`
    }
  }

  // Réponse par défaut si aucune catégorie n'est détectée
  return {
    type: 'assistant',
    content: `Je peux vous présenter :
- 💼 Mes **projets**
- 🚀 Mes **compétences**
- 🎓 Mon **parcours**
- 📫 Mes informations de **contact**

Que souhaitez-vous découvrir ?`
  }
}
