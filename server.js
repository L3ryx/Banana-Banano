// =====================================================
// 🍌 BANANA GENERATOR V3 - IA EMBARQUÉE HUGGINGFACE
// =====================================================

require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// =====================================================
// 🔐 TOKEN ENV RENDER
// Nom de ta clé : Banana
// =====================================================

const HF_TOKEN = process.env.Banana;

if (!HF_TOKEN) {
  console.log("❌ TOKEN Banana NON DETECTÉ");
} else {
  console.log("✅ TOKEN Banana DETECTÉ");
}

// =====================================================
// 🤖 MODELE HUGGINGFACE
// =====================================================

const HF_API =
  "https://router.huggingface.co/hf-inference/models/distilgpt2";

async function generateAI(prompt) {
  const response = await fetch(HF_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 400,
        temperature: 1.2,
        top_p: 0.95,
        do_sample: true,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return "🔥 ERREUR IA : " + JSON.stringify(data);
  }

  return data[0]?.generated_text || "No output";
}

// =====================================================
// 🎛 LISTES OPTIMISÉES (PLUS DE CHOIX)
// =====================================================

const HAUTS = [
  "T-shirt oversize",
  "T-shirt slim",
  "T-shirt streetwear",
  "Chemise luxe",
  "Blazer",
  "Top dentelle",
  "Hoodie",
  "Veste cuir",
  "Crop top",
  "Top sport",
  "Débardeur",
  "Chemise lin",
  "Pull laine",
  "Haut minimaliste",
  "Haut fashion",
  "Haut élégant",
  "Top chic",
];

const BAS = [
  "Jean slim",
  "Jean regular",
  "Jean baggy",
  "Cargo",
  "Pantalon tailleur",
  "Short",
  "Jupe",
  "Legging",
  "Chino",
  "Pantalon large",
  "Pantalon cuir",
  "Pantalon sport",
  "Short en jean",
  "Pantalon cargo",
];

const FONDS = [
  "Rooftop skyline",
  "Plage privée",
  "Villa luxe",
  "Hôtel 5 étoiles",
  "Studio photo pro",
  "Rue urbaine nuit",
  "Forêt lumineuse",
  "Galerie d’art",
  "Piscine infinity",
  "Intérieur minimaliste",
  "Restaurant chic",
  "Terrasse soleil",
  "Appartement design",
  "Montagne",
  "Ville futuriste",
  "Jardin tropical",
];

const ANGLES = [
  "Face",
  "3/4 gauche",
  "3/4 droite",
  "Profil gauche",
  "Profil droit",
  "Légère contre-plongée",
  "Vue hauteur yeux",
];

// =====================================================
// 🚀 GENERATE ROUTE
// =====================================================

app.post("/generate", async (req, res) => {
  const { genre, age, autoMode, haut, bas, fond, angle } = req.body;

  // 🎲 Mode automatique
  const selectedHaut = autoMode
    ? HAUTS[Math.floor(Math.random() * HAUTS.length)]
    : haut;

  const selectedBas = autoMode
    ? BAS[Math.floor(Math.random() * BAS.length)]
    : bas;

  const selectedFond = autoMode
    ? FONDS[Math.floor(Math.random() * FONDS.length)]
    : fond;

  const selectedAngle = autoMode
    ? ANGLES[Math.floor(Math.random() * ANGLES.length)]
    : angle;

  // 🔒 Paramètres verrouillés
  const lockedRules = `
Always centered.
Resolution 800x1000px.
Cinematic lighting.
Real skin texture.
Shallow depth of field.
50mm lens.
Sunglasses from attached image must be placed on face.
Sunglasses are main focus.
Never describe sunglasses as outfit.
Output ONLY in English.
Professional photography.
`;

  const basePrompt = `
Age: ${age}
Gender: ${genre}
Top: ${selectedHaut}
Bottom: ${selectedBas}
Environment: ${selectedFond}
Camera Angle: ${selectedAngle}

${lockedRules}
`;

  const aiPrompt = await generateAI(basePrompt);

  res.json({ prompt: aiPrompt });
});

// =====================================================
// 🚀 LANCEMENT
// =====================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT", PORT);
});
