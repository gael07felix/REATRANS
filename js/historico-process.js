/** Marcos históricos: scrollspy nas abas + teclado (roving tabindex). */

(function () {
  "use strict";

  var root = document.querySelector("[data-historico-process]");
  if (!root) return;

  var nav = root.querySelector(".historico-process__nav");
  var tabList = root.querySelector(".historico-process__tabs");
  var tabs = root.querySelectorAll("[data-historico-tab]");
  var panels = root.querySelectorAll("[data-historico-panel]");
  if (!tabs.length || !panels.length) return;

  var prefersReduced =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function navHasFocusWithin() {
    if (!nav) return false;
    try {
      if (typeof nav.matches === "function" && nav.matches(":focus-within")) return true;
    } catch (e) {
      /* ignore */
    }
    return nav.contains(document.activeElement);
  }

  function tabIndexForPanelId(panelId) {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].getAttribute("data-historico-tab") === panelId) return i;
    }
    return 0;
  }

  function syncRovingTabindex(panelId) {
    if (navHasFocusWithin()) return;
    var keep = tabIndexForPanelId(panelId);
    tabs.forEach(function (btn, i) {
      btn.setAttribute("tabindex", i === keep ? "0" : "-1");
    });
  }

  function applyActiveState(panelId) {
    tabs.forEach(function (btn) {
      var id = btn.getAttribute("data-historico-tab");
      var on = id === panelId;
      btn.classList.toggle("is-active", on);
      if (on) {
        btn.setAttribute("aria-current", "true");
      } else {
        btn.removeAttribute("aria-current");
      }
    });
  }

  function setActiveFromScroll(panelId) {
    applyActiveState(panelId);
    syncRovingTabindex(panelId);
  }

  /** Painel cuja posição está mais próxima do centro vertical da viewport (leitura). */
  function pickPanelAtReadingLine() {
    var centerY = window.innerHeight * 0.42;
    var bestId = panels[0].id;
    var bestDist = Infinity;

    for (var i = 0; i < panels.length; i++) {
      var el = panels[i];
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) continue;
      var mid = r.top + r.height * 0.35;
      var dist = Math.abs(mid - centerY);
      if (dist < bestDist) {
        bestDist = dist;
        bestId = el.id;
      }
    }
    return bestId;
  }

  /** Último painel já “passado” pela linha de referência (comportamento tipo lista vertical). */
  function pickPanelByScrollLine() {
    var line = window.innerHeight * 0.38;
    var chosen = panels[0].id;
    for (var i = 0; i < panels.length; i++) {
      if (panels[i].getBoundingClientRect().top <= line) {
        chosen = panels[i].id;
      }
    }
    return chosen;
  }

  function updateActivePanel() {
    if (navHasFocusWithin()) return;
    var id = pickPanelAtReadingLine();
    if (!id) id = pickPanelByScrollLine();
    setActiveFromScroll(id);
  }

  var ticking = false;
  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      updateActivePanel();
    });
  }

  if (typeof IntersectionObserver !== "undefined") {
    var io = new IntersectionObserver(
      function () {
        updateActivePanel();
      },
      {
        root: null,
        rootMargin: "-28% 0px -32% 0px",
        threshold: [0, 0.02, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    );
    for (var p = 0; p < panels.length; p++) {
      io.observe(panels[p]);
    }
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });

  function activateTabByIndex(index) {
    if (index < 0 || index >= tabs.length) return;
    tabs.forEach(function (b, i) {
      b.setAttribute("tabindex", i === index ? "0" : "-1");
    });
    tabs[index].focus();
  }

  function moveTabFocus(fromIndex, delta) {
    var next = Math.max(0, Math.min(tabs.length - 1, fromIndex + delta));
    if (next !== fromIndex) activateTabByIndex(next);
  }

  if (tabList) {
    tabList.addEventListener("keydown", function (e) {
      var el = document.activeElement;
      if (!el || !el.hasAttribute("data-historico-tab")) return;
      var i = Array.prototype.indexOf.call(tabs, el);
      if (i < 0) return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        moveTabFocus(i, 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        moveTabFocus(i, -1);
      } else if (e.key === "Home") {
        e.preventDefault();
        activateTabByIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        activateTabByIndex(tabs.length - 1);
      }
    });
  }

  function goToPanel(panelId) {
    var panel = document.getElementById(panelId);
    if (!panel) return;
    panel.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });
    applyActiveState(panelId);
    syncRovingTabindex(panelId);
    try {
      panel.focus({ preventScroll: true });
    } catch (err) {
      /* ignore */
    }
  }

  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-historico-tab");
      if (id) goToPanel(id);
    });

    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        var id = btn.getAttribute("data-historico-tab");
        if (id) goToPanel(id);
      }
    });
  });

  updateActivePanel();
  window.requestAnimationFrame(function () {
    updateActivePanel();
  });
})();
