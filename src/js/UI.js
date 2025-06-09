import v from './variables.js';
import { insertBefore, resetForm, hide, show, removeErrorsOrSuccess } from './helpers.js';
import Components from './Component.js';

export default class UI{
  


    static showFieldError(input, msg) {
        input.style.borderColor = 'red';
        const errorMsg = Components.errorElement(msg, input.parentElement);
        setTimeout(() => {
            errorMsg.remove();
            input.style.borderColor = '#bdbdbd';
        }, 5000);
    }

    static renderErrors = ({errors}, form) => {
        removeErrorsOrSuccess(form);
        Object.entries(errors).forEach(([field, msg]) => {
            const input = form[field];
            if (input) this.showFieldError(input, msg);
        });
    }
    
    static renderErrorCatch = (container, msg) => {
        removeErrorsOrSuccess(container);
        const error = Components.errorElement(msg === 'Failed to fetch'? 'The server is not responding. Please try again later': msg);
        insertBefore(container, error, container.firstChild);
        setTimeout(()=> error.remove(), 5000);
    }

    static renderFeedback = (data, form, needResetForm = true) => {
        removeErrorsOrSuccess(form);
        const success = Components.successElement(data.message);
        insertBefore(form, success, form.firstChild);
        if(needResetForm) resetForm(form);
        setTimeout(()=> success.remove(), 7000);
    }


    static renderDashboard = ({data}) => {
      
        if(data?.auth){
            document.querySelector('.username').textContent= data.username;
            hide(v.formLogin);
            v.containersAdmins.forEach(container => show(container, container.dataset.display));
        }
        else{
            show(v.formLogin);
            v.containersAdmins.forEach(container => hide(container));
        }
       
    }

    static previewImage = (e, container)=> {

      if(e.target.matches("[type='file']")){
        const img = container.querySelector('div.post__image img');
        const file = e.target.files[0];
        if(file){
          const imageUrl = URL.createObjectURL(file);
          img.src = imageUrl;
        }
      }

    }
   
}
