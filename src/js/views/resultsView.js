import icons from 'url:../../img/icons.svg';
import View from './View.js';
import previewView from './previewView.js'

class resultsView extends View{
  _parentElement=document.querySelector('.results');
  _errorMessage='No recipe found for your query! please try again';
  _message='';

   _generateMarkup(){
      
      return this._data.map(bookmark=>previewView.render(bookmark,false)).join('');
      }
    
  }


export default new resultsView();