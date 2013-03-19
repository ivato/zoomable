function protect(mode){
  /* SECURE - NO RIGHT CLICK AND OTHERS */
  var message="Function Disabled!"; function clickIE4(){ if (event.button==2){ alert(message); return false; } } function clickNS4(e){ if (document.layers||document.getElementById&&!document.all){ if (e.which==2||e.which==3){ alert(message); return false; } } } if (document.layers){ document.captureEvents(Event.MOUSEDOWN); document.onmousedown=clickNS4; } else if (document.all&&!document.getElementById){ document.onmousedown=clickIE4; }
  if(mode=='all'){
    document.oncontextmenu = function(){return false;}
    document.ondragstart = function(){return false;}
    document.onselectstart = function(){return false;}
  }
  if(mode=='img'){
    for(i=0;i<document.images.length;i++){
      document.images[i].oncontextmenu = function(){return false;}
      document.images[i].ondragstart = function(){return false;}
      document.images[i].onselectstart = function(){return false;}
    }
  }
  /* /END SECURE - NO RIGHT CLICK AND OTHERS */
}

/* Ponctuation */
function ponctuation(text){
  var finaltext = '';
  if(text != ''){ 
    var filteredstring = text;
    //alert(filteredstring);
    var partstoreplace = new Array(" !"," ;"," :","« "," »","&laquo; "," &raquo;");
    var newsparts = new Array("&nbsp;!","&nbsp;;","&nbsp;:","«&nbsp;","&nbsp;»","&laquo;&nbsp;","&nbsp;&raquo;");
    //var newsparts = new Array("8!","8;","8:");
    for(var i=0; i<partstoreplace.length-1; i++){
      //alert(filteredstring.indexOf(partstoreplace[i]));
      if(filteredstring.indexOf(partstoreplace[i]) != -1){
        filteredstring = filteredstring.replace(new RegExp(partstoreplace[i], 'g'), newsparts[i]);
      }
    }
    filteredstring = filteredstring.replace(' ?', '&nbsp;?');
    finaltext = filteredstring;
  }
  return finaltext;
}

jQuery(document).ready(function($){

  $("#megamenu li.niv1").mouseenter(function(){
    $(this).addClass('on');
    $(this).children('.block-subnav').fadeIn();
  }).mouseleave(function(){
    $(this).removeClass('on');
    $(this).children('.block-subnav').fadeOut();
  });

  $('.nshare.facebook').click(function(event) {
    var width  = 575,
        height = 400,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = this.href,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;
    
    window.open(url, 'twitter', opts);
 
    return false;
  });

  $('.nshare.twitter').click(function(event) {
    var width  = 575,
        height = 400,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = this.href,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;
    
    window.open(url, 'twitter', opts);
 
    return false;
  });

  $('.nshare.google').click(function(event) {
    var width  = 800,
        height = 400,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = this.href,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;
    
    window.open(url, 'twitter', opts);
 
    return false;
  });

  $('.nshare.linkedin').click(function(event) {
    var width  = 600,
        height = 500,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = this.href,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;
    
    window.open(url, 'twitter', opts);
 
    return false;
  });

  $('.nshare.pinterest').click(function(event) {
    var width  = 570,
        height = 500,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = this.href,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;
    
    window.open(url, 'twitter', opts);
 
    return false;
  });

  $('.nshare.viadeo').click(function(event) {
    var width  = 850,
        height = 500,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = this.href,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;
    
    window.open(url, 'twitter', opts);
 
    return false;
  });

   // Overlay send mail to a friend
  $(".popmail").overlay({
    mask: '#6E6E6E',
    top:'5%',
    closeOnClick:false,
    fixed:false,
    onBeforeLoad: function() {
      $("#section-header #overlay").addClass("overlay_mail");
      var wrap = this.getOverlay().find(".content-wrap");
      var address = this.getTrigger().attr("href")+" #block-system-main";
      wrap.load(address);
    },
    onClose: function() {
      $("#header #overlay .contentWrap").html("");
      $("#header #overlay").removeClass("overlay_mail");
    }
  });

  /* Fix affichage scald au DND dans un WYSIWYG
   * /scald/modules/library/dnd/js/dnd-library.js
   * 
   */
  /*
  Drupal.theme.prototype.scaldEmbed = function(atom) {
    var output = atom.editor;
    return output;
  }
  */

  $('a#edito-link').append('<span></span>');
  $('.hp-line2 .last-article-content.nano').height($('.hp-line2 .hp-video-une .hp-video-content').outerHeight());
  
  /* One link only per block (SEO) */
  $('.block-hp-facebook, .hp-archive-une .archive-content').addClass('onelinkonly');

  $(".onelinkonly").click(function(){

    if($(this).find("a").attr('target') == '_blank') {
      //window.location=$(this).find("a").attr("href");
      window.open($(this).find("a").attr("href"), "_blank");
    }
    else {
      window.location=$(this).find("a").attr("href"); 
    }
    return false;
  });
  
  $("#edit-submitted-form-contact-type").selectbox();

  protect('img');

   $('h1 a, h2 a, h3 a, h4 a, h1, h2, h3, h4, .title a, .article-title a, .easy-breadcrumb a').each(function(){
    $(this).html( ponctuation( $(this).html() ) );
  });

  $(".nano").nanoScroller();
  /*
  $( "#full-media-diapo .item .article-illustration").each(function(index) {
    var resize_img = $(this).find("img").first();
    var resize_img_url = resize_img.attr("src").replace("styles/slide_image_resp__wide/public/", "");
    $( "#full-media-diapo .item-"+index+" .article-illustration").zoomable({url: '"'+resize_img_url+'"'});
  });
  */
});