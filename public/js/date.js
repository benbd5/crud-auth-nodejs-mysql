// Remplir par défaut l'input date pour la publication des articles avec la date d'aujourd'hui
document.getElementById("dateAdd").valueAsDate = new Date();

// Possibilité de choisir des dates inférieurs à aujourd'hui mais pas supérieur
var today = new Date().toISOString().split("T")[0];
document.getElementById("dateAdd").setAttribute("max", today);
