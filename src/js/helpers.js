
export const redirect = (path)=> window.location.href = path;

export const generateHTML = (el, clas = '', content= '', parent = null, atr = null) => {
    const item = document.createElement(el);
    if (clas) item.classList.add(clas);
    if (content) item.textContent = content;
    if (parent) parent.appendChild(item);
    if(atr) {
        for(const [key, value] of Object.entries(atr)){
            item.setAttribute(key, value);
        }
    }
    return item;
}

export const show = (el, dis = 'flex') => el.style.display = dis;

export const hide = (el) => window.getComputedStyle(el).display !== 'none'? el.style.display = 'none' : false;

export const appendElement = (container, el, nodeRef, needInsertBefore = true) => {
  needInsertBefore? container.insertBefore(el, nodeRef) : container.appendChild(el);
};

export const removeErrorsOrSuccess = (container) => container.querySelectorAll('.error, .success')?.forEach(el => el.remove());

export const resetForm = (form = null) =>  {
    if (!form) return;
    if (form && form.matches('form')) form.reset();
    removeErrorsOrSuccess(form);
    form.querySelectorAll('input')?.forEach(input => input.style.borderColor = '#bdbdbd');
}

export const formatedDate = (date) =>  ' ' +  new Date(date).toDateString();

export const formateTags = (tags) => tags.split(', ').map(tag => `#${tag}`).join(' ');

export const getParams = (prm) => {
  const params = new URLSearchParams(window.location.search);
  const param = params.get(prm);
  return param;
}