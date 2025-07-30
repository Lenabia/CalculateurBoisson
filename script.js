// Configuration des ratios standards
        const drinkRatios = {
            wine: {
                normal: { red: 1.5, white: 1.5, rose: 0.5 }, // verres par adulte
                low: { red: 1, white: 1, rose: 0.3 },
                high: { red: 2, white: 2, rose: 0.8 }
            },
            champagne: {
                normal: 2, // coupes par personne
                low: 1,
                high: 3
            },
            beer: {
                normal: 2, // bouteilles par adulte
                low: 1,
                high: 3
            },
            spirits: {
                normal: 0.1, // bouteilles 75cl pour 10 personnes
                low: 0.05,
                high: 0.15
            }
        };

        // Adaptation selon le type de repas
        const mealTypeRatios = {
            'red-meat': { red: 0.7, white: 0.3, rose: 0 },
            'fish-poultry': { red: 0.3, white: 0.7, rose: 0 },
            'mixed': { red: 0.5, white: 0.5, rose: 0 },
            'vegetarian': { red: 0, white: 0.6, rose: 0.4 }
        };

        // Gestion des checkboxes
        document.querySelectorAll('.drink-option').forEach(option => {
            option.addEventListener('click', function(e) {
                if (e.target.type !== 'checkbox') {
                    const checkbox = this.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                }
                this.classList.toggle('selected', this.querySelector('input[type="checkbox"]').checked);
            });
        });

        // Masquer/afficher type de repas selon niveau alcool
        document.getElementById('alcoholLevel').addEventListener('change', function() {
            const mealGroup = document.getElementById('mealTypeGroup');
            if (this.value === 'none') {
                mealGroup.classList.add('hidden');
            } else {
                mealGroup.classList.remove('hidden');
            }
        });

        // Smooth scroll pour le CTA
        document.querySelector('.hero-cta').addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('#calculator').scrollIntoView({ behavior: 'smooth' });
        });

        function calculateDrinks() {
            const adults = parseInt(document.getElementById('adults').value) || 0;
            const children = parseInt(document.getElementById('children').value) || 0;
            const alcoholLevel = document.getElementById('alcoholLevel').value;
            const mealType = document.getElementById('mealType').value;
            
            // Vérifier quelles boissons sont sélectionnées
            const selectedDrinks = {};
            document.querySelectorAll('.drink-option input[type="checkbox"]:checked').forEach(cb => {
                selectedDrinks[cb.id] = true;
            });

            if (adults === 0) {
                alert('Veuillez indiquer le nombre d\'adultes');
                return;
            }

            const results = {};
            const totalGuests = adults + children;

            // Calcul selon le niveau d'alcool
            if (alcoholLevel === 'none') {
                // Sans alcool - Mocktails
                if (selectedDrinks.cocktails) {
                    const totalGlasses = totalGuests * 1.5;
                    const totalLiters = Math.ceil(totalGlasses * 0.2);
                    results['Mocktails'] = `${totalLiters} litres (${Math.ceil(totalGlasses)} verres)`;
                }
            } else {
                // Avec alcool
                const level = alcoholLevel === 'low' ? 'low' : alcoholLevel === 'high' ? 'high' : 'normal';
                
                // Vins
                if (selectedDrinks.wine) {
                    const mealRatio = mealTypeRatios[mealType];
                    const wineRatios = drinkRatios.wine[level];
                    
                    const redGlasses = Math.ceil(adults * wineRatios.red * mealRatio.red);
                    const whiteGlasses = Math.ceil(adults * wineRatios.white * mealRatio.white);
                    const roseGlasses = Math.ceil(adults * wineRatios.rose * mealRatio.rose);
                    
                    if (redGlasses > 0) {
                        results['Vin rouge'] = `${Math.ceil(redGlasses / 5)} bouteilles (${redGlasses} verres)`;
                    }
                    if (whiteGlasses > 0) {
                        results['Vin blanc'] = `${Math.ceil(whiteGlasses / 5)} bouteilles (${whiteGlasses} verres)`;
                    }
                    if (roseGlasses > 0) {
                        results['Vin rosé'] = `${Math.ceil(roseGlasses / 5)} bouteilles (${roseGlasses} verres)`;
                    }
                }