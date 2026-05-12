const input = document.getElementById("inpville");
const bouton = document.getElementById("botton");
const container = document.getElementById("d1");

const apiKey = "8e127a37cad3cd4876c96027614acd09"; // ma clé OpenWeatherMap

// Quand on clique sur Ajouter
bouton.addEventListener("click", function() {
    const ville = input.value;

    if (ville === "") {
        alert("Écris une ville !");
        return;
    }

    fetchMeteo(ville);
    input.value = ""; // vider le champ après
});

// Appuyer sur Entrée aussi
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        bouton.click();
    }
});

// Fonction qui appelle l'API
function fetchMeteo(ville) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${apiKey}&units=metric&lang=fr`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
        if (data.cod === 200) {        
            creerCarte(data);
        } else {
            alert("Ville introuvable !"); 
        }
        })
        .catch(error => {
            alert("Ville trouvable !");
    });
}
function creerCarte(data) {
    const nom = data.name;
    const temp = data.main.temp;
    const description = data.weather[0].description;
    const icone = data.weather[0].icon;

    // Créer la carte
    const carte = document.createElement("div");
    carte.innerHTML = `
        <h3>🏙️ ${nom}</h3>
        <p>🌡️ ${temp}°C</p>
        <p>⛅ ${description}</p>
        <img src="https://openweathermap.org/img/wn/${icone}.png">
        <button onclick="supprimerCarte(this)">❌ Supprimer</button>
        <button onclick="monterCarte(this)">⬆️</button>
        <button onclick="descendreCarte(this)">⬇️</button>
    `;

    container.appendChild(carte);
    sauvegarder(); 
}
 // Supprimer une carte
function supprimerCarte(btn) {
    const carte = btn.parentElement;
    container.removeChild(carte);
    sauvegarder();
}

// Monter une carte
function monterCarte(btn) {
    const carte = btn.parentElement;
    const precedente = carte.previousElementSibling;
    if (precedente) {
        container.insertBefore(carte, precedente);
        sauvegarder();
    }
}

// Descendre une carte
function descendreCarte(btn) {
    const carte = btn.parentElement;
    const suivante = carte.nextElementSibling;
    if (suivante) {
        container.insertBefore(suivante, carte);
        sauvegarder();
    }
}  
// Sauvegarder les villes
function sauvegarder() {
    const cartes = container.querySelectorAll("h3");
    const villes = [];
    cartes.forEach(carte => {
        villes.push(carte.textContent.replace("🏙️ ", ""));
    });
    sessionStorage.setItem("villes", JSON.stringify(villes));
}

// Recharger les villes au démarrage
function charger() {
    const villes = JSON.parse(sessionStorage.getItem("villes"));
    if (villes) {
        villes.forEach(ville => fetchMeteo(ville));
    }
}

// Appeler charger() au début
charger();