const Numero_carte_genere = () => {
  const identifiantUnique = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  return identifiantUnique;
}

module.exports = { Numero_carte_genere };

