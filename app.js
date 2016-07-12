document.addEventListener("DOMContentLoaded", function () {

    //Variables
    var showLetter;
    var letters = document.querySelectorAll(".abc i");
    var bigLetter = document.querySelector('h1.letter');
    var count = 0;
    var letterMax = 10; //The user set the max length of letters in one word


    //Functions
    showLetter = function (e) {
        if (letters[count].classList.contains('is-paused')){
            letters[count].classList.remove('is-paused');
        }
        count++;
        if (count == letters.length) {
            bigLetter.removeEventListener("click", showLetter)
        }
    };
    
    bigLetter.addEventListener("click", showLetter);

    for (var i = 0; i < letters.length; i++) {
        console.log(letters[i].dataset.key);
    }
    
    
    //Database
});