import { generateHTML, formatedDate } from "./helpers.js"

export default class Components{

  static errorElement = (msg, parent) => generateHTML('P','error', msg, parent);

  static successElement = (msg) => generateHTML('P', 'success', msg);

  static defaultMessage = (msg, parent = null) => generateHTML('P', 'default-msg', msg, parent);

  static fieldInputForm = (forLabel, strLabel, nameInput, typeInput , idInput, val= null, textarea = false) => {
    const field = generateHTML('DIV','form__block');
    const label = generateHTML('LABEL', '', strLabel, field, {for: `${forLabel}`});
    const input = generateHTML(textarea? 'TEXTAREA' : 'INPUT', '', '', field,  {
      name: nameInput,
      ...(textarea ? { id: idInput } : { id: idInput, type: typeInput, value: val || '' })
    });

    if( textarea && val) input.textContent = val;
    return field; 
  }

  static fieldSelectForm = (data) => {
    
    const fieldBlock = generateHTML('div','form__block');
    const label = generateHTML('label','','Select Post:', fieldBlock, {for: 'select-post'});
    const divSeparator = generateHTML('div', 'form__block-select', '', fieldBlock);
    const select = generateHTML('select', '', '', divSeparator, {name: 'select_post', id: 'select-post'});
    const submitSelect = generateHTML('button', '', 'Get Post', divSeparator, {type: 'button', id: 'get-select-post'});

    data.forEach(post => generateHTML('option','',post.title, select, {value: `${post.id}`}));
    
    return fieldBlock;     
  }

  static messageConfirmAction = (msg) => {
   
    const confirm =  generateHTML('DIV', 'confirm' );
    const messageConfirm = generateHTML('P', '', msg, confirm);
    const blockBTN = generateHTML('DIV', 'confirm__btn', '', confirm);
    const btnConfirm = generateHTML('BUTTON', 'btn-edit', 'YES',blockBTN);
    const btnCancel = generateHTML('BUTTON', 'btn-delete', 'CANCEL',blockBTN);
  
    const promise = new Promise((resolve, reject) => {
     
      btnConfirm.onclick = ()=> resolve('');
      btnCancel.onclick = () => reject();
    })
    
    return {confirm, promise};

  }

  static post = ({data})=> {
    const fragment = document.createDocumentFragment();

    const postElement = generateHTML('FIELDSET', 'post', '', fragment, {'data-pid': data.id} );
    const headerBlock = generateHTML('H2', '', 'POST:', postElement);

    const blockDate = generateHTML('DIV', 'post__date', '', postElement);
    const labelCreatedAt = generateHTML('P', '', 'Created At:', blockDate);
    const dateCreated = generateHTML('SPAN', '',  formatedDate(data.createdAt), labelCreatedAt);
    const labelLastUpdate = generateHTML('P', '', 'Latest Update:', blockDate);
    const dateLastUpdate = generateHTML('SPAN', '', formatedDate(data.updatedAt), labelLastUpdate);

    const blockImage = generateHTML('DIV', 'post__image', '', postElement);
    const image = generateHTML('IMG', '', '', blockImage, {src: data.image, loading: 'lazy', width: '100px', height: '100px', alt:'Image Post'});
    blockImage.appendChild(this.fieldInputForm('image-edit', 'Replace Image:', 'image', 'file', 'image-edit'));
   
    const title = this.fieldInputForm('title-edit', 'Title', 'title', 'text', 'title-edit', data.title);

    const author = this.fieldInputForm('author-edit', 'Author', 'author', 'text', 'author-edit', data.author);
   
    const tags = this.fieldInputForm('tags-edit', 'Tags:','tags', 'text','tags-edit', data.tags);
  
    const content = this.fieldInputForm('content-edit', 'Content:', 'content', 'text', 'content-edit', data.content, true);
    postElement.append(title, author, tags, content);


    const blockActionBTN = generateHTML('DIV','post__btn', '', postElement);
    const buttonSubmitEdit = generateHTML('BUTTON', 'btn-edit', 'Save Changes', blockActionBTN, {type: 'submit'});
    const buttonDeletePost = generateHTML('BUTTON','btn-delete', 'Delete Post', blockActionBTN, {id: 'delete-post', type: 'button'});


    const blockComments = generateHTML('DIV', 'post__comments', '', postElement);
    const headerComments = generateHTML('H2', '', 'Comments:', blockComments);
   

    if(data.comments.length){
      const listComments = generateHTML('UL', '', '', blockComments);
      data.comments.forEach(comment => {
        const liComment = generateHTML('LI','','',listComments, {'data-cid': comment.id});
        const blockComment = generateHTML('DIV', '', '', liComment);
        const dateCreated = generateHTML('SPAN', '', formatedDate(comment.createdAt), blockComment);
        const deleteButton = generateHTML('BUTTON', 'btn-delete', 'Delete', blockComment, {'data-action': 'delete-comment', type: 'button'});
        const author = generateHTML('SPAN', '', 'From: '+ comment.author, liComment);
        const content = generateHTML('P', '', comment.content, liComment);
      })
      //añadir la imagen para eliminar aqui, la imagen de los comentarios
    }
    else{
      const notComments = this.defaultMessage('There are no comments yet', blockComments);
    }
   
    return fragment;

  }

  
}