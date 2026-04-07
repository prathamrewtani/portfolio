// ================= GLOBAL VIDEO TRACK =================
let activeVideo = null;

function updateInactiveVideos(active) {
  document.querySelectorAll(".video-container").forEach(container => {
    const vid = container.querySelector("video");

    if (!active || vid === active) {
      container.classList.remove("inactive");
    } else {
      container.classList.add("inactive");
    }
  });
}

// ================= DOM READY =================
document.addEventListener("DOMContentLoaded", () => {

  // ========= CONTACT FORM =========
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      sendMail();
    });
  }

  // ========= VIDEO CONTROL (SCROLL SECTION) =========
  document.querySelectorAll(".video-container").forEach(container => {
    const video = container.querySelector("video");
    const btn = container.querySelector(".mute-btn");

    if (!video) return;

    // Default state
    video.pause();
    video.currentTime = 0;
    container.classList.add("video-paused");

    // ✅ FIXED CLICK LOGIC (no nesting)
    container.addEventListener("click", () => {

      // Pause previous video
      if (activeVideo && activeVideo !== video) {
        activeVideo.pause();
        activeVideo.muted = true;

        const oldContainer = activeVideo.closest(".video-container");
        oldContainer.classList.remove("video-playing");
        oldContainer.classList.add("video-paused");

        const oldBtn = oldContainer.querySelector(".mute-btn");
        if (oldBtn) oldBtn.textContent = "🔇";
      }

      // Toggle play/pause
      if (video.paused) {
        video.play().catch(() => {});
        activeVideo = video;
        updateInactiveVideos(video);
      } else {
        video.pause();
        activeVideo = null;
      }
    });

    // ========= MUTE BUTTON =========
    btn?.addEventListener("click", (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      btn.textContent = video.muted ? "🔇" : "🔊";
    });

    // ========= SYNC STATES =========
    video.addEventListener("play", () => {
      container.classList.add("video-playing");
      container.classList.remove("video-paused");
    });

    video.addEventListener("pause", () => {
      container.classList.add("video-paused");
      container.classList.remove("video-playing");
    });

    video.addEventListener("ended", () => {
      video.currentTime = 0;
      container.classList.add("video-paused");
      container.classList.remove("video-playing");
    });
  });

  // ========= BREAKDOWN VIDEOS =========
  document.querySelectorAll(".breakdown-video").forEach(container => {
    const video = container.querySelector("video");
    const btn = container.querySelector(".breakdown-mute-btn");

    if (!video) return;

    video.pause();
    container.classList.add("video-paused");

    container.addEventListener("click", (e) => {
      if (e.target === btn) return;

      if (video.paused) {
        video.play().catch(() => {});
        container.classList.add("video-playing");
        container.classList.remove("video-paused");
      } else {
        video.pause();
        container.classList.add("video-paused");
        container.classList.remove("video-playing");
      }
    });

    btn?.addEventListener("click", (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      btn.textContent = video.muted ? "🔇" : "🔊";
    });
  });

});

// ================= SCROLL AUTO-PAUSE =================
let scrollTimeout;

window.addEventListener("scroll", () => {
  clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {

    document.querySelectorAll("video").forEach(video => {
      video.pause();

      const container = video.closest(".video-container, .breakdown-video");

      if (container) {
        container.classList.remove("video-playing");
        container.classList.add("video-paused");
      }

      const btn = container?.querySelector(".mute-btn, .breakdown-mute-btn");
      if (btn) btn.textContent = "🔇";
    });

    activeVideo = null;

  }, 150);
});

// ================= TILT EFFECT =================
const tiltContainer = document.querySelector(".tilt-container");
const tiltInner = document.querySelector(".tilt-inner");

if (tiltContainer && tiltInner) {
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;
  let rafId;

  tiltContainer.addEventListener("mousemove", (e) => {
    const rect = tiltContainer.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;

    if (!rafId) rafId = requestAnimationFrame(updateTilt);
  });

  tiltContainer.addEventListener("mouseleave", () => {
    mouseX = 0;
    mouseY = 0;
    if (!rafId) rafId = requestAnimationFrame(updateTilt);
  });

  function updateTilt() {
    const ease = 0.1;
    currentX += (mouseX - currentX) * ease;
    currentY += (mouseY - currentY) * ease;

    tiltInner.style.transform = `
      perspective(1000px)
      rotateX(${currentY * -10}deg)
      rotateY(${currentX * 10}deg)
    `;

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

// ================= HORIZONTAL DRAG SCROLL =================
const horizontalScroll = document.querySelector(".horizontal-scroll");

if (horizontalScroll) {
  let isDown = false;
  let startX;
  let scrollLeft;

  function startDrag(e) {
    isDown = true;
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
  }

  horizontalScroll.addEventListener("mousedown", startDrag);
  horizontalScroll.addEventListener("mousemove", drag);
  horizontalScroll.addEventListener("mouseup", endDrag);
  horizontalScroll.addEventListener("mouseleave", endDrag);

  horizontalScroll.addEventListener("touchstart", startDrag);
  horizontalScroll.addEventListener("touchmove", drag);
  horizontalScroll.addEventListener("touchend", endDrag);
}

// ================= EMAIL =================
function sendMail() {
  let params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("project").value,
    time: new Date().toLocaleString(),
  };

  emailjs
    .send("service_76bjicp", "template_pklxfm9", params)
    .then(() => alert("Email sent successfully!"))
    .catch(() => alert("Email failed"));
}