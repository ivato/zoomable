(function( $ ){

$.fn.zoomable = function( options ) {

// Adding forEach if not present.
if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach= function(action, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
};

var that = $(this),
    smallImage = that.smallImage = that.find('img').first();

that.options = $.extend({
    'cssPrefix'         : 'zoomable-',
    'handleTouch'       : true,
    'animated'          : true,
    'animDuration'      : 200,
    'dblclickDelay'     : 150,
    'maxThumbnailSize'  : 200,
    'fadeOnLoad'        : 0.5, // -1 to switch off
    'thumbnail'         : true
},options);

that.options.zoomInCursor && smallImage.css('cursor',that.options.zoomInCursor);

if ( that.options.handleTouch ){

    // http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
    /*
    var deviceIsTouch = function() {
      //return !!('ontouchstart' in window) works on most browsers, !!('onmsgesturechange' in window); works on ie10
      return !!('ontouchstart' in window) || !!('onmsgesturechange' in window);
    };
    */
    // On capte les touch events et on les transforme en mouse events. http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript/
    var touchHandler = function(event){
        var touches = event.changedTouches,
            first = touches[0],
            type = "";
        switch(event.type){
            case "touchstart"   : type = "mousedown"; break;
            case "touchmove"    : type = "mousemove"; break;        
            case "touchend"     : type = "mouseup"; break;
            default             : return;
        };
        // initMouseEvent(type, canBubble, cancelable, view, clickCount, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button (0=left), relatedTarget);
        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1,first.screenX, first.screenY,first.clientX, first.clientY, false, false, false, false, 0, null);
        first.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
    };
    ['touchstart','touchmove','touchend','touchcancel'].forEach(function(e){
        if ( document.addEventListener ){
            document.addEventListener(e, touchHandler, true);
        } else {
            document.attachEvent('on'+e, touchHandler);
        };
    });
};

that.zoomed = false;

that['moveTo'] = function(pos,options){
    if ( that.bigImage ){
        var _complete = options.complete;
        var _step = options.step;
        options.complete = function(){
            that.options.thumbnail && that.updateLens();
            _complete && _complete(that);
        };
        if ( that.options.thumbnail ){
            options.step = function(){
                that.updateLens();
                _step && step(that);
            }
        }
        that.bigImage.animate({
            'left'  : Math.max(that.cSize.w-that.sizeBig.w,Math.min(0,-pos.x)),
            'top'   : Math.max(that.cSize.h-that.sizeBig.h,Math.min(0,-pos.y)),
        },options);
     };
};

that['getPosition'] = function(){
    var pos = that.bigImage ? that.bigImage.position() : {left:0,top:0};
    return {'left':pos.left*-1,'top':pos.top*-1};
};

that['getSize'] = function(){
    return that.sizeBig ? {'width':that.sizeBig.w,'height':that.sizeBig.h } : {'width':0,'height':0};
};

that['unzoom'] = function(e){
    if ( that.zoomed ){
        var onComplete = function(){
            that.zoomed = false;
            that.bigImage.unbind('mousedown').remove();
            that.options.thumbnail && that.thumbnail.unbind('mousemove').unbind('mouseup').unbind('mousedown').remove();
            that.smallImage.css('visibility','visible');
            that.options.onUnzoomDidEnd && that.options.onUnzoomDidEnd(that);
        };
        that.thumbnail.css('visibility','hidden').empty();
        if ( that.options.animated ){
            that.bigImageContent.animate({
                'width'   : that.sizeInt.w,
                'height'  : that.sizeInt.h
            },that.options.animDuration);
            that.bigImage.animate({
                'left'        : (that.cSize.w-that.sizeInt.w)/2,
                'top'         : (that.cSize.h-that.sizeInt.h)/2,
            },that.options.animDuration,onComplete);
        } else {
            onComplete();
        };
        that.options.onUnzoomDidStart && that.options.onUnzoomDidStart(that);
    };
};

that['zoom'] = function(e){

    if ( that.zoomed ) return;

    that.zoomed = true;
    var cSize           = that.cSize = {w:that.width(),h:that.height()},
        bigImageSrc     = that.options.url,
        bigImage        = that.bigImage = $('<div class="'+that.options.cssPrefix+'image '+that.options.cssPrefix+'big"></div>'),
        thumbnail       = that.thumbnail = $('<div class="'+that.options.cssPrefix+'zoomnav" ></div>');

    if ( that.options.thumbnail ) thumbnail.appendTo(that);
    bigImage.appendTo(that);

    bigImage.css('visibility','hidden');
    that.options.fadeOnLoad >= 0 && smallImage.css('opacity',that.options.fadeOnLoad);

    var mousePoint = e ? {x:e.offsetX||e.x||e.clientX,y:e.offsetY||e.x||e.clientY} : false,
        dragPoint = {x:0,y:0};
        bigImageContent = that.bigImageContent = $('<img src="'+bigImageSrc+'"" >'),
        spinner = $('<div class="'+that.options.cssPrefix+'spinner" ></div>');

    that.bigImageContent.appendTo(bigImage);
    spinner.css({left:(cSize.w-spinner.width())/2,top:(cSize.h-spinner.height())/2}).appendTo(that);

    that.options.onZoomDidStart && that.options.onZoomDidStart(that);

    bigImageContent.load(function(e){

        spinner.remove();
        bigImage.css('visibility','visible');
        smallImage.css({'visibility':'hidden','opacity':1});
        var sizeBig = that.sizeBig = {w:(e.srcElement||e.target).clientWidth,h:(e.srcElement||e.target).clientHeight};
        var r = sizeBig.w/sizeBig.h;
        var sizeInt = that.sizeInt = r>1 ? {w:cSize.w,h:sizeBig.h/sizeBig.w*cSize.w} : {w:sizeBig.w/sizeBig.h*cSize.h,h:cSize.h};
        if ( !mousePoint ) mousePoint = {x:cSize.w/2,y:cSize.h/2};
        var ratio = {
            // this is the mouse pos big/small image ratio.
            'x'   : Math.max(0,Math.min(1,(mousePoint.x-(cSize.w-sizeInt.w)/2)/sizeInt.w)),
            'y'   : Math.max(0,Math.min(1,(mousePoint.y-(cSize.h-sizeInt.h)/2)/sizeInt.h))
        };

        bigImage.css({
            'width':sizeBig.w,
            'height':sizeBig.h
        });

        var onComplete = function(){

            if ( that.options.thumbnail){

                var tWidth = parseFloat(thumbnail.css('max-width')) || 200,
                    //tHeight = parseFloat(thumbnail.css('max-height')) || 200;
                    thumbnailImage = $('<img src="'+bigImageSrc+'"" >');
                thumbnailImage.appendTo(thumbnail);
                var lens = $('<div class="'+that.options.cssPrefix+'lens"></div>');
                lens.appendTo(thumbnail);

                tWidth = that.options.maxThumbnailSize;

                var thumbnailSize = sizeInt.w>sizeInt.h ? {w:tWidth,h:sizeInt.h/sizeInt.w*tWidth} : {w:sizeInt.w/sizeInt.h*tWidth,h:tWidth},
                    lensSize = {w:(cSize.w/sizeBig.w)*thumbnailSize.w,h:(cSize.h/sizeBig.h)*thumbnailSize.h};

                thumbnailImage.width(thumbnailSize.w).height(thumbnailSize.h);
                thumbnail.css({
                    'visibility'    : 'visible',
                    'width'         : thumbnailSize.w,
                    'height'        : thumbnailSize.h
                });
                lens.css({
                    width   : lensSize.w,
                    height  : lensSize.h
                });
                that.updateLens = function(){
                    var destPoint = bigImage.position();
                    lens.css({
                        left    : -destPoint.left/sizeBig.w*thumbnailSize.w,
                        top     : -destPoint.top/sizeBig.h*thumbnailSize.h
                    });
                };
                that.updateLens();
                var updateBig = function(){
                    var destPoint = lens.position();
                    bigImage.css({
                        left    : -destPoint.left*sizeBig.w/thumbnailSize.w,
                        top     : -destPoint.top*sizeBig.h/thumbnailSize.h
                    })
                };

                thumbnail.bind('mousedown',function(e){
                    e.preventDefault();
                    var elemOffset = that.offset();
                    var x = e.pageX - elemOffset.left;
                    var y = e.pageY - elemOffset.top;
                    lens.css({
                        left    : Math.min(thumbnailSize.w-lensSize.w,Math.max(0,x-lensSize.w/2)),
                        top     : Math.min(thumbnailSize.h-lensSize.h,Math.max(0,y-lensSize.h/2))
                    });
                    updateBig();
                    dragPoint = {x:e.screenX,y:e.screenY};
                    thumbnail.bind('mouseup',function(e){
                        thumbnail.unbind('mousemove').unbind('mouseup');
                        return false;
                    });
                    thumbnail.bind('mousemove',function(e){
                        e.preventDefault();
                        if ( e.which == 0 ) return false;
                        var offset = {x:e.screenX-dragPoint.x,y:e.screenY-dragPoint.y};
                        dragPoint.x = e.screenX; dragPoint.y = e.screenY;
                        var destPoint = {
                            left    : Math.min(thumbnailSize.w-lensSize.w,Math.max(0,lens.position().left+offset.x)),
                            top     : Math.min(thumbnailSize.h-lensSize.h,Math.max(0,lens.position().top+offset.y))
                        };
                        lens.css(destPoint);
                        updateBig();
                        return false;
                    });
                    return false;
                });
            };

            bigImage.bind('mousedown',function(e){
                var clickTime = new Date().getTime();
                dragPoint = {x:e.screenX,y:e.screenY};
                that.bind('mouseup',function(e) {
                    if ( new Date().getTime() - clickTime < (that.options.dblclickDelay) ){
                        that.unbind('mousemove').unbind('mouseup');
                        that['unzoom']();
                    };
                    return false;
                });
                that.bind('mousemove',function(e){
                    if ( e.type=='mousemove' && e.which != 1 ) return false;
                    var offset = {x:e.screenX-dragPoint.x,y:e.screenY-dragPoint.y};
                    dragPoint.x = e.screenX; dragPoint.y = e.screenY;
                    var destPoint = {
                        left    : Math.max(-sizeBig.w+cSize.w,Math.min(0,bigImage.position().left+offset.x)),
                        top     : Math.max(-sizeBig.h+cSize.h,Math.min(0,bigImage.position().top+offset.y))
                    }
                    bigImage.css(destPoint);
                    that.options.onMove && that.options.onMove(that);
                    that.options.thumbnail && that.updateLens();
                    return false;
                });
                return false;
            });
        };

        that.options.onZoomDidEnd && that.options.onZoomDidEnd(that);

        if ( that.options.animated ){
            bigImage.css({
                'left'        : (cSize.w-sizeInt.w)/2,
                'top'         : (cSize.h-sizeInt.h)/2,
            })
            bigImageContent.css({
                'width'       : sizeInt.w,
                'height'      : sizeInt.h
            });
            bigImageContent.animate({
                'width'   : sizeBig.w,
                'height'  : sizeBig.h
            },that.options.animDuration);
            bigImage.animate({
                'left'    : -ratio.x*(sizeBig.w-cSize.w)+'px',
                'top'     : -ratio.y*(sizeBig.h-cSize.h)+'px'
            },that.options.animDuration,onComplete);
        } else {
            bigImage.css({
                'left'        : -ratio.x*(sizeBig.w-cSize.w)+'px',
                'top'         : -ratio.y*(sizeBig.h-cSize.h)+'px'
            });
            onComplete();
        };
    });
};

smallImage.bind('mouseup',that['zoom']);

return that;

};})( jQuery );