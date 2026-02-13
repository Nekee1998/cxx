/* ============================
   Page load animation
============================ */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.remove("not-loaded");
  }, 500);
});

/* ============================
   Envelope interaction logic
============================ */
document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("not-loaded")) {
    document.body.classList.remove("not-loaded");
    console.debug("[debug] Removed .not-loaded to reveal envelope early");
  }
  
  const envContainer = document.getElementById("envelope-container");
  if (envContainer) {
    envContainer.style.opacity = "1";
    envContainer.style.visibility = "visible";
    envContainer.style.display = "flex";
    envContainer.style.zIndex = "99999";
  }
  
  const envelope = document.getElementById("envelope");
  const choices  = document.getElementById("envelope-choices");
  const yesBtn   = document.getElementById("env-yes");
  const noBtn    = document.getElementById("env-no");
  const msg      = document.getElementById("envelope-message");

  if (!envelope || !choices || !msg) return;

  /* ---------- Open envelope ---------- */
  function openEnvelope() {
    if (envelope.classList.contains("open")) return;

    envelope.classList.add("open");
    envContainer?.classList.add("opened");
    envelope.classList.remove("closed");

    msg.innerHTML = '<span class="msg-heart" aria-hidden="true">🩵</span> ¡Qué hermoso! Aquí está tu invitación...';

    spawnHearts(20);
    spawnHeartsOutside(20);

    setTimeout(() => {
      choices.hidden = false;
      choices.classList.add("reveal");
      yesBtn?.focus();
    }, 600);
  }

  /* ---------- Close & reset ---------- */
  function closeChoices() {
    choices.classList.remove("reveal", "result");
    choices.hidden = true;
    envelope.classList.remove("open", "closed");
    envContainer?.classList.remove("opened");
    msg.innerHTML = '<span class="msg-heart" aria-hidden="true">🩵</span> Open me';
  }

  /* ---------- Click / keyboard ---------- */
  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  });

  msg.addEventListener("click", openEnvelope);
  msg.setAttribute("tabindex", "0");
  msg.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  });

  /* ---------- Heart burst helper ---------- */
  function spawnHearts(count = 12) {
    const burstRoot = document.getElementById('heart-burst') || envelope;
    const rect = envelope.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'heart-particle';
      p.textContent = ' 💗 ';

      const leftPct = 30 + Math.random() * 40;
      const offsetX = leftPct + '%';
      const bottomPx = 18 + Math.random() * 12;

      p.style.left = offsetX;
      p.style.bottom = bottomPx + 'px';

      const dur = 900 + Math.random() * 900;
      const delay = Math.random() * 120;
      p.style.animationDuration = dur + 'ms';
      p.style.animationDelay = delay + 'ms';

      burstRoot.appendChild(p);
      p.addEventListener('animationend', () => p.remove(), { once: true });
    }
  }

  /* FIXED Background hearts WITH WORKING BEATING */
  function spawnBackgroundHearts(count = 50) {
    const root = document.getElementById('bg-hearts') || document.body;
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    
    for (let i = 0; i < count; i++) {
      const h = document.createElement('span');
      h.className = 'bg-heart';
      h.textContent = '🩵';
      h.style.position = 'fixed';
      h.style.pointerEvents = 'none';
      h.style.zIndex = '1';

      const left = Math.random() * vw;
      const top = (vh * 0.18) + Math.random() * (vh * 0.68);
      h.style.left = Math.round(left) + 'px';
      h.style.top = Math.round(top) + 'px';

      const size = 1.5 + Math.random() * 1.5;
      h.style.fontSize = size + 'rem';
      
      // **THIS IS THE KEY** - Define named animations that exist in CSS
      const floatDur = 8 + Math.random() * 8;
      const beatDur = 0.8 + Math.random() * 0.4;
      h.style.animation = `float ${floatDur}s infinite ease-in-out, heartBeat ${beatDur}s infinite ease-in-out`;

      root.appendChild(h);

      // Fade in stagger
      setTimeout(() => {
        h.style.opacity = '0.4';
        h.style.color = '#87CEEB';
      }, i * 20);
    }
  }

  /* spawn hearts outside */
  function spawnHeartsOutside(count = 12) {
    const rect = envelope.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'heart-particle heart-particle--outer';
      p.textContent = '🩵 ';

      const jitterX = (Math.random() - 0.5) * (rect.width * 0.6);
      const startLeft = Math.round(centerX + jitterX);
      const startTop = Math.round(startY + (Math.random() - 0.2) * 30);

      p.style.left = startLeft + 'px';
      p.style.top = startTop + 'px';

      const tx = Math.round((Math.random() - 0.5) * 480);
      p.style.setProperty('--tx', tx + 'px');

      const dur = 1000 + Math.random() * 1400;
      const delay = Math.random() * 140;
      p.style.animationDuration = dur + 'ms';
      p.style.animationDelay = delay + 'ms';

      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove(), { once: true });
    }
  }

  /* ---------- FIXED YES BUTTON WITH WORKING FADE ---------- */
  yesBtn?.addEventListener("click", () => {
    choices.classList.remove("reveal");
    choices.classList.add("result");

    const prompt = choices.querySelector(".prompt");
    if (prompt) {
      prompt.textContent = "¡Gracias por abrir la invitación de Cecy! 💕";
    }

    envelope.classList.add("closed");
    
    // **FIXED**: Use class instead of inline styles
    document.body.classList.add('fade-out');

    setTimeout(() => {
      window.location.href = "invitation.html";
    }, 700);
  });

  noBtn?.addEventListener("click", closeChoices);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !choices.hidden) {
      closeChoices();
    }
  });

  // Spawn hearts ONCE at the end
  spawnBackgroundHearts(50);
});
