const variables = (function(){
  const $ = (el) => document.getElementById(el);
  
  const buttonLogin = $('btn-login');
  const gridPost = $('grid-post');
  const formLogin = $('form-login');
  const formSignup = $('form-sign');
  const openFormSignup = $('open-form-signup');
  const openFormLogin = $('open-form-login');
  const headerNav = $('header-nav');
  const articlePost = $('article-post');
  const listComments = $('list-comments');
  const formComments = $('form-comment');
  const totalComments = $('total-comments');


  return {buttonLogin, gridPost, formLogin, formSignup, openFormLogin, openFormSignup, headerNav, articlePost, listComments, formComments, totalComments};
})();
export default variables;