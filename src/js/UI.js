import Component from './Components.js';
import v from './variables.js';
import { show, hide, appendElement, removeErrorsOrSuccess, resetForm } from './helpers.js';
export default class UI{
  
  static renderPreviewPost = (data)=>{

    const {data:post} = data;
    const fragment = document.createDocumentFragment();

    post.forEach(post => {
      fragment.appendChild(Component.previewPost(post));
    })

    v.gridPost.replaceChildren(fragment);
  }

  static toggleForm = (visibleForm, hideForm) => {
    hide(hideForm);
    show(visibleForm);
    resetForm(visibleForm);
  }

  
  static showFieldError(input, msg) {
    input.style.borderColor = 'red';
    const errorMsg = Component.errorElement(msg, input.parentElement);
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
    const error = Component.errorElement(msg === 'Failed to fetch'? 'The server is not responding. Please try again later': msg);
    appendElement(container, error, container.firstChild);
    setTimeout(()=> error.remove(), 5000);
  }

  static renderFeedback = (data, form, needResetForm = false) => {
    removeErrorsOrSuccess(form);
    if(needResetForm) form.reset();
    const success = Component.successElement(data.message);
    appendElement(form, success, form.firstChild);
    setTimeout(()=> success.remove(), 7000);
  }

  static renderUsername = ({data}) => {
    if(!data)return;
    const username = Component.usernameElement(data.username);
    v.formLogin? appendElement(v.headerNav, username, null, false) : appendElement(v.headerNav, username, v.headerNav.firstChild);
  }

  static renderPost = ({data}) => {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(Component.post(data));
    appendElement(v.articlePost, fragment, null, false);
  
  }

  static renderComments = ({data}) => {
    const {comments} = data;
    if(!comments.length) return;
    
    const fragment = document.createDocumentFragment();

    comments.forEach(comment => {
      fragment.appendChild(Component.comment(comment));
    })

    v.listComments.replaceChildren(fragment);
  }

  static assignTotalComments = ({data}) => {
    const {comments} = data;
    v.totalComments.textContent = `(${comments.length})`;
  }

}