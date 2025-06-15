document.addEventListener('DOMContentLoaded', () => {

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('close')
  });
  document.querySelector('body').addEventListener('scroll', () => {
    let header = document.querySelector('header')
    let rect = header.getBoundingClientRect()
    const bottom = Math.floor((rect.bottom / window.innerHeight) * 100)
    if (bottom < 80) {
      navLinks.classList.remove('active');
      hamburger.classList.remove('close')
    }
  })

  const heroTexts = [
    "Beyond the Frame.<br>Beyond the Moment.",
    "Your Story.<br>Reimagined in 360 VR.",
  ];

  let heroTextIndex = 0;
  const heroTextElement = document.getElementById('hero-text');
  heroTextElement.innerHTML = heroTexts[heroTextIndex];

  const updateHeroText = () => {
    heroTextElement.classList.add('fade-out');

    setTimeout(() => {
      heroTextIndex = (heroTextIndex + 1) % heroTexts.length;
      heroTextElement.innerHTML = heroTexts[heroTextIndex];
      heroTextElement.classList.remove('fade-out');
    }, 500);
  };

  setInterval(updateHeroText, 5000);

  const video = document.getElementById('bannerVideo');
  video.play();


  let container = document.getElementById('panorama-container')
  const immersive = "https://okomobucket.s3.ap-south-1.amazonaws.com/inputs/Img1737361996965.mp4";
  const panorama = new PANOLENS.VideoPanorama(immersive, {
    loop: true,
    muted: false,
    autoplay: false,
    playsinline: true,
    crossOrigin: "anonymous",
  });

  viewer = new PANOLENS.Viewer({
    container: container,
    autoRotate: false,
    controlBar: true,
    autoplay: true,
    cameraFov: 75,
    controlButtons: ["fullscreen"],
    viewIndicator: true
  });
  panorama.unmuteVideo()
  viewer.add(panorama);
  viewer.mode = 0;
  // console.log(viewer.controls[0].keys)
  // console.log(panorama.isVideoMuted())

  let playBtn = document.getElementById("playBtn");
  playBtn.addEventListener("click", () => {
    if (panorama.isVideoPaused()) {
      panorama.playVideo();
      panorama.unmuteVideo()
      playBtn.classList.add("played")
    } else {
      panorama.pauseVideo();
      playBtn.classList.remove("played")
    }
  })
  function playImmersive() {
    panorama.playVideo();
    panorama.unmuteVideo()
    playBtn.classList.add("played")
  }
  function stopImmersive() {
    panorama.pauseVideo();
    playBtn.classList.remove("played")
  }

  document.querySelector('body').addEventListener('scroll', () => {
    let philosophy = document.getElementById('philosophy');
    const rect = philosophy.getBoundingClientRect()
    const top = Math.floor((rect.top / window.innerHeight) * 100)
    if (top < 10 && top > -90) {
      playImmersive()
    }
    else if (top < -90) {
      stopImmersive()
    }
    else if (top > 10) {
      stopImmersive()
    }
  })

  let intervalId;

  function simulateKeyDown(key, code, keyCode) {
    const event = new KeyboardEvent('keydown', {
      key,
      code,
      keyCode,
      which: keyCode,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  function startMovingLeft() {
    simulateKeyDown('ArrowLeft', 'ArrowLeft', 37);
    intervalId = setInterval(() => simulateKeyDown('ArrowLeft', 'ArrowLeft', 37), 100);
  }

  function startMovingRight() {
    simulateKeyDown('ArrowRight', 'ArrowRight', 39);
    intervalId = setInterval(() => simulateKeyDown('ArrowRight', 'ArrowRight', 39), 100);
  }

  function stopMoving() {
    clearInterval(intervalId);
  }

  document.getElementById("move-left").addEventListener("mousedown", startMovingLeft);
  document.getElementById("move-left").addEventListener("mouseup", stopMoving);
  document.getElementById("move-left").addEventListener("mouseleave", stopMoving);

  document.getElementById("move-right").addEventListener("mousedown", startMovingRight);
  document.getElementById("move-right").addEventListener("mouseup", stopMoving);
  document.getElementById("move-right").addEventListener("mouseleave", stopMoving);

});

const form = document.forms['submit-to-google-sheet'];
const scriptURL = "https://script.google.com/macros/s/AKfycbzzzAHqYvQtxDpUHYrR7Jqn1iBhBwGPzt7usMe-lCG5zfC1DkmsLsDGNPw6vcmg4DvKiA/exec"
form.addEventListener('submit', e => {
  e.preventDefault();
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => {
      let message = document.getElementById("service-type") ? document.getElementById("service-type").value : "No message";
      console.log('Success!', response);
      // console.log(message);
      showAlert("Successfully Added your query about", message);
      formClear();
    })
    .catch(error => {
      console.error('Error!', error.message);
      submitButton.disabled = false;
    });

  form.addEventListener('reset', () => {
    submitButton.disabled = false;
  });
});

function formClear() {
  document.getElementById("contactForm").reset();
}

function showAlert(response, message) {
  var customAlert = document.getElementById('customAlert');
  var customAlertMessage = document.getElementById('customAlertMessage');

  customAlertMessage.innerText = response + "--" + message;
  customAlert.classList.add('show');

  setTimeout(function () {
    customAlert.classList.remove('show');
  }, 4000);
}