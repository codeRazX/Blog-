import UI from "./UI.js";
import env from "./env.js";


export const createPost = async (e, form, done)=>{
    e.preventDefault();
    const formData = new FormData(form);

    try{
        const response = await fetch(`${env.BASE_URL}${env.CREATE_POST}`, {
            method: 'POST',
            body: formData,
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

export const postLogout = async(done) => {
    try{
        const req = await fetch(`${env.BASE_URL}${env.LOGOUT}`,{
            method: 'POST',
            credentials: 'include'
        });

        if(req.ok){
            const data = await req.json();
            if(data.success) if(done) done(data);
        }
    }
    catch(err){
        console.error(err);
    }
}

export const getRequest = async (endpoint, done = null) => {
    try{
        const req = await fetch(`${env.BASE_URL}${endpoint}`, {
            method: 'GET',
            credentials: 'include'
        });
        if(req.ok){
            const data = await req.json();
            
            if(data.success){
              console.log(data);
              return done? done(data) : data;
            }
           
        }
       
    }
    catch(err){
        console.log(err);
    }
}


export const deleteRequest = async (endpoint, done = null) => {
  try{
      const req = await fetch(`${env.BASE_URL}${endpoint}`, {
          method: 'DELETE',
          credentials: 'include'
      });
      if(req.ok){
          const data = await req.json();
          console.log(data);
          if (done) return done(data)
          else return data;
      }
      
  }
  catch(err){
      console.log(err);
  }
}


export const patchRequest = async (endpoint, form, done = null) => {
  try{
    const formData = new FormData(form);
    const response = await fetch(`${env.BASE_URL}${endpoint}`, {
      method: 'PATCH',
      body: formData,
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
        UI.renderErrorCatch(form.querySelector('fieldset'), err.message);
        return;
    }

    UI.renderErrors(err, form);
  }
}