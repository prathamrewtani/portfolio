function fadeVolume(video, target = 1, duration = 300) {
  const start = video.volume;
  const change = target - start;
  const startTime = performance.now();

  function animate(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    video.volume = start + change * progress;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

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

    video.pause();
    video.currentTime = 0;
    container.classList.add("video-paused");

    container.addEventListener("click", () => {

      document.querySelectorAll(".video-container video").forEach(v => {
        if (v !== video) {
          v.pause();
          v.muted = true;

          const c = v.closest(".video-container");
          c.classList.remove("video-playing");
          c.classList.add("video-paused");

          const muteBtn = c.querySelector(".mute-btn");
          if (muteBtn) muteBtn.textContent = "🔇";
        }
      });

      if (video.paused) {
        video.muted = false;
        video.volume = 0;
        video.play().catch(() => {});

        fadeVolume(video, 1, 400);

        if (btn) btn.textContent = "🔊";

        activeVideo = video;
        updateInactiveVideos(video);

      } else {
        video.pause();

        if (btn) btn.textContent = "🔇";

        activeVideo = null;
        updateInactiveVideos(null);
      }
    });

    btn?.addEventListener("click", (e) => {
  e.stopPropagation();
  video.muted = !video.muted;
  btn.textContent = video.muted ? "🔇" : "🔊";
});

// ✅ PLAY STATE
video.addEventListener("play", () => {
  container.classList.add("video-playing");
  container.classList.remove("video-paused");
});

// ✅ PAUSE STATE
video.addEventListener("pause", () => {
  container.classList.add("video-paused");
  container.classList.remove("video-playing");
});

// ✅ END STATE
video.addEventListener("ended", () => {
  video.currentTime = 0;
  container.classList.add("video-paused");
  container.classList.remove("video-playing");
});

// 🔥 LOADING STATE (PUT HERE ONLY ONCE)
video.addEventListener("waiting", () => {
  container.classList.add("loading");
});

video.addEventListener("playing", () => {
  container.classList.remove("loading");
});
  });

  // ========= BREAKDOWN VIDEOS (FIXED CLEAN VERSION) =========
  document.querySelectorAll(".breakdown-video").forEach(container => {
    const video = container.querySelector("video");
    const btn = container.querySelector(".breakdown-mute-btn");
    const fsBtn = container.querySelector(".fullscreen-btn");

    if (!video) return;

    video.pause();
    container.classList.add("video-paused");

    container.addEventListener("click", (e) => {
      if (e.target === btn || e.target === fsBtn) return;

      document.querySelectorAll(".breakdown-video video").forEach(v => {
        if (v !== video) {
          v.pause();
          const c = v.closest(".breakdown-video");
          c.classList.remove("video-playing");
          c.classList.add("video-paused");

          const b = c.querySelector(".breakdown-mute-btn");
          if (b) b.textContent = "🔇";
        }
      });

      if (video.paused) {
        video.muted = false;
        video.play().catch(() => {});
        container.classList.add("video-playing");
        container.classList.remove("video-paused");
        if (btn) btn.textContent = "🔊";
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

    fsBtn?.addEventListener("click", (e) => {
      e.stopPropagation();

      video.controls = true;

      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }

      video.muted = false;
      video.play().catch(() => {});
    });
  });

});

// ================= FULLSCREEN CONTROL =================
document.addEventListener("fullscreenchange", () => {
  document.querySelectorAll(".breakdown-video").forEach(container => {
    const video = container.querySelector("video");

    if (document.fullscreenElement === video) {
      // ✅ Enter fullscreen
      container.classList.add("fullscreen");
      video.controls = true;
    } else {
      // ❌ Exit fullscreen
      container.classList.remove("fullscreen");
      video.controls = false;
    }
  });
});

// ================= SCROLL AUTO-PAUSE =================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;

    if (!entry.isIntersecting) {
      video.pause();

      const container = video.closest(".video-container, .breakdown-video");
      container?.classList.remove("video-playing");
      container?.classList.add("video-paused");

      const btn = container?.querySelector(".mute-btn, .breakdown-mute-btn");
      if (btn) btn.textContent = "🔇";
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll("video").forEach(video => {
  observer.observe(video);
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

