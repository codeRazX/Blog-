import '../sass/app.scss';
import v from './variables.js';

import { requestGet, postRequest } from './fetching.js';
import env from './env.js';
import UI from './UI.js';
import { redirect, getParams } from './helpers.js';


if(v.gridPost){
  requestGet(env.GET_POST, (data) => UI.renderPreviewPost(data));
}

if(v.formLogin || v.formSignup){
  v.openFormSignup.addEventListener('click', (e)=> UI.toggleForm(v.formSignup, v.formLogin));
  v.openFormLogin.addEventListener('click', (e)=> UI.toggleForm(v.formLogin, v.formSignup));
  v.formLogin.addEventListener('submit', (e) => postRequest(e, env.LOGIN, v.formLogin, (data)=> redirect('index.html')));
  v.formSignup.addEventListener('submit', (e) => postRequest(e, env.SIGN_UP, v.formSignup, (data) => {
  UI.toggleForm(v.formLogin, v.formSignup);
  UI.renderFeedback(data, v.formLogin);
  }));
}

if(v.articlePost){
   const pid = getParams('pid');
   requestGet(`read/${pid}/post/public`, (data)=> {
    UI.renderPost(data);
    UI.renderComments(data);
    UI.assignTotalComments(data);
   });
}

if(v.formComments){
  const pid = getParams('pid');
  v.formComments.addEventListener('submit',(e)=> postRequest(e, `create/${pid}/comment`, v.formComments, (data) => {
    UI.renderFeedback(data, v.formComments, true);
    UI.renderComments(data);
    UI.assignTotalComments(data);
  }));
}
requestGet(env.AUTH_STATUS, (data) => UI.renderUsername(data));
