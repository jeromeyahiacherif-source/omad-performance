'use strict';
var M={
  kefir:[4.0,67],prot:[23.0,110],sard:[23.3,236],leg:[8.0,101],
  broc:[2.8,34],crud:[1.0,66],beurre:[25.0,629],pain:[8.5,259],
  avocat:[2.0,160],graines:[24.6,543],fromage:[6.8,51],banane:[1.1,88],
  fruits:[1.0,35],huile:[0.0,884],riz:[7.0,350]
};
var EGG_P=5.5,EGG_K=65;
var cCase='A',cPoids=85,cMode='training';
function r5(x){return Math.round(x/5)*5;}
function r10(x){return Math.round(x/10)*10;}
function coef(){return cCase==='A'?1:cCase==='B'?0.80:0.65;}
function ref(){return Math.round(cPoids*coef());}
function fmt(n){return String(n).replace(/\B(?=(\d{3})+\b)/g,'\u202F');}
function g(id){return document.getElementById(id);}

/* V15 — header Nutrición Primal */

function calcQ(ref){
  var r=ref/85,q={};
  q.kefir=Math.max(80,r5(150*r));
  q.oeufs=Math.max(2,Math.min(5,Math.round(3*r)));
  q.sard=Math.max(60,r5(100*r));
  q.leg=Math.max(60,r5(100*r));
  q.broc=Math.max(150,r10(250*r));
  q.crud=Math.max(60,r5(120*r));
  q.beurre=Math.max(20,r5(45*r));
  q.pain=Math.max(30,r5(60*r));
  q.avocat=Math.max(80,r5(150*r));
  q.graines=Math.min(18,Math.max(6,Math.round(12*r)));
  q.fromage=Math.max(100,r5(190*r));
  q.banane=Math.max(50,r5(100*r));
  q.fruits=Math.max(40,r5(80*r));
  var fp=q.kefir*M.kefir[0]/100+q.oeufs*EGG_P+q.sard*M.sard[0]/100+q.leg*M.leg[0]/100+q.broc*M.broc[0]/100+q.crud*M.crud[0]/100+q.beurre*M.beurre[0]/100+q.pain*M.pain[0]/100+q.avocat*M.avocat[0]/100+q.graines*M.graines[0]/100+q.fromage*M.fromage[0]/100+q.banane*M.banane[0]/100+q.fruits*M.fruits[0]/100;
  var fk=q.kefir*M.kefir[1]/100+q.oeufs*EGG_K+q.sard*M.sard[1]/100+q.leg*M.leg[1]/100+q.broc*M.broc[1]/100+q.crud*M.crud[1]/100+q.beurre*M.beurre[1]/100+q.pain*M.pain[1]/100+q.avocat*M.avocat[1]/100+q.graines*M.graines[1]/100+q.fromage*M.fromage[1]/100+q.banane*M.banane[1]/100+q.fruits*M.fruits[1]/100;
  q.prot=Math.max(60,r5((ref*1.6-fp)/(M.prot[0]/100)));
  var ngp=fp+q.prot*M.prot[0]/100;
  if(cMode==='training'){
    q.riz=Math.max(60,r10((ref*1.8-ngp)/(M.riz[0]/100)));
    var sk=fk+q.prot*M.prot[1]/100+q.riz*M.riz[1]/100;
    q.huile_g=Math.max(14,Math.round((ref*33+250-sk)/(M.huile[1]/100)));
  } else if(cMode==='rest'){
    q.huile_g=14;
    var swr=fk+q.prot*M.prot[1]/100+q.huile_g*M.huile[1]/100;
    q.riz=Math.max(60,r10((ref*30-swr)/(M.riz[1]/100)));
  } else {
    q.huile_g=14;
    var sws=fk+q.prot*M.prot[1]/100+q.huile_g*M.huile[1]/100;
    q.riz=Math.max(40,r10((ref*24-sws)/(M.riz[1]/100)));
  }
  q.total_p=Math.round(ngp+q.riz*M.riz[0]/100);
  q.total_k=Math.round(fk+q.prot*M.prot[1]/100+q.riz*M.riz[1]/100+q.huile_g*M.huile[1]/100);
  return q;
}

function upd(){
  var r=ref();
  var pj=Math.round(r*1.8);
  var ma=Math.round(r*33);
  g('pv').textContent=cPoids;
  g('pRef').textContent=r;
  g('pProt').textContent=pj;
  g('pMaint').textContent=fmt(ma);
  var savedMode=cMode;
  cMode='training';
  var qT=calcQ(r);
  cMode=savedMode;
  g('pEntr').textContent=fmt(qT.total_k);
  var isTrain=cMode==='training';
  var isRecomp=cMode==='recomp';
  var modeLabel=isTrain?'jour d\u2019entra\u00EEnement':isRecomp?'recomposition active':'jour de repos';
  var kcalLabel=isTrain?'entra\u00EEnement':isRecomp?'recomposition':'repos';
  g('mLbl').textContent=r+'\u00A0kg';
  g('mMode').textContent=modeLabel;
  g('tKlbl').textContent=kcalLabel;
  g('recomp-banner').style.display=isRecomp?'block':'none';
  var col=isRecomp?'bl':(!isTrain?'gr':'');
  ['sn1','sn2','sn3','sn4','sn5','sn6'].forEach(function(id){
    var e=g(id);if(!e)return;
    e.className='snum'+(col?' '+col:'');
  });
  ['lb1','lb2','lb3','lb4','lb5','lb6'].forEach(function(id){
    var e=g(id);if(!e)return;
    e.className='slbl2'+(col?' '+col:'');
  });
  var q=calcQ(r);
  g('m-kefir').textContent=q.kefir+'\u00A0g';
  g('m-oeufs').textContent=q.oeufs+'\u00A0pi\u00E8ces';
  g('m-prot').textContent=q.prot+'\u00A0g';
  g('m-sardines').textContent=q.sard+'\u00A0g';
  g('m-legumes').textContent=q.leg+'\u00A0g';
  g('m-brocoli').textContent=q.broc+'\u00A0g';
  g('m-huile').textContent=q.huile_g+'\u00A0g';
  g('m-crudites').textContent=q.crud+'\u00A0g';
  g('m-glucide').textContent=q.riz+'\u00A0g sec';
  g('m-beurre').textContent=q.beurre+'\u00A0g';
  g('m-pain').textContent=q.pain+'\u00A0g';
  g('m-avocat').textContent=q.avocat+'\u00A0g';
  g('m-graines').textContent=q.graines+'\u00A0g';
  g('m-fromage').textContent=q.fromage+'\u00A0g';
  g('m-banane').textContent=q.banane+'\u00A0g';
  g('m-fruits').textContent=q.fruits+'\u00A0g';
  g('tP').textContent=q.total_p+'\u00A0g';
  g('tPC').textContent=pj;
  g('tK').textContent=fmt(q.total_k);
  var snoteProt=g('snote-prot');
  snoteProt.textContent=isRecomp?'Prot\u00E9ines maintenues en Recomposition \u2014 le muscle se pr\u00E9serve par la prot\u00E9ine.':'Quantit\u00E9 poulet identique entra\u00EEnement et repos \u2014 prot\u00E9ine maintenue.';
  var sn=g('snote-glucide');
  if(r>100){
    sn.innerHTML='Calcul\u00E9 sur riz complet. Varie selon le mode.<br><strong style="color:#C9A84C;">Poids de r\u00E9f\u00E9rence > 100\u00A0kg\u00A0: utilise 50\u00A0% riz + 50\u00A0% flocons d\u2019avoine pour ta portion totale de glucides. Dans ce cas, r\u00E9duis la quantit\u00E9 totale de poulet de 33\u00A0%.</strong>';
  } else {
    sn.textContent='Calcul\u00E9 sur riz complet (r\u00E9f\u00E9rence). Varie selon le mode.';
  }
}
function upP(v){cPoids=+v;upd();}
function cas(c){
  cCase=c;
  ['A','B','C'].forEach(function(x){var e=g('prof'+x);if(e)e.classList.remove('on');});
  var s=g('prof'+c);if(s)s.classList.add('on');
  upd();
}
function setMode(mode,btn){
  cMode=mode;
  document.querySelectorAll('.mb').forEach(function(b){b.classList.remove('on-train','on-rest');});
  document.querySelectorAll('.mb-recomp').forEach(function(b){b.classList.remove('on-recomp');});
  if(btn){
    if(mode==='training')btn.classList.add('on-train');
    else if(mode==='rest')btn.classList.add('on-rest');
    else btn.classList.add('on-recomp');
  }
  upd();
}
function show(id,btn){
  document.querySelectorAll('.sec').forEach(function(s){s.classList.remove('on');});
  document.querySelectorAll('.nb').forEach(function(b){b.classList.remove('on');});
  var s=g(id);if(s)s.classList.add('on');
  if(btn)btn.classList.add('on');
}
function tog(el){el.parentElement.classList.toggle('open');}
upd();


function bindOMADInteractions(){
  document.querySelectorAll('[data-nav]').forEach(function(btn){
    btn.addEventListener('click', function(){ show(btn.getAttribute('data-nav'), btn); });
  });
  document.querySelectorAll('[data-profile]').forEach(function(el){
    el.addEventListener('click', function(){ cas(el.getAttribute('data-profile')); });
  });
  document.querySelectorAll('[data-mode]').forEach(function(btn){
    btn.addEventListener('click', function(){ setMode(btn.getAttribute('data-mode'), btn); });
  });
  document.querySelectorAll('[data-weight-slider]').forEach(function(input){
    input.addEventListener('input', function(){ upP(input.value); });
    input.addEventListener('change', function(){ upP(input.value); });
  });
  document.querySelectorAll('[data-faq-toggle]').forEach(function(el){
    el.addEventListener('click', function(){ tog(el); });
  });
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', bindOMADInteractions);
}else{
  bindOMADInteractions();
}
