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
				if(page%2==0){
					var next=page+1;
					var video = document.querySelector("#page"+page+" video");
					if (video) {
                        video.play();
                    }else if(document.querySelector("#page"+next+" video")){
						video.play();
					}
				}else{
					var prev=page-1;
					var video = document.querySelector("#page"+page+" video");
					if (video) {
                        video.play();
                    }else if(document.querySelector("#page"+prev+" video")){
						document.querySelector("#page"+prev+" video").play();
					}
				}
                // Check if the page contains the video
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
