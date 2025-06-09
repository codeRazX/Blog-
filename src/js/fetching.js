import env from './env.js';
import UI from "./UI.js";

export const requestGet = async (endpoint, done = null) => {
  try{
    const response = await fetch(`${env.BASE_URL}${endpoint}`, {
      method: 'GET',
      credentials: 'include'
    });

    if(response.ok){
      const data = await response.json();
      if (done) return done(data);
    }
  }
  catch(err){
    console.log(err);
  }

}

export const postRequest = async (e, endpoint, form, done= null) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form));

    try{
        const response = await fetch(`${env.BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
            credentials: 'include'
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }
        const data = await response.json();
        if(data.success){
            console.log(data);
            if (done) done(data);
        }
    }
    catch(err){
        console.log(err);
        if(!err.errors){
            UI.renderErrorCatch(form, err.message);
            return;
        }

        UI.renderErrors(err, form);
    }
}


export const postLogout = async (done = null) => {
  try{
    const response = await fetch(`${env.BASE_URL}${env.SIGN_UP}`, {
      method: 'POST',
      credentials: 'include'
    });

    if(response.ok){
      const data = await response.json();
      if(done) done(data);
    }
  }
  catch(err){
    console.log(err);
  }
}