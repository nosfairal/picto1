/* Vocal */

/* Pictogramme */
$(".imgP").mousedown(function(){ // Lorsque la souris intervient sur un pictogramme
    speech.text = $(this).attr('title');
    speech.pitch = 1; // 0 à 2 = Hauteur
    speech.rate = 1; // 0.5 à 2 = Vitesse
    speech.volume = 0.5; // 0 à 1 = Volume
    speech.lang = 'fr-FR'; // Langue
    speechSynthesis.speak(speech);
});
/* end Pictogramme */

/* Phrase */
$("#play").click(() => {    // Au click sur le bouton "play"
    speech.text = $("#sentenceText").text();
    speech.pitch = 1; // 0 à 2 = Hauteur
    speech.rate = 1; // 0.5 à 2 = Vitesse
    speech.volume = 0.5; // 0 à 1 = Volume
    speech.lang = 'fr-FR'; // Langue
    speechSynthesis.speak(speech);
})
/* end Phrase */


/*variable globale*/
var countWord=0;

/*lecture mot à mot*/
function wordByword() {
    let sentence = $("#sentenceText").text();// variable pour récupérer le texte de la phrase
    let  tabWord=[]; //tableau de mot
    tabWord = sentence.split(" "); //tableau de mot découpé

    if (countWord == 0){ 
        var brightWord = tabWord[countWord] + " ";// mot lu (en fonction de sa position dans le tableau)
    } else {
        var brightWord = " " + tabWord[countWord] + " ";// mot lu (en fonction de sa position dans le tableau)
    }
    // console.log(brightWord);

    if (countWord === tabWord.length - 1) {// si le compteur est égale à la taille du tableau -1 alors on remplace le mot lu par un span avec une classe speciale et on remet le compteur à 0
        speech.text = tabWord[countWord];
        speech.pitch = 1; // 0 à 2 = Hauteur
        speech.rate = 1; // 0.5 à 2 = Vitesse
        speech.volume = 0.5; // 0 à 1 = Volume
        speech.lang = 'fr-FR'; // Langue
        speechSynthesis.speak(speech);
        let replace = sentence.replace(brightWord, '<span class="brightWord">' + brightWord + '</span>');
        // console.log(replace);
        $("#sentenceText").html(replace);
        countWord = 0;

    } else {// sinon on fait la même chose mais on incrémente le compteur pour lire le mot suivant
        speech.text = tabWord[countWord];
        speech.pitch = 1; // 0 à 2 = Hauteur
        speech.rate = 1; // 0.5 à 2 = Vitesse
        speech.volume = 0.5; // 0 à 1 = Volume
        speech.lang = 'fr-FR'; // Langue
        speechSynthesis.speak(speech);
        let replace = sentence.replace(brightWord, '<span class="brightWord">' + brightWord + '</span>');
        // console.log(replace);
        $("#sentenceText").html(replace);
        countWord++;
    }
}
//lecture de la fonction wordByWord au click
$("#playWordByWord").on("click", function() {
    wordByword();
})

/*fin lecture mot à mot

 */
/* Mise à jour de la phrase */
function textUpdate(){
    sentenceToConjug.text("");
    let pictograms = [];    // Tableau qui contiendra les mots correspondants aux pictos droppés
    let i = 1;
    $('.drop').each(function(){ // Parcourt les zones de drop
        if ($("#mot"+i).children().attr('alt') !== undefined) { // Si la zone de drop contient un picto
            pictoWord = $("#mot"+i).children().attr('alt'); // Récupère le mot correspondant au pictogramme
            if (pictoWord == "l'" || pictoWord == "L'" || pictoWord == "j'" || pictoWord == "J'") {
                pictoWordSpace = pictoWord;
            } else {
                pictoWordSpace = pictoWord + ' ';
            }
            pictograms.push(pictoWordSpace); // Et l'envoie dans le tableau
        }
        i++;
    })
    let sentence = pictograms.join('');    // Join les éléments du tableau par un espace
    
    starLevel(sentence);
    getDataConj("/api/get/pictogram"); // (récupère les variantes du pictogramme pour la conjugaison)
    sentence = sentence.charAt(0).toUpperCase() + sentence.substring(1).toLowerCase(); // Met la première lettre de la phrase en majuscule, et le reste en minuscule
    $("#sentenceText").append(sentence);  // Affiche la phrase dans la zone prévue pour
    $('#sentence_text').val(sentenceToConjug.text()); // Donne sa valeur à l'input caché
}
/* end Mise à jour de la phrase */

/* Mise à jour de la phrase NEGATIF */
function negUpdate() {
    sentenceToConjug.text("");
    let pictograms = [];    // Tableau qui contiendra les mots correspondants aux pictos droppés
    let i = 1;
    $('.drop').each(function(){ // Parcourt les zones de drop
        let pictoWord;
        if ($("#mot" + i).children().attr('alt') !== undefined) { // Si la zone de drop contient un picto
            pictoWord = $("#mot" + i).children().attr('alt'); // Récupère le mot correspondant au pictogramme
            if (pictoWord == "l'" || pictoWord == "L'" || pictoWord == "j'" || pictoWord == "J'") {
                pictoWordSpace = pictoWord;
            } else {
                pictoWordSpace = pictoWord + ' ';
            }
            pictograms.push(pictoWordSpace); // Et l'envoie dans le tableau
        }
        i++;
    })
    if (pictograms.length <= 1) {
        alert("La phrase n'est pas assez complète pour être négative");
        $("#pos").hide();
        $("#neg").show();
    } else if (pictograms.length >=2) {
        getDataNeg("/api/get/pictogram"); // (récupère les variantes du pictogramme pour la conjugaison)
    }
    let sentence = pictograms.join('');    // Join les éléments du tableau par un espace
    starLevel(sentence);
    sentence = sentence.charAt(0).toUpperCase() + sentence.substring(1).toLowerCase(); // Met la première lettre de la phrase en majuscule, et le reste en minuscule
    $("#sentenceText").append(sentence);  // Affiche la phrase dans la zone prévue pour
}
/* end Mise à jour de la phrase NEGATIF */

/* Poubelle */
$("#trash").click(() => {
    $("#sentenceText").html('');    // La zone de texte se vide
    $("#drop > div > img").remove();    // Les zones droppables se vident
    $("#drop > div").removeClass("pictoPresent"); // Les classes de contraintes se retirent
    $(".fa-star").css("color", "#ffffff"); //l'étoile redevient blanche
})
/* end Poubelle */

/* Star */
function starLevel(sentence) {
    let picto=$(".drop").children().length;//Compte le nombre de picto dans la phrase
    let star = document.querySelector(".fa-star")
    if(picto===0){star.style.color="#ffffff"} // modifie la couleur de l'étoile en fonction du nombre de pictogrammes droppés
    if(picto===1){star.style.color="#fff2d4"}
    if(picto===2){star.style.color="#eed58f"}
    if(picto===3){star.style.color="#ffe79b"}
    if(picto===4){star.style.color="#fade5d"}
    if(picto===5){star.style.color="#fdd54b"}
    if(picto===6){star.style.color="#eee310"}
}
/* end Star */

/* Négatif/Affirmatif */
$("#pos").hide();
$("#neg").click(() => { // Au click sur le bouton "négation"
    $("#neg").hide()    // Celui-là disparait
    $("#pos").show()    // Pour faire place au bouton "affirmation"
    negUpdate();        // Fait le traitement relatif à la négation
})
$("#pos").click(() => {
    $("#pos").hide()
    $("#neg").show()
    textUpdate();
})
/* end Négatif/Positif */





