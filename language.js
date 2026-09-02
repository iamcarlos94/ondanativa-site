(function () {
  "use strict";

  var script = document.currentScript;
  var baseUrl = new URL(".", script.src);
  var supported = ["pt", "es", "en"];
  var current = document.documentElement.lang.slice(0, 2).toLowerCase();

  function savedLanguage() {
    try {
      return window.localStorage.getItem("onda-language");
    } catch (_error) {
      return null;
    }
  }

  function browserLanguage() {
    var languages = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || "pt"];

    for (var index = 0; index < languages.length; index += 1) {
      var candidate = String(languages[index]).slice(0, 2).toLowerCase();
      if (supported.indexOf(candidate) !== -1) return candidate;
    }

    return "pt";
  }

  function languageUrl(language) {
    return language === "pt"
      ? new URL("./", baseUrl)
      : new URL(language + "/", baseUrl);
  }

  var basePath = baseUrl.pathname.replace(/\/$/, "");
  var currentPath = window.location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");
  var isHomepage = currentPath === basePath;

  if (isHomepage) {
    var preferred = savedLanguage() || browserLanguage();
    if (supported.indexOf(preferred) !== -1 && preferred !== "pt") {
      var destination = languageUrl(preferred);
      destination.search = window.location.search;
      destination.hash = window.location.hash;
      window.location.replace(destination.href);
      return;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var links = document.querySelectorAll("[data-language]");

    links.forEach(function (link) {
      var language = link.getAttribute("data-language");
      if (language === current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");

      link.addEventListener("click", function () {
        try {
          window.localStorage.setItem("onda-language", language);
        } catch (_error) {
          // The link still works when storage is unavailable.
        }
      });
    });
  });
})();
