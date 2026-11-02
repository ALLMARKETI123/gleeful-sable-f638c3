const products = [{
  id: 1,
  name: 'ვერცხლის სამკაული',
  category: 'jewelry',
  price: 75,
  image: '/images/silver-jewelry.avif',
  badge: 'სიახლე'
}];
const categoryNames={jewelry:'სამკაულები',home:'საოჯახო ნივთები',nature:'ბუნების წიაღი',sundries:'წვრილმანები'};
const money=n=>`${n.toLocaleString('ka-GE')} ₾`;
const imageUrl=(p,w=600)=>p.image.startsWith('/')?p.image:`https://images.unsplash.com/${p.image}?auto=format&fit=crop&w=${w}&q=85`;
let currentFilter='all';
const cart=new Map();
const grid=document.querySelector('#product-grid');
const search=document.querySelector('#search-input');
function renderProducts(){let items=products.filter(p=>(currentFilter==='all'||(currentFilter==='new'?p.badge==='სიახლე':p.category===currentFilter))&&`${p.name} ${categoryNames[p.category]}`.includes(search.value.trim()));const sort=document.querySelector('#sort').value;if(sort!=='featured')items.sort((a,b)=>sort==='asc'?a.price-b.price:b.price-a.price);grid.innerHTML=items.map(p=>`<article class="product-card"><div class="product-image"><img src="${imageUrl(p)}" alt="${p.name}" loading="lazy">${p.badge?`<span class="product-badge ${p.old?'sale':''}">${p.badge}</span>`:''}<button class="add-button" data-add="${p.id}" aria-label="${p.name} — კალათაში დამატება"><svg><use href="#bag"/></svg></button></div><p class="product-category">${categoryNames[p.category]}</p><h3>${p.name}</h3><div class="product-price">${money(p.price)}${p.old?`<del>${money(p.old)}</del>`:''}</div></article>`).join('');document.querySelector('#empty-results').hidden=items.length>0;}
function setFilter(filter){currentFilter=filter;document.querySelectorAll('[data-filter]').forEach(b=>{const selected=b.dataset.filter===filter;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});renderProducts();}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.filter)));
document.querySelectorAll('[data-category]').forEach(a=>a.addEventListener('click',()=>{search.value='';setFilter(a.dataset.category)}));
document.querySelector('[data-nav-filter]').addEventListener('click',()=>{search.value='';setFilter('new')});
document.querySelector('#sort').addEventListener('change',renderProducts);
search.addEventListener('input',()=>{setFilter('all');document.querySelector('#products').scrollIntoView({behavior:'smooth'})});
document.querySelector('#reset-search').addEventListener('click',()=>{search.value='';setFilter('all')});
const searchPanel=document.querySelector('#search-panel');document.querySelector('#search-toggle').addEventListener('click',()=>{searchPanel.hidden=!searchPanel.hidden;if(!searchPanel.hidden)search.focus()});document.querySelector('#search-close').addEventListener('click',()=>{searchPanel.hidden=true;document.querySelector('#search-toggle').focus()});
const menu=document.querySelector('.header-inner nav');const menuButton=document.querySelector('#menu-toggle');menuButton.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open))});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}));
let toastTimer;function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2600)}
function cartTotals(){let total=0,count=0;cart.forEach((qty,id)=>{total+=products.find(p=>p.id===id).price*qty;count+=qty});return{total,count}}
function renderCart(){const {total,count}=cartTotals();document.querySelector('#cart-count').textContent=count;document.querySelector('#cart-footer').hidden=!count;document.querySelector('#cart-items').innerHTML=count?[...cart].map(([id,qty])=>{const p=products.find(p=>p.id===id);return `<article class="cart-item"><img src="${imageUrl(p,200)}" alt="${p.name}"><div><h3>${p.name}</h3><span class="product-price">${money(p.price*qty)}</span><div class="quantity-controls"><button data-change="${id}" data-step="-1" aria-label="რაოდენობის შემცირება">−</button><span>${qty}</span><button data-change="${id}" data-step="1" aria-label="რაოდენობის გაზრდა">+</button><button class="remove" data-remove="${id}">წაშლა</button></div></div></article>`}).join(''):'<p class="empty-cart">თქვენი კალათა ჯერ ცარიელია.<br>იპოვეთ თქვენი ახალი ფავორიტი.</p>';document.querySelector('#cart-total').textContent=money(total);document.querySelector('#delivery-note').textContent=total>100?'თბილისში მიწოდება უფასოა. თბილისის გარეთ მიწოდების ღირებულებას ოპერატორი დაგიზუსტებთ.':'თბილისში მიწოდება უფასოა 100 ₾-ზე მეტ შეკვეთაზე. სხვა შემთხვევაში მიწოდების ღირებულებას ოპერატორი დაგიზუსტებთ.';const summary=[...cart].map(([id,qty])=>{const p=products.find(p=>p.id===id);return `${p.name} × ${qty} — ${money(p.price*qty)}`}).join('; ');document.querySelector('#checkout').href=`https://wa.me/995555968302?text=${encodeURIComponent(`გამარჯობა, მსურს შეკვეთა: ${summary}. ჯამი: ${money(total)}`)}`;}
grid.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;const id=Number(b.dataset.add);cart.set(id,(cart.get(id)||0)+1);renderCart();toast('პროდუქტი დაემატა კალათაში')});
const dialog=document.querySelector('#cart-dialog');document.querySelector('#cart-open').addEventListener('click',()=>dialog.showModal());document.querySelector('#cart-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.querySelector('#cart-items').addEventListener('click',e=>{const remove=e.target.closest('[data-remove]');const change=e.target.closest('[data-change]');if(remove)cart.delete(Number(remove.dataset.remove));if(change){const id=Number(change.dataset.change);const qty=cart.get(id)+Number(change.dataset.step);if(qty<=0)cart.delete(id);else cart.set(id,qty)}renderCart()});
setFilter('all');renderCart();
