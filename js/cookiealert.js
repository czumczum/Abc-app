(function() {
    var container = document.createElement('div');

    container.setAttribute('id', 'cookieinfo');
    container.setAttribute('class', 'cookie-alert');
    container.innerHTML = '<h6>Ta strona wykorzystuje pliki cookie</h6>' +
        '<p>Używamy informacji zapisanych za pomocą plików cookies w celu poprawnego funkcjonowania aplikacji , m.in. pomagają one w zapisywaniu stanu punktowego poszczególnych postaci.' +
        ' Mogą też korzystać z nich współpracujące z nami firmy badawcze oraz reklamowe.' +
        'Dalsze korzystanie ze strony oznacza wyrażenie zgody na ich wykorzystywanie. ' +
        'Jeśli nie wyrażasz zgody, ustawienia dotyczące plików cookies możesz zmienić w swojej przeglądarce.</p>' +
        '<h6>Kliknij aby zamknąć, komunikat nie pojawi się ponownie.</h6>';

    document.body.appendChild(container);
    var eatThatCookie = function () {
        var cookie = typeof Cookies.get('cookiesInfo');
        if (cookie !== "undefined") {
            return container.style.display = "none";
        } else {
            return Cookies.set('cookiesInfo', 'showed');
        }
    };
    container.addEventListener("click", function () {
        container.style.display = "none";
    })
    return eatThatCookie();
})();