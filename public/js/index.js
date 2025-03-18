document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");
  const searchButton = document.getElementById("search-button");
  const searchResultsContainer = document.createElement("div");
  searchResultsContainer.classList.add("search-results");

  document.body.appendChild(searchResultsContainer);

  async function fetchData() {
    try {
      const response = await fetch("/index.json");
      return await response.json();
    } catch (error) {
      console.error("Error al cargar los datos de búsqueda:", error);
      return [];
    }
  }

  async function performSearch(query) {
    const data = await fetchData();
    const results = data.filter(page =>
      page.title.toLowerCase().includes(query.toLowerCase()) ||
      page.content.toLowerCase().includes(query.toLowerCase())
    );

    showResults(results);
  }

  function showResults(results) {
    searchResultsContainer.innerHTML = "";
    if (results.length === 0) {
      searchResultsContainer.innerHTML = `<p class="search-no-results">No se encontraron resultados</p>`;
      return;
    }

    results.forEach(result => {
      const item = document.createElement("a");
      item.href = result.url;
      item.classList.add("search-result-item");
      item.innerHTML = `<strong>${result.title}</strong><p>${result.content}</p>`;
      searchResultsContainer.appendChild(item);
    });
  }

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
      performSearch(query);
    }
  });

  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      searchButton.click();
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("dark-mode-toggle");
  const body = document.body;

  // 🌙 Verifica el sistema o localStorage
  if (localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    body.classList.add("dark-mode");
    toggleButton.textContent = "☀️"; // Sol
  }

  // 🔄 Cambiar Modo al Clic
  toggleButton.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      toggleButton.textContent = "☀️"; // Cambia a sol
    } else {
      localStorage.setItem("theme", "light");
      toggleButton.textContent = "🌙"; // Cambia a luna
    }
  });
});

