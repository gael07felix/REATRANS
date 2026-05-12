/**
 * Modo escuro: classe theme-dark no html + localStorage (reatrans-theme).
 */
(function () {
  "use strict";

  var THEME_KEY = "reatrans-theme";
  var root = document.documentElement;

  function getTheme() {
    try {
      var v = localStorage.getItem(THEME_KEY);
      if (v === "dark" || v === "light") return v;
    } catch (e) {
      /* ignore */
    }
    return "light";
  }

  function syncToggleButton() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var dark = root.classList.contains("theme-dark");
    btn.setAttribute("aria-pressed", dark ? "true" : "false");
    btn.setAttribute("aria-label", dark ? "Ativar modo claro" : "Ativar modo escuro");
    btn.setAttribute("title", dark ? "Modo claro" : "Modo escuro");
  }

  function applyTheme(mode) {
    if (mode === "dark") root.classList.add("theme-dark");
    else root.classList.remove("theme-dark");
    try {
      localStorage.setItem(THEME_KEY, mode);
    } catch (e) {
      /* ignore */
    }
    syncToggleButton();
  }

  applyTheme(getTheme());

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("theme-toggle");
    syncToggleButton();
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = root.classList.contains("theme-dark") ? "light" : "dark";
      applyTheme(next);
      var status = document.getElementById("sr-status");
      if (status) {
        status.textContent = next === "dark" ? "Modo escuro ativado." : "Modo claro ativado.";
      }
    });
  });
})();

/**
 * Mobile: ícones tema/a11y dentro da pílula. Desktop: fora da pílula (irmãos no cluster).
 * Um único .hero__header-tools no DOM; posição ajustada ao breakpoint.
 */
(function () {
  "use strict";

  var MQ = "(max-width: 52rem)";

  function syncHeaderToolsPlacement() {
    var cluster = document.querySelector(".hero__header-cluster");
    var pill = document.querySelector(".hero__nav-pill");
    var tools = document.querySelector(".hero__header-tools");
    var menuToggle = document.getElementById("hero-menu-toggle");
    if (!cluster || !pill || !tools || !menuToggle) return;

    var mq = window.matchMedia(MQ);
    if (mq.matches) {
      if (tools.parentNode !== pill) {
        pill.insertBefore(tools, menuToggle);
      }
    } else if (tools.parentNode !== cluster) {
      cluster.appendChild(tools);
    }
  }

  document.addEventListener("DOMContentLoaded", syncHeaderToolsPlacement);

  var mqTools = window.matchMedia(MQ);
  if (typeof mqTools.addEventListener === "function") {
    mqTools.addEventListener("change", syncHeaderToolsPlacement);
  } else if (typeof mqTools.addListener === "function") {
    mqTools.addListener(syncHeaderToolsPlacement);
  }
})();

/**
 * Menu principal (mobile): botão hambúrguer, overlay e fecho por Escape / backdrop / link.
 */
(function () {
  "use strict";

  var MQ = "(max-width: 52rem)";

  document.addEventListener("DOMContentLoaded", function () {
    var cluster = document.querySelector(".hero__header-cluster");
    var toggle = document.getElementById("hero-menu-toggle");
    var menu = document.getElementById("hero-main-menu");
    if (!cluster || !toggle || !menu) return;

    var backdrop = menu.querySelector(".hero__menu-backdrop");
    var linkEls = menu.querySelectorAll(".hero__menu-links a[href]");
    var mq = window.matchMedia(MQ);

    function setOpen(open) {
      cluster.classList.toggle("is-menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute(
        "aria-label",
        open ? "Fechar menu de navegação" : "Abrir menu de navegação"
      );
      document.body.style.overflow = open ? "hidden" : "";
    }

    function isOpen() {
      return cluster.classList.contains("is-menu-open");
    }

    function closeIfWide() {
      if (!mq.matches && isOpen()) {
        cluster.classList.remove("is-menu-open");
        document.body.style.overflow = "";
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu de navegação");
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setOpen(false);
      });
    }

    linkEls.forEach(function (a) {
      a.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !isOpen()) return;
      setOpen(false);
      toggle.focus();
    });

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", closeIfWide);
    } else if (typeof mq.addListener === "function") {
      mq.addListener(closeIfWide);
    }
  });
})();

/**
 * Preferência persistida de tamanho de texto (níveis definidos em CSS em html.font-step-*).
 * Estado guardado em localStorage.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "reatrans-a11y-prefs";
  var MAX_FONT_STEP = 5;
  var MIN_FONT_STEP = 0;

  var root = document.documentElement;

  function getState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { fontStep: 0 };
      var parsed = JSON.parse(raw);
      return {
        fontStep: typeof parsed.fontStep === "number" ? parsed.fontStep : 0,
      };
    } catch (e) {
      return { fontStep: 0 };
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore quota / private mode */
    }
  }

  function applyFontStep(step) {
    root.classList.remove(
      "font-step-1",
      "font-step-2",
      "font-step-3",
      "font-step-4",
      "font-step-5"
    );
    if (step > 0) {
      root.classList.add("font-step-" + step);
    }
  }

  function applyAll(state) {
    var s = state || getState();
    s.fontStep = Math.min(MAX_FONT_STEP, Math.max(MIN_FONT_STEP, s.fontStep));
    root.classList.remove("theme-high-contrast", "theme-easy-read");
    applyFontStep(s.fontStep);
    saveState({ fontStep: s.fontStep });
  }

  function announce(msg) {
    var status = document.getElementById("sr-status");
    if (status) status.textContent = msg;
  }

  applyAll();

  document.addEventListener("DOMContentLoaded", function () {
    var dec = document.getElementById("a11y-font-decrease");
    var inc = document.getElementById("a11y-font-increase");
    var reset = document.getElementById("a11y-reset");

    function bump(delta) {
      var s = getState();
      s.fontStep = Math.min(MAX_FONT_STEP, Math.max(MIN_FONT_STEP, s.fontStep + delta));
      applyAll(s);
      announce("Tamanho do texto: nível " + s.fontStep + " de " + MAX_FONT_STEP + ".");
    }

    if (dec) {
      dec.addEventListener("click", function () {
        bump(-1);
      });
    }
    if (inc) {
      inc.addEventListener("click", function () {
        bump(1);
      });
    }
    if (reset) {
      reset.addEventListener("click", function () {
        applyAll({ fontStep: 0 });
        announce("Tamanho do texto restaurado ao padrão.");
      });
    }
  });
})();

/**
 * Painel de acessibilidade: <dialog> aberto pelos elementos com data-a11y-dialog-open.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var dialog = document.getElementById("acessibilidade");
    if (!dialog || typeof dialog.showModal !== "function") return;

    var openTrigger = document.getElementById("a11y-dialog-open");
    var openerElement = null;

    function closeMobileMenu() {
      var cluster = document.querySelector(".hero__header-cluster");
      var toggle = document.getElementById("hero-menu-toggle");
      if (cluster && cluster.classList.contains("is-menu-open")) {
        cluster.classList.remove("is-menu-open");
        document.body.style.overflow = "";
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Abrir menu de navegação");
        }
      }
    }

    function setMainTriggerExpanded(open) {
      if (openTrigger) openTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    }

    function openA11yDialog(fromEl) {
      openerElement = fromEl || null;
      closeMobileMenu();
      dialog.showModal();
      setMainTriggerExpanded(true);
      var closeBtn = dialog.querySelector(".a11y-dialog__close");
      if (closeBtn) closeBtn.focus();
    }

    document.querySelectorAll("[data-a11y-dialog-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openA11yDialog(btn);
      });
    });

    var closeBtn = dialog.querySelector(".a11y-dialog__close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        dialog.close();
      });
    }

    dialog.addEventListener("close", function () {
      setMainTriggerExpanded(false);
      if (openerElement && typeof openerElement.focus === "function") {
        openerElement.focus();
      }
      openerElement = null;
    });
  });
})();

/**
 * Carrossel contínuo (referências culturais, filmes, etc.): duplica o trilho para loop sem salto.
 * Com prefers-reduced-motion: reduce mantém rolagem horizontal manual.
 */
(function () {
  "use strict";

  var rails = document.querySelectorAll("[data-cultura-marquee]");
  if (!rails.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  rails.forEach(function (rail) {
    if (!rail.children.length) return;
    if (rail.querySelector(".cultura-cred__carousel-track")) return;

    var track = document.createElement("div");
    track.className = "cultura-cred__carousel-track";
    var set1 = document.createElement("div");
    set1.className = "cultura-cred__carousel-set";
    set1.setAttribute("role", "list");

    while (rail.firstChild) {
      set1.appendChild(rail.firstChild);
    }

    var set2 = set1.cloneNode(true);
    set2.setAttribute("aria-hidden", "true");
    set2.removeAttribute("role");
    set2.setAttribute("role", "presentation");

    track.appendChild(set1);
    track.appendChild(set2);
    rail.appendChild(track);
    rail.classList.add("cultura-cred__rail--marquee");
    rail.removeAttribute("role");
  });
})();

/**
 * Carrossel de vídeos (estresse de minorias): setas alinham ao slide com scroll suave.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var viewport = document.getElementById("stress-videos-viewport");
    var prevBtn = document.getElementById("stress-videos-prev");
    var nextBtn = document.getElementById("stress-videos-next");
    if (!viewport || !prevBtn || !nextBtn) return;

    var track = viewport.querySelector(".stress-videos__track");
    var slides = track ? track.querySelectorAll(".stress-videos__slide") : null;
    if (!slides || !slides.length) return;

    var reduceMotion =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function scrollBehavior() {
      return reduceMotion ? "auto" : "smooth";
    }

    function nearestIndex() {
      var mid = viewport.scrollLeft + viewport.clientWidth * 0.35;
      var best = 0;
      for (var j = 0; j < slides.length; j++) {
        if (slides[j].offsetLeft <= mid) best = j;
      }
      return best;
    }

    function updateButtons() {
      var maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth - 2);
      var sl = viewport.scrollLeft;
      prevBtn.disabled = sl <= 2;
      nextBtn.disabled = sl >= maxScroll - 2;
    }

    function go(delta) {
      var i = Math.max(0, Math.min(slides.length - 1, nearestIndex() + delta));
      viewport.scrollTo({
        left: slides[i].offsetLeft,
        behavior: scrollBehavior(),
      });
    }

    prevBtn.addEventListener("click", function () {
      go(-1);
    });
    nextBtn.addEventListener("click", function () {
      go(1);
    });

    viewport.addEventListener("scroll", function () {
      window.requestAnimationFrame(updateButtons);
    });

    window.addEventListener("resize", updateButtons);
    window.addEventListener("load", updateButtons);

    viewport.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    });

    updateButtons();
  });
})();
