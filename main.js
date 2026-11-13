(function(){
    var root=document.documentElement;
  
    document.getElementById("theme").addEventListener("click",function(){
      var next=root.getAttribute("data-theme")==="light"?"dark":"light";
      root.setAttribute("data-theme",next);
      try{localStorage.setItem("mirage:theme",next)}catch(e){}
    });
  
    /* Галерея: появление карточек при прокрутке */
    var gallery=document.getElementById("gallery");
    var items=gallery.querySelectorAll(".g-item");
    if("IntersectionObserver" in window){
      gallery.classList.add("armed");
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target)}
        });
      },{threshold:0.15});
      items.forEach(function(el){io.observe(el)});
    }
  
    /* Модальное окно: один общий <dialog>, содержимое берётся из data-атрибутов нажатой карточки */
    var dlg=document.getElementById("gdlg");
    gallery.addEventListener("click",function(e){
      var card=e.target.closest(".g-card");
      if(!card)return;
      document.getElementById("gdlg-t").textContent=card.dataset.name;
      document.getElementById("gdlg-en").textContent=card.dataset.en;
      document.getElementById("gdlg-closes").textContent=card.dataset.closes;
      document.getElementById("gdlg-when").textContent=card.dataset.when;
      document.getElementById("gdlg-tip").textContent=card.dataset.tip;
      dlg.showModal();
      root.style.overflow="hidden";
    });
    document.getElementById("gdlg-x").addEventListener("click",function(){dlg.close()});
    document.getElementById("gdlg-ok").addEventListener("click",function(){dlg.close()});
    dlg.addEventListener("click",function(e){if(e.target===dlg)dlg.close()}); /* клик по затемнению */
    dlg.addEventListener("close",function(){root.style.overflow=""});
  
    /* Заметки сохраняются в браузере */
    document.querySelectorAll("textarea[data-f]").forEach(function(el){
      var k="mirage:"+el.dataset.f;
      try{el.value=localStorage.getItem(k)||""}catch(e){}
      el.addEventListener("input",function(){try{localStorage.setItem(k,el.value)}catch(e){}});
    });
  
    /* Форма. Пока ENDPOINT пустой, данные никуда не уходят (демо-режим) */
    var ENDPOINT=""; /* например https://formspree.io/f/xxxxxxx */
    var form=document.getElementById("signupForm"),msg=document.getElementById("formMsg"),btn=document.getElementById("formBtn");
    form.addEventListener("submit",function(e){
      e.preventDefault();
      var name=form.name.value.trim(),email=form.email.value.trim();
      if(!name||!/^\S+@\S+\.\S+$/.test(email)){msg.textContent="Введите имя и корректный email.";return}
      if(!ENDPOINT){msg.textContent="Демо-режим: форма пока не подключена к серверу, данные не отправлены.";return}
      btn.disabled=true;msg.textContent="Отправляем…";
      fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({name:name,email:email})})
        .then(function(r){if(!r.ok)throw new Error("http");msg.textContent="Спасибо! Вы подписаны.";form.reset()})
        .catch(function(){msg.textContent="Не удалось отправить. Попробуйте позже."})
        .then(function(){btn.disabled=false});
    });
  })();
  
