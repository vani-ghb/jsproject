document.addEventListener("DOMContentLoaded", () => {
  const recipeModal = document.getElementById("recipeModal");
  const closeRecipeModal = document.getElementById("closeRecipeModal");

  const modalTitle = document.querySelector(".modal-title");
  const modalImage = document.querySelector(".modal-image");
  const modalIngredients = document.querySelector(".modal-ingredients");
  const modalInstructions = document.querySelector(".modal-instructions");
  const likeBtn = document.querySelector(".like-btn");
  const saveBtn = document.querySelector(".save-btn");

  closeRecipeModal?.addEventListener("click", () => {
    recipeModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === recipeModal) {
      recipeModal.style.display = "none";
    }
  });

  // Handle See More buttons
  document.querySelectorAll(".see-more-btn").forEach(button => {
    button.addEventListener("click", () => {
      const recipeName = button.getAttribute("data-name");
      const recipeCategory = button.getAttribute("data-category");

      if (recipeName && recipeCategory) {
        showRecipeByName(recipeCategory, recipeName);
      } else {
        alert("Recipe info missing!");
      }
    });
  });

  function showRecipeByName(category, name) {
    fetch("db.json")
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch JSON.");
        return response.json();
      })
      .then(data => {
        const recipe = data.recipes.find(
          r => r.category === category && r.name === name
        );

        if (!recipe) {
          alert("Recipe not found.");
          return;
        }

        // Populate modal
        modalTitle.textContent = recipe.name;

        if (recipe.image) {
          modalImage.src = recipe.image;
          modalImage.alt = recipe.name;
          modalImage.style.display = "block";
        } else {
          modalImage.style.display = "none";
        }

        modalIngredients.innerHTML = recipe.ingredients?.length
          ? recipe.ingredients.map(i => `<li>${i}</li>`).join("")
          : "<li>No ingredients listed.</li>";

        modalInstructions.textContent = recipe.instructions || "No instructions available.";

        // Reset like/save buttons
        likeBtn.classList.remove("liked");
        likeBtn.textContent = "♡ Like";
        saveBtn.classList.remove("saved");
        saveBtn.textContent = "💾 Save";

        recipeModal.style.display = "flex";
      })
      .catch(err => {
        console.error(err);
        alert("Could not load recipes.");
      });
  }

  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("liked");
    likeBtn.textContent = likeBtn.classList.contains("liked") ? "♥ Liked" : "♡ Like";
  });

  saveBtn.addEventListener("click", () => {
    saveBtn.classList.toggle("saved");
    saveBtn.textContent = saveBtn.classList.contains("saved") ? "✔ Saved" : "💾 Save";
  });
});
