// import icons from '../img/icons.svg';
import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';


import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {async} from 'regenerator-runtime';

// if(module.hot){
//   module.hot.accept();
// }

// const recipeContainer=document.querySelector('.recipe');

// const timeout=function(s){
//   return new Promise(function(_,reject){
//     setTimeout(function(){
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     },s*1000);
//   })
// }

// const renderSpinner=function(parentEl){
//     const markup= ` <div class="spinner">
//           <svg>
//             <use href="${icons}#icon-loader"></use>
//           </svg>
//         </div> `;
//         parent.innerHTML='';
//         parentEl.insertAdjacentHTML('afterbegin',markup)
// };

const controlRecipes=async function(){
  try{
    const id=window.location.hash.slice(1);
    console.log(id)
     
    if(!id) return;
    recipeView.renderSpinner();

   //0)update results view to mark selcted search result
   resultsView.update(model.getSearchResultsPage());
   //1)updating bookmarks view
   bookmarksView.update(model.state.bookmarks)

   //2)loading recipe
   await model.loadRecipe(id);
   // const {recipe}=model.state;
   
   //3)rendering recipe
   recipeView.render(model.state.recipe);
   
  }
  catch(err){
    recipeView.renderError();
    console.error(err);
  }
    
};
// showRecipe();

// window.addEventListener('hashchange',showRecipe)

// window.addEventListener('load',showRecipe)

const controlSearchResults=async function(){
  try{
    resultsView.renderSpinner();

    //1)get search query
    const query=searchView.getQuery();
    if(!query)return;

    //2)load search results
    await model.loadSearchResults(query);

    //3)render results
    resultsView.render(model.getSearchResultsPage());

    //4) render initial pagination buttons
    paginationView.render(model.state.search)
  }
  catch(err){
    console.log(err);
  }
};

// controlSearchResults();

const controlPagination=function(goToPage){
  //1)Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
//2)render initial pagination buttons
  paginationView.render(model.state.search);
};
const controlServings=function(newServings){
  //update the recipe servings
  model.updateServings(newServings);

  //update the recipe view
  recipeView.update(model.state.recipe);

}

const controlAddBookmark=function(){
  //1)add / remove bookmarks
  if(!model.state.recipe.bookmarked)
  model.addBookmark(model.state.recipe);
 else model.deleteBookmark(model.state.recipe.id);
 
  //2)update recipe view
  recipeView.update(model.state.recipe);

  //3)render bookmarks
  bookmarksView.render(model.state.bookmarks)
};

const controlBookmarks=function(){
  bookmarksView.render(model.state.bookmarks)
};

const controlAddRecipe=async function(newRecipe){
   try{
    //show loading spinner
    addRecipeView.renderSpinner();

  //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
     addRecipeView.renderMessage();

     //render bookmark view
     bookmarksView.render(model.state.bookmarks);
    
     //change ID in URL
     window.history.pushState(null,'',`#${model.state.recipe.id}`)

    //close form window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    },MODAL_CLOSE_SEC)
   }
  catch(err){
   console.error('!!!',err);
   addRecipeView.renderError(err.message)
  }
  
};

const init=function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // controlServings();
};
init();