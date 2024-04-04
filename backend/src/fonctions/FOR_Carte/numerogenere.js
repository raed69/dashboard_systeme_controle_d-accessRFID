const Numero_carte_genere = () => {
         
  const identifiantUnique = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');


  const latitude = Math.random() * 180 - 90; // Exemple : latitude entre -90 et 90 degrés
  const longitude = Math.random() * 360 - 180; // Exemple : longitude entre -180 et 180 degrés

 
  const coordonneesGeographiques = latitude.toFixed(5) + ',' + longitude.toFixed(5);

 
  return `${identifiantUnique} ${coordonneesGeographiques}`;
}

  module.exports={Numero_carte_genere}