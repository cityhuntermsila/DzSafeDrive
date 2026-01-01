
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "../types";

/**
 * Extrait proprement les données base64 et identifie le type MIME.
 * Évite l'erreur 'INVALID_ARGUMENT' en s'assurant que seules les données brutes sont envoyées.
 */
const parseImageData = (base64Image: string) => {
  if (!base64Image) return { mimeType: 'image/jpeg', data: '' };

  let mimeType = 'image/jpeg';
  let data = base64Image;

  // Si c'est un Data URL (ex: data:image/jpeg;base64,...)
  if (base64Image.startsWith('data:')) {
    const parts = base64Image.split(',');
    if (parts.length > 1) {
      data = parts[1];
      // Extrait le type MIME entre 'data:' et ';base64'
      const mimeMatch = parts[0].match(/data:(.*?);/);
      if (mimeMatch && mimeMatch[1]) {
        mimeType = mimeMatch[1];
      }
    }
  }

  // CRITIQUE : L'API Gemini rejette les chaînes base64 contenant des espaces ou des sauts de ligne.
  // On nettoie la chaîne de tous les caractères non-base64 potentiels (espaces, \n, \r).
  const cleanData = data.replace(/[\n\r\s]/g, '');

  return {
    mimeType,
    data: cleanData
  };
};

export const analyzeImage = async (base64Image: string): Promise<AnalysisResponse> => {
  // Création d'une nouvelle instance à chaque appel pour garantir l'utilisation de la clé la plus récente
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const { mimeType, data } = parseImageData(base64Image);

  if (!data) {
    throw new Error("Données d'image manquantes après traitement.");
  }

  const systemInstruction = `Tu es le cerveau d'un système de sécurité routière intelligent DzSafeDrive. 
  Analyse l'image de la route fournie :
  1. Détecte les piétons, animaux, obstacles et véhicules.
  2. Fournis les boîtes englobantes [ymin, xmin, ymax, xmax] (coordonnées de 0 à 1000).
  3. Évalue le niveau de menace (low, medium, high) selon la proximité et la trajectoire.
  4. Détermine si une alerte immédiate est nécessaire (alertNeeded).
  5. Rédige un résumé très court (max 10 mots) du diagnostic.
  Réponds uniquement au format JSON strict selon le schéma fourni.`;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [
            { text: "Analyse cet instantané de conduite pour détecter les risques." },
            {
              inlineData: {
                mimeType: mimeType,
                data: data
              }
            }
          ]
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "Catégorie: person, animal, obstacle, vehicle" },
                  confidence: { type: Type.NUMBER },
                  box: { 
                    type: Type.ARRAY, 
                    items: { type: Type.NUMBER },
                    description: "[ymin, xmin, ymax, xmax]"
                  },
                  threatLevel: { type: Type.STRING, description: "Niveau: low, medium, high" },
                  description: { type: Type.STRING }
                },
                required: ['type', 'box', 'threatLevel']
              }
            },
            summary: { type: Type.STRING },
            alertNeeded: { type: Type.BOOLEAN }
          },
          required: ['risks', 'summary', 'alertNeeded']
        }
      }
    });

    const responseText = result.text;
    if (!responseText) {
      throw new Error("L'API n'a retourné aucun texte.");
    }
    
    return JSON.parse(responseText) as AnalysisResponse;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    // On remonte une erreur plus explicite pour l'UI
    if (error?.message?.includes("INVALID_ARGUMENT")) {
      throw new Error("Format d'image non supporté ou données corrompues. Veuillez réessayer.");
    }
    throw error;
  }
};
