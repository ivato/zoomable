/*! nanoScrollerJS v0.7.1 (c) 2013 James Florentino; Licensed MIT */

(function(e,t,n){"use strict";var r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E,S,x;S={paneClass:"pane",sliderClass:"slider",contentClass:"content",iOSNativeScrolling:!1,preventPageScrolling:!1,disableResize:!1,alwaysVisible:!1,flashDelay:1500,sliderMinHeight:20,sliderMaxHeight:null},y="scrollbar",g="scroll",l="mousedown",c="mousemove",p="mousewheel",h="mouseup",m="resize",u="drag",w="up",v="panedown",s="DOMMouseScroll",o="down",E="wheel",a="keydown",f="keyup",b="touchmove",r=t.navigator.appName==="Microsoft Internet Explorer"&&/msie 7./i.test(t.navigator.appVersion)&&t.ActiveXObject,i=null,x=function(){var e,t,r;return e=n.createElement("div"),t=e.style,t.position="absolute",t.width="100px",t.height="100px",t.overflow=g,t.top="-9999px",n.body.appendChild(e),r=e.offsetWidth-e.clientWidth,n.body.removeChild(e),r},d=function(){function a(r,s){this.el=r,this.options=s,i||(i=x()),this.$el=e(this.el),this.doc=e(n),this.win=e(t),this.$content=this.$el.children("."+s.contentClass),this.$content.attr("tabindex",0),this.content=this.$content[0],this.options.iOSNativeScrolling&&this.el.style.WebkitOverflowScrolling!=null?this.nativeScrolling():this.generate(),this.createEvents(),this.addEvents(),this.reset()}return a.prototype.preventScrolling=function(e,t){if(!this.isActive)return;if(e.type===s)(t===o&&e.originalEvent.detail>0||t===w&&e.originalEvent.detail<0)&&e.preventDefault();else if(e.type===p){if(!e.originalEvent||!e.originalEvent.wheelDelta)return;(t===o&&e.originalEvent.wheelDelta<0||t===w&&e.originalEvent.wheelDelta>0)&&e.preventDefault()}},a.prototype.nativeScrolling=function(){this.$content.css({WebkitOverflowScrolling:"touch"}),this.iOSNativeScrolling=!0,this.isActive=!0},a.prototype.updateScrollValues=function(){var e;e=this.content,this.maxScrollTop=e.scrollHeight-e.clientHeight,this.contentScrollTop=e.scrollTop,this.iOSNativeScrolling||(this.maxSliderTop=this.paneHeight-this.sliderHeight,this.sliderTop=this.contentScrollTop*this.maxSliderTop/this.maxScrollTop)},a.prototype.createEvents=function(){var e=this;this.events={down:function(t){return e.isBeingDragged=!0,e.offsetY=t.pageY-e.slider.offset().top,e.pane.addClass("active"),e.doc.bind(c,e.events[u]).bind(h,e.events[w]),!1},drag:function(t){return e.sliderY=t.pageY-e.$el.offset().top-e.offsetY,e.scroll(),e.updateScrollValues(),e.contentScrollTop>=e.maxScrollTop?e.$el.trigger("scrollend"):e.contentScrollTop===0&&e.$el.trigger("scrolltop"),!1},up:function(t){return e.isBeingDragged=!1,e.pane.removeClass("active"),e.doc.unbind(c,e.events[u]).unbind(h,e.events[w]),!1},resize:function(t){e.reset()},panedown:function(t){return e.sliderY=(t.offsetY||t.originalEvent.layerY)-e.sliderHeight*.5,e.scroll(),e.events.down(t),!1},scroll:function(t){if(e.isBeingDragged)return;e.updateScrollValues(),e.iOSNativeScrolling||(e.sliderY=e.sliderTop,e.slider.css({top:e.sliderTop}));if(t==null)return;e.contentScrollTop>=e.maxScrollTop?(e.options.preventPageScrolling&&e.preventScrolling(t,o),e.$el.trigger("scrollend")):e.contentScrollTop===0&&(e.options.preventPageScrolling&&e.preventScrolling(t,w),e.$el.trigger("scrolltop"))},wheel:function(t){if(t==null)return;return e.sliderY+=-t.wheelDeltaY||-t.delta,e.scroll(),!1}}},a.prototype.addEvents=function(){var e;this.removeEvents(),e=this.events,this.options.disableResize||this.win.bind(m,e[m]),this.iOSNativeScrolling||(this.slider.bind(l,e[o]),this.pane.bind(l,e[v]).bind(""+p+" "+s,e[E])),this.$content.bind(""+g+" "+p+" "+s+" "+b,e[g])},a.prototype.removeEvents=function(){var e;e=this.events,this.win.unbind(m,e[m]),this.iOSNativeScrolling||(this.slider.unbind(),this.pane.unbind()),this.$content.unbind(""+g+" "+p+" "+s+" "+b,e[g])},a.prototype.generate=function(){var e,t,n,r,s;return n=this.options,r=n.paneClass,s=n.sliderClass,e=n.contentClass,!this.$el.find(""+r).length&&!this.$el.find(""+s).length&&this.$el.append('<div class="'+r+'"><div class="'+s+'" /></div>'),this.slider=this.$el.find("."+s),this.pane=this.$el.find("."+r),i&&(t=this.$el.css("direction")==="rtl"?{left:-i}:{right:-i},this.$el.addClass("has-scrollbar")),t!=null&&this.$content.css(t),this},a.prototype.restore=function(){this.stopped=!1,this.pane.show(),this.addEvents()},a.prototype.reset=function(){var e,t,n,s,o,u,a,f,l;if(this.iOSNativeScrolling){this.contentHeight=this.content.scrollHeight;return}return this.$el.find("."+this.options.paneClass).length||this.generate().stop(),this.stopped&&this.restore(),e=this.content,n=e.style,s=n.overflowY,r&&this.$content.css({height:this.$content.height()}),t=e.scrollHeight+i,u=this.pane.outerHeight(),f=parseInt(this.pane.css("top"),10),o=parseInt(this.pane.css("bottom"),10),a=u+f+o,l=Math.round(a/t*a),l<this.options.sliderMinHeight?l=this.options.sliderMinHeight:this.options.sliderMaxHeight!=null&&l>this.options.sliderMaxHeight&&(l=this.options.sliderMaxHeight),s===g&&n.overflowX!==g&&(l+=i),this.maxSliderTop=a-l,this.contentHeight=t,this.paneHeight=u,this.paneOuterHeight=a,this.sliderHeight=l,this.slider.height(l),this.events.scroll(),this.pane.show(),this.isActive=!0,e.scrollHeight===e.clientHeight||this.pane.outerHeight(!0)>=e.scrollHeight&&s!==g?(this.pane.hide(),this.isActive=!1):this.el.clientHeight===e.scrollHeight&&s===g?this.slider.hide():this.slider.show(),this.pane.css({opacity:this.options.alwaysVisible?1:"",visibility:this.options.alwaysVisible?"visible":""}),this},a.prototype.scroll=function(){if(!this.isActive)return;return this.sliderY=Math.max(0,this.sliderY),this.sliderY=Math.min(this.maxSliderTop,this.sliderY),this.$content.scrollTop((this.paneHeight-this.contentHeight+i)*this.sliderY/this.maxSliderTop*-1),this.iOSNativeScrolling||this.slider.css({top:this.sliderY}),this},a.prototype.scrollBottom=function(e){if(!this.isActive)return;return this.reset(),this.$content.scrollTop(this.contentHeight-this.$content.height()-e).trigger(p),this},a.prototype.scrollTop=function(e){if(!this.isActive)return;return this.reset(),this.$content.scrollTop(+e).trigger(p),this},a.prototype.scrollTo=function(t){if(!this.isActive)return;return this.reset(),this.scrollTop(e(t).get(0).offsetTop),this},a.prototype.stop=function(){return this.stopped=!0,this.removeEvents(),this.pane.hide(),this},a.prototype.flash=function(){var e=this;if(!this.isActive)return;return this.reset(),this.pane.addClass("flashed"),setTimeout(function(){e.pane.removeClass("flashed")},this.options.flashDelay),this},a}(),e.fn.nanoScroller=function(t){return this.each(function(){var n,r;(r=this.nanoscroller)||(n=e.extend({},S,t),this.nanoscroller=r=new d(this,n));if(t&&typeof t=="object"){e.extend(r.options,t);if(t.scrollBottom)return r.scrollBottom(t.scrollBottom);if(t.scrollTop)return r.scrollTop(t.scrollTop);if(t.scrollTo)return r.scrollTo(t.scrollTo);if(t.scroll==="bottom")return r.scrollBottom(0);if(t.scroll==="top")return r.scrollTop(0);if(t.scroll&&t.scroll instanceof e)return r.scrollTo(t.scroll);if(t.stop)return r.stop();if(t.flash)return r.flash()}return r.reset()})}})(jQuery,window,document);