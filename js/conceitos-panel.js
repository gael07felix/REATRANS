/**
 * Seção Conceitos: lista (hover/foco/clique) + imagem e legenda.
 * Desktop: coluna visual à esquerda. Mobile (≤56rem): bloco imagem+texto abaixo do termo ativo.
 */
(function () {
  "use strict";

  var items = [
    {
      image: "https://picsum.photos/seed/reatrans-les/900/1100",
      text:
        "Lésbicas são mulheres (incluindo trans) com atração afetiva e/ou sexual por outras mulheres. A visibilidade lésbica combate o apagamento e a hipersexualização sofridos por muitas mulheres no ambiente escolar.",
    },
    {
      image: "https://picsum.photos/seed/reatrans-gay/900/1100",
      text:
        "Gays são homens (cis ou trans) com atração afetiva e/ou sexual por outros homens. O termo também costuma ser usado de forma genérica no acrônimo, embora hoje se busque nomear com precisão outras identidades.",
    },
    {
      image: "https://picsum.photos/seed/reatrans-bi/900/1100",
      text:
        "Bissexuais sentem atração por mais de um gênero. Bissexualidade é orientação válida; comentários que exigem “provas” ou reduzem a atração a estereótipos reforçam a bifobia.",
    },
    {
      image: "https://picsum.photos/seed/reatrans-trans/900/1100",
      text:
        "Pessoas transgêneros têm identidade de gênero diferente do sexo designado ao nascer. Travestis constituem identidade e resistência específicas no Brasil; respeito ao nome social e à autodeterminação é obrigatório na escola.",
    },
    {
      image: "https://picsum.photos/seed/reatrans-queer/900/1100",
      text:
        "Queer pode funcionar como guarda-chuva político para quem rompe com normas rígidas de gênero e sexualidade; algumas pessoas usam como identidade. Uso respeitoso evita o termo como insulto.",
    },
    {
      image: "https://picsum.photos/seed/reatrans-inter/900/1100",
      text:
        "Pessoas intersexo apresentam variações de características sexuais que não se encaixam em definições exclusivamente masculinas ou femininas. Direitos incluem não ser forçada a intervenções sem consentimento.",
    },
    {
      image: "https://picsum.photos/seed/reatrans-asex/900/1100",
      text:
        "No espectro assexual há diversidade de vivências de atração sexual e romântica (por exemplo, demissexualidade e aromanticidade). Ausência ou baixa de atração sexual não é “fase” nem defeito.",
    },
    {
      image: "https://picsum.photos/seed/reatrans-pan/900/1100",
      text:
        "Pansexualidade descreve atração independente de gênero ou que considera a pessoa como um todo, sem que o gênero seja o eixo principal da atração, não é sinônimo de transfobia ou fetichismo.",
    },
    {
      image: "https://picsum.photos/seed/reatrans-nb/900/1100",
      text:
        "Pessoas não binárias não se identificam apenas como homem ou mulher. Pronomes e nome social devem ser respeitados; ambiente escolar seguro evita pressionar alguém a “escolher um lado”.",
    },
    {
      image: "https://picsum.photos/seed/reatrans-demais/900/1100",
      text:
        "A sigla LGBTQIAPN+ é aberta a demais orientações sexuais e identidades de gênero. Linguagem e políticas escolares devem acolher essa pluralidade sem hierarquizar “letras principais” e secundárias.",
    },
  ];

  var labels = [
    "Lésbicas",
    "Gays",
    "Bissexuais",
    "Transgêneros / Travestis",
    "Queer",
    "Intersexo",
    "Assexual",
    "Pansexual",
    "Não binário",
    "Demais orientações sexuais e identidades de gênero",
  ];

  var root = document.querySelector(".conceitos-split");
  if (!root) return;

  var imgEl = document.getElementById("conceitos-photo");
  var capEl = document.getElementById("conceitos-caption");
  var liveEl = document.getElementById("conceitos-live");
  var group = root.querySelector("[data-conceitos-radiogroup]");
  var buttons = root.querySelectorAll(".conceitos-split__trigger");
  var slots = root.querySelectorAll(".conceitos-split__choice-slot");

  var currentIndex = 0;
  var mobileDetailEl = null;
  var mobileImgEl = null;
  var mobileCapEl = null;

  var mqMobile =
    typeof window.matchMedia === "function" ? window.matchMedia("(max-width: 56rem)") : null;

  function isMobileLayout() {
    return mqMobile ? mqMobile.matches : window.innerWidth <= 896;
  }

  function buildMobileDetail() {
    var wrap = document.createElement("div");
    wrap.className = "conceitos-split__mobile-detail";

    var fig = document.createElement("figure");
    fig.className = "conceitos-split__figure conceitos-split__figure--inline";

    var img = document.createElement("img");
    img.className = "conceitos-split__img";
    img.alt = "Ilustração decorativa relacionada ao termo selecionado.";
    img.decoding = "async";
    img.width = 900;
    img.height = 1100;

    var overlay = document.createElement("div");
    overlay.className = "conceitos-split__overlay";
    overlay.setAttribute("aria-hidden", "true");

    var cap = document.createElement("figcaption");
    cap.className = "conceitos-split__caption";

    fig.appendChild(img);
    fig.appendChild(overlay);
    fig.appendChild(cap);
    wrap.appendChild(fig);

    mobileImgEl = img;
    mobileCapEl = cap;
    mobileDetailEl = wrap;
    return wrap;
  }

  function detachMobileDetail() {
    if (mobileDetailEl && mobileDetailEl.parentNode) {
      mobileDetailEl.parentNode.removeChild(mobileDetailEl);
    }
  }

  function setActive(index, announce) {
    if (index < 0 || index >= items.length) return;

    currentIndex = index;
    var item = items[index];

    if (imgEl) {
      imgEl.src = item.image;
      imgEl.alt = "Ilustração decorativa relacionada ao termo: " + labels[index] + ".";
    }
    if (capEl) {
      capEl.textContent = item.text;
    }

    if (isMobileLayout()) {
      if (!mobileDetailEl) {
        buildMobileDetail();
      }
      if (mobileImgEl) {
        mobileImgEl.src = item.image;
        mobileImgEl.alt = "Ilustração decorativa relacionada ao termo: " + labels[index] + ".";
      }
      if (mobileCapEl) mobileCapEl.textContent = item.text;
      if (slots[index]) {
        slots[index].appendChild(mobileDetailEl);
      }
    } else {
      detachMobileDetail();
    }

    if (announce && liveEl) {
      liveEl.textContent = labels[index] + ". " + item.text;
    }

    buttons.forEach(function (btn, i) {
      var on = i === index;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-checked", on ? "true" : "false");
    });
  }

  buttons.forEach(function (btn, index) {
    btn.addEventListener("mouseenter", function () {
      if (!isMobileLayout()) {
        setActive(index, false);
      }
    });

    btn.addEventListener("focus", function () {
      setActive(index, true);
    });

    btn.addEventListener("click", function () {
      setActive(index, true);
    });
  });

  if (group) {
    group.addEventListener("keydown", function (e) {
      var next = currentIndex;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        next = Math.min(items.length - 1, currentIndex + 1);
        e.preventDefault();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        next = Math.max(0, currentIndex - 1);
        e.preventDefault();
      } else if (e.key === "Home") {
        next = 0;
        e.preventDefault();
      } else if (e.key === "End") {
        next = items.length - 1;
        e.preventDefault();
      } else {
        return;
      }
      buttons[next].focus();
      setActive(next, true);
    });
  }

  function onLayoutChange() {
    setActive(currentIndex, false);
  }

  if (mqMobile && typeof mqMobile.addEventListener === "function") {
    mqMobile.addEventListener("change", onLayoutChange);
  } else {
    window.addEventListener("resize", function () {
      window.requestAnimationFrame(onLayoutChange);
    });
  }

  setActive(0, false);
})();
