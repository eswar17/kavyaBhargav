$(document).ready(function() {
    $('#scrapbook').turn({
        width: 680,
        height: 340,
        autoCenter: true,
		gradients: true, 
		acceleration: true,
		duration: 1000,
        elevation: 50,
		when: {
            turned: function(event, page, view) {
                console.log("Turned to page: " + page);
                
				$("video").each(function() {
                    this.pause();
                });
				
                // Check if the page contains the video
                if (page == 12) {
                    var video = document.querySelector("#page12 video");
                    if (video) {
                        video.play();
                    }
                }else if (page == 14) {
                    var video = document.querySelector("#page14 video");
                    if (video) {
                        video.play();
                    }
                }else if (page == 15) {
                    var video = document.querySelector("#page14 video");
                    if (video) {
                        video.play();
                    }
                }else if (page == 13) {
                    var video = document.querySelector("#page12 video");
                    if (video) {
                        video.play();
                    }
                }
            }
        }
    });

    function updatePageAndArrows(page) {
        const totalPages = $('#scrapbook').turn('pages');

        $('#prevArrow').css('pointer-events', page <= 1 ? 'none' : 'auto');
        $('#prevArrow').css('display', page <= 1 ? 'none' : 'block');
        $('#prevArrow').css('color', page <= 1 ? 'grey' : '#007BFF');
        $('#nextArrow').css('pointer-events', page >= totalPages ? 'none' : 'auto');
        $('#nextArrow').css('display', page >= totalPages ? 'none' : 'block');
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
	
	$("#flipbook").bind("zooming", function(event,  newZoomValue, currentZoomValue) {
		alert("New zoom: "+currentZoomValue);
	});

    const initialPage = $('#scrapbook').turn('page');
    updatePageAndArrows(initialPage);

    $('#prevArrow').click(turnLeft);
    $('#nextArrow').click(turnRight);
});
