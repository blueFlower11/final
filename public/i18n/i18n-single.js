(function(){
  const STORAGE_KEY="app_lang";
  const TRANSLATIONS_PATH=window.I18N_TRANSLATIONS_PATH||"/i18n/translations.json";
  const SWITCH_STYLE=window.I18N_SWITCH_STYLE||"pill";
  const state={translations:{},supported:[],defaultLang:(window.I18N_DEFAULT||"en").toLowerCase(),lang:null,ready:false};
  function get(o,p,f=""){if(!o||!p)return f;return p.split(".").reduce((a,k)=>(a&&(k in a)?a[k]:undefined),o)??f}
  function interp(s,v){if(!v)return s;return String(s).replace(/\{\{(\w+)\}\}/g,(_,k)=>(k in v?v[k]:`{{${k}}}`))}
  function t(k,v){const d=state.translations[state.lang]||{};return interp(get(d,k,k),v)}
  function trEl(el){const k=el.getAttribute("data-i18n"); if(k) el.textContent=t(k);
    const ph=el.getAttribute("data-i18n-placeholder"); if(ph&&(el instanceof HTMLInputElement||el instanceof HTMLTextAreaElement)) el.placeholder=t(ph);
    const ti=el.getAttribute("data-i18n-title"); if(ti) el.title=t(ti);
  }
  function trAll(){document.querySelectorAll("[data-i18n],[data-i18n-placeholder],[data-i18n-title]").forEach(trEl);document.dispatchEvent(new CustomEvent("i18n:translated",{detail:{lang:state.lang}}));}
  function el(tag,cls,html){const e=document.createElement(tag); if(cls) e.className=cls; if(html) e.innerHTML=html; return e;}
  function build(){const root=el("div",`i18n-switch i18n-${SWITCH_STYLE}`); const ul=el("ul","i18n-list"); root.appendChild(ul);
    state.supported.forEach(code=>{const li=el("li","i18n-item"); const btn=el("button","i18n-btn"); btn.type="button"; btn.dataset.lang=code; btn.setAttribute("aria-label",`Switch language to ${code}`); btn.textContent=code.toUpperCase(); btn.addEventListener("click",()=>setLanguage(code)); li.appendChild(btn); ul.appendChild(li);});
    document.body.appendChild(root);
  }
  function mark(lang){document.querySelectorAll(".i18n-btn").forEach(btn=>{const a=btn.dataset.lang===lang; btn.classList.toggle("active",a); btn.setAttribute("aria-pressed",a?"true":"false");});}
  async function load(){const res=await fetch(TRANSLATIONS_PATH,{cache:"no-store"}); if(!res.ok) throw new Error("Failed to load "+TRANSLATIONS_PATH+" ("+res.status+")"); const data=await res.json(); state.translations=data||{}; state.supported=Object.keys(state.translations).map(s=>s.toLowerCase());}
  async function setLanguage(lang){lang=String(lang||"").toLowerCase(); if(!state.supported.includes(lang)){lang=state.defaultLang;} state.lang=lang; localStorage.setItem(STORAGE_KEY,lang); trAll(); mark(lang);}
  async function init(){ try{await load();}catch(e){return console.error("[i18n]",e);}
    const browser=(navigator.language||"en").split("-")[0].toLowerCase();
    state.defaultLang=(window.I18N_DEFAULT||(state.supported.includes(browser)?browser:"en")).toLowerCase();
    state.lang=(localStorage.getItem(STORAGE_KEY)||state.defaultLang).toLowerCase();
    build(); state.ready=true; await setLanguage(state.lang);
    const obs=new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{ if(n.nodeType===1){ if(n.hasAttribute?.("data-i18n")||n.hasAttribute?.("data-i18n-placeholder")||n.hasAttribute?.("data-i18n-title")) trEl(n); n.querySelectorAll?.("[data-i18n],[data-i18n-placeholder],[data-i18n-title]").forEach(trEl);} }))); obs.observe(document.documentElement,{childList:true,subtree:true});
    window.I18N={t,setLanguage,get current(){return state.lang;}, get supported(){return state.supported.slice();}, get dict(){return state.translations[state.lang]||{}}};
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);} else {init();}
})();