$(document).ready(function() {
    $('#scrapbook').turn({
        width: 800,
        height: 600,
        autoCenter: true
    });

    function updatePageAndArrows(page) {
        const totalPages = $('#scrapbook').turn('pages');

        $('#prevArrow').css('pointer-events', page <= 1 ? 'none' : 'auto');
        $('#prevArrow').css('color', page <= 1 ? 'grey' : '#007BFF');
        $('#nextArrow').css('pointer-events', page >= totalPages ? 'none' : 'auto');
        $('#nextArrow').css('color', page >= totalPages ? 'grey' : '#007BFF');
    }

    function turnLeft() {
        $('#scrapbook').turn('previous');
    }

    function turnRight() {
        $('#scrapbook').turn('next');
    }

    $('#scrapbook').bind('turned', function(event, page, view) {
        updatePageAndArrows(page);
    });

    const initialPage = $('#scrapbook').turn('page');
    updatePageAndArrows(initialPage);

    $('#prevArrow').click(turnLeft);
    $('#nextArrow').click(turnRight);
});
