import { useEffect, useState } from 'react';
import './App.css';
import { LoaderPage } from './LoaderPage';
import { Nutrition } from './Nutrition';
import Swal from 'sweetalert2';
import 'animate.css';


function App() {
const APP_ID = '24c975bf';
const APP_KEY = '471f33ea5e558ee9b054c406f3bd49b1';
const APP_URL = 'https://api.edamam.com/api/nutrition-details';

const [myNutrition, setMyNutrition] = useState();
const [mySearch, setMySearch] = useState();
const [wordSubmitted, setWordSubmitted] = useState('');
const [stateLoader, setStateLoader] = useState(false);

const fetchData = async (ingr)=>{
  setStateLoader(true);
  

  
  const response = await fetch (`${APP_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ ingr })
  })
  if (response.ok) {
    setStateLoader (false);
    const data = await response.json();
    setMyNutrition (data);
    console.log(data)

    } else {
      setStateLoader (false);
      Swal.fire({
        title: "Ingredients entered incorrectly",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
    }
} 
const myRecipeSearch = e => {
  setMySearch (e.target.value);
}
const finalSearch = e => {
  e.preventDefault();
  setWordSubmitted (mySearch);
} 
useEffect(()=>{
  if (wordSubmitted !==''){
    let item = wordSubmitted.split(/[,,;\n\r]/);
    fetchData (item);
  }
},[wordSubmitted])


  return (
    <div className='container'>

      {stateLoader && <LoaderPage />}
      <h1>Nutrition Analisis</h1>
      <form onSubmit={finalSearch}>
        <input className='input' placeholder='Search...' onChange={myRecipeSearch}/>
        <button type='submit' className='btn'>Search</button>
      </form>
      <div className='container-response'>
        {myNutrition && <p className='calories'><b>{myNutrition.calories} kcal</b></p>}
        {myNutrition && Object.values(myNutrition.totalNutrients).map(({label, quantity, unit})=>
        <Nutrition label={label} quantity={quantity} unit={unit} />
        )}
      </div>
    </div>
  );
}

export default App;
