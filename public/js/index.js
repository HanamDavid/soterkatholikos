document.addEventListener("DOMContentLoaded", function () {
  // 🌙 Dark Mode
  const toggleButton = document.getElementById("dark-mode-toggle");
  const body = document.body;

  if (toggleButton) { // ✅ Verifica si el botón existe
    if (localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      body.classList.add("dark-mode");
      toggleButton.textContent = "☀️"; // Sol
    }

    toggleButton.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        toggleButton.textContent = "☀️"; // Sol
      } else {
        localStorage.setItem("theme", "light");
        toggleButton.textContent = "🌙"; // Luna
      }
    });
  }

  // 🔍 Search
  const searchInput = document.getElementById("search");
  const searchButton = document.getElementById("search-button");
  const searchResultsContainer = document.querySelector(".search-results"); // ✅ Usa el div existente

  async function fetchData() {
    try {
      const response = await fetch("/index.json");
      return await response.json();
    } catch (error) {
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
    if (!searchResultsContainer) {
      console.error("❌ No se encontró el contenedor de resultados");
      return;
    }

    searchResultsContainer.innerHTML = ""; //  Limpiar resultados anteriores

    if (results.length === 0) {
      searchResultsContainer.innerHTML = `<p class="search-no-results">No se encontraron resultados</p>`;
      return;
    }

    results.forEach(result => {
      const item = document.createElement("a");
      item.href = result.url;
      item.classList.add("padres-nav");
      item.innerHTML = `<strong class="padres-nav">${result.title}</strong> <p>${result.content}</p>`;
      searchResultsContainer.appendChild(item);
    });
  }

  if (searchButton && searchInput) { // ✅ Verifica si los elementos existen
    searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query.length > 0) {
        setTimeout(() => {
          window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }, 100);
      }
    });

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query.length > 0) {
          setTimeout(() => {
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
          }, 100);
        }
      }
    });
  }

  // 📌 Si estamos en la página de búsqueda, hacer la consulta automática
  if (window.location.pathname === "/search/") {
    if (searchInput) {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get("q");
      if (query) {
        searchInput.value = query; // ✅ Mantener el término en el input
        performSearch(query); // 🔍 Hacer la búsqueda automática
      }
    }
  }
});

