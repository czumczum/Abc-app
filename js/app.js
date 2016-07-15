document.addEventListener("DOMContentLoaded", function () {

    //Variables
    var letterSpace = document.querySelector(".abc");
    var bigLetter = document.querySelector('h1.letter');
    var navMenu = document.querySelectorAll('footer h1');
    var settings = document.querySelector("header i");
    var puzzleDiv = document.querySelector('.puzzle');
    var puzzleIcon = document.querySelector('.flaticon-puzzle');
    var bulbIcon = document.querySelector('.flaticon-light-bulb');
    var profilePic = document.querySelector('header .kid');
    var imgTip = document.createElement('img');
    var puzzleDel = function () {};
    var changeMe = function () {};
    var unchangeMe = function () {};
    var shakeOrNot;
    var showLetter;
    var currentWord = "";
    var fullfilled = "";
    var kid;
    var answered;
//    var letterMax = 10; //The user set the max length of letters in one word

//Cookies
    var eatThatCookie = function (name) {
        fullfilled = "";
        var cookie = typeof Cookies.get(name);
        if (cookie !== "undefined") {
            fullfilled = Cookies.get(name);
            answered = fullfilled.split(" ");
        } else {
            answered = [];
        }
        return answered
    }

    //Functions
    var removeLetters = function () { //removes the icons from screen
        var toRemove = document.querySelectorAll('.abc p');
        if (toRemove != []) { //removes previous screen (if there is any)
            for (var i = 0; i < toRemove.length; i++) {
                toRemove[i].parentNode.removeChild(toRemove[i]);
            }
        }
    }
    var loadPage = function (el) { //loads all of page content from db object
        bigLetter.innerText = el;
        if (bigLetter.classList.contains("none")) {
            bigLetter.classList.remove("none");
        }
        if (bigLetter.classList.contains("clicked")) {
            bigLetter.classList.remove("clicked");
        }
        currentWord = ""; //deletes the current word from previous letter
        bigLetter.style.display = "flex";
        puzzleDel();
        removeLetters();
        var createIcons = function () {
            var number = [];
            for (var key in lettersDb[el]) {
                number.push(key);
            }
           removeLetters();
            for (var i = 0; i < 6; i++) {
                var random = Math.floor(Math.random() * (number.length));
                var icon = document.createElement("i");
                icon.classList.add(lettersDb[el][number[random]]);
                if (fullfilled.indexOf(number[random]) >= 0) {
                    var url = "img/" + icon.className.slice(9) + ".svg";
                    icon.style.color = "transparent";
                    icon.style.backgroundImage = "url(" + url + ")";
                }
                icon.classList.add("hidden");
                icon.classList.add("is-paused");
                icon.addEventListener("click", letterTip);
                icon.addEventListener("click", function () {
                    unchangeMe();
                    currentWord = this.dataset.key;
                    puzzleDel();
                    bigLetter.style.display = "flex";
                    bigLetter.classList.remove("none");
                });
                var paragraf = document.createElement("p");
                paragraf.appendChild(icon);
                letterSpace.appendChild(paragraf);
                icon.dataset.key = number[random]; //randomizes the view of icons, but max 6 on screen
                number.splice(random, 1);
                if (number.length <= 0) {
                    break
                }
                }
                unchangeMe();
                showLetter();
        }
        showLetter = function (e) { //shows the icons
            var letters = document.querySelectorAll(".abc i");
            shakeOrNot(); //checks if the big letter still needs to shake
            for (var i = 0; i < letters.length; i++) {
                if (letters[i].classList.contains('is-paused')) {
                    letters[i].classList.remove('is-paused');
                }
            }
                bigLetter.classList.remove("shake-slow");
                bigLetter.removeEventListener("click", showLetter);
            }
            bigLetter.addEventListener("click", createIcons);
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
            imgTip.setAttribute('src', 'img/tap.svg')
            bigLetter.appendChild(imgTip);
        } else if (bigLetter.classList.contains("shake-slow")) {
            bigLetter.classList.remove("shake-slow");
            bigLetter.removeChild(imgTip);
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
        if (document.querySelector(".welcome") != null) { //hides menu if it's seen
            var toRemove = document.querySelector('.welcome');
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
    var welcomePage = function () {
        puzzleDel();
        if (document.querySelector(".welcome") != null) { //hides menu if it's seen
            var toRemove = document.querySelector('.welcome');
            toRemove.parentNode.removeChild(toRemove);
        }
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
        var screen = document.createElement("div");
        screen.classList.add('welcome');
        document.body.appendChild(screen);
        var url = "";
        //Creating profile pictures with cookies profiles
        var imgKid;
        var kidDiv;
        var score;
        for (var i = 0; i < 7; i++) {
            imgKid = document.createElement('img');
            kidDiv = document.createElement('div');
            score = document.createElement('span');
            kidDiv.appendChild(imgKid);
            kidDiv.appendChild(score);
            kid = "girl" + i;
            if (eatThatCookie(kid).length > 0) {
                score.innerText = eatThatCookie(kid).length - 1; //score number if it's higher than 0
            }
            screen.appendChild(kidDiv);
            url = "img/girl-" + i + ".svg";
            imgKid.setAttribute("src", url);
            imgKid.setAttribute("alt", "kid picture");
            imgKid.setAttribute("title", "profile picture to choose");
            kidDiv.classList.add(kid);
        }
        for (var i = 0; i < 7; i++) {
            imgKid = document.createElement('img');
            kidDiv = document.createElement('div');
            score = document.createElement('span');
            kid = "boy" + i;
            kidDiv.classList.add(kid);
            kidDiv.appendChild(imgKid);
            kidDiv.appendChild(score);
            if (eatThatCookie(kid).length > 0) {
                score.innerText = eatThatCookie(kid).length - 1; //score number if it's higher than 0
            }
            screen.appendChild(kidDiv);
            url = "img/boy-" + i + ".svg";
            imgKid.setAttribute("src", url);
            imgKid.setAttribute("alt", "kid picture");
            imgKid.setAttribute("title", "profile picture to choose");
        }
        var buttons = document.querySelectorAll('.welcome img');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", function () {
                screen.classList.add("none");
                kid = this.parentNode.className;
                eatThatCookie(kid);
                url = this.getAttribute("src");
                window.setTimeout(function () {
                    loadPage("a");
                    screen.style.display = "none";
                    document.querySelector('main').style.display = "flex";
                    document.querySelector('footer').style.display = footerDisplay;
                    profilePic.setAttribute("src", url);
                    profilePic.style.opacity = 1;
                }, 900);
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
            var icons = document.querySelectorAll('.abc p');
            for (var i = 0; i < icons.length; i++) {
                if (icons[i].classList.contains('small')) {
                    icons[i].classList.remove('small');
                }
            }
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
        }
    };  //clean puzzle from the screen
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
    unchangeMe = function () {
        var icons = document.querySelectorAll('.abc i');
        for (var i = 0; i < icons.length; i++) {
            if (icons[i].dataset.key == currentWord) {
                if (icons[i].classList.contains('done')) {
                    return true //TODO add some fireworks
                }
                var url = icons[i].style.backgroundImage.slice(0,4);
                url = url.slice(url.length - 4);
                console.log(url);
                icons[i].style.backgroundImage = "none";
                icons[i].classList.add("flaticon-" + url);
                icons[i].classList.add("hidden");
                icons[i].style.color = "#2bb5c1";
            }
        }
    }
     var puzzle = function () {
         changeMe();
         if (currentWord != "") {
             var icons = document.querySelectorAll('.abc p');
             for (var i = 0; i < icons.length; i++) {
                 if (icons[i].querySelector('i').dataset.key != currentWord) {
                     icons[i].classList.add('small');
                 }
             }
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
                 newDiv.classList.add('no-hint');
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
                     fullfilled += " " + currentWord;
                     var icons = document.querySelectorAll('.abc i');
                     for (var i = 0; i < icons.length; i++) {
                         if (icons[i].dataset.key == currentWord) {
                             icons[i].classList.add("done");
                         }
                     }
                     Cookies.set(kid, fullfilled, { expires: 7 });
                     return fullfilled;
                 }
             }
         }
     };
     var hints = function (el) {
         var dropzone = document.querySelectorAll('.dropzone');
         if (dropzone[0].classList.contains('no-hint')) {
             var url = "img/" + el.className.slice(9) + ".svg";
             el.style.color = "transparent";
             el.style.backgroundImage = "url(" + url + ")";
             for (var i = 0; i < dropzone.length; i++) {
                 console.log(i);
                 dropzone[i].classList.remove('no-hint');
             }
         } else {
             for (var i = 0; i < dropzone.length; i++) {
                 dropzone[i].classList.add('no-hint');
                 var url = el.style.backgroundImage.slice(0,4);
                 url = url.slice(url.length - 4);
                 el.style.backgroundImage = "none";
                 el.classList.add("flaticon-" + url);
                 el.classList.add("hidden");
                 el.style.color = "#2bb5c1";
             }
         }
     }
     //events handlers:
    settings.addEventListener("click", menuShow);
    puzzleIcon.addEventListener("click", puzzle);
    bulbIcon.addEventListener("click", function () {
        hints(this);
    });
    profilePic.addEventListener("click", welcomePage);
    
    //Database
    var lettersDb =
    {
        "a": {
        "aktor": "flaticon-charlie-chaplin",
            "auto": "flaticon-car",
            "arena": "flaticon-big-stadium",
            "ala": "flaticon-girl-5",
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

welcomePage();
});
