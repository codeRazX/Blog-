
export const show = (el, display = 'flex') => {
    const dis = window.getComputedStyle(el).display;
    if(display !== dis) el.style.display = display;
}

export const hide = (el) => {
    const display = window.getComputedStyle(el).display;
    if(display !== 'none') el.style.display = 'none';
}

export const removeClass = (el, clas) => el.classList.remove(clas);

export const insertBefore = (container, el, nodeRef) => container.insertBefore(el, nodeRef);

export const resetForm = (form = null) =>  {
    if (!form) return;
    if (form && form.matches('form')) form.reset();
    removeErrorsOrSuccess(form);
    form.querySelectorAll('input, textarea')?.forEach(input => input.style.borderColor = '#bdbdbd');
}

export const inserAndClearHTML = (container, newNode) => container.replaceChildren(newNode);

export const resRedirect = (form = null)=> {
    resetForm(form);
    window.location.href = '/';
}
export const removeErrorsOrSuccess = (container) => container.querySelectorAll('.error, success')?.forEach(el => el.remove());

export const formatedDate = (date) =>  ' ' +  new Date(date).toDateString();

export const enabledForm = (e, formToShow, ...formExcludes) => {
   
    formExcludes.forEach(form => {
        hide(form);
    })
    document.querySelectorAll('.btn-actived').forEach(btn => removeClass(btn, 'btn-actived'));
    resetForm(formToShow);
    show(formToShow, 'flex');
    e.target.classList.add('btn-actived');
}


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
