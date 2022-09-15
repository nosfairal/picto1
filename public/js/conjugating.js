let sentenceToConjug = $("#sentenceText"); // Champs de la phrase
let word = [];
let vowel = ["a", "e", "é", "è", "i", "o", "u", "y"];
let verbConj = true;
let femPlur = false;
let femSing = false;
let mascPlur = false;
let mascSing = false;

/* Requête Pictogram à Conjuguer */
function getDataConj(url) {
    myRequest=new XMLHttpRequest();
    myRequest.onreadystatechange=getResponseConj;
    myRequest.open("GET", url);
    myRequest.setRequestHeader("content-type","application-json");
    myRequest.send();
}
/* Requête Pictogram Pictogram à Conjuguer */

/* Réponse Pictogram à Conjuguer */
function getResponseConj(){
    try {
        if (myRequest.readyState === XMLHttpRequest.DONE) {
            switch(myRequest.status) {
                case 500:
                    break;
                case 404:
                    break;
                case 200:
                    responseData=JSON.parse(myRequest.responseText);
                    parcoursJSONConj(responseData);
                    parcoursJSONPlur(responseData);
                    break;
            }
        }
    }
    catch(ex){
        console.log("Ajax error: "+ex.description);
    }
}
/* Réponse Pictogram à Conjuguer */

/* Parcours Objets Pictogramme à Conjuguer */
function parcoursJSONConj(jsonObj) {
    let phrase = [];
    let premierVerbe; // valeur de la conjugaison du premier verbe selon le pronom personnel sujet utilisé
    let participeVerbe; // participe passé du premier verbe
    let infinitifVerbe; // infinitif du deuxieme verbe
    let deuxiemeVerbe; // valeur de la conjugaison du deuxieme verbe selon le pronom personnel sujet utilisé
    let deuxiemeparticipeVerbe; // participe passé du deuxième verbe
    let deuxiemeinfinitifVerbe; // infinitif du deuxième verbe
    let selectPremierVerbe; // permet de selectionner le premier verbe même si il a été modifié 
    let selectDeuxiemeVerbe; // permet de selectionner le deuxième verbe même si il a été modifié 

    // word = sentenceToConjug.text().split(' ');
    for(let i = 0; i< jsonObj.length; i++) {
        let name = jsonObj[i]['name'].toLowerCase();        // Renvoie le nom,       
        let premPersSing = jsonObj[i]['prem_pers_sing'];    // la première personne du singulier,
        let deuxPersSing = jsonObj[i]['deux_pers_sing'];    // la deuxième,
        let troisPersSing = jsonObj[i]['trois_pers_sing'];  // la troisième,
        let premPersPlur = jsonObj[i]['prem_pers_plur'];    // la première personne du pluriel,
        let deuxPersPlur = jsonObj[i]['deux_pers_plur'];    // la deuxième,
        let troisPersPlur = jsonObj[i]['trois_pers_plur'];  // la troisième
        let participe = jsonObj[i]['participe'];  // le participe passé
        // Si un verbe est déjà présent alors ne conjugue plus rien
        // Si la valeur du champs participe du pictogramme n'est pas égale à null

            /* Conjugaison */
       if ((premPersSing === name.substring(0, name.length-1)) || (name == 'être') || (name == 'avoir') || (name == 'descendre') || (name == 'se moucher') || (name == "s'habiller") || (name == "se déshabiller") || (name == 'mettre') || (!sentenceToConjug.text().includes(premPersSing) && !sentenceToConjug.text().includes(deuxPersSing) && !sentenceToConjug.text().includes(troisPersSing) && !sentenceToConjug.text().includes(premPersPlur) && !sentenceToConjug.text().includes(deuxPersPlur) && !sentenceToConjug.text().includes(troisPersPlur))) {
            if (sentenceToConjug.text().includes("je") || sentenceToConjug.text().includes("Je") || sentenceToConjug.text().includes("j'") || sentenceToConjug.text().includes("J'")) { // Conjugaison à la première personne du singulier
                if (premPersSing !== null) { // Si le mots en question peut être conjugué
                    if (sentenceToConjug.text().includes(" " + name + " ") || sentenceToConjug.text().includes("'" + name + " ")) { // Et si le mot en question apparaît dans le champs phrase
                        phrase.push(name); 
                      
                        if (phrase.length === 1){ 
                            premierVerbe = premPersSing;
                            infinitifVerbe = name;
                            participeVerbe = participe;
                            selectPremierVerbe = premPersSing;
                            // console.log("Cette phrase contient \""+name+"\" qui doit donc être remplacé par \""+premPersSing+"\"");
                            sentenceToConjug.text(sentenceToConjug.text().replace(name, premPersSing)); // Alors remplace le par sa variante
                            if (vowel.includes(premPersSing.charAt(0)) && sentenceToConjug.text().includes("je ")) { // Si le verbe commence par une voyelle
                                sentenceToConjug.text(sentenceToConjug.text().replace("je ", "j'")); // Alors remplace "je" par "j'"
                            } else if (vowel.includes(premPersSing.charAt(0)) && sentenceToConjug.text().includes("Je ")) {
                                sentenceToConjug.text(sentenceToConjug.text().replace("Je ", "J'"));
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
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, premPersSing)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(premierVerbe, participeVerbe)); 
                                    selectPremierVerbe = participeVerbe;
                                    if (vowel.includes(premPersSing.charAt(0)) && sentenceToConjug.text().includes("je ")) { // Si le verbe commence par une voyelle
                                        sentenceToConjug.text(sentenceToConjug.text().replace("je ", "j'")); // Alors remplace "je" par "j'"
                                    } else if (vowel.includes(premPersSing.charAt(0)) && sentenceToConjug.text().includes("Je ")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("Je ", "J'"));
                                    }    
                                } else {
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, premPersSing)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(premierVerbe, infinitifVerbe)); 
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
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, premPersSing)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, participeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe)); 
                                    if (vowel.includes(premPersSing.charAt(0)) && sentenceToConjug.text().includes("je ")) { // Si le verbe commence par une voyelle
                                        sentenceToConjug.text(sentenceToConjug.text().replace("je ", "j'")); // Alors remplace "je" par "j'"
                                    } else if (vowel.includes(premPersSing.charAt(0)) && sentenceToConjug.text().includes("Je ")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("Je ", "J'"));
                                    }    
                                }
                            } else if (ordreTroisiemeVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordrePremierVerbe){
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, premPersSing)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeparticipeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                    if (vowel.includes(premPersSing.charAt(0)) && sentenceToConjug.text().includes("je ")) { // Si le verbe commence par une voyelle
                                        sentenceToConjug.text(sentenceToConjug.text().replace("je ", "j'")); // Alors remplace "je" par "j'"
                                    } else if (vowel.includes(premPersSing.charAt(0)) && sentenceToConjug.text().includes("Je ")) {
                                        sentenceToConjug.text(sentenceToConjug.text().replace("Je ", "J'"));
                                    }    
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
                            // console.log("Cette phrase contient \""+name+"\" qui doit donc être remplacé par \""+deuxPersSing+"\"");
                            sentenceToConjug.text(sentenceToConjug.text().replace(name, deuxPersSing));                       
                        } else if (phrase.length === 2) {
                            deuxiemeparticipeVerbe = participe;
                            deuxiemeinfinitifVerbe = name;
                            deuxiemeVerbe = deuxPersSing;
                            selectDeuxiemeVerbe = deuxPersSing;
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(premierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(phrase[1]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (sentenceToConjug.text().includes(" as ") || sentenceToConjug.text().includes(" es ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); // Alors remplace le par sa variante
                                    selectDeuxiemeVerbe = participe;
                                } else {
                                    selectDeuxiemeVerbe = name;
                                }
                            } else if ( ordrePremierVerbe > ordreDeuxiemeVerbe) {
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, deuxPersSing)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(premierVerbe, participeVerbe));   
                                    selectPremierVerbe = participeVerbe; 
                                } else {
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, deuxPersSing)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(premierVerbe, infinitifVerbe)); 
                                    selectPremierVerbe = infinitifVerbe;
                                }
                            }
                        } else if (phrase.length === 3) {
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(selectPremierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(selectDeuxiemeVerbe);
                            let ordreTroisiemeVerbe = sentenceToConjug.text().indexOf(phrase[2]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordreTroisiemeVerbe){
                                if (sentenceToConjug.text().includes(" as ") || sentenceToConjug.text().includes(" es ")){
                                }
                            } else if (ordrePremierVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordreDeuxiemeVerbe ){
                                if (sentenceToConjug.text().includes(" as ") || sentenceToConjug.text().includes(" es ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                }
                            } else if (ordreDeuxiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreTroisiemeVerbe) {
                                if (sentenceToConjug.text().includes(" as ") || sentenceToConjug.text().includes(" es ")){
                                }
                            } else if (ordreDeuxiemeVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordrePremierVerbe){
                                if (sentenceToConjug.text().includes(" as ") || sentenceToConjug.text().includes(" es ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                }
                            } else if (ordreTroisiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, deuxPersSing)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, participeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe));    
                                }
                            } else if (ordreTroisiemeVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordrePremierVerbe){
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, deuxPersSing)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeparticipeVerbe)); 
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
                            // console.log("Cette phrase contient \""+name+"\" qui doit donc être remplacé par \""+premPersPlur+"\"");
                            sentenceToConjug.text(sentenceToConjug.text().replace(name, premPersPlur));
                        } else if (phrase.length === 2) {
                            deuxiemeparticipeVerbe = participe;
                            deuxiemeinfinitifVerbe = name;
                            deuxiemeVerbe = premPersPlur;
                            selectDeuxiemeVerbe = premPersPlur;
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(premierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(phrase[1]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (sentenceToConjug.text().includes(" avons ") || sentenceToConjug.text().includes(" sommes ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); // Alors remplace le par sa variante
                                    selectDeuxiemeVerbe = participe;
                                } else {
                                    selectDeuxiemeVerbe = name;
                                }
                            } else if ( ordrePremierVerbe > ordreDeuxiemeVerbe) {
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, premPersPlur)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(premierVerbe, participeVerbe));   
                                    selectPremierVerbe = participeVerbe;
                                } else {
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, premPersPlur)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(premierVerbe, infinitifVerbe)); 
                                    selectPremierVerbe = infinitifVerbe;
                                }
                            }
                        } else if (phrase.length === 3) {
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(selectPremierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(selectDeuxiemeVerbe);
                            let ordreTroisiemeVerbe = sentenceToConjug.text().indexOf(phrase[2]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordreTroisiemeVerbe){
                                if (sentenceToConjug.text().includes(" avons ") || sentenceToConjug.text().includes(" sommes ")){
                                }
                            } else if (ordrePremierVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordreDeuxiemeVerbe ){
                                if (sentenceToConjug.text().includes(" avons ") || sentenceToConjug.text().includes(" sommes ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                }
                            } else if (ordreDeuxiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreTroisiemeVerbe) {
                                if (sentenceToConjug.text().includes(" avons ") || sentenceToConjug.text().includes(" sommes ")){
                                }
                            } else if (ordreDeuxiemeVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordrePremierVerbe){
                                if (sentenceToConjug.text().includes(" avons ") || sentenceToConjug.text().includes(" sommes ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                }
                            } else if (ordreTroisiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, premPersPlur)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, participeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe));   
                                }
                            } else if (ordreTroisiemeVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordrePremierVerbe){
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, premPersPlur)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeparticipeVerbe)); 
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
                            // console.log("Cette phrase contient \""+name+"\" qui doit donc être remplacé par \""+deuxPersPlur+"\"");
                            sentenceToConjug.text(sentenceToConjug.text().replace(name, deuxPersPlur));
                        } else if (phrase.length === 2) {
                            deuxiemeparticipeVerbe = participe;
                            deuxiemeinfinitifVerbe = name;
                            deuxiemeVerbe = deuxPersPlur;
                            selectDeuxiemeVerbe = deuxPersPlur;
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(premierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(phrase[1]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (sentenceToConjug.text().includes(" avez ") || sentenceToConjug.text().includes(" êtes ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); // Alors remplace le par sa variante
                                    selectDeuxiemeVerbe = participe;
                                } else {
                                    selectDeuxiemeVerbe = name;
                                }
                            } else if ( ordrePremierVerbe > ordreDeuxiemeVerbe) {
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, deuxPersPlur)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(premierVerbe, participeVerbe));   
                                    selectPremierVerbe = participeVerbe; 
                                } else {
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, deuxPersPlur)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(premierVerbe, infinitifVerbe)); 
                                    selectPremierVerbe = infinitifVerbe;
                                }
                            }
                        } else if (phrase.length === 3) {
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(selectPremierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(selectDeuxiemeVerbe);
                            let ordreTroisiemeVerbe = sentenceToConjug.text().indexOf(phrase[2]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordreTroisiemeVerbe){
                                if (sentenceToConjug.text().includes(" avez ") || sentenceToConjug.text().includes(" êtes ")){
                                }
                            } else if (ordrePremierVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordreDeuxiemeVerbe ){
                                if (sentenceToConjug.text().includes(" avez ") || sentenceToConjug.text().includes(" êtes ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                }
                            } else if (ordreDeuxiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreTroisiemeVerbe) {
                                if (sentenceToConjug.text().includes(" avez ") || sentenceToConjug.text().includes(" êtes ")){
                                }
                            } else if (ordreDeuxiemeVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordrePremierVerbe){
                                if (sentenceToConjug.text().includes(" avez ") || sentenceToConjug.text().includes(" êtes ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                }
                            } else if (ordreTroisiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, deuxPersPlur)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, participeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe));   
                                }
                            } else if (ordreTroisiemeVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordrePremierVerbe){
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, deuxPersPlur)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeparticipeVerbe)); 
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
                            // console.log("Cette phrase contient \""+name+"\" qui doit donc être remplacé par \""+troisPersPlur+"\"");
                            sentenceToConjug.text(sentenceToConjug.text().replace(name, troisPersPlur));
                        } else if (phrase.length === 2) {
                            deuxiemeparticipeVerbe = participe;
                            deuxiemeinfinitifVerbe = name;
                            deuxiemeVerbe = troisPersPlur;
                            selectDeuxiemeVerbe = troisPersPlur;
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(premierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(phrase[1]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (sentenceToConjug.text().includes(" ont ") || sentenceToConjug.text().includes(" sont ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); // Alors remplace le par sa variante
                                    selectDeuxiemeVerbe = participe;
                                } else {
                                    selectDeuxiemeVerbe = name;
                                }
                            } else if ( ordrePremierVerbe > ordreDeuxiemeVerbe) {
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, troisPersPlur)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(premierVerbe, participeVerbe));   
                                    selectPremierVerbe = participeVerbe; 
                                } else {
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, troisPersPlur)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(premierVerbe, infinitifVerbe)); 
                                    selectPremierVerbe = infinitifVerbe;
                                }
                            }
                        } else if (phrase.length === 3) {
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(selectPremierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(selectDeuxiemeVerbe);
                            let ordreTroisiemeVerbe = sentenceToConjug.text().indexOf(phrase[2]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordreTroisiemeVerbe){
                                if (sentenceToConjug.text().includes(" ont ") || sentenceToConjug.text().includes(" sont ")){
                                }
                            } else if (ordrePremierVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordreDeuxiemeVerbe ){
                                if (sentenceToConjug.text().includes(" ont ") || sentenceToConjug.text().includes(" sont ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                }
                            } else if (ordreDeuxiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreTroisiemeVerbe) {
                                if (sentenceToConjug.text().includes(" ont ") || sentenceToConjug.text().includes(" sont ")){
                                }
                            } else if (ordreDeuxiemeVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordrePremierVerbe){
                                if (sentenceToConjug.text().includes(" ont ") || sentenceToConjug.text().includes(" sont ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                }
                            } else if (ordreTroisiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, troisPersPlur)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, participeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe)); 
                                }
                            } else if (ordreTroisiemeVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordrePremierVerbe){
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, troisPersPlur)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeparticipeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe));    
                                }
                            }
                        }
                    }
                }
            } else {
                if(troisPersSing !== null) { // Conjugaison à la troisième personne du singulier                
                    if (sentenceToConjug.text().includes(" " + name + " ")) {   
                        phrase.push(name);
                        if (phrase.length === 1){
                            premierVerbe = troisPersSing;
                            infinitifVerbe = name;
                            participeVerbe = participe;
                            selectPremierVerbe = troisPersSing;
                            // console.log("Cette phrase contient \""+name+"\" qui doit donc être remplacé par \""+troisPersSing+"\"");
                            sentenceToConjug.text(sentenceToConjug.text().replace(name, troisPersSing));
                        } else if (phrase.length === 2) {
                            deuxiemeparticipeVerbe = participe;
                            deuxiemeinfinitifVerbe = name;
                            deuxiemeVerbe = troisPersSing;
                            selectDeuxiemeVerbe = troisPersSing;
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(premierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(phrase[1]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (sentenceToConjug.text().includes(" a ") || sentenceToConjug.text().includes(" est ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); // Alors remplace le par sa variante
                                    selectDeuxiemeVerbe = participe;
                                } else {
                                    selectDeuxiemeVerbe = name;
                                }
                            } else if ( ordrePremierVerbe > ordreDeuxiemeVerbe) {
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, troisPersSing)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(premierVerbe, participeVerbe));   
                                    selectPremierVerbe = participeVerbe;  
                                } else {
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, troisPersSing)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(premierVerbe, infinitifVerbe)); 
                                    selectPremierVerbe = infinitifVerbe; 
                                }
                            }
                        } else if (phrase.length === 3) {
                            let ordrePremierVerbe = sentenceToConjug.text().indexOf(selectPremierVerbe);
                            let ordreDeuxiemeVerbe = sentenceToConjug.text().indexOf(selectDeuxiemeVerbe);
                            let ordreTroisiemeVerbe = sentenceToConjug.text().indexOf(phrase[2]);
                            if (ordrePremierVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordreTroisiemeVerbe){
                                if (sentenceToConjug.text().includes(" a ") || sentenceToConjug.text().includes(" est ")){
                                }
                            } else if (ordrePremierVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordreDeuxiemeVerbe ){
                                if (sentenceToConjug.text().includes(" a ") || sentenceToConjug.text().includes(" est ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                }
                            } else if (ordreDeuxiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreTroisiemeVerbe) {
                                if (sentenceToConjug.text().includes(" a ") || sentenceToConjug.text().includes(" est ")){
                                }
                            } else if (ordreDeuxiemeVerbe < ordreTroisiemeVerbe && ordreTroisiemeVerbe < ordrePremierVerbe){
                                if (sentenceToConjug.text().includes(" a ") || sentenceToConjug.text().includes(" est ")){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, participe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe)); 
                                }
                            } else if (ordreTroisiemeVerbe < ordrePremierVerbe && ordrePremierVerbe < ordreDeuxiemeVerbe){
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, troisPersSing)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, participeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeinfinitifVerbe));  
                                }
                            } else if (ordreTroisiemeVerbe < ordreDeuxiemeVerbe && ordreDeuxiemeVerbe < ordrePremierVerbe){
                                if (name == "avoir" || name == "être"){
                                    sentenceToConjug.text(sentenceToConjug.text().replace(name, troisPersSing)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectDeuxiemeVerbe, deuxiemeparticipeVerbe)); 
                                    sentenceToConjug.text(sentenceToConjug.text().replace(selectPremierVerbe, infinitifVerbe));   
                                }
                            }
                        }
                    }
                }
            }
       }
    }
    recordingSentence();
            /* end Conjugaison */
    }
/* end Parcours Objets Pictogramme à Conjuguer */

/* Parcours Objets Pictogramme à Accorder au Pluriel */
function parcoursJSONPlur(jsonObj) {
    for(let i = 0; i< jsonObj.length; i++){
        /*if(jsonObj[i]['name'] === pictoToConj){*/ // Si le nom du pictogramme correspond au pictogamme passé en paramètre
        // console.log("Le pictogramme à conjuguer est \""+pictoToConj+"\"")
        let name = jsonObj[i]['name'].toLowerCase();
        let gender = jsonObj[i]['genre'];                   // Alors, renvoie le genre,
        let pluriel = jsonObj[i]['pluriel'];                // le pluriel,
        let masculinSing = jsonObj[i]['masculin_sing'];     // le masculin singulier
        let masculinPlur = jsonObj[i]['masculin_plur'];     // le masculin pluriel
        let femininSing = jsonObj[i]['feminin_sing'];       // le féminin singulier
        let femininPlur = jsonObj[i]['feminin_plur'];       // le féminin pluriel



        /* Pluriel */

        if (sentenceToConjug.text().includes(" des ") || sentenceToConjug.text().includes("Des ") || sentenceToConjug.text().includes(" mes ") || sentenceToConjug.text().includes("Mes ") || sentenceToConjug.text().includes(" tes ") || sentenceToConjug.text().includes("Tes ") || sentenceToConjug.text().includes(" ses ") || sentenceToConjug.text().includes("Ses ") || sentenceToConjug.text().includes(" les ") || sentenceToConjug.text().includes("Les ") || sentenceToConjug.text().includes(" ces ") || sentenceToConjug.text().includes("Ces ")) { // pluriel
            // console.log("Cette phrase contient un determinant du pluriel")
            if (sentenceToConjug.text().includes(name)[gender] === "féminin" && femininPlur !== null) {
                femPlur = true;
            } else if (sentenceToConjug.text().includes(name)[gender] === "masculin" && masculinPlur !== null) {
                mascPlur = true;
            }
            if (pluriel !== null) { // Si le mot peut s'accorder au pluriel

                if (sentenceToConjug.text().includes(" " + name + " ") || sentenceToConjug.text().includes("'" + name + " ")) {

                    sentenceToConjug.text(sentenceToConjug.text().replace(name, pluriel));
                }
            }
        } else {
            if (sentenceToConjug.text().includes(name)[gender] === "féminin" && femininSing !== null) {
                femSing = true;
            } else if (sentenceToConjug.text().includes(name)[gender] === "masculin" && masculinSing !== null) {
                mascSing = true;
            }
            if (femSing) {
                sentenceToConjug.text(sentenceToConjug.text().replace(name, femininSing));
            } else if (mascSing) {
                sentenceToConjug.text(sentenceToConjug.text().replace(name, masculinSing));
            }
        }
        recordingSentence();
        /* end Pluriel */
    }
}
function recordingSentence(){
    $('#sentence_text').val(sentenceToConjug.text()); // Donne sa valeur à l'input caché
}