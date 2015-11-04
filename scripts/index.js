window.onload = function(){
  var ROW = 15,NUM = ROW*ROW,
      sence = document.getElementById('sence'),
      senceWidth = parseInt(getComputedStyle(sence).width),
      blockOffset =(senceWidth-ROW)/ROW +'px',
      s = true,dict1 = {},dict2 = {};
  //创建场景
  (function (){
    var el,rowline,colline;
    for ( var i = 0;  i < ROW;  i++){
      rowline = document.createElement('div');
      rowline.setAttribute('class','row');
      rowline.style.top =  (senceWidth/ROW)/2 + (senceWidth/ROW)*i + 'px';
      colline = document.createElement('div');
      colline.style.left = (senceWidth/ROW)/2 + (senceWidth/ROW)*i + 'px';
      colline.setAttribute('class','col');
      sence.appendChild(rowline);
      sence.appendChild(colline);
      rowline.setAttribute('class','row');
      for ( var j = 0;  j < ROW;  j++){
        el = document.createElement('div');
        el.style.width =  blockOffset; el.style.height = blockOffset;
        el.setAttribute('class','block');
        el.setAttribute('data',i+ '_' + j);
        sence.appendChild(el);
      }
    }
  })();
  var  isHasWinner= function(id,dic){
    var x = Number(id.split('_')[0]);
    var y = Number(id.split('_')[1]);
    var hang = 1,shu = 1, zuoxiexian = 1, youxiexian = 1;
    var tx = x,ty = y;
    while(dic[ tx + '_'+ (ty+1) ]){hang++;ty++;}
    tx = x; ty = y;
    while(dic[ tx + '_'+ (ty-1) ]){hang++;ty--;}
    tx = x; ty = y;
    while(dic[ (tx+1) + '_'+ ty ]){shu++;tx++;}
    tx = x; ty = y;
    while(dic[ (tx-1) + '_'+ ty ]){shu++;tx--;}
    tx = x; ty = y;
    while(dic[ (tx+1) + '_'+ (ty+1) ]){zuoxiexian++;tx++;ty++;}
    tx = x; ty = y;
    while(dic[ (tx-1) + '_'+ (ty-1) ]){zuoxiexian++;tx--;ty--;}
    tx = x; ty = y;
    while(dic[ (tx-1) + '_'+ (ty+1) ]){youxiexian++;tx--;ty++;}
    tx = x; ty = y;
    while(dic[ (tx+1) + '_'+ (ty-1) ]){youxiexian++;tx++;ty--;}
    if(hang == 5 || shu == 5 || youxiexian == 5 || zuoxiexian==5) return true;
    return false;
  };
  sence.onclick = function(e){
    var el = e.target;
    if( el == this) return;
    if( el.hasAttribute('has-one') ) return;

    var id = el.getAttribute('data');
    if(s){
      el.style.background = 'white';
      el.style.boxShadow = '0 3px 10px black';
      if( isHasWinner(id,dict1) ){alert('白赢了!');}
      dict1[id] = true;
      s = false;
    }else{
      el.style.background = '#333';
      el.style.boxShadow = '0 3px 10px black';
      if(isHasWinner(id,dict2)){alert('黑赢了!');}
      dict2[id] = true;
      s = true;
    }
    el.setAttribute('has-one','true');
  };
};
