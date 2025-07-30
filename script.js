// Configuration des ratios standards
const drinkRatios = {
  wine: {
    normal: { red: 1.5, white: 1.5, rose: 0.5 }, // verres par adulte
    low: { red: 1, white: 1, rose: 0.3 },
    high: { red: 2, white: 2, rose: 0.8 },
  },
  champagne: {
    normal: 2, // coupes par personne
    low: 1,
    high: 3,
  },
  beer: {
    normal: 2, // bouteilles par adulte
    low: 1,
    high: 3,
  },
  spirits: {
    normal: 0.1, // bouteilles 75cl pour 10 personnes
    low: 0.05,
    high: 0.15,
  },
};

// Adaptation selon le type de repas
const mealTypeRatios = {
  "red-meat": { red: 0.7, white: 0.3, rose: 0 },
  "fish-poultry": { red: 0.3, white: 0.7, rose: 0 },
  mixed: { red: 0.5, white: 0.5, rose: 0 },
  vegetarian: { red: 0, white: 0.6, rose: 0.4 },
};

// Gestion des checkboxes
document.querySelectorAll(".drink-option").forEach((option) => {
  option.addEventListener("click", function (e) {
    if (e.target.type !== "checkbox") {
      const checkbox = this.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
    }
    this.classList.toggle(
      "selected",
      this.querySelector('input[type="checkbox"]').checked
    );
  });
});

// Masquer/afficher type de repas selon niveau alcool
document.getElementById("alcoholLevel").addEventListener("change", function () {
  const mealGroup = document.getElementById("mealTypeGroup");
  if (this.value === "none") {
    mealGroup.classList.add("hidden");
  } else {
    mealGroup.classList.remove("hidden");
  }
});

// Smooth scroll pour le CTA
document.querySelector(".hero-cta").addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector("#calculator").scrollIntoView({ behavior: "smooth" });
});

function calculateDrinks() {
  const adults = parseInt(document.getElementById("adults").value) || 0;
  const children = parseInt(document.getElementById("children").value) || 0;
  const alcoholLevel = document.getElementById("alcoholLevel").value;
  const mealType = document.getElementById("mealType").value;

  // Vérifier quelles boissons sont sélectionnées
  const selectedDrinks = {};
  document
    .querySelectorAll('.drink-option input[type="checkbox"]:checked')
    .forEach((cb) => {
      selectedDrinks[cb.id] = true;
    });

  if (adults === 0) {
    alert("Veuillez indiquer le nombre d'adultes");
    return;
  }

  const results = {};
  const totalGuests = adults + children;

  // Calcul selon le niveau d'alcool
  if (alcoholLevel === "none") {
    // Sans alcool - Mocktails
    if (selectedDrinks.cocktails) {
      const totalGlasses = totalGuests * 1.5;
      const totalLiters = Math.ceil(totalGlasses * 0.2);
      results["Mocktails"] = `${totalLiters} litres (${Math.ceil(
        totalGlasses
      )} verres)`;
    }
  } else {
    // Avec alcool
    const level =
      alcoholLevel === "low"
        ? "low"
        : alcoholLevel === "high"
        ? "high"
        : "normal";

    // Vins
    if (selectedDrinks.wine) {
      const mealRatio = mealTypeRatios[mealType];
      const wineRatios = drinkRatios.wine[level];

      const redGlasses = Math.ceil(adults * wineRatios.red * mealRatio.red);
      const whiteGlasses = Math.ceil(
        adults * wineRatios.white * mealRatio.white
      );
      const roseGlasses = Math.ceil(adults * wineRatios.rose * mealRatio.rose);

      if (redGlasses > 0) {
        results["Vin rouge"] = `${Math.ceil(
          redGlasses / 5
        )} bouteilles (${redGlasses} verres)`;
      }
      if (whiteGlasses > 0) {
        results["Vin blanc"] = `${Math.ceil(
          whiteGlasses / 5
        )} bouteilles (${whiteGlasses} verres)`;
      }
      if (roseGlasses > 0) {
        results["Vin rosé"] = `${Math.ceil(
          roseGlasses / 5
        )} bouteilles (${roseGlasses} verres)`;
      }
    }

    // Champagne
    if (selectedDrinks.champagne) {
      const champagneGlasses = totalGuests * drinkRatios.champagne[level];
      const champagneBottles = Math.ceil(champagneGlasses / 6); // 6 coupes par bouteille
      results["Champagne"] = `${champagneBottles} bouteilles (${Math.ceil(
        champagneGlasses
      )} coupes)`;
    }

    // Bières
    if (selectedDrinks.beer) {
      const beerBottles = Math.ceil(adults * drinkRatios.beer[level]);
      const beerKegs = Math.ceil(beerBottles / 50); // 1 fût = environ 50 bouteilles
      results["Bières"] = `${beerBottles} bouteilles ou ${beerKegs} fût(s)`;
    }

    // Cocktails avec alcool fort
    if (selectedDrinks.cocktails) {
      const cocktailGlasses = Math.ceil(adults * 2);
      const cocktailLiters = Math.ceil(cocktailGlasses * 0.15);
      results[
        "Cocktails"
      ] = `${cocktailLiters} litres d'alcool fort (${cocktailGlasses} verres)`;
    }

    // Alcools forts individuels
    if (selectedDrinks.spirits) {
      const whiskeyBottles = Math.ceil(adults * drinkRatios.spirits[level]);
      const vodkaBottles = Math.ceil(adults * drinkRatios.spirits[level]);

      results["Whisky"] = `${whiskeyBottles} bouteille(s) 75cl`;
      results["Vodka"] = `${vodkaBottles} bouteille(s) 75cl`;
      results[
        "Autres spiritueux"
      ] = `${whiskeyBottles} bouteille(s) 75cl (rhum, tequila, etc.)`;
    }
  }

  // Boissons non alcoolisées

  // Boissons sucrées
  if (selectedDrinks.soft) {
    const softLiters = Math.ceil((adults * 0.5 + children * 0.8) * 1); // 0.5L par adulte, 0.8L par enfant
    results["Boissons sucrées"] = `${softLiters} litres`;
  }

  // Eau
  if (selectedDrinks.water) {
    const waterLiters = Math.ceil(totalGuests * 1.2); // 1.2L par personne
    const stillWater = Math.ceil(waterLiters * 0.7);
    const sparklingWater = Math.ceil(waterLiters * 0.3);
    results["Eau plate"] = `${stillWater} litres`;
    results["Eau pétillante"] = `${sparklingWater} litres`;
  }

  // Appliquer la marge de 10%
  for (let key in results) {
    if (
      results[key].includes("bouteilles") ||
      results[key].includes("litres")
    ) {
      const numbers = results[key].match(/\d+/g);
      if (numbers) {
        const originalQuantity = parseInt(numbers[0]);
        const withMargin = Math.ceil(originalQuantity * 1.1);
        results[key] = results[key].replace(
          originalQuantity.toString(),
          withMargin.toString()
        );
      }
    }
  }

  displayResults(results);
}

function displayResults(results) {
  const resultsDiv = document.getElementById("results");
  const resultsList = document.getElementById("resultsList");

  if (Object.keys(results).length === 0) {
    resultsList.innerHTML =
      "<p>Veuillez sélectionner au moins un type de boisson.</p>";
    resultsDiv.style.display = "block";
    return;
  }

  let html = '<div class="results-grid">';

  for (let drink in results) {
    html += `
            <div class="result-item">
                <div class="result-drink">${drink}</div>
                <div class="result-quantity">${results[drink]}</div>
            </div>
        `;
  }

  html += "</div>";

  // Ajouter des conseils personnalisés
  html += '<div class="tips-section">';
  html += "<h4>💡 Conseils personnalisés</h4>";
  html += '<ul class="tips-list">';

  if (results["Vin rouge"] || results["Vin blanc"]) {
    html +=
      "<li>🍷 Servez le vin rouge à 16-18°C et le vin blanc à 8-10°C</li>";
  }

  if (results["Champagne"]) {
    html +=
      "<li>🥂 Gardez le champagne au frais (6-8°C) et ouvrez juste avant de servir</li>";
  }

  if (results["Bières"]) {
    html +=
      "<li>🍺 Prévoyez de la glace pour maintenir les bières fraîches</li>";
  }

  html += "<li>💧 L'eau doit représenter 40% de vos boissons totales</li>";
  html += "<li>🧊 Comptez 500g de glaçons par personne pour l'été</li>";
  html += "</ul>";
  html += "</div>";

  resultsList.innerHTML = html;
  resultsDiv.style.display = "block";

  // Scroll vers les résultats
  resultsDiv.scrollIntoView({ behavior: "smooth" });
}

function acceptResults() {
  // Afficher un message de confirmation
  const resultsDiv = document.getElementById("results");
  const confirmationDiv = document.createElement("div");
  confirmationDiv.className = "confirmation-message";
  confirmationDiv.innerHTML = `
        <div class="success-message">
            <h3>✅ Parfait !</h3>
            <p>Vos estimations sont prêtes. Vous pouvez maintenant imprimer cette liste ou la sauvegarder.</p>
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimer la liste</button>
                <button class="btn btn-secondary" onclick="resetCalculator()">🔄 Nouveau calcul</button>
            </div>
        </div>
    `;

  resultsDiv.appendChild(confirmationDiv);
  confirmationDiv.scrollIntoView({ behavior: "smooth" });
}

function customizeResults() {
  // Afficher une interface de personnalisation
  const resultsDiv = document.getElementById("results");
  const customizeDiv = document.createElement("div");
  customizeDiv.className = "customize-section";
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

  resultsDiv.appendChild(customizeDiv);
  customizeDiv.scrollIntoView({ behavior: "smooth" });
}

function applyCustomFactor() {
  const factor = parseFloat(document.getElementById("customFactor").value);
  const summerBonus = document.getElementById("summerBonus").checked;

  // Recalculer avec le nouveau facteur
  // Cette fonction devrait idéalement stocker les résultats originaux et les ajuster
  console.log("Applying factor:", factor, "Summer bonus:", summerBonus);

  // Pour l'instant, on affiche juste un message
  const customizeSection = document.querySelector(".customize-section");
  if (customizeSection) {
    const messageDiv =
      customizeSection.querySelector(".factor-message") ||
      document.createElement("div");
    messageDiv.className = "factor-message";
    messageDiv.innerHTML = `
            <p style="background: #e8f5e8; padding: 10px; border-radius: 5px; margin: 10px 0;">
                ✅ Facteur appliqué : ${factor}x ${
      summerBonus ? "(+ bonus été)" : ""
    }
            </p>
        `;

    if (!customizeSection.querySelector(".factor-message")) {
      customizeSection.querySelector(".customize-form").appendChild(messageDiv);
    }
  }
}

function resetCustomization() {
  const customizeSection = document.querySelector(".customize-section");
  if (customizeSection) {
    customizeSection.remove();
  }
}

function resetCalculator() {
  // Réinitialiser le formulaire
  document.getElementById("adults").value = 50;
  document.getElementById("children").value = 10;
  document.getElementById("alcoholLevel").value = "normal";
  document.getElementById("mealType").value = "mixed";

  // Décocher toutes les boissons sauf les principales
  document
    .querySelectorAll('.drink-option input[type="checkbox"]')
    .forEach((cb) => {
      cb.checked = ["soft", "wine", "champagne", "water"].includes(cb.id);
      cb.closest(".drink-option").classList.toggle("selected", cb.checked);
    });

  // Cacher les résultats
  document.getElementById("results").style.display = "none";

  // Scroll vers le haut du calculateur
  document.getElementById("calculator").scrollIntoView({ behavior: "smooth" });
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  // Marquer les boissons par défaut comme sélectionnées visuellement
  document
    .querySelectorAll('.drink-option input[type="checkbox"]:checked')
    .forEach((cb) => {
      cb.closest(".drink-option").classList.add("selected");
    });

  // Initialiser l'affichage du type de repas
  const alcoholLevel = document.getElementById("alcoholLevel").value;
  const mealGroup = document.getElementById("mealTypeGroup");
  if (alcoholLevel === "none") {
    mealGroup.classList.add("hidden");
  }
});
