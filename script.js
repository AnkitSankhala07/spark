const $=s=>document.querySelector(s);
const tabs=$("#tabs"),list=$("#list"),q=$("#q");
let cur=0;
const rs=n=>"₹"+n;
function row(it){const li=document.createElement("li");li.innerHTML=`<span></span><b>${rs(it.p)}</b>`;li.firstChild.textContent=it.n;return li}
function render(){
  list.innerHTML="";
  const term=q.value.trim().toLowerCase();
  if(term){
    let n=0;
    MENU.forEach(c=>{const hit=c.items.filter(i=>i.n.toLowerCase().includes(term));if(!hit.length)return;n+=hit.length;
      const h=document.createElement("h3");h.textContent=c.name;const u=document.createElement("ul");hit.forEach(i=>u.append(row(i)));list.append(h,u)});
    if(!n){list.innerHTML='<p class="empty">Nothing matches that. Try a shorter word like "paneer" or "naan".</p>'}
    return;
  }
  const c=MENU[cur];
  const h=document.createElement("h3");h.innerHTML=`${c.name}<small></small>`;h.querySelector("small").textContent=c.unit;
  const u=document.createElement("ul");c.items.forEach(i=>u.append(row(i)));list.append(h,u);
}
MENU.forEach((c,i)=>{const b=document.createElement("button");b.textContent=c.name;b.setAttribute("role","tab");b.setAttribute("aria-selected",i==cur);
  b.onclick=()=>{cur=i;q.value="";tabs.querySelectorAll("button").forEach((x,j)=>x.setAttribute("aria-selected",j==i));render()};tabs.append(b)});
q.addEventListener("input",render);render();

// Open-now status in Indian time
function status(){
  const t=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Kolkata"}));
  const m=t.getHours()*60+t.getMinutes();
  const slots=[[660,930,"Lunch","3:30 PM"],[1140,1380,"Dinner","11:00 PM"]];
  const s=slots.find(x=>m>=x[0]&&m<x[1]);
  $("#status").innerHTML=s?`<b>Open now.</b> ${s[2]} is served until ${s[3]}.`:
    m<660?"Opens at 11:00 AM for lunch.":m<1140?"Closed between meals. Dinner starts at 7:00 PM.":"Closed for tonight. Lunch starts at 11:00 AM.";
}
status();

// Mobile nav
const burger=document.querySelector(".burger"),nav=$("#links");
burger.onclick=()=>{const o=nav.classList.toggle("open");burger.setAttribute("aria-expanded",o)};
nav.addEventListener("click",e=>{if(e.target.tagName=="A"){nav.classList.remove("open");burger.setAttribute("aria-expanded",false)}});

// Enquiry goes to WhatsApp
$("#form").addEventListener("submit",e=>{
  e.preventDefault();const f=new FormData(e.target);
  const msg=`Hello The Sparkling, I am ${f.get("name")}. I would like to enquire about: ${f.get("occ")}`+
    (f.get("guests")?`, around ${f.get("guests")} guests`:"")+(f.get("date")?`, on ${f.get("date")}`:"")+". Please share availability and details.";
  window.open("https://wa.me/919409322022?text="+encodeURIComponent(msg),"_blank","noopener");
});
$("#yr").textContent=new Date().getFullYear();

// Reveal content as it enters the viewport.
const revealItems=document.querySelectorAll("main section:not(.hero), .gallery img, .services li");
revealItems.forEach((item,index)=>{item.classList.add("reveal");item.style.transitionDelay=`${Math.min(index%6,5)*70}ms`});
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target)}});
},{threshold:.12});
revealItems.forEach(item=>revealObserver.observe(item));
