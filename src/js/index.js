import '../sass/app.scss';
import { createPost, getRequest, postRequest, postLogout, deleteRequest, patchRequest } from "./fetching.js";
import { enabledForm, resRedirect, inserAndClearHTML } from './helpers.js';
import UI from "./UI.js";
import Components from './Component.js';
import v from "./variables.js";
import env from './env.js'

const handleEdit = async (e) => {
      enabledForm(e, v.formEdit, v.formUser, v.formPost);
      const posts = await getRequest(env.READ_POST);
      const { data } = posts;
    
      if(!data.length){
         inserAndClearHTML(v.formEdit, Components.defaultMessage('No posts available to edit right now'));
         return;
      }
      
      const fieldBlock =  Components.fieldSelectForm(data);
      inserAndClearHTML(v.formEdit, fieldBlock);
     
}

const getSelectedPost = async () => {
    const selectedPost = v.formEdit['select-post'].value;
    const post = await getRequest(`read/${selectedPost}/post`);
    const currentPost = v.formEdit.querySelector('.post');
    currentPost? v.formEdit.replaceChild(Components.post(post), currentPost) : v.formEdit.appendChild(Components.post(post));
}

const handleDelete = async (e) => {
   const alreadyConfirm = v.formEdit.querySelector('.confirm');
   if(alreadyConfirm) return;

   const {promise, confirm} = Components.messageConfirmAction('Are you sure you want to delete this post?');
  
   e.target.parentElement.insertAdjacentElement('afterend', confirm);
   try{
    await promise;
    const pid = e.target.closest("[data-pid]").dataset.pid;
    deleteRequest(`delete/${pid}/post`, (data)=> {
      console.log(data);
      v.btnPostEdit.click();
      setTimeout(()=>  UI.renderFeedback(data, v.formEdit), 200);
    });
   }
   catch(err){
    console.log(err);
   }
   finally{
    confirm.remove();
   }
}

const resquestEdit = (e) => {
  e.preventDefault();
  const {pid} = e.target.querySelector("[data-pid]").dataset;
  if(!pid) return;
  patchRequest(`edit/${pid}/post`, e.target, (data) => UI.renderFeedback(data, e.target.querySelector('fieldset'), false));
}

const deleteComment = (e) => {
  const {action} = e.target?.dataset;
  if(action && action === env.DELETE_COMMENT){
    const parent = e.target.closest("li[data-cid]");
    const {cid} = parent.dataset;
    deleteRequest(`delete/${cid}/comment`, (data) => {
      parent.remove();
    })
  };


}

const handleEvents = (e) => {
    deleteComment(e);

    switch(e.target.id){
      case env.BTN_USER:
        enabledForm(e, v.formUser, v.formPost, v.formEdit)
      break;
      case env.BTN_POST:
        enabledForm(e, v.formPost, v.formUser, v.formEdit)
      break;
      case env.BTN_EDIT:
        handleEdit(e);
      break;
      case env.BTN_DELETE_POST:
        handleDelete(e);
      break;
      case env.BTN_GET_POST:
       getSelectedPost();
      break;
      default: return;
      ;
    }
}
v.dashboard.addEventListener('click', handleEvents);

v.formPost.addEventListener('submit', (e)=> createPost(e, v.formPost, (data) => UI.renderFeedback(data, v.formPost)));
v.formUser.addEventListener('submit', (e)=> postRequest(e, env.CREATE_USER,v.formUser, (data)=>  UI.renderFeedback(data,v.formUser)));
v.formEdit.addEventListener('submit', resquestEdit);
v.formEdit.addEventListener('change', (e) => UI.previewImage(e, v.formEdit));

v.formLogin.addEventListener('submit', (e) => postRequest(e, env.LOGIN, v.formLogin, ()=> resRedirect(v.formLogin)));
v.btnLogout.addEventListener('click', ()=> postLogout(()=> resRedirect(null)));
getRequest( env.AUTH_STATUS, UI.renderDashboard);


