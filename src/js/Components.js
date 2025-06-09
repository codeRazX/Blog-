import { generateHTML, formatedDate, formateTags } from "./helpers.js"
import { postLogout } from "./fetching.js";

export default class Component{

  static errorElement = (msg, parent) => generateHTML('P','error', msg, parent);

  static successElement = (msg) => generateHTML('P', 'success', msg);

  static usernameElement = (nick) => {
      const username = generateHTML('P', '', `Welcome ${nick}, `);
      const linkSignUp = generateHTML('A','header__nav-logout', ' Sign out', username, {href: 'index.html'});
    
      linkSignUp.addEventListener('click', ()=> postLogout((data) => {
        console.log(data);
        username.remove();
      }))
      return username;
  }

  static previewPost = (post) => {

    const prePost = generateHTML('DIV', 'preview-post', '', '', {'data-id': post.id});
    const image = generateHTML('IMG', '', '', prePost, {src: post.image, loading: 'lazy', alt: 'Preview Image Post', width: '100px', height: '100px'});
    const blockInfo = generateHTML('P', 'preview-post-info', '', prePost, {'data-action': 'open-post'});
    const title = generateHTML('P', '', post.title, blockInfo);
    const buttonRedirectPost = generateHTML('A', '', 'Read', blockInfo, {href: `post.html?pid=${post.id}`, target: '_blank'});
    
    return prePost;
  }

  static post = (data) => {
    const {title, author, content, updatedAt, image, tags, id, comments} = data;
   
    const block = generateHTML('DIV', 'post', '', '', {'data-pid': id});
    const titleDOM = generateHTML('H2', 'post__title', title, block);

    const fieldDate = generateHTML('P', '','',block);
    const dateDOM = generateHTML('SPAN', `post__date`, formatedDate(updatedAt), fieldDate);
    const authorDOM = generateHTML('SPAN', 'post__author', author, fieldDate);  
    
    const tagsDOM = generateHTML('P', 'post__tags', formateTags(tags), block);

    const imgageDOM = generateHTML('IMG', 'post__image', '', block, {src: image, alt: 'Decorative image for a post', lading: 'lazy', witdh: '100px', height: '100px'});

    const contentPost = generateHTML('DIV', 'post__content', '', block);
    contentPost.innerHTML = content;

    return block;
  }

  static comment = (data)=> {
    const comment = generateHTML('LI');
    const user = generateHTML('P', 'comments__list-user', data.author + ' - ', comment);
    const date = generateHTML('SPAN', '', formatedDate(data.createdAt), user);
    const content = generateHTML('P', 'comments__list-content', data.content, comment);
    return comment;
  }
}