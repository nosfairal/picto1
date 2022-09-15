
/* Requête Pictogrammes Négatif */
function getDataNeg(url) {
    myRequest=new XMLHttpRequest();
    myRequest.onreadystatechange=getResponseNeg;
    myRequest.open("GET", url);
    myRequest.setRequestHeader("content-type","application-json");
    myRequest.send();
}
/* Requête Pictogrammmes Négatif */

/* Réponse Pictogram Pictogrammes Négatif */
function getResponseNeg(){
    try {
        if (myRequest.readyState === XMLHttpRequest.DONE) {
            switch(myRequest.status) {
                case 500:
                    break;
                case 404:
                    break;
                case 200:
                    responseData=JSON.parse(myRequest.responseText);
                    parcoursJSONNeg(responseData);
                    parcoursJSONPlur(responseData);
                    break;
            }
        }
    }
    catch(ex){
        console.log("Ajax error: "+ex.description);
    }
}
/* Réponse Pictogrammes Négatif */

/* Parcours Objets Pictogramme Négatif */
function parcoursJSONNeg(jsonObj) {
    let phrase = [];
    let premierVerbe; // valeur de la conjugaison du premier verbe selon le pronom personnel sujet utilisé
    let participeVerbe; // participe passé du premier verbe
    let infinitifVerbe; // infinitif du deuxieme verbe
    let deuxiemeVerbe; // valeur de la conjugaison du deuxieme verbe selon le pronom personnel sujet utilisé
    let deuxiemeparticipeVerbe; // participe passé du deuxième verbe
    let deuxiemeinfinitifVerbe; // infinitif du deuxième verbe
    let selectPremierVerbe; // permet de selectionner le premier verbe même si il a été modifié 
    let selectDeuxiemeVerbe; // permet de selectionner le deuxième verbe même si il a été modifié 

    for(let i = 0; i< jsonObj.length; i++){
        let name = jsonObj[i]['name'].toLowerCase();        // Renvoie le nom,
        let premPersSing = jsonObj[i]['prem_pers_sing'];    // la première personne du singulier,
        let deuxPersSing = jsonObj[i]['deux_pers_sing'];    // la deuxième,
        let troisPersSing = jsonObj[i]['trois_pers_sing'];  // la troisième,
        let premPersPlur = jsonObj[i]['prem_pers_plur'];    // la première personne du pluriel,
        let deuxPersPlur = jsonObj[i]['deux_pers_plur'];    // la deuxième,
        let troisPersPlur = jsonObj[i]['trois_pers_plur'];  // la troisième,
        let participe = jsonObj[i]['participe'];  // le participe passé

        /* Négatif */
        // if (!sentenceToConjug.text().includes(premPersSing) && !sentenceToConjug.text().includes(deuxPersSing) && !sentenceToConjug.text().includes(troisPersSing) && !sentenceToConjug.text().includes(premPersPlur) && !sentenceToConjug.text().includes(deuxPersPlur) && !sentenceToConjug.text().includes(troisPersPlur)) {
            if (sentenceToConjug.text().includes("je") || sentenceToConjug.text().includes("Je") || sentenceToConjug.text().includes("J'") || sentenceToConjug.text().includes("j'")) { // Conjugaison à la première personne du singulier
                if (premPersSing !== null) { // Si le mots en question peut être conjugué et qu'il ne l'est pas déjà
                    if (sentenceToConjug.text().includes(" " + name + " ") || sentenceToConjug.text().includes("'" + name + " ")) { // Et si le mot en question apparaît dans le champs phrase
                        phrase.push(name);
                        if (phrase.length === 1){
                            premierVerbe = premPersSing;
                            infinitifVerbe = name;
                            participeVerbe = participe;
                            selectPremierVerbe = premPersSing;
                            if (vowel.includes(premPersSing.charAt(0))) {
                                sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + premPersSing + " pas")); // Alors remplace le par sa variante
                            } else {
                                sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + premPersSing + " pas")); // Alors remplace le par sa variante
                            }
                        } else if (phrase.length === 2) {
                            deuxiemeparticipeVerbe = participe;
                            deuxiemeinfinitifVerbe = name;
                            deuxiemeVerbe = premPersSing;
                            selectDeuxiemeVerbe = premPersSing;
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(premierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(phrase[1]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (sentenceToConjug.text().includes("'ai ") || sentenceToConjug.text().includes(" suis ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); // Alors remplace le par sa variante
                                    selectDeuxiemeVerbe = participe;
                                } else {
                                    selectDeuxiemeVerbe = name;
                                }
                            } else if ( ordrePremierVerbe > ordreDeuxiemeVerbe) {
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(premPersSing.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + premPersSing + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + premPersSing + " pas")); // Alors remplace le par sa variante
                                    }
                                    sentenceToConjug.text(sentenceToConjug.text().replace("ne " + premierVerbe + " pas", participeVerbe));  
                                    selectPremierVerbe = participeVerbe;
                                } else {
                                    if (vowel.includes(premPersSing.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + premPersSing + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + premPersSing + " pas")); // Alors remplace le par sa variante
                                    }
                                    sentenceToConjug.text(sentenceToConjug.text().replace("ne " + premierVerbe + " pas", infinitifVerbe)); 
                                    selectPremierVerbe = infinitifVerbe;
                                }
                            }
                        } else if (phrase.length === 3) {
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(selectPremierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(selectDeuxiemeVerbe);
                            let ordreTroisiemeVerbe = sentenceToConjug.text().indexOf(phrase[2]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordreTroisiemeVerbe){
                                if (sentenceToConjug.text().includes("'ai ") || sentenceToConjug.text().includes(" suis ")){
                                }
                            } else if (ordrePremierVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordreDeuxiemeVerbe ){
                                if (sentenceToConjug.text().includes("'ai ") || sentenceToConjug.text().includes(" suis ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                }
                            } else if (ordreDeuxiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreTroisiemeVerbe) {
                                if (sentenceToConjug.text().includes("'ai ") || sentenceToConjug.text().includes(" suis ")){   
                                }
                            } else if (ordreDeuxiemeVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordrePremierVerbe){
                                if (sentenceToConjug.text().includes("'ai ") || sentenceToConjug.text().includes(" suis ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                }
                            } else if (ordreTroisiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(premPersSing.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + premPersSing + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + premPersSing + " pas")); // Alors remplace le par sa variante
                                    }
                                    if ( sentenceToConjug.text().includes("n'" + selectPremierVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("n'" + selectPremierVerbe + " pas", participeVerbe)); 
                                    } else if ( sentenceToConjug.text().includes("ne " + selectPremierVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("ne " + selectPremierVerbe + " pas", participeVerbe)); 
                                    }
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, participeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe));  
                                }
                            } else if (ordreTroisiemeVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordrePremierVerbe){
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(premPersSing.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + premPersSing + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + premPersSing + " pas")); // Alors remplace le par sa variante
                                    }
                                    if ( sentenceToConjug.text().includes("n'" + selectDeuxiemeVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("n'" + selectDeuxiemeVerbe + " pas", deuxiemeparticipeVerbe)); 
                                    } else if ( sentenceToConjug.text().includes("ne " + selectDeuxiemeVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("ne " + selectDeuxiemeVerbe + " pas", deuxiemeparticipeVerbe)); 
                                    }                                    
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                
                                }
                            }
                        }
                    }
                }
            } else if (sentenceToConjug.text().includes("tu") || sentenceToConjug.text().includes("Tu")) { // Conjugaison à la deuxième personne du singulier
                if (deuxPersSing !== null) {
                    if (sentenceToConjug.text().includes(" " + name + " ")) {
                        phrase.push(name);
                        if (phrase.length === 1){
                            premierVerbe = deuxPersSing;
                            infinitifVerbe = name;
                            participeVerbe = participe;
                            selectPremierVerbe = deuxPersSing;
                            if (vowel.includes(deuxPersSing.charAt(0))) {
                                sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + deuxPersSing + " pas")); // Alors remplace le par sa variante
                            } else {
                                sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + deuxPersSing + " pas")); // Alors remplace le par sa variante
                            }
                        } else if (phrase.length === 2) {
                            deuxiemeparticipeVerbe = participe;
                            deuxiemeinfinitifVerbe = name;
                            deuxiemeVerbe = deuxPersSing;
                            selectDeuxiemeVerbe = deuxPersSing;
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(premierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(phrase[1]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (sentenceToConjug.text().includes("'as ") || sentenceToConjug.text().includes("'es ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); // Alors remplace le par sa variante
                                    selectDeuxiemeVerbe = participe;
                                } else {
                                    selectDeuxiemeVerbe = name;
                                }
                            } else if ( ordrePremierVerbe > ordreDeuxiemeVerbe) {
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(deuxPersSing.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + deuxPersSing + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + deuxPersSing + " pas")); // Alors remplace le par sa variante
                                    }
                                    sentenceToConjug.text(sentenceToConjug.text().replace("ne " + premierVerbe + " pas", participeVerbe));  
                                    selectPremierVerbe = participeVerbe;
                                } else {
                                    if (vowel.includes(deuxPersSing.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + deuxPersSing + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + deuxPersSing + " pas")); // Alors remplace le par sa variante
                                    }
                                    sentenceToConjug.text(sentenceToConjug.text().replace("ne " + premierVerbe + " pas", infinitifVerbe)); 
                                    selectPremierVerbe = infinitifVerbe;
                                }
                            }
                        } else if (phrase.length === 3) {
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(selectPremierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(selectDeuxiemeVerbe);
                            let ordreTroisiemeVerbe = sentenceToConjug.text().indexOf(phrase[2]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordreTroisiemeVerbe){
                                if (sentenceToConjug.text().includes("'as ") || sentenceToConjug.text().includes("'es ")){
                                }
                            } else if (ordrePremierVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordreDeuxiemeVerbe ){
                                if (sentenceToConjug.text().includes("'as ") || sentenceToConjug.text().includes("'es ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                }
                            } else if (ordreDeuxiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreTroisiemeVerbe) {
                                if (sentenceToConjug.text().includes("'as ") || sentenceToConjug.text().includes("'es ")){
                                }
                            } else if (ordreDeuxiemeVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordrePremierVerbe){
                                if (sentenceToConjug.text().includes("'as ") || sentenceToConjug.text().includes("'es ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                }
                            } else if (ordreTroisiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(deuxPersSing.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + deuxPersSing + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + deuxPersSing + " pas")); // Alors remplace le par sa variante
                                    }
                                    if ( sentenceToConjug.text().includes("n'" + selectPremierVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("n'" + selectPremierVerbe + " pas", participeVerbe)); 
                                    } else if ( sentenceToConjug.text().includes("ne " + selectPremierVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("ne " + selectPremierVerbe + " pas", participeVerbe)); 
                                    }
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, participeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe));  
                                }
                            } else if (ordreTroisiemeVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordrePremierVerbe){
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(deuxPersSing.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + deuxPersSing + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + deuxPersSing + " pas")); // Alors remplace le par sa variante
                                    }
                                    if ( sentenceToConjug.text().includes("n'" + selectDeuxiemeVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("n'" + selectDeuxiemeVerbe + " pas", deuxiemeparticipeVerbe)); 
                                    } else if ( sentenceToConjug.text().includes("ne " + selectDeuxiemeVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("ne " + selectDeuxiemeVerbe + " pas", deuxiemeparticipeVerbe)); 
                                    }                                    
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                
                                }
                            }
                        }
                    }
                }
            } else if (sentenceToConjug.text().includes("nous") || sentenceToConjug.text().includes("Nous")) { // Conjugaison à la première personne du pluriel
                if (premPersPlur !== null) {
                    if (sentenceToConjug.text().includes(" " + name + " ")) {
                        phrase.push(name);
                        if (phrase.length === 1){
                            premierVerbe = premPersPlur;
                            infinitifVerbe = name;
                            participeVerbe = participe;
                            selectPremierVerbe = premPersPlur;
                            if (vowel.includes(premPersPlur.charAt(0))) {
                                sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + premPersPlur + " pas")); // Alors remplace le par sa variante
                            } else {
                                sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + premPersPlur + " pas")); // Alors remplace le par sa variante
                            }
                        } else if (phrase.length === 2) {
                            deuxiemeparticipeVerbe = participe;
                            deuxiemeinfinitifVerbe = name;
                            deuxiemeVerbe = premPersPlur;
                            selectDeuxiemeVerbe = premPersPlur;
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(premierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(phrase[1]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (sentenceToConjug.text().includes("'avons ") || sentenceToConjug.text().includes(" sommes ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); // Alors remplace le par sa variante
                                    selectDeuxiemeVerbe = participe;
                                } else {
                                    selectDeuxiemeVerbe = name;
                                }
                            } else if ( ordrePremierVerbe > ordreDeuxiemeVerbe) {
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(premPersPlur.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + premPersPlur + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + premPersPlur + " pas")); // Alors remplace le par sa variante
                                    }
                                    sentenceToConjug.text(sentenceToConjug.text().replace("ne " + premierVerbe + " pas", participeVerbe));  
                                    selectPremierVerbe = participeVerbe;
                                } else {
                                    if (vowel.includes(premPersPlur.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + premPersPlur + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + premPersPlur + " pas")); // Alors remplace le par sa variante
                                    }                                    
                                    sentenceToConjug.text(sentenceToConjug.text().replace("ne " + premierVerbe + " pas", infinitifVerbe)); 
                                    selectPremierVerbe = infinitifVerbe;
                                }
                            }
                        } else if (phrase.length === 3) {
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(selectPremierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(selectDeuxiemeVerbe);
                            let ordreTroisiemeVerbe = sentenceToConjug.text().indexOf(phrase[2]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordreTroisiemeVerbe){
                                if (sentenceToConjug.text().includes("'avons ") || sentenceToConjug.text().includes(" sommes ")){
                                }
                            } else if (ordrePremierVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordreDeuxiemeVerbe ){
                                if (sentenceToConjug.text().includes("'avons ") || sentenceToConjug.text().includes(" sommes ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                }
                            } else if (ordreDeuxiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreTroisiemeVerbe) {
                                if (sentenceToConjug.text().includes("'avons ") || sentenceToConjug.text().includes(" sommes ")){
                                }
                            } else if (ordreDeuxiemeVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordrePremierVerbe){
                                if (sentenceToConjug.text().includes("'avons ") || sentenceToConjug.text().includes(" sommes ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                }
                            } else if (ordreTroisiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(premPersPlur.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + premPersPlur + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + premPersPlur + " pas")); // Alors remplace le par sa variante
                                    }
                                    if ( sentenceToConjug.text().includes("n'" + selectPremierVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("n'" + selectPremierVerbe + " pas", participeVerbe)); 
                                    } else if ( sentenceToConjug.text().includes("ne " + selectPremierVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("ne " + selectPremierVerbe + " pas", participeVerbe)); 
                                    }
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, participeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe));  
                                }
                            } else if (ordreTroisiemeVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordrePremierVerbe){
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(premPersPlur.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + premPersPlur + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + premPersPlur + " pas")); // Alors remplace le par sa variante
                                    }
                                    if ( sentenceToConjug.text().includes("n'" + selectDeuxiemeVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("n'" + selectDeuxiemeVerbe + " pas", deuxiemeparticipeVerbe)); 
                                    } else if ( sentenceToConjug.text().includes("ne " + selectDeuxiemeVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("ne " + selectDeuxiemeVerbe + " pas", deuxiemeparticipeVerbe)); 
                                    }                                    
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                
                                }
                            }
                        }
                    }
                }
            } else if (sentenceToConjug.text().includes("vous") || sentenceToConjug.text().includes("Vous")) { // Conjugaison à la deuxième personne du pluriel
                if (deuxPersPlur !== null) {
                    if (sentenceToConjug.text().includes(" " + name + " ")) {
                        phrase.push(name);
                        if (phrase.length === 1){
                            premierVerbe = deuxPersPlur;
                            infinitifVerbe = name;
                            participeVerbe = participe;
                            selectPremierVerbe = deuxPersPlur;
                            if (vowel.includes(deuxPersPlur.charAt(0))) {
                                sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + deuxPersPlur + " pas")); // Alors remplace le par sa variante
                            } else {
                                sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + deuxPersPlur + " pas")); // Alors remplace le par sa variante
                            }
                        } else if (phrase.length === 2) {
                            deuxiemeparticipeVerbe = participe;
                            deuxiemeinfinitifVerbe = name;
                            deuxiemeVerbe = deuxPersPlur;
                            selectDeuxiemeVerbe = deuxPersPlur;
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(premierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(phrase[1]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (sentenceToConjug.text().includes("'avez ") || sentenceToConjug.text().includes("'êtes ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); // Alors remplace le par sa variante
                                    selectDeuxiemeVerbe = participe;
                                } else {
                                    selectDeuxiemeVerbe = name;
                                }
                            } else if ( ordrePremierVerbe > ordreDeuxiemeVerbe) {
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(deuxPersPlur.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + deuxPersPlur + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + deuxPersPlur + " pas")); // Alors remplace le par sa variante
                                    }
                                    sentenceToConjug.text(sentenceToConjug.text().replace("ne " + premierVerbe + " pas", participeVerbe));  
                                    selectPremierVerbe = participeVerbe;
                                } else {
                                    if (vowel.includes(deuxPersPlur.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + deuxPersPlur + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + deuxPersPlur + " pas")); // Alors remplace le par sa variante
                                    }                                    
                                    sentenceToConjug.text(sentenceToConjug.text().replace("ne " + premierVerbe + " pas", infinitifVerbe)); 
                                    selectPremierVerbe = infinitifVerbe;
                                }
                            }
                        } else if (phrase.length === 3) {
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(selectPremierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(selectDeuxiemeVerbe);
                            let ordreTroisiemeVerbe = sentenceToConjug.text().indexOf(phrase[2]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordreTroisiemeVerbe){
                                if (sentenceToConjug.text().includes("'avez ") || sentenceToConjug.text().includes("'êtes ")){
                                }
                            } else if (ordrePremierVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordreDeuxiemeVerbe ){
                                if (sentenceToConjug.text().includes("'avez ") || sentenceToConjug.text().includes("'êtes ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                }
                            } else if (ordreDeuxiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreTroisiemeVerbe) {
                                if (sentenceToConjug.text().includes("'avez ") || sentenceToConjug.text().includes("'êtes ")){
                                }
                            } else if (ordreDeuxiemeVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordrePremierVerbe){
                                if (sentenceToConjug.text().includes("'avez ") || sentenceToConjug.text().includes("'êtes ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                }
                            } else if (ordreTroisiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(deuxPersPlur.charAt(0)) || deuxPersPlur.includes("êtes")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + deuxPersPlur + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + deuxPersPlur + " pas")); // Alors remplace le par sa variante
                                    }
                                    if ( sentenceToConjug.text().includes("n'" + selectPremierVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("n'" + selectPremierVerbe + " pas", participeVerbe)); 
                                    } else if ( sentenceToConjug.text().includes("ne " + selectPremierVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("ne " + selectPremierVerbe + " pas", participeVerbe)); 
                                    }
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, participeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe));  
                                }
                            } else if (ordreTroisiemeVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordrePremierVerbe){
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(deuxPersPlur.charAt(0)) || deuxPersPlur.includes("êtes")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + deuxPersPlur + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + deuxPersPlur + " pas")); // Alors remplace le par sa variante
                                    }
                                    if ( sentenceToConjug.text().includes("n'" + selectDeuxiemeVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("n'" + selectDeuxiemeVerbe + " pas", deuxiemeparticipeVerbe)); 
                                    } else if ( sentenceToConjug.text().includes("ne " + selectDeuxiemeVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("ne " + selectDeuxiemeVerbe + " pas", deuxiemeparticipeVerbe)); 
                                    }                                    
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                
                                }
                            }
                        }
                    }
                }
            } else if (sentenceToConjug.text().includes("eux") || sentenceToConjug.text().includes("Eux") || sentenceToConjug.text().includes("ils") || sentenceToConjug.text().includes("Ils") || sentenceToConjug.text().includes("elles") || sentenceToConjug.text().includes("Elles")) { // Conjugaison à la troisième personne du pluriel
                if (troisPersPlur !== null) {
                    if (sentenceToConjug.text().includes(" " + name + " ")) {
                        phrase.push(name);
                        if (phrase.length === 1){
                            premierVerbe = troisPersPlur;
                            infinitifVerbe = name;
                            participeVerbe = participe;
                            selectPremierVerbe = troisPersPlur;
                            if (vowel.includes(troisPersPlur.charAt(0))) {
                                sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + troisPersPlur + " pas")); // Alors remplace le par sa variante
                            } else {
                                sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + troisPersPlur + " pas")); // Alors remplace le par sa variante
                            }
                        } else if (phrase.length === 2) {
                            deuxiemeparticipeVerbe = participe;
                            deuxiemeinfinitifVerbe = name;
                            deuxiemeVerbe = troisPersPlur;
                            selectDeuxiemeVerbe = troisPersPlur;
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(premierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(phrase[1]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (sentenceToConjug.text().includes("'ont ") || sentenceToConjug.text().includes(" sont ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); // Alors remplace le par sa variante
                                    selectDeuxiemeVerbe = participe;
                                } else {
                                    selectDeuxiemeVerbe = name;
                                }
                            } else if ( ordrePremierVerbe > ordreDeuxiemeVerbe) {
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(troisPersPlur.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + troisPersPlur + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + troisPersPlur + " pas")); // Alors remplace le par sa variante
                                    }
                                    sentenceToConjug.text(sentenceToConjug.text().replace("ne " + premierVerbe + " pas", participeVerbe));  
                                    selectPremierVerbe = participeVerbe;
                                } else {
                                    if (vowel.includes(troisPersPlur.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + troisPersPlur + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + troisPersPlur + " pas")); // Alors remplace le par sa variante
                                    }                                    
                                    sentenceToConjug.text(sentenceToConjug.text().replace("ne " + premierVerbe + " pas", infinitifVerbe)); 
                                    selectPremierVerbe = infinitifVerbe;
                                }
                            }
                        } else if (phrase.length === 3) {
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(selectPremierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(selectDeuxiemeVerbe);
                            let ordreTroisiemeVerbe = sentenceToConjug.text().indexOf(phrase[2]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordreTroisiemeVerbe){
                                if (sentenceToConjug.text().includes("'ont ") || sentenceToConjug.text().includes(" sont ")){
                                }
                            } else if (ordrePremierVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordreDeuxiemeVerbe ){
                                if (sentenceToConjug.text().includes("'ont ") || sentenceToConjug.text().includes(" sont ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                }
                            } else if (ordreDeuxiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreTroisiemeVerbe) {
                                if (sentenceToConjug.text().includes("'ont ") || sentenceToConjug.text().includes(" sont ")){
                                }
                            } else if (ordreDeuxiemeVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordrePremierVerbe){
                                if (sentenceToConjug.text().includes("'ont ") || sentenceToConjug.text().includes(" sont ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                }
                            } else if (ordreTroisiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(troisPersPlur.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + troisPersPlur + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + troisPersPlur + " pas")); // Alors remplace le par sa variante
                                    }
                                    if ( sentenceToConjug.text().includes("n'" + selectPremierVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("n'" + selectPremierVerbe + " pas", participeVerbe)); 
                                    } else if ( sentenceToConjug.text().includes("ne " + selectPremierVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("ne " + selectPremierVerbe + " pas", participeVerbe)); 
                                    }
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, participeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe));  
                                }
                            } else if (ordreTroisiemeVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordrePremierVerbe){
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(troisPersPlur.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + troisPersPlur + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + troisPersPlur + " pas")); // Alors remplace le par sa variante
                                    }
                                    if ( sentenceToConjug.text().includes("n'" + selectDeuxiemeVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("n'" + selectDeuxiemeVerbe + " pas", deuxiemeparticipeVerbe)); 
                                    } else if ( sentenceToConjug.text().includes("ne " + selectDeuxiemeVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("ne " + selectDeuxiemeVerbe + " pas", deuxiemeparticipeVerbe)); 
                                    }                                    
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                
                                }
                            }
                        }
                    }
                }
            } else {
                if (troisPersSing !== null) { // Conjugaison à la troisième personne du singulier
                    if (sentenceToConjug.text().includes(" " + name + " ")) {
                        phrase.push(name);
                        if (phrase.length === 1){
                            premierVerbe = troisPersSing;
                            infinitifVerbe = name;
                            participeVerbe = participe;
                            selectPremierVerbe = deuxPersSing;
                            if (vowel.includes(troisPersSing.charAt(0))) {
                                sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + troisPersSing + " pas")); // Alors remplace le par sa variante
                            } else {
                                sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + troisPersSing + " pas")); // Alors remplace le par sa variante
                            }
                        } else if (phrase.length === 2) {
                            deuxiemeparticipeVerbe = participe;
                            deuxiemeinfinitifVerbe = name;
                            deuxiemeVerbe = troisPersSing;
                            selectDeuxiemeVerbe = troisPersSing;
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(premierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(phrase[1]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (sentenceToConjug.text().includes("'a ") || sentenceToConjug.text().includes(" est ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); // Alors remplace le par sa variante
                                    selectDeuxiemeVerbe = participe;
                                } else {
                                    selectDeuxiemeVerbe = name;
                                }
                            } else if ( ordrePremierVerbe > ordreDeuxiemeVerbe) {
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(troisPersSing.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + troisPersSing + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + troisPersSing + " pas")); // Alors remplace le par sa variante
                                    }
                                    sentenceToConjug.text(sentenceToConjug.text().replace("ne " + premierVerbe + " pas", participeVerbe));  
                                    selectPremierVerbe = participeVerbe;
                                } else {
                                    if (vowel.includes(troisPersSing.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + troisPersSing + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + troisPersSing + " pas")); // Alors remplace le par sa variante
                                    }                                    
                                    sentenceToConjug.text(sentenceToConjug.text().replace("ne " + premierVerbe + " pas", infinitifVerbe)); 
                                    selectPremierVerbe = infinitifVerbe;
                                }
                            }
                        } else if (phrase.length === 3) {
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(selectPremierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(selectDeuxiemeVerbe);
                            let ordreTroisiemeVerbe = sentenceToConjug.text().indexOf(phrase[2]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordreTroisiemeVerbe){
                                if (sentenceToConjug.text().includes("'a ") || sentenceToConjug.text().includes(" est ")){
                                }
                            } else if (ordrePremierVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordreDeuxiemeVerbe ){
                                if (sentenceToConjug.text().includes("'a ") || sentenceToConjug.text().includes(" est ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                }
                            } else if (ordreDeuxiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreTroisiemeVerbe) {
                                if (sentenceToConjug.text().includes("'a ") || sentenceToConjug.text().includes(" est ")){
                                }
                            } else if (ordreDeuxiemeVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordrePremierVerbe){
                                if (sentenceToConjug.text().includes("'a ") || sentenceToConjug.text().includes(" est ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                }
                            } else if (ordreTroisiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(troisPersSing.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + troisPersSing + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + troisPersSing + " pas")); // Alors remplace le par sa variante
                                    }
                                    if ( sentenceToConjug.text().includes("n'" + selectPremierVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("n'" + selectPremierVerbe + " pas", participeVerbe)); 
                                    } else if ( sentenceToConjug.text().includes("ne " + selectPremierVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("ne " + selectPremierVerbe + " pas", participeVerbe)); 
                                    }
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, participeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe));  
                                }
                            } else if (ordreTroisiemeVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordrePremierVerbe){
                                if (name == "avoir" || name == "être"){
                                    if (vowel.includes(troisPersSing.charAt(0))) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "n'" + troisPersSing + " pas")); // Alors remplace le par sa variante
                                    } else {
                                        sentenceToConjug.text(sentenceToConjug.text().replace(name, "ne " + troisPersSing + " pas")); // Alors remplace le par sa variante
                                    }
                                    if ( sentenceToConjug.text().includes("n'" + selectDeuxiemeVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("n'" + selectDeuxiemeVerbe + " pas", deuxiemeparticipeVerbe)); 
                                    } else if ( sentenceToConjug.text().includes("ne " + selectDeuxiemeVerbe + " pas")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("ne " + selectDeuxiemeVerbe + " pas", deuxiemeparticipeVerbe)); 
                                    }                                    
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                            
                                }
                            }
                        }
                    }
                }
            }
        // }
        recordingSentence();
        /* end Négatif */
    }
}
/* end Parcours Objets Pictogramme Négatif */
