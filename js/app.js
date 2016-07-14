document.addEventListener("DOMContentLoaded", function () {

    //Variables
    var letterSpace = document.querySelector(".abc");
    var bigLetter = document.querySelector('h1.letter');
    var navMenu = document.querySelectorAll('footer h1');
    var settings = document.querySelector("header i");
    var puzzleDiv = document.querySelector('.puzzle');
    var puzzleIcon = document.querySelector('.flaticon-puzzle');
    var bulbIcon = document.querySelector('.flaticon-light-bulb');
    var puzzleDel = function () {};
    var changeMe = function () {};
    var shakeOrNot;
    var showLetter;
    var currentWord = "";
    var fullfilled = "";
//    var letterMax = 10; //The user set the max length of letters in one word

//Cookies
 //   Cookies.remove('alfabet');
    var cookie = typeof Cookies.get('alfabet');
    if (cookie !== "undefined") {
        fullfilled = Cookies.get('alfabet');
        console.log(Cookies.get('alfabet').split(" "));
        var answered = fullfilled.split(" ");
    }


    //Functions
    var loadPage = function (el) { //loads all of page content from db object
        bigLetter.innerText = el;
        currentWord = ""; //deletes the current word from previous letter
        bigLetter.style.display = "flex";
        puzzleDel();
        var counter = 0;
        var toRemove = document.querySelectorAll('.abc p');
        if (toRemove != []) { //removes previous screen (if there is any)
            for (var i = 0; i < toRemove.length; i++) {
                toRemove[i].parentNode.removeChild(toRemove[i]);
            }
        }
        for (var key in lettersDb[el]) { //adds the icons to main screen (unseen)
            var icon = document.createElement("i");
            icon.classList.add(lettersDb[el][key]);
            if (fullfilled.indexOf(key) >= 0) {
                var url = "img/" + icon.className.slice(9) + ".svg";
                console.log('url');
                icon.style.color = "transparent";
                icon.style.backgroundImage = "url(" + url + ")";
            }
            icon.classList.add("hidden");
            icon.classList.add("is-paused");
            icon.addEventListener("click", letterTip);
            icon.addEventListener("click", function() {
                currentWord = this.dataset.key;
                puzzleDel();
                bigLetter.style.display = "flex";
                bigLetter.classList.remove("none");
            });
            var paragraf = document.createElement("p");
            paragraf.appendChild(icon);
            letterSpace.appendChild(paragraf);
            icon.dataset.key = key;
            counter++
            if (counter >= 6) {
                break;
            }
        }
        var letters = document.querySelectorAll(".abc i");
        shakeOrNot(); //checks if the big letter needs to shake
        var count = 0;
        showLetter = function (e) { //shows the icons
            shakeOrNot(); //checks if the big letter still needs to shake
            if (letters[count].classList.contains('is-paused')) {
                letters[count].classList.remove('is-paused');
            }
            count++;
            if (count == letters.length) { //end of the icons, freeze
                bigLetter.classList.remove("shake-slow");
                bigLetter.removeEventListener("click", showLetter);
            }
        };
        bigLetter.addEventListener("click", showLetter);
    };

    // Function for checking that it's worth to shake or not AND removes 'clicked' class
    shakeOrNot = function() {
        var letters = document.querySelectorAll(".abc i");
        var unseenLetter = document.querySelectorAll('i.is-paused');
        if (bigLetter.classList.contains("clicked")) {
            removeTip(); //if clicked is sentenced to removed, tip ('em') will be also remove
            bigLetter.classList.remove("clicked");
        }
        if (letters.length > 0 && letters.length > (letters.length - unseenLetter.length)) {
            bigLetter.classList.add("shake-slow"); //checks if there's still more letters to show
        } else if (bigLetter.classList.contains("shake-slow")) {
            bigLetter.classList.remove("shake-slow");
        }
    };

    //Menu handling
    for (var i = 0; i < navMenu.length; i++) {
        navMenu[i].addEventListener("click", function() {
            var letter = this.innerText.toLowerCase();
            loadPage(letter);
        })
    }
    var menuShow = function (e) {
        puzzleDel();
        if (document.querySelector("nav") != null) { //hides menu if it's seen
            var toRemove = document.querySelector('nav');
            toRemove.parentNode.removeChild(toRemove);
        }
        document.querySelector('main').style.display = "none";
        var footer = document.querySelector('footer');
        var footerDisplay;
        if (footer.clientWidth > 0) { //save the footer default display (none on mobile, flex on wider screens
            footerDisplay = "flex";
        } else {
            footerDisplay = "none";
        }
        footer.style.display = "none";
        var screen = document.createElement("nav");
        document.body.appendChild(screen);
        for (var key in lettersDb) {
            var letterGap = document.createElement('h1');
            screen.appendChild(letterGap);
            letterGap.innerText = key;
        }
        var buttons = document.querySelectorAll('nav h1');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", function () {
                screen.classList.add("none");
                var letter = this.innerText.toLowerCase();
                window.setTimeout(function () {
                    loadPage(letter);
                    screen.style.display = "none";
                    document.querySelector('main').style.display = "flex";
                    document.querySelector('footer').style.display = footerDisplay;
                }, 1000);
            })
        }
    };

    //Tips for each pic
    var letterTip = function() {
         removeTip(); //remove previous tip (if there's any)
         var word = "";
         if (bigLetter.innerText.length > 1) { //for words with two first letters (one vowel, like 'sh')
             word = this.dataset.key.slice(2);
             console.log(word);
         } else {
             word = this.dataset.key.slice(1);
         }
         var em = document.createElement('em');
         bigLetter.classList.add("clicked");
         bigLetter.appendChild(em);
         em.innerText = word;
         bigLetter.classList.remove("shake-slow");
     };
    var removeTip = function () {
         var toRemove = bigLetter.querySelector('em');
         if (toRemove != null) {
             toRemove.parentNode.removeChild(toRemove);
         }
     };
    puzzleDel = function () {
        if (puzzleDiv.classList.contains("done")) { //checks if drag&drop is loaded
            letterSpace.classList.remove("small");
            bulbIcon.classList.add("none");
            var hrRemove = puzzleDiv.querySelector('hr');
            puzzleDiv.removeChild(hrRemove);
            var toRemove = puzzleDiv.querySelector('.dropzone-div');
            toRemove.parentNode.removeChild(toRemove);
            divs = puzzleDiv.querySelectorAll('.drag-drop');
            for (var i = 0; i < divs.length; i++) {
                var toRemove = divs[i];
                toRemove.parentNode.removeChild(toRemove);
            }
            puzzleDiv.classList.remove("done");
            bigLetter.addEventListener("click", showLetter);
            if (bigLetter.classList.contains("none")) {
                bigLetter.classList.remove("none");
            }
        }
    };
    changeMe = function () {
        var icons = document.querySelectorAll('.abc i');
        for (var i = 0; i < icons.length; i++) {
            if (icons[i].dataset.key == currentWord) {
                icons[i].classList.remove("hidden");
                var url = "img/" + icons[i].className.slice(9) + ".svg";
                icons[i].classList.add("hidden");
                icons[i].style.color = "transparent";
                icons[i].style.backgroundImage = "url(" + url + ")";
            }
        }
    };

     var puzzle = function () {
         if (currentWord != "") {
             letterSpace.classList.add('small');
             puzzleDiv.classList.remove("none");
             bigLetter.classList.add("none");
             bigLetter.removeEventListener("click", showLetter);
             puzzleDel();
             bulbIcon.classList.remove("none");
             var dropzone = document.createElement('div');
             dropzone.classList.add("dropzone-div");
             for (var i in currentWord) {
                 var letter = currentWord.charAt(i);
                 var newDiv = document.createElement('div');
                 newDiv.classList.add('dropzone');
                 newDiv.setAttribute('id', 'outer-dropzone');
                 newDiv.setAttribute("data-letter", letter);
                 dropzone.appendChild(newDiv);
                 // enable draggables to be dropped into this
                 var acceptLtr = "#" + newDiv.dataset.letter;
                 interact(newDiv).dropzone({
                     // only accept elements matching this CSS selector
                     accept: acceptLtr,
                     // Require a 90% element overlap for a drop to be possible
                     overlap: 0.9,

                     // listen for drop related events:

                     ondropactivate: function (event) {
                         // add active dropzone feedback
                         event.target.classList.add('drop-active');
                     },
                     ondragenter: function (event) {
                         var draggableElement = event.relatedTarget,
                             dropzoneElement = event.target;

                         // feedback the possibility of a drop
                         dropzoneElement.classList.add('drop-target');
                         dropzoneElement.classList.add('good');
                         draggableElement.classList.add('can-drop');
                         puzzleDone();
                         //          draggableElement.textContent = 'Dragged in'; //don't need it
                     },
                     ondragleave: function (event) {
                         // remove the drop feedback style
                         event.target.classList.remove('drop-target');
                         event.target.classList.remove('good');
                         event.relatedTarget.classList.remove('can-drop');
                         //          event.relatedTarget.textContent = 'Dragged out'; //dont need either
                     },
                     ondrop: function (event) {
                         event.relatedTarget.style.color = "white";
                         event.relatedTarget.style.backgroundColor = "#2bb5c1";
                         event.relatedTarget.classList.remove('draggable');
                     },
                     ondropdeactivate: function (event) {
                         // remove active dropzone feedback
                         event.target.classList.remove('drop-active');
                         event.target.classList.remove('drop-target');
                     }
                 })
             }
             puzzleDiv.appendChild(dropzone);
             var hr = document.createElement('hr');
             puzzleDiv.appendChild(hr);
             for (var i in currentWord) {
                 var letter = currentWord.charAt(i);
                 var newDiv = document.createElement('div');
                 newDiv.classList.add('draggable');
                 newDiv.classList.add('drag-drop');
                 newDiv.setAttribute("id", letter);
                 newDiv.style.order = Math.floor(Math.random() * currentWord.length);
                 newDiv.innerText = letter;
                 document.querySelector('.puzzle-div').appendChild(newDiv);
             }
             puzzleDiv.classList.add("done");
         }
         // target elements with the "draggable" class
         interact('.draggable')
             .draggable({
                 // enable inertial throwing
                 inertia: true,
                 // keep the element within the area of it's parent
                 restrict: {
                     restriction: "self",
                     endOnly: true,
                     elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                 },
                 // enable autoScroll
                 autoScroll: true,

                 // call this function on every dragmove event
                 onmove: dragMoveListener,
                 // call this function on every dragend event
                 onend: function (event) {
                     var textEl = event.target.querySelector('p');

                     textEl && (textEl.textContent =
                         'moved a distance of '
                         + (Math.sqrt(event.dx * event.dx +
                             event.dy * event.dy)|0) + 'px');
                 }
             });
         function dragMoveListener (event) {
             var target = event.target,
                 // keep the dragged position in the data-x/data-y attributes
                 x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                 y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

             // translate the element
             target.style.webkitTransform =
                 target.style.transform =
                     'translate(' + x + 'px, ' + y + 'px)';

             // update the posiion attributes
             target.setAttribute('data-x', x);
             target.setAttribute('data-y', y);
         }

         // this is used later in the resizing and gesture demos
         window.dragMoveListener = dragMoveListener;
         var puzzleDone = function () {
             var dropzone = document.querySelectorAll('.dropzone');
             var count = 0;
             for (var i = 0; i < dropzone.length; i++) {
                 if (dropzone[i].classList.contains('good')) {
                     count++
                 }
                 if (count == dropzone.length) {
                     console.log(currentWord);
                     console.log(typeof fullfilled);
                     fullfilled += " " + currentWord;
                     changeMe();
                     Cookies.set('alfabet', fullfilled, { expires: 7 });
                     console.log(Cookies.get('alfabet'));
                     return fullfilled;
                 }
             }
         }
     };
    settings.addEventListener("click", menuShow);
    puzzleIcon.addEventListener("click", puzzle);
    bulbIcon.addEventListener("click", function () {
        console.log(fullfilled);
    });
    
    //Database
    var lettersDb =
    {
        "a": {
        "aktor": "flaticon-charlie-chaplin",
            "auto": "flaticon-car",
            "arena": "flaticon-big-stadium",
            "ala": "flaticon-girl",
            "afryka": "flaticon-africa-map",
            "ara": "flaticon-macaw",
            "autobus": "flaticon-bus"
    },
        "b": {
            "balon": "flaticon",
            "byk": "flaticon",
            "bocian": "brat",
            "brat": "flaticon",
            "biurko": "flaticon-desk",
            "bank": "flaticon-bank",
            "but": "flaticon-cinderella-shoe"
    },
        "c": {
            "cyrk": "flaticon-circus",
            "cyklop": "flaticon-cyclops",
            "cegła": "flaticon-brick"
    },
        "cz": {
        "czapka": "flaticon-mortarboard"
    },
        "d": {
            "dym": "flaticon-nature",
            "duch": "flaticon-ghost"
    },
        "e": {
        "eryk": "flaticon-boy-5",
            "elf": "flaticon-elf-1"
    },
        "f": {
        "farby": "flaticon-palette",
            "fabryka": "flaticon-factory"

    },
        "g": {
        "globus": "flaticon-earth-globe",
            "gumka": "flaticon-eraser",
            "gimbus": "flaticon-school-bus",
            "grzyb": "flaticon-mushroom-1"
    },
        "h": {
        "hełm": "flaticon-helmet"
        },
        "i": {
        "irlandia": "flaticon-leprechaun",
    },
        "j": {
        "jabłko": "flaticon-apple",
    },
        "k": {
        "książka": "flaticon-open-book",
            "kot": "flaticon-cat",
            "krowa": "flaticon-cow",
            "kura": "flaticon-hen",
            "królik": "flaticon-rabbit",
            "kobra": "flaticon-cobra",
            "korona": "flaticon-crown",
            "kość": "flaticon-bone",
            "karty": "flaticon-poker"
    },
        "l": {
        "lew": "flaticon-lion",
            "lama": "flaticon-llama",
            "leniwiec": "flaticon-sloth"
    },
        "ł": {
            "łuk": "flaticon-bow",
            "łopata": "flaticon-shovel"
    },
        "m": {
        "mumia": "flaticon-mummy-head-with-opened-eyes-for-halloween",
            "muzyka": "musical-pentagram-lines-with-music-notes",
            "mama": "flaticon-people-1",
            "myszka": "flaticon-computer-mouse",
            "medal": "flaticon-medal",
            "motyl": "flaticon-butterfly",
            "małpa": "flaticon-monkey",
            "mysz": "flaticon-mouse",
            "miecz": "flaticon-sword"
    },
        "n": {
        "notes": "flaticon-notebook",
            "nemo": "flaticon-clown-fish"
    },
        "o": {
        "opona": "flaticon-truck-wheel",
            "okulary": "flaticon-glasses",
            "ołówek": "flaticon-pencil",
            "owca": "flaticon-sheep"
    },
        "p": {
        "plecak": "flaticon-backpack",
            "piłka": "flaticon-basketball",
            "pióro": "flaticon-fountain-pen",
            "pędzel": "flaticon-paint-brush",
            "pies": "flaticon-bulldog",
            "panda": "flaticon-panda",
            "pelikan": "flaticon-pelican",
            "pająk": "flaticon-spider"
    },
        "r": {
        "rak": "flaticon-crab",
            "rekin": "flaticon-shark"
    },
        "s": {
        "sowa": "flaticon-owl",
            "spinacz": "flaticon-paperclip",
            "słoń": "flaticon-elephant",
            "struś": "flaticon-ostrich",
            "sklep": "flaticon-shop",
            "smok": "flaticon-dragon"
    },
        "sz": {
            "szkoła": "flaticon-school",
            "szop": "flaticon-racoon",
            "szachy": "flaticon-chess-board"
    },
        "ś": {
        "świnia": "flaticon-pig"
    },
        "t": {
        "taczka": "flaticon-wheelbarrow",
            "tablica": "flaticon-blackboard",
            "teczka": "flaticon-briefcase",
            "test": "flaticon-test",
            "tygrys": "flaticon-tiger",
            "tukan": "flaticon-toucan",
            "topór": "flaticon-axe"
    },
        "w": {
        "wąż": "flaticon-snake"
    },
        "z": {
        "znak": "flaticon-stop",
            "zamek": "flaticon-castle",
            "złoto": "flaticon-ingot"
    },
        "ż": {
        "żuk": "flaticon-beetle",
            "żaba": "flaticon-frog",
            "żyrafa": "flaticon-giraffe"
    }
    };

loadPage('a');
});
