// Photo customization stays on this device until an order backend is connected.
const basicOpenProduct=openProduct;
openProduct=function(id){
 basicOpenProduct(id);
 const p=products.find(p=>p.id===id);
 if(!p.photoRequired)return;
 let selected=null,version=0;
 const action=$('#detail-add');
 const upload=document.createElement('section');upload.className='photo-upload';
 upload.innerHTML='<label for="product-photo">Ürününe basılacak fotoğraf <span aria-hidden="true">*</span></label><p class="upload-hint" id="photo-hint">JPG veya PNG · En fazla 2 MB. Net ve aydınlık bir fotoğraf seç.</p><input id="product-photo" type="file" accept="image/jpeg,image/png" aria-describedby="photo-hint photo-error"><div id="photo-preview" hidden><img id="uploaded-photo" alt="Seçtiğin fotoğrafın önizlemesi"><span id="photo-name"></span><button type="button" id="remove-photo">Fotoğrafı kaldır</button></div><p class="photo-error" id="photo-error" role="status" aria-live="polite"></p><p class="upload-hint">Taslakta fotoğraf yalnızca bu tarayıcıda saklanır; atölyeye gönderilmez. Önizleme, ürün baskısının birebir görünümü değildir.</p>';
 action.before(upload);
 const input=$('#product-photo'),preview=$('#photo-preview'),error=$('#photo-error');
 action.disabled=true;
 function clear(){version++;selected=null;input.value='';preview.hidden=true;$('#uploaded-photo').removeAttribute('src');$('#photo-name').textContent='';error.textContent='';action.disabled=true}
 $('#remove-photo').onclick=clear;
 input.onchange=()=>{
  const file=input.files[0];selected=null;preview.hidden=true;action.disabled=true;error.textContent='';const current=++version;
  if(!file)return;
  if(!['image/jpeg','image/png'].includes(file.type)){error.textContent='Lütfen JPG veya PNG biçiminde bir fotoğraf seç.';return}
  if(!file.size||file.size>2*1024*1024){error.textContent='Fotoğraf 2 MB veya daha küçük olmalı. Daha küçük bir dosya seç.';return}
  const reader=new FileReader();
  reader.onerror=()=>{if(current===version)error.textContent='Dosya okunamadı. Lütfen tekrar seç.'};
  reader.onload=()=>{
   if(current!==version)return;
   const data=reader.result;if(!mPhoto(data)){error.textContent='Bu dosya desteklenen bir fotoğraf değil.';return}
   const check=new Image();
   check.onload=()=>{if(current!==version)return;if(check.naturalWidth*check.naturalHeight>40000000){error.textContent='Fotoğrafın çözünürlüğü çok büyük. Daha küçük bir kopyasını seç.';return}selected={data,name:file.name};$('#uploaded-photo').src=data;$('#photo-name').textContent=file.name;preview.hidden=false;action.disabled=false};
   check.onerror=()=>{if(current===version)error.textContent='Fotoğraf açılamadı. Başka bir JPG veya PNG seç.'};check.src=data;
  };reader.readAsDataURL(file);
 };
 action.onclick=()=>{if(!selected){error.textContent='Sepete eklemeden önce bir fotoğraf seç.';return}if(add(id,$('#personal-note')?.value.trim()||'',selected))$('#product-dialog').close()};
};
add=function(id,note='',photo=null){
 const p=products.find(p=>p.id===id);if(!p)return false;
 if(p.photoRequired&&(!photo||!mPhoto(photo.data))){toast('Bu ürün için önce fotoğrafını seç.');return false}
 const next=cart.map(i=>({...i}));
 const match=next.find(i=>i.id===id&&i.note===note&&(i.photo||'')===(photo?.data||''));
 if(match)match.qty++;else next.push({id,qty:1,note,photo:photo?.data||'',photoName:photo?.name||''});
 try{localStorage.setItem('laleli-cart',JSON.stringify(next))}catch{toast('Tarayıcıda yer kalmadı. Daha küçük bir fotoğraf seç.');return false}
 cart=next;$('#count').textContent=cart.reduce((s,i)=>s+i.qty,0);toast(photo?'Fotoğrafın ve seçimin sepete eklendi.':'Güzel bir seçim. Sepetine eklendi.');return true;
};
const basicRenderCart=renderCart;
renderCart=function(){
 basicRenderCart();
 document.querySelectorAll('#cart-items .cart-row').forEach((row,index)=>{
  const item=cart[index];if(!item.photo||!mPhoto(item.photo))return;
  const wrapper=document.createElement('div');wrapper.className='cart-photo';const img=document.createElement('img');img.src=item.photo;img.alt='Bu ürün için seçtiğin fotoğraf';wrapper.append(img);row.querySelector('svg').replaceWith(wrapper);
  const label=document.createElement('small');label.className='cart-photo-name';label.textContent='Fotoğraf: '+item.photoName;row.children[1].append(label);
 });
 if(cart.some(i=>i.photo)){
  const info=document.createElement('p');info.className='upload-hint';info.textContent='Fotoğraflar bu tarayıcıda saklanır. Seçimlerimi indir dosyası yalnızca metin içerir; fotoğraflar atölyeye gönderilmez.';$('#cart-bottom').append(info);
 }
};
