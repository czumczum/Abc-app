"use strict";
document.addEventListener("DOMContentLoaded", function () {

    //Variables
    var letterSpace = document.querySelector(".abc");
    var bigLetter = document.querySelector('h1.letter');
    var navMenu = document.querySelector('footer');
    var settings = document.querySelector("header i");
    var puzzleDiv = document.querySelector('.puzzle');
    var puzzleIcon = document.querySelector('.flaticon-puzzle');
    var bulbIcon = document.querySelector('.flaticon-light-bulb');
    var helpIcon = document.querySelector('span.help');
    var profilePic = document.querySelector('header .kid');
    var bulbClass = "flaticon-light-bulb";
    var puzzleDel = function () {};
    var changeMe = function () {};
    var unchangeMe = function () {};
    var shakeOrNot = function () {};
    var swipeHint = function () {};
    var showLetter;
    var currentWord = "";
    var fullfilled = "";
    var kid;
    var answered;
    var voice = "Polish Female"; //choose the speaking voice
    //Swipe variables
    var touchStartCoords =  {'x':-1, 'y':-1}, // X and Y coordinates on mousedown or touchstart events.
        touchEndCoords = {'x':-1, 'y':-1},// X and Y coordinates on mouseup or touchend events.
        direction = 'undefined',// Swipe direction
        minDistanceXAxis = 30,// Min distance on mousemove or touchmove on the X axis
        maxDistanceYAxis = 30,// Max distance on mousemove or touchmove on the Y axis
        maxAllowedTime = 1000,// Max allowed time between swipeStart and swipeEnd
        startTime = 0,// Time on swipeStart
        elapsedTime = 0,// Elapsed time between swipeStart and swipeEnd
        targetElement = document.querySelector('main');// Element to delegate

    // Cookies
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
       //             unchangeMe();
                    currentWord = this.dataset.key;
                    responsiveVoice.speak(currentWord, voice);
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
        puzzleIcon.style.display = "none";
        swipeHint();
        createFooterMenu();
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
            bigLetter.removeChild(imgTip);
        }
    };
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
        responsiveVoice.speak("Wybierz swoją postać", voice);
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
         } else {
             word = this.dataset.key.slice(1);
         }
         var em = document.createElement('em');
         bigLetter.classList.add("clicked");
         bigLetter.appendChild(em);
         em.innerText = word;
         bigLetter.classList.remove("shake-slow");
        puzzleIcon.style.display = "inline-flex";

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
            var divs = puzzleDiv.querySelectorAll('.drag-drop');
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
                     },
                     ondragleave: function (event) {
                         // remove the drop feedback style
                         event.target.classList.remove('drop-target');
                         event.target.classList.remove('good');
                         event.relatedTarget.classList.remove('can-drop');
                         //          event.relatedTarget.textContent = 'Dragged out'; //dont need either
                     },
                     ondrop: function (event) { //Here the draggable element dissapears and the target changed to letter-inside
                         event.relatedTarget.style.color = "white";
                         event.relatedTarget.style.backgroundColor = "#2bb5c1";
                         event.relatedTarget.style.display = "none";
                         letter = event.target.dataset.letter;
                         event.target.textContent = letter;
                         event.target.style.backgroundColor = "#2bb5c1";
                         puzzleDone();
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
             hints(bulbIcon); //all puzzle will be start with no hint
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
                     if (fullfilled.indexOf(currentWord) < 0) {
                         fullfilled += " " + currentWord;
                         if (kid.indexOf('girl') >= 0) {
                             responsiveVoice.speak("Brawo, zdobyłaś punkt!", voice);
                         } else {
                             responsiveVoice.speak("Brawo, zdobyłeś punkt!", voice);
                         }
                     }
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
             var url = "img/" + bulbClass.slice(9) + ".svg";
             el.style.color = "transparent";
             console.log(url);
             el.style.backgroundImage = "url(" + url + ")";
             for (var i = 0; i < dropzone.length; i++) {
                 dropzone[i].classList.remove('no-hint');
             }
         } else {
             for (var i = 0; i < dropzone.length; i++) {
                 dropzone[i].classList.add('no-hint');
                 el.style.backgroundImage = "none";
                 el.classList.add(bulbClass);
                 el.classList.add("hidden");
                 el.style.color = "#2bb5c1";
             }
         }
     }
     var helpMe = function () { //finger point help with site's navigation
         var imgTip = document.createElement('img');
         var profileMenu = document.querySelector('.welcome');
         var letterMenu = document.querySelector('nav');
         var icon = document.querySelector('.abc p');
         var puzzleGame = document.querySelector('.drag-drop');
         imgTip.setAttribute('src', 'img/tap.svg');
         imgTip.classList.add('help-point');
         if (letterMenu != null && !letterMenu.classList.contains('none')) { //if nav is displayed
             letterMenu.style.position = "relative";
             letterMenu.querySelector('h1').appendChild(imgTip);
             responsiveVoice.speak("Wybierz którąś z liter", voice);
             window.setTimeout(function () { imgTip.parentNode.removeChild(imgTip) }, 5000)
             }
         else if (puzzleGame != null) {
             puzzleGame.style.position = "relative";
             puzzleGame.appendChild(imgTip);
             responsiveVoice.speak("Ułóż litery w odpowiedniej kolejności", voice);
             window.setTimeout(function () { imgTip.parentNode.removeChild(imgTip) }, 3000)
         }
         else if (bigLetter.classList.contains("clicked")) {
             puzzleIcon.style.position = "relative";
             puzzleIcon.appendChild(imgTip);
             responsiveVoice.speak("Kliknij na ikonę puzzli", voice);
             window.setTimeout(function () { imgTip.parentNode.removeChild(imgTip) }, 3000)
         }
         else if (icon != null) {
             icon.style.position = "relative";
             icon.appendChild(imgTip);
             responsiveVoice.speak("Kliknij na któryś z obrazków", voice);
             window.setTimeout(function () { imgTip.parentNode.removeChild(imgTip) }, 3000)
         }
         else if (!bigLetter.classList.contains("clicked") && bigLetter.style.display == "flex") {
             bigLetter.style.position = "relative";
             bigLetter.appendChild(imgTip);
             responsiveVoice.speak("Kliknij na literę", voice);
             window.setTimeout(function () { imgTip.parentNode.removeChild(imgTip) }, 3000)
         } else if (profileMenu != null && !profileMenu.classList.contains("none")) {
             profileMenu.querySelector('div').style.position = "relative";
             profileMenu.appendChild(imgTip);
             responsiveVoice.speak("Wybierz postać, którą będziesz grać", voice);
             window.setTimeout(function () { imgTip.parentNode.removeChild(imgTip) }, 3000)
         }
     };
     swipeHint = function () {
         var cookie = typeof Cookies.get('swipeHint');
         if (cookie == "undefined") {
             var swipe = document.createElement('img');
             swipe.setAttribute('src', 'img/pointing.svg');
             swipe.setAttribute("id", "swipeHint");
             document.querySelector('body').appendChild(swipe);
             responsiveVoice.speak("Przesuń palcem po ekranie, aby zmienić literę", voice);
             window.setTimeout(function() { swipe.style.transform = "translate(-60vh)";
                 window.setTimeout(function() { swipe.parentNode.removeChild(swipe) }, 1500)}, 1000);
         }
         var mq = window.matchMedia( "(min-width: 1024px)" );
         if (mq.matches) {
             Cookies.set('swipeHint', 'showed');
         }
         return
     }
    //Menu handling - Menu in the footer, visible only with wide screens ($thirDim: 1024px)
    var createFooterMenu = function () {
        var firstLetters = [];
        for (var key in lettersDb) {
            firstLetters.push(key);
        }
        for (var i = 0; i < firstLetters.length; i++) {
            var h1 = document.createElement('h1');
            navMenu.appendChild(h1);
            h1.innerText = firstLetters[i];
            h1.addEventListener("click", function () {
                var letter = this.innerText.toLowerCase();
                loadPage(letter);
            })
        }
    };

     //events handlers:
    settings.addEventListener("click", menuShow);
    puzzleIcon.addEventListener("click", puzzle);
    bulbIcon.addEventListener("click", function () {
        hints(this);
        console.log(fullfilled);
    });
    profilePic.addEventListener("click", welcomePage);
    helpIcon.addEventListener("click", helpMe);

    //Swipe avability
    var swipeMe = function (direction) {
        var puzzleGame = document.querySelector('.drag-drop');
        if (puzzleGame != null) {
            return
        }
        Cookies.set('swipeHint', 'showed');
        var arr = [];
        console.log(bigLetter.innerText.slice(0).toLowerCase());
        for (let key in lettersDb) {
            arr.push(key);
        }
        console.log(arr);
        if (direction == "left") {
            if (bigLetter.innerText.slice(0,1).toLowerCase() == arr[arr.length - 1]) {
                loadPage(arr[0]);
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == bigLetter.innerText.slice(0,1).toLocaleLowerCase()) {
                    return loadPage(arr[i + 1]) //end of function and retreive the letter
                }
            }
        } else {
            if (bigLetter.innerText.slice(0,1).toLowerCase() == arr[0]) {
                loadPage(arr[arr.length - 1]);
            }
            for (var i = arr.length - 1; i >= 0; i--) {
                if (arr[i] == bigLetter.innerText.slice(0,1).toLocaleLowerCase()) {
                    return loadPage(arr[i - 1]) //end of function and retreive the letter
                }
            }
        }
    }
    function swipeStart(e) {
        e = e ? e : window.event;
        e = ('changedTouches' in e)?e.changedTouches[0] : e;
        touchStartCoords = {'x':e.pageX, 'y':e.pageY};
        startTime = new Date().getTime();
    }
    function swipeMove(e){
        e = e ? e : window.event;
        e.preventDefault();
    }
    function swipeEnd(e) {
        e = e ? e : window.event;
        e = ('changedTouches' in e)?e.changedTouches[0] : e;
        touchEndCoords = {'x':e.pageX - touchStartCoords.x, 'y':e.pageY - touchStartCoords.y};
        elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime <= maxAllowedTime){
            if (Math.abs(touchEndCoords.x) >= minDistanceXAxis && Math.abs(touchEndCoords.y) <= maxDistanceYAxis){
                direction = (touchEndCoords.x < 0)? 'left' : 'right';
                switch(direction){
                    case 'left':
                        swipeMe('left');
                        break;
                    case 'right':
                        swipeMe('right');
                        break;
                }
            }
        }
    }
    function addMultipleListeners(el, s, fn) {
        var evts = s.split(' ');
        for (var i=0, iLen=evts.length; i<iLen; i++) {
            el.addEventListener(evts[i], fn, false);
        }
    }

    addMultipleListeners(targetElement, 'touchstart', swipeStart);
    addMultipleListeners(targetElement, 'touchmove', swipeMove);
    addMultipleListeners(targetElement, 'touchend', swipeEnd);

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
