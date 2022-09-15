/* Drop */
$("#drop .drop").droppable({

    accept: function(){
        // N'accepte plus de pictogramme quand la classe "pictoPresent" est présente
        return !$(this).hasClass("pictoPresent");
    },
    tolerance: "fit",
    classes: {
        "ui-droppable-active": "ui-state-highlight"
    },
    
    drop: function(ev, ui){
        var validDrop;
        let draggableElement = $(ui.helper).clone(); // Clone du pictogramme draggé
        let droppedOn = $(this); // Zone où le pictogramme est droppé
        // Ajout d'une classe indiquant que la zone n'est plus disponible lorsqu'un pictogramme est droppé
        droppedOn.addClass("pictoPresent");
        draggableElement.removeClass('pictoAbsolute');
        // Ajout d'une classe indiquant que le pictogramme est droppé et d'une classe changeant son type de position
        $(draggableElement).addClass("droppedPicto pictoPosition").appendTo(droppedOn);
        textUpdate(); // La phrase est mis à jour
        draggableElement.draggable({
            helper: 'clone',
            // Le retour ne se produit que si le draggable n'a pas été déposé sur un droppable
            revert: function(is_valid_drop){
                // when you're done, you need to remove the "dragging" class
                // and yes, I'm sure this can be refactored better, but I'm 
                // out of time for today! :)
                if(is_valid_drop){
                    validDrop = true;                   
                    return false;
                } else {
                    validDrop = false;
                    return true
                }
            },
            appendTo: 'body',
            snap: ".drop",
            start: function( event, ui ) {
                ui.helper.addClass('pictoAbsolute'); 
            },
            stop: function( event, ui ) {
                if (validDrop === true) {
                    draggableElement.parent().removeClass("pictoPresent");                
                    draggableElement.remove();
                }
                textUpdate(); // La phrase est mis à jour
            }
        });


    }
})       
 // Le carousel de pictogramme devient droppable
$(".wrapperP").droppable({
    // Il n'accepte que les pictogrammes qui ont déjà été droppé
    accept: ".droppedPicto",
    tolerance: "fit",
    drop: function (ev, ui) {
        let draggableElement = $(ui.helper); // Clone du pictogramme draggé
        let droppedOn = $(this);
        // La classe de contrainte est retiré de la zone de drop
        draggableElement.parent().removeClass("pictoPresent");
        draggableElement.remove(); // Le pictogramme disparait
        $("#pos").hide();
        $("#neg").show();
        textUpdate(); // La phrase est mis à jour
        
    },
})
$(".wrapperSCP").droppable({
    // Il n'accepte que les pictogrammes qui ont déjà été droppé
    accept: ".droppedPicto",
    tolerance: "fit",
    drop: function (ev, ui) {
        let draggableElement = $(ui.helper); // Clone du pictogramme draggé
        let droppedOn = $(this);
        // La classe de contrainte est retiré de la zone de drop
        draggableElement.parent().removeClass("pictoPresent");
        draggableElement.remove(); // Le pictogramme disparait
        $("#pos").hide();
        $("#neg").show();
        textUpdate(); // La phrase est mis à jour
        
    },
})
/* end Drop */


/* Echange */
/* Drag */
$(".picto img").draggable({ // Les pictogrammes du carousel deviennent draggable
    helper: 'clone', // Le pictogramme est cloné
    revert: 'invalid', // Le retour ne se produit que si le draggable n'a pas été déposé sur un droppable
    start:function(){
        if($(this).hasClass("droppedPicto")){
            $(this).removeClass("droppedPicto");
            $(this).parent().removeClass("pictoPresent");
        }
    },
    appendTo: "body",
    snap: ".drop"
});
/* end Drag */