document.addEventListener("DOMContentLoaded", function () {

    //Variables
    var letterSpace = document.querySelector(".abc");
    var bigLetter = document.querySelector('h1.letter');
    var navMenu = document.querySelectorAll('footer h1');
    var settings = document.querySelector("header i");
    var shakeOrNot;
    var showLetter;
//    var letterMax = 10; //The user set the max length of letters in one word


    //Functions
    var loadPage = function (el) {
        bigLetter.innerText = el;
        var counter = 0;
        var toRemove = document.querySelectorAll('.abc p');
        if (toRemove != []) {
            for (var i = 0; i < toRemove.length; i++) {
                toRemove[i].parentNode.removeChild(toRemove[i]);
            }
        }
        for (var key in lettersDb[el]) {
            var icon = document.createElement("i");
            icon.classList.add(lettersDb[el][key]);
            icon.classList.add("hidden");
            icon.classList.add("is-paused");
            icon.addEventListener("click", letterTip);
            var paragraf = document.createElement("p");
            paragraf.appendChild(icon);
            letterSpace.appendChild(paragraf);
            icon.dataset.key = key;
            counter++;
        }
        var letters = document.querySelectorAll(".abc i");
        shakeOrNot();
        var count = 0;
        showLetter = function (e) {
            shakeOrNot();
            if (letters[count].classList.contains('is-paused')) {
                letters[count].classList.remove('is-paused');
            }
            count++;
            if (count == letters.length) {
                bigLetter.removeEventListener("click", showLetter);
                bigLetter.classList.remove("shake-slow");

            }
        };
        bigLetter.addEventListener("click", showLetter);
    };

    // Function for checking that it's worth to shake or not AND removes 'clicked' class
    shakeOrNot = function() {
        var letters = document.querySelectorAll(".abc i");
        if (bigLetter.classList.contains("clicked")) {
            removeTip(); //if clicked is sentenced to removed, tip ('em') will be also remove
            bigLetter.classList.remove("clicked");

        }
        if (letters.length > 0) {
            bigLetter.classList.add("shake-slow");
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
        if (document.querySelector("nav") != null) {
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
         console.log(toRemove);
         if (toRemove != null) {
             toRemove.parentNode.removeChild(toRemove);
         }
     };

    settings.addEventListener("click", menuShow);
    
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
            "cyklop": "flaticon-cyclops"
    },
        "cz": {
        "czapka": "flaticon-mortarboard"
    },
        "d": {
        "dym": "flaticon-nature",
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
            "gimbus": "flaticon-school-bus"
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
            "korona": "flaticon-crown"
    },
        "l": {
        "lew": "flaticon-lion",
            "lama": "flaticon-llama",
            "leniwiec": "flaticon-sloth"
    },
        "m": {
        "mumia": "flaticon-mummy-head-with-opened-eyes-for-halloween",
            "muzyka": "musical-pentagram-lines-with-music-notes",
            "mama": "flaticon-people-1",
            "myszka": "flaticon-computer-mouse",
            "medal": "flaticon-medal",
            "motyl": "flaticon-butterfly",
            "małpa": "flaticon-monkey",
            "mysz": "flaticon-mouse"
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
            "szop": "flaticon-racoon"
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
            "tukan": "flaticon-toucan"
    },
        "w": {
        "wąż": "flaticon-snake"
    },
        "z": {
        "znak": "flaticon-stop",
            "zamek": "flaticon-castle"
    },
        "ż": {
        "żuk": "flaticon-beetle",
            "żaba": "flaticon-frog",
            "żyrafa": "flaticon-giraffe"
    }
    };

    loadPage("m");
});

//988