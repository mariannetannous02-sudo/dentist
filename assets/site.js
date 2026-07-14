/* Shared behaviour for Dents & Doctors subpages */
(function(){
  'use strict';

  /* Scroll reveal */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, {threshold:.12});
  document.querySelectorAll('.fade-in').forEach(function(el){ io.observe(el); });

  /* Pre-select a subject from ?fach= (e.g. termin.html?fach=zahnarzt) */
  var params = new URLSearchParams(location.search);
  var fach = params.get('fach');
  if(fach){
    var sel = document.querySelector('select[data-prefill="fach"]');
    if(sel){
      Array.prototype.forEach.call(sel.options, function(o){
        if(o.value === fach){ o.selected = true; }
      });
    }
  }
  var stelle = params.get('stelle');
  if(stelle){
    var sSel = document.querySelector('select[data-prefill="stelle"]');
    if(sSel){
      var found = false;
      Array.prototype.forEach.call(sSel.options, function(o){
        if(o.value === stelle){ o.selected = true; found = true; }
      });
      if(!found){
        var opt = document.createElement('option');
        opt.value = stelle; opt.textContent = stelle; opt.selected = true;
        sSel.appendChild(opt);
      }
    }
  }

  /* Static-site form handling: build a mailto: so the message really leaves. */
  document.querySelectorAll('form[data-mailto]').forEach(function(form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }

      var to = form.getAttribute('data-mailto');
      var subject = form.getAttribute('data-subject') || 'Anfrage über die Website';
      var lines = [];
      Array.prototype.forEach.call(form.elements, function(el){
        if(!el.name || el.type === 'checkbox' && !el.checked) return;
        if(el.type === 'submit' || el.type === 'button') return;
        var label = el.getAttribute('data-label') || el.name;
        var val = el.type === 'checkbox' ? 'Ja' : el.value;
        if(val) lines.push(label + ': ' + val);
      });
      var body = lines.join('\n');
      var href = 'mailto:' + to +
                 '?subject=' + encodeURIComponent(subject) +
                 '&body=' + encodeURIComponent(body);

      var msg = form.parentNode.querySelector('.form-msg');
      if(msg){ msg.classList.add('show'); }
      window.location.href = href;
    });
  });
})();
