// ============================================================================
// GESTION DE LA NAVIGATION RESPONSIVE
// ============================================================================

// Fonction pour gérer le menu hamburger
function toggleHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Fonction pour fermer le menu mobile lors du clic sur un lien
function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// ============================================================================
// FONCTIONS DE VALIDATION
// ============================================================================

// Fonction pour valider le nombre d'adultes
function validateAdults() {
    const adultsInput = document.getElementById('adults');
    const adultsError = document.getElementById('adultsError');
    const calculateBtn = document.querySelector('.btn-primary');
    
    if (adultsInput.value === '' || parseInt(adultsInput.value) === 0) {
        adultsError.style.display = 'block';
        calculateBtn.disabled = true;
        return false;
    } else {
        adultsError.style.display = 'none';
        calculateBtn.disabled = false;
        return true;
    }
}

// Fonction pour valider la sélection des boissons
function validateDrinksSelection() {
    const selectedDrinks = document.querySelectorAll('input[name="drinks"]:checked');
    const drinksError = document.getElementById('drinksError');
    const calculateBtn = document.querySelector('.btn-primary');
    
    if (selectedDrinks.length === 0) {
        drinksError.style.display = 'block';
        calculateBtn.disabled = true;
        return false;
    } else {
        drinksError.style.display = 'none';
        calculateBtn.disabled = false;
        return true;
    }
}

// ============================================================================
// GESTION DES BOISSONS ALCOOLISÉES
// ============================================================================

// Fonction pour masquer les boissons alcoolisées
function hideAlcoholicDrinks() {
    const alcoholicDrinks = document.querySelectorAll('#alcoholicDrinks, #alcoholicDrinks2, #alcoholicDrinks3');
    alcoholicDrinks.forEach(section => {
        section.style.display = 'none';
    });
}

// Fonction pour afficher les boissons alcoolisées
function showAlcoholicDrinks() {
    const alcoholicDrinks = document.querySelectorAll('#alcoholicDrinks, #alcoholicDrinks2, #alcoholicDrinks3');
    alcoholicDrinks.forEach(section => {
        section.style.display = 'block';
    });
}

// ============================================================================
// CALCUL DES BOISSONS
// ============================================================================

// Fonction principale de calcul des boissons
function calculateDrinks() {
    // Validation des champs
    if (!validateAdults() || !validateDrinksSelection()) {
        return;
    }

    // Récupération des valeurs du formulaire
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;
    const mealType = document.getElementById('mealType').value;
    const menuType = document.getElementById('menuType').value;
    const seasonType = document.getElementById('seasonType').value;
    const alcoholLevel = document.getElementById('alcoholLevel').value;
    
    // Récupération des boissons sélectionnées
    const selectedDrinks = Array.from(document.querySelectorAll('input[name="drinks"]:checked'))
        .map(checkbox => checkbox.value);

    // Calcul des besoins en boissons avec nouvelle logique de non-cumul
    const results = {
        base: {},
        withMargin: {}
    };

    // ============================================================================
    // NOUVEAUX RATIOS PROFESSIONNELS (NON-CUMULATIFS)
    // ============================================================================
    
    // Budget liquide total par personne (standards professionnels)
    const liquidBudget = {
        adults: 2.0,    // 2L maximum par adulte
        children: 1.5   // 1.5L maximum par enfant
    };

    // Profils d'invités (pourcentages de la population adulte)
    const guestProfiles = {
        'wine-lovers': 0.60,      // 60% boivent principalement du vin
        'beer-lovers': 0.25,      // 25% boivent principalement de la bière
        'cocktail-lovers': 0.30,  // 30% boivent des cocktails
        'non-alcoholic': 0.15,    // 15% ne boivent que du soft
        'mixed-drinkers': 0.40    // 40% alternent entre plusieurs types
    };

    // Répartition des vins selon le type de menu ET la saison
    const wineDistributionConfig = {
        'meat-menu': {
            'spring': { red: 0.60, white: 0.25, rose: 0.15 },
            'summer': { red: 0.50, white: 0.25, rose: 0.25 },
            'autumn': { red: 0.70, white: 0.25, rose: 0.05 },
            'winter': { red: 0.75, white: 0.25, rose: 0.00 }
        },
        'fish-menu': {
            'spring': { red: 0.20, white: 0.60, rose: 0.20 },
            'summer': { red: 0.15, white: 0.60, rose: 0.25 },
            'autumn': { red: 0.25, white: 0.70, rose: 0.05 },
            'winter': { red: 0.25, white: 0.75, rose: 0.00 }
        }
    };

    // Multiplicateurs selon le type de repas
    const mealTypeRatios = {
        'aperitif': 0.7,
        'cocktail': 1.0,
        'dinner': 1.2,
        'buffet': 1.1
    };

    // Multiplicateurs selon le niveau d'alcool
    const alcoholLevelRatios = {
        'normal': 1.0,
        'sans-alcool': 0.0,
        'tres-alcoolise': 1.5
    };

    // ============================================================================
    // CALCUL DU BUDGET LIQUIDE TOTAL
    // ============================================================================
    
    const mealMultiplier = mealTypeRatios[mealType];
    
    // Budget total pour tous les invités
    const totalLiquidBudget = (liquidBudget.adults * adults + liquidBudget.children * children) * mealMultiplier;
    
    // ============================================================================
    // LOGIQUE DE RÉPARTITION AVEC PROFILS D'INVITÉS
    // ============================================================================
    
    let wineConsumption = 0;
    let beerConsumption = 0;
    let champagneConsumption = 0;
    let strongAlcoholConsumption = 0;
    let cocktailsAlcoholConsumption = 0;
    let cocktailsNoAlcoholConsumption = 0;
    let softConsumption = 0;

    // Calcul selon les profils d'invités et les boissons sélectionnées
    if (selectedDrinks.includes('wine')) {
        // 60% des adultes boivent du vin (0.5L par personne)
        wineConsumption = adults * guestProfiles['wine-lovers'] * 0.5;
    }
    
    if (selectedDrinks.includes('beer')) {
        // 25% des adultes boivent de la bière (0.25L par personne)
        beerConsumption = adults * guestProfiles['beer-lovers'] * 0.25;
    }
    
    if (selectedDrinks.includes('champagne')) {
        // Champagne ponctuel : 0.3L par adulte (tous les adultes)
        champagneConsumption = adults * 0.3;
    }
    
    if (selectedDrinks.includes('strong-alcohol')) {
        // 10% des adultes boivent des alcools forts (0.2L par personne)
        strongAlcoholConsumption = adults * 0.1 * 0.2;
    }
    
    if (selectedDrinks.includes('cocktails-alcohol')) {
        // 30% des adultes boivent des cocktails avec alcool (0.4L par personne)
        cocktailsAlcoholConsumption = adults * guestProfiles['cocktail-lovers'] * 0.4;
    }
    
    if (selectedDrinks.includes('cocktails-no-alcohol')) {
        // Cocktails sans alcool : 0.3L par adulte + 0.5L par enfant
        cocktailsNoAlcoholConsumption = adults * 0.3 + children * 0.5;
    }

    // Application du multiplicateur d'alcool
    if (alcoholLevel === 'sans-alcool') {
        wineConsumption = 0;
        champagneConsumption = 0;
        beerConsumption = 0;
        strongAlcoholConsumption = 0;
        cocktailsAlcoholConsumption = 0;
    } else if (alcoholLevel === 'tres-alcoolise') {
        wineConsumption *= 1.5;
        beerConsumption *= 1.5;
        strongAlcoholConsumption *= 2.0;
        cocktailsAlcoholConsumption *= 1.5;
    }

    // Calcul du soft comme variable d'ajustement
    const totalAlcoholicConsumption = wineConsumption + beerConsumption + champagneConsumption + 
                                     strongAlcoholConsumption + cocktailsAlcoholConsumption;
    
    // Soft = Budget total - Consommation alcoolisée + Soft pour enfants et non-alcooliques
    softConsumption = totalLiquidBudget - totalAlcoholicConsumption + 
                     (children * liquidBudget.children) + 
                     (adults * guestProfiles['non-alcoholic'] * liquidBudget.adults);

    // Vérification que le soft ne soit pas négatif
    if (softConsumption < 0) {
        softConsumption = 0;
    }

    // ============================================================================
    // CALCUL DES QUANTITÉS FINALES
    // ============================================================================
    
    // Soft drinks (en litres ET bouteilles)
    if (softConsumption > 0) {
        const softBottles = Math.ceil(softConsumption / 1.5); // Bouteilles de 1.5L
        results.base['Boissons soft'] = `${Math.ceil(softConsumption)} L (${softBottles} bouteilles 1.5L)`;
        results.withMargin['Boissons soft'] = `${Math.ceil(softConsumption * 1.1)} L (${Math.ceil(softBottles * 1.1)} bouteilles 1.5L)`;
    }
    
    // Vins avec répartition selon menu et saison
    if (wineConsumption > 0) {
        const wineBottles = Math.ceil(wineConsumption / 0.75); // 75cl par bouteille
        const wineDistribution = getWineDistribution(menuType, seasonType, wineBottles);
        
        // Ajouter la répartition détaillée des vins
        results.base['Vins (total)'] = `${wineBottles} bouteilles (${Math.ceil(wineConsumption)} L)`;
        results.withMargin['Vins (total)'] = `${Math.ceil(wineBottles * 1.1)} bouteilles (${Math.ceil(wineConsumption * 1.1)} L)`;
        
        // Ajouter les détails par type de vin
        Object.keys(wineDistribution).forEach(wineType => {
            const quantity = wineDistribution[wineType];
            if (quantity > 0) {
                const wineName = getWineName(wineType);
                results.base[`  - ${wineName}`] = `${quantity} bouteilles`;
                results.withMargin[`  - ${wineName}`] = `${Math.ceil(quantity * 1.1)} bouteilles`;
            }
        });
    }
    
    // Champagne
    if (champagneConsumption > 0) {
        const champagneBottles = Math.ceil(champagneConsumption / 0.75); // 75cl par bouteille
        results.base['Champagne'] = `${champagneBottles} bouteilles (${Math.ceil(champagneConsumption)} L)`;
        results.withMargin['Champagne'] = `${Math.ceil(champagneBottles * 1.1)} bouteilles (${Math.ceil(champagneConsumption * 1.1)} L)`;
    }
    
    // Bières
    if (beerConsumption > 0) {
        const beerBottles = Math.ceil(beerConsumption / 0.33); // 33cl par bouteille/canette
        results.base['Bières'] = `${beerBottles} bouteilles/canettes (${Math.ceil(beerConsumption)} L)`;
        results.withMargin['Bières'] = `${Math.ceil(beerBottles * 1.1)} bouteilles/canettes (${Math.ceil(beerConsumption * 1.1)} L)`;
    }
    
    // Alcools forts
    if (strongAlcoholConsumption > 0) {
        const strongAlcoholBottles = Math.ceil(strongAlcoholConsumption / 0.7); // 70cl par bouteille
        results.base['Alcools forts'] = `${strongAlcoholBottles} bouteilles (${Math.ceil(strongAlcoholConsumption)} L)`;
        results.withMargin['Alcools forts'] = `${Math.ceil(strongAlcoholBottles * 1.1)} bouteilles (${Math.ceil(strongAlcoholConsumption * 1.1)} L)`;
    }
    
    // Cocktails avec alcool (en verres ET litres)
    if (cocktailsAlcoholConsumption > 0) {
        const cocktailsGlasses = Math.ceil(cocktailsAlcoholConsumption / 0.2); // 20cl par verre
        results.base['Cocktails avec alcool'] = `${cocktailsGlasses} verres (${Math.ceil(cocktailsAlcoholConsumption)} L)`;
        results.withMargin['Cocktails avec alcool'] = `${Math.ceil(cocktailsGlasses * 1.1)} verres (${Math.ceil(cocktailsAlcoholConsumption * 1.1)} L)`;
    }
    
    // Cocktails sans alcool (en verres ET litres)
    if (cocktailsNoAlcoholConsumption > 0) {
        const cocktailsGlasses = Math.ceil(cocktailsNoAlcoholConsumption / 0.2); // 20cl par verre
        results.base['Cocktails sans alcool'] = `${cocktailsGlasses} verres (${Math.ceil(cocktailsNoAlcoholConsumption)} L)`;
        results.withMargin['Cocktails sans alcool'] = `${Math.ceil(cocktailsGlasses * 1.1)} verres (${Math.ceil(cocktailsNoAlcoholConsumption * 1.1)} L)`;
    }

    // Affichage des résultats
    displayResults(results);
}

// ============================================================================
// FONCTIONS UTILITAIRES POUR LA RÉPARTITION DES VINS
// ============================================================================

// Fonction pour obtenir la répartition des vins selon le menu
function getWineDistribution(menuType, seasonType, totalWineBottles) {
    const wineDistributionConfig = {
        'meat-menu': {
            'spring': { red: 0.60, white: 0.25, rose: 0.15 },
            'summer': { red: 0.50, white: 0.25, rose: 0.25 },
            'autumn': { red: 0.70, white: 0.25, rose: 0.05 },
            'winter': { red: 0.75, white: 0.25, rose: 0.00 }
        },
        'fish-menu': {
            'spring': { red: 0.20, white: 0.60, rose: 0.20 },
            'summer': { red: 0.15, white: 0.60, rose: 0.25 },
            'autumn': { red: 0.25, white: 0.70, rose: 0.05 },
            'winter': { red: 0.25, white: 0.75, rose: 0.00 }
        }
    };
    
    const distribution = wineDistributionConfig[menuType][seasonType] || wineDistributionConfig['meat-menu']['spring'];
    
    return {
        red: Math.ceil(totalWineBottles * distribution.red),
        white: Math.ceil(totalWineBottles * distribution.white),
        rose: Math.ceil(totalWineBottles * distribution.rose)
    };
}

// Fonction pour obtenir le nom français du type de vin
function getWineName(wineType) {
    const wineNames = {
        'red': 'Vin rouge',
        'white': 'Vin blanc',
        'rose': 'Vin rosé'
    };
    return wineNames[wineType] || wineType;
}

// ============================================================================
// AFFICHAGE DES RÉSULTATS
// ============================================================================

// Fonction pour afficher les résultats
function displayResults(results) {
    const resultsOverlay = document.getElementById('resultsOverlay');
    const resultsContent = document.getElementById('resultsContent');

    // Génération du HTML pour les résultats
    let html = `
        <div class="results-container">
            <div class="results-header">
                <div class="results-column">
                    <h4>📊 Quantité de base</h4>
                </div>
                <div class="results-column">
                    <h4>📈 Quantité avec marge 10%</h4>
                </div>
            </div>
            <div class="results-grid">
    `;

    // Ajout de chaque boisson dans les résultats
    Object.keys(results.base).forEach(drinkName => {
        html += `
            <div class="result-item">
                <div class="result-drink">${drinkName}</div>
                <div class="result-quantities">
                    <div class="result-quantity-base">${results.base[drinkName]}</div>
                    <div class="result-quantity-margin">${results.withMargin[drinkName]}</div>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
        
        <div class="tips-section">
            <h5>💡 Conseils pour votre mariage</h5>
            <ul class="tips-list">
                <li>🎯 Calcul basé sur 2L maximum par adulte (standards professionnels)</li>
                <li>📊 Répartition intelligente avec profils d'invités (60% wine-lovers, 25% beer-lovers)</li>
                <li>🍷 Répartition des vins selon votre menu ET saison</li>
                <li>🧊 N'oubliez pas la glace pour les cocktails</li>
                <li>🥤 Gardez des boissons soft pour les conducteurs</li>
                <li>📦 Marge de 10% incluse pour éviter les pénuries</li>
            </ul>
        </div>
    `;

    // Affichage des résultats
    resultsContent.innerHTML = html;
    resultsOverlay.style.display = 'flex';
}

// ============================================================================
// GESTION DES RÉSULTATS
// ============================================================================

// Fonction pour fermer les résultats
function closeResults() {
    const resultsOverlay = document.getElementById('resultsOverlay');
    resultsOverlay.style.display = 'none';
}

// Fonction pour accepter les résultats
function acceptResults() {
    // Simulation d'acceptation
    alert('✅ Vos résultats ont été enregistrés !');
    closeResults();
}

// ============================================================================
// GESTION DE L'EMAIL
// ============================================================================

// Fonction pour afficher le formulaire email
function showEmailForm() {
    const emailForm = document.getElementById('emailForm');
    emailForm.style.display = 'block';
    document.getElementById('emailInput').focus();
}

// Fonction pour masquer le formulaire email
function hideEmailForm() {
    const emailForm = document.getElementById('emailForm');
    emailForm.style.display = 'none';
    document.getElementById('emailInput').value = '';
}

// Fonction pour envoyer l'email
function sendEmail() {
    const email = document.getElementById('emailInput').value;
    
    if (!email || !email.includes('@')) {
        alert('Veuillez saisir une adresse email valide');
        return;
    }

    // Simulation d'envoi d'email
    alert(`📧 Vos résultats ont été envoyés à ${email}\n\nUn PDF avec vos calculs sera joint à l'email.`);
    
    // Masquage du formulaire email
    hideEmailForm();
}

// ============================================================================
// RÉINITIALISATION
// ============================================================================

// Fonction pour réinitialiser le calculateur
function resetCalculator() {
    // Réinitialisation des champs
    document.getElementById('adults').value = '0';
    document.getElementById('children').value = '0';
    document.getElementById('mealType').value = 'aperitif';
    document.getElementById('menuType').value = 'meat-menu';
    document.getElementById('seasonType').value = 'spring'; // Reset season type
    document.getElementById('alcoholLevel').value = 'normal';
    
    // Réinitialisation des checkboxes
    document.querySelectorAll('input[name="drinks"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Masquage des messages d'erreur
    document.getElementById('adultsError').style.display = 'none';
    document.getElementById('drinksError').style.display = 'none';
    
    // Réactivation du bouton de calcul
    document.querySelector('.btn-primary').disabled = false;
    
    // Fermeture des résultats
    closeResults();
}

// ============================================================================
// GESTION DES ÉVÉNEMENTS
// ============================================================================

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Gestionnaire pour le menu hamburger
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleHamburger);
    }
    
    // Gestionnaires pour les liens de navigation (fermer le menu mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Gestionnaire pour le niveau d'alcool
    const alcoholLevelSelect = document.getElementById('alcoholLevel');
    if (alcoholLevelSelect) {
        alcoholLevelSelect.addEventListener('change', function() {
            if (this.value === 'sans-alcool') {
                hideAlcoholicDrinks();
            } else {
                showAlcoholicDrinks();
            }
        });
    }
    
    // Gestionnaires pour la validation en temps réel
    const adultsInput = document.getElementById('adults');
    if (adultsInput) {
        adultsInput.addEventListener('input', validateAdults);
    }
    
    // Gestionnaires pour les checkboxes de boissons
    const drinkCheckboxes = document.querySelectorAll('input[name="drinks"]');
    drinkCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validateDrinksSelection);
    });
    
    // Gestionnaire pour fermer les résultats en cliquant sur l'overlay
    const resultsOverlay = document.getElementById('resultsOverlay');
    if (resultsOverlay) {
        resultsOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeResults();
            }
        });
    }
    
    // Gestionnaire pour fermer les résultats avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeResults();
        }
    });
    
    // Validation initiale
    validateAdults();
    validateDrinksSelection();
    
    // Affichage initial des boissons alcoolisées selon la valeur par défaut
    if (alcoholLevelSelect && alcoholLevelSelect.value === 'sans-alcool') {
        hideAlcoholicDrinks();
    }
});