const variables = (function variables(){
    const $ = el => document.getElementById(el);
    const formLogin = $('form-login');
    const formPost = $('form-post');
    const formUser = $('form-user');
    const btnPostEdit = $('btn-edit-post');
    const containersAdmins = document.querySelectorAll('[data-id="admin"]');
    const btnLogout = $('log-out');
    const formEdit = $('form-edit');
    const dashboard = $('dashboard');


    Array.from(containersAdmins).forEach(container => container.style.display = 'none');
    return {formLogin, formPost, formUser, containersAdmins, btnLogout, btnPostEdit, formEdit, dashboard};
})();

export default variables;