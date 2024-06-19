document.addEventListener("DOMContentLoaded", function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;

    document.getElementById("next").addEventListener("click", function() {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.add("active");
    });

    document.getElementById("prev").addEventListener("click", function() {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        slides[currentSlide].classList.add("active");
    });
});
		function playAudio(audioId) {
            var audio = document.getElementById(audioId);
            //audio.play();
			if (audio.innerHTML == "🔊") {
				audio.pause();
				audio.innerHTML = "🔇";
			} else{
				audio.play().catch(error => {
					console.log('Background music play failed:', error);
				});
				audio.innerHTML = "🔊";
			}
        }