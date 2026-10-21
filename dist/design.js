document.querySelectorAll('[data-category-link]').forEach(link=>link.addEventListener('click',()=>{
 const filter=Array.from(document.querySelectorAll('[data-cat]')).find(b=>b.dataset.cat===link.dataset.categoryLink);
 if(filter)filter.click();
}));
document.querySelector('#photo-discover').addEventListener('click',()=>openProduct(5));
