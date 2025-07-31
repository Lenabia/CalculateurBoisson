// ============================================================================
// CONFIGURATION DES RATIOS ET PARAMÈTRES DE CALCUL
// ============================================================================

// Configuration des ratios standards pour chaque type de boisson
const drinkRatios = {
  wine: {
    // Ratios pour le vin en verres par adulte selon le niveau de consommation
    normal: { red: 1.5, white: 1.5, rose: 0.5 }, // Consommation normale
    low: { red: 1, white: 1, rose: 0.3 }, // Consommation faible
    high: { red: 2, white: 2, rose: 0.8 }, // Consommation élevée
  },
  champagne: {
    // Ratios pour le champagne en coupes par personne
    normal: 2, // Consommation normale
    low: 1, // Consommation faible
    high: 3, // Consommation élevée
  },
  beer: {
    // Ratios pour la bière en bouteilles par adulte
    normal: 2, // Consommation normale
    low: 1, // Consommation faible
    high: 3, // Consommation élevée
  },
  spirits: {
    // Ratios pour les spiritueux (bouteilles 75cl pour 10 personnes)
    normal: 0.1, // Consommation normale
    low: 0.05, // Consommation faible
    high: 0.15, // Consommation élevée
  },
};

// Configuration des ratios de vin selon le type de repas
const mealTypeRatios = {
  // Répartition rouge/blanc/rosé pour viande rouge
  "red-meat": { red: 0.7, white: 0.3, rose: 0 },
  // Répartition rouge/blanc/rosé pour poisson/volaille
  "fish-poultry": { red: 0.3, white: 0.7, rose: 0 },
  // Répartition rouge/blanc/rosé pour repas mixte
  mixed: { red: 0.5, white: 0.5, rose: 0 },
  // Répartition rouge/blanc/rosé pour repas végétarien
  vegetarian: { red: 0, white: 0.6, rose: 0.4 },
};

// ============================================================================
// GESTION DES ÉVÉNEMENTS ET INTERACTIONS
// ============================================================================

// Gestion des interactions avec les checkboxes des boissons
document.querySelectorAll(".drink-option").forEach((option) => {
  // Ajouter un écouteur d'événement sur chaque option de boisson
  option.addEventListener("click", function (e) {
    // Si on ne clique pas directement sur la checkbox
    if (e.target.type !== "checkbox") {
      // Récupérer la checkbox associée à cette option
      const checkbox = this.querySelector('input[type="checkbox"]');
      // Inverser l'état de la checkbox
      checkbox.checked = !checkbox.checked;
    }
    // Basculer la classe CSS "selected" selon l'état de la checkbox
    this.classList.toggle(
      "selected",
      this.querySelector('input[type="checkbox"]').checked
    );
    // Valider la sélection des boissons après chaque changement
    validateDrinksSelection();
  });
});

// Gestion de l'affichage du type de repas selon le niveau d'alcool
document.getElementById("alcoholLevel").addEventListener("change", function () {
  // Récupérer l'élément contenant les options de type de repas
  const mealGroup = document.getElementById("mealTypeGroup");
  // Si aucun alcool n'est sélectionné
  if (this.value === "none") {
    // Masquer les options de type de repas
    mealGroup.classList.add("hidden");
    // Masquer toutes les boissons alcoolisées
    hideAlcoholicDrinks();
  } else {
    // Afficher les options de type de repas
    mealGroup.classList.remove("hidden");
    // Afficher toutes les boissons alcoolisées
    showAlcoholicDrinks();
  }
  // Valider la sélection des boissons après le changement
  validateDrinksSelection();
});

// Gestion du scroll fluide pour le bouton CTA
document.querySelector(".hero-cta").addEventListener("click", function (e) {
  // Empêcher le comportement par défaut du lien
  e.preventDefault();
  // Faire défiler la page vers le calculateur avec animation fluide
  document.querySelector("#calculator").scrollIntoView({ behavior: "smooth" });
});

// Validation en temps réel du nombre d'adultes
document.getElementById("adults").addEventListener("input", function() {
  // Valider le nombre d'adultes à chaque saisie
  validateAdults();
});

// ============================================================================
// FONCTIONS DE VALIDATION
// ============================================================================

// Fonction de validation du nombre d'adultes
function validateAdults() {
  // Récupérer la valeur du nombre d'adultes
  const adults = parseInt(document.getElementById("adults").value) || 0;
  // Récupérer l'élément d'erreur
  const errorElement = document.getElementById("adultsError");
  
  // Vérifier si le nombre d'adultes est valide
  if (adults <= 0) {
    // Afficher le message d'erreur
    errorElement.textContent = "Veuillez renseigner le nombre d'adultes";
    errorElement.style.display = "block";
    return false;
  } else {
    // Masquer le message d'erreur
    errorElement.style.display = "none";
    return true;
  }
}

// Fonction de validation de la sélection des boissons
function validateDrinksSelection() {
  // Récupérer toutes les checkboxes cochées
  const checkedDrinks = document.querySelectorAll('.drink-option input[type="checkbox"]:checked');
  // Récupérer l'élément d'erreur
  const errorElement = document.getElementById("drinksError");
  
  // Vérifier si au moins une boisson est sélectionnée
  if (checkedDrinks.length === 0) {
    // Afficher le message d'erreur
    errorElement.textContent = "Veuillez sélectionner au moins une boisson";
    errorElement.style.display = "block";
    return false;
  } else {
    // Masquer le message d'erreur
    errorElement.style.display = "none";
    return true;
  }
}

// ============================================================================
// FONCTIONS DE GESTION DE L'AFFICHAGE DES BOISSONS
// ============================================================================

// Fonction pour masquer les boissons alcoolisées
function hideAlcoholicDrinks() {
  // Sélectionner toutes les boissons alcoolisées
  const alcoholicDrinks = document.querySelectorAll(".alcoholic-drink");
  // Masquer chaque boisson alcoolisée
  alcoholicDrinks.forEach((drink) => {
    drink.style.display = "none";
    // Décocher la checkbox associée
    const checkbox = drink.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = false;
      drink.classList.remove("selected");
    }
  });
}

// Fonction pour afficher les boissons alcoolisées
function showAlcoholicDrinks() {
  // Sélectionner toutes les boissons alcoolisées
  const alcoholicDrinks = document.querySelectorAll(".alcoholic-drink");
  // Afficher chaque boisson alcoolisée
  alcoholicDrinks.forEach((drink) => {
    drink.style.display = "flex";
  });
}

// ============================================================================
// FONCTION PRINCIPALE DE CALCUL DES BOISSONS
// ============================================================================

// Fonction principale de calcul des boissons
function calculateDrinks() {
  // Valider les entrées avant de calculer
  if (!validateAdults() || !validateDrinksSelection()) {
    return; // Arrêter le calcul si la validation échoue
  }

  // Récupérer les valeurs du formulaire
  const adults = parseInt(document.getElementById("adults").value) || 0;
  const children = parseInt(document.getElementById("children").value) || 0;
  const alcoholLevel = document.getElementById("alcoholLevel").value;
  const mealType = document.getElementById("mealType").value;

  // Créer un objet pour stocker les boissons sélectionnées
  const selectedDrinks = {};
  // Parcourir toutes les checkboxes cochées
  document
    .querySelectorAll('.drink-option input[type="checkbox"]:checked')
    .forEach((cb) => {
      // Marquer cette boisson comme sélectionnée
      selectedDrinks[cb.id] = true;
    });

  // Créer un objet pour stocker les résultats (quantité de base et avec marge)
  const results = {
    base: {}, // Quantités de base
    withMargin: {} // Quantités avec marge de 10%
  };
  
  // Calculer le nombre total d'invités
  const totalGuests = adults + children;

  // Traitement selon le niveau d'alcool choisi
  if (alcoholLevel === "none") {
    // Cas sans alcool - Mocktails uniquement
    if (selectedDrinks["cocktails-non-alcoholic"]) {
      // Calculer le nombre total de verres (1.5 par personne)
      const totalGlasses = totalGuests * 1.5;
      // Convertir en litres (0.2L par verre)
      const totalLiters = Math.ceil(totalGlasses * 0.2);
      // Stocker les résultats pour les mocktails
      results.base["Cocktails sans alcool"] = `${totalLiters} litres (${Math.ceil(totalGlasses)} verres)`;
      results.withMargin["Cocktails sans alcool"] = `${Math.ceil(totalLiters * 1.1)} litres (${Math.ceil(totalGlasses * 1.1)} verres)`;
    }
  } else {
    // Cas avec alcool - traitement de toutes les boissons alcoolisées
    
    // Déterminer le niveau de consommation (low, normal, high)
    const level = alcoholLevel === "low" ? "low" : alcoholLevel === "high" ? "high" : "normal";

    // Calcul pour les vins
    if (selectedDrinks.wine) {
      // Récupérer les ratios selon le type de repas
      const mealRatio = mealTypeRatios[mealType];
      // Récupérer les ratios de consommation de vin selon le niveau
      const wineRatios = drinkRatios.wine[level];

      // Calculer le nombre de verres de vin rouge
      const redGlasses = Math.ceil(adults * wineRatios.red * mealRatio.red);
      // Calculer le nombre de verres de vin blanc
      const whiteGlasses = Math.ceil(adults * wineRatios.white * mealRatio.white);
      // Calculer le nombre de verres de vin rosé
      const roseGlasses = Math.ceil(adults * wineRatios.rose * mealRatio.rose);

      // Si il faut du vin rouge, calculer le nombre de bouteilles (5 verres par bouteille)
      if (redGlasses > 0) {
        const redBottles = Math.ceil(redGlasses / 5);
        results.base["Vin rouge"] = `${redBottles} bouteilles (${redGlasses} verres)`;
        results.withMargin["Vin rouge"] = `${Math.ceil(redBottles * 1.1)} bouteilles (${Math.ceil(redGlasses * 1.1)} verres)`;
      }
      // Si il faut du vin blanc, calculer le nombre de bouteilles
      if (whiteGlasses > 0) {
        const whiteBottles = Math.ceil(whiteGlasses / 5);
        results.base["Vin blanc"] = `${whiteBottles} bouteilles (${whiteGlasses} verres)`;
        results.withMargin["Vin blanc"] = `${Math.ceil(whiteBottles * 1.1)} bouteilles (${Math.ceil(whiteGlasses * 1.1)} verres)`;
      }
      // Si il faut du vin rosé, calculer le nombre de bouteilles
      if (roseGlasses > 0) {
        const roseBottles = Math.ceil(roseGlasses / 5);
        results.base["Vin rosé"] = `${roseBottles} bouteilles (${roseGlasses} verres)`;
        results.withMargin["Vin rosé"] = `${Math.ceil(roseBottles * 1.1)} bouteilles (${Math.ceil(roseGlasses * 1.1)} verres)`;
      }
    }

    // Calcul pour le champagne
    if (selectedDrinks.champagne) {
      // Calculer le nombre de coupes nécessaires
      const champagneGlasses = totalGuests * drinkRatios.champagne[level];
      // Calculer le nombre de bouteilles (6 coupes par bouteille)
      const champagneBottles = Math.ceil(champagneGlasses / 6);
      // Stocker les résultats pour le champagne
      results.base["Champagne"] = `${champagneBottles} bouteilles (${Math.ceil(champagneGlasses)} coupes)`;
      results.withMargin["Champagne"] = `${Math.ceil(champagneBottles * 1.1)} bouteilles (${Math.ceil(champagneGlasses * 1.1)} coupes)`;
    }

    // Calcul pour les bières
    if (selectedDrinks.beer) {
      // Calculer le nombre de bouteilles de bière
      const beerBottles = Math.ceil(adults * drinkRatios.beer[level]);
      // Calculer le nombre de fûts équivalents (1 fût = 50 bouteilles)
      const beerKegs = Math.ceil(beerBottles / 50);
      // Stocker les résultats pour les bières
      results.base["Bières"] = `${beerBottles} bouteilles ou ${beerKegs} fût(s)`;
      results.withMargin["Bières"] = `${Math.ceil(beerBottles * 1.1)} bouteilles ou ${Math.ceil(beerKegs * 1.1)} fût(s)`;
    }

    // Calcul pour les cocktails avec alcool
    if (selectedDrinks["cocktails-alcoholic"]) {
      // Calculer le nombre de verres de cocktail (2 par adulte)
      const cocktailGlasses = Math.ceil(adults * 2);
      // Calculer les litres d'alcool fort nécessaires (0.15L par verre)
      const cocktailLiters = Math.ceil(cocktailGlasses * 0.15);
      // Stocker les résultats pour les cocktails
      results.base["Cocktails avec alcool"] = `${cocktailLiters} litres d'alcool fort (${cocktailGlasses} verres)`;
      results.withMargin["Cocktails avec alcool"] = `${Math.ceil(cocktailLiters * 1.1)} litres d'alcool fort (${Math.ceil(cocktailGlasses * 1.1)} verres)`;
    }

    // Calcul pour les alcools forts individuels
    if (selectedDrinks.spirits) {
      // Calculer le nombre de bouteilles de whisky nécessaires
      const whiskeyBottles = Math.ceil(adults * drinkRatios.spirits[level]);
      // Calculer le nombre de bouteilles de vodka nécessaires
      const vodkaBottles = Math.ceil(adults * drinkRatios.spirits[level]);
      // Calculer les litres de jus/soda nécessaires (20cl pour 4cl d'alcool)
      const juiceLiters = Math.ceil((whiskeyBottles + vodkaBottles) * 0.75 * 5); // 5 fois plus de jus que d'alcool

      // Stocker les résultats pour chaque type de spiritueux
      results.base["Whisky"] = `${whiskeyBottles} bouteille(s) 75cl`;
      results.withMargin["Whisky"] = `${Math.ceil(whiskeyBottles * 1.1)} bouteille(s) 75cl`;
      
      results.base["Vodka"] = `${vodkaBottles} bouteille(s) 75cl`;
      results.withMargin["Vodka"] = `${Math.ceil(vodkaBottles * 1.1)} bouteille(s) 75cl`;
      
      results.base["Jus/Soda pour cocktails"] = `${juiceLiters} litres`;
      results.withMargin["Jus/Soda pour cocktails"] = `${Math.ceil(juiceLiters * 1.1)} litres`;
      
      results.base["Autres spiritueux"] = `${whiskeyBottles} bouteille(s) 75cl (rhum, tequila, etc.)`;
      results.withMargin["Autres spiritueux"] = `${Math.ceil(whiskeyBottles * 1.1)} bouteille(s) 75cl (rhum, tequila, etc.)`;
    }
  }

  // Calcul des boissons non alcoolisées

  // Calcul pour les boissons sucrées (sodas, jus)
  if (selectedDrinks.soft) {
    // Calculer les litres nécessaires (0.5L par adulte, 0.8L par enfant)
    const softLiters = Math.ceil((adults * 0.5 + children * 0.8) * 1);
    // Conversion en bouteilles de 1.5L
    const softBottles = Math.ceil(softLiters / 1.5);
    // Stocker les résultats pour les boissons sucrées
    results.base["Boissons sucrées"] = `${softBottles} bouteilles 1.5L (${softLiters} litres)`;
    results.withMargin["Boissons sucrées"] = `${Math.ceil(softBottles * 1.1)} bouteilles 1.5L (${Math.ceil(softLiters * 1.1)} litres)`;
  }

  // Calcul pour l'eau
  if (selectedDrinks.water) {
    // Calculer les litres d'eau nécessaires (1.2L par personne)
    const waterLiters = Math.ceil(totalGuests * 1.2);
    // Répartir entre eau plate (70%) et eau pétillante (30%)
    const stillWaterLiters = Math.ceil(waterLiters * 0.7);
    const sparklingWaterLiters = Math.ceil(waterLiters * 0.3);
    
    // Conversion en bouteilles de 1.5L pour l'eau plate
    const stillWaterBottles = Math.ceil(stillWaterLiters / 1.5);
    // Conversion en bouteilles de 1.5L pour l'eau pétillante
    const sparklingWaterBottles = Math.ceil(sparklingWaterLiters / 1.5);
    
    // Stocker les résultats pour l'eau
    results.base["Eau plate"] = `${stillWaterBottles} bouteilles 1.5L (${stillWaterLiters} litres)`;
    results.withMargin["Eau plate"] = `${Math.ceil(stillWaterBottles * 1.1)} bouteilles 1.5L (${Math.ceil(stillWaterLiters * 1.1)} litres)`;
    
    results.base["Eau pétillante"] = `${sparklingWaterBottles} bouteilles 1.5L (${sparklingWaterLiters} litres)`;
    results.withMargin["Eau pétillante"] = `${Math.ceil(sparklingWaterBottles * 1.1)} bouteilles 1.5L (${Math.ceil(sparklingWaterLiters * 1.1)} litres)`;
  }

  // Afficher les résultats calculés
  displayResults(results);
}

// ============================================================================
// FONCTIONS D'AFFICHAGE DES RÉSULTATS
// ============================================================================

// Fonction d'affichage des résultats
function displayResults(results) {
  // Récupérer l'élément conteneur des résultats
  const resultsDiv = document.getElementById("results");
  // Récupérer l'élément liste des résultats
  const resultsList = document.getElementById("resultsList");

  // Vérifier s'il y a des résultats à afficher
  if (Object.keys(results.base).length === 0) {
    // Afficher un message si aucune boisson n'est sélectionnée
    resultsList.innerHTML = "<p>Veuillez sélectionner au moins un type de boisson.</p>";
    // Rendre visible la section des résultats
    resultsDiv.style.display = "block";
    return;
  }

  // Commencer la construction du HTML des résultats
  let html = '<div class="results-container">';
  
  // En-tête avec les colonnes
  html += `
    <div class="results-header">
      <div class="results-column">
        <h4>📊 Quantité de base</h4>
      </div>
      <div class="results-column">
        <h4>📈 Quantité avec marge 10%</h4>
      </div>
    </div>
  `;

  // Grille des résultats
  html += '<div class="results-grid">';

  // Parcourir chaque boisson dans les résultats de base
  for (let drink in results.base) {
    // Créer un élément de résultat pour chaque boisson avec deux colonnes
    html += `
      <div class="result-item">
        <div class="result-drink">${drink}</div>
        <div class="result-quantities">
          <div class="result-quantity-base">${results.base[drink]}</div>
          <div class="result-quantity-margin">${results.withMargin[drink]}</div>
        </div>
      </div>
    `;
  }

  // Fermer la grille des résultats
  html += "</div>";
  html += "</div>";

  // Ajouter une section de conseils personnalisés
  html += '<div class="tips-section">';
  html += "<h4>💡 Conseils personnalisés</h4>";
  html += '<ul class="tips-list">';

  // Ajouter des conseils spécifiques selon les boissons sélectionnées
  if (results.base["Vin rouge"] || results.base["Vin blanc"]) {
    html += "<li>🍷 Servez le vin rouge à 16-18°C et le vin blanc à 8-10°C</li>";
  }

  if (results.base["Champagne"]) {
    html += "<li>🥂 Gardez le champagne au frais (6-8°C) et ouvrez juste avant de servir</li>";
  }

  if (results.base["Bières"]) {
    html += "<li>🍺 Prévoyez de la glace pour maintenir les bières fraîches</li>";
  }

  // Ajouter des conseils généraux
  html += "<li>💧 L'eau doit représenter 40% de vos boissons totales</li>";
  html += "<li>🧊 Comptez 500g de glaçons par personne pour l'été</li>";
  html += "</ul>";
  html += "</div>";

  // Injecter le HTML dans la liste des résultats
  resultsList.innerHTML = html;
  // Rendre visible la section des résultats
  resultsDiv.style.display = "block";

  // Faire défiler la page vers les résultats
  resultsDiv.scrollIntoView({ behavior: "smooth" });
}

// ============================================================================
// FONCTIONS DE GESTION DES RÉSULTATS
// ============================================================================

// Fonction pour accepter les résultats
function acceptResults() {
  // Récupérer l'élément conteneur des résultats
  const resultsDiv = document.getElementById("results");
  // Créer un élément de confirmation
  const confirmationDiv = document.createElement("div");
  // Assigner une classe CSS au message de confirmation
  confirmationDiv.className = "confirmation-message";
  // Définir le contenu HTML du message de confirmation
  confirmationDiv.innerHTML = `
    <div class="success-message">
      <h3>✅ Parfait !</h3>
      <p>Vos estimations sont prêtes. Vous pouvez maintenant recevoir cette liste par email ou faire un nouveau calcul.</p>
      <div class="action-buttons">
        <button class="btn btn-primary" onclick="showEmailForm()">📧 Recevoir par email</button>
        <button class="btn btn-secondary" onclick="resetCalculator()">🔄 Nouveau calcul</button>
      </div>
    </div>
  `;

  // Ajouter le message de confirmation aux résultats
  resultsDiv.appendChild(confirmationDiv);
  // Faire défiler vers le message de confirmation
  confirmationDiv.scrollIntoView({ behavior: "smooth" });
}

// Fonction pour afficher le formulaire d'email
function showEmailForm() {
  // Récupérer l'élément conteneur des résultats
  const resultsDiv = document.getElementById("results");
  // Créer un élément pour le formulaire d'email
  const emailDiv = document.createElement("div");
  // Assigner une classe CSS au formulaire d'email
  emailDiv.className = "email-form";
  // Définir le contenu HTML du formulaire d'email
  emailDiv.innerHTML = `
    <div class="email-content">
      <h3>📧 Recevoir vos résultats par email</h3>
      <p>Entrez votre adresse email pour recevoir vos estimations en PDF :</p>
      <div class="email-input-group">
        <input type="email" id="userEmail" placeholder="votre@email.com" required>
        <button class="btn btn-primary" onclick="sendEmail()">📤 Envoyer</button>
      </div>
      <div class="email-info">
        <p>📋 Vous recevrez un PDF détaillé avec toutes vos estimations de boissons</p>
      </div>
    </div>
  `;

  // Ajouter le formulaire d'email aux résultats
  resultsDiv.appendChild(emailDiv);
  // Faire défiler vers le formulaire d'email
  emailDiv.scrollIntoView({ behavior: "smooth" });
}

// Fonction pour envoyer l'email (simulation)
function sendEmail() {
  // Récupérer l'adresse email saisie
  const email = document.getElementById("userEmail").value;
  
  // Valider l'email
  if (!email || !email.includes("@")) {
    alert("Veuillez saisir une adresse email valide");
    return;
  }

  // Simuler l'envoi d'email (dans un vrai projet, cela appellerait une API)
  const emailDiv = document.querySelector(".email-form");
  emailDiv.innerHTML = `
    <div class="email-success">
      <h3>✅ Email envoyé !</h3>
      <p>Vos estimations ont été envoyées à ${email}</p>
      <p>📧 Vérifiez votre boîte de réception (et vos spams)</p>
      <button class="btn btn-secondary" onclick="resetCalculator()">🔄 Nouveau calcul</button>
    </div>
  `;
}

// Fonction pour personnaliser les résultats
function customizeResults() {
  // Récupérer l'élément conteneur des résultats
  const resultsDiv = document.getElementById("results");
  // Créer un élément de personnalisation
  const customizeDiv = document.createElement("div");
  // Assigner une classe CSS à la section de personnalisation
  customizeDiv.className = "customize-section";
  // Définir le contenu HTML de la section de personnalisation
  customizeDiv.innerHTML = `
    <div class="customize-content">
      <h3>🎯 Personnaliser vos quantités</h3>
      <p>Ajustez les quantités selon vos préférences :</p>
      <div class="customize-form">
        <div class="form-group">
          <label>Facteur de consommation :</label>
          <select id="customFactor" onchange="applyCustomFactor()">
            <option value="0.8">Plus léger (-20%)</option>
            <option value="1.0" selected>Standard</option>
            <option value="1.2">Plus généreux (+20%)</option>
            <option value="1.5">Très généreux (+50%)</option>
          </select>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="summerBonus" onchange="applyCustomFactor()">
            Bonus été (+30% boissons fraîches)
          </label>
        </div>
        <div class="action-buttons">
          <button class="btn btn-primary" onclick="acceptResults()">✅ Valider ces ajustements</button>
          <button class="btn btn-secondary" onclick="resetCustomization()">❌ Annuler</button>
        </div>
      </div>
    </div>
  `;

  // Ajouter la section de personnalisation aux résultats
  resultsDiv.appendChild(customizeDiv);
  // Faire défiler vers la section de personnalisation
  customizeDiv.scrollIntoView({ behavior: "smooth" });
}

// Fonction pour appliquer le facteur de personnalisation
function applyCustomFactor() {
  // Récupérer la valeur du facteur de personnalisation
  const factor = parseFloat(document.getElementById("customFactor").value);
  // Vérifier si le bonus été est activé
  const summerBonus = document.getElementById("summerBonus").checked;

  // Recalculer avec le nouveau facteur (fonctionnalité à implémenter)
  // Cette fonction devrait idéalement stocker les résultats originaux et les ajuster
  console.log("Applying factor:", factor, "Summer bonus:", summerBonus);

  // Afficher un message de confirmation temporaire
  const customizeSection = document.querySelector(".customize-section");
  if (customizeSection) {
    // Chercher ou créer l'élément de message
    const messageDiv =
      customizeSection.querySelector(".factor-message") ||
      document.createElement("div");
    // Assigner une classe CSS au message
    messageDiv.className = "factor-message";
    // Définir le contenu du message
    messageDiv.innerHTML = `
      <p style="background: #e8f5e8; padding: 10px; border-radius: 5px; margin: 10px 0;">
        ✅ Facteur appliqué : ${factor}x ${summerBonus ? "(+ bonus été)" : ""}
      </p>
    `;

    // Ajouter le message s'il n'existe pas déjà
    if (!customizeSection.querySelector(".factor-message")) {
      customizeSection.querySelector(".customize-form").appendChild(messageDiv);
    }
  }
}

// Fonction pour réinitialiser la personnalisation
function resetCustomization() {
  // Chercher la section de personnalisation
  const customizeSection = document.querySelector(".customize-section");
  if (customizeSection) {
    // Supprimer la section de personnalisation
    customizeSection.remove();
  }
}

// ============================================================================
// FONCTIONS DE RÉINITIALISATION
// ============================================================================

// Fonction pour réinitialiser complètement le calculateur
function resetCalculator() {
  // Remettre les valeurs par défaut dans le formulaire
  document.getElementById("adults").value = 50;
  document.getElementById("children").value = 10;
  document.getElementById("alcoholLevel").value = "normal";
  document.getElementById("mealType").value = "mixed";

  // Réinitialiser les sélections de boissons
  document
    .querySelectorAll('.drink-option input[type="checkbox"]')
    .forEach((cb) => {
      // Cocher uniquement les boissons principales par défaut
      cb.checked = ["soft", "wine", "champagne", "water"].includes(cb.id);
      // Mettre à jour l'apparence visuelle
      cb.closest(".drink-option").classList.toggle("selected", cb.checked);
    });

  // Masquer la section des résultats
  document.getElementById("results").style.display = "none";
  
  // Masquer les messages d'erreur
  document.getElementById("adultsError").style.display = "none";
  document.getElementById("drinksError").style.display = "none";

  // Afficher toutes les boissons alcoolisées
  showAlcoholicDrinks();

  // Faire défiler vers le haut du calculateur
  document.getElementById("calculator").scrollIntoView({ behavior: "smooth" });
}

// ============================================================================
// INITIALISATION AU CHARGEMENT DE LA PAGE
// ============================================================================

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  // Appliquer l'apparence visuelle aux boissons présélectionnées
  document
    .querySelectorAll('.drink-option input[type="checkbox"]:checked')
    .forEach((cb) => {
      // Ajouter la classe "selected" aux options cochées
      cb.closest(".drink-option").classList.add("selected");
    });

  // Initialiser l'affichage du type de repas selon le niveau d'alcool
  const alcoholLevel = document.getElementById("alcoholLevel").value;
  const mealGroup = document.getElementById("mealTypeGroup");
  // Si aucun alcool n'est sélectionné, masquer le type de repas
  if (alcoholLevel === "none") {
    mealGroup.classList.add("hidden");
    hideAlcoholicDrinks();
  }
  
  // Valider les champs au chargement
  validateAdults();
  validateDrinksSelection();
});