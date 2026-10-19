const products = [
  {id:1,name:"Monstera Deliciosa",category:"hias",price:85000,emoji:"🌿",meaning:"Pertumbuhan & perkembangan",desc:"Daun unik untuk ruang yang terasa hidup."},
  {id:2,name:"Lavender",category:"aromatik",price:65000,emoji:"💜",meaning:"Ketenangan & kedamaian",desc:"Aroma lembut untuk suasana yang menenangkan."},
  {id:3,name:"Sansevieria",category:"hias",price:55000,emoji:"🌱",meaning:"Ketahanan & kekuatan",desc:"Tanaman tangguh yang mudah dirawat."},
  {id:4,name:"Peace Lily",category:"hias",price:75000,emoji:"🤍",meaning:"Kedamaian & keharmonisan",desc:"Bunga putih untuk sudut ruang yang tenang."},
  {id:5,name:"Kaktus Mini",category:"sukulen",price:35000,emoji:"🌵",meaning:"Keteguhan & daya tahan",desc:"Kecil, unik, dan tidak mudah menyerah."},
  {id:6,name:"Calathea",category:"hias",price:95000,emoji:"🍀",meaning:"Awal baru & keindahan",desc:"Pola daun cantik untuk mempermanis ruangan."}
];

let cart = JSON.parse(localStorage.getItem("ruangHijauCart") || "[]");

function rupiah(n){ return "Rp" + n.toLocaleString("id-ID"); }

function productCard(p){
  return `<article class="product-card">
    <div class="product-image">${p.emoji}</div>
    <div class="product-info">
      <span class="tag">${p.meaning}</span>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price-row"><span class="price">${rupiah(p.price)}</span><button class="add-btn" onclick="addToCart(${p.id})">+ Keranjang</button></div>
    </div>
  </article>`;
}

function renderProducts(list=products){
  const el=document.getElementById("productGrid");
  if(!el)return;
  el.innerHTML=list.length ? list.map(productCard).join("") : `<div class="empty">Tanaman yang kamu cari belum ditemukan 🌱</div>`;
}

function renderFeatured(){
  const el=document.getElementById("featuredProducts");
  if(el) el.innerHTML=products.slice(0,3).map(productCard).join("");
}

function filterProducts(){
  const q=(document.getElementById("searchInput")?.value || "").toLowerCase();
  const cat=document.getElementById("categoryFilter")?.value || "all";
  const result=products.filter(p=>(p.name.toLowerCase().includes(q)||p.meaning.toLowerCase().includes(q))&&(cat==="all"||p.category===cat));
  renderProducts(result);
}

function addToCart(id){
  const p=products.find(x=>x.id===id);
  const existing=cart.find(x=>x.id===id);
  if(existing) existing.qty++;
  else cart.push({...p,qty:1});
  saveCart(); updateCartCount(); showToast(`${p.name} ditambahkan ke keranjang 🌿`);
}

function saveCart(){localStorage.setItem("ruangHijauCart",JSON.stringify(cart));}
function updateCartCount(){const el=document.getElementById("cartCount");if(el)el.textContent=cart.reduce((a,b)=>a+b.qty,0)}

function openCart(){
  const modal=document.getElementById("cartModal"); if(!modal)return;
  modal.classList.add("show"); renderCart();
}
function closeCart(){document.getElementById("cartModal")?.classList.remove("show");}

function renderCart(){
  const el=document.getElementById("cartItems"), total=document.getElementById("cartTotal");
  if(!el)return;
  if(!cart.length){el.innerHTML='<p class="empty">Keranjang masih kosong 🌱</p>'; if(total)total.textContent="Rp0";return;}
  el.innerHTML=cart.map(p=>`<div class="cart-row"><div><b>${p.emoji} ${p.name}</b><small>${rupiah(p.price)} × ${p.qty}</small></div><div><b>${rupiah(p.price*p.qty)}</b><br><button class="remove" onclick="removeFromCart(${p.id})">Hapus</button></div></div>`).join("");
  const sum=cart.reduce((a,b)=>a+b.price*b.qty,0); if(total)total.textContent=rupiah(sum);
}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();updateCartCount();renderCart();showToast("Tanaman dihapus dari keranjang");}
function checkout(){if(!cart.length){showToast("Keranjang masih kosong 🌱");return;}showToast("Pesanan demo berhasil dibuat!");cart=[];saveCart();updateCartCount();renderCart();}
function showToast(msg){const el=document.getElementById("toast");if(!el)return;el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200);}
function sendMessage(e){e.preventDefault();const name=document.getElementById("contactName").value;showToast(`Terima kasih, ${name}! Pesanmu diterima 🌿`);e.target.reset();}
window.addEventListener("click",e=>{const m=document.getElementById("cartModal");if(e.target===m)closeCart();});
