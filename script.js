// Retrieve recipes from Local Storage
const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
displayRecipes(); // Display existing recipes on page load

// Add recipe to Local Storage
function addRecipe(recipe) {
  const image = recipe.image;
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = () => {
    const imageData = reader.result;
    recipe.image = imageData;
    recipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes(); // Update recipe gallery after adding new recipe
    clearFormFields('add-recipe-form'); // Clear form fields after adding
  };
}

// Display recipes from Local Storage
function displayRecipes() {
  const recipeHTML = recipes.map((recipe, index) => {
    const imageSrc = recipe.image;
    return `
      <div class="recipe" data-recipe-index="${index}">
        <h2>${recipe.name}</h2>
        <img src="${imageSrc}" alt="Recipe Image">
        <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
  }).join('');
  document.getElementById('recipe-gallery').innerHTML = recipeHTML;
}

// Edit recipe in Local Storage
function editRecipe(index, updatedRecipe) {
  const currentRecipe = recipes[index];

  if (updatedRecipe.name) currentRecipe.name = updatedRecipe.name;
  if (updatedRecipe.ingredients) currentRecipe.ingredients = updatedRecipe.ingredients;
  if (updatedRecipe.instructions) currentRecipe.instructions = updatedRecipe.instructions;

  if (updatedRecipe.image) {
    const reader = new FileReader();
    reader.readAsDataURL(updatedRecipe.image);
    reader.onload = () => {
      currentRecipe.image = reader.result;
      saveAndDisplay();
    };
  } else {
    saveAndDisplay();
  }

  function saveAndDisplay() {
    recipes[index] = currentRecipe;
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes(); // Update recipe gallery after editing recipe
    clearFormFields('edit-recipe-form'); // Clear form fields after editing
  }
}

// Delete recipe from Local Storage
function deleteRecipe(index) {
  recipes.splice(index, 1);
  localStorage.setItem('recipes', JSON.stringify(recipes));
  displayRecipes(); // Update recipe gallery after deleting recipe
}

// Clear form fields
function clearFormFields(formId) {
  const form = document.getElementById(formId);
  form.reset();
}

// Event listeners
document.getElementById('add-recipe-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const ingredients = document.getElementById('ingredients').value;
  const instructions = document.getElementById('instructions').value;
  const image = document.getElementById('image').files[0];
  if (name && ingredients && instructions && image) {
    addRecipe({ name, ingredients, instructions, image });
  } else {
    alert('Please fill in all fields and upload an image.');
  }
});

document.getElementById('recipe-gallery').addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-btn')) {
    const index = e.target.parentElement.dataset.recipeIndex;
    const recipe = recipes[index];
    document.getElementById('edit-name').value = recipe.name;
    document.getElementById('edit-ingredients').value = recipe.ingredients;
    document.getElementById('edit-instructions').value = recipe.instructions;
    document.getElementById('edit-modal').dataset.recipeIndex = index;
    document.getElementById('edit-modal').style.display = 'flex';
  } else if (e.target.classList.contains('delete-btn')) {
    const index = e.target.parentElement.dataset.recipeIndex;
    if (confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe(index);
    }
  }
});

document.getElementById('save-changes-btn').addEventListener('click', () => {
  const index = document.getElementById('edit-modal').dataset.recipeIndex;
  const updatedRecipe = {
    name: document.getElementById('edit-name').value,
    ingredients: document.getElementById('edit-ingredients').value,
    instructions: document.getElementById('edit-instructions').value,
    image: document.getElementById('edit-image').files[0]
  };
  editRecipe(index, updatedRecipe);
  document.getElementById('edit-modal').style.display = 'none';
});

document.getElementById('close-edit-modal-btn').addEventListener('click', () => {
  document.getElementById('edit-modal').style.display = 'none';
});