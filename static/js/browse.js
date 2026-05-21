(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var pillsEl  = document.getElementById("browse-pills");
    var sortEl   = document.getElementById("browse-sort");
    var searchEl = document.getElementById("browse-search");
    var listEl   = document.getElementById("browse-list");

    if (!pillsEl || !listEl) return;

    // Capture all pre-rendered cards once
    var allCards = Array.from(listEl.querySelectorAll(".browse-card"));

    var activeSpecies = "All";
    var activeSort    = "newest";
    var searchQuery   = "";

    function filterAndRender() {
      var visible = allCards.filter(function (card) {
        var species = card.dataset.species || "";
        var name    = (card.dataset.name || "").toLowerCase();

        if (activeSpecies !== "All") {
          var map = { Dogs: "Dog", Cats: "Cat", Birds: "Bird" };
          if (activeSpecies === "Other") {
            if (["Dog", "Cat", "Bird"].indexOf(species) !== -1) return false;
          } else {
            if (species !== map[activeSpecies]) return false;
          }
        }

        if (searchQuery && name.indexOf(searchQuery) === -1) return false;
        return true;
      });

      if (activeSort === "oldest") {
        visible.sort(function (a, b) { return Number(a.dataset.passed) - Number(b.dataset.passed); });
      } else if (activeSort === "visited") {
        visible.sort(function (a, b) { return (a.dataset.name || "").localeCompare(b.dataset.name || ""); });
      } else {
        visible.sort(function (a, b) { return Number(b.dataset.passed) - Number(a.dataset.passed); });
      }

      // Remove empty message if present
      var empty = listEl.querySelector(".browse-empty");
      if (empty) empty.remove();

      // Clear and re-append
      while (listEl.firstChild) listEl.removeChild(listEl.firstChild);

      if (visible.length === 0) {
        listEl.innerHTML = '<p class="browse-empty">No memorials found. Try a different filter.</p>';
        return;
      }

      visible.forEach(function (card) { listEl.appendChild(card); });
    }

    pillsEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".browse-pill");
      if (!btn) return;
      activeSpecies = btn.dataset.species;
      pillsEl.querySelectorAll(".browse-pill").forEach(function (b) {
        b.classList.toggle("pill--active", b === btn);
      });
      filterAndRender();
    });

    if (sortEl) {
      sortEl.addEventListener("change", function (e) {
        activeSort = e.target.value;
        filterAndRender();
      });
    }

    if (searchEl) {
      searchEl.addEventListener("input", function (e) {
        searchQuery = e.target.value.trim().toLowerCase();
        filterAndRender();
      });
    }

    // Initial render to apply default sort
    filterAndRender();
  });
})();
