document.addEventListener("DOMContentLoaded", () => {
  const seriesList = document.getElementById("series-list");
  const searchInput = document.getElementById("search");
  const publishForm = document.getElementById("publishForm");
  const loginModal = document.getElementById("login-modal");
  const adminPasswordInput = document.getElementById("admin-password");
  const loginBtn = document.getElementById("login-btn");

  let series = JSON.parse(localStorage.getItem("series")) || [];

  // Mostrar o esconder modal de login
  const showLoginModal = () => {
    loginModal.style.display = 'flex';
  };

  const hideLoginModal = () => {
    loginModal.style.display = 'none';
  };

  // Renderizar series
  const renderSeries = () => {
    seriesList.innerHTML = "";
    series.forEach((serie, index) => {
      const seriesCard = document.createElement("div");
      seriesCard.classList.add("card");

      // Crear la lista de episodios
      const episodesHTML = serie.episodes
        .map(
          (episode) =>
            `<li><a href="${episode.url}" target="_blank">${episode.title}</a></li>`
        )
        .join("");

      seriesCard.innerHTML = `
        <h3>${serie.title}</h3>
        <p>${serie.description}</p>
        <ul>${episodesHTML}</ul>
        <button class="add-episode" data-index="${index}">Agregar Episodio</button>
        <button class="delete-series" data-index="${index}">Eliminar Serie</button>
      `;

      seriesList.appendChild(seriesCard);
    });
  };

  // Guardar en localStorage
  const saveSeries = () => {
    localStorage.setItem("series", JSON.stringify(series));
  };

  // Filtrar series con el buscador
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll(".card").forEach((card) => {
      const title = card.querySelector("h3").innerText.toLowerCase();
      card.style.display = title.includes(query) ? "block" : "none";
    });
  });

  // Agregar nueva serie
  publishForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = e.target.elements["title"].value.trim();
    const description = e.target.elements["description"].value.trim();
    const password = e.target.elements["password"].value.trim();

    if (title && description && password) {
      series.push({ title, description, password, episodes: [] });
      saveSeries();
      renderSeries();
      e.target.reset();
      alert("Serie agregada exitosamente.");
    } else {
      alert("Por favor, completa todos los campos.");
    }
  });

  // Delegación de eventos para agregar episodios y eliminar series
  seriesList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;

    // Agregar episodio
    if (e.target.classList.contains("add-episode")) {
      const episodeTitle = prompt("Título del episodio:");
      const episodeUrl = prompt("URL del iframe (YouTube, etc.):");

      if (episodeTitle && episodeUrl) {
        series[index].episodes.push({ title: episodeTitle, url: episodeUrl });
        saveSeries();
        renderSeries();
        alert("Episodio agregado exitosamente.");
      } else {
        alert("Por favor, ingresa todos los datos del episodio.");
      }
    }

    // Eliminar serie
    if (e.target.classList.contains("delete-series")) {
      const seriePassword = series[index].password;
      showLoginModal();

      loginBtn.addEventListener("click", () => {
        const enteredPassword = adminPasswordInput.value.trim();
        if (enteredPassword === seriePassword || enteredPassword === '1234') {
          if (confirm("¿Seguro que deseas eliminar esta serie?")) {
            series.splice(index, 1);
            saveSeries();
            renderSeries();
            hideLoginModal();
            alert("Serie eliminada exitosamente.");
          }
        } else {
          alert("Contraseña incorrecta.");
        }
      });
    }
  });

  // Inicializar la aplicación
  renderSeries();
});
