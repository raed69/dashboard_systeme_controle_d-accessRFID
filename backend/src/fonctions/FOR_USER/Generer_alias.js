
const alias_genere = (nom, prenom, cin) => {
        let deuxcharnom = '';
        let deuxcharprenom = '';
        let deuxcharcin = '';
        for (let i = 0; i < nom.length && deuxcharnom.length < 2; i++) {
            deuxcharnom += nom[i];
        }
        for (let k = 0; k < prenom.length && deuxcharprenom.length < 2; k++) {
            deuxcharprenom += prenom[k];
        }
        let strcin = cin.toString();
        for (let j = 0; j < strcin.length && deuxcharcin.length < 2; j++) {
            deuxcharcin += strcin[j];
        }
        return deuxcharnom + deuxcharprenom + deuxcharcin;
    };
module.exports={alias_genere}