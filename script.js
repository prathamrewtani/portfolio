// ========= TILT EFFECT =========
const tiltContainer = document.querySelector(".tilt-container");
const tiltInner = document.querySelector(".tilt-inner");

if (tiltContainer) {
  let mouseX = 0,
    mouseY = 0;
  let currentX = 0,
    currentY = 0;
  let rafId;

  tiltContainer.addEventListener("mousemove", (e) => {
    const rect = tiltContainer.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;

    if (!rafId) {
      rafId = requestAnimationFrame(updateTilt);
    }
  });

  tiltContainer.addEventListener("mouseleave", () => {
    mouseX = 0;
    mouseY = 0;

    if (!rafId) {
      rafId = requestAnimationFrame(updateTilt);
    }
  });

  function updateTilt() {
    const ease = 0.1;
    currentX += (mouseX - currentX) * ease;
    currentY += (mouseY - currentY) * ease;

    tiltInner.style.transform = `perspective(1000px) rotateX(${
      currentY * -10
    }deg) rotateY(${currentX * 10}deg)`;

    if (
      Math.abs(currentX - mouseX) > 0.001 ||
      Math.abs(currentY - mouseY) > 0.001
    ) {
      rafId = requestAnimationFrame(updateTilt);
    } else {
      rafId = null;
    }
  }
}

// ========= VIDEO CONTROLS FOR HORIZONTAL SCROLL =========
document.addEventListener("DOMContentLoaded", () => {
  // Handle horizontal scroll videos
  const horizontalCards = document.querySelectorAll(".showcase-section .card");

  horizontalCards.forEach((card) => {
    const video = card.querySelector("video");
    const muteBtn = card.querySelector(".mute-btn");
    const videoContainer = card.querySelector(".video-container");

    if (!video) return;

    // Initialize video as paused
    video.pause();
    video.currentTime = 0;
    videoContainer.classList.add("video-paused");
    videoContainer.classList.remove("video-playing");

    // Click to play/pause
    videoContainer.addEventListener("click", (e) => {
      if (e.target === muteBtn) return; // Don't interfere with mute button

      if (video.paused) {
        video
          .play()
          .then(() => {
            videoContainer.classList.remove("video-paused");
            videoContainer.classList.add("video-playing");
          })
          .catch((err) => {
            console.log("Play failed:", err);
            // Fallback: mute and try
            video.muted = true;
            video
              .play()
              .then(() => {
                videoContainer.classList.remove("video-paused");
                videoContainer.classList.add("video-playing");
              })
              .catch(console.error);
          });
      } else {
        video.pause();
        videoContainer.classList.remove("video-playing");
        videoContainer.classList.add("video-paused");
      }
    });

    // Mute/Unmute button
    if (muteBtn) {
      muteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? "🔇" : "🔊";
      });

      // Set initial state
      muteBtn.textContent = video.muted ? "🔇" : "🔊";
    }

    // Update play/pause classes on video events
    video.addEventListener("play", () => {
      videoContainer.classList.remove("video-paused");
      videoContainer.classList.add("video-playing");
    });

    video.addEventListener("pause", () => {
      videoContainer.classList.remove("video-playing");
      videoContainer.classList.add("video-paused");
    });

    video.addEventListener("ended", () => {
      video.currentTime = 0;
      videoContainer.classList.remove("video-playing");
      videoContainer.classList.add("video-paused");
    });
  });

  // Handle breakdown section videos
  const breakdownCards = document.querySelectorAll(".breakdown-card");

  breakdownCards.forEach((card) => {
    const video = card.querySelector("video");
    const muteBtn = card.querySelector(".breakdown-mute-btn");
    const videoContainer = card.querySelector(".breakdown-video");

    if (!video) return;

    // Initialize video as paused
    video.pause();
    video.currentTime = 0;
    videoContainer.classList.add("video-paused");
    videoContainer.classList.remove("video-playing");

    // Click to play/pause
    videoContainer.addEventListener("click", (e) => {
      if (e.target === muteBtn) return;

      if (video.paused) {
        video
          .play()
          .then(() => {
            videoContainer.classList.remove("video-paused");
            videoContainer.classList.add("video-playing");
          })
          .catch((err) => {
            console.log("Play failed:", err);
            video.muted = true;
            video
              .play()
              .then(() => {
                videoContainer.classList.remove("video-paused");
                videoContainer.classList.add("video-playing");
              })
              .catch(console.error);
          });
      } else {
        video.pause();
        videoContainer.classList.remove("video-playing");
        videoContainer.classList.add("video-paused");
      }
    });

    // Mute/Unmute button
    if (muteBtn) {
      muteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? "🔇" : "🔊";
      });

      muteBtn.textContent = video.muted ? "🔇" : "🔊";
    }

    // Update play/pause classes
    video.addEventListener("play", () => {
      videoContainer.classList.remove("video-paused");
      videoContainer.classList.add("video-playing");
    });

    video.addEventListener("pause", () => {
      videoContainer.classList.remove("video-playing");
      videoContainer.classList.add("video-paused");
    });

    video.addEventListener("ended", () => {
      video.currentTime = 0;
      videoContainer.classList.remove("video-playing");
      videoContainer.classList.add("video-paused");
    });
  });
});

// ========= HORIZONTAL SCROLL WITH MOMENTUM =========
const horizontalScroll = document.querySelector(".horizontal-scroll");
if (horizontalScroll) {
  let isDown = false;
  let startX;
  let scrollLeft;

  const events = {
    mouse: {
      down: "mousedown",
      move: "mousemove",
      up: ["mouseup", "mouseleave"],
    },
    touch: {
      down: "touchstart",
      move: "touchmove",
      up: ["touchend", "touchcancel"],
    },
  };

  function startDrag(e) {
    isDown = true;
    horizontalScroll.classList.add("dragging");
    startX = (e.pageX || e.touches[0].pageX) - horizontalScroll.offsetLeft;
    scrollLeft = horizontalScroll.scrollLeft;
  }

  function drag(e) {
    if (!isDown) return;
    e.preventDefault();
    const x = (e.pageX || e.touches[0].pageX) - horizontalScroll.offsetLeft;
    const walk = (x - startX) * 2;
    horizontalScroll.scrollLeft = scrollLeft - walk;
  }

  function endDrag() {
    isDown = false;
    horizontalScroll.classList.remove("dragging");
  }

  // Mouse events
  horizontalScroll.addEventListener(events.mouse.down, startDrag);
  horizontalScroll.addEventListener(events.mouse.move, drag);
  events.mouse.up.forEach((evt) => {
    horizontalScroll.addEventListener(evt, endDrag);
  });

  // Touch events
  horizontalScroll.addEventListener(events.touch.down, startDrag);
  horizontalScroll.addEventListener(events.touch.move, drag);
  events.touch.up.forEach((evt) => {
    horizontalScroll.addEventListener(evt, endDrag);
  });
}

// ========= BREAKDOWN SECTION SCROLL ANIMATIONS =========
const breakdownCards = document.querySelectorAll(".breakdown-card");
const breakdownObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -100px 0px",
  }
);

breakdownCards.forEach((card) => {
  breakdownObserver.observe(card);
});

// ========= PAUSE ALL VIDEOS ON SCROLL =========
window.addEventListener("scroll", () => {
  // Pause horizontal scroll videos
  document.querySelectorAll(".showcase-section video").forEach((video) => {
    if (!video.paused) {
      video.pause();
      const container = video.closest(".video-container");
      if (container) {
        container.classList.remove("video-playing");
        container.classList.add("video-paused");
      }
    }
  });

  // Pause breakdown videos
  document.querySelectorAll(".breakdown-video video").forEach((video) => {
    if (!video.paused) {
      video.pause();
      const container = video.closest(".breakdown-video");
      if (container) {
        container.classList.remove("video-playing");
        container.classList.add("video-paused");
      }
    }
  });
});

function sendMail() {
  let params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("project").value,
    time: new Date().toLocaleString(),
  };

  emailjs
    .send("service_76bjicp", "template_pklxfm9", params)
    .then(() => {
      alert("Email sent successfully!");
    })
    .catch((error) => {
      console.error("FAILED...", error);
      alert("Email failed");
    });
}
