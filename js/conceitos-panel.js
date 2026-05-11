/**
 * Seção Conceitos: lista (hover/foco/clique) + imagem e legenda.
 * Desktop: coluna visual à esquerda. Mobile (≤56rem): bloco imagem+texto abaixo do termo ativo.
 */
(function () {
  "use strict";

  var items = [
    {
      image: "https://fetamce.org.br/wp-content/uploads/2019/08/40235641_1941828462527528_7086849579185864704_n.jpg",
      text:
        "Lésbicas são mulheres (incluindo trans) com atração afetiva e/ou sexual por outras mulheres. A visibilidade lésbica combate o apagamento e a hipersexualização sofridos por muitas mulheres no ambiente escolar.",
    },
    {
      image: "https://media.istockphoto.com/id/1390068712/pt/foto/portrait-of-a-happy-gay-couple-having-fun-on-an-outdoor-date-playing-together-smiling-real.jpg?s=612x612&w=0&k=20&c=1DM1yrp-tK7N828lxTv1EWkL37IXm5jkZwoEEnU7Lqo=",
      text:
        "Gays são homens (cis ou trans) com atração afetiva e/ou sexual por outros homens. O termo também costuma ser usado de forma genérica no acrônimo, embora hoje se busque nomear com precisão outras identidades.",
    },
    {
      image: "https://s2-gshow.glbimg.com/IGHpf8GisWM3Vmv-DdbLACRyyxw=/0x0:1595x1077/600x0/smart/filters:gifv():strip_icc()/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2023/7/4/Fy7skoSt6LxQ41VbGT2g/e85dcae5-ab3a-4de6-9260-b1b14ee6a2a8.png",
      text:
        "Bissexuais sentem atração por mais de um gênero. Bissexualidade é orientação válida; comentários que exigem “provas” ou reduzem a atração a estereótipos reforçam a bifobia.",
    },
    {
      image: "https://s2-oglobo.glbimg.com/urgBymn1mWwag_8s-LbasayJpXo=/0x0:8192x5464/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2025/Y/c/AA8dzqSkmiwNZ1Zy4RFw/110554720-washington-dc-march-31-a-transgender-rights-activist-holds-a-flag-during-the-trans-day-o.jpg",
      text:
        "Pessoas transgêneros têm identidade de gênero diferente do sexo designado ao nascer. Travestis constituem identidade e resistência específicas no Brasil; respeito ao nome social e à autodeterminação é obrigatório na escola.",
    },
    {
      image: "https://assets.teenvogue.com/photos/62a8b3c84fe8681b4e0392c6/16:9/w_2560%2Cc_limit/GettyImages-1164938789.jpg",
      text:
        "Queer pode funcionar como guarda-chuva político para quem rompe com normas rígidas de gênero e sexualidade; algumas pessoas usam como identidade. Uso respeitoso evita o termo como insulto.",
    },
    {
      image: "https://www.eusemfronteiras.com.br/wp-content/uploads/2023/08/Intersexo-810x456.png",
      text:
        "Pessoas intersexo apresentam variações de características sexuais que não se encaixam em definições exclusivamente masculinas ou femininas. Direitos incluem não ser forçada a intervenções sem consentimento.",
    },
    {
      image: "https://p2.trrsf.com/image/fget/cf/1200/1600/middle/images.terra.com/2023/04/25/bandeira-assexual-istock-urjlido3syn9.jpg",
      text:
        "No espectro assexual há diversidade de vivências de atração sexual e romântica (por exemplo, demissexualidade e aromanticidade). Ausência ou baixa de atração sexual não é “fase” nem defeito.",
    },
    {
      image: "https://www.rbsdirect.com.br/filestore/5/5/7/0/0/3/5_b7198e90c5ac211/5300755_09ad6882ed2dc2f.jpg?format=webp&w=1600&h=1600&a=c",
      text:
        "Pansexualidade descreve atração independente de gênero ou que considera a pessoa como um todo, sem que o gênero seja o eixo principal da atração, não é sinônimo de transfobia ou fetichismo.",
    },
    {
      image: "https://media.istockphoto.com/id/1322824551/pt/foto/person-waving-a-non-binary-pride-flag.jpg?s=612x612&w=0&k=20&c=h7OFP4926dP1vsxumxkFWjzHVgXhZzDybK-uaRuoP_0=",
      text:
        "Pessoas não binárias não se identificam apenas como homem ou mulher. Pronomes e nome social devem ser respeitados; ambiente escolar seguro evita pressionar alguém a “escolher um lado”.",
    },
    {
      image: "https://cdn.jornaldaparaiba.com.br/wp-content/uploads/2018/01/bandeira-lgbt-gay-transexual.jpg?xid=613713",
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
