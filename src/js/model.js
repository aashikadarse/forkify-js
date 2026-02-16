import  {async} from 'regenerator-runtime';
import {API_URL,RES_PER_PAGE,KEY} from './config.js';
// import {getJSON,sendJSON} from './helper.js';
import {AJAX} from './helper.js';
export const state={
  recipe:{},
  search:{
    query:'',
    results:[],
    page:1,
    resultsPerPage:RES_PER_PAGE,
  },
  bookmarks:[],
};

const createRecipeObject=function(data){
  const {recipe}=data.data;
   return state.recipe={
      id:recipe.id,
      title:recipe.title,
      publisher:recipe.publisher,
      sourceUrl:recipe.source_url,
      image:recipe.image_url,
      servings:recipe.servings,
      cooking_time:recipe.cooking_time,
      ingredients:recipe.ingredients,
      ...(recipe.key && {key: recipe.key}),//if 1st value is null it does nothing ,if it contains a value then returns the 2nd value an destructures it
    };
}

export const loadRecipe=async function(id){
  try{
    const data=await AJAX(`${API_URL}${id}`);
    state.recipe=createRecipeObject(data);
    
   //some() returns true if any one element matches 
    if(state.bookmarks.some(bookmark=>bookmark.id===id))
      state.recipe.bookmarked=true;
    else state.recipe.bookmarked=false;

    console.log(state.recipe);
  }catch(err){
    //temp err
    console.error(`${err}!!`);
    throw err;
  }
}

export const loadSearchResults=async function(query){
  try{
    state.search.query=query;
    const data=await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results=data.data.recipes.map(rec =>{
      return {
         id:rec.id,
      title:rec.title,
      publisher:rec.publisher,
      image:rec.image_url,
      ...(rec.key && {key: rec.key})
      };
    });
    state.search.page=1;
    // console.log(state.search.results);
  }
  catch(err){
    console.log(`${err}`);
  }
};
// loadSearchResults('pizza');

export const getSearchResultsPage=function(page=state.search.page){
  state.search.page=page;
  const start=(page-1)*state.search.resultsPerPage;
  const end=page*state.search.resultsPerPage;

  return state.search.results.slice(start,end);
}

export const updateServings=function(newServings){
  state.recipe.ingredients.forEach(ing => {
    ing.quantity =(ing.quantity*newServings)/state.recipe.servings;
    //newQt=oldQt*newSevings/oldServings//
  });

  state.recipe.servings=newServings;
};

const persistBookmarks=function(){
                      //key         value
  localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks))
};

export const addBookmark=function(recipe){
  //add bookmark
  state.bookmarks.push(recipe);

  //mark current recipe as bookmark
  if(recipe.id===state.recipe.id)state.recipe.bookmarked=true;
  persistBookmarks();
};

export const deleteBookmark=function(id){
  //delete bookmark
  const index=state.bookmarks.findIndex(el => el.id ===id);

  state.bookmarks.splice(index,1);

  //mark current recipe as bookmark
  if(id===state.recipe.id)
    state.recipe.bookmarked=false;
   persistBookmarks();
};

const init=function(){
  const storage=localStorage.getItem('bookmarks');
  if(storage) state.bookmarks=JSON.parse(storage);
};
init();
// console.log(state.bookmarks);

const clearBookmarks=function(){
  localStorage.clear('bookmarks');
};

clearBookmarks();

export const uploadRecipe=async function(newRecipe){
   try{
  //converts an object into an array of[key, value]pairs
  const ingredients=Object.entries(newRecipe)
  .filter(
    entry=>entry[0].startsWith('ingredient')&& entry[1] !=='')
    .map(ing=>{
    const ingArr=ing[1]
    .split(',').map(el =>el.trim());
    if(ingArr.length !==3) throw new Error('Wrong ingredient format! please use the correct format');
    
  

  const [quantity,unit,description]=ingArr;
  return {quantity: quantity ? +quantity : null, unit, description}
});
const recipe={
  title: newRecipe.title,
  source_url: newRecipe.sourceUrl,
  image_url: newRecipe.image,
  publisher: newRecipe.publisher,
  cooking_time: +newRecipe.cookingTime,
  servings: +newRecipe.servings,
  ingredients,
};
 
 const data=await AJAX(`${API_URL}?key=${KEY}`,recipe);
 state.recipe=createRecipeObject(data);
 addBookmark(state.recipe);
 }catch(err){
  throw err;
}
};


