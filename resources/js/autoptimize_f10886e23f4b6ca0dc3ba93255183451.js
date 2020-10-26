!function(root,factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else if(typeof exports==='object'){factory(require('jquery'));}else{factory(root.jQuery);}}(this,function($){'use strict';$.fn.typeWatch=function(o){var _supportedInputTypes=['TEXT','TEXTAREA','PASSWORD','TEL','SEARCH','URL','EMAIL','DATETIME','DATE','MONTH','WEEK','TIME','DATETIME-LOCAL','NUMBER','RANGE','DIV'];var options=$.extend({wait:750,callback:function(){},highlight:true,captureLength:2,allowSubmit:false,inputTypes:_supportedInputTypes},o);function checkElement(timer,override){var value=timer.type==='DIV'?jQuery(timer.el).html():jQuery(timer.el).val();if((value.length>=options.captureLength&&value!=timer.text)||(override&&(value.length>=options.captureLength||options.allowSubmit))||(value.length==0&&timer.text))
{timer.text=value;timer.cb.call(timer.el,value);}};function watchElement(elem){var elementType=(elem.type||elem.nodeName).toUpperCase();if(jQuery.inArray(elementType,options.inputTypes)>=0){var timer={timer:null,text:(elementType==='DIV')?jQuery(elem).html():jQuery(elem).val(),cb:options.callback,el:elem,type:elementType,wait:options.wait};if(options.highlight&&elementType!=='DIV')
jQuery(elem).focus(function(){this.select();});var startWatch=function(evt){var timerWait=timer.wait;var overrideBool=false;var evtElementType=elementType;if(typeof evt.keyCode!='undefined'&&evt.keyCode==13&&evtElementType!=='TEXTAREA'&&elementType!=='DIV'){timerWait=1;overrideBool=true;}
var timerCallbackFx=function(){checkElement(timer,overrideBool)}
clearTimeout(timer.timer);timer.timer=setTimeout(timerCallbackFx,timerWait);};jQuery(elem).on('keydown paste cut input',startWatch);}};return this.each(function(){watchElement(this);});};});
(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else if(typeof module==='object'&&module.exports){module.exports=function(root,jQuery){if(jQuery===undefined){if(typeof window!=='undefined'){jQuery=require('jquery');}else{jQuery=require('jquery')(root);}}
factory(jQuery);return jQuery;};}else{factory(jQuery);}})(function($){"use strict";if('undefined'===typeof $){if('console'in window){window.console.info('Too much lightness, Featherlight needs jQuery.');}
return;}
if($.fn.jquery.match(/-ajax/)){if('console'in window){window.console.info('Featherlight needs regular jQuery, not the slim version.');}
return;}
function Featherlight($content,config){if(this instanceof Featherlight){this.id=Featherlight.id++;this.setup($content,config);this.chainCallbacks(Featherlight._callbackChain);}else{var fl=new Featherlight($content,config);fl.open();return fl;}}
var opened=[],pruneOpened=function(remove){opened=$.grep(opened,function(fl){return fl!==remove&&fl.$instance.closest('body').length>0;});return opened;};function slice(obj,set){var r={};for(var key in obj){if(key in set){r[key]=obj[key];delete obj[key];}}
return r;}
var iFrameAttributeSet={allow:1,allowfullscreen:1,frameborder:1,height:1,longdesc:1,marginheight:1,marginwidth:1,mozallowfullscreen:1,name:1,referrerpolicy:1,sandbox:1,scrolling:1,src:1,srcdoc:1,style:1,webkitallowfullscreen:1,width:1};function parseAttrs(obj,prefix){var attrs={},regex=new RegExp('^'+prefix+'([A-Z])(.*)');for(var key in obj){var match=key.match(regex);if(match){var dasherized=(match[1]+match[2].replace(/([A-Z])/g,'-$1')).toLowerCase();attrs[dasherized]=obj[key];}}
return attrs;}
var eventMap={keyup:'onKeyUp',resize:'onResize'};var globalEventHandler=function(event){$.each(Featherlight.opened().reverse(),function(){if(!event.isDefaultPrevented()){if(false===this[eventMap[event.type]](event)){event.preventDefault();event.stopPropagation();return false;}}});};var toggleGlobalEvents=function(set){if(set!==Featherlight._globalHandlerInstalled){Featherlight._globalHandlerInstalled=set;var events=$.map(eventMap,function(_,name){return name+'.'+Featherlight.prototype.namespace;}).join(' ');$(window)[set?'on':'off'](events,globalEventHandler);}};Featherlight.prototype={constructor:Featherlight,namespace:'featherlight',targetAttr:'data-featherlight',variant:null,resetCss:false,background:null,openTrigger:'click',closeTrigger:'click',filter:null,root:'body',openSpeed:250,closeSpeed:250,closeOnClick:'background',closeOnEsc:true,closeIcon:'&#10005;',loading:'',persist:false,otherClose:null,beforeOpen:$.noop,beforeContent:$.noop,beforeClose:$.noop,afterOpen:$.noop,afterContent:$.noop,afterClose:$.noop,onKeyUp:$.noop,onResize:$.noop,type:null,contentFilters:['jquery','image','html','ajax','iframe','text'],setup:function(target,config){if(typeof target==='object'&&target instanceof $===false&&!config){config=target;target=undefined;}
var self=$.extend(this,config,{target:target}),css=!self.resetCss?self.namespace:self.namespace+'-reset',$background=$(self.background||['<div class="'+css+'-loading '+css+'">','<div class="'+css+'-content">','<button class="'+css+'-close-icon '+self.namespace+'-close" aria-label="Close">',self.closeIcon,'</button>','<div class="'+self.namespace+'-inner">'+self.loading+'</div>','</div>','</div>'].join('')),closeButtonSelector='.'+self.namespace+'-close'+(self.otherClose?','+self.otherClose:'');self.$instance=$background.clone().addClass(self.variant);self.$instance.on(self.closeTrigger+'.'+self.namespace,function(event){if(event.isDefaultPrevented()){return;}
var $target=$(event.target);if(('background'===self.closeOnClick&&$target.is('.'+self.namespace))||'anywhere'===self.closeOnClick||$target.closest(closeButtonSelector).length){self.close(event);event.preventDefault();}});return this;},getContent:function(){if(this.persist!==false&&this.$content){return this.$content;}
var self=this,filters=this.constructor.contentFilters,readTargetAttr=function(name){return self.$currentTarget&&self.$currentTarget.attr(name);},targetValue=readTargetAttr(self.targetAttr),data=self.target||targetValue||'';var filter=filters[self.type];if(!filter&&data in filters){filter=filters[data];data=self.target&&targetValue;}
data=data||readTargetAttr('href')||'';if(!filter){for(var filterName in filters){if(self[filterName]){filter=filters[filterName];data=self[filterName];}}}
if(!filter){var target=data;data=null;$.each(self.contentFilters,function(){filter=filters[this];if(filter.test){data=filter.test(target);}
if(!data&&filter.regex&&target.match&&target.match(filter.regex)){data=target;}
return!data;});if(!data){if('console'in window){window.console.error('Featherlight: no content filter found '+(target?' for "'+target+'"':' (no target specified)'));}
return false;}}
return filter.process.call(self,data);},setContent:function($content){this.$instance.removeClass(this.namespace+'-loading');this.$instance.toggleClass(this.namespace+'-iframe',$content.is('iframe'));this.$instance.find('.'+this.namespace+'-inner').not($content).slice(1).remove().end().replaceWith($.contains(this.$instance[0],$content[0])?'':$content);this.$content=$content.addClass(this.namespace+'-inner');return this;},open:function(event){var self=this;self.$instance.hide().appendTo(self.root);if((!event||!event.isDefaultPrevented())&&self.beforeOpen(event)!==false){if(event){event.preventDefault();}
var $content=self.getContent();if($content){opened.push(self);toggleGlobalEvents(true);self.$instance.fadeIn(self.openSpeed);self.beforeContent(event);return $.when($content).always(function($openendContent){if($openendContent){self.setContent($openendContent);self.afterContent(event);}}).then(self.$instance.promise()).done(function(){self.afterOpen(event);});}}
self.$instance.detach();return $.Deferred().reject().promise();},close:function(event){var self=this,deferred=$.Deferred();if(self.beforeClose(event)===false){deferred.reject();}else{if(0===pruneOpened(self).length){toggleGlobalEvents(false);}
self.$instance.fadeOut(self.closeSpeed,function(){self.$instance.detach();self.afterClose(event);deferred.resolve();});}
return deferred.promise();},resize:function(w,h){if(w&&h){this.$content.css('width','').css('height','');var ratio=Math.max(w/(this.$content.parent().width()-1),h/(this.$content.parent().height()-1));if(ratio>1){ratio=h/Math.floor(h/ratio);this.$content.css('width',''+w/ratio+'px').css('height',''+h/ratio+'px');}}},chainCallbacks:function(chain){for(var name in chain){this[name]=$.proxy(chain[name],this,$.proxy(this[name],this));}}};$.extend(Featherlight,{id:0,autoBind:'[data-featherlight]',defaults:Featherlight.prototype,contentFilters:{jquery:{regex:/^[#.]\w/,test:function(elem){return elem instanceof $&&elem;},process:function(elem){return this.persist!==false?$(elem):$(elem).clone(true);}},image:{regex:/\.(png|jpg|jpeg|gif|tiff?|bmp|svg)(\?\S*)?$/i,process:function(url){var self=this,deferred=$.Deferred(),img=new Image(),$img=$('<img src="'+url+'" alt="" class="'+self.namespace+'-image" />');img.onload=function(){$img.naturalWidth=img.width;$img.naturalHeight=img.height;deferred.resolve($img);};img.onerror=function(){deferred.reject($img);};img.src=url;return deferred.promise();}},html:{regex:/^\s*<[\w!][^<]*>/,process:function(html){return $(html);}},ajax:{regex:/./,process:function(url){var self=this,deferred=$.Deferred();var $container=$('<div></div>').load(url,function(response,status){if(status!=="error"){deferred.resolve($container.contents());}
deferred.reject();});return deferred.promise();}},iframe:{process:function(url){var deferred=new $.Deferred();var $content=$('<iframe/>');var css=parseAttrs(this,'iframe');var attrs=slice(css,iFrameAttributeSet);$content.hide().attr('src',url).attr(attrs).css(css).on('load',function(){deferred.resolve($content.show());}).appendTo(this.$instance.find('.'+this.namespace+'-content'));return deferred.promise();}},text:{process:function(text){return $('<div>',{text:text});}}},functionAttributes:['beforeOpen','afterOpen','beforeContent','afterContent','beforeClose','afterClose'],readElementConfig:function(element,namespace){var Klass=this,regexp=new RegExp('^data-'+namespace+'-(.*)'),config={};if(element&&element.attributes){$.each(element.attributes,function(){var match=this.name.match(regexp);if(match){var val=this.value,name=$.camelCase(match[1]);if($.inArray(name,Klass.functionAttributes)>=0){val=new Function(val);}else{try{val=JSON.parse(val);}
catch(e){}}
config[name]=val;}});}
return config;},extend:function(child,defaults){var Ctor=function(){this.constructor=child;};Ctor.prototype=this.prototype;child.prototype=new Ctor();child.__super__=this.prototype;$.extend(child,this,defaults);child.defaults=child.prototype;return child;},attach:function($source,$content,config){var Klass=this;if(typeof $content==='object'&&$content instanceof $===false&&!config){config=$content;$content=undefined;}
config=$.extend({},config);var namespace=config.namespace||Klass.defaults.namespace,tempConfig=$.extend({},Klass.defaults,Klass.readElementConfig($source[0],namespace),config),sharedPersist;var handler=function(event){var $target=$(event.currentTarget);var elemConfig=$.extend({$source:$source,$currentTarget:$target},Klass.readElementConfig($source[0],tempConfig.namespace),Klass.readElementConfig(event.currentTarget,tempConfig.namespace),config);var fl=sharedPersist||$target.data('featherlight-persisted')||new Klass($content,elemConfig);if(fl.persist==='shared'){sharedPersist=fl;}else if(fl.persist!==false){$target.data('featherlight-persisted',fl);}
if(elemConfig.$currentTarget.blur){elemConfig.$currentTarget.blur();}
fl.open(event);};$source.on(tempConfig.openTrigger+'.'+tempConfig.namespace,tempConfig.filter,handler);return{filter:tempConfig.filter,handler:handler};},current:function(){var all=this.opened();return all[all.length-1]||null;},opened:function(){var klass=this;pruneOpened();return $.grep(opened,function(fl){return fl instanceof klass;});},close:function(event){var cur=this.current();if(cur){return cur.close(event);}},_onReady:function(){var Klass=this;if(Klass.autoBind){var $autobound=$(Klass.autoBind);$autobound.each(function(){Klass.attach($(this));});$(document).on('click',Klass.autoBind,function(evt){if(evt.isDefaultPrevented()){return;}
var $cur=$(evt.currentTarget);var len=$autobound.length;$autobound=$autobound.add($cur);if(len===$autobound.length){return;}
var data=Klass.attach($cur);if(!data.filter||$(evt.target).parentsUntil($cur,data.filter).length>0){data.handler(evt);}});}},_callbackChain:{onKeyUp:function(_super,event){if(27===event.keyCode){if(this.closeOnEsc){$.featherlight.close(event);}
return false;}else{return _super(event);}},beforeOpen:function(_super,event){$(document.documentElement).addClass('with-featherlight');this._previouslyActive=document.activeElement;this._$previouslyTabbable=$("a, input, select, textarea, iframe, button, iframe, [contentEditable=true]").not('[tabindex]').not(this.$instance.find('button'));this._$previouslyWithTabIndex=$('[tabindex]').not('[tabindex="-1"]');this._previousWithTabIndices=this._$previouslyWithTabIndex.map(function(_i,elem){return $(elem).attr('tabindex');});this._$previouslyWithTabIndex.add(this._$previouslyTabbable).attr('tabindex',-1);if(document.activeElement.blur){document.activeElement.blur();}
return _super(event);},afterClose:function(_super,event){var r=_super(event);var self=this;this._$previouslyTabbable.removeAttr('tabindex');this._$previouslyWithTabIndex.each(function(i,elem){$(elem).attr('tabindex',self._previousWithTabIndices[i]);});this._previouslyActive.focus();if(Featherlight.opened().length===0){$(document.documentElement).removeClass('with-featherlight');}
return r;},onResize:function(_super,event){this.resize(this.$content.naturalWidth,this.$content.naturalHeight);return _super(event);},afterContent:function(_super,event){var r=_super(event);this.$instance.find('[autofocus]:not([disabled])').focus();this.onResize(event);return r;}}});$.featherlight=Featherlight;$.fn.featherlight=function($content,config){Featherlight.attach(this,$content,config);return this;};$(document).ready(function(){Featherlight._onReady();});});
/*! Select2 4.0.10 | https://github.com/select2/select2/blob/master/LICENSE.md */
!function(n){"function"==typeof define&&define.amd?define(["jquery"],n):"object"==typeof module&&module.exports?module.exports=function(e,t){return void 0===t&&(t="undefined"!=typeof window?require("jquery"):require("jquery")(e)),n(t),t}:n(jQuery)}(function(d){var e=function(){if(d&&d.fn&&d.fn.select2&&d.fn.select2.amd)var e=d.fn.select2.amd;var t,n,i,h,o,s,f,g,m,v,y,_,r,a,w,l;function b(e,t){return r.call(e,t)}function c(e,t){var n,i,r,o,s,a,l,c,u,d,p,h=t&&t.split("/"),f=y.map,g=f&&f["*"]||{};if(e){for(s=(e=e.split("/")).length-1,y.nodeIdCompat&&w.test(e[s])&&(e[s]=e[s].replace(w,"")),"."===e[0].charAt(0)&&h&&(e=h.slice(0,h.length-1).concat(e)),u=0;u<e.length;u++)if("."===(p=e[u]))e.splice(u,1),u-=1;else if(".."===p){if(0===u||1===u&&".."===e[2]||".."===e[u-1])continue;0<u&&(e.splice(u-1,2),u-=2)}e=e.join("/")}if((h||g)&&f){for(u=(n=e.split("/")).length;0<u;u-=1){if(i=n.slice(0,u).join("/"),h)for(d=h.length;0<d;d-=1)if(r=(r=f[h.slice(0,d).join("/")])&&r[i]){o=r,a=u;break}if(o)break;!l&&g&&g[i]&&(l=g[i],c=u)}!o&&l&&(o=l,a=c),o&&(n.splice(0,a,o),e=n.join("/"))}return e}function A(t,n){return function(){var e=a.call(arguments,0);return"string"!=typeof e[0]&&1===e.length&&e.push(null),s.apply(h,e.concat([t,n]))}}function x(t){return function(e){m[t]=e}}function S(e){if(b(v,e)){var t=v[e];delete v[e],_[e]=!0,o.apply(h,t)}if(!b(m,e)&&!b(_,e))throw new Error("No "+e);return m[e]}function u(e){var t,n=e?e.indexOf("!"):-1;return-1<n&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function D(e){return e?u(e):[]}return e&&e.requirejs||(e?n=e:e={},m={},v={},y={},_={},r=Object.prototype.hasOwnProperty,a=[].slice,w=/\.js$/,f=function(e,t){var n,i=u(e),r=i[0],o=t[1];return e=i[1],r&&(n=S(r=c(r,o))),r?e=n&&n.normalize?n.normalize(e,function(t){return function(e){return c(e,t)}}(o)):c(e,o):(r=(i=u(e=c(e,o)))[0],e=i[1],r&&(n=S(r))),{f:r?r+"!"+e:e,n:e,pr:r,p:n}},g={require:function(e){return A(e)},exports:function(e){var t=m[e];return void 0!==t?t:m[e]={}},module:function(e){return{id:e,uri:"",exports:m[e],config:function(e){return function(){return y&&y.config&&y.config[e]||{}}}(e)}}},o=function(e,t,n,i){var r,o,s,a,l,c,u,d=[],p=typeof n;if(c=D(i=i||e),"undefined"==p||"function"==p){for(t=!t.length&&n.length?["require","exports","module"]:t,l=0;l<t.length;l+=1)if("require"===(o=(a=f(t[l],c)).f))d[l]=g.require(e);else if("exports"===o)d[l]=g.exports(e),u=!0;else if("module"===o)r=d[l]=g.module(e);else if(b(m,o)||b(v,o)||b(_,o))d[l]=S(o);else{if(!a.p)throw new Error(e+" missing "+o);a.p.load(a.n,A(i,!0),x(o),{}),d[l]=m[o]}s=n?n.apply(m[e],d):void 0,e&&(r&&r.exports!==h&&r.exports!==m[e]?m[e]=r.exports:s===h&&u||(m[e]=s))}else e&&(m[e]=n)},t=n=s=function(e,t,n,i,r){if("string"==typeof e)return g[e]?g[e](t):S(f(e,D(t)).f);if(!e.splice){if((y=e).deps&&s(y.deps,y.callback),!t)return;t.splice?(e=t,t=n,n=null):e=h}return t=t||function(){},"function"==typeof n&&(n=i,i=r),i?o(h,e,t,n):setTimeout(function(){o(h,e,t,n)},4),s},s.config=function(e){return s(e)},t._defined=m,(i=function(e,t,n){if("string"!=typeof e)throw new Error("See almond README: incorrect module build, no module name");t.splice||(n=t,t=[]),b(m,e)||b(v,e)||(v[e]=[e,t,n])}).amd={jQuery:!0},e.requirejs=t,e.require=n,e.define=i),e.define("almond",function(){}),e.define("jquery",[],function(){var e=d||$;return null==e&&console&&console.error&&console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."),e}),e.define("select2/utils",["jquery"],function(o){var r={};function u(e){var t=e.prototype,n=[];for(var i in t){"function"==typeof t[i]&&"constructor"!==i&&n.push(i)}return n}r.Extend=function(e,t){var n={}.hasOwnProperty;function i(){this.constructor=e}for(var r in t)n.call(t,r)&&(e[r]=t[r]);return i.prototype=t.prototype,e.prototype=new i,e.__super__=t.prototype,e},r.Decorate=function(i,r){var e=u(r),t=u(i);function o(){var e=Array.prototype.unshift,t=r.prototype.constructor.length,n=i.prototype.constructor;0<t&&(e.call(arguments,i.prototype.constructor),n=r.prototype.constructor),n.apply(this,arguments)}r.displayName=i.displayName,o.prototype=new function(){this.constructor=o};for(var n=0;n<t.length;n++){var s=t[n];o.prototype[s]=i.prototype[s]}function a(e){var t=function(){};e in o.prototype&&(t=o.prototype[e]);var n=r.prototype[e];return function(){return Array.prototype.unshift.call(arguments,t),n.apply(this,arguments)}}for(var l=0;l<e.length;l++){var c=e[l];o.prototype[c]=a(c)}return o};function e(){this.listeners={}}e.prototype.on=function(e,t){this.listeners=this.listeners||{},e in this.listeners?this.listeners[e].push(t):this.listeners[e]=[t]},e.prototype.trigger=function(e){var t=Array.prototype.slice,n=t.call(arguments,1);this.listeners=this.listeners||{},null==n&&(n=[]),0===n.length&&n.push({}),(n[0]._type=e)in this.listeners&&this.invoke(this.listeners[e],t.call(arguments,1)),"*"in this.listeners&&this.invoke(this.listeners["*"],arguments)},e.prototype.invoke=function(e,t){for(var n=0,i=e.length;n<i;n++)e[n].apply(this,t)},r.Observable=e,r.generateChars=function(e){for(var t="",n=0;n<e;n++){t+=Math.floor(36*Math.random()).toString(36)}return t},r.bind=function(e,t){return function(){e.apply(t,arguments)}},r._convertData=function(e){for(var t in e){var n=t.split("-"),i=e;if(1!==n.length){for(var r=0;r<n.length;r++){var o=n[r];(o=o.substring(0,1).toLowerCase()+o.substring(1))in i||(i[o]={}),r==n.length-1&&(i[o]=e[t]),i=i[o]}delete e[t]}}return e},r.hasScroll=function(e,t){var n=o(t),i=t.style.overflowX,r=t.style.overflowY;return(i!==r||"hidden"!==r&&"visible"!==r)&&("scroll"===i||"scroll"===r||(n.innerHeight()<t.scrollHeight||n.innerWidth()<t.scrollWidth))},r.escapeMarkup=function(e){var t={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return"string"!=typeof e?e:String(e).replace(/[&<>"'\/\\]/g,function(e){return t[e]})},r.appendMany=function(e,t){if("1.7"===o.fn.jquery.substr(0,3)){var n=o();o.map(t,function(e){n=n.add(e)}),t=n}e.append(t)},r.__cache={};var n=0;return r.GetUniqueElementId=function(e){var t=e.getAttribute("data-select2-id");return null==t&&(e.id?(t=e.id,e.setAttribute("data-select2-id",t)):(e.setAttribute("data-select2-id",++n),t=n.toString())),t},r.StoreData=function(e,t,n){var i=r.GetUniqueElementId(e);r.__cache[i]||(r.__cache[i]={}),r.__cache[i][t]=n},r.GetData=function(e,t){var n=r.GetUniqueElementId(e);return t?r.__cache[n]&&null!=r.__cache[n][t]?r.__cache[n][t]:o(e).data(t):r.__cache[n]},r.RemoveData=function(e){var t=r.GetUniqueElementId(e);null!=r.__cache[t]&&delete r.__cache[t],e.removeAttribute("data-select2-id")},r}),e.define("select2/results",["jquery","./utils"],function(h,f){function i(e,t,n){this.$element=e,this.data=n,this.options=t,i.__super__.constructor.call(this)}return f.Extend(i,f.Observable),i.prototype.render=function(){var e=h('<ul class="select2-results__options" role="listbox"></ul>');return this.options.get("multiple")&&e.attr("aria-multiselectable","true"),this.$results=e},i.prototype.clear=function(){this.$results.empty()},i.prototype.displayMessage=function(e){var t=this.options.get("escapeMarkup");this.clear(),this.hideLoading();var n=h('<li role="alert" aria-live="assertive" class="select2-results__option"></li>'),i=this.options.get("translations").get(e.message);n.append(t(i(e.args))),n[0].className+=" select2-results__message",this.$results.append(n)},i.prototype.hideMessages=function(){this.$results.find(".select2-results__message").remove()},i.prototype.append=function(e){this.hideLoading();var t=[];if(null!=e.results&&0!==e.results.length){e.results=this.sort(e.results);for(var n=0;n<e.results.length;n++){var i=e.results[n],r=this.option(i);t.push(r)}this.$results.append(t)}else 0===this.$results.children().length&&this.trigger("results:message",{message:"noResults"})},i.prototype.position=function(e,t){t.find(".select2-results").append(e)},i.prototype.sort=function(e){return this.options.get("sorter")(e)},i.prototype.highlightFirstItem=function(){var e=this.$results.find(".select2-results__option[aria-selected]"),t=e.filter("[aria-selected=true]");0<t.length?t.first().trigger("mouseenter"):e.first().trigger("mouseenter"),this.ensureHighlightVisible()},i.prototype.setClasses=function(){var t=this;this.data.current(function(e){var i=h.map(e,function(e){return e.id.toString()});t.$results.find(".select2-results__option[aria-selected]").each(function(){var e=h(this),t=f.GetData(this,"data"),n=""+t.id;null!=t.element&&t.element.selected||null==t.element&&-1<h.inArray(n,i)?e.attr("aria-selected","true"):e.attr("aria-selected","false")})})},i.prototype.showLoading=function(e){this.hideLoading();var t={disabled:!0,loading:!0,text:this.options.get("translations").get("searching")(e)},n=this.option(t);n.className+=" loading-results",this.$results.prepend(n)},i.prototype.hideLoading=function(){this.$results.find(".loading-results").remove()},i.prototype.option=function(e){var t=document.createElement("li");t.className="select2-results__option";var n={role:"option","aria-selected":"false"},i=window.Element.prototype.matches||window.Element.prototype.msMatchesSelector||window.Element.prototype.webkitMatchesSelector;for(var r in(null!=e.element&&i.call(e.element,":disabled")||null==e.element&&e.disabled)&&(delete n["aria-selected"],n["aria-disabled"]="true"),null==e.id&&delete n["aria-selected"],null!=e._resultId&&(t.id=e._resultId),e.title&&(t.title=e.title),e.children&&(n.role="group",n["aria-label"]=e.text,delete n["aria-selected"]),n){var o=n[r];t.setAttribute(r,o)}if(e.children){var s=h(t),a=document.createElement("strong");a.className="select2-results__group";h(a);this.template(e,a);for(var l=[],c=0;c<e.children.length;c++){var u=e.children[c],d=this.option(u);l.push(d)}var p=h("<ul></ul>",{class:"select2-results__options select2-results__options--nested"});p.append(l),s.append(a),s.append(p)}else this.template(e,t);return f.StoreData(t,"data",e),t},i.prototype.bind=function(t,e){var l=this,n=t.id+"-results";this.$results.attr("id",n),t.on("results:all",function(e){l.clear(),l.append(e.data),t.isOpen()&&(l.setClasses(),l.highlightFirstItem())}),t.on("results:append",function(e){l.append(e.data),t.isOpen()&&l.setClasses()}),t.on("query",function(e){l.hideMessages(),l.showLoading(e)}),t.on("select",function(){t.isOpen()&&(l.setClasses(),l.options.get("scrollAfterSelect")&&l.highlightFirstItem())}),t.on("unselect",function(){t.isOpen()&&(l.setClasses(),l.options.get("scrollAfterSelect")&&l.highlightFirstItem())}),t.on("open",function(){l.$results.attr("aria-expanded","true"),l.$results.attr("aria-hidden","false"),l.setClasses(),l.ensureHighlightVisible()}),t.on("close",function(){l.$results.attr("aria-expanded","false"),l.$results.attr("aria-hidden","true"),l.$results.removeAttr("aria-activedescendant")}),t.on("results:toggle",function(){var e=l.getHighlightedResults();0!==e.length&&e.trigger("mouseup")}),t.on("results:select",function(){var e=l.getHighlightedResults();if(0!==e.length){var t=f.GetData(e[0],"data");"true"==e.attr("aria-selected")?l.trigger("close",{}):l.trigger("select",{data:t})}}),t.on("results:previous",function(){var e=l.getHighlightedResults(),t=l.$results.find("[aria-selected]"),n=t.index(e);if(!(n<=0)){var i=n-1;0===e.length&&(i=0);var r=t.eq(i);r.trigger("mouseenter");var o=l.$results.offset().top,s=r.offset().top,a=l.$results.scrollTop()+(s-o);0===i?l.$results.scrollTop(0):s-o<0&&l.$results.scrollTop(a)}}),t.on("results:next",function(){var e=l.getHighlightedResults(),t=l.$results.find("[aria-selected]"),n=t.index(e)+1;if(!(n>=t.length)){var i=t.eq(n);i.trigger("mouseenter");var r=l.$results.offset().top+l.$results.outerHeight(!1),o=i.offset().top+i.outerHeight(!1),s=l.$results.scrollTop()+o-r;0===n?l.$results.scrollTop(0):r<o&&l.$results.scrollTop(s)}}),t.on("results:focus",function(e){e.element.addClass("select2-results__option--highlighted")}),t.on("results:message",function(e){l.displayMessage(e)}),h.fn.mousewheel&&this.$results.on("mousewheel",function(e){var t=l.$results.scrollTop(),n=l.$results.get(0).scrollHeight-t+e.deltaY,i=0<e.deltaY&&t-e.deltaY<=0,r=e.deltaY<0&&n<=l.$results.height();i?(l.$results.scrollTop(0),e.preventDefault(),e.stopPropagation()):r&&(l.$results.scrollTop(l.$results.get(0).scrollHeight-l.$results.height()),e.preventDefault(),e.stopPropagation())}),this.$results.on("mouseup",".select2-results__option[aria-selected]",function(e){var t=h(this),n=f.GetData(this,"data");"true"!==t.attr("aria-selected")?l.trigger("select",{originalEvent:e,data:n}):l.options.get("multiple")?l.trigger("unselect",{originalEvent:e,data:n}):l.trigger("close",{})}),this.$results.on("mouseenter",".select2-results__option[aria-selected]",function(e){var t=f.GetData(this,"data");l.getHighlightedResults().removeClass("select2-results__option--highlighted"),l.trigger("results:focus",{data:t,element:h(this)})})},i.prototype.getHighlightedResults=function(){return this.$results.find(".select2-results__option--highlighted")},i.prototype.destroy=function(){this.$results.remove()},i.prototype.ensureHighlightVisible=function(){var e=this.getHighlightedResults();if(0!==e.length){var t=this.$results.find("[aria-selected]").index(e),n=this.$results.offset().top,i=e.offset().top,r=this.$results.scrollTop()+(i-n),o=i-n;r-=2*e.outerHeight(!1),t<=2?this.$results.scrollTop(0):(o>this.$results.outerHeight()||o<0)&&this.$results.scrollTop(r)}},i.prototype.template=function(e,t){var n=this.options.get("templateResult"),i=this.options.get("escapeMarkup"),r=n(e,t);null==r?t.style.display="none":"string"==typeof r?t.innerHTML=i(r):h(t).append(r)},i}),e.define("select2/keys",[],function(){return{BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46}}),e.define("select2/selection/base",["jquery","../utils","../keys"],function(n,i,r){function o(e,t){this.$element=e,this.options=t,o.__super__.constructor.call(this)}return i.Extend(o,i.Observable),o.prototype.render=function(){var e=n('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');return this._tabindex=0,null!=i.GetData(this.$element[0],"old-tabindex")?this._tabindex=i.GetData(this.$element[0],"old-tabindex"):null!=this.$element.attr("tabindex")&&(this._tabindex=this.$element.attr("tabindex")),e.attr("title",this.$element.attr("title")),e.attr("tabindex",this._tabindex),e.attr("aria-disabled","false"),this.$selection=e},o.prototype.bind=function(e,t){var n=this,i=e.id+"-results";this.container=e,this.$selection.on("focus",function(e){n.trigger("focus",e)}),this.$selection.on("blur",function(e){n._handleBlur(e)}),this.$selection.on("keydown",function(e){n.trigger("keypress",e),e.which===r.SPACE&&e.preventDefault()}),e.on("results:focus",function(e){n.$selection.attr("aria-activedescendant",e.data._resultId)}),e.on("selection:update",function(e){n.update(e.data)}),e.on("open",function(){n.$selection.attr("aria-expanded","true"),n.$selection.attr("aria-owns",i),n._attachCloseHandler(e)}),e.on("close",function(){n.$selection.attr("aria-expanded","false"),n.$selection.removeAttr("aria-activedescendant"),n.$selection.removeAttr("aria-owns"),n.$selection.trigger("focus"),n._detachCloseHandler(e)}),e.on("enable",function(){n.$selection.attr("tabindex",n._tabindex),n.$selection.attr("aria-disabled","false")}),e.on("disable",function(){n.$selection.attr("tabindex","-1"),n.$selection.attr("aria-disabled","true")})},o.prototype._handleBlur=function(e){var t=this;window.setTimeout(function(){document.activeElement==t.$selection[0]||n.contains(t.$selection[0],document.activeElement)||t.trigger("blur",e)},1)},o.prototype._attachCloseHandler=function(e){n(document.body).on("mousedown.select2."+e.id,function(e){var t=n(e.target).closest(".select2");n(".select2.select2-container--open").each(function(){this!=t[0]&&i.GetData(this,"element").select2("close")})})},o.prototype._detachCloseHandler=function(e){n(document.body).off("mousedown.select2."+e.id)},o.prototype.position=function(e,t){t.find(".selection").append(e)},o.prototype.destroy=function(){this._detachCloseHandler(this.container)},o.prototype.update=function(e){throw new Error("The `update` method must be defined in child classes.")},o}),e.define("select2/selection/single",["jquery","./base","../utils","../keys"],function(e,t,n,i){function r(){r.__super__.constructor.apply(this,arguments)}return n.Extend(r,t),r.prototype.render=function(){var e=r.__super__.render.call(this);return e.addClass("select2-selection--single"),e.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'),e},r.prototype.bind=function(t,e){var n=this;r.__super__.bind.apply(this,arguments);var i=t.id+"-container";this.$selection.find(".select2-selection__rendered").attr("id",i).attr("role","textbox").attr("aria-readonly","true"),this.$selection.attr("aria-labelledby",i),this.$selection.on("mousedown",function(e){1===e.which&&n.trigger("toggle",{originalEvent:e})}),this.$selection.on("focus",function(e){}),this.$selection.on("blur",function(e){}),t.on("focus",function(e){t.isOpen()||n.$selection.trigger("focus")})},r.prototype.clear=function(){var e=this.$selection.find(".select2-selection__rendered");e.empty(),e.removeAttr("title")},r.prototype.display=function(e,t){var n=this.options.get("templateSelection");return this.options.get("escapeMarkup")(n(e,t))},r.prototype.selectionContainer=function(){return e("<span></span>")},r.prototype.update=function(e){if(0!==e.length){var t=e[0],n=this.$selection.find(".select2-selection__rendered"),i=this.display(t,n);n.empty().append(i);var r=t.title||t.text;r?n.attr("title",r):n.removeAttr("title")}else this.clear()},r}),e.define("select2/selection/multiple",["jquery","./base","../utils"],function(r,e,l){function n(e,t){n.__super__.constructor.apply(this,arguments)}return l.Extend(n,e),n.prototype.render=function(){var e=n.__super__.render.call(this);return e.addClass("select2-selection--multiple"),e.html('<ul class="select2-selection__rendered"></ul>'),e},n.prototype.bind=function(e,t){var i=this;n.__super__.bind.apply(this,arguments),this.$selection.on("click",function(e){i.trigger("toggle",{originalEvent:e})}),this.$selection.on("click",".select2-selection__choice__remove",function(e){if(!i.options.get("disabled")){var t=r(this).parent(),n=l.GetData(t[0],"data");i.trigger("unselect",{originalEvent:e,data:n})}})},n.prototype.clear=function(){var e=this.$selection.find(".select2-selection__rendered");e.empty(),e.removeAttr("title")},n.prototype.display=function(e,t){var n=this.options.get("templateSelection");return this.options.get("escapeMarkup")(n(e,t))},n.prototype.selectionContainer=function(){return r('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>')},n.prototype.update=function(e){if(this.clear(),0!==e.length){for(var t=[],n=0;n<e.length;n++){var i=e[n],r=this.selectionContainer(),o=this.display(i,r);r.append(o);var s=i.title||i.text;s&&r.attr("title",s),l.StoreData(r[0],"data",i),t.push(r)}var a=this.$selection.find(".select2-selection__rendered");l.appendMany(a,t)}},n}),e.define("select2/selection/placeholder",["../utils"],function(e){function t(e,t,n){this.placeholder=this.normalizePlaceholder(n.get("placeholder")),e.call(this,t,n)}return t.prototype.normalizePlaceholder=function(e,t){return"string"==typeof t&&(t={id:"",text:t}),t},t.prototype.createPlaceholder=function(e,t){var n=this.selectionContainer();return n.html(this.display(t)),n.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"),n},t.prototype.update=function(e,t){var n=1==t.length&&t[0].id!=this.placeholder.id;if(1<t.length||n)return e.call(this,t);this.clear();var i=this.createPlaceholder(this.placeholder);this.$selection.find(".select2-selection__rendered").append(i)},t}),e.define("select2/selection/allowClear",["jquery","../keys","../utils"],function(r,i,a){function e(){}return e.prototype.bind=function(e,t,n){var i=this;e.call(this,t,n),null==this.placeholder&&this.options.get("debug")&&window.console&&console.error&&console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."),this.$selection.on("mousedown",".select2-selection__clear",function(e){i._handleClear(e)}),t.on("keypress",function(e){i._handleKeyboardClear(e,t)})},e.prototype._handleClear=function(e,t){if(!this.options.get("disabled")){var n=this.$selection.find(".select2-selection__clear");if(0!==n.length){t.stopPropagation();var i=a.GetData(n[0],"data"),r=this.$element.val();this.$element.val(this.placeholder.id);var o={data:i};if(this.trigger("clear",o),o.prevented)this.$element.val(r);else{for(var s=0;s<i.length;s++)if(o={data:i[s]},this.trigger("unselect",o),o.prevented)return void this.$element.val(r);this.$element.trigger("change"),this.trigger("toggle",{})}}}},e.prototype._handleKeyboardClear=function(e,t,n){n.isOpen()||t.which!=i.DELETE&&t.which!=i.BACKSPACE||this._handleClear(t)},e.prototype.update=function(e,t){if(e.call(this,t),!(0<this.$selection.find(".select2-selection__placeholder").length||0===t.length)){var n=this.options.get("translations").get("removeAllItems"),i=r('<span class="select2-selection__clear" title="'+n()+'">&times;</span>');a.StoreData(i[0],"data",t),this.$selection.find(".select2-selection__rendered").prepend(i)}},e}),e.define("select2/selection/search",["jquery","../utils","../keys"],function(i,a,l){function e(e,t,n){e.call(this,t,n)}return e.prototype.render=function(e){var t=i('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></li>');this.$searchContainer=t,this.$search=t.find("input");var n=e.call(this);return this._transferTabIndex(),n},e.prototype.bind=function(e,t,n){var i=this,r=t.id+"-results";e.call(this,t,n),t.on("open",function(){i.$search.attr("aria-controls",r),i.$search.trigger("focus")}),t.on("close",function(){i.$search.val(""),i.$search.removeAttr("aria-controls"),i.$search.removeAttr("aria-activedescendant"),i.$search.trigger("focus")}),t.on("enable",function(){i.$search.prop("disabled",!1),i._transferTabIndex()}),t.on("disable",function(){i.$search.prop("disabled",!0)}),t.on("focus",function(e){i.$search.trigger("focus")}),t.on("results:focus",function(e){e.data._resultId?i.$search.attr("aria-activedescendant",e.data._resultId):i.$search.removeAttr("aria-activedescendant")}),this.$selection.on("focusin",".select2-search--inline",function(e){i.trigger("focus",e)}),this.$selection.on("focusout",".select2-search--inline",function(e){i._handleBlur(e)}),this.$selection.on("keydown",".select2-search--inline",function(e){if(e.stopPropagation(),i.trigger("keypress",e),i._keyUpPrevented=e.isDefaultPrevented(),e.which===l.BACKSPACE&&""===i.$search.val()){var t=i.$searchContainer.prev(".select2-selection__choice");if(0<t.length){var n=a.GetData(t[0],"data");i.searchRemoveChoice(n),e.preventDefault()}}}),this.$selection.on("click",".select2-search--inline",function(e){i.$search.val()&&e.stopPropagation()});var o=document.documentMode,s=o&&o<=11;this.$selection.on("input.searchcheck",".select2-search--inline",function(e){s?i.$selection.off("input.search input.searchcheck"):i.$selection.off("keyup.search")}),this.$selection.on("keyup.search input.search",".select2-search--inline",function(e){if(s&&"input"===e.type)i.$selection.off("input.search input.searchcheck");else{var t=e.which;t!=l.SHIFT&&t!=l.CTRL&&t!=l.ALT&&t!=l.TAB&&i.handleSearch(e)}})},e.prototype._transferTabIndex=function(e){this.$search.attr("tabindex",this.$selection.attr("tabindex")),this.$selection.attr("tabindex","-1")},e.prototype.createPlaceholder=function(e,t){this.$search.attr("placeholder",t.text)},e.prototype.update=function(e,t){var n=this.$search[0]==document.activeElement;this.$search.attr("placeholder",""),e.call(this,t),this.$selection.find(".select2-selection__rendered").append(this.$searchContainer),this.resizeSearch(),n&&this.$search.trigger("focus")},e.prototype.handleSearch=function(){if(this.resizeSearch(),!this._keyUpPrevented){var e=this.$search.val();this.trigger("query",{term:e})}this._keyUpPrevented=!1},e.prototype.searchRemoveChoice=function(e,t){this.trigger("unselect",{data:t}),this.$search.val(t.text),this.handleSearch()},e.prototype.resizeSearch=function(){this.$search.css("width","25px");var e="";""!==this.$search.attr("placeholder")?e=this.$selection.find(".select2-selection__rendered").width():e=.75*(this.$search.val().length+1)+"em";this.$search.css("width",e)},e}),e.define("select2/selection/eventRelay",["jquery"],function(s){function e(){}return e.prototype.bind=function(e,t,n){var i=this,r=["open","opening","close","closing","select","selecting","unselect","unselecting","clear","clearing"],o=["opening","closing","selecting","unselecting","clearing"];e.call(this,t,n),t.on("*",function(e,t){if(-1!==s.inArray(e,r)){t=t||{};var n=s.Event("select2:"+e,{params:t});i.$element.trigger(n),-1!==s.inArray(e,o)&&(t.prevented=n.isDefaultPrevented())}})},e}),e.define("select2/translation",["jquery","require"],function(t,n){function i(e){this.dict=e||{}}return i.prototype.all=function(){return this.dict},i.prototype.get=function(e){return this.dict[e]},i.prototype.extend=function(e){this.dict=t.extend({},e.all(),this.dict)},i._cache={},i.loadPath=function(e){if(!(e in i._cache)){var t=n(e);i._cache[e]=t}return new i(i._cache[e])},i}),e.define("select2/diacritics",[],function(){return{"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Œ":"OE","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","œ":"oe","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ϊ":"Ι","Ό":"Ο","Ύ":"Υ","Ϋ":"Υ","Ώ":"Ω","ά":"α","έ":"ε","ή":"η","ί":"ι","ϊ":"ι","ΐ":"ι","ό":"ο","ύ":"υ","ϋ":"υ","ΰ":"υ","ώ":"ω","ς":"σ","’":"'"}}),e.define("select2/data/base",["../utils"],function(i){function n(e,t){n.__super__.constructor.call(this)}return i.Extend(n,i.Observable),n.prototype.current=function(e){throw new Error("The `current` method must be defined in child classes.")},n.prototype.query=function(e,t){throw new Error("The `query` method must be defined in child classes.")},n.prototype.bind=function(e,t){},n.prototype.destroy=function(){},n.prototype.generateResultId=function(e,t){var n=e.id+"-result-";return n+=i.generateChars(4),null!=t.id?n+="-"+t.id.toString():n+="-"+i.generateChars(4),n},n}),e.define("select2/data/select",["./base","../utils","jquery"],function(e,a,l){function n(e,t){this.$element=e,this.options=t,n.__super__.constructor.call(this)}return a.Extend(n,e),n.prototype.current=function(e){var n=[],i=this;this.$element.find(":selected").each(function(){var e=l(this),t=i.item(e);n.push(t)}),e(n)},n.prototype.select=function(r){var o=this;if(r.selected=!0,l(r.element).is("option"))return r.element.selected=!0,void this.$element.trigger("change");if(this.$element.prop("multiple"))this.current(function(e){var t=[];(r=[r]).push.apply(r,e);for(var n=0;n<r.length;n++){var i=r[n].id;-1===l.inArray(i,t)&&t.push(i)}o.$element.val(t),o.$element.trigger("change")});else{var e=r.id;this.$element.val(e),this.$element.trigger("change")}},n.prototype.unselect=function(r){var o=this;if(this.$element.prop("multiple")){if(r.selected=!1,l(r.element).is("option"))return r.element.selected=!1,void this.$element.trigger("change");this.current(function(e){for(var t=[],n=0;n<e.length;n++){var i=e[n].id;i!==r.id&&-1===l.inArray(i,t)&&t.push(i)}o.$element.val(t),o.$element.trigger("change")})}},n.prototype.bind=function(e,t){var n=this;(this.container=e).on("select",function(e){n.select(e.data)}),e.on("unselect",function(e){n.unselect(e.data)})},n.prototype.destroy=function(){this.$element.find("*").each(function(){a.RemoveData(this)})},n.prototype.query=function(i,e){var r=[],o=this;this.$element.children().each(function(){var e=l(this);if(e.is("option")||e.is("optgroup")){var t=o.item(e),n=o.matches(i,t);null!==n&&r.push(n)}}),e({results:r})},n.prototype.addOptions=function(e){a.appendMany(this.$element,e)},n.prototype.option=function(e){var t;e.children?(t=document.createElement("optgroup")).label=e.text:void 0!==(t=document.createElement("option")).textContent?t.textContent=e.text:t.innerText=e.text,void 0!==e.id&&(t.value=e.id),e.disabled&&(t.disabled=!0),e.selected&&(t.selected=!0),e.title&&(t.title=e.title);var n=l(t),i=this._normalizeItem(e);return i.element=t,a.StoreData(t,"data",i),n},n.prototype.item=function(e){var t={};if(null!=(t=a.GetData(e[0],"data")))return t;if(e.is("option"))t={id:e.val(),text:e.text(),disabled:e.prop("disabled"),selected:e.prop("selected"),title:e.prop("title")};else if(e.is("optgroup")){t={text:e.prop("label"),children:[],title:e.prop("title")};for(var n=e.children("option"),i=[],r=0;r<n.length;r++){var o=l(n[r]),s=this.item(o);i.push(s)}t.children=i}return(t=this._normalizeItem(t)).element=e[0],a.StoreData(e[0],"data",t),t},n.prototype._normalizeItem=function(e){e!==Object(e)&&(e={id:e,text:e});return null!=(e=l.extend({},{text:""},e)).id&&(e.id=e.id.toString()),null!=e.text&&(e.text=e.text.toString()),null==e._resultId&&e.id&&null!=this.container&&(e._resultId=this.generateResultId(this.container,e)),l.extend({},{selected:!1,disabled:!1},e)},n.prototype.matches=function(e,t){return this.options.get("matcher")(e,t)},n}),e.define("select2/data/array",["./select","../utils","jquery"],function(e,f,g){function i(e,t){this._dataToConvert=t.get("data")||[],i.__super__.constructor.call(this,e,t)}return f.Extend(i,e),i.prototype.bind=function(e,t){i.__super__.bind.call(this,e,t),this.addOptions(this.convertToOptions(this._dataToConvert))},i.prototype.select=function(n){var e=this.$element.find("option").filter(function(e,t){return t.value==n.id.toString()});0===e.length&&(e=this.option(n),this.addOptions(e)),i.__super__.select.call(this,n)},i.prototype.convertToOptions=function(e){var t=this,n=this.$element.find("option"),i=n.map(function(){return t.item(g(this)).id}).get(),r=[];function o(e){return function(){return g(this).val()==e.id}}for(var s=0;s<e.length;s++){var a=this._normalizeItem(e[s]);if(0<=g.inArray(a.id,i)){var l=n.filter(o(a)),c=this.item(l),u=g.extend(!0,{},a,c),d=this.option(u);l.replaceWith(d)}else{var p=this.option(a);if(a.children){var h=this.convertToOptions(a.children);f.appendMany(p,h)}r.push(p)}}return r},i}),e.define("select2/data/ajax",["./array","../utils","jquery"],function(e,t,o){function n(e,t){this.ajaxOptions=this._applyDefaults(t.get("ajax")),null!=this.ajaxOptions.processResults&&(this.processResults=this.ajaxOptions.processResults),n.__super__.constructor.call(this,e,t)}return t.Extend(n,e),n.prototype._applyDefaults=function(e){var t={data:function(e){return o.extend({},e,{q:e.term})},transport:function(e,t,n){var i=o.ajax(e);return i.then(t),i.fail(n),i}};return o.extend({},t,e,!0)},n.prototype.processResults=function(e){return e},n.prototype.query=function(n,i){var r=this;null!=this._request&&(o.isFunction(this._request.abort)&&this._request.abort(),this._request=null);var t=o.extend({type:"GET"},this.ajaxOptions);function e(){var e=t.transport(t,function(e){var t=r.processResults(e,n);r.options.get("debug")&&window.console&&console.error&&(t&&t.results&&o.isArray(t.results)||console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")),i(t)},function(){"status"in e&&(0===e.status||"0"===e.status)||r.trigger("results:message",{message:"errorLoading"})});r._request=e}"function"==typeof t.url&&(t.url=t.url.call(this.$element,n)),"function"==typeof t.data&&(t.data=t.data.call(this.$element,n)),this.ajaxOptions.delay&&null!=n.term?(this._queryTimeout&&window.clearTimeout(this._queryTimeout),this._queryTimeout=window.setTimeout(e,this.ajaxOptions.delay)):e()},n}),e.define("select2/data/tags",["jquery"],function(u){function e(e,t,n){var i=n.get("tags"),r=n.get("createTag");void 0!==r&&(this.createTag=r);var o=n.get("insertTag");if(void 0!==o&&(this.insertTag=o),e.call(this,t,n),u.isArray(i))for(var s=0;s<i.length;s++){var a=i[s],l=this._normalizeItem(a),c=this.option(l);this.$element.append(c)}}return e.prototype.query=function(e,c,u){var d=this;this._removeOldTags(),null!=c.term&&null==c.page?e.call(this,c,function e(t,n){for(var i=t.results,r=0;r<i.length;r++){var o=i[r],s=null!=o.children&&!e({results:o.children},!0);if((o.text||"").toUpperCase()===(c.term||"").toUpperCase()||s)return!n&&(t.data=i,void u(t))}if(n)return!0;var a=d.createTag(c);if(null!=a){var l=d.option(a);l.attr("data-select2-tag",!0),d.addOptions([l]),d.insertTag(i,a)}t.results=i,u(t)}):e.call(this,c,u)},e.prototype.createTag=function(e,t){var n=u.trim(t.term);return""===n?null:{id:n,text:n}},e.prototype.insertTag=function(e,t,n){t.unshift(n)},e.prototype._removeOldTags=function(e){this.$element.find("option[data-select2-tag]").each(function(){this.selected||u(this).remove()})},e}),e.define("select2/data/tokenizer",["jquery"],function(d){function e(e,t,n){var i=n.get("tokenizer");void 0!==i&&(this.tokenizer=i),e.call(this,t,n)}return e.prototype.bind=function(e,t,n){e.call(this,t,n),this.$search=t.dropdown.$search||t.selection.$search||n.find(".select2-search__field")},e.prototype.query=function(e,t,n){var i=this;t.term=t.term||"";var r=this.tokenizer(t,this.options,function(e){var t=i._normalizeItem(e);if(!i.$element.find("option").filter(function(){return d(this).val()===t.id}).length){var n=i.option(t);n.attr("data-select2-tag",!0),i._removeOldTags(),i.addOptions([n])}!function(e){i.trigger("select",{data:e})}(t)});r.term!==t.term&&(this.$search.length&&(this.$search.val(r.term),this.$search.trigger("focus")),t.term=r.term),e.call(this,t,n)},e.prototype.tokenizer=function(e,t,n,i){for(var r=n.get("tokenSeparators")||[],o=t.term,s=0,a=this.createTag||function(e){return{id:e.term,text:e.term}};s<o.length;){var l=o[s];if(-1!==d.inArray(l,r)){var c=o.substr(0,s),u=a(d.extend({},t,{term:c}));null!=u?(i(u),o=o.substr(s+1)||"",s=0):s++}else s++}return{term:o}},e}),e.define("select2/data/minimumInputLength",[],function(){function e(e,t,n){this.minimumInputLength=n.get("minimumInputLength"),e.call(this,t,n)}return e.prototype.query=function(e,t,n){t.term=t.term||"",t.term.length<this.minimumInputLength?this.trigger("results:message",{message:"inputTooShort",args:{minimum:this.minimumInputLength,input:t.term,params:t}}):e.call(this,t,n)},e}),e.define("select2/data/maximumInputLength",[],function(){function e(e,t,n){this.maximumInputLength=n.get("maximumInputLength"),e.call(this,t,n)}return e.prototype.query=function(e,t,n){t.term=t.term||"",0<this.maximumInputLength&&t.term.length>this.maximumInputLength?this.trigger("results:message",{message:"inputTooLong",args:{maximum:this.maximumInputLength,input:t.term,params:t}}):e.call(this,t,n)},e}),e.define("select2/data/maximumSelectionLength",[],function(){function e(e,t,n){this.maximumSelectionLength=n.get("maximumSelectionLength"),e.call(this,t,n)}return e.prototype.bind=function(e,t,n){var i=this;e.call(this,t,n),t.on("select",function(){i._checkIfMaximumSelected()})},e.prototype.query=function(e,t,n){var i=this;this._checkIfMaximumSelected(function(){e.call(i,t,n)})},e.prototype._checkIfMaximumSelected=function(e,n){var i=this;this.current(function(e){var t=null!=e?e.length:0;0<i.maximumSelectionLength&&t>=i.maximumSelectionLength?i.trigger("results:message",{message:"maximumSelected",args:{maximum:i.maximumSelectionLength}}):n&&n()})},e}),e.define("select2/dropdown",["jquery","./utils"],function(t,e){function n(e,t){this.$element=e,this.options=t,n.__super__.constructor.call(this)}return e.Extend(n,e.Observable),n.prototype.render=function(){var e=t('<span class="select2-dropdown"><span class="select2-results"></span></span>');return e.attr("dir",this.options.get("dir")),this.$dropdown=e},n.prototype.bind=function(){},n.prototype.position=function(e,t){},n.prototype.destroy=function(){this.$dropdown.remove()},n}),e.define("select2/dropdown/search",["jquery","../utils"],function(o,e){function t(){}return t.prototype.render=function(e){var t=e.call(this),n=o('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></span>');return this.$searchContainer=n,this.$search=n.find("input"),t.prepend(n),t},t.prototype.bind=function(e,t,n){var i=this,r=t.id+"-results";e.call(this,t,n),this.$search.on("keydown",function(e){i.trigger("keypress",e),i._keyUpPrevented=e.isDefaultPrevented()}),this.$search.on("input",function(e){o(this).off("keyup")}),this.$search.on("keyup input",function(e){i.handleSearch(e)}),t.on("open",function(){i.$search.attr("tabindex",0),i.$search.attr("aria-controls",r),i.$search.trigger("focus"),window.setTimeout(function(){i.$search.trigger("focus")},0)}),t.on("close",function(){i.$search.attr("tabindex",-1),i.$search.removeAttr("aria-controls"),i.$search.removeAttr("aria-activedescendant"),i.$search.val(""),i.$search.trigger("blur")}),t.on("focus",function(){t.isOpen()||i.$search.trigger("focus")}),t.on("results:all",function(e){null!=e.query.term&&""!==e.query.term||(i.showSearch(e)?i.$searchContainer.removeClass("select2-search--hide"):i.$searchContainer.addClass("select2-search--hide"))}),t.on("results:focus",function(e){e.data._resultId?i.$search.attr("aria-activedescendant",e.data._resultId):i.$search.removeAttr("aria-activedescendant")})},t.prototype.handleSearch=function(e){if(!this._keyUpPrevented){var t=this.$search.val();this.trigger("query",{term:t})}this._keyUpPrevented=!1},t.prototype.showSearch=function(e,t){return!0},t}),e.define("select2/dropdown/hidePlaceholder",[],function(){function e(e,t,n,i){this.placeholder=this.normalizePlaceholder(n.get("placeholder")),e.call(this,t,n,i)}return e.prototype.append=function(e,t){t.results=this.removePlaceholder(t.results),e.call(this,t)},e.prototype.normalizePlaceholder=function(e,t){return"string"==typeof t&&(t={id:"",text:t}),t},e.prototype.removePlaceholder=function(e,t){for(var n=t.slice(0),i=t.length-1;0<=i;i--){var r=t[i];this.placeholder.id===r.id&&n.splice(i,1)}return n},e}),e.define("select2/dropdown/infiniteScroll",["jquery"],function(n){function e(e,t,n,i){this.lastParams={},e.call(this,t,n,i),this.$loadingMore=this.createLoadingMore(),this.loading=!1}return e.prototype.append=function(e,t){this.$loadingMore.remove(),this.loading=!1,e.call(this,t),this.showLoadingMore(t)&&(this.$results.append(this.$loadingMore),this.loadMoreIfNeeded())},e.prototype.bind=function(e,t,n){var i=this;e.call(this,t,n),t.on("query",function(e){i.lastParams=e,i.loading=!0}),t.on("query:append",function(e){i.lastParams=e,i.loading=!0}),this.$results.on("scroll",this.loadMoreIfNeeded.bind(this))},e.prototype.loadMoreIfNeeded=function(){var e=n.contains(document.documentElement,this.$loadingMore[0]);if(!this.loading&&e){var t=this.$results.offset().top+this.$results.outerHeight(!1);this.$loadingMore.offset().top+this.$loadingMore.outerHeight(!1)<=t+50&&this.loadMore()}},e.prototype.loadMore=function(){this.loading=!0;var e=n.extend({},{page:1},this.lastParams);e.page++,this.trigger("query:append",e)},e.prototype.showLoadingMore=function(e,t){return t.pagination&&t.pagination.more},e.prototype.createLoadingMore=function(){var e=n('<li class="select2-results__option select2-results__option--load-more"role="option" aria-disabled="true"></li>'),t=this.options.get("translations").get("loadingMore");return e.html(t(this.lastParams)),e},e}),e.define("select2/dropdown/attachBody",["jquery","../utils"],function(f,a){function e(e,t,n){this.$dropdownParent=f(n.get("dropdownParent")||document.body),e.call(this,t,n)}return e.prototype.bind=function(e,t,n){var i=this;e.call(this,t,n),t.on("open",function(){i._showDropdown(),i._attachPositioningHandler(t),i._bindContainerResultHandlers(t)}),t.on("close",function(){i._hideDropdown(),i._detachPositioningHandler(t)}),this.$dropdownContainer.on("mousedown",function(e){e.stopPropagation()})},e.prototype.destroy=function(e){e.call(this),this.$dropdownContainer.remove()},e.prototype.position=function(e,t,n){t.attr("class",n.attr("class")),t.removeClass("select2"),t.addClass("select2-container--open"),t.css({position:"absolute",top:-999999}),this.$container=n},e.prototype.render=function(e){var t=f("<span></span>"),n=e.call(this);return t.append(n),this.$dropdownContainer=t},e.prototype._hideDropdown=function(e){this.$dropdownContainer.detach()},e.prototype._bindContainerResultHandlers=function(e,t){if(!this._containerResultsHandlersBound){var n=this;t.on("results:all",function(){n._positionDropdown(),n._resizeDropdown()}),t.on("results:append",function(){n._positionDropdown(),n._resizeDropdown()}),t.on("results:message",function(){n._positionDropdown(),n._resizeDropdown()}),t.on("select",function(){n._positionDropdown(),n._resizeDropdown()}),t.on("unselect",function(){n._positionDropdown(),n._resizeDropdown()}),this._containerResultsHandlersBound=!0}},e.prototype._attachPositioningHandler=function(e,t){var n=this,i="scroll.select2."+t.id,r="resize.select2."+t.id,o="orientationchange.select2."+t.id,s=this.$container.parents().filter(a.hasScroll);s.each(function(){a.StoreData(this,"select2-scroll-position",{x:f(this).scrollLeft(),y:f(this).scrollTop()})}),s.on(i,function(e){var t=a.GetData(this,"select2-scroll-position");f(this).scrollTop(t.y)}),f(window).on(i+" "+r+" "+o,function(e){n._positionDropdown(),n._resizeDropdown()})},e.prototype._detachPositioningHandler=function(e,t){var n="scroll.select2."+t.id,i="resize.select2."+t.id,r="orientationchange.select2."+t.id;this.$container.parents().filter(a.hasScroll).off(n),f(window).off(n+" "+i+" "+r)},e.prototype._positionDropdown=function(){var e=f(window),t=this.$dropdown.hasClass("select2-dropdown--above"),n=this.$dropdown.hasClass("select2-dropdown--below"),i=null,r=this.$container.offset();r.bottom=r.top+this.$container.outerHeight(!1);var o={height:this.$container.outerHeight(!1)};o.top=r.top,o.bottom=r.top+o.height;var s=this.$dropdown.outerHeight(!1),a=e.scrollTop(),l=e.scrollTop()+e.height(),c=a<r.top-s,u=l>r.bottom+s,d={left:r.left,top:o.bottom},p=this.$dropdownParent;"static"===p.css("position")&&(p=p.offsetParent());var h=p.offset();d.top-=h.top,d.left-=h.left,t||n||(i="below"),u||!c||t?!c&&u&&t&&(i="below"):i="above",("above"==i||t&&"below"!==i)&&(d.top=o.top-h.top-s),null!=i&&(this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--"+i),this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--"+i)),this.$dropdownContainer.css(d)},e.prototype._resizeDropdown=function(){var e={width:this.$container.outerWidth(!1)+"px"};this.options.get("dropdownAutoWidth")&&(e.minWidth=e.width,e.position="relative",e.width="auto"),this.$dropdown.css(e)},e.prototype._showDropdown=function(e){this.$dropdownContainer.appendTo(this.$dropdownParent),this._positionDropdown(),this._resizeDropdown()},e}),e.define("select2/dropdown/minimumResultsForSearch",[],function(){function e(e,t,n,i){this.minimumResultsForSearch=n.get("minimumResultsForSearch"),this.minimumResultsForSearch<0&&(this.minimumResultsForSearch=1/0),e.call(this,t,n,i)}return e.prototype.showSearch=function(e,t){return!(function e(t){for(var n=0,i=0;i<t.length;i++){var r=t[i];r.children?n+=e(r.children):n++}return n}(t.data.results)<this.minimumResultsForSearch)&&e.call(this,t)},e}),e.define("select2/dropdown/selectOnClose",["../utils"],function(o){function e(){}return e.prototype.bind=function(e,t,n){var i=this;e.call(this,t,n),t.on("close",function(e){i._handleSelectOnClose(e)})},e.prototype._handleSelectOnClose=function(e,t){if(t&&null!=t.originalSelect2Event){var n=t.originalSelect2Event;if("select"===n._type||"unselect"===n._type)return}var i=this.getHighlightedResults();if(!(i.length<1)){var r=o.GetData(i[0],"data");null!=r.element&&r.element.selected||null==r.element&&r.selected||this.trigger("select",{data:r})}},e}),e.define("select2/dropdown/closeOnSelect",[],function(){function e(){}return e.prototype.bind=function(e,t,n){var i=this;e.call(this,t,n),t.on("select",function(e){i._selectTriggered(e)}),t.on("unselect",function(e){i._selectTriggered(e)})},e.prototype._selectTriggered=function(e,t){var n=t.originalEvent;n&&(n.ctrlKey||n.metaKey)||this.trigger("close",{originalEvent:n,originalSelect2Event:t})},e}),e.define("select2/i18n/en",[],function(){return{errorLoading:function(){return"The results could not be loaded."},inputTooLong:function(e){var t=e.input.length-e.maximum,n="Please delete "+t+" character";return 1!=t&&(n+="s"),n},inputTooShort:function(e){return"Please enter "+(e.minimum-e.input.length)+" or more characters"},loadingMore:function(){return"Loading more results…"},maximumSelected:function(e){var t="You can only select "+e.maximum+" item";return 1!=e.maximum&&(t+="s"),t},noResults:function(){return"No results found"},searching:function(){return"Searching…"},removeAllItems:function(){return"Remove all items"}}}),e.define("select2/defaults",["jquery","require","./results","./selection/single","./selection/multiple","./selection/placeholder","./selection/allowClear","./selection/search","./selection/eventRelay","./utils","./translation","./diacritics","./data/select","./data/array","./data/ajax","./data/tags","./data/tokenizer","./data/minimumInputLength","./data/maximumInputLength","./data/maximumSelectionLength","./dropdown","./dropdown/search","./dropdown/hidePlaceholder","./dropdown/infiniteScroll","./dropdown/attachBody","./dropdown/minimumResultsForSearch","./dropdown/selectOnClose","./dropdown/closeOnSelect","./i18n/en"],function(c,u,d,p,h,f,g,m,v,y,s,t,_,w,$,b,A,x,S,D,C,E,O,T,q,j,L,I,e){function n(){this.reset()}return n.prototype.apply=function(e){if(null==(e=c.extend(!0,{},this.defaults,e)).dataAdapter){if(null!=e.ajax?e.dataAdapter=$:null!=e.data?e.dataAdapter=w:e.dataAdapter=_,0<e.minimumInputLength&&(e.dataAdapter=y.Decorate(e.dataAdapter,x)),0<e.maximumInputLength&&(e.dataAdapter=y.Decorate(e.dataAdapter,S)),0<e.maximumSelectionLength&&(e.dataAdapter=y.Decorate(e.dataAdapter,D)),e.tags&&(e.dataAdapter=y.Decorate(e.dataAdapter,b)),null==e.tokenSeparators&&null==e.tokenizer||(e.dataAdapter=y.Decorate(e.dataAdapter,A)),null!=e.query){var t=u(e.amdBase+"compat/query");e.dataAdapter=y.Decorate(e.dataAdapter,t)}if(null!=e.initSelection){var n=u(e.amdBase+"compat/initSelection");e.dataAdapter=y.Decorate(e.dataAdapter,n)}}if(null==e.resultsAdapter&&(e.resultsAdapter=d,null!=e.ajax&&(e.resultsAdapter=y.Decorate(e.resultsAdapter,T)),null!=e.placeholder&&(e.resultsAdapter=y.Decorate(e.resultsAdapter,O)),e.selectOnClose&&(e.resultsAdapter=y.Decorate(e.resultsAdapter,L))),null==e.dropdownAdapter){if(e.multiple)e.dropdownAdapter=C;else{var i=y.Decorate(C,E);e.dropdownAdapter=i}if(0!==e.minimumResultsForSearch&&(e.dropdownAdapter=y.Decorate(e.dropdownAdapter,j)),e.closeOnSelect&&(e.dropdownAdapter=y.Decorate(e.dropdownAdapter,I)),null!=e.dropdownCssClass||null!=e.dropdownCss||null!=e.adaptDropdownCssClass){var r=u(e.amdBase+"compat/dropdownCss");e.dropdownAdapter=y.Decorate(e.dropdownAdapter,r)}e.dropdownAdapter=y.Decorate(e.dropdownAdapter,q)}if(null==e.selectionAdapter){if(e.multiple?e.selectionAdapter=h:e.selectionAdapter=p,null!=e.placeholder&&(e.selectionAdapter=y.Decorate(e.selectionAdapter,f)),e.allowClear&&(e.selectionAdapter=y.Decorate(e.selectionAdapter,g)),e.multiple&&(e.selectionAdapter=y.Decorate(e.selectionAdapter,m)),null!=e.containerCssClass||null!=e.containerCss||null!=e.adaptContainerCssClass){var o=u(e.amdBase+"compat/containerCss");e.selectionAdapter=y.Decorate(e.selectionAdapter,o)}e.selectionAdapter=y.Decorate(e.selectionAdapter,v)}e.language=this._resolveLanguage(e.language),e.language.push("en");for(var s=[],a=0;a<e.language.length;a++){var l=e.language[a];-1===s.indexOf(l)&&s.push(l)}return e.language=s,e.translations=this._processTranslations(e.language,e.debug),e},n.prototype.reset=function(){function a(e){return e.replace(/[^\u0000-\u007E]/g,function(e){return t[e]||e})}this.defaults={amdBase:"./",amdLanguageBase:"./i18n/",closeOnSelect:!0,debug:!1,dropdownAutoWidth:!1,escapeMarkup:y.escapeMarkup,language:{},matcher:function e(t,n){if(""===c.trim(t.term))return n;if(n.children&&0<n.children.length){for(var i=c.extend(!0,{},n),r=n.children.length-1;0<=r;r--)null==e(t,n.children[r])&&i.children.splice(r,1);return 0<i.children.length?i:e(t,i)}var o=a(n.text).toUpperCase(),s=a(t.term).toUpperCase();return-1<o.indexOf(s)?n:null},minimumInputLength:0,maximumInputLength:0,maximumSelectionLength:0,minimumResultsForSearch:0,selectOnClose:!1,scrollAfterSelect:!1,sorter:function(e){return e},templateResult:function(e){return e.text},templateSelection:function(e){return e.text},theme:"default",width:"resolve"}},n.prototype.applyFromElement=function(e,t){var n=e.language,i=this.defaults.language,r=t.prop("lang"),o=t.closest("[lang]").prop("lang"),s=Array.prototype.concat.call(this._resolveLanguage(r),this._resolveLanguage(n),this._resolveLanguage(i),this._resolveLanguage(o));return e.language=s,e},n.prototype._resolveLanguage=function(e){if(!e)return[];if(c.isEmptyObject(e))return[];if(c.isPlainObject(e))return[e];var t;t=c.isArray(e)?e:[e];for(var n=[],i=0;i<t.length;i++)if(n.push(t[i]),"string"==typeof t[i]&&0<t[i].indexOf("-")){var r=t[i].split("-")[0];n.push(r)}return n},n.prototype._processTranslations=function(e,t){for(var n=new s,i=0;i<e.length;i++){var r=new s,o=e[i];if("string"==typeof o)try{r=s.loadPath(o)}catch(e){try{o=this.defaults.amdLanguageBase+o,r=s.loadPath(o)}catch(e){t&&window.console&&console.warn&&console.warn('Select2: The language file for "'+o+'" could not be automatically loaded. A fallback will be used instead.')}}else r=c.isPlainObject(o)?new s(o):o;n.extend(r)}return n},n.prototype.set=function(e,t){var n={};n[c.camelCase(e)]=t;var i=y._convertData(n);c.extend(!0,this.defaults,i)},new n}),e.define("select2/options",["require","jquery","./defaults","./utils"],function(i,d,r,p){function e(e,t){if(this.options=e,null!=t&&this.fromElement(t),null!=t&&(this.options=r.applyFromElement(this.options,t)),this.options=r.apply(this.options),t&&t.is("input")){var n=i(this.get("amdBase")+"compat/inputData");this.options.dataAdapter=p.Decorate(this.options.dataAdapter,n)}}return e.prototype.fromElement=function(e){var t=["select2"];null==this.options.multiple&&(this.options.multiple=e.prop("multiple")),null==this.options.disabled&&(this.options.disabled=e.prop("disabled")),null==this.options.dir&&(e.prop("dir")?this.options.dir=e.prop("dir"):e.closest("[dir]").prop("dir")?this.options.dir=e.closest("[dir]").prop("dir"):this.options.dir="ltr"),e.prop("disabled",this.options.disabled),e.prop("multiple",this.options.multiple),p.GetData(e[0],"select2Tags")&&(this.options.debug&&window.console&&console.warn&&console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'),p.StoreData(e[0],"data",p.GetData(e[0],"select2Tags")),p.StoreData(e[0],"tags",!0)),p.GetData(e[0],"ajaxUrl")&&(this.options.debug&&window.console&&console.warn&&console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."),e.attr("ajax--url",p.GetData(e[0],"ajaxUrl")),p.StoreData(e[0],"ajax-Url",p.GetData(e[0],"ajaxUrl")));var n={};function i(e,t){return t.toUpperCase()}for(var r=0;r<e[0].attributes.length;r++){var o=e[0].attributes[r].name,s="data-";if(o.substr(0,s.length)==s){var a=o.substring(s.length),l=p.GetData(e[0],a);n[a.replace(/-([a-z])/g,i)]=l}}d.fn.jquery&&"1."==d.fn.jquery.substr(0,2)&&e[0].dataset&&(n=d.extend(!0,{},e[0].dataset,n));var c=d.extend(!0,{},p.GetData(e[0]),n);for(var u in c=p._convertData(c))-1<d.inArray(u,t)||(d.isPlainObject(this.options[u])?d.extend(this.options[u],c[u]):this.options[u]=c[u]);return this},e.prototype.get=function(e){return this.options[e]},e.prototype.set=function(e,t){this.options[e]=t},e}),e.define("select2/core",["jquery","./options","./utils","./keys"],function(r,c,u,i){var d=function(e,t){null!=u.GetData(e[0],"select2")&&u.GetData(e[0],"select2").destroy(),this.$element=e,this.id=this._generateId(e),t=t||{},this.options=new c(t,e),d.__super__.constructor.call(this);var n=e.attr("tabindex")||0;u.StoreData(e[0],"old-tabindex",n),e.attr("tabindex","-1");var i=this.options.get("dataAdapter");this.dataAdapter=new i(e,this.options);var r=this.render();this._placeContainer(r);var o=this.options.get("selectionAdapter");this.selection=new o(e,this.options),this.$selection=this.selection.render(),this.selection.position(this.$selection,r);var s=this.options.get("dropdownAdapter");this.dropdown=new s(e,this.options),this.$dropdown=this.dropdown.render(),this.dropdown.position(this.$dropdown,r);var a=this.options.get("resultsAdapter");this.results=new a(e,this.options,this.dataAdapter),this.$results=this.results.render(),this.results.position(this.$results,this.$dropdown);var l=this;this._bindAdapters(),this._registerDomEvents(),this._registerDataEvents(),this._registerSelectionEvents(),this._registerDropdownEvents(),this._registerResultsEvents(),this._registerEvents(),this.dataAdapter.current(function(e){l.trigger("selection:update",{data:e})}),e.addClass("select2-hidden-accessible"),e.attr("aria-hidden","true"),this._syncAttributes(),u.StoreData(e[0],"select2",this),e.data("select2",this)};return u.Extend(d,u.Observable),d.prototype._generateId=function(e){return"select2-"+(null!=e.attr("id")?e.attr("id"):null!=e.attr("name")?e.attr("name")+"-"+u.generateChars(2):u.generateChars(4)).replace(/(:|\.|\[|\]|,)/g,"")},d.prototype._placeContainer=function(e){e.insertAfter(this.$element);var t=this._resolveWidth(this.$element,this.options.get("width"));null!=t&&e.css("width",t)},d.prototype._resolveWidth=function(e,t){var n=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;if("resolve"==t){var i=this._resolveWidth(e,"style");return null!=i?i:this._resolveWidth(e,"element")}if("element"==t){var r=e.outerWidth(!1);return r<=0?"auto":r+"px"}if("style"!=t)return"computedstyle"!=t?t:window.getComputedStyle(e[0]).width;var o=e.attr("style");if("string"!=typeof o)return null;for(var s=o.split(";"),a=0,l=s.length;a<l;a+=1){var c=s[a].replace(/\s/g,"").match(n);if(null!==c&&1<=c.length)return c[1]}return null},d.prototype._bindAdapters=function(){this.dataAdapter.bind(this,this.$container),this.selection.bind(this,this.$container),this.dropdown.bind(this,this.$container),this.results.bind(this,this.$container)},d.prototype._registerDomEvents=function(){var t=this;this.$element.on("change.select2",function(){t.dataAdapter.current(function(e){t.trigger("selection:update",{data:e})})}),this.$element.on("focus.select2",function(e){t.trigger("focus",e)}),this._syncA=u.bind(this._syncAttributes,this),this._syncS=u.bind(this._syncSubtree,this),this.$element[0].attachEvent&&this.$element[0].attachEvent("onpropertychange",this._syncA);var e=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;null!=e?(this._observer=new e(function(e){r.each(e,t._syncA),r.each(e,t._syncS)}),this._observer.observe(this.$element[0],{attributes:!0,childList:!0,subtree:!1})):this.$element[0].addEventListener&&(this.$element[0].addEventListener("DOMAttrModified",t._syncA,!1),this.$element[0].addEventListener("DOMNodeInserted",t._syncS,!1),this.$element[0].addEventListener("DOMNodeRemoved",t._syncS,!1))},d.prototype._registerDataEvents=function(){var n=this;this.dataAdapter.on("*",function(e,t){n.trigger(e,t)})},d.prototype._registerSelectionEvents=function(){var n=this,i=["toggle","focus"];this.selection.on("toggle",function(){n.toggleDropdown()}),this.selection.on("focus",function(e){n.focus(e)}),this.selection.on("*",function(e,t){-1===r.inArray(e,i)&&n.trigger(e,t)})},d.prototype._registerDropdownEvents=function(){var n=this;this.dropdown.on("*",function(e,t){n.trigger(e,t)})},d.prototype._registerResultsEvents=function(){var n=this;this.results.on("*",function(e,t){n.trigger(e,t)})},d.prototype._registerEvents=function(){var n=this;this.on("open",function(){n.$container.addClass("select2-container--open")}),this.on("close",function(){n.$container.removeClass("select2-container--open")}),this.on("enable",function(){n.$container.removeClass("select2-container--disabled")}),this.on("disable",function(){n.$container.addClass("select2-container--disabled")}),this.on("blur",function(){n.$container.removeClass("select2-container--focus")}),this.on("query",function(t){n.isOpen()||n.trigger("open",{}),this.dataAdapter.query(t,function(e){n.trigger("results:all",{data:e,query:t})})}),this.on("query:append",function(t){this.dataAdapter.query(t,function(e){n.trigger("results:append",{data:e,query:t})})}),this.on("keypress",function(e){var t=e.which;n.isOpen()?t===i.ESC||t===i.TAB||t===i.UP&&e.altKey?(n.close(),e.preventDefault()):t===i.ENTER?(n.trigger("results:select",{}),e.preventDefault()):t===i.SPACE&&e.ctrlKey?(n.trigger("results:toggle",{}),e.preventDefault()):t===i.UP?(n.trigger("results:previous",{}),e.preventDefault()):t===i.DOWN&&(n.trigger("results:next",{}),e.preventDefault()):(t===i.ENTER||t===i.SPACE||t===i.DOWN&&e.altKey)&&(n.open(),e.preventDefault())})},d.prototype._syncAttributes=function(){this.options.set("disabled",this.$element.prop("disabled")),this.options.get("disabled")?(this.isOpen()&&this.close(),this.trigger("disable",{})):this.trigger("enable",{})},d.prototype._syncSubtree=function(e,t){var n=!1,i=this;if(!e||!e.target||"OPTION"===e.target.nodeName||"OPTGROUP"===e.target.nodeName){if(t)if(t.addedNodes&&0<t.addedNodes.length)for(var r=0;r<t.addedNodes.length;r++){t.addedNodes[r].selected&&(n=!0)}else t.removedNodes&&0<t.removedNodes.length&&(n=!0);else n=!0;n&&this.dataAdapter.current(function(e){i.trigger("selection:update",{data:e})})}},d.prototype.trigger=function(e,t){var n=d.__super__.trigger,i={open:"opening",close:"closing",select:"selecting",unselect:"unselecting",clear:"clearing"};if(void 0===t&&(t={}),e in i){var r=i[e],o={prevented:!1,name:e,args:t};if(n.call(this,r,o),o.prevented)return void(t.prevented=!0)}n.call(this,e,t)},d.prototype.toggleDropdown=function(){this.options.get("disabled")||(this.isOpen()?this.close():this.open())},d.prototype.open=function(){this.isOpen()||this.trigger("query",{})},d.prototype.close=function(){this.isOpen()&&this.trigger("close",{})},d.prototype.isOpen=function(){return this.$container.hasClass("select2-container--open")},d.prototype.hasFocus=function(){return this.$container.hasClass("select2-container--focus")},d.prototype.focus=function(e){this.hasFocus()||(this.$container.addClass("select2-container--focus"),this.trigger("focus",{}))},d.prototype.enable=function(e){this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'),null!=e&&0!==e.length||(e=[!0]);var t=!e[0];this.$element.prop("disabled",t)},d.prototype.data=function(){this.options.get("debug")&&0<arguments.length&&window.console&&console.warn&&console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');var t=[];return this.dataAdapter.current(function(e){t=e}),t},d.prototype.val=function(e){if(this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),null==e||0===e.length)return this.$element.val();var t=e[0];r.isArray(t)&&(t=r.map(t,function(e){return e.toString()})),this.$element.val(t).trigger("change")},d.prototype.destroy=function(){this.$container.remove(),this.$element[0].detachEvent&&this.$element[0].detachEvent("onpropertychange",this._syncA),null!=this._observer?(this._observer.disconnect(),this._observer=null):this.$element[0].removeEventListener&&(this.$element[0].removeEventListener("DOMAttrModified",this._syncA,!1),this.$element[0].removeEventListener("DOMNodeInserted",this._syncS,!1),this.$element[0].removeEventListener("DOMNodeRemoved",this._syncS,!1)),this._syncA=null,this._syncS=null,this.$element.off(".select2"),this.$element.attr("tabindex",u.GetData(this.$element[0],"old-tabindex")),this.$element.removeClass("select2-hidden-accessible"),this.$element.attr("aria-hidden","false"),u.RemoveData(this.$element[0]),this.$element.removeData("select2"),this.dataAdapter.destroy(),this.selection.destroy(),this.dropdown.destroy(),this.results.destroy(),this.dataAdapter=null,this.selection=null,this.dropdown=null,this.results=null},d.prototype.render=function(){var e=r('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');return e.attr("dir",this.options.get("dir")),this.$container=e,this.$container.addClass("select2-container--"+this.options.get("theme")),u.StoreData(e[0],"element",this.$element),e},d}),e.define("select2/compat/utils",["jquery"],function(s){return{syncCssClasses:function(e,t,n){var i,r,o=[];(i=s.trim(e.attr("class")))&&s((i=""+i).split(/\s+/)).each(function(){0===this.indexOf("select2-")&&o.push(this)}),(i=s.trim(t.attr("class")))&&s((i=""+i).split(/\s+/)).each(function(){0!==this.indexOf("select2-")&&null!=(r=n(this))&&o.push(r)}),e.attr("class",o.join(" "))}}}),e.define("select2/compat/containerCss",["jquery","./utils"],function(s,a){function l(e){return null}function e(){}return e.prototype.render=function(e){var t=e.call(this),n=this.options.get("containerCssClass")||"";s.isFunction(n)&&(n=n(this.$element));var i=this.options.get("adaptContainerCssClass");if(i=i||l,-1!==n.indexOf(":all:")){n=n.replace(":all:","");var r=i;i=function(e){var t=r(e);return null!=t?t+" "+e:e}}var o=this.options.get("containerCss")||{};return s.isFunction(o)&&(o=o(this.$element)),a.syncCssClasses(t,this.$element,i),t.css(o),t.addClass(n),t},e}),e.define("select2/compat/dropdownCss",["jquery","./utils"],function(s,a){function l(e){return null}function e(){}return e.prototype.render=function(e){var t=e.call(this),n=this.options.get("dropdownCssClass")||"";s.isFunction(n)&&(n=n(this.$element));var i=this.options.get("adaptDropdownCssClass");if(i=i||l,-1!==n.indexOf(":all:")){n=n.replace(":all:","");var r=i;i=function(e){var t=r(e);return null!=t?t+" "+e:e}}var o=this.options.get("dropdownCss")||{};return s.isFunction(o)&&(o=o(this.$element)),a.syncCssClasses(t,this.$element,i),t.css(o),t.addClass(n),t},e}),e.define("select2/compat/initSelection",["jquery"],function(i){function e(e,t,n){n.get("debug")&&window.console&&console.warn&&console.warn("Select2: The `initSelection` option has been deprecated in favor of a custom data adapter that overrides the `current` method. This method is now called multiple times instead of a single time when the instance is initialized. Support will be removed for the `initSelection` option in future versions of Select2"),this.initSelection=n.get("initSelection"),this._isInitialized=!1,e.call(this,t,n)}return e.prototype.current=function(e,t){var n=this;this._isInitialized?e.call(this,t):this.initSelection.call(null,this.$element,function(e){n._isInitialized=!0,i.isArray(e)||(e=[e]),t(e)})},e}),e.define("select2/compat/inputData",["jquery","../utils"],function(s,i){function e(e,t,n){this._currentData=[],this._valueSeparator=n.get("valueSeparator")||",","hidden"===t.prop("type")&&n.get("debug")&&console&&console.warn&&console.warn("Select2: Using a hidden input with Select2 is no longer supported and may stop working in the future. It is recommended to use a `<select>` element instead."),e.call(this,t,n)}return e.prototype.current=function(e,t){function i(e,t){var n=[];return e.selected||-1!==s.inArray(e.id,t)?(e.selected=!0,n.push(e)):e.selected=!1,e.children&&n.push.apply(n,i(e.children,t)),n}for(var n=[],r=0;r<this._currentData.length;r++){var o=this._currentData[r];n.push.apply(n,i(o,this.$element.val().split(this._valueSeparator)))}t(n)},e.prototype.select=function(e,t){if(this.options.get("multiple")){var n=this.$element.val();n+=this._valueSeparator+t.id,this.$element.val(n),this.$element.trigger("change")}else this.current(function(e){s.map(e,function(e){e.selected=!1})}),this.$element.val(t.id),this.$element.trigger("change")},e.prototype.unselect=function(e,r){var o=this;r.selected=!1,this.current(function(e){for(var t=[],n=0;n<e.length;n++){var i=e[n];r.id!=i.id&&t.push(i.id)}o.$element.val(t.join(o._valueSeparator)),o.$element.trigger("change")})},e.prototype.query=function(e,t,n){for(var i=[],r=0;r<this._currentData.length;r++){var o=this._currentData[r],s=this.matches(t,o);null!==s&&i.push(s)}n({results:i})},e.prototype.addOptions=function(e,t){var n=s.map(t,function(e){return i.GetData(e[0],"data")});this._currentData.push.apply(this._currentData,n)},e}),e.define("select2/compat/matcher",["jquery"],function(s){return function(o){return function(e,t){var n=s.extend(!0,{},t);if(null==e.term||""===s.trim(e.term))return n;if(t.children){for(var i=t.children.length-1;0<=i;i--){var r=t.children[i];o(e.term,r.text,r)||n.children.splice(i,1)}if(0<n.children.length)return n}return o(e.term,t.text,t)?n:null}}}),e.define("select2/compat/query",[],function(){function e(e,t,n){n.get("debug")&&window.console&&console.warn&&console.warn("Select2: The `query` option has been deprecated in favor of a custom data adapter that overrides the `query` method. Support will be removed for the `query` option in future versions of Select2."),e.call(this,t,n)}return e.prototype.query=function(e,t,n){t.callback=n,this.options.get("query").call(null,t)},e}),e.define("select2/dropdown/attachContainer",[],function(){function e(e,t,n){e.call(this,t,n)}return e.prototype.position=function(e,t,n){n.find(".dropdown-wrapper").append(t),t.addClass("select2-dropdown--below"),n.addClass("select2-container--below")},e}),e.define("select2/dropdown/stopPropagation",[],function(){function e(){}return e.prototype.bind=function(e,t,n){e.call(this,t,n);this.$dropdown.on(["blur","change","click","dblclick","focus","focusin","focusout","input","keydown","keyup","keypress","mousedown","mouseenter","mouseleave","mousemove","mouseover","mouseup","search","touchend","touchstart"].join(" "),function(e){e.stopPropagation()})},e}),e.define("select2/selection/stopPropagation",[],function(){function e(){}return e.prototype.bind=function(e,t,n){e.call(this,t,n);this.$selection.on(["blur","change","click","dblclick","focus","focusin","focusout","input","keydown","keyup","keypress","mousedown","mouseenter","mouseleave","mousemove","mouseover","mouseup","search","touchend","touchstart"].join(" "),function(e){e.stopPropagation()})},e}),l=function(p){var h,f,e=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],t="onwheel"in document||9<=document.documentMode?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],g=Array.prototype.slice;if(p.event.fixHooks)for(var n=e.length;n;)p.event.fixHooks[e[--n]]=p.event.mouseHooks;var m=p.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var e=t.length;e;)this.addEventListener(t[--e],i,!1);else this.onmousewheel=i;p.data(this,"mousewheel-line-height",m.getLineHeight(this)),p.data(this,"mousewheel-page-height",m.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var e=t.length;e;)this.removeEventListener(t[--e],i,!1);else this.onmousewheel=null;p.removeData(this,"mousewheel-line-height"),p.removeData(this,"mousewheel-page-height")},getLineHeight:function(e){var t=p(e),n=t["offsetParent"in p.fn?"offsetParent":"parent"]();return n.length||(n=p("body")),parseInt(n.css("fontSize"),10)||parseInt(t.css("fontSize"),10)||16},getPageHeight:function(e){return p(e).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};function i(e){var t,n=e||window.event,i=g.call(arguments,1),r=0,o=0,s=0,a=0,l=0;if((e=p.event.fix(n)).type="mousewheel","detail"in n&&(s=-1*n.detail),"wheelDelta"in n&&(s=n.wheelDelta),"wheelDeltaY"in n&&(s=n.wheelDeltaY),"wheelDeltaX"in n&&(o=-1*n.wheelDeltaX),"axis"in n&&n.axis===n.HORIZONTAL_AXIS&&(o=-1*s,s=0),r=0===s?o:s,"deltaY"in n&&(r=s=-1*n.deltaY),"deltaX"in n&&(o=n.deltaX,0===s&&(r=-1*o)),0!==s||0!==o){if(1===n.deltaMode){var c=p.data(this,"mousewheel-line-height");r*=c,s*=c,o*=c}else if(2===n.deltaMode){var u=p.data(this,"mousewheel-page-height");r*=u,s*=u,o*=u}if(t=Math.max(Math.abs(s),Math.abs(o)),(!f||t<f)&&y(n,f=t)&&(f/=40),y(n,t)&&(r/=40,o/=40,s/=40),r=Math[1<=r?"floor":"ceil"](r/f),o=Math[1<=o?"floor":"ceil"](o/f),s=Math[1<=s?"floor":"ceil"](s/f),m.settings.normalizeOffset&&this.getBoundingClientRect){var d=this.getBoundingClientRect();a=e.clientX-d.left,l=e.clientY-d.top}return e.deltaX=o,e.deltaY=s,e.deltaFactor=f,e.offsetX=a,e.offsetY=l,e.deltaMode=0,i.unshift(e,r,o,s),h&&clearTimeout(h),h=setTimeout(v,200),(p.event.dispatch||p.event.handle).apply(this,i)}}function v(){f=null}function y(e,t){return m.settings.adjustOldDeltas&&"mousewheel"===e.type&&t%120==0}p.fn.extend({mousewheel:function(e){return e?this.bind("mousewheel",e):this.trigger("mousewheel")},unmousewheel:function(e){return this.unbind("mousewheel",e)}})},"function"==typeof e.define&&e.define.amd?e.define("jquery-mousewheel",["jquery"],l):"object"==typeof exports?module.exports=l:l(d),e.define("jquery.select2",["jquery","jquery-mousewheel","./select2/core","./select2/defaults","./select2/utils"],function(r,e,o,t,s){if(null==r.fn.select2){var a=["open","close","destroy"];r.fn.select2=function(t){if("object"==typeof(t=t||{}))return this.each(function(){var e=r.extend(!0,{},t);new o(r(this),e)}),this;if("string"!=typeof t)throw new Error("Invalid arguments for Select2: "+t);var n,i=Array.prototype.slice.call(arguments,1);return this.each(function(){var e=s.GetData(this,"select2");null==e&&window.console&&console.error&&console.error("The select2('"+t+"') method was called on an element that is not using Select2."),n=e[t].apply(e,i)}),-1<r.inArray(t,a)?this:n}}return null==r.fn.select2.defaults&&(r.fn.select2.defaults=t),o}),{define:e.define,require:e.require}}(),t=e.require("jquery.select2");return d.fn.select2.amd=e,t});
var mecSingleEventDisplayer={getSinglePage:function(id,occurrence,ajaxurl,layout,image_popup){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-modal-preloader');jQuery.ajax({url:ajaxurl,data:"action=mec_load_single_page&id="+id+(occurrence!=null?"&occurrence="+occurrence:"")+"&layout="+layout,type:"get",success:function(response){jQuery('.mec-modal-result').removeClass("mec-modal-preloader");jQuery.featherlight(response);setTimeout(function(){grecaptcha.render("g-recaptcha",{sitekey:mecdata.recapcha_key});},1000);if(image_popup!=0){if(jQuery('.featherlight-content .mec-events-content a img').length>0){jQuery('.featherlight-content .mec-events-content a img').each(function(){jQuery(this).closest('a').attr('data-featherlight','image');});}}else{jQuery('.featherlight-content .mec-events-content a img').remove();}
if(typeof mecdata.enableSingleFluent!='undefined'&&mecdata.enableSingleFluent){mecFluentSinglePage();}},error:function(){}});}};(function($){$.fn.mecSearchForm=function(options){var settings=$.extend({id:0,search_form_element:'',atts:'',callback:function(){}},options);$("#mec_sf_category_"+settings.id).on('change',function(e){search();});$("#mec_sf_location_"+settings.id).on('change',function(e){search();});$("#mec_sf_organizer_"+settings.id).on('change',function(e){search();});$("#mec_sf_speaker_"+settings.id).on('change',function(e){search();});$("#mec_sf_tag_"+settings.id).on('change',function(e){search();});$("#mec_sf_label_"+settings.id).on('change',function(e){search();});$("#mec_sf_s_"+settings.id).on('change',function(e){search();});$("#mec_sf_address_s_"+settings.id).on('change',function(e){search();});var mec_sf_month_selector="#mec_sf_month_"+settings.id;var mec_sf_year_selector="#mec_sf_year_"+settings.id;mec_sf_month_selector+=(', '+mec_sf_year_selector);$(mec_sf_month_selector).on('change',function(e){if($(mec_sf_year_selector).find('option:eq(0)').val()=='none')
{var mec_month_val=$(mec_sf_month_selector).val();var mec_year_val=$(mec_sf_year_selector).val();if((mec_month_val!='none'&&mec_year_val!='none')||((mec_month_val=='none'&&mec_year_val=='none')))search();}else search();});$("#mec_sf_event_type_"+settings.id).on('change',function(e){search();});$("#mec_sf_event_type_2_"+settings.id).on('change',function(e){search();});$("#mec_sf_attribute_"+settings.id).on('change',function(e){search();});if(settings.fields&&settings.fields!=null&&settings.fields.length>0){for(var k in settings.fields){$("#mec_sf_"+settings.fields[k]+'_'+settings.id).on('change',function(e){search();});}}
function search(){var s=$("#mec_sf_s_"+settings.id).length?$("#mec_sf_s_"+settings.id).val():'';var address=$("#mec_sf_address_s_"+settings.id).length?$("#mec_sf_address_s_"+settings.id).val():'';var category=$("#mec_sf_category_"+settings.id).length?$("#mec_sf_category_"+settings.id).val():'';var location=$("#mec_sf_location_"+settings.id).length?$("#mec_sf_location_"+settings.id).val():'';var organizer=$("#mec_sf_organizer_"+settings.id).length?$("#mec_sf_organizer_"+settings.id).val():'';var speaker=$("#mec_sf_speaker_"+settings.id).length?$("#mec_sf_speaker_"+settings.id).val():'';var tag=$("#mec_sf_tag_"+settings.id).length?$("#mec_sf_tag_"+settings.id).val():'';var label=$("#mec_sf_label_"+settings.id).length?$("#mec_sf_label_"+settings.id).val():'';var month=$("#mec_sf_month_"+settings.id).length?$("#mec_sf_month_"+settings.id).val():'';var year=$("#mec_sf_year_"+settings.id).length?$("#mec_sf_year_"+settings.id).val():'';var event_type=$("#mec_sf_event_type_"+settings.id).length?$("#mec_sf_event_type_"+settings.id).val():'';var event_type_2=$("#mec_sf_event_type_2_"+settings.id).length?$("#mec_sf_event_type_2_"+settings.id).val():'';var attribute=$("#mec_sf_attribute_"+settings.id).length?$("#mec_sf_attribute_"+settings.id).val():'';if(year==='none'&&month==='none'){year='';month='';}
var addation_attr='';if(settings.fields&&settings.fields!=null&&settings.fields.length>0){for(var k in settings.fields){var field='#mec_sf_'+settings.fields[k]+'_'+settings.id;var val=$(field).length?$(field).val():'';addation_attr+='&sf['+settings.fields[k]+']='+val;}}
var atts=settings.atts+'&sf[s]='+s+'&sf[address]='+address+'&sf[month]='+month+'&sf[year]='+year+'&sf[category]='+category+'&sf[location]='+location+'&sf[organizer]='+organizer+'&sf[speaker]='+speaker+'&sf[tag]='+tag+'&sf[label]='+label+'&sf[event_type]='+event_type+'&sf[event_type_2]='+event_type_2+'&sf[attribute]='+attribute+addation_attr;settings.callback(atts);}};}(jQuery));(function($){$.fn.mecFullCalendar=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},skin:'',},options);setListeners();mecFluentCurrentTimePosition();mecFluentCustomScrollbar();var sf;function setListeners(){if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search();}});}
$("#mec_skin_"+settings.id+" .mec-totalcal-box .mec-totalcal-view span:not(.mec-fluent-more-views-icon)").on('click',function(e){e.preventDefault();var skin=$(this).data('skin');var mec_month_select=$('#mec_sf_month_'+settings.id);var mec_year_select=$('#mec_sf_year_'+settings.id);if(mec_year_select.val()=='none')
{mec_year_select.find('option').each(function()
{var option_val=$(this).val();if(option_val==mecdata.current_year)mec_year_select.val(option_val);});}
if(skin=='list')
{var mec_filter_none='<option class="mec-none-item" value="none">'+$('#mec-filter-none').val()+'</option>';if(mec_month_select.find('.mec-none-item').length==0)mec_month_select.prepend(mec_filter_none);if(mec_year_select.find('.mec-none-item').length==0)mec_year_select.prepend(mec_filter_none);}
else
{if(mec_month_select.find('.mec-none-item').length!=0)mec_month_select.find('.mec-none-item').remove();if(mec_year_select.find('.mec-none-item').length!=0)mec_year_select.find('.mec-none-item').remove();}
$("#mec_skin_"+settings.id+" .mec-totalcal-box .mec-totalcal-view span").removeClass('mec-totalcalview-selected')
$(this).addClass('mec-totalcalview-selected');if($(this).closest('.mec-fluent-more-views-content').length>0){$('.mec-fluent-more-views-icon').addClass('active');$('.mec-fluent-more-views-content').removeClass('active');}else{$('.mec-fluent-more-views-icon').removeClass('active');}
loadSkin(skin);});}
function loadSkin(skin){settings.skin=skin;if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_full_calendar_switch_skin&skin="+skin+"&"+settings.atts+"&apply_sf_date=1&sed="+settings.sed_method,dataType:"json",type:"post",success:function(response){$("#mec_full_calendar_container_"+settings.id).html(response);$('.mec-modal-result').removeClass("mec-month-navigator-loading");mecFocusDay(settings);mecFluentCurrentTimePosition();mecFluentCustomScrollbar();},error:function(){}});}
function search(){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_full_calendar_switch_skin&skin="+settings.skin+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){$("#mec_full_calendar_container_"+settings.id).html(response);$('.mec-modal-result').removeClass("mec-month-navigator-loading");mecFocusDay(settings);mec_focus_week(settings.id);mecFluentCurrentTimePosition();mecFluentCustomScrollbar();},error:function(){}});}};}(jQuery));(function($){$.fn.mecYearlyView=function(options){var active_year;var settings=$.extend({today:null,id:0,events_label:'Events',event_label:'Event',year_navigator:0,atts:'',next_year:{},sf:{},ajax_url:'',},options);mecFluentYearlyUI(settings.id,settings.year_id);if(settings.year_navigator)initYearNavigator();if(settings.year_navigator)setYear(settings.next_year.year,true);setListeners();$(document).on("click","#mec_skin_events_"+settings.id+" .mec-load-more-button",function(){var year=$(this).parent().parent().parent().data('year-id');loadMoreButton(year);});if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;active_year=$('.mec-yearly-view-wrap .mec-year-navigator').filter(function(){return $(this).css('display')=="block";});active_year=parseInt(active_year.find('h2').text());search(active_year);}});}
function initYearNavigator(){$("#mec_skin_"+settings.id+" .mec-load-year").off("click");$("#mec_skin_"+settings.id+" .mec-load-year").on("click",function(){var year=$(this).data("mec-year");setYear(year);});}
function search(year){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_yearly_view_load_year&mec_year="+year+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){active_year=response.current_year.year;$("#mec_skin_events_"+settings.id).html('<div class="mec-year-container" id="mec_yearly_view_year_'+settings.id+'_'+response.current_year.id+'" data-year-id="'+response.current_year.id+'">'+response.year+'</div>');$("#mec_skin_"+settings.id+" .mec-yearly-title-sec").append('<div class="mec-year-navigator" id="mec_year_navigator_'+settings.id+'_'+response.current_year.id+'">'+response.navigator+'</div>');initYearNavigator();setListeners();toggleYear(response.current_year.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");mecFluentYearlyUI(settings.id,active_year);mecFluentCustomScrollbar();},error:function(){}});}
function setYear(year,do_in_background){if(typeof do_in_background==="undefined")do_in_background=false;var year_id=year;active_year=year;if($("#mec_yearly_view_year_"+settings.id+"_"+year_id).length){toggleYear(year_id);mecFluentCustomScrollbar();}else{if(!do_in_background){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');}
$.ajax({url:settings.ajax_url,data:"action=mec_yearly_view_load_year&mec_year="+year+"&"+settings.atts+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){$("#mec_skin_events_"+settings.id).append('<div class="mec-year-container" id="mec_yearly_view_year_'+settings.id+'_'+response.current_year.id+'" data-year-id="'+response.current_year.id+'">'+response.year+'</div>');$("#mec_skin_"+settings.id+" .mec-yearly-title-sec").append('<div class="mec-year-navigator" id="mec_year_navigator_'+settings.id+'_'+response.current_year.id+'">'+response.navigator+'</div>');initYearNavigator();setListeners();if(!do_in_background){toggleYear(response.current_year.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_sf_year_"+settings.id).val(year);}else{$("#mec_yearly_view_year_"+settings.id+"_"+response.current_year.id).hide();$("#mec_year_navigator_"+settings.id+"_"+response.current_year.id).hide();}
mecFluentYearlyUI(settings.id,year);if(!do_in_background){mecFluentCustomScrollbar();}},error:function(){}});}}
function toggleYear(year_id){$("#mec_skin_"+settings.id+" .mec-year-navigator").hide();$("#mec_year_navigator_"+settings.id+"_"+year_id).show();$("#mec_skin_"+settings.id+" .mec-year-container").hide();$("#mec_yearly_view_year_"+settings.id+"_"+year_id).show();}
var sf;function setListeners(){if(settings.sed_method!='0'){sed();}}
function sed(){$("#mec_skin_"+settings.id+" .mec-agenda-event-title a").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMoreButton(year){var $max_count,$current_count=0;$max_count=$("#mec_yearly_view_year_"+settings.id+"_"+year+" .mec-yearly-max").data('count');$current_count=$("#mec_yearly_view_year_"+settings.id+"_"+year+" .mec-util-hidden").length;if($current_count>10){for(var i=0;i<10;i++){$("#mec_yearly_view_year_"+settings.id+"_"+year+" .mec-util-hidden").slice(0,2).each(function(){$(this).removeClass('mec-util-hidden');});}}
if($current_count<10&&$current_count!=0){for(var j=0;j<$current_count;j++){$("#mec_yearly_view_year_"+settings.id+"_"+year+" .mec-util-hidden").slice(0,2).each(function(){$(this).removeClass('mec-util-hidden');$("#mec_yearly_view_year_"+settings.id+"_"+year+" .mec-load-more-wrap").css('display','none');});}}}};}(jQuery));(function($){$.fn.mecMonthlyView=function(options){var active_month;var active_year;var settings=$.extend({today:null,id:0,events_label:'Events',event_label:'Event',month_navigator:0,atts:'',active_month:{},next_month:{},sf:{},ajax_url:'',},options);if(settings.month_navigator)initMonthNavigator();setMonth(settings.next_month.year,settings.next_month.month,true);active_month=settings.active_month.month;active_year=settings.active_month.year;setListeners();if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search(active_year,active_month);}});}
function initMonthNavigator(){$("#mec_skin_"+settings.id+" .mec-load-month").off("click");$("#mec_skin_"+settings.id+" .mec-load-month").on("click",function(){var year=$(this).data("mec-year");var month=$(this).data("mec-month");setMonth(year,month,false,true);});}
function search(year,month){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_monthly_view_load_month&mec_year="+year+"&mec_month="+month+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){active_month=response.current_month.month;active_year=response.current_month.year;$("#mec_skin_events_"+settings.id).html('<div class="mec-month-container" id="mec_monthly_view_month_'+settings.id+'_'+response.current_month.id+'" data-month-id="'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-monthly-view-month-navigator-container").html('<div class="mec-month-navigator" id="mec_month_navigator_'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');$("#mec_skin_"+settings.id+" .mec-calendar-events-side").html('<div class="mec-month-side" id="mec_month_side_'+settings.id+'_'+response.current_month.id+'">'+response.events_side+'</div>');initMonthNavigator();setListeners();toggleMonth(response.current_month.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");},error:function(){}});}
function setMonth(year,month,do_in_background,navigator_click){if(typeof do_in_background==="undefined")do_in_background=false;navigator_click=navigator_click||false;var month_id=year+""+month;if(!do_in_background){active_month=month;active_year=year;}
if($("#mec_monthly_view_month_"+settings.id+"_"+month_id).length){toggleMonth(month_id);}else{if(!do_in_background){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');}
$.ajax({url:settings.ajax_url,data:"action=mec_monthly_view_load_month&mec_year="+year+"&mec_month="+month+"&"+settings.atts+"&apply_sf_date=0"+"&navigator_click="+navigator_click,dataType:"json",type:"post",success:function(response){$("#mec_skin_events_"+settings.id).append('<div class="mec-month-container" id="mec_monthly_view_month_'+settings.id+'_'+response.current_month.id+'" data-month-id="'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-monthly-view-month-navigator-container").append('<div class="mec-month-navigator" id="mec_month_navigator_'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');$("#mec_skin_"+settings.id+" .mec-calendar-events-side").append('<div class="mec-month-side" id="mec_month_side_'+settings.id+'_'+response.current_month.id+'">'+response.events_side+'</div>');initMonthNavigator();setListeners();if(!do_in_background){toggleMonth(response.current_month.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_sf_month_"+settings.id).val(month);$("#mec_sf_year_"+settings.id).val(year);}else{$("#mec_monthly_view_month_"+settings.id+"_"+response.current_month.id).hide();$("#mec_month_navigator_"+settings.id+"_"+response.current_month.id).hide();$("#mec_month_side_"+settings.id+"_"+response.current_month.id).hide();}
if(typeof custom_month!==undefined)var custom_month;if(typeof custom_month!=undefined){if(custom_month=='true'){$(".mec-month-container .mec-calendar-day").removeClass('mec-has-event');$(".mec-month-container .mec-calendar-day").removeClass('mec-selected-day');$('.mec-calendar-day').unbind('click');}}},error:function(){}});}}
function toggleMonth(month_id){var active_month=$("#mec_skin_"+settings.id+" .mec-month-container-selected").data("month-id");var active_day=$("#mec_monthly_view_month_"+settings.id+"_"+active_month+" .mec-selected-day").data("day");if(active_day<=9)active_day="0"+active_day;$("#mec_skin_"+settings.id+" .mec-month-navigator").hide();$("#mec_month_navigator_"+settings.id+"_"+month_id).show();$("#mec_skin_"+settings.id+" .mec-month-container").hide();$("#mec_monthly_view_month_"+settings.id+"_"+month_id).show();$("#mec_skin_"+settings.id+" .mec-month-container").removeClass("mec-month-container-selected");$("#mec_monthly_view_month_"+settings.id+"_"+month_id).addClass("mec-month-container-selected");$("#mec_skin_"+settings.id+" .mec-month-side").hide();$("#mec_month_side_"+settings.id+"_"+month_id).show();}
var sf;function setListeners(){$("#mec_skin_"+settings.id+" .mec-has-event").off("click");$("#mec_skin_"+settings.id+" .mec-has-event").on('click',function(e){e.preventDefault();var $this=$(this),data_mec_cell=$this.data('mec-cell'),month_id=$this.data('month');$("#mec_monthly_view_month_"+settings.id+"_"+month_id+" .mec-calendar-day").removeClass('mec-selected-day');$this.addClass('mec-selected-day');$('#mec_month_side_'+settings.id+'_'+month_id+' .mec-calendar-events-sec:not([data-mec-cell='+data_mec_cell+'])').slideUp();$('#mec_month_side_'+settings.id+'_'+month_id+' .mec-calendar-events-sec[data-mec-cell='+data_mec_cell+']').slideDown();$('#mec_monthly_view_month_'+settings.id+'_'+month_id+' .mec-calendar-events-sec:not([data-mec-cell='+data_mec_cell+'])').slideUp();$('#mec_monthly_view_month_'+settings.id+'_'+month_id+' .mec-calendar-events-sec[data-mec-cell='+data_mec_cell+']').slideDown();});mec_tooltip();if(settings.sed_method!='0'){sed();}
if(settings.style=='novel'){if($('.mec-single-event-novel').length>0){$('.mec-single-event-novel').colourBrightness();$('.mec-single-event-novel').each(function(){$(this).colourBrightness()});}}}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a,#mec_skin_"+settings.id+" .event-single-link-novel,#mec_skin_"+settings.id+" .mec-monthly-tooltip").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function mec_tooltip(){if($('.mec-monthly-tooltip').length>1){if(Math.max(document.documentElement.clientWidth,window.innerWidth||0)>768){$('.mec-monthly-tooltip').tooltipster({theme:'tooltipster-shadow',interactive:true,delay:100,minWidth:350,maxWidth:350});if(settings.sed_method!='0'){sed();}}else{var touchtime=0;$(".mec-monthly-tooltip").on("click",function(event){event.preventDefault();if(touchtime==0){$('.mec-monthly-tooltip').tooltipster({theme:'tooltipster-shadow',interactive:true,delay:100,minWidth:350,maxWidth:350,trigger:"custom",triggerOpen:{click:true,tap:true},triggerClose:{click:true,tap:true}});touchtime=new Date().getTime();}else{if(((new Date().getTime())-touchtime)<200){var el=$(this);var link=el.attr("href");window.location=link;touchtime=0;}else{touchtime=new Date().getTime();}}});}}}};}(jQuery));(function($){$.fn.mecWeeklyView=function(options){var active_year;var active_month;var active_week;var active_week_number;var settings=$.extend({today:null,week:1,id:0,current_year:null,current_month:null,changeWeekElement:'.mec-load-week',month_navigator:0,atts:'',ajax_url:'',sf:{}},options);active_year=settings.current_year;active_month=settings.current_month;if(settings.sf.container!==''){$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search(active_year,active_month,active_week);}});}
setThisWeek(settings.month_id+settings.week);setListeners();if(settings.month_navigator)initMonthNavigator(settings.month_id);function setListeners(){$(settings.changeWeekElement).off('click').on('click',function(e){var week=$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active').data('week-id');var max_weeks=$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active').data('max-weeks');var new_week_number=active_week_number;if($(this).hasClass('mec-previous-month')){week=parseInt(week)-1;new_week_number--;}else{week=parseInt(week)+1;new_week_number++;}
if(new_week_number<=1||new_week_number>=max_weeks){$(this).css({'opacity':.6,'cursor':'default'});$(this).find('i').css({'opacity':.6,'cursor':'default'});}else{$('#mec_skin_'+settings.id+' .mec-load-week, #mec_skin_'+settings.id+' .mec-load-week i').css({'opacity':1,'cursor':'pointer'});}
if(new_week_number===0||new_week_number>max_weeks){}else{setThisWeek(week);}});if(settings.sed_method!='0'){sed();}}
function setThisWeek(week,auto_focus){if(typeof auto_focus==='undefined')auto_focus=false;if(!$('#mec_weekly_view_week_'+settings.id+'_'+week).length){return setThisWeek((parseInt(week)-1));}
$('#mec_skin_'+settings.id+' .mec-weekly-view-week').removeClass('mec-weekly-view-week-active');$('#mec_weekly_view_week_'+settings.id+'_'+week).addClass('mec-weekly-view-week-active');$('#mec_weekly_view_top_week_'+settings.id+'_'+week).addClass('mec-weekly-view-week-active');$('#mec_skin_'+settings.id+' .mec-weekly-view-date-events').addClass('mec-util-hidden');$('.mec-weekly-view-week-'+settings.id+'-'+week).removeClass('mec-util-hidden');$('#mec_skin_'+settings.id+' .mec-calendar-row').addClass('mec-util-hidden');$('#mec_skin_'+settings.id+' .mec-calendar-row[data-week='+week%10+']').removeClass('mec-util-hidden');active_week=week;active_week_number=$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active').data('week-number');$('#mec_skin_'+settings.id+' .mec-calendar-d-top').find('.mec-current-week').find('span').remove();$('#mec_skin_'+settings.id+' .mec-calendar-d-top').find('.mec-current-week').append('<span>'+active_week_number+'</span>');if(active_week_number===1){$('#mec_skin_'+settings.id+' .mec-previous-month.mec-load-week').css({'opacity':.6,'cursor':'default'});$('#mec_skin_'+settings.id+' .mec-previous-month.mec-load-week').find('i').css({'opacity':.6,'cursor':'default'});}
if(auto_focus)mec_focus_week(settings.id);mecFluentCustomScrollbar();}
function initMonthNavigator(month_id){$('#mec_month_navigator'+settings.id+'_'+month_id+' .mec-load-month').off('click');$('#mec_month_navigator'+settings.id+'_'+month_id+' .mec-load-month').on('click',function(){var year=$(this).data('mec-year');var month=$(this).data('mec-month');setMonth(year,month,active_week,true);});}
function search(year,month,week,navigation_click){var week_number=(String(week).slice(-1));if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_weekly_view_load_month&mec_year="+year+"&mec_month="+month+"&mec_week="+week_number+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_skin_events_"+settings.id).html('<div class="mec-month-container" id="mec_weekly_view_month_'+settings.id+'_'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-weekly-view-month-navigator-container").html('<div class="mec-month-navigator" id="mec_month_navigator'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');setListeners();toggleMonth(response.current_month.id);setThisWeek(response.week_id,true);mecFluentCustomScrollbar();},error:function(){}});}
function setMonth(year,month,week,navigation_click){var month_id=''+year+month;var week_number=(String(week).slice(-1));active_month=month;active_year=year;navigation_click=navigation_click||false;if($("#mec_weekly_view_month_"+settings.id+"_"+month_id).length){toggleMonth(month_id);setThisWeek(''+month_id+week_number);mecFluentCustomScrollbar();}else{if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_weekly_view_load_month&mec_year="+year+"&mec_month="+month+"&mec_week="+week_number+"&"+settings.atts+"&apply_sf_date=0"+"&navigator_click="+navigation_click,dataType:"json",type:"post",success:function(response){$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('#mec_skin_'+settings.id+' .mec-calendar-d-top h3').after(response.topWeeks);$("#mec_skin_events_"+settings.id).append('<div class="mec-month-container" id="mec_weekly_view_month_'+settings.id+'_'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-weekly-view-month-navigator-container").append('<div class="mec-month-navigator" id="mec_month_navigator'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');setListeners();toggleMonth(response.current_month.id);setThisWeek(response.week_id,true);$("#mec_sf_month_"+settings.id).val(month);$("#mec_sf_year_"+settings.id).val(year);mecFluentCustomScrollbar();},error:function(){}});}}
function toggleMonth(month_id){$('#mec_skin_'+settings.id+' .mec-month-container').addClass('mec-util-hidden');$('#mec_weekly_view_month_'+settings.id+'_'+month_id).removeClass('mec-util-hidden');$('#mec_skin_'+settings.id+' .mec-month-navigator').addClass('mec-util-hidden');$('#mec_month_navigator'+settings.id+'_'+month_id).removeClass('mec-util-hidden');if(settings.month_navigator)initMonthNavigator(month_id);}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}};}(jQuery));(function($){$.fn.mecDailyView=function(options){var active_month;var active_year;var active_day;var settings=$.extend({today:null,id:0,changeDayElement:'.mec-daily-view-day',events_label:'Events',event_label:'Event',month_navigator:0,atts:'',ajax_url:'',sf:{},},options);active_month=settings.month;active_year=settings.year;active_day=settings.day;mecFluentCustomScrollbar();setToday(settings.today);setListeners();if(settings.month_navigator)initMonthNavigator(settings.month_id);initDaysSlider(settings.month_id);mecFocusDay(settings);if(settings.sf.container!==''){$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search(active_year,active_month,active_day);}});}
function setListeners(){$(settings.changeDayElement).on('click',function(){var today=$(this).data('day-id');setToday(today);mecFluentCustomScrollbar();});if(settings.sed_method!='0'){sed();}}
var current_monthday;function setToday(today){if(!$('#mec_daily_view_day'+settings.id+'_'+today).length){setToday(parseInt(today)-1);return false;}
$('.mec-daily-view-day').removeClass('mec-daily-view-day-active mec-color');$('#mec_daily_view_day'+settings.id+'_'+today).addClass('mec-daily-view-day-active mec-color');$('.mec-daily-view-date-events').addClass('mec-util-hidden');$('#mec_daily_view_date_events'+settings.id+'_'+today).removeClass('mec-util-hidden');$('.mec-daily-view-events').addClass('mec-util-hidden');$('#mec-daily-view-events'+settings.id+'_'+today).removeClass('mec-util-hidden');var weekday=$('#mec_daily_view_day'+settings.id+'_'+today).data('day-weekday');var monthday=$('#mec_daily_view_day'+settings.id+'_'+today).data('day-monthday');var count=$('#mec_daily_view_day'+settings.id+'_'+today).data('events-count');var month_id=$('#mec_daily_view_day'+settings.id+'_'+today).data('month-id');$('#mec_today_container'+settings.id+'_'+month_id).html('<h2>'+monthday+'</h2><h3>'+weekday+'</h3><div class="mec-today-count">'+count+' '+(count>1?settings.events_label:settings.event_label)+'</div>');if(monthday<=9)current_monthday='0'+monthday;else current_monthday=monthday;}
function initMonthNavigator(month_id){$('#mec_month_navigator'+settings.id+'_'+month_id+' .mec-load-month').off('click');$('#mec_month_navigator'+settings.id+'_'+month_id+' .mec-load-month').on('click',function(){var year=$(this).data('mec-year');var month=$(this).data('mec-month');setMonth(year,month,current_monthday,true);});}
function initDaysSlider(month_id,day_id){mec_g_month_id=month_id;var owl_rtl=$('body').hasClass('rtl')?true:false;var owl=$("#mec-owl-calendar-d-table-"+settings.id+"-"+month_id);owl.owlCarousel({responsiveClass:true,responsive:{0:{items:owl.closest('.mec-fluent-wrap').length>0?3:2,},479:{items:4,},767:{items:7,},960:{items:14,},1000:{items:19,},1200:{items:22,}},dots:false,loop:false,rtl:owl_rtl,});$("#mec_daily_view_month_"+settings.id+"_"+month_id+" .mec-table-d-next").click(function(e){e.preventDefault();owl.trigger('next.owl.carousel');});$("#mec_daily_view_month_"+settings.id+"_"+month_id+" .mec-table-d-prev").click(function(e){e.preventDefault();owl.trigger('prev.owl.carousel');});if(typeof day_id==='undefined')day_id=$('.mec-daily-view-day-active').data('day-id');var today_str=day_id.toString().substring(6,8);var today_int=parseInt(today_str);owl.trigger('owl.goTo',[today_int]);}
function search(year,month,day){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_daily_view_load_month&mec_year="+year+"&mec_month="+month+"&mec_day="+day+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_skin_events_"+settings.id).html('<div class="mec-month-container" id="mec_daily_view_month_'+settings.id+'_'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-calendar-a-month.mec-clear").html('<div class="mec-month-navigator" id="mec_month_navigator'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');setListeners();active_year=response.current_month.year;active_month=response.current_month.month;toggleMonth(response.current_month.id,''+active_year+active_month+active_day);setToday(''+active_year+active_month+active_day);mecFocusDay(settings);mecFluentCustomScrollbar();},error:function(){}});}
function setMonth(year,month,day,navigation_click){var month_id=''+year+month;active_month=month;active_year=year;active_day=day;navigation_click=navigation_click||false;if($("#mec_daily_view_month_"+settings.id+"_"+month_id).length){toggleMonth(month_id);setToday(''+month_id+day);}else{if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_daily_view_load_month&mec_year="+year+"&mec_month="+month+"&mec_day="+day+"&"+settings.atts+"&apply_sf_date=0"+"&navigator_click="+navigation_click,dataType:"json",type:"post",success:function(response){$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_skin_events_"+settings.id).append('<div class="mec-month-container" id="mec_daily_view_month_'+settings.id+'_'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-calendar-a-month.mec-clear").append('<div class="mec-month-navigator" id="mec_month_navigator'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');setListeners();toggleMonth(response.current_month.id,''+year+month+'01');setToday(''+year+month+'01');$("#mec_sf_month_"+settings.id).val(month);$("#mec_sf_year_"+settings.id).val(year);mecFluentCustomScrollbar();},error:function(){}});}}
function toggleMonth(month_id,day_id){$('#mec_skin_'+settings.id+' .mec-month-container').addClass('mec-util-hidden');$('#mec_daily_view_month_'+settings.id+'_'+month_id).removeClass('mec-util-hidden');$('#mec_skin_'+settings.id+' .mec-month-navigator').addClass('mec-util-hidden');$('#mec_month_navigator'+settings.id+'_'+month_id).removeClass('mec-util-hidden');if(settings.month_navigator)initMonthNavigator(month_id);initDaysSlider(month_id,day_id);mecFocusDay(settings);}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}};}(jQuery));(function($){$.fn.mecTimeTable=function(options){var active_year;var active_month;var active_week;var active_week_number;var active_day;var settings=$.extend({today:null,week:1,active_day:1,id:0,changeWeekElement:'.mec-load-week',month_navigator:0,atts:'',ajax_url:'',sf:{}},options);if(settings.sf.container!==''){$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search(active_year,active_month,active_week,active_day);}});}
setThisWeek(settings.month_id+settings.week,settings.active_day);setListeners();if(settings.month_navigator)initMonthNavigator(settings.month_id);function setListeners(){$(settings.changeWeekElement).off('click').on('click',function(){var week=$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active').data('week-id');var max_weeks=$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active').data('max-weeks');var new_week_number=active_week_number;if($(this).hasClass('mec-previous-month')){week=parseInt(week)-1;new_week_number--;}else{week=parseInt(week)+1;new_week_number++;}
if(new_week_number<=1||new_week_number>=max_weeks){$(this).css({'opacity':.6,'cursor':'default'});$(this).find('i').css({'opacity':.6,'cursor':'default'});}else{$('#mec_skin_'+settings.id+' .mec-load-week, #mec_skin_'+settings.id+' .mec-load-week i').css({'opacity':1,'cursor':'pointer'});}
if(new_week_number===0||new_week_number>max_weeks){}else{setThisWeek(week);}});$('#mec_skin_'+settings.id+' .mec-weekly-view-week dt').not('.mec-timetable-has-no-event').off('click').on('click',function(){var day=$(this).data('date-id');setDay(day);});if(settings.sed_method!='0'){sed();}}
function setThisWeek(week,day){if(!$('#mec_weekly_view_week_'+settings.id+'_'+week).length){return setThisWeek((parseInt(week)-1),day);}
$('#mec_skin_'+settings.id+' .mec-weekly-view-week').removeClass('mec-weekly-view-week-active');$('#mec_weekly_view_week_'+settings.id+'_'+week).addClass('mec-weekly-view-week-active');setDay(day);active_week=week;active_week_number=$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active').data('week-number');$('#mec_skin_'+settings.id+' .mec-calendar-d-top').find('.mec-current-week').find('span').remove();$('#mec_skin_'+settings.id+' .mec-calendar-d-top').find('.mec-current-week').append('<span>'+active_week_number+'</span>');if(active_week_number===1){$('#mec_skin_'+settings.id+' .mec-previous-month.mec-load-week').css({'opacity':.6,'cursor':'default'});$('#mec_skin_'+settings.id+' .mec-previous-month.mec-load-week').find('i').css({'opacity':.6,'cursor':'default'});}}
function setDay(day){if(typeof day==='undefined'){day=$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active dt').not('.mec-timetable-has-no-event').first().data('date-id');}
$('#mec_skin_'+settings.id+' dt').removeClass('mec-timetable-day-active');$('#mec_skin_'+settings.id+' .mec-weekly-view-week-active dt[data-date-id="'+day+'"]').addClass('mec-timetable-day-active');$('#mec_skin_'+settings.id+' .mec-weekly-view-date-events').addClass('mec-util-hidden');$('#mec_weekly_view_date_events'+settings.id+'_'+day).removeClass('mec-util-hidden');}
function initMonthNavigator(month_id){$('#mec_month_navigator'+settings.id+'_'+month_id+' .mec-load-month').off('click').on('click',function(){var year=$(this).data('mec-year');var month=$(this).data('mec-month');setMonth(year,month,active_week);});}
function search(year,month,week){var week_number=(String(week).slice(-1));if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');year=typeof year=='undefined'?'':year;month=typeof month=='undefined'?'':month;$('body').data('currentweek',$("#mec_skin_events_"+settings.id).find('.mec-current-week > span').html());$.ajax({url:settings.ajax_url,data:"action=mec_timetable_load_month&mec_year="+year+"&mec_month="+month+"&mec_week="+week_number+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_skin_events_"+settings.id).html('<div class="mec-month-container" id="mec_timetable_month_'+settings.id+'_'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-weekly-view-month-navigator-container").html('<div class="mec-month-navigator" id="mec_month_navigator'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');setListeners();toggleMonth(response.current_month.id);setThisWeek(response.week_id);mec_focus_week(settings.id,'timetable');mecFluentCustomScrollbar();},error:function(){}});}
function setMonth(year,month,week){var month_id=''+year+month;var week_number=(String(week).slice(-1));active_month=month;active_year=year;if($("#mec_timetable_month_"+settings.id+"_"+month_id).length){toggleMonth(month_id);setThisWeek(''+month_id+week_number);}else{if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_timetable_load_month&mec_year="+year+"&mec_month="+month+"&mec_week="+week_number+"&"+settings.atts+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_skin_events_"+settings.id).append('<div class="mec-month-container" id="mec_timetable_month_'+settings.id+'_'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-weekly-view-month-navigator-container").append('<div class="mec-month-navigator" id="mec_month_navigator'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');setListeners();toggleMonth(response.current_month.id);setThisWeek(response.week_id);$("#mec_sf_month_"+settings.id).val(month);$("#mec_sf_year_"+settings.id).val(year);},error:function(){}});}}
function toggleMonth(month_id){$('#mec_skin_'+settings.id+' .mec-month-container').addClass('mec-util-hidden');$('#mec_timetable_month_'+settings.id+'_'+month_id).removeClass('mec-util-hidden');$('#mec_skin_'+settings.id+' .mec-month-navigator').addClass('mec-util-hidden');$('#mec_month_navigator'+settings.id+'_'+month_id).removeClass('mec-util-hidden');if(settings.month_navigator)initMonthNavigator(month_id);}
function sed(){$("#mec_skin_"+settings.id+" .mec-timetable-event-title a").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}};}(jQuery));(function($){$.fn.mecWeeklyProgram=function(options){var settings=$.extend({id:0,atts:'',sf:{}},options);if(settings.sf.container!==''){$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search();}});}
setListeners();function setListeners(){if(settings.sed_method!='0'){sed();}}
function search(){var $modal=$('.mec-modal-result');if($modal.length===0)$('.mec-wrap').append('<div class="mec-modal-result"></div>');$modal.addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_weeklyprogram_load&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){$modal.removeClass("mec-month-navigator-loading");$("#mec_skin_events_"+settings.id).html(response.date_events);setListeners();},error:function(){}});}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}};}(jQuery));(function($){$.fn.mecMasonryView=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},end_date:'',offset:0,start_date:'',},options);setListeners();jQuery(window).load(function(){initMasonry();if(typeof custom_dev!==undefined)var custom_dev;if(custom_dev=='yes'){$(".mec-wrap").css("height","1550");if(Math.max(document.documentElement.clientWidth,window.innerWidth||0)<768){$(".mec-wrap").css("height","5500");}
if(Math.max(document.documentElement.clientWidth,window.innerWidth||0)<480){$(".mec-wrap").css("height","5000");}
$(".mec-event-masonry .mec-masonry-item-wrap:nth-child(n+20)").css("display","none");$(".mec-load-more-button").on("click",function(){$(".mec-event-masonry .mec-masonry-item-wrap:nth-child(n+20)").css("display","block");$(".mec-wrap").css("height","auto");initMasonry();$(".mec-load-more-button").hide();})
$(".mec-events-masonry-cats a:first-child").on("click",function(){$(".mec-wrap").css("height","auto");$(".mec-event-masonry .mec-masonry-item-wrap:nth-child(n+20)").css("display","block");$(".mec-load-more-button").hide();initMasonry();})
$(".mec-events-masonry-cats a:not(:first-child)").on("click",function(){$(".mec-load-more-button").hide();$(".mec-wrap").css("height","auto");$(".mec-wrap").css("min-height","400");$(".mec-event-masonry .mec-masonry-item-wrap").css("display","block");var element=document.querySelector("#mec_skin_"+settings.id+" .mec-event-masonry");var selector=$(this).attr('data-group');var CustomShuffle=new Shuffle(element,{itemSelector:'.mec-masonry-item-wrap',});CustomShuffle.sort({by:element.getAttribute('data-created'),});CustomShuffle.filter(selector!='*'?selector:Shuffle.ALL_ITEMS);$(".mec-event-masonry .mec-masonry-item-wrap").css("visibility","visible");})}});if(mecdata.elementor_edit_mode!='no')elementorFrontend.hooks.addAction('frontend/element_ready/global',initMasonry());function initMasonry(){var $container=$("#mec_skin_"+settings.id+" .mec-event-masonry");var data_sortAscending=$("#mec_skin_"+settings.id).data('sortascending');var $grid=$container.isotope({filter:'*',itemSelector:'.mec-masonry-item-wrap',getSortData:{date:'[data-sort-masonry]',},sortBy:'date',sortAscending:data_sortAscending,animationOptions:{duration:750,easing:'linear',queue:false},});if(settings.fit_to_row==1)$grid.isotope({layoutMode:'fitRows',sortAscending:data_sortAscending,});$('.elementor-tabs').find('.elementor-tab-title').click(function(){$grid.isotope({sortBy:'date',sortAscending:data_sortAscending,});});$("#mec_skin_"+settings.id+" .mec-events-masonry-cats a").click(function(){var selector=$(this).attr('data-filter');var $grid_cat=$container.isotope({filter:selector,itemSelector:'.mec-masonry-item-wrap',getSortData:{date:'[data-sort-masonry]',},sortBy:'date',sortAscending:data_sortAscending,animationOptions:{duration:750,easing:'linear',queue:false},});if(settings.masonry_like_grid==1)$grid_cat.isotope({sortBy:'date',sortAscending:data_sortAscending,});return false;});var $optionSets=$("#mec_skin_"+settings.id+" .mec-events-masonry-cats"),$optionLinks=$optionSets.find('a');$optionLinks.click(function(){var $this=$(this);if($this.hasClass('selected'))return false;var $optionSet=$this.parents('.mec-events-masonry-cats');$optionSet.find('.mec-masonry-cat-selected').removeClass('mec-masonry-cat-selected');$this.addClass('mec-masonry-cat-selected');});}
function setListeners(){if(settings.sed_method!='0'){sed();}}
$("#mec_skin_"+settings.id+" .mec-events-masonry-cats > a").click(function()
{var mec_load_more_btn=$("#mec_skin_"+settings.id+" .mec-load-more-button");var mec_filter_value=$(this).data('filter').replace('.mec-t','');if(mec_load_more_btn.hasClass('mec-load-more-loading'))mec_load_more_btn.removeClass('mec-load-more-loading');if(mec_load_more_btn.hasClass("mec-hidden-"+mec_filter_value))mec_load_more_btn.addClass("mec-util-hidden");else mec_load_more_btn.removeClass("mec-util-hidden");});$("#mec_skin_"+settings.id+" .mec-load-more-button").on("click",function(){loadMore();});function sed(){$("#mec_skin_"+settings.id+" .mec-masonry-img a, #mec_skin_"+settings.id+" .mec-event-title a, #mec_skin_"+settings.id+" .mec-booking-button").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMore(){$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-load-more-loading");var mec_cat_elem=$('#mec_skin_'+settings.id).find('.mec-masonry-cat-selected');var mec_filter_value=(mec_cat_elem&&mec_cat_elem.data('filter')!=undefined)?mec_cat_elem.data('filter').replace('.mec-t',''):'';var mec_filter_by=$('#mec_skin_'+settings.id).data('filterby');$.ajax({url:settings.ajax_url,data:"action=mec_masonry_load_more&mec_filter_by="+mec_filter_by+"&mec_filter_value="+mec_filter_value+"&mec_start_date="+settings.end_date+"&mec_offset="+settings.offset+"&"+settings.atts+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden mec-hidden-"+mec_filter_value);}else{$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");var node=$("#mec_skin_"+settings.id+" .mec-event-masonry");var markup='',newItems=$(response.html).find('.mec-masonry-item-wrap');newItems.each(function(index){node.isotope().append(newItems[index]).isotope('appended',newItems[index]);});$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");settings.end_date=response.end_date;settings.offset=response.offset;if(settings.sed_method!='0'){sed();}}},error:function(){}});}};}(jQuery));(function($){$.fn.mecListView=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},current_month_divider:'',end_date:'',offset:0,limit:0},options);setListeners();var sf;function setListeners(){if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search();}});}
$("#mec_skin_"+settings.id+" .mec-load-more-button").on("click",function(){loadMore();});if(settings.style==='accordion'){if(settings.toggle_month_divider){$('#mec_skin_'+settings.id+' .mec-month-divider:first-of-type').addClass('active');$('#mec_skin_'+settings.id+' .mec-month-divider:first-of-type').find('i').removeClass('mec-sl-arrow-down').addClass('mec-sl-arrow-up');toggle();}
accordion();}
if(settings.sed_method!='0'){sed();}}
function toggle(){$('#mec_skin_'+settings.id+' .mec-month-divider').off("click").on("click",function(event){event.preventDefault();var status=$(this).hasClass('active');$('#mec_skin_'+settings.id+' .mec-month-divider').removeClass('active');$('#mec_skin_'+settings.id+' .mec-divider-toggle').slideUp('fast');if(status){$(this).removeClass('active');$('.mec-month-divider').find('i').removeClass('mec-sl-arrow-up').addClass('mec-sl-arrow-down');}else{$(this).addClass('active');$('.mec-month-divider').find('i').removeClass('mec-sl-arrow-up').addClass('mec-sl-arrow-down')
$(this).find('i').removeClass('mec-sl-arrow-down').addClass('mec-sl-arrow-up');var month=$(this).data('toggle-divider');$('#mec_skin_'+settings.id+' .'+month).slideDown('fast');}});}
function toggleLoadmore()
{$('#mec_skin_'+settings.id+' .mec-month-divider:not(:last)').each(function()
{if($(this).hasClass('active'))$(this).removeClass('active');var month=$(this).data('toggle-divider');$('#mec_skin_'+settings.id+' .'+month).slideUp('fast');});$('#mec_skin_'+settings.id+' .mec-month-divider:last').addClass('active');toggle();}
function accordion(){$("#mec_skin_"+settings.id+" .mec-toggle-item-inner").off("click").on("click",function(event){event.preventDefault();var $this=$(this);$(this).parent().find(".mec-content-toggle").slideToggle("fast",function(){$this.children("i").toggleClass("mec-sl-arrow-down mec-sl-arrow-up");});var unique_id=$(this).parent().find(".mec-modal-wrap").data('unique-id');window['mec_init_gmap'+unique_id]();});}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a, #mec_skin_"+settings.id+" .mec-booking-button, #mec_skin_"+settings.id+" .mec-detail-button").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});$("#mec_skin_"+settings.id+" .mec-event-image a img").off('click').on('click',function(e){e.preventDefault();var href=$(this).parent().attr('href');var id=$(this).parent().data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMore(){$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-load-more-loading");$.ajax({url:settings.ajax_url,data:"action=mec_list_load_more&mec_start_date="+settings.end_date+"&mec_offset="+settings.offset+"&"+settings.atts+"&current_month_divider="+settings.current_month_divider+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){if(response.count=='0'){$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");}else{$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");$("#mec_skin_events_"+settings.id).append(response.html);$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");settings.end_date=response.end_date;settings.offset=response.offset;settings.current_month_divider=response.current_month_divider;if(settings.sed_method!='0'){sed();}
if(settings.style==='accordion'){if(settings.toggle_month_divider)toggleLoadmore();accordion();}}},error:function(){}});}
function search(){$("#mec_skin_no_events_"+settings.id).addClass("mec-util-hidden");if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');jQuery("#gmap-data").val("");$.ajax({url:settings.ajax_url,data:"action=mec_list_load_more&mec_start_date="+settings.start_date+"&"+settings.atts+"&current_month_divider=0&apply_sf_date=1",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_events_"+settings.id).html('');$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').addClass("mec-util-hidden");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");$("#mec_skin_no_events_"+settings.id).removeClass("mec-util-hidden");}else{$("#mec_skin_events_"+settings.id).html(response.html);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').removeClass("mec-util-hidden");if(response.count>=settings.limit)$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");else $("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");settings.end_date=response.end_date;settings.offset=response.offset;settings.current_month_divider=response.current_month_divider;if(settings.sed_method!='0'){sed();}
if(settings.style==='accordion'){if(settings.toggle_month_divider)toggle();accordion();}}},error:function(){}});}};}(jQuery));(function($){$.fn.mecGridView=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},end_date:'',offset:0,start_date:'',},options);setListeners();var sf;function setListeners(){if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search();}});}
$("#mec_skin_"+settings.id+" .mec-load-more-button").on("click",function(){loadMore();});if(settings.sed_method!='0'){sed();}}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a, #mec_skin_"+settings.id+" .mec-booking-button").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});$("#mec_skin_"+settings.id+" .mec-event-image a img").off('click').on('click',function(e){e.preventDefault();var href=$(this).parent().attr('href');var id=$(this).parent().data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMore(){$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-load-more-loading");$.ajax({url:settings.ajax_url,data:"action=mec_grid_load_more&mec_start_date="+settings.end_date+"&mec_offset="+settings.offset+"&"+settings.atts+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");}else{$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");$("#mec_skin_events_"+settings.id).append(response.html);$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");settings.end_date=response.end_date;settings.offset=response.offset;if(settings.sed_method!='0'){sed();}}},error:function(){}});}
function search(){$("#mec_skin_no_events_"+settings.id).addClass("mec-util-hidden");if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');jQuery("#gmap-data").val("");$.ajax({url:settings.ajax_url,data:"action=mec_grid_load_more&mec_start_date="+settings.start_date+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_events_"+settings.id).html('');$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').addClass("mec-util-hidden");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");$("#mec_skin_no_events_"+settings.id).removeClass("mec-util-hidden");}else{$("#mec_skin_events_"+settings.id).html(response.html);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').removeClass("mec-util-hidden");if(response.count>=settings.limit)$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");else $("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");settings.end_date=response.end_date;settings.offset=response.offset;if(settings.sed_method!='0'){sed();}}},error:function(){}});}};}(jQuery));(function($){$.fn.mecCustomView=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},end_date:'',offset:0,start_date:'',},options);setListeners();var sf;function setListeners(){if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search();}});}
$("#mec_skin_"+settings.id+" .mec-load-more-button").on("click",function(){loadMore();});if(settings.sed_method!='0'){sed();}}
function sed(){$("#mec_skin_"+settings.id+" .mec-event-title a, #mec_skin_"+settings.id+" .mec-booking-button").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});$("#mec_skin_"+settings.id+" .mec-event-image a img").off('click').on('click',function(e){e.preventDefault();var href=$(this).parent().attr('href');var id=$(this).parent().data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMore(){$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-load-more-loading");$.ajax({url:settings.ajax_url,data:"action=mec_custom_load_more&mec_start_date="+settings.end_date+"&mec_offset="+settings.offset+"&"+settings.atts+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");}else{$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");$("#mec_skin_events_"+settings.id).append(response.html);$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");settings.end_date=response.end_date;settings.offset=response.offset;if($('.mec-event-sd-countdown').length>0)
{$('.mec-event-sd-countdown').each(function(event){var dc=$(this).attr('data-date-custom');$(this).mecCountDown({date:dc,format:"off"},function(){});})}
if(settings.sed_method!='0'){sed();}}},error:function(){}});}
function search(){$("#mec_skin_no_events_"+settings.id).addClass("mec-util-hidden");if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');jQuery("#gmap-data").val("");$.ajax({url:settings.ajax_url,data:"action=mec_custom_load_more&mec_start_date="+settings.start_date+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_events_"+settings.id).html('');$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').addClass("mec-util-hidden");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");$("#mec_skin_no_events_"+settings.id).removeClass("mec-util-hidden");}else{$("#mec_skin_events_"+settings.id).html(response.html);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').removeClass("mec-util-hidden");if(response.count>=settings.limit)$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");else $("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");settings.end_date=response.end_date;settings.offset=response.offset;if(settings.sed_method!='0'){sed();}}},error:function(){}});}};}(jQuery));(function($){$.fn.mecTimelineView=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},end_date:'',offset:0,start_date:'',},options);setListeners();var sf;function setListeners(){if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search();}});}
$("#mec_skin_"+settings.id+" .mec-load-more-button").on("click",function(){loadMore();});if(settings.sed_method!='0'){sed();}}
function sed(){$("#mec_skin_"+settings.id+" .mec-timeline-event-image a, #mec_skin_"+settings.id+" .mec-event-title a, #mec_skin_"+settings.id+" .mec-booking-button").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});$("#mec_skin_"+settings.id+" .mec-event-image a img").off('click').on('click',function(e){e.preventDefault();var href=$(this).parent().attr('href');var id=$(this).parent().data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMore(){$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-load-more-loading");$.ajax({url:settings.ajax_url,data:"action=mec_timeline_load_more&mec_start_date="+settings.end_date+"&mec_offset="+settings.offset+"&"+settings.atts+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");}else{$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");$("#mec_skin_events_"+settings.id).append(response.html);$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");settings.end_date=response.end_date;settings.offset=response.offset;if(settings.sed_method!='0'){sed();}}},error:function(){}});}
function search(){$("#mec_skin_no_events_"+settings.id).addClass("mec-util-hidden");if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_timeline_load_more&mec_start_date="+settings.start_date+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_events_"+settings.id).html('');$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').addClass("mec-util-hidden");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");$("#mec_skin_no_events_"+settings.id).removeClass("mec-util-hidden");}else{$("#mec_skin_events_"+settings.id).html(response.html);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$('.mec-skin-map-container').removeClass("mec-util-hidden");if(response.count>=settings.limit)$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");else $("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");settings.end_date=response.end_date;settings.offset=response.offset;if(settings.sed_method!='0'){sed();}}},error:function(){}});}};}(jQuery));(function($){$.fn.mecAgendaView=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},current_month_divider:'',end_date:'',offset:0,},options);setListeners();var sf;function setListeners(){if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search();}});}
$("#mec_skin_"+settings.id+" .mec-load-more-button").on("click",function(){loadMore();});if(settings.sed_method!='0'){sed();}}
function sed(){$("#mec_skin_"+settings.id+" .mec-agenda-event-title a").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMore(){$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-load-more-loading");$.ajax({url:settings.ajax_url,data:"action=mec_agenda_load_more&mec_start_date="+settings.end_date+"&mec_offset="+settings.offset+"&"+settings.atts+"&current_month_divider="+settings.current_month_divider+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");}else{$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");$("#mec_skin_events_"+settings.id+" .mec-events-agenda-container").append(response.html);$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-load-more-loading");settings.end_date=response.end_date;settings.offset=response.offset;settings.current_month_divider=response.current_month_divider;if(settings.sed_method!='0'){sed();}
mecFluentCustomScrollbar();}},error:function(){}});}
function search(){$("#mec_skin_no_events_"+settings.id).addClass("mec-util-hidden");if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');mecFluentCustomScrollbar();$.ajax({url:settings.ajax_url,data:"action=mec_agenda_load_more&mec_start_date="+settings.start_date+"&"+settings.atts+"&current_month_divider=0&apply_sf_date=1",dataType:"json",type:"post",success:function(response){if(response.count=="0"){$("#mec_skin_events_"+settings.id+" .mec-events-agenda-container").html('');$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");$("#mec_skin_no_events_"+settings.id).removeClass("mec-util-hidden");}else{$("#mec_skin_events_"+settings.id+" .mec-events-agenda-container").html(response.html);$('.mec-modal-result').removeClass("mec-month-navigator-loading");if(response.count>=settings.limit)$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");else $("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");settings.end_date=response.end_date;settings.offset=response.offset;settings.current_month_divider=response.current_month_divider;if(settings.sed_method!='0'){sed();}}
mecFluentCustomScrollbar();},error:function(){}});}};}(jQuery));(function($){$.fn.mecCarouselView=function(options){var settings=$.extend({id:0,atts:'',ajax_url:'',sf:{},items:3,autoplay:'',style:'type1',start_date:''},options);initSlider(settings);if(settings.sed_method!='0'){sed(settings);}
function initSlider(settings){if($('body').hasClass('rtl')){var owl_rtl=true;}else{var owl_rtl=false;}
if(settings.style==='type1'){var owl=$("#mec_skin_"+settings.id+" .mec-event-carousel-type1 .mec-owl-carousel");owl.owlCarousel({autoplay:true,autoplayTimeout:settings.autoplay,loop:true,items:settings.items,responsiveClass:true,responsive:{0:{items:1,},979:{items:2,},1199:{items:settings.count,}},dots:true,nav:false,autoplayHoverPause:true,rtl:owl_rtl,});owl.bind("mouseleave",function(event){$("#mec_skin_"+settings.id+" .mec-owl-carousel").trigger('play.owl.autoplay');});}else if(settings.style==='type4'){$("#mec_skin_"+settings.id+" .mec-owl-carousel").owlCarousel({autoplay:true,loop:true,autoplayTimeout:settings.autoplay,items:settings.items,dots:false,nav:true,responsiveClass:true,responsive:{0:{items:1,stagePadding:50,},979:{items:2,},1199:{items:settings.count,}},autoplayHoverPause:true,navText:["<i class='mec-sl-arrow-left'></i>"," <i class='mec-sl-arrow-right'></i>"],rtl:owl_rtl,});$("#mec_skin_"+settings.id+" .mec-owl-carousel").bind("mouseleave",function(event){$("#mec_skin_"+settings.id+" .mec-owl-carousel").trigger('play.owl.autoplay');});}else{$("#mec_skin_"+settings.id+" .mec-owl-carousel").owlCarousel({autoplay:true,loop:true,autoplayTimeout:settings.autoplay,items:settings.items,dots:typeof settings.dots_navigation!='undefined'?settings.dots_navigation:false,nav:typeof settings.navigation!='undefined'?settings.navigation:true,responsiveClass:true,responsive:{0:{items:1,},979:{items:2,},1199:{items:settings.count,}},autoplayHoverPause:true,navText:typeof settings.navText!='undefined'?settings.navText:["<i class='mec-sl-arrow-left'></i>"," <i class='mec-sl-arrow-right'></i>"],rtl:owl_rtl,});$("#mec_skin_"+settings.id+" .mec-owl-carousel").bind("mouseleave",function(event){$("#mec_skin_"+settings.id+" .mec-owl-carousel").trigger('play.owl.autoplay');});}}};function sed(settings){$("#mec_skin_"+settings.id+" .mec-event-carousel-title a, #mec_skin_"+settings.id+" .mec-booking-button, #mec_skin_"+settings.id+" .mec-event-button").off('click').on('click',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}}(jQuery));(function($){$.fn.mecSliderView=function(options){var settings=$.extend({id:0,atts:'',autoplay:false,ajax_url:'',sf:{},start_date:''},options);initSlider();function initSlider(){if($('body').hasClass('rtl')){var owl_rtl=true;}else{var owl_rtl=false;}
$("#mec_skin_"+settings.id+" .mec-owl-carousel").owlCarousel({autoplay:true,autoplayTimeout:settings.autoplay,loop:true,items:1,responsiveClass:true,responsive:{0:{items:1,},960:{items:1,},1200:{items:1,}},dots:false,nav:true,autoplayHoverPause:true,navText:typeof settings.navText!='undefined'?settings.navText:["<i class='mec-sl-arrow-left'></i>"," <i class='mec-sl-arrow-right'></i>"],rtl:owl_rtl,});}};}(jQuery));(function($){$.fn.mecCountDown=function(options,callBack){var settings=$.extend({date:null,format:null},options);var callback=callBack;var selector=$(this);startCountdown();var interval=setInterval(startCountdown,1000);function startCountdown(){var eventDate=Date.parse(settings.date)/1000;var currentDate=Math.floor($.now()/1000);if(eventDate<=currentDate){callback.call(this);clearInterval(interval);}
var seconds=eventDate-currentDate;var days=Math.floor(seconds/(60*60*24));seconds-=days*60*60*24;var hours=Math.floor(seconds/(60*60));seconds-=hours*60*60;var minutes=Math.floor(seconds/60);seconds-=minutes*60;if(days==1)selector.find(".mec-timeRefDays").text(mecdata.day);else selector.find(".mec-timeRefDays").text(mecdata.days);if(hours==1)selector.find(".mec-timeRefHours").text(mecdata.hour);else selector.find(".mec-timeRefHours").text(mecdata.hours);if(minutes==1)selector.find(".mec-timeRefMinutes").text(mecdata.minute);else selector.find(".mec-timeRefMinutes").text(mecdata.minutes);if(seconds==1)selector.find(".mec-timeRefSeconds").text(mecdata.second);else selector.find(".mec-timeRefSeconds").text(mecdata.seconds);if(settings.format==="on"){days=(String(days).length>=2)?days:"0"+days;hours=(String(hours).length>=2)?hours:"0"+hours;minutes=(String(minutes).length>=2)?minutes:"0"+minutes;seconds=(String(seconds).length>=2)?seconds:"0"+seconds;}
if(!isNaN(eventDate)){selector.find(".mec-days").text(days);selector.find(".mec-hours").text(hours);selector.find(".mec-minutes").text(minutes);selector.find(".mec-seconds").text(seconds);}else{clearInterval(interval);}}};}(jQuery));(function($)
{$.fn.mecTileView=function(options)
{var active_month;var active_year;var settings=$.extend({today:null,id:0,events_label:'Events',event_label:'Event',month_navigator:0,atts:'',active_month:{},next_month:{},sf:{},ajax_url:''},options);if(settings.month_navigator)initMonthNavigator();if(settings.load_method==='month')setMonth(settings.next_month.year,settings.next_month.month,true);active_month=settings.active_month.month;active_year=settings.active_month.year;setListeners();if(settings.sf.container!=='')
{sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts)
{settings.atts=atts;search(active_year,active_month);}});}
function initMonthNavigator()
{$("#mec_skin_"+settings.id+" .mec-load-month").off("click").on("click",function()
{var year=$(this).data("mec-year");var month=$(this).data("mec-month");setMonth(year,month,false,true);});}
function search(year,month)
{if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');$.ajax({url:settings.ajax_url,data:"action=mec_tile_load_month&mec_year="+year+"&mec_month="+month+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response)
{if(settings.load_method==='month')
{active_month=response.current_month.month;active_year=response.current_month.year;$("#mec_skin_events_"+settings.id).html('<div class="mec-month-container" id="mec_tile_month_'+settings.id+'_'+response.current_month.id+'" data-month-id="'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-tile-month-navigator-container").append('<div class="mec-month-navigator" id="mec_month_navigator_'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');initMonthNavigator();setListeners();toggleMonth(response.current_month.id);}
else
{$("#mec_skin_events_"+settings.id).html(response.html);if(response.count>=settings.limit)$("#mec_skin_"+settings.id+" .mec-load-more-button").removeClass("mec-util-hidden");else $("#mec_skin_"+settings.id+" .mec-load-more-button").addClass("mec-util-hidden");settings.end_date=response.end_date;settings.offset=response.offset;setListeners();}
$('.mec-modal-result').removeClass("mec-month-navigator-loading");},error:function(){}});}
function setMonth(year,month,do_in_background,navigator_click)
{if(typeof do_in_background==="undefined")do_in_background=false;navigator_click=navigator_click||false;var month_id=year+""+month;if(!do_in_background)
{active_month=month;active_year=year;}
if($("#mec_tile_month_"+settings.id+"_"+month_id).length)
{toggleMonth(month_id);}
else
{if(!do_in_background)
{if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');}
$.ajax({url:settings.ajax_url,data:"action=mec_tile_load_month&mec_year="+year+"&mec_month="+month+"&"+settings.atts+"&apply_sf_date=0"+"&navigator_click="+navigator_click,dataType:"json",type:"post",success:function(response)
{$("#mec_skin_events_"+settings.id).append('<div class="mec-month-container" id="mec_tile_month_'+settings.id+'_'+response.current_month.id+'" data-month-id="'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-tile-month-navigator-container").append('<div class="mec-month-navigator" id="mec_month_navigator_'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');initMonthNavigator();setListeners();if(!do_in_background)
{toggleMonth(response.current_month.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_sf_month_"+settings.id).val(month);$("#mec_sf_year_"+settings.id).val(year);}
else
{$("#mec_tile_month_"+settings.id+"_"+response.current_month.id).hide();$("#mec_month_navigator_"+settings.id+"_"+response.current_month.id).hide();}},error:function(){}});}}
function toggleMonth(month_id)
{var active_month=$("#mec_skin_"+settings.id+" .mec-month-container-selected").data("month-id");var active_day=$("#mec_tile_month_"+settings.id+"_"+active_month+" .mec-selected-day").data("day");if(active_day<=9)active_day="0"+active_day;$("#mec_skin_"+settings.id+" .mec-month-navigator").hide();$("#mec_month_navigator_"+settings.id+"_"+month_id).show();$("#mec_skin_"+settings.id+" .mec-month-container").hide().removeClass("mec-month-container-selected");$("#mec_tile_month_"+settings.id+"_"+month_id).show().addClass("mec-month-container-selected");}
var sf;function setListeners()
{$("#mec_skin_"+settings.id+" .mec-load-more-button").off("click").on("click",function()
{loadMore();});$("#mec_skin_"+settings.id+" .mec-has-event").off("click").on('click',function(e)
{e.preventDefault();var $this=$(this),data_mec_cell=$this.data('mec-cell'),month_id=$this.data('month');$("#mec_monthly_view_month_"+settings.id+"_"+month_id+" .mec-calendar-day").removeClass('mec-selected-day');$this.addClass('mec-selected-day');$('#mec_month_side_'+settings.id+'_'+month_id+' .mec-calendar-events-sec:not([data-mec-cell='+data_mec_cell+'])').slideUp();$('#mec_month_side_'+settings.id+'_'+month_id+' .mec-calendar-events-sec[data-mec-cell='+data_mec_cell+']').slideDown();$('#mec_monthly_view_month_'+settings.id+'_'+month_id+' .mec-calendar-events-sec:not([data-mec-cell='+data_mec_cell+'])').slideUp();$('#mec_monthly_view_month_'+settings.id+'_'+month_id+' .mec-calendar-events-sec[data-mec-cell='+data_mec_cell+']').slideDown();});if(settings.sed_method!='0')
{sed();}}
function sed()
{$("#mec_skin_"+settings.id+" .mec-event-title a").off('click').on('click',function(e)
{e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}
function loadMore()
{var $load_more_button=$("#mec_skin_"+settings.id+" .mec-load-more-button");$load_more_button.addClass("mec-load-more-loading");$.ajax({url:settings.ajax_url,data:"action=mec_tile_load_more&mec_start_date="+settings.end_date+"&mec_offset="+settings.offset+"&"+settings.atts+"&current_month_divider="+settings.current_month_divider+"&apply_sf_date=0",dataType:"json",type:"post",success:function(response)
{if(response.count=='0')
{$load_more_button.removeClass("mec-load-more-loading");$load_more_button.addClass("mec-util-hidden");}
else
{$load_more_button.removeClass("mec-util-hidden");$("#mec_skin_events_"+settings.id).append(response.html);$load_more_button.removeClass("mec-load-more-loading");settings.end_date=response.end_date;settings.offset=response.offset;settings.current_month_divider=response.current_month_divider;if(settings.sed_method!='0')
{sed();}}},error:function(){}});}};}(jQuery));function mec_gateway_selected(gateway_id){jQuery('.mec-book-form-gateway-checkout').addClass('mec-util-hidden');jQuery('#mec_book_form_gateway_checkout'+gateway_id).removeClass('mec-util-hidden');}
function mec_wrap_resize(){var $mec_wrap=jQuery('.mec-wrap'),mec_width=$mec_wrap.width();if(mec_width<959){$mec_wrap.addClass('mec-sm959');}else{$mec_wrap.removeClass('mec-sm959');}}
function get_parameter_by_name(name,url){if(!url){url=window.location.href;}
name=name.replace(/[\[\]]/g,"\\$&");var regex=new RegExp("[?&]"+name+"(=([^&#]*)|&|#|$)"),results=regex.exec(url);if(!results)return null;if(!results[2])return'';return decodeURIComponent(results[2].replace(/\+/g," "));}
var mec_g_month_id=null;function mecFocusDay(settings)
{if(mec_g_month_id!=null)
{setTimeout(function()
{var id=settings.id,date=new Date(),mec_owl_year=mec_g_month_id.substr(0,4),mec_current_year=date.getFullYear(),mec_owl_month=mec_g_month_id.substr(4,6),mec_current_month=date.getMonth()+1,mec_current_day=date.getDate(),mec_owl_go=jQuery("#mec-owl-calendar-d-table-"+id+"-"+mec_g_month_id),mec_day_exist=false;mec_owl_go.find('.owl-stage > div').each(function(index)
{if(parseInt(jQuery(this).children('div').data("events-count"))>0)
{if((((mec_owl_year!=mec_current_year)&&(mec_owl_month!=mec_current_month))||(mec_owl_year==mec_current_year)&&(mec_owl_month!=mec_current_month))||parseInt(jQuery(this).children('div').text())>mec_current_day)
{var index_plus=index+1;jQuery('#mec_daily_view_day'+id+'_'+mec_g_month_id+(index<10?'0'+index_plus:index_plus)).trigger('click');mec_owl_go.trigger('to.owl.carousel',index_plus);mec_day_exist=true;return false;}
else
{jQuery('#mec_daily_view_day'+id+'_'+mec_g_month_id+mec_current_day).trigger('click');mec_owl_go.trigger('to.owl.carousel',mec_current_day);mec_day_exist=true;return false;}}});if(!mec_day_exist&&((mec_owl_year==mec_current_year)&&(mec_owl_month==mec_current_month)))
{jQuery('#mec_daily_view_day'+id+'_'+mec_g_month_id+mec_current_day).trigger('click');mec_owl_go.trigger('to.owl.carousel',mec_current_day);}},1000);}}
function mec_focus_week(id,skin){skin=skin||'weekly';var wrap_elem=jQuery('.mec-weeks-container .mec-weekly-view-week-active').parent();var days=wrap_elem.find('dt');var week=wrap_elem.find('dl').length;var focus_week=false;var i=j=1;for(i=1;i<week;i++){setTimeout(function(){var event=new Event('click');jQuery('#mec_skin_'+id+' .mec-previous-month.mec-load-week')[0].dispatchEvent(event);},33);}
days.each(function(i){if(jQuery(this).data('events-count')>0){if(focus_week===false){focus_week=parseInt(jQuery(this).parent().data('week-number'));}
if(skin=='timetable'){if(parseInt(jQuery(this).parent().data('week-number'))==parseInt(jQuery('body').data('currentweek'))){focus_week=parseInt(jQuery(this).parent().data('week-number'));return false;}}
else{return false;}}});if(focus_week!==false){for(j=1;j<focus_week;j++){setTimeout(function(){var event=new Event('click');jQuery('#mec_skin_'+id+' .mec-next-month.mec-load-week')[0].dispatchEvent(event);},33);}}}
(function($){$(document).ready(function(){if($('body').hasClass('rtl')){var owl_rtl=true;}else{var owl_rtl=false;}
$(".mec-widget .mec-event-grid-classic").addClass('mec-owl-carousel mec-owl-theme');$(".mec-widget .mec-event-grid-classic").owlCarousel({autoplay:true,autoplayTimeout:3000,autoplayHoverPause:true,loop:true,dots:false,nav:true,navText:["<i class='mec-sl-arrow-left'></i>"," <i class='mec-sl-arrow-right'></i>"],items:1,autoHeight:true,responsiveClass:true,rtl:owl_rtl,});mec_wrap_resize();jQuery(window).bind('resize',function(){mec_wrap_resize();});$('.mec-event-sharing-wrap').hover(function(){$(this).find('.mec-event-sharing').show(0);},function(){$(this).find('.mec-event-sharing').hide(0);});$('a.simple-booking[href^="#mec-events-meta-group-booking"]').click(function(){if(location.pathname.replace(/^\//,'')==this.pathname.replace(/^\//,'')&&location.hostname==this.hostname){var target=$(this.hash);target=target.length?target:$('[name='+this.hash.slice(1)+']');if(target.length){var scrollTopVal=target.offset().top-30;$('html, body').animate({scrollTop:scrollTopVal},600);return false;}}});if($('.single-mec-events .mec-single-event:not(".mec-single-modern")').length>0){if($('.single-mec-events .mec-event-info-desktop.mec-event-meta.mec-color-before.mec-frontbox').length>0){var html=$('.single-mec-events .mec-event-info-desktop.mec-event-meta.mec-color-before.mec-frontbox')[0].outerHTML;if(Math.max(document.documentElement.clientWidth,window.innerWidth||0)<960){$('.single-mec-events .col-md-4 .mec-event-info-desktop.mec-event-meta.mec-color-before.mec-frontbox').remove();$('.single-mec-events .mec-event-info-mobile').html(html)}}}
$('.mec-yearly-calendar .mec-has-event a').on('click',function(e){e.preventDefault();var des=$(this).attr('href');$('.mec-events-agenda').removeClass('mec-selected');$(des).closest('.mec-events-agenda').addClass('mec-selected');var scrollTopVal=$(des).closest('.mec-events-agenda').offset().top-35;if($(this).closest('.mec-fluent-wrap').length>0){var parent=jQuery(this).closest('.mec-fluent-wrap').find('.mec-yearly-agenda-sec');scrollTopVal=parent.scrollTop()+($(des).closest('.mec-events-agenda').offset().top-parent.offset().top);jQuery(this).closest('.mec-fluent-wrap').find('.mec-yearly-agenda-sec').getNiceScroll(0).doScrollTop(scrollTopVal-15,120);}else{$('html, body').animate({scrollTop:scrollTopVal},300);}});});})(jQuery);(function($){function convertToC(value){return Math.round(((parseFloat(value)-32)*5/9));}
function convertToF(value){return Math.round(((1.8*parseFloat(value))+32));}
function MPHToKPH(value){return Math.round(1.609344*parseFloat(value));}
function KPHToMPH(value){return Math.round((0.6214*parseFloat(value)));}
$(document).ready(function($){var degree=$('.mec-weather-summary-temp');var weather_extra=$('.mec-weather-extras');var wind=weather_extra.children('.mec-weather-wind');var visibility=weather_extra.children('.mec-weather-visibility');$('.degrees-mode').click(function(){var degree_mode=degree.children('var').text().trim();var wind_text=wind.text().substring(5);var visibility_text=visibility.text().substring(11);if(degree_mode==degree.data('c').trim()){degree.html(convertToF(parseInt(degree.text()))+' <var>'+degree.data('f')+'</var>');wind.html('<span>Wind:</span> '+KPHToMPH(parseInt(wind_text))+'<var>'+wind.data('mph')+'</var>');visibility.html('<span>Visibility:</span> '+KPHToMPH(parseInt(visibility_text))+'<var>'+visibility.data('mph')+'</var>');$(this).text($(this).data('metric'));}else if(degree_mode==degree.data('f').trim()){degree.html(convertToC(parseInt(degree.text()))+' <var>'+degree.data('c')+'</var>');wind.html('<span>Wind:</span> '+MPHToKPH(parseInt(wind_text))+'<var>'+wind.data('kph')+'</var>');visibility.html('<span>Visibility:</span> '+MPHToKPH(parseInt(visibility_text))+'<var>'+visibility.data('kph')+'</var>');$(this).text($(this).data('imperial'));}});$('a').on('click',function(){})
$('#mec_add_speaker_button').on('click',function(){var $this=this;var content=$($this).parent().find('input');var list=$('#mec-fes-speakers-list');var key=list.find('.mec-error').length;$($this).prop("disabled",true).css('cursor','wait');$.post(ajaxurl,{action:"speaker_adding",content:content.val(),key:key}).done(function(data){if($(data).hasClass('mec-error')){list.prepend(data);setTimeout(function(){$('#mec-speaker-error-${key}').remove();},1500);}else{list.html(data);content.val('');}
$($this).prop("disabled",false).css('cursor','pointer');});});var owl_rtl=$('body').hasClass('rtl')?true:false;var fes_export_list=$('.mec-export-list-wrapper');fes_export_list.find('.mec-export-list-item').click(function()
{$('.mec-export-list-item').removeClass('fes-export-date-active');$(this).addClass('fes-export-date-active');});var mec_bd_attendees_modules=$('.mec-attendees-list-details > ul > li');mec_bd_attendees_modules.click(function()
{$(this).find('.mec-attendees-toggle').toggle();});$('.mec-event-export-csv, .mec-event-export-excel').click(function()
{var mec_event_id=$(this).parent().parent().data('event-id');var booking_data=$(this).parent().parent().find('.mec-fes-btn-date .mec-certain-user-booking-ids').val();var certain_data=$(this).parent().parent().find('.fes-export-date-active').data('ids');if(typeof booking_data=='undefined')booking_data=',';if(typeof certain_data!='undefined')booking_data=certain_data;booking_data=booking_data.substr(0,booking_data.length-1);$.ajax({url:mecdata.ajax_url,data:"action=mec_fes_csv_export&fes_nonce="+mecdata.fes_nonce+"&mec_event_id="+mec_event_id+"&booking_ids="+booking_data,dataType:'json',type:"post",success:function(res){if(res.ex!='error')
{var $csv=$('<a>');$csv.attr('href',res.ex);$('body').append($csv);$csv.attr('download','bookings-'+res.name+'.csv');$csv[0].click();$csv.remove();}},error:function(){}});});});})(jQuery);function mec_book_form_submit(event,unique_id)
{event.preventDefault();window["mec_book_form_submit"+unique_id]();}
function mec_book_form_back_btn_cache(context,unique_id)
{var id=jQuery(context).attr('id');var mec_form_data=jQuery('#mec_book_form'+unique_id).serializeArray();if(id=="mec-book-form-btn-step-1")jQuery('body').data('mec-book-form-step-1',jQuery('#mec_booking'+unique_id).html()).data('unique-id',unique_id).data('mec-book-form-data-step-1',mec_form_data);else if(id=="mec-book-form-btn-step-2")jQuery('body').data('mec-book-form-step-2',jQuery('#mec_booking'+unique_id).html()).data('mec-book-form-data-step-2',mec_form_data);}
function mec_agreement_change(context)
{var status=jQuery(context).is(":checked")?true:false;if(status)jQuery(context).attr("checked","checked");else jQuery(context).removeAttr("checked");}
function mec_book_form_back_btn_click(context,unique_id)
{var id=jQuery(context).attr('id');unique_id=jQuery('body').data('unique-id');jQuery('#mec_booking_message'+unique_id).hide();if(id=="mec-book-form-back-btn-step-2")
{var mec_form_data_step_1=jQuery('body').data('mec-book-form-data-step-1');jQuery('#mec_booking'+unique_id).html(jQuery('body').data('mec-book-form-step-1'));jQuery.each(mec_form_data_step_1,function(index,object_item)
{jQuery('[name="'+object_item.name+'"]').val(object_item.value);});var recaptcha_check=jQuery('#mec_booking'+unique_id).find('#g-recaptcha').length;if(recaptcha_check!=0)
{jQuery('#g-recaptcha').html('');grecaptcha.render("g-recaptcha",{sitekey:mecdata.recapcha_key});}}
else if(id=="mec-book-form-back-btn-step-3")
{var mec_form_data_step_2=jQuery('body').data('mec-book-form-data-step-2');jQuery('#mec_booking'+unique_id).html(jQuery('body').data('mec-book-form-step-2'));jQuery.each(mec_form_data_step_2,function(index,object_item)
{var mec_elem=jQuery('[name="'+object_item.name+'"]');var mec_type=mec_elem.attr('type');if((mec_type=='checkbox'||mec_type=='radio'))
{var mec_elem_len=jQuery('[name="'+object_item.name+'"]').length;if(mec_elem_len>1)
{var id='#'+mec_elem.attr('id').match(/mec_book_reg_field_reg.*_/g)+object_item.value.toLowerCase();jQuery(id).prop('checked',true);}
else
{mec_elem.prop('checked',true);}}
mec_elem.val(object_item.value);});}}
function gmapSkin(NewJson){var gmap_temp=jQuery("#gmap-data");var beforeJson=gmap_temp.val();if(typeof beforeJson==='undefined')beforeJson='';var newJson=NewJson;var jsonPush=(typeof beforeJson!='undefined'&&beforeJson.trim()=="")?[]:JSON.parse(beforeJson);var pushState=jsonPush.length<1?false:true;for(var key in newJson){if(pushState){jsonPush.forEach(function(Item,Index){var render_location=jsonPush[Index].latitude+","+jsonPush[Index].longitude;if(key.trim()==render_location.trim()){newJson[key].count=newJson[key].count+jsonPush[Index].count;newJson[key].event_ids=newJson[key].event_ids.concat(jsonPush[Index].event_ids);var dom=jQuery(newJson[key].lightbox).find("div:nth-child(2)");var main_items=dom.html();var new_items=jQuery(jsonPush[Index].lightbox).find("div:nth-child(2)").html();var render_items=dom.html(main_items+new_items).html();var new_info_lightbox='<div><div class="mec-event-detail mec-map-view-event-detail"><i class="mec-sl-map-marker"></i> '+newJson[key].name+'</div><div>'+render_items+'</div></div>';newJson[key].lightbox=new_info_lightbox;var new_info_window='<div class="mec-marker-infowindow-wp"><div class="mec-marker-infowindow-count">'+newJson[key].count+'</div><div class="mec-marker-infowindow-content"><span>Event at this location</span><span>'+newJson[key].name+'</span></div></div>';newJson[key].infowindow=new_info_window;jsonPush.splice(Index,1);}});}
jsonPush.push(newJson[key]);}
gmap_temp.val(JSON.stringify(jsonPush));return jsonPush;}
jQuery(document).ready(function(){if(jQuery('.mec-fluent-wrap').length<0){return;}
jQuery(window).on('resize',mecFluentToggoleDisplayValueFilterContent);jQuery(document).on('click','.mec-fluent-wrap .mec-filter-icon',mecFluentToggleFilterContent);jQuery(document).on('click','.mec-fluent-wrap .mec-more-events-icon',mecFluentToggleMoreEvents);jQuery(document).on('click','.mec-fluent-wrap .mec-yearly-calendar',mecFluentYearlyCalendar);jQuery(document).on('click',mecFluentOutsideEvent);jQuery(document).on('click','.mec-fluent-more-views-icon',mecFluentMoreViewsContent);jQuery(document).on('change','.mec-fluent-wrap .mec-filter-content select, .mec-fluent-wrap .mec-filter-content input',mecFluentSmartFilterIcon);mecFluentTimeTableUI();mecFluentUI();mecFluentNiceSelect();mecFluentWrapperFullScreenWidth();jQuery(window).on('load',mecFluentWrapperFullScreenWidth);jQuery(window).on('load',mecFluentCurrentTimePosition);jQuery(window).on('resize',mecFluentWrapperFullScreenWidth);jQuery(window).on('resize',mecFluentTimeTableUI);mecFluentSliderUI();mecFluentFullCalendar();jQuery(window).on('resize',mecFluentFullCalendar);mecFluentCustomScrollbar();});function mecFluentSinglePage(){if(jQuery().niceScroll){jQuery('.mec-single-fluent-body .featherlight .mec-single-fluent-wrap').niceScroll({horizrailenabled:false,cursorcolor:'#C1C5C9',cursorwidth:'4px',cursorborderradius:'4px',cursorborder:'none',railoffset:{left:10,}});}}
function mecFluentFullCalendar(){if(jQuery('.mec-fluent-wrap.mec-skin-full-calendar-container').length>0){var widowWidth=jQuery(window).innerWidth();if(widowWidth<=767){jQuery('.mec-fluent-wrap.mec-skin-full-calendar-container .mec-skin-monthly-view-month-navigator-container, .mec-fluent-wrap.mec-skin-full-calendar-container .mec-calendar-a-month, .mec-fluent-wrap.mec-skin-full-calendar-container .mec-yearly-title-sec').css({paddingTop:jQuery('.mec-fluent-wrap.mec-skin-full-calendar-container').children('.mec-totalcal-box').height()+40,});}else{jQuery('.mec-fluent-wrap.mec-skin-full-calendar-container .mec-skin-monthly-view-month-navigator-container, .mec-fluent-wrap.mec-skin-full-calendar-container .mec-calendar-a-month, .mec-fluent-wrap.mec-skin-full-calendar-container .mec-yearly-title-sec').css({paddingTop:32,});}}}
function mecFluentSmartFilterIcon(){var filterContent=jQuery(this).closest('.mec-filter-content');var hasValue=false;if(jQuery(this).closest('.mec-date-search').length>0){var yearValue=jQuery(this).closest('.mec-date-search').find('select[id*="mec_sf_year"]').val();var monthValue=jQuery(this).closest('.mec-date-search').find('select[id*="mec_sf_month"]').val();if((yearValue=='none'&&monthValue=='none')||(yearValue!='none'&&monthValue!='none')){filterContent.hide();if((yearValue!='none'&&monthValue!='none')){hasValue=true;}else{hasValue=false;}}else{return false;}}else{filterContent.hide();}
if(!hasValue){filterContent.find(':not(.mec-date-search)').find('select, input:not([type="hidden"])').each(function(){if(jQuery(this).val()){hasValue=true;return false;}});}
if(hasValue){jQuery(this).closest('.mec-search-form').find('.mec-filter-icon').addClass('active');}else{jQuery(this).closest('.mec-search-form').find('.mec-filter-icon').removeClass('active');}}
function mecFluentMoreViewsContent(){jQuery(this).siblings('.mec-fluent-more-views-content').toggleClass('active');}
function mecFluentWrapperFullScreenWidth(){if(jQuery('.mec-fluent-bg-wrap').length>0){jQuery('.mec-fluent-bg-wrap').css({maxWidth:jQuery('body').width()+8,});}}
function mecFluentUI(){if(typeof mecdata.enableSingleFluent!='undefined'&&mecdata.enableSingleFluent){jQuery('body').addClass('mec-single-fluent-body');}
jQuery(window).on('load resize',function(){if(jQuery('.mec-filter-content').length>0){jQuery('.mec-filter-content').css({right:-(jQuery('.mec-calendar').width()-jQuery('.mec-search-form.mec-totalcal-box').position().left-jQuery('.mec-search-form.mec-totalcal-box').width()+40),left:-jQuery('.mec-search-form.mec-totalcal-box').position().left+40,});}
if(jQuery('.mec-filter-icon').is(':visible')){var filterIconLeftPosition=parseInt(jQuery('.mec-search-form.mec-totalcal-box').position().left)+parseInt(jQuery('.mec-filter-icon').position().left)-25;jQuery('head').find('style[title="mecFluentFilterContentStyle"]').remove().end().append('<style title="mecFluentFilterContentStyle">.mec-fluent-wrap .mec-filter-content:before{left: '+filterIconLeftPosition+'px;}.mec-fluent-wrap .mec-filter-content:after{left: '+(filterIconLeftPosition+1)+'px;}</style>');}});if(jQuery('.mec-filter-content').is(':empty')){jQuery('.mec-filter-icon').hide();}
jQuery(document).on('click','.mec-event-share-icon',function(e){e.preventDefault();});}
function mecFluentCurrentTimePosition(){if(jQuery('.mec-fluent-wrap').length>0){jQuery('.mec-fluent-current-time').each(function(){var currentTimeMinutes=jQuery(this).data('time');var height=jQuery(this).closest('.mec-fluent-current-time-cell').height();jQuery(this).css({top:(currentTimeMinutes/60)*height,});});}}
function mecFluentNiceSelect(){if(jQuery('.mec-fluent-wrap').length<0){return;}
if(jQuery().niceSelect){jQuery('.mec-fluent-wrap').find('.mec-filter-content').find('select').niceSelect();}}
function mecFluentCustomScrollbar(y){if(jQuery('.mec-fluent-wrap').length<0){return;}
if(jQuery().niceScroll){jQuery('.mec-custom-scrollbar').niceScroll({cursorcolor:'#C7EBFB',cursorwidth:'4px',cursorborderradius:'4px',cursorborder:'none',railoffset:{left:-2,}});jQuery('.mec-custom-scrollbar').getNiceScroll().resize();jQuery('.mec-custom-scrollbar').each(function(){if(jQuery(this).find('.mec-fluent-current-time-cell').length>0){var parentTopOffset=jQuery(this).offset().top;var currentTimeCellOffset=jQuery(this).find('.mec-fluent-current-time-cell').offset().top;jQuery(this).getNiceScroll(0).doScrollTop(currentTimeCellOffset-parentTopOffset-16,120);jQuery(this).on('scroll',function(){if(jQuery(this).getNiceScroll(0).scroll.y!=0){jQuery(this).addClass('mec-scrolling');}else{jQuery(this).removeClass('mec-scrolling');}});}
if(typeof y!='undefined'){if(jQuery(this).closest('.mec-skin-list-wrap').length>0||jQuery(this).closest('.mec-skin-grid-wrap').length>0){jQuery(this).getNiceScroll(0).doScrollTop(0,120);}}});}}
function mecFluentTimeTableUI(){jQuery('.mec-fluent-wrap.mec-timetable-wrap .mec-cell').css('min-height',0);var maxHeight=Math.max.apply(null,jQuery('.mec-fluent-wrap.mec-timetable-wrap .mec-cell').map(function(){return jQuery(this).height();}).get());maxHeight=maxHeight>87?maxHeight:87;jQuery('.mec-fluent-wrap.mec-timetable-wrap .mec-cell').css('min-height',maxHeight+2);}
function mecFluentSliderUI(){jQuery(window).on('load',function(){jQuery('.mec-fluent-wrap.mec-skin-slider-container .owl-next').prepend('<span>Next</span>');jQuery('.mec-fluent-wrap.mec-skin-slider-container .owl-prev').append('<span>Prev</span>');});}
function mecFluentToggleFilterContent(e){e.preventDefault();if(jQuery('.mec-filter-content').is(':visible')){jQuery('.mec-filter-content').css({display:'none',});}else{const displayValue=jQuery(window).width()<=790?'block':'flex';jQuery('.mec-filter-content').css({display:displayValue,});}}
function mecFluentToggoleDisplayValueFilterContent(){const displayValue=jQuery(window).width()<=767?'block':'flex';if(jQuery('.mec-filter-content').is(':visible')){jQuery('.mec-filter-content').css({display:displayValue,});}}
function mecFluentToggleMoreEvents(e){e.preventDefault();const moreEventsWrap=jQuery(this).siblings('.mec-more-events-wrap');const moreEvents=moreEventsWrap.children('.mec-more-events');jQuery('.mec-more-events-wrap').removeClass('active');moreEventsWrap.addClass('active');jQuery('.mec-more-events-wrap:not(.active)').hide();if(moreEventsWrap.is(':visible')){moreEventsWrap.hide();}else{topElement=moreEventsWrap.closest('.mec-more-events-inner-controller').length>0?moreEventsWrap.closest('.mec-more-events-inner-controller'):moreEventsWrap.closest('.mec-more-events-controller');moreEventsWrap.show().css({top:topElement.offset().top-window.scrollY,left:moreEventsWrap.closest('.mec-more-events-controller').offset().left,width:moreEventsWrap.closest('.mec-more-events-controller').width(),});if(moreEventsWrap.width()>400){moreEvents.css({left:(moreEventsWrap.width()/2)-(moreEvents.width()/2),width:400,});}else{moreEvents.css({width:moreEventsWrap.width(),left:0,});}}}
function mecFluentOutsideEvent(e){if(!jQuery(e.target).is('.mec-more-events-icon')&&!jQuery(e.target).closest('.mec-more-events-wrap').length){jQuery('.mec-more-events-wrap').hide();}
if(!jQuery(e.target).is('.mec-filter-icon')&&!jQuery(e.target).closest('.mec-filter-content').length){jQuery('.mec-filter-content').hide();}
if(!jQuery(e.target).is('.mec-fluent-more-views-icon')&&!jQuery(e.target).closest('.mec-fluent-more-views-content').length){jQuery('.mec-fluent-more-views-content').removeClass('active');}}
function mecFluentYearlyCalendar(){const monthNum=jQuery(this).data('month');const monthName=jQuery(this).find('.mec-calendar-table-title').text();jQuery('.mec-fluent-wrap').find('.mec-yearly-calendar').removeClass('active');jQuery(this).addClass('active').closest('.mec-year-container').find('.mec-yearly-agenda-sec-title span').text(monthName).end().find('.mec-events-agenda').addClass('mec-util-hidden').end().find('.mec-events-agenda[data-month='+monthNum+']').removeClass('mec-util-hidden');mecFluentCustomScrollbar();}
function mecFluentYearlyUI(eventID,yearID){var fluentWrap=jQuery('#mec_skin_'+eventID+'.mec-fluent-wrap');if(fluentWrap.length<0){return;}
var monthNum=fluentWrap.find('.mec-year-container[data-year-id='+yearID+']').find('.mec-events-agenda:not(.mec-util-hidden)').data('month');var activeMonth=fluentWrap.find('.mec-year-container[data-year-id='+yearID+']').find('.mec-yearly-calendar[data-month='+monthNum+']');var activeMonthName=activeMonth.find('.mec-calendar-table-title').text();activeMonth.addClass('active');}
(function($){$.fn.mecListViewFluent=function(options){var active_month;var active_year;var settings=$.extend({today:null,id:0,events_label:'Events',event_label:'Event',month_navigator:0,atts:'',active_month:{},next_month:{},sf:{},ajax_url:'',},options);mecFluentCustomScrollbar();initLoadMore('#mec_list_view_month_'+settings.id+'_'+settings.month_id);function initLoadMore(monthID){$(monthID).off().on('click','.mec-load-more-button',function(){loadMore(this);});}
function loadMore(This){var currentLoadMore=$(This);currentLoadMore.addClass("mec-load-more-loading");var endDate=currentLoadMore.data('end-date');var maximumDate=currentLoadMore.data('maximum-date');var nextOffset=currentLoadMore.data('next-offset');var year=currentLoadMore.data('year');var month=currentLoadMore.data('month');$.ajax({url:settings.ajax_url,data:"action=mec_list_load_more&mec_year="+year+"&mec_month="+month+"&mec_maximum_date="+maximumDate+"&mec_start_date="+endDate+"&mec_offset="+nextOffset+"&"+settings.atts+"&current_month_divider=0&apply_sf_date=0",dataType:"json",type:"post",success:function(response){currentLoadMore.parent().remove();if(response.count!='0'){$('#mec_list_view_month_'+settings.id+'_'+response.current_month.id).append(response.month);if(settings.sed_method!='0'){sed();}
mecFluentCustomScrollbar();initLoadMore('#mec_list_view_month_'+settings.id+'_'+response.current_month.id);}},error:function(){}});}
if(settings.month_navigator)initMonthNavigator();setMonth(settings.next_month.year,settings.next_month.month,true);var initMonth;var initYear;active_month=initMonth=settings.active_month.month;active_year=initYear=settings.active_month.year;if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search(active_year,active_month);}});}
if(settings.sed_method!='0'){sed();}
function initMonthNavigator(){$("#mec_skin_"+settings.id+" .mec-load-month").off().on("click",function(){var year=$(this).data("mec-year");var month=$(this).data("mec-month");setMonth(year,month,false,true);});}
function parseQuery(queryString){var query={};var pairs=(queryString[0]==='?'?queryString.substr(1):queryString).split('&');for(var i=0;i<pairs.length;i++){var pair=pairs[i].split('=');query[decodeURIComponent(pair[0])]=decodeURIComponent(pair[1]||'');}
return query;}
function updateQueryStringParameter(uri,key,val){return uri.replace(RegExp("([?&]"+key+"(?=[=&#]|$)[^#&]*|(?=#|$))"),"&"+key+"="+encodeURIComponent(val)).replace(/^([^?&]+)&/,"$1?");}
function search(year,month){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');var ObjAtts=parseQuery(settings.atts);if(!(ObjAtts['sf[month']||ObjAtts['sf[year]'])){settings.atts=updateQueryStringParameter(settings.atts.trim(),'sf[year]',initYear);settings.atts=updateQueryStringParameter(settings.atts.trim(),'sf[month]',initMonth);}
$.ajax({url:settings.ajax_url,data:"action=mec_list_load_month&mec_year="+year+"&mec_month="+month+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){active_month=response.current_month.month;active_year=response.current_month.year;$("#mec_skin_events_"+settings.id).html('<div class="mec-month-container" id="mec_list_view_month_'+settings.id+'_'+response.current_month.id+'" data-month-id="'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-list-view-month-navigator-container").html('<div class="mec-month-navigator" id="mec_month_navigator_'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');initMonthNavigator();toggleMonth(response.current_month.id);initLoadMore('#mec_list_view_month_'+settings.id+'_'+response.current_month.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");mecFluentCustomScrollbar();},error:function(){}});}
function setMonth(year,month,do_in_background,navigator_click){if(typeof do_in_background==="undefined")do_in_background=false;navigator_click=navigator_click||false;var month_id=year+""+month;if(!do_in_background){active_month=month;active_year=year;}
if($("#mec_list_view_month_"+settings.id+"_"+month_id).length){toggleMonth(month_id);mecFluentCustomScrollbar(0);}else{if(!do_in_background){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');}
$.ajax({url:settings.ajax_url,data:"action=mec_list_load_month&mec_year="+year+"&mec_month="+month+"&"+settings.atts+"&apply_sf_date=0"+"&navigator_click="+navigator_click,dataType:"json",type:"post",success:function(response){$("#mec_skin_events_"+settings.id).append('<div class="mec-month-container" id="mec_list_view_month_'+settings.id+'_'+response.current_month.id+'" data-month-id="'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-list-view-month-navigator-container").append('<div class="mec-month-navigator" id="mec_month_navigator_'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');initMonthNavigator();initLoadMore('#mec_list_view_month_'+settings.id+'_'+response.current_month.id);if(!do_in_background){toggleMonth(response.current_month.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_sf_month_"+settings.id).val(month);$("#mec_sf_year_"+settings.id).val(year);}else{$("#mec_list_view_month_"+settings.id+"_"+response.current_month.id).hide();$("#mec_month_navigator_"+settings.id+"_"+response.current_month.id).hide();}
if(typeof custom_month!==undefined)var custom_month;if(typeof custom_month!=undefined){if(custom_month=='true'){$(".mec-month-container .mec-calendar-day").removeClass('mec-has-event');$(".mec-month-container .mec-calendar-day").removeClass('mec-selected-day');$('.mec-calendar-day').unbind('click');}}
if(!do_in_background){mecFluentCustomScrollbar(0);}},error:function(){}});}}
function toggleMonth(month_id){var active_month=$("#mec_skin_"+settings.id+" .mec-month-container-selected").data("month-id");var active_day=$("#mec_list_view_month_"+settings.id+"_"+active_month+" .mec-selected-day").data("day");if(active_day<=9)active_day="0"+active_day;$("#mec_skin_"+settings.id+" .mec-month-navigator").hide();$("#mec_month_navigator_"+settings.id+"_"+month_id).show();$("#mec_skin_"+settings.id+" .mec-month-container").hide();$("#mec_list_view_month_"+settings.id+"_"+month_id).show();$("#mec_skin_"+settings.id+" .mec-month-container").removeClass("mec-month-container-selected");$("#mec_list_view_month_"+settings.id+"_"+month_id).addClass("mec-month-container-selected");}
var sf;function sed(){$(".mec-skin-list-wrap#mec_skin_"+settings.id).off('click').on('click','[data-event-id]',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}};}(jQuery));(function($){$.fn.mecGridViewFluent=function(options){var active_month;var active_year;var settings=$.extend({today:null,id:0,events_label:'Events',event_label:'Event',month_navigator:0,atts:'',active_month:{},next_month:{},sf:{},ajax_url:'',},options);initLoadMore('#mec_grid_view_month_'+settings.id+'_'+settings.month_id);function initLoadMore(monthID){$(monthID).off().on('click','.mec-load-more-button',function(){loadMore(this);});}
function loadMore(This){var currentLoadMore=$(This);currentLoadMore.addClass("mec-load-more-loading");var endDate=currentLoadMore.data('end-date');var maximumDate=currentLoadMore.data('maximum-date');var nextOffset=currentLoadMore.data('next-offset');var year=currentLoadMore.data('year');var month=currentLoadMore.data('month');$.ajax({url:settings.ajax_url,data:"action=mec_grid_load_more&mec_year="+year+"&mec_month="+month+"&mec_maximum_date="+maximumDate+"&mec_start_date="+endDate+"&mec_offset="+nextOffset+"&"+settings.atts+"&current_month_divider=0&apply_sf_date=0",dataType:"json",type:"post",success:function(response){currentLoadMore.parent().remove();if(response.count!='0'){$('#mec_grid_view_month_'+settings.id+'_'+response.current_month.id).append(response.month);if(settings.sed_method!='0'){sed();}
mecFluentCustomScrollbar();initLoadMore('#mec_grid_view_month_'+settings.id+'_'+response.current_month.id);}},error:function(){}});}
if(settings.month_navigator)initMonthNavigator();setMonth(settings.next_month.year,settings.next_month.month,true);var initMonth;var initYear;active_month=initMonth=settings.active_month.month;active_year=initYear=settings.active_month.year;if(settings.sf.container!==''){sf=$(settings.sf.container).mecSearchForm({id:settings.id,atts:settings.atts,callback:function(atts){settings.atts=atts;search(active_year,active_month);}});}
if(settings.sed_method!='0'){sed();}
function initMonthNavigator(){$("#mec_skin_"+settings.id+" .mec-load-month").off().on("click",function(){var year=$(this).data("mec-year");var month=$(this).data("mec-month");setMonth(year,month,false,true);});}
function parseQuery(queryString){var query={};var pairs=(queryString[0]==='?'?queryString.substr(1):queryString).split('&');for(var i=0;i<pairs.length;i++){var pair=pairs[i].split('=');query[decodeURIComponent(pair[0])]=decodeURIComponent(pair[1]||'');}
return query;}
function updateQueryStringParameter(uri,key,val){return uri.replace(RegExp("([?&]"+key+"(?=[=&#]|$)[^#&]*|(?=#|$))"),"&"+key+"="+encodeURIComponent(val)).replace(/^([^?&]+)&/,"$1?");}
function search(year,month){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');var ObjAtts=parseQuery(settings.atts);if(!(ObjAtts['sf[month']||ObjAtts['sf[year]'])){settings.atts=updateQueryStringParameter(settings.atts.trim(),'sf[year]',initYear);settings.atts=updateQueryStringParameter(settings.atts.trim(),'sf[month]',initMonth);}
$.ajax({url:settings.ajax_url,data:"action=mec_grid_load_month&mec_year="+year+"&mec_month="+month+"&"+settings.atts+"&apply_sf_date=1",dataType:"json",type:"post",success:function(response){active_month=response.current_month.month;active_year=response.current_month.year;$("#mec_skin_events_"+settings.id).html('<div class="mec-month-container" id="mec_grid_view_month_'+settings.id+'_'+response.current_month.id+'" data-month-id="'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-grid-view-month-navigator-container").html('<div class="mec-month-navigator" id="mec_month_navigator_'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');initMonthNavigator();toggleMonth(response.current_month.id);initLoadMore('#mec_grid_view_month_'+settings.id+'_'+response.current_month.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");mecFluentCustomScrollbar();},error:function(){}});}
function setMonth(year,month,do_in_background,navigator_click){if(typeof do_in_background==="undefined")do_in_background=false;navigator_click=navigator_click||false;var month_id=year+""+month;if(!do_in_background){active_month=month;active_year=year;}
if($("#mec_grid_view_month_"+settings.id+"_"+month_id).length){toggleMonth(month_id);mecFluentCustomScrollbar();}else{if(!do_in_background){if(jQuery('.mec-modal-result').length===0)jQuery('.mec-wrap').append('<div class="mec-modal-result"></div>');jQuery('.mec-modal-result').addClass('mec-month-navigator-loading');}
$.ajax({url:settings.ajax_url,data:"action=mec_grid_load_month&mec_year="+year+"&mec_month="+month+"&"+settings.atts+"&apply_sf_date=0"+"&navigator_click="+navigator_click,dataType:"json",type:"post",success:function(response){$("#mec_skin_events_"+settings.id).append('<div class="mec-month-container" id="mec_grid_view_month_'+settings.id+'_'+response.current_month.id+'" data-month-id="'+response.current_month.id+'">'+response.month+'</div>');$("#mec_skin_"+settings.id+" .mec-skin-grid-view-month-navigator-container").append('<div class="mec-month-navigator" id="mec_month_navigator_'+settings.id+'_'+response.current_month.id+'">'+response.navigator+'</div>');initMonthNavigator();initLoadMore('#mec_grid_view_month_'+settings.id+'_'+response.current_month.id);if(!do_in_background){toggleMonth(response.current_month.id);$('.mec-modal-result').removeClass("mec-month-navigator-loading");$("#mec_sf_month_"+settings.id).val(month);$("#mec_sf_year_"+settings.id).val(year);}else{$("#mec_grid_view_month_"+settings.id+"_"+response.current_month.id).hide();$("#mec_month_navigator_"+settings.id+"_"+response.current_month.id).hide();}
if(typeof custom_month!==undefined)var custom_month;if(typeof custom_month!=undefined){if(custom_month=='true'){$(".mec-month-container .mec-calendar-day").removeClass('mec-has-event');$(".mec-month-container .mec-calendar-day").removeClass('mec-selected-day');$('.mec-calendar-day').unbind('click');}}
if(!do_in_background){mecFluentCustomScrollbar();}},error:function(){}});}}
function toggleMonth(month_id){var active_month=$("#mec_skin_"+settings.id+" .mec-month-container-selected").data("month-id");var active_day=$("#mec_grid_view_month_"+settings.id+"_"+active_month+" .mec-selected-day").data("day");if(active_day<=9)active_day="0"+active_day;$("#mec_skin_"+settings.id+" .mec-month-navigator").hide();$("#mec_month_navigator_"+settings.id+"_"+month_id).show();$("#mec_skin_"+settings.id+" .mec-month-container").hide();$("#mec_grid_view_month_"+settings.id+"_"+month_id).show();$("#mec_skin_"+settings.id+" .mec-month-container").removeClass("mec-month-container-selected");$("#mec_grid_view_month_"+settings.id+"_"+month_id).addClass("mec-month-container-selected");}
var sf;function sed(){$(".mec-skin-grid-wrap#mec_skin_"+settings.id).off('click').on('click','[data-event-id]',function(e){e.preventDefault();var href=$(this).attr('href');var id=$(this).data('event-id');var occurrence=get_parameter_by_name('occurrence',href);mecSingleEventDisplayer.getSinglePage(id,occurrence,settings.ajax_url,settings.sed_method,settings.image_popup);});}};}(jQuery));
/*! tooltipster v4.2.6 */
!function(a,b){"function"==typeof define&&define.amd?define(["jquery"],function(a){return b(a)}):"object"==typeof exports?module.exports=b(require("jquery")):b(jQuery)}(this,function(a){function b(a){this.$container,this.constraints=null,this.__$tooltip,this.__init(a)}function c(b,c){var d=!0;return a.each(b,function(a,e){return void 0===c[a]||b[a]!==c[a]?(d=!1,!1):void 0}),d}function d(b){var c=b.attr("id"),d=c?h.window.document.getElementById(c):null;return d?d===b[0]:a.contains(h.window.document.body,b[0])}function e(){if(!g)return!1;var a=g.document.body||g.document.documentElement,b=a.style,c="transition",d=["Moz","Webkit","Khtml","O","ms"];if("string"==typeof b[c])return!0;c=c.charAt(0).toUpperCase()+c.substr(1);for(var e=0;e<d.length;e++)if("string"==typeof b[d[e]+c])return!0;return!1}var f={animation:"fade",animationDuration:350,content:null,contentAsHTML:!1,contentCloning:!1,debug:!0,delay:300,delayTouch:[300,500],functionInit:null,functionBefore:null,functionReady:null,functionAfter:null,functionFormat:null,IEmin:6,interactive:!1,multiple:!1,parent:null,plugins:["sideTip"],repositionOnScroll:!1,restoration:"none",selfDestruction:!0,theme:[],timer:0,trackerInterval:500,trackOrigin:!1,trackTooltip:!1,trigger:"hover",triggerClose:{click:!1,mouseleave:!1,originClick:!1,scroll:!1,tap:!1,touchleave:!1},triggerOpen:{click:!1,mouseenter:!1,tap:!1,touchstart:!1},updateAnimation:"rotate",zIndex:9999999},g="undefined"!=typeof window?window:null,h={hasTouchCapability:!(!g||!("ontouchstart"in g||g.DocumentTouch&&g.document instanceof g.DocumentTouch||g.navigator.maxTouchPoints)),hasTransitions:e(),IE:!1,semVer:"4.2.6",window:g},i=function(){this.__$emitterPrivate=a({}),this.__$emitterPublic=a({}),this.__instancesLatestArr=[],this.__plugins={},this._env=h};i.prototype={__bridge:function(b,c,d){if(!c[d]){var e=function(){};e.prototype=b;var g=new e;g.__init&&g.__init(c),a.each(b,function(a,b){0!=a.indexOf("__")&&(c[a]?f.debug&&console.log("The "+a+" method of the "+d+" plugin conflicts with another plugin or native methods"):(c[a]=function(){return g[a].apply(g,Array.prototype.slice.apply(arguments))},c[a].bridged=g))}),c[d]=g}return this},__setWindow:function(a){return h.window=a,this},_getRuler:function(a){return new b(a)},_off:function(){return this.__$emitterPrivate.off.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_on:function(){return this.__$emitterPrivate.on.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_one:function(){return this.__$emitterPrivate.one.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_plugin:function(b){var c=this;if("string"==typeof b){var d=b,e=null;return d.indexOf(".")>0?e=c.__plugins[d]:a.each(c.__plugins,function(a,b){return b.name.substring(b.name.length-d.length-1)=="."+d?(e=b,!1):void 0}),e}if(b.name.indexOf(".")<0)throw new Error("Plugins must be namespaced");return c.__plugins[b.name]=b,b.core&&c.__bridge(b.core,c,b.name),this},_trigger:function(){var a=Array.prototype.slice.apply(arguments);return"string"==typeof a[0]&&(a[0]={type:a[0]}),this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate,a),this.__$emitterPublic.trigger.apply(this.__$emitterPublic,a),this},instances:function(b){var c=[],d=b||".tooltipstered";return a(d).each(function(){var b=a(this),d=b.data("tooltipster-ns");d&&a.each(d,function(a,d){c.push(b.data(d))})}),c},instancesLatest:function(){return this.__instancesLatestArr},off:function(){return this.__$emitterPublic.off.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},on:function(){return this.__$emitterPublic.on.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},one:function(){return this.__$emitterPublic.one.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},origins:function(b){var c=b?b+" ":"";return a(c+".tooltipstered").toArray()},setDefaults:function(b){return a.extend(f,b),this},triggerHandler:function(){return this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this}},a.tooltipster=new i,a.Tooltipster=function(b,c){this.__callbacks={close:[],open:[]},this.__closingTime,this.__Content,this.__contentBcr,this.__destroyed=!1,this.__$emitterPrivate=a({}),this.__$emitterPublic=a({}),this.__enabled=!0,this.__garbageCollector,this.__Geometry,this.__lastPosition,this.__namespace="tooltipster-"+Math.round(1e6*Math.random()),this.__options,this.__$originParents,this.__pointerIsOverOrigin=!1,this.__previousThemes=[],this.__state="closed",this.__timeouts={close:[],open:null},this.__touchEvents=[],this.__tracker=null,this._$origin,this._$tooltip,this.__init(b,c)},a.Tooltipster.prototype={__init:function(b,c){var d=this;if(d._$origin=a(b),d.__options=a.extend(!0,{},f,c),d.__optionsFormat(),!h.IE||h.IE>=d.__options.IEmin){var e=null;if(void 0===d._$origin.data("tooltipster-initialTitle")&&(e=d._$origin.attr("title"),void 0===e&&(e=null),d._$origin.data("tooltipster-initialTitle",e)),null!==d.__options.content)d.__contentSet(d.__options.content);else{var g,i=d._$origin.attr("data-tooltip-content");i&&(g=a(i)),g&&g[0]?d.__contentSet(g.first()):d.__contentSet(e)}d._$origin.removeAttr("title").addClass("tooltipstered"),d.__prepareOrigin(),d.__prepareGC(),a.each(d.__options.plugins,function(a,b){d._plug(b)}),h.hasTouchCapability&&a(h.window.document.body).on("touchmove."+d.__namespace+"-triggerOpen",function(a){d._touchRecordEvent(a)}),d._on("created",function(){d.__prepareTooltip()})._on("repositioned",function(a){d.__lastPosition=a.position})}else d.__options.disabled=!0},__contentInsert:function(){var a=this,b=a._$tooltip.find(".tooltipster-content"),c=a.__Content,d=function(a){c=a};return a._trigger({type:"format",content:a.__Content,format:d}),a.__options.functionFormat&&(c=a.__options.functionFormat.call(a,a,{origin:a._$origin[0]},a.__Content)),"string"!=typeof c||a.__options.contentAsHTML?b.empty().append(c):b.text(c),a},__contentSet:function(b){return b instanceof a&&this.__options.contentCloning&&(b=b.clone(!0)),this.__Content=b,this._trigger({type:"updated",content:b}),this},__destroyError:function(){throw new Error("This tooltip has been destroyed and cannot execute your method call.")},__geometry:function(){var b=this,c=b._$origin,d=b._$origin.is("area");if(d){var e=b._$origin.parent().attr("name");c=a('img[usemap="#'+e+'"]')}var f=c[0].getBoundingClientRect(),g=a(h.window.document),i=a(h.window),j=c,k={available:{document:null,window:null},document:{size:{height:g.height(),width:g.width()}},window:{scroll:{left:h.window.scrollX||h.window.document.documentElement.scrollLeft,top:h.window.scrollY||h.window.document.documentElement.scrollTop},size:{height:i.height(),width:i.width()}},origin:{fixedLineage:!1,offset:{},size:{height:f.bottom-f.top,width:f.right-f.left},usemapImage:d?c[0]:null,windowOffset:{bottom:f.bottom,left:f.left,right:f.right,top:f.top}}};if(d){var l=b._$origin.attr("shape"),m=b._$origin.attr("coords");if(m&&(m=m.split(","),a.map(m,function(a,b){m[b]=parseInt(a)})),"default"!=l)switch(l){case"circle":var n=m[0],o=m[1],p=m[2],q=o-p,r=n-p;k.origin.size.height=2*p,k.origin.size.width=k.origin.size.height,k.origin.windowOffset.left+=r,k.origin.windowOffset.top+=q;break;case"rect":var s=m[0],t=m[1],u=m[2],v=m[3];k.origin.size.height=v-t,k.origin.size.width=u-s,k.origin.windowOffset.left+=s,k.origin.windowOffset.top+=t;break;case"poly":for(var w=0,x=0,y=0,z=0,A="even",B=0;B<m.length;B++){var C=m[B];"even"==A?(C>y&&(y=C,0===B&&(w=y)),w>C&&(w=C),A="odd"):(C>z&&(z=C,1==B&&(x=z)),x>C&&(x=C),A="even")}k.origin.size.height=z-x,k.origin.size.width=y-w,k.origin.windowOffset.left+=w,k.origin.windowOffset.top+=x}}var D=function(a){k.origin.size.height=a.height,k.origin.windowOffset.left=a.left,k.origin.windowOffset.top=a.top,k.origin.size.width=a.width};for(b._trigger({type:"geometry",edit:D,geometry:{height:k.origin.size.height,left:k.origin.windowOffset.left,top:k.origin.windowOffset.top,width:k.origin.size.width}}),k.origin.windowOffset.right=k.origin.windowOffset.left+k.origin.size.width,k.origin.windowOffset.bottom=k.origin.windowOffset.top+k.origin.size.height,k.origin.offset.left=k.origin.windowOffset.left+k.window.scroll.left,k.origin.offset.top=k.origin.windowOffset.top+k.window.scroll.top,k.origin.offset.bottom=k.origin.offset.top+k.origin.size.height,k.origin.offset.right=k.origin.offset.left+k.origin.size.width,k.available.document={bottom:{height:k.document.size.height-k.origin.offset.bottom,width:k.document.size.width},left:{height:k.document.size.height,width:k.origin.offset.left},right:{height:k.document.size.height,width:k.document.size.width-k.origin.offset.right},top:{height:k.origin.offset.top,width:k.document.size.width}},k.available.window={bottom:{height:Math.max(k.window.size.height-Math.max(k.origin.windowOffset.bottom,0),0),width:k.window.size.width},left:{height:k.window.size.height,width:Math.max(k.origin.windowOffset.left,0)},right:{height:k.window.size.height,width:Math.max(k.window.size.width-Math.max(k.origin.windowOffset.right,0),0)},top:{height:Math.max(k.origin.windowOffset.top,0),width:k.window.size.width}};"html"!=j[0].tagName.toLowerCase();){if("fixed"==j.css("position")){k.origin.fixedLineage=!0;break}j=j.parent()}return k},__optionsFormat:function(){return"number"==typeof this.__options.animationDuration&&(this.__options.animationDuration=[this.__options.animationDuration,this.__options.animationDuration]),"number"==typeof this.__options.delay&&(this.__options.delay=[this.__options.delay,this.__options.delay]),"number"==typeof this.__options.delayTouch&&(this.__options.delayTouch=[this.__options.delayTouch,this.__options.delayTouch]),"string"==typeof this.__options.theme&&(this.__options.theme=[this.__options.theme]),null===this.__options.parent?this.__options.parent=a(h.window.document.body):"string"==typeof this.__options.parent&&(this.__options.parent=a(this.__options.parent)),"hover"==this.__options.trigger?(this.__options.triggerOpen={mouseenter:!0,touchstart:!0},this.__options.triggerClose={mouseleave:!0,originClick:!0,touchleave:!0}):"click"==this.__options.trigger&&(this.__options.triggerOpen={click:!0,tap:!0},this.__options.triggerClose={click:!0,tap:!0}),this._trigger("options"),this},__prepareGC:function(){var b=this;return b.__options.selfDestruction?b.__garbageCollector=setInterval(function(){var c=(new Date).getTime();b.__touchEvents=a.grep(b.__touchEvents,function(a,b){return c-a.time>6e4}),d(b._$origin)||b.close(function(){b.destroy()})},2e4):clearInterval(b.__garbageCollector),b},__prepareOrigin:function(){var a=this;if(a._$origin.off("."+a.__namespace+"-triggerOpen"),h.hasTouchCapability&&a._$origin.on("touchstart."+a.__namespace+"-triggerOpen touchend."+a.__namespace+"-triggerOpen touchcancel."+a.__namespace+"-triggerOpen",function(b){a._touchRecordEvent(b)}),a.__options.triggerOpen.click||a.__options.triggerOpen.tap&&h.hasTouchCapability){var b="";a.__options.triggerOpen.click&&(b+="click."+a.__namespace+"-triggerOpen "),a.__options.triggerOpen.tap&&h.hasTouchCapability&&(b+="touchend."+a.__namespace+"-triggerOpen"),a._$origin.on(b,function(b){a._touchIsMeaningfulEvent(b)&&a._open(b)})}if(a.__options.triggerOpen.mouseenter||a.__options.triggerOpen.touchstart&&h.hasTouchCapability){var b="";a.__options.triggerOpen.mouseenter&&(b+="mouseenter."+a.__namespace+"-triggerOpen "),a.__options.triggerOpen.touchstart&&h.hasTouchCapability&&(b+="touchstart."+a.__namespace+"-triggerOpen"),a._$origin.on(b,function(b){!a._touchIsTouchEvent(b)&&a._touchIsEmulatedEvent(b)||(a.__pointerIsOverOrigin=!0,a._openShortly(b))})}if(a.__options.triggerClose.mouseleave||a.__options.triggerClose.touchleave&&h.hasTouchCapability){var b="";a.__options.triggerClose.mouseleave&&(b+="mouseleave."+a.__namespace+"-triggerOpen "),a.__options.triggerClose.touchleave&&h.hasTouchCapability&&(b+="touchend."+a.__namespace+"-triggerOpen touchcancel."+a.__namespace+"-triggerOpen"),a._$origin.on(b,function(b){a._touchIsMeaningfulEvent(b)&&(a.__pointerIsOverOrigin=!1)})}return a},__prepareTooltip:function(){var b=this,c=b.__options.interactive?"auto":"";return b._$tooltip.attr("id",b.__namespace).css({"pointer-events":c,zIndex:b.__options.zIndex}),a.each(b.__previousThemes,function(a,c){b._$tooltip.removeClass(c)}),a.each(b.__options.theme,function(a,c){b._$tooltip.addClass(c)}),b.__previousThemes=a.merge([],b.__options.theme),b},__scrollHandler:function(b){var c=this;if(c.__options.triggerClose.scroll)c._close(b);else if(d(c._$origin)&&d(c._$tooltip)){var e=null;if(b.target===h.window.document)c.__Geometry.origin.fixedLineage||c.__options.repositionOnScroll&&c.reposition(b);else{e=c.__geometry();var f=!1;if("fixed"!=c._$origin.css("position")&&c.__$originParents.each(function(b,c){var d=a(c),g=d.css("overflow-x"),h=d.css("overflow-y");if("visible"!=g||"visible"!=h){var i=c.getBoundingClientRect();if("visible"!=g&&(e.origin.windowOffset.left<i.left||e.origin.windowOffset.right>i.right))return f=!0,!1;if("visible"!=h&&(e.origin.windowOffset.top<i.top||e.origin.windowOffset.bottom>i.bottom))return f=!0,!1}return"fixed"==d.css("position")?!1:void 0}),f)c._$tooltip.css("visibility","hidden");else if(c._$tooltip.css("visibility","visible"),c.__options.repositionOnScroll)c.reposition(b);else{var g=e.origin.offset.left-c.__Geometry.origin.offset.left,i=e.origin.offset.top-c.__Geometry.origin.offset.top;c._$tooltip.css({left:c.__lastPosition.coord.left+g,top:c.__lastPosition.coord.top+i})}}c._trigger({type:"scroll",event:b,geo:e})}return c},__stateSet:function(a){return this.__state=a,this._trigger({type:"state",state:a}),this},__timeoutsClear:function(){return clearTimeout(this.__timeouts.open),this.__timeouts.open=null,a.each(this.__timeouts.close,function(a,b){clearTimeout(b)}),this.__timeouts.close=[],this},__trackerStart:function(){var a=this,b=a._$tooltip.find(".tooltipster-content");return a.__options.trackTooltip&&(a.__contentBcr=b[0].getBoundingClientRect()),a.__tracker=setInterval(function(){if(d(a._$origin)&&d(a._$tooltip)){if(a.__options.trackOrigin){var e=a.__geometry(),f=!1;c(e.origin.size,a.__Geometry.origin.size)&&(a.__Geometry.origin.fixedLineage?c(e.origin.windowOffset,a.__Geometry.origin.windowOffset)&&(f=!0):c(e.origin.offset,a.__Geometry.origin.offset)&&(f=!0)),f||(a.__options.triggerClose.mouseleave?a._close():a.reposition())}if(a.__options.trackTooltip){var g=b[0].getBoundingClientRect();g.height===a.__contentBcr.height&&g.width===a.__contentBcr.width||(a.reposition(),a.__contentBcr=g)}}else a._close()},a.__options.trackerInterval),a},_close:function(b,c,d){var e=this,f=!0;if(e._trigger({type:"close",event:b,stop:function(){f=!1}}),f||d){c&&e.__callbacks.close.push(c),e.__callbacks.open=[],e.__timeoutsClear();var g=function(){a.each(e.__callbacks.close,function(a,c){c.call(e,e,{event:b,origin:e._$origin[0]})}),e.__callbacks.close=[]};if("closed"!=e.__state){var i=!0,j=new Date,k=j.getTime(),l=k+e.__options.animationDuration[1];if("disappearing"==e.__state&&l>e.__closingTime&&e.__options.animationDuration[1]>0&&(i=!1),i){e.__closingTime=l,"disappearing"!=e.__state&&e.__stateSet("disappearing");var m=function(){clearInterval(e.__tracker),e._trigger({type:"closing",event:b}),e._$tooltip.off("."+e.__namespace+"-triggerClose").removeClass("tooltipster-dying"),a(h.window).off("."+e.__namespace+"-triggerClose"),e.__$originParents.each(function(b,c){a(c).off("scroll."+e.__namespace+"-triggerClose")}),e.__$originParents=null,a(h.window.document.body).off("."+e.__namespace+"-triggerClose"),e._$origin.off("."+e.__namespace+"-triggerClose"),e._off("dismissable"),e.__stateSet("closed"),e._trigger({type:"after",event:b}),e.__options.functionAfter&&e.__options.functionAfter.call(e,e,{event:b,origin:e._$origin[0]}),g()};h.hasTransitions?(e._$tooltip.css({"-moz-animation-duration":e.__options.animationDuration[1]+"ms","-ms-animation-duration":e.__options.animationDuration[1]+"ms","-o-animation-duration":e.__options.animationDuration[1]+"ms","-webkit-animation-duration":e.__options.animationDuration[1]+"ms","animation-duration":e.__options.animationDuration[1]+"ms","transition-duration":e.__options.animationDuration[1]+"ms"}),e._$tooltip.clearQueue().removeClass("tooltipster-show").addClass("tooltipster-dying"),e.__options.animationDuration[1]>0&&e._$tooltip.delay(e.__options.animationDuration[1]),e._$tooltip.queue(m)):e._$tooltip.stop().fadeOut(e.__options.animationDuration[1],m)}}else g()}return e},_off:function(){return this.__$emitterPrivate.off.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_on:function(){return this.__$emitterPrivate.on.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_one:function(){return this.__$emitterPrivate.one.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_open:function(b,c){var e=this;if(!e.__destroying&&d(e._$origin)&&e.__enabled){var f=!0;if("closed"==e.__state&&(e._trigger({type:"before",event:b,stop:function(){f=!1}}),f&&e.__options.functionBefore&&(f=e.__options.functionBefore.call(e,e,{event:b,origin:e._$origin[0]}))),f!==!1&&null!==e.__Content){c&&e.__callbacks.open.push(c),e.__callbacks.close=[],e.__timeoutsClear();var g,i=function(){"stable"!=e.__state&&e.__stateSet("stable"),a.each(e.__callbacks.open,function(a,b){b.call(e,e,{origin:e._$origin[0],tooltip:e._$tooltip[0]})}),e.__callbacks.open=[]};if("closed"!==e.__state)g=0,"disappearing"===e.__state?(e.__stateSet("appearing"),h.hasTransitions?(e._$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-show"),e.__options.animationDuration[0]>0&&e._$tooltip.delay(e.__options.animationDuration[0]),e._$tooltip.queue(i)):e._$tooltip.stop().fadeIn(i)):"stable"==e.__state&&i();else{if(e.__stateSet("appearing"),g=e.__options.animationDuration[0],e.__contentInsert(),e.reposition(b,!0),h.hasTransitions?(e._$tooltip.addClass("tooltipster-"+e.__options.animation).addClass("tooltipster-initial").css({"-moz-animation-duration":e.__options.animationDuration[0]+"ms","-ms-animation-duration":e.__options.animationDuration[0]+"ms","-o-animation-duration":e.__options.animationDuration[0]+"ms","-webkit-animation-duration":e.__options.animationDuration[0]+"ms","animation-duration":e.__options.animationDuration[0]+"ms","transition-duration":e.__options.animationDuration[0]+"ms"}),setTimeout(function(){"closed"!=e.__state&&(e._$tooltip.addClass("tooltipster-show").removeClass("tooltipster-initial"),e.__options.animationDuration[0]>0&&e._$tooltip.delay(e.__options.animationDuration[0]),e._$tooltip.queue(i))},0)):e._$tooltip.css("display","none").fadeIn(e.__options.animationDuration[0],i),e.__trackerStart(),a(h.window).on("resize."+e.__namespace+"-triggerClose",function(b){var c=a(document.activeElement);(c.is("input")||c.is("textarea"))&&a.contains(e._$tooltip[0],c[0])||e.reposition(b)}).on("scroll."+e.__namespace+"-triggerClose",function(a){e.__scrollHandler(a)}),e.__$originParents=e._$origin.parents(),e.__$originParents.each(function(b,c){a(c).on("scroll."+e.__namespace+"-triggerClose",function(a){e.__scrollHandler(a)})}),e.__options.triggerClose.mouseleave||e.__options.triggerClose.touchleave&&h.hasTouchCapability){e._on("dismissable",function(a){a.dismissable?a.delay?(m=setTimeout(function(){e._close(a.event)},a.delay),e.__timeouts.close.push(m)):e._close(a):clearTimeout(m)});var j=e._$origin,k="",l="",m=null;e.__options.interactive&&(j=j.add(e._$tooltip)),e.__options.triggerClose.mouseleave&&(k+="mouseenter."+e.__namespace+"-triggerClose ",l+="mouseleave."+e.__namespace+"-triggerClose "),e.__options.triggerClose.touchleave&&h.hasTouchCapability&&(k+="touchstart."+e.__namespace+"-triggerClose",l+="touchend."+e.__namespace+"-triggerClose touchcancel."+e.__namespace+"-triggerClose"),j.on(l,function(a){if(e._touchIsTouchEvent(a)||!e._touchIsEmulatedEvent(a)){var b="mouseleave"==a.type?e.__options.delay:e.__options.delayTouch;e._trigger({delay:b[1],dismissable:!0,event:a,type:"dismissable"})}}).on(k,function(a){!e._touchIsTouchEvent(a)&&e._touchIsEmulatedEvent(a)||e._trigger({dismissable:!1,event:a,type:"dismissable"})})}e.__options.triggerClose.originClick&&e._$origin.on("click."+e.__namespace+"-triggerClose",function(a){e._touchIsTouchEvent(a)||e._touchIsEmulatedEvent(a)||e._close(a)}),(e.__options.triggerClose.click||e.__options.triggerClose.tap&&h.hasTouchCapability)&&setTimeout(function(){if("closed"!=e.__state){var b="",c=a(h.window.document.body);e.__options.triggerClose.click&&(b+="click."+e.__namespace+"-triggerClose "),e.__options.triggerClose.tap&&h.hasTouchCapability&&(b+="touchend."+e.__namespace+"-triggerClose"),c.on(b,function(b){e._touchIsMeaningfulEvent(b)&&(e._touchRecordEvent(b),e.__options.interactive&&a.contains(e._$tooltip[0],b.target)||e._close(b))}),e.__options.triggerClose.tap&&h.hasTouchCapability&&c.on("touchstart."+e.__namespace+"-triggerClose",function(a){e._touchRecordEvent(a)})}},0),e._trigger("ready"),e.__options.functionReady&&e.__options.functionReady.call(e,e,{origin:e._$origin[0],tooltip:e._$tooltip[0]})}if(e.__options.timer>0){var m=setTimeout(function(){e._close()},e.__options.timer+g);e.__timeouts.close.push(m)}}}return e},_openShortly:function(a){var b=this,c=!0;if("stable"!=b.__state&&"appearing"!=b.__state&&!b.__timeouts.open&&(b._trigger({type:"start",event:a,stop:function(){c=!1}}),c)){var d=0==a.type.indexOf("touch")?b.__options.delayTouch:b.__options.delay;d[0]?b.__timeouts.open=setTimeout(function(){b.__timeouts.open=null,b.__pointerIsOverOrigin&&b._touchIsMeaningfulEvent(a)?(b._trigger("startend"),b._open(a)):b._trigger("startcancel")},d[0]):(b._trigger("startend"),b._open(a))}return b},_optionsExtract:function(b,c){var d=this,e=a.extend(!0,{},c),f=d.__options[b];return f||(f={},a.each(c,function(a,b){var c=d.__options[a];void 0!==c&&(f[a]=c)})),a.each(e,function(b,c){void 0!==f[b]&&("object"!=typeof c||c instanceof Array||null==c||"object"!=typeof f[b]||f[b]instanceof Array||null==f[b]?e[b]=f[b]:a.extend(e[b],f[b]))}),e},_plug:function(b){var c=a.tooltipster._plugin(b);if(!c)throw new Error('The "'+b+'" plugin is not defined');return c.instance&&a.tooltipster.__bridge(c.instance,this,c.name),this},_touchIsEmulatedEvent:function(a){for(var b=!1,c=(new Date).getTime(),d=this.__touchEvents.length-1;d>=0;d--){var e=this.__touchEvents[d];if(!(c-e.time<500))break;e.target===a.target&&(b=!0)}return b},_touchIsMeaningfulEvent:function(a){return this._touchIsTouchEvent(a)&&!this._touchSwiped(a.target)||!this._touchIsTouchEvent(a)&&!this._touchIsEmulatedEvent(a)},_touchIsTouchEvent:function(a){return 0==a.type.indexOf("touch")},_touchRecordEvent:function(a){return this._touchIsTouchEvent(a)&&(a.time=(new Date).getTime(),this.__touchEvents.push(a)),this},_touchSwiped:function(a){for(var b=!1,c=this.__touchEvents.length-1;c>=0;c--){var d=this.__touchEvents[c];if("touchmove"==d.type){b=!0;break}if("touchstart"==d.type&&a===d.target)break}return b},_trigger:function(){var b=Array.prototype.slice.apply(arguments);return"string"==typeof b[0]&&(b[0]={type:b[0]}),b[0].instance=this,b[0].origin=this._$origin?this._$origin[0]:null,b[0].tooltip=this._$tooltip?this._$tooltip[0]:null,this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate,b),a.tooltipster._trigger.apply(a.tooltipster,b),this.__$emitterPublic.trigger.apply(this.__$emitterPublic,b),this},_unplug:function(b){var c=this;if(c[b]){var d=a.tooltipster._plugin(b);d.instance&&a.each(d.instance,function(a,d){c[a]&&c[a].bridged===c[b]&&delete c[a]}),c[b].__destroy&&c[b].__destroy(),delete c[b]}return c},close:function(a){return this.__destroyed?this.__destroyError():this._close(null,a),this},content:function(a){var b=this;if(void 0===a)return b.__Content;if(b.__destroyed)b.__destroyError();else if(b.__contentSet(a),null!==b.__Content){if("closed"!==b.__state&&(b.__contentInsert(),b.reposition(),b.__options.updateAnimation))if(h.hasTransitions){var c=b.__options.updateAnimation;b._$tooltip.addClass("tooltipster-update-"+c),setTimeout(function(){"closed"!=b.__state&&b._$tooltip.removeClass("tooltipster-update-"+c)},1e3)}else b._$tooltip.fadeTo(200,.5,function(){"closed"!=b.__state&&b._$tooltip.fadeTo(200,1)})}else b._close();return b},destroy:function(){var b=this;if(b.__destroyed)b.__destroyError();else{"closed"!=b.__state?b.option("animationDuration",0)._close(null,null,!0):b.__timeoutsClear(),b._trigger("destroy"),b.__destroyed=!0,b._$origin.removeData(b.__namespace).off("."+b.__namespace+"-triggerOpen"),a(h.window.document.body).off("."+b.__namespace+"-triggerOpen");var c=b._$origin.data("tooltipster-ns");if(c)if(1===c.length){var d=null;"previous"==b.__options.restoration?d=b._$origin.data("tooltipster-initialTitle"):"current"==b.__options.restoration&&(d="string"==typeof b.__Content?b.__Content:a("<div></div>").append(b.__Content).html()),d&&b._$origin.attr("title",d),b._$origin.removeClass("tooltipstered"),b._$origin.removeData("tooltipster-ns").removeData("tooltipster-initialTitle")}else c=a.grep(c,function(a,c){return a!==b.__namespace}),b._$origin.data("tooltipster-ns",c);b._trigger("destroyed"),b._off(),b.off(),b.__Content=null,b.__$emitterPrivate=null,b.__$emitterPublic=null,b.__options.parent=null,b._$origin=null,b._$tooltip=null,a.tooltipster.__instancesLatestArr=a.grep(a.tooltipster.__instancesLatestArr,function(a,c){return b!==a}),clearInterval(b.__garbageCollector)}return b},disable:function(){return this.__destroyed?(this.__destroyError(),this):(this._close(),this.__enabled=!1,this)},elementOrigin:function(){return this.__destroyed?void this.__destroyError():this._$origin[0]},elementTooltip:function(){return this._$tooltip?this._$tooltip[0]:null},enable:function(){return this.__enabled=!0,this},hide:function(a){return this.close(a)},instance:function(){return this},off:function(){return this.__destroyed||this.__$emitterPublic.off.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},on:function(){return this.__destroyed?this.__destroyError():this.__$emitterPublic.on.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},one:function(){return this.__destroyed?this.__destroyError():this.__$emitterPublic.one.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},open:function(a){return this.__destroyed?this.__destroyError():this._open(null,a),this},option:function(b,c){return void 0===c?this.__options[b]:(this.__destroyed?this.__destroyError():(this.__options[b]=c,this.__optionsFormat(),a.inArray(b,["trigger","triggerClose","triggerOpen"])>=0&&this.__prepareOrigin(),"selfDestruction"===b&&this.__prepareGC()),this)},reposition:function(a,b){var c=this;return c.__destroyed?c.__destroyError():"closed"!=c.__state&&d(c._$origin)&&(b||d(c._$tooltip))&&(b||c._$tooltip.detach(),c.__Geometry=c.__geometry(),c._trigger({type:"reposition",event:a,helper:{geo:c.__Geometry}})),c},show:function(a){return this.open(a)},status:function(){return{destroyed:this.__destroyed,enabled:this.__enabled,open:"closed"!==this.__state,state:this.__state}},triggerHandler:function(){return this.__destroyed?this.__destroyError():this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this}},a.fn.tooltipster=function(){var b=Array.prototype.slice.apply(arguments),c="You are using a single HTML element as content for several tooltips. You probably want to set the contentCloning option to TRUE.";if(0===this.length)return this;if("string"==typeof b[0]){var d="#*$~&";return this.each(function(){var e=a(this).data("tooltipster-ns"),f=e?a(this).data(e[0]):null;if(!f)throw new Error("You called Tooltipster's \""+b[0]+'" method on an uninitialized element');if("function"!=typeof f[b[0]])throw new Error('Unknown method "'+b[0]+'"');this.length>1&&"content"==b[0]&&(b[1]instanceof a||"object"==typeof b[1]&&null!=b[1]&&b[1].tagName)&&!f.__options.contentCloning&&f.__options.debug&&console.log(c);var g=f[b[0]](b[1],b[2]);return g!==f||"instance"===b[0]?(d=g,!1):void 0}),"#*$~&"!==d?d:this}a.tooltipster.__instancesLatestArr=[];var e=b[0]&&void 0!==b[0].multiple,g=e&&b[0].multiple||!e&&f.multiple,h=b[0]&&void 0!==b[0].content,i=h&&b[0].content||!h&&f.content,j=b[0]&&void 0!==b[0].contentCloning,k=j&&b[0].contentCloning||!j&&f.contentCloning,l=b[0]&&void 0!==b[0].debug,m=l&&b[0].debug||!l&&f.debug;return this.length>1&&(i instanceof a||"object"==typeof i&&null!=i&&i.tagName)&&!k&&m&&console.log(c),this.each(function(){var c=!1,d=a(this),e=d.data("tooltipster-ns"),f=null;e?g?c=!0:m&&(console.log("Tooltipster: one or more tooltips are already attached to the element below. Ignoring."),console.log(this)):c=!0,c&&(f=new a.Tooltipster(this,b[0]),e||(e=[]),e.push(f.__namespace),d.data("tooltipster-ns",e),d.data(f.__namespace,f),f.__options.functionInit&&f.__options.functionInit.call(f,f,{origin:this}),f._trigger("init")),a.tooltipster.__instancesLatestArr.push(f)}),this},b.prototype={__init:function(b){this.__$tooltip=b,this.__$tooltip.css({left:0,overflow:"hidden",position:"absolute",top:0}).find(".tooltipster-content").css("overflow","auto"),this.$container=a('<div class="tooltipster-ruler"></div>').append(this.__$tooltip).appendTo(h.window.document.body)},__forceRedraw:function(){var a=this.__$tooltip.parent();this.__$tooltip.detach(),this.__$tooltip.appendTo(a)},constrain:function(a,b){return this.constraints={width:a,height:b},this.__$tooltip.css({display:"block",height:"",overflow:"auto",width:a}),this},destroy:function(){this.__$tooltip.detach().find(".tooltipster-content").css({display:"",overflow:""}),this.$container.remove()},free:function(){return this.constraints=null,this.__$tooltip.css({display:"",height:"",overflow:"visible",width:""}),this},measure:function(){this.__forceRedraw();var a=this.__$tooltip[0].getBoundingClientRect(),b={size:{height:a.height||a.bottom-a.top,width:a.width||a.right-a.left}};if(this.constraints){var c=this.__$tooltip.find(".tooltipster-content"),d=this.__$tooltip.outerHeight(),e=c[0].getBoundingClientRect(),f={height:d<=this.constraints.height,width:a.width<=this.constraints.width&&e.width>=c[0].scrollWidth-1};b.fits=f.height&&f.width}return h.IE&&h.IE<=11&&b.size.width!==h.window.document.documentElement.clientWidth&&(b.size.width=Math.ceil(b.size.width)+1),b}};var j=navigator.userAgent.toLowerCase();-1!=j.indexOf("msie")?h.IE=parseInt(j.split("msie")[1]):-1!==j.toLowerCase().indexOf("trident")&&-1!==j.indexOf(" rv:11")?h.IE=11:-1!=j.toLowerCase().indexOf("edge/")&&(h.IE=parseInt(j.toLowerCase().split("edge/")[1]));var k="tooltipster.sideTip";return a.tooltipster._plugin({name:k,instance:{__defaults:function(){return{arrow:!0,distance:6,functionPosition:null,maxWidth:null,minIntersection:16,minWidth:0,position:null,side:"top",viewportAware:!0}},__init:function(a){var b=this;b.__instance=a,b.__namespace="tooltipster-sideTip-"+Math.round(1e6*Math.random()),b.__previousState="closed",b.__options,b.__optionsFormat(),b.__instance._on("state."+b.__namespace,function(a){"closed"==a.state?b.__close():"appearing"==a.state&&"closed"==b.__previousState&&b.__create(),b.__previousState=a.state}),b.__instance._on("options."+b.__namespace,function(){b.__optionsFormat()}),b.__instance._on("reposition."+b.__namespace,function(a){b.__reposition(a.event,a.helper)})},__close:function(){this.__instance.content()instanceof a&&this.__instance.content().detach(),this.__instance._$tooltip.remove(),this.__instance._$tooltip=null},__create:function(){var b=a('<div class="tooltipster-base tooltipster-sidetip"><div class="tooltipster-box"><div class="tooltipster-content"></div></div><div class="tooltipster-arrow"><div class="tooltipster-arrow-uncropped"><div class="tooltipster-arrow-border"></div><div class="tooltipster-arrow-background"></div></div></div></div>');this.__options.arrow||b.find(".tooltipster-box").css("margin",0).end().find(".tooltipster-arrow").hide(),this.__options.minWidth&&b.css("min-width",this.__options.minWidth+"px"),this.__options.maxWidth&&b.css("max-width",this.__options.maxWidth+"px"),this.__instance._$tooltip=b,this.__instance._trigger("created")},__destroy:function(){this.__instance._off("."+self.__namespace)},__optionsFormat:function(){var b=this;if(b.__options=b.__instance._optionsExtract(k,b.__defaults()),b.__options.position&&(b.__options.side=b.__options.position),"object"!=typeof b.__options.distance&&(b.__options.distance=[b.__options.distance]),b.__options.distance.length<4&&(void 0===b.__options.distance[1]&&(b.__options.distance[1]=b.__options.distance[0]),void 0===b.__options.distance[2]&&(b.__options.distance[2]=b.__options.distance[0]),void 0===b.__options.distance[3]&&(b.__options.distance[3]=b.__options.distance[1]),b.__options.distance={top:b.__options.distance[0],right:b.__options.distance[1],bottom:b.__options.distance[2],left:b.__options.distance[3]}),"string"==typeof b.__options.side){var c={top:"bottom",right:"left",bottom:"top",left:"right"};b.__options.side=[b.__options.side,c[b.__options.side]],"left"==b.__options.side[0]||"right"==b.__options.side[0]?b.__options.side.push("top","bottom"):b.__options.side.push("right","left")}6===a.tooltipster._env.IE&&b.__options.arrow!==!0&&(b.__options.arrow=!1)},__reposition:function(b,c){var d,e=this,f=e.__targetFind(c),g=[];e.__instance._$tooltip.detach();var h=e.__instance._$tooltip.clone(),i=a.tooltipster._getRuler(h),j=!1,k=e.__instance.option("animation");switch(k&&h.removeClass("tooltipster-"+k),a.each(["window","document"],function(d,k){var l=null;if(e.__instance._trigger({container:k,helper:c,satisfied:j,takeTest:function(a){l=a},results:g,type:"positionTest"}),1==l||0!=l&&0==j&&("window"!=k||e.__options.viewportAware))for(var d=0;d<e.__options.side.length;d++){var m={horizontal:0,vertical:0},n=e.__options.side[d];"top"==n||"bottom"==n?m.vertical=e.__options.distance[n]:m.horizontal=e.__options.distance[n],e.__sideChange(h,n),a.each(["natural","constrained"],function(a,d){if(l=null,e.__instance._trigger({container:k,event:b,helper:c,mode:d,results:g,satisfied:j,side:n,takeTest:function(a){l=a},type:"positionTest"}),1==l||0!=l&&0==j){var h={container:k,distance:m,fits:null,mode:d,outerSize:null,side:n,size:null,target:f[n],whole:null},o="natural"==d?i.free():i.constrain(c.geo.available[k][n].width-m.horizontal,c.geo.available[k][n].height-m.vertical),p=o.measure();if(h.size=p.size,h.outerSize={height:p.size.height+m.vertical,width:p.size.width+m.horizontal},"natural"==d?c.geo.available[k][n].width>=h.outerSize.width&&c.geo.available[k][n].height>=h.outerSize.height?h.fits=!0:h.fits=!1:h.fits=p.fits,"window"==k&&(h.fits?"top"==n||"bottom"==n?h.whole=c.geo.origin.windowOffset.right>=e.__options.minIntersection&&c.geo.window.size.width-c.geo.origin.windowOffset.left>=e.__options.minIntersection:h.whole=c.geo.origin.windowOffset.bottom>=e.__options.minIntersection&&c.geo.window.size.height-c.geo.origin.windowOffset.top>=e.__options.minIntersection:h.whole=!1),g.push(h),h.whole)j=!0;else if("natural"==h.mode&&(h.fits||h.size.width<=c.geo.available[k][n].width))return!1}})}}),e.__instance._trigger({edit:function(a){g=a},event:b,helper:c,results:g,type:"positionTested"}),g.sort(function(a,b){if(a.whole&&!b.whole)return-1;if(!a.whole&&b.whole)return 1;if(a.whole&&b.whole){var c=e.__options.side.indexOf(a.side),d=e.__options.side.indexOf(b.side);return d>c?-1:c>d?1:"natural"==a.mode?-1:1}if(a.fits&&!b.fits)return-1;if(!a.fits&&b.fits)return 1;if(a.fits&&b.fits){var c=e.__options.side.indexOf(a.side),d=e.__options.side.indexOf(b.side);return d>c?-1:c>d?1:"natural"==a.mode?-1:1}return"document"==a.container&&"bottom"==a.side&&"natural"==a.mode?-1:1}),d=g[0],d.coord={},d.side){case"left":case"right":d.coord.top=Math.floor(d.target-d.size.height/2);break;case"bottom":case"top":d.coord.left=Math.floor(d.target-d.size.width/2)}switch(d.side){case"left":d.coord.left=c.geo.origin.windowOffset.left-d.outerSize.width;break;case"right":d.coord.left=c.geo.origin.windowOffset.right+d.distance.horizontal;break;case"top":d.coord.top=c.geo.origin.windowOffset.top-d.outerSize.height;break;case"bottom":d.coord.top=c.geo.origin.windowOffset.bottom+d.distance.vertical}"window"==d.container?"top"==d.side||"bottom"==d.side?d.coord.left<0?c.geo.origin.windowOffset.right-this.__options.minIntersection>=0?d.coord.left=0:d.coord.left=c.geo.origin.windowOffset.right-this.__options.minIntersection-1:d.coord.left>c.geo.window.size.width-d.size.width&&(c.geo.origin.windowOffset.left+this.__options.minIntersection<=c.geo.window.size.width?d.coord.left=c.geo.window.size.width-d.size.width:d.coord.left=c.geo.origin.windowOffset.left+this.__options.minIntersection+1-d.size.width):d.coord.top<0?c.geo.origin.windowOffset.bottom-this.__options.minIntersection>=0?d.coord.top=0:d.coord.top=c.geo.origin.windowOffset.bottom-this.__options.minIntersection-1:d.coord.top>c.geo.window.size.height-d.size.height&&(c.geo.origin.windowOffset.top+this.__options.minIntersection<=c.geo.window.size.height?d.coord.top=c.geo.window.size.height-d.size.height:d.coord.top=c.geo.origin.windowOffset.top+this.__options.minIntersection+1-d.size.height):(d.coord.left>c.geo.window.size.width-d.size.width&&(d.coord.left=c.geo.window.size.width-d.size.width),d.coord.left<0&&(d.coord.left=0)),e.__sideChange(h,d.side),c.tooltipClone=h[0],c.tooltipParent=e.__instance.option("parent").parent[0],c.mode=d.mode,c.whole=d.whole,c.origin=e.__instance._$origin[0],c.tooltip=e.__instance._$tooltip[0],delete d.container,delete d.fits,delete d.mode,delete d.outerSize,delete d.whole,d.distance=d.distance.horizontal||d.distance.vertical;var l=a.extend(!0,{},d);if(e.__instance._trigger({edit:function(a){d=a},event:b,helper:c,position:l,type:"position"}),e.__options.functionPosition){var m=e.__options.functionPosition.call(e,e.__instance,c,l);m&&(d=m)}i.destroy();var n,o;"top"==d.side||"bottom"==d.side?(n={prop:"left",val:d.target-d.coord.left},o=d.size.width-this.__options.minIntersection):(n={prop:"top",val:d.target-d.coord.top},o=d.size.height-this.__options.minIntersection),n.val<this.__options.minIntersection?n.val=this.__options.minIntersection:n.val>o&&(n.val=o);var p;p=c.geo.origin.fixedLineage?c.geo.origin.windowOffset:{left:c.geo.origin.windowOffset.left+c.geo.window.scroll.left,top:c.geo.origin.windowOffset.top+c.geo.window.scroll.top},d.coord={left:p.left+(d.coord.left-c.geo.origin.windowOffset.left),top:p.top+(d.coord.top-c.geo.origin.windowOffset.top)},e.__sideChange(e.__instance._$tooltip,d.side),c.geo.origin.fixedLineage?e.__instance._$tooltip.css("position","fixed"):e.__instance._$tooltip.css("position",""),e.__instance._$tooltip.css({left:d.coord.left,top:d.coord.top,height:d.size.height,width:d.size.width}).find(".tooltipster-arrow").css({left:"",top:""}).css(n.prop,n.val),e.__instance._$tooltip.appendTo(e.__instance.option("parent")),e.__instance._trigger({type:"repositioned",event:b,position:d})},__sideChange:function(a,b){a.removeClass("tooltipster-bottom").removeClass("tooltipster-left").removeClass("tooltipster-right").removeClass("tooltipster-top").addClass("tooltipster-"+b)},__targetFind:function(a){var b={},c=this.__instance._$origin[0].getClientRects();if(c.length>1){var d=this.__instance._$origin.css("opacity");1==d&&(this.__instance._$origin.css("opacity",.99),c=this.__instance._$origin[0].getClientRects(),this.__instance._$origin.css("opacity",1))}if(c.length<2)b.top=Math.floor(a.geo.origin.windowOffset.left+a.geo.origin.size.width/2),b.bottom=b.top,b.left=Math.floor(a.geo.origin.windowOffset.top+a.geo.origin.size.height/2),b.right=b.left;else{var e=c[0];b.top=Math.floor(e.left+(e.right-e.left)/2),e=c.length>2?c[Math.ceil(c.length/2)-1]:c[0],b.right=Math.floor(e.top+(e.bottom-e.top)/2),e=c[c.length-1],b.bottom=Math.floor(e.left+(e.right-e.left)/2),e=c.length>2?c[Math.ceil((c.length+1)/2)-1]:c[c.length-1],b.left=Math.floor(e.top+(e.bottom-e.top)/2)}return b}}}),a});
var datepicker_format='yy-mm-dd';jQuery(document).ready(function($)
{$('.mec_upload_image_button').click(function(event)
{event.preventDefault();var frame;if(frame)
{frame.open();return;}
frame=wp.media();frame.on('select',function()
{var attachment=frame.state().get('selection').first();$('#mec_thumbnail_img').html('<img src="'+attachment.attributes.url+'" />');$('#mec_thumbnail').val(attachment.attributes.url);$('.mec_remove_image_button').toggleClass('mec-util-hidden');frame.close();});frame.open();});$('.mec_remove_image_button').click(function(event)
{event.preventDefault();$('#mec_thumbnail_img').html('');$('#mec_thumbnail').val('');$('.mec_remove_image_button').toggleClass('mec-util-hidden');});$('.mec_location_upload_image_button').click(function(event)
{event.preventDefault();var frame;if(frame)
{frame.open();return;}
frame=wp.media();frame.on('select',function()
{var attachment=frame.state().get('selection').first();$('#mec_location_thumbnail_img').html('<img src="'+attachment.attributes.url+'" />');$('#mec_location_thumbnail').val(attachment.attributes.url);$('.mec_location_remove_image_button').toggleClass('mec-util-hidden');frame.close();});frame.open();});$('.mec_location_remove_image_button').click(function(event)
{event.preventDefault();$('#mec_location_thumbnail_img').html('');$('#mec_location_thumbnail').val('');$('.mec_location_remove_image_button').toggleClass('mec-util-hidden');});$('.mec_organizer_upload_image_button').click(function(event)
{event.preventDefault();var frame;if(frame)
{frame.open();return;}
frame=wp.media();frame.on('select',function()
{var attachment=frame.state().get('selection').first();$('#mec_organizer_thumbnail_img').html('<img src="'+attachment.attributes.url+'" />');$('#mec_organizer_thumbnail').val(attachment.attributes.url);$('.mec_organizer_remove_image_button').toggleClass('mec-util-hidden');frame.close();});frame.open();});$('.mec_organizer_remove_image_button').click(function(event)
{event.preventDefault();$('#mec_organizer_thumbnail_img').html('');$('#mec_organizer_thumbnail').val('');$('.mec_organizer_remove_image_button').toggleClass('mec-util-hidden');});$('#mec_fes_remove_image_button').click(function(event)
{event.preventDefault();$('#mec_fes_thumbnail_img').html('');$('#mec_fes_thumbnail').val('');$('#mec_featured_image_file').val('');$('#mec_fes_remove_image_button').addClass('mec-util-hidden');});$('#mec_fes_location_remove_image_button').click(function(event)
{event.preventDefault();$('#mec_fes_location_thumbnail_img').html('');$('#mec_fes_location_thumbnail').val('');$('#mec_fes_location_thumbnail_file').val('');$('#mec_fes_location_remove_image_button').addClass('mec-util-hidden');});$('#mec_fes_organizer_remove_image_button').click(function(event)
{event.preventDefault();$('#mec_fes_organizer_thumbnail_img').html('');$('#mec_fes_organizer_thumbnail').val('');$('#mec_fes_organizer_thumbnail_file').val('');$('#mec_fes_organizer_remove_image_button').addClass('mec-util-hidden');});if(typeof mec_admin_localize!=='undefined'){var date_splite=mec_admin_localize.datepicker_format.split('&');if(date_splite[0]!==undefined&&date_splite.length==2){datepicker_format=date_splite[0];}}else if(typeof mecdata!=='undefined'){var date_splite=mecdata.datepicker_format.split('&');if(date_splite[0]!==undefined&&date_splite.length==2){datepicker_format=date_splite[0];}}
if($.fn.datepicker){$('#mec_start_date').datepicker({changeYear:true,changeMonth:true,dateFormat:datepicker_format,gotoCurrent:true,yearRange:'c-3:c+5',});$('#mec_end_date').datepicker({changeYear:true,changeMonth:true,dateFormat:datepicker_format,gotoCurrent:true,yearRange:'c-3:c+5',});$('#mec_date_repeat_end_at_date').datepicker({changeYear:true,changeMonth:true,dateFormat:datepicker_format,gotoCurrent:true,yearRange:'c-3:c+5',});$('.mec_date_picker_dynamic_format').datepicker({changeYear:true,changeMonth:true,dateFormat:datepicker_format,gotoCurrent:true,yearRange:'c-3:c+5',});$('.mec_date_picker').datepicker({changeYear:true,changeMonth:true,dateFormat:'yy-mm-dd',gotoCurrent:true,yearRange:'c-3:c+5',});}
$('#mec_location_id').on('change',function()
{mec_location_toggle();});$('#mec_organizer_id').on('change',function()
{mec_organizer_toggle();var mec_organizer_val=parseInt($(this).val());var mec_additional_organizer=$(this).parent().parent().find('#mec-additional-organizer-wrap');if(mec_organizer_val!=1)mec_additional_organizer.show();else mec_additional_organizer.hide();});mec_location_toggle();mec_organizer_toggle();$('#mec_repeat').on('change',function()
{mec_repeat_toggle();});mec_repeat_toggle();$('#mec_repeat_type').on('change',function()
{mec_repeat_type_toggle();});mec_repeat_type_toggle();$('#mec_bookings_limit_unlimited').on('change',function()
{mec_bookings_unlimited_toggle();});$('#mec_add_in_days').on('click',function()
{var start=$('#mec_exceptions_in_days_start_date').val();if(start==='')return false;var end=$('#mec_exceptions_in_days_end_date').val();if(end==='')return false;var start_hour=$('#mec_exceptions_in_days_start_hour').val();if(start_hour.length===1)start_hour='0'+start_hour;var start_minutes=$('#mec_exceptions_in_days_start_minutes').val();if(start_minutes.length===1)start_minutes='0'+start_minutes;var start_ampm=$('#mec_exceptions_in_days_start_ampm').val();if(typeof start_ampm==='undefined')start_ampm='';var end_hour=$('#mec_exceptions_in_days_end_hour').val();if(end_hour.length===1)end_hour='0'+end_hour;var end_minutes=$('#mec_exceptions_in_days_end_minutes').val();if(end_minutes.length===1)end_minutes='0'+end_minutes;var end_ampm=$('#mec_exceptions_in_days_end_ampm').val();if(typeof end_ampm==='undefined')end_ampm='';var value=start+':'+end+':'+start_hour+'-'+start_minutes+'-'+start_ampm+':'+end_hour+'-'+end_minutes+'-'+end_ampm;var label=start+' '+start_hour+':'+start_minutes+' '+start_ampm+' - '+end+' '+end_hour+':'+end_minutes+' '+end_ampm;var $key=$('#mec_new_in_days_key');var key=$key.val();var html=$('#mec_new_in_days_raw').html().replace(/:i:/g,key).replace(/:val:/g,value).replace(/:label:/g,label);$('#mec_in_days').append(html);$key.val(parseInt(key)+1);});$('#mec_add_not_in_days').on('click',function()
{var date=$('#mec_exceptions_not_in_days_date').val();if(date==='')return false;var key=$('#mec_new_not_in_days_key').val();var html=$('#mec_new_not_in_days_raw').html().replace(/:i:/g,key).replace(/:val:/g,date);$('#mec_not_in_days').append(html);$('#mec_new_not_in_days_key').val(parseInt(key)+1);});$('#mec_add_ticket_button').on('click',function()
{var key=$('#mec_new_ticket_key').val();var html=$('#mec_new_ticket_raw').html().replace(/:i:/g,key);$('#mec_tickets').append(html);$('#mec_new_ticket_key').val(parseInt(key)+1);$('.mec_add_price_date_button').off('click').on('click',function()
{mec_handle_add_price_date_button(this);});});$('.mec_add_price_date_button').off('click').on('click',function()
{mec_handle_add_price_date_button(this);});$('#mec_add_hourly_schedule_day_button').on('click',function()
{var key=$('#mec_new_hourly_schedule_day_key').val();var html=$('#mec_new_hourly_schedule_day_raw').html().replace(/:d:/g,key).replace(/:dd:/g,parseInt(key)+1);$('#mec_meta_box_hourly_schedule_days').append(html);$('#mec_new_hourly_schedule_day_key').val(parseInt(key)+1);mec_hourly_schedule_listeners();});mec_hourly_schedule_listeners();$('#mec_add_fee_button').on('click',function()
{var key=$('#mec_new_fee_key').val();var html=$('#mec_new_fee_raw').html().replace(/:i:/g,key);$('#mec_fees_list').append(html);$('#mec_new_fee_key').val(parseInt(key)+1);});$('#mec_add_ticket_variation_button').on('click',function()
{var key=$('#mec_new_ticket_variation_key').val();var html=$('#mec_new_ticket_variation_raw').html().replace(/:i:/g,key);$('#mec_ticket_variations_list').append(html);$('#mec_new_ticket_variation_key').val(parseInt(key)+1);});$('.mec-form-row.mec-available-color-row span').on('click',function()
{$('.mec-form-row.mec-available-color-row span').removeClass('color-selected');$(this).addClass('color-selected');});$('#mec_reg_form_field_types button').on('click',function()
{var type=$(this).data('type');if(type=='mec_email'){if($('#mec_reg_form_fields').find('input[value="mec_email"][type="hidden"]').length){return false;}}
if(type=='name'){if($('#mec_reg_form_fields').find('input[value="name"][type="hidden"]').length){return false;}}
var key=$('#mec_new_reg_field_key').val();var html=$('#mec_reg_field_'+type).html().replace(/:i:/g,key);$('#mec_reg_form_fields').append(html);$('#mec_new_reg_field_key').val(parseInt(key)+1);mec_reg_fields_option_listeners();});mec_reg_fields_option_listeners();$('#mec-advanced-wraper ul > ul > li').click(function()
{if($(this).attr('class')=='')$(this).attr('class','mec-active');else $(this).attr('class','');$('#mec_date_repeat_advanced').val($('#mec-advanced-wraper div:first-child > ul').find('.mec-active').find('span').text().slice(0,-1));});});function mec_location_toggle()
{if(jQuery('#mec_location_id').val()!='0')jQuery('#mec_location_new_container').hide();else jQuery('#mec_location_new_container').show();}
function mec_organizer_toggle()
{if(jQuery('#mec_organizer_id').val()!='0')jQuery('#mec_organizer_new_container').hide();else jQuery('#mec_organizer_new_container').show();}
function mec_repeat_toggle()
{if(jQuery('#mec_repeat').is(':checked'))jQuery('.mec-form-repeating-event-row').show();else jQuery('.mec-form-repeating-event-row').hide();}
function mec_repeat_type_toggle()
{var repeat_type=jQuery('#mec_repeat_type').val();if(repeat_type=='certain_weekdays')
{jQuery('#mec_repeat_interval_container').hide();jQuery('#mec_repeat_certain_weekdays_container').show();jQuery('#mec_exceptions_in_days_container').hide();jQuery('#mec_end_wrapper').show();jQuery('#mec-advanced-wraper').hide();}
else if(repeat_type=='custom_days')
{jQuery('#mec_repeat_interval_container').hide();jQuery('#mec_repeat_certain_weekdays_container').hide();jQuery('#mec_exceptions_in_days_container').show();jQuery('#mec_end_wrapper').hide();jQuery('#mec-advanced-wraper').hide();}
else if(repeat_type=='advanced')
{jQuery('#mec_repeat_interval_container').hide();jQuery('#mec_repeat_certain_weekdays_container').hide();jQuery('#mec_exceptions_in_days_container').hide();jQuery('#mec_end_wrapper').show();jQuery('#mec-advanced-wraper').show();}
else if(repeat_type!='daily'&&repeat_type!='weekly')
{jQuery('#mec_repeat_interval_container').hide();jQuery('#mec_repeat_certain_weekdays_container').hide();jQuery('#mec_exceptions_in_days_container').hide();jQuery('#mec_end_wrapper').show();jQuery('#mec-advanced-wraper').hide();}
else
{jQuery('#mec_repeat_interval_container').show();jQuery('#mec_repeat_certain_weekdays_container').hide();jQuery('#mec_exceptions_in_days_container').hide();jQuery('#mec_end_wrapper').show();jQuery('#mec-advanced-wraper').hide();}}
function mec_in_days_remove(i)
{jQuery('#mec_in_days_row'+i).remove();}
function mec_not_in_days_remove(i)
{jQuery('#mec_not_in_days_row'+i).remove();}
function mec_bookings_unlimited_toggle()
{jQuery('#mec_bookings_limit').toggleClass('mec-util-hidden');}
function mec_hourly_schedule_listeners()
{jQuery('.mec-add-hourly-schedule-button').off('click').on('click',function()
{var day=jQuery(this).data('day');var key=jQuery('#mec_new_hourly_schedule_key'+day).val();var html=jQuery('#mec_new_hourly_schedule_raw'+day).html().replace(/:i:/g,key).replace(/:d:/g,day);jQuery('#mec_hourly_schedules'+day).append(html);jQuery('#mec_new_hourly_schedule_key'+day).val(parseInt(key)+1);});}
function mec_hourly_schedule_remove(day,i)
{jQuery("#mec_hourly_schedule_row"+day+'_'+i).remove();}
function mec_hourly_schedule_day_remove(day)
{jQuery("#mec_meta_box_hourly_schedule_day_"+day).remove();}
function mec_ticket_remove(i)
{jQuery("#mec_ticket_row"+i).remove();}
function mec_set_event_color(color)
{try
{jQuery("#mec_event_color").wpColorPicker('color','#'+color);}
catch(e)
{jQuery("#mec_event_color").val(color);}}
function mec_remove_fee(key)
{jQuery("#mec_fee_row"+key).remove();}
function mec_remove_ticket_variation(key)
{jQuery("#mec_ticket_variation_row"+key).remove();}
function mec_reg_fields_option_listeners()
{jQuery('button.mec-reg-field-add-option').on('click',function()
{var field_id=jQuery(this).data('field-id');var key=jQuery('#mec_new_reg_field_option_key_'+field_id).val();var html=jQuery('#mec_reg_field_option').html().replace(/:i:/g,key).replace(/:fi:/g,field_id);jQuery('#mec_reg_fields_'+field_id+'_options_container').append(html);jQuery('#mec_new_reg_field_option_key_'+field_id).val(parseInt(key)+1);});if(typeof jQuery.fn.sortable!=='undefined')
{jQuery("#mec_reg_form_fields").sortable({handle:'.mec_reg_field_sort'});jQuery(".mec_reg_fields_options_container").sortable({handle:'.mec_reg_field_option_sort'});}}
function mec_reg_fields_option_remove(field_key,key)
{jQuery("#mec_reg_fields_option_"+field_key+"_"+key).remove();}
function mec_reg_fields_remove(key)
{jQuery("#mec_reg_fields_"+key).remove();}
function mec_handle_add_price_date_button(e)
{var key=jQuery(e).data('key');var p=jQuery('#mec_new_ticket_price_key_'+key).val();var html=jQuery('#mec_new_ticket_price_raw_'+key).html().replace(/:i:/g,key).replace(/:j:/g,p);jQuery('#mec-ticket-price-dates-'+key).append(html);jQuery('#mec_new_ticket_price_key_'+key).val(parseInt(p)+1);jQuery('#mec-ticket-price-dates-'+key+' .new_added').datepicker({changeYear:true,changeMonth:true,dateFormat:datepicker_format,gotoCurrent:true,yearRange:'c-3:c+5',});}
function mec_ticket_price_remove(ticket_key,price_key)
{jQuery("#mec_ticket_price_raw_"+ticket_key+"_"+price_key).remove();};
/*! Lity - v2.1.0 - 2016-09-19
* http://sorgalla.com/lity/
* Copyright (c) 2015-2016 Jan Sorgalla; Licensed MIT */
!function(a,b){"function"==typeof define&&define.amd?define(["jquery"],function(c){return b(a,c)}):"object"==typeof module&&"object"==typeof module.exports?module.exports=b(a,require("jquery")):a.lity=b(a,a.jQuery||a.Zepto)}("undefined"!=typeof window?window:this,function(a,b){"use strict";function c(a){var b=A();return L&&a.length?(a.one(L,b.resolve),setTimeout(b.resolve,500)):b.resolve(),b.promise()}function d(a,c,d){if(1===arguments.length)return b.extend({},a);if("string"==typeof c){if("undefined"==typeof d)return"undefined"==typeof a[c]?null:a[c];a[c]=d}else b.extend(a,c);return this}function e(a){for(var b,c=decodeURI(a.split("#")[0]).split("&"),d={},e=0,f=c.length;e<f;e++)c[e]&&(b=c[e].split("="),d[b[0]]=b[1]);return d}function f(a,c){return a+(a.indexOf("?")>-1?"&":"?")+b.param(c)}function g(a,b){var c=a.indexOf("#");return-1===c?b:(c>0&&(a=a.substr(c)),b+a)}function h(a){return b('<span class="lity-error"/>').append(a)}function i(a,c){var d=c.opener()&&c.opener().data("lity-desc")||"Image with no description",e=b('<img src="'+a+'" alt="'+d+'"/>'),f=A(),g=function(){f.reject(h("Failed loading image"))};return e.on("load",function(){return 0===this.naturalWidth?g():void f.resolve(e)}).on("error",g),f.promise()}function j(a,c){var d,e,f;try{d=b(a)}catch(a){return!1}return!!d.length&&(e=b('<i style="display:none !important"/>'),f=d.hasClass("lity-hide"),c.element().one("lity:remove",function(){e.before(d).remove(),f&&!d.closest(".lity-content").length&&d.addClass("lity-hide")}),d.removeClass("lity-hide").after(e))}function k(a){var c=I.exec(a);return!!c&&n(g(a,f("https://www.youtube"+(c[2]||"")+".com/embed/"+c[4],b.extend({autoplay:1},e(c[5]||"")))))}function l(a){var c=J.exec(a);return!!c&&n(g(a,f("https://player.vimeo.com/video/"+c[3],b.extend({autoplay:1},e(c[4]||"")))))}function m(a){var b=K.exec(a);return!!b&&n(g(a,f("https://www.google."+b[3]+"/maps?"+b[6],{output:b[6].indexOf("layer=c")>0?"svembed":"embed"})))}function n(a){return'<div class="lity-iframe-container"><iframe frameborder="0" allowfullscreen src="'+a+'"/></div>'}function o(){return y.documentElement.clientHeight?y.documentElement.clientHeight:Math.round(z.height())}function p(a){var b=u();b&&(27===a.keyCode&&b.close(),9===a.keyCode&&q(a,b))}function q(a,b){var c=b.element().find(F),d=c.index(y.activeElement);a.shiftKey&&d<=0?(c.get(c.length-1).focus(),a.preventDefault()):a.shiftKey||d!==c.length-1||(c.get(0).focus(),a.preventDefault())}function r(){b.each(C,function(a,b){b.resize()})}function s(a){1===C.unshift(a)&&(B.addClass("lity-active"),z.on({resize:r,keydown:p})),b("body > *").not(a.element()).addClass("lity-hidden").each(function(){var a=b(this);void 0===a.data(E)&&a.data(E,a.attr(D)||null)}).attr(D,"true")}function t(a){var c;a.element().attr(D,"true"),1===C.length&&(B.removeClass("lity-active"),z.off({resize:r,keydown:p})),C=b.grep(C,function(b){return a!==b}),c=C.length?C[0].element():b(".lity-hidden"),c.removeClass("lity-hidden").each(function(){var a=b(this),c=a.data(E);c?a.attr(D,c):a.removeAttr(D),a.removeData(E)})}function u(){return 0===C.length?null:C[0]}function v(a,c,d,e){var f,g="inline",h=b.extend({},d);return e&&h[e]?(f=h[e](a,c),g=e):(b.each(["inline","iframe"],function(a,b){delete h[b],h[b]=d[b]}),b.each(h,function(b,d){return!d||(!(!d.test||d.test(a,c))||(f=d(a,c),!1!==f?(g=b,!1):void 0))})),{handler:g,content:f||""}}function w(a,e,f,g){function h(a){k=b(a).css("max-height",o()+"px"),j.find(".lity-loader").each(function(){var a=b(this);c(a).always(function(){a.remove()})}),j.removeClass("lity-loading").find(".lity-content").empty().append(k),m=!0,k.trigger("lity:ready",[l])}var i,j,k,l=this,m=!1,n=!1;e=b.extend({},G,e),j=b(e.template),l.element=function(){return j},l.opener=function(){return f},l.options=b.proxy(d,l,e),l.handlers=b.proxy(d,l,e.handlers),l.resize=function(){m&&!n&&k.css("max-height",o()+"px").trigger("lity:resize",[l])},l.close=function(){if(m&&!n){n=!0,t(l);var a=A();return g&&b.contains(j,y.activeElement)&&g.focus(),k.trigger("lity:close",[l]),j.removeClass("lity-opened").addClass("lity-closed"),c(k.add(j)).always(function(){k.trigger("lity:remove",[l]),j.remove(),j=void 0,a.resolve()}),a.promise()}},i=v(a,l,e.handlers,e.handler),j.attr(D,"false").addClass("lity-loading lity-opened lity-"+i.handler).appendTo("body").focus().on("click","[data-lity-close]",function(a){b(a.target).is("[data-lity-close]")&&l.close()}).trigger("lity:open",[l]),s(l),b.when(i.content).always(h)}function x(a,c,d){a.preventDefault?(a.preventDefault(),d=b(this),a=d.data("lity-target")||d.attr("href")||d.attr("src")):d=b(d);var e=new w(a,b.extend({},d.data("lity-options")||d.data("lity"),c),d,y.activeElement);if(!a.preventDefault)return e}var y=a.document,z=b(a),A=b.Deferred,B=b("html"),C=[],D="aria-hidden",E="lity-"+D,F='a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,object,embed,[contenteditable],[tabindex]:not([tabindex^="-"])',G={handler:null,handlers:{image:i,inline:j,youtube:k,vimeo:l,iframe:n},template:'<div class="lity" role="dialog" aria-label="Dialog Window (Press escape to close)" tabindex="-1"><div class="lity-wrap" data-lity-close role="document"><div class="lity-loader" aria-hidden="true">Loading...</div><div class="lity-container"><div class="lity-content"></div><button class="lity-close" type="button" aria-label="Close (Press escape to close)" data-lity-close>&times;</button></div></div></div>'},H=/(^data:image\/)|(\.(png|jpe?g|gif|svg|webp|bmp|ico|tiff?)(\?\S*)?$)/i,I=/(youtube(-nocookie)?\.com|youtu\.be)\/(watch\?v=|v\/|u\/|embed\/?)?([\w-]{11})(.*)?/i,J=/(vimeo(pro)?.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/,K=/((maps|www)\.)?google\.([^\/\?]+)\/?((maps\/?)?\?)(.*)/i,L=function(){var a=y.createElement("div"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return b[c];return!1}();return i.test=function(a){return H.test(a)},x.version="2.1.0",x.options=b.proxy(d,x,G),x.handlers=b.proxy(d,x,G.handlers),x.current=u,b(y).on("click.lity","[data-lity]",x),x});

!function(r){r.fn.colourBrightness=function(){function r(r){for(var t="";"html"!=r[0].tagName.toLowerCase()&&(t=r.css("background-color"),"rgba(0, 0, 0, 0)"==t||"transparent"==t);)r=r.parent();return t}var t,a,s,e,n=r(this);return n.match(/^rgb/)?(n=n.match(/rgba?\(([^)]+)\)/)[1],n=n.split(/ *, */).map(Number),t=n[0],a=n[1],s=n[2]):"#"==n[0]&&7==n.length?(t=parseInt(n.slice(1,3),16),a=parseInt(n.slice(3,5),16),s=parseInt(n.slice(5,7),16)):"#"==n[0]&&4==n.length&&(t=parseInt(n[1]+n[1],16),a=parseInt(n[2]+n[2],16),s=parseInt(n[3]+n[3],16)),e=(299*t+587*a+114*s)/1e3,125>e?this.removeClass("light").addClass("dark"):this.removeClass("dark").addClass("light"),this}}(jQuery);

/**
 * Owl carousel
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 * @todo Lazy Load Icon
 * @todo prevent animationend bubling
 * @todo itemsScaleUp
 * @todo Test Zepto
 * @todo stagePadding calculate wrong active classes
 */
; (function ($, window, document, undefined) {
	/**
	 * Creates a carousel.
	 * @class The Owl Carousel.
	 * @public
	 * @param {HTMLElement|jQuery} element - The element to create the carousel for.
	 * @param {Object} [options] - The options
	 */
    function Owl(element, options) {
		/**
		 * Current settings for the carousel.
		 * @public
		 */
        this.settings = null;
		/**
		 * Current options set by the caller including defaults.
		 * @public
		 */
        this.options = $.extend({}, Owl.Defaults, options);
		/**
		 * Plugin element.
		 * @public
		 */
        this.$element = $(element);
		/**
		 * Proxied event handlers.
		 * @protected
		 */
        this._handlers = {};
		/**
		 * References to the running plugins of this carousel.
		 * @protected
		 */
        this._plugins = {};
		/**
		 * Currently suppressed events to prevent them from being retriggered.
		 * @protected
		 */
        this._supress = {};
		/**
		 * Absolute current position.
		 * @protected
		 */
        this._current = null;
		/**
		 * Animation speed in milliseconds.
		 * @protected
		 */
        this._speed = null;
		/**
		 * Coordinates of all items in pixel.
		 * @todo The name of this member is missleading.
		 * @protected
		 */
        this._coordinates = [];
		/**
		 * Current breakpoint.
		 * @todo Real media queries would be nice.
		 * @protected
		 */
        this._breakpoint = null;
		/**
		 * Current width of the plugin element.
		 */
        this._width = null;
		/**
		 * All real items.
		 * @protected
		 */
        this._items = [];
		/**
		 * All cloned items.
		 * @protected
		 */
        this._clones = [];
		/**
		 * Merge values of all items.
		 * @todo Maybe this could be part of a plugin.
		 * @protected
		 */
        this._mergers = [];
		/**
		 * Widths of all items.
		 */
        this._widths = [];
		/**
		 * Invalidated parts within the update process.
		 * @protected
		 */
        this._invalidated = {};
		/**
		 * Ordered list of workers for the update process.
		 * @protected
		 */
        this._pipe = [];
		/**
		 * Current state information for the drag operation.
		 * @todo #261
		 * @protected
		 */
        this._drag = {
            time: null,
            target: null,
            pointer: null,
            stage: {
                start: null,
                current: null
            },
            direction: null
        };
		/**
		 * Current state information and their tags.
		 * @type {Object}
		 * @protected
		 */
        this._states = {
            current: {},
            tags: {
                'initializing': ['busy'],
                'animating': ['busy'],
                'dragging': ['interacting']
            }
        };
        $.each(['onResize', 'onThrottledResize'], $.proxy(function (i, handler) {
            this._handlers[handler] = $.proxy(this[handler], this);
        }, this));
        $.each(Owl.Plugins, $.proxy(function (key, plugin) {
            this._plugins[key.charAt(0).toLowerCase() + key.slice(1)]
                = new plugin(this);
        }, this));
        $.each(Owl.Workers, $.proxy(function (priority, worker) {
            this._pipe.push({
                'filter': worker.filter,
                'run': $.proxy(worker.run, this)
            });
        }, this));
        this.setup();
        this.initialize();
    }
	/**
	 * Default options for the carousel.
	 * @public
	 */
    Owl.Defaults = {
        items: 3,
        loop: false,
        center: false,
        rewind: false,
        checkVisibility: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        freeDrag: false,
        margin: 0,
        stagePadding: 0,
        merge: false,
        mergeFit: true,
        autoWidth: false,
        startPosition: 0,
        rtl: false,
        smartSpeed: 250,
        fluidSpeed: false,
        dragEndSpeed: false,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: window,
        fallbackEasing: 'swing',
        slideTransition: '',
        info: false,
        nestedItemSelector: false,
        itemElement: 'div',
        stageElement: 'div',
        refreshClass: 'owl-refresh',
        loadedClass: 'owl-loaded',
        loadingClass: 'owl-loading',
        rtlClass: 'owl-rtl',
        responsiveClass: 'owl-responsive',
        dragClass: 'owl-drag',
        itemClass: 'owl-item',
        stageClass: 'owl-stage',
        stageOuterClass: 'owl-stage-outer',
        grabClass: 'owl-grab'
    };
	/**
	 * Enumeration for width.
	 * @public
	 * @readonly
	 * @enum {String}
	 */
    Owl.Width = {
        Default: 'default',
        Inner: 'inner',
        Outer: 'outer'
    };
	/**
	 * Enumeration for types.
	 * @public
	 * @readonly
	 * @enum {String}
	 */
    Owl.Type = {
        Event: 'event',
        State: 'state'
    };
	/**
	 * Contains all registered plugins.
	 * @public
	 */
    Owl.Plugins = {};
	/**
	 * List of workers involved in the update process.
	 */
    Owl.Workers = [{
        filter: ['width', 'settings'],
        run: function () {
            this._width = this.$element.width();
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function (cache) {
            cache.current = this._items && this._items[this.relative(this._current)];
        }
    }, {
        filter: ['items', 'settings'],
        run: function () {
            this.$stage.children('.cloned').remove();
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function (cache) {
            var margin = this.settings.margin || '',
                grid = !this.settings.autoWidth,
                rtl = this.settings.rtl,
                css = {
                    'width': 'auto',
                    'margin-left': rtl ? margin : '',
                    'margin-right': rtl ? '' : margin
                };
            !grid && this.$stage.children().css(css);
            cache.css = css;
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function (cache) {
            var width = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
                merge = null,
                iterator = this._items.length,
                grid = !this.settings.autoWidth,
                widths = [];
            cache.items = {
                merge: false,
                width: width
            };
            while (iterator--) {
                merge = this._mergers[iterator];
                merge = this.settings.mergeFit && Math.min(merge, this.settings.items) || merge;
                cache.items.merge = merge > 1 || cache.items.merge;
                widths[iterator] = !grid ? this._items[iterator].width() : width * merge;
            }
            this._widths = widths;
        }
    }, {
        filter: ['items', 'settings'],
        run: function () {
            var clones = [],
                items = this._items,
                settings = this.settings,
                view = Math.max(settings.items * 2, 4),
                size = Math.ceil(items.length / 2) * 2,
                repeat = settings.loop && items.length ? settings.rewind ? view : Math.max(view, size) : 0,
                append = '',
                prepend = '';
            repeat /= 2;
            while (repeat > 0) {
                clones.push(this.normalize(clones.length / 2, true));
                append = append + items[clones[clones.length - 1]][0].outerHTML;
                clones.push(this.normalize(items.length - 1 - (clones.length - 1) / 2, true));
                prepend = items[clones[clones.length - 1]][0].outerHTML + prepend;
                repeat -= 1;
            }
            this._clones = clones;
            $(append).addClass('cloned').appendTo(this.$stage);
            $(prepend).addClass('cloned').prependTo(this.$stage);
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function () {
            var rtl = this.settings.rtl ? 1 : -1,
                size = this._clones.length + this._items.length,
                iterator = -1,
                previous = 0,
                current = 0,
                coordinates = [];
            while (++iterator < size) {
                previous = coordinates[iterator - 1] || 0;
                current = this._widths[this.relative(iterator)] + this.settings.margin;
                coordinates.push(previous + current * rtl);
            }
            this._coordinates = coordinates;
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function () {
            var padding = this.settings.stagePadding,
                coordinates = this._coordinates,
                css = {
                    'width': Math.ceil(Math.abs(coordinates[coordinates.length - 1])) + padding * 2,
                    'padding-left': padding || '',
                    'padding-right': padding || ''
                };
            this.$stage.css(css);
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function (cache) {
            var iterator = this._coordinates.length,
                grid = !this.settings.autoWidth,
                items = this.$stage.children();
            if (grid && cache.items.merge) {
                while (iterator--) {
                    cache.css.width = this._widths[this.relative(iterator)];
                    items.eq(iterator).css(cache.css);
                }
            } else if (grid) {
                cache.css.width = cache.items.width;
                items.css(cache.css);
            }
        }
    }, {
        filter: ['items'],
        run: function () {
            this._coordinates.length < 1 && this.$stage.removeAttr('style');
        }
    }, {
        filter: ['width', 'items', 'settings'],
        run: function (cache) {
            cache.current = cache.current ? this.$stage.children().index(cache.current) : 0;
            cache.current = Math.max(this.minimum(), Math.min(this.maximum(), cache.current));
            this.reset(cache.current);
        }
    }, {
        filter: ['position'],
        run: function () {
            this.animate(this.coordinates(this._current));
        }
    }, {
        filter: ['width', 'position', 'items', 'settings'],
        run: function () {
            var rtl = this.settings.rtl ? 1 : -1,
                padding = this.settings.stagePadding * 2,
                begin = this.coordinates(this.current()) + padding,
                end = begin + this.width() * rtl,
                inner, outer, matches = [], i, n;
            for (i = 0, n = this._coordinates.length; i < n; i++) {
                inner = this._coordinates[i - 1] || 0;
                outer = Math.abs(this._coordinates[i]) + padding * rtl;
                if ((this.op(inner, '<=', begin) && (this.op(inner, '>', end)))
                    || (this.op(outer, '<', begin) && this.op(outer, '>', end))) {
                    matches.push(i);
                }
            }
            this.$stage.children('.active').removeClass('active');
            this.$stage.children(':eq(' + matches.join('), :eq(') + ')').addClass('active');
            this.$stage.children('.center').removeClass('center');
            if (this.settings.center) {
                this.$stage.children().eq(this.current()).addClass('center');
            }
        }
    }];
	/**
	 * Create the stage DOM element
	 */
    Owl.prototype.initializeStage = function () {
        this.$stage = this.$element.find('.' + this.settings.stageClass);
        if (this.$stage.length) {
            return;
        }
        this.$element.addClass(this.options.loadingClass);
        this.$stage = $('<' + this.settings.stageElement + '>', {
            "class": this.settings.stageClass
        }).wrap($('<div/>', {
            "class": this.settings.stageOuterClass
        }));
        this.$element.append(this.$stage.parent());
    };
	/**
	 * Create item DOM elements
	 */
    Owl.prototype.initializeItems = function () {
        var $items = this.$element.find('.owl-item');
        if ($items.length) {
            this._items = $items.get().map(function (item) {
                return $(item);
            });
            this._mergers = this._items.map(function () {
                return 1;
            });
            this.refresh();
            return;
        }
        this.replace(this.$element.children().not(this.$stage.parent()));
        if (this.isVisible()) {
            this.refresh();
        } else {
            this.invalidate('width');
        }
        this.$element
            .removeClass(this.options.loadingClass)
            .addClass(this.options.loadedClass);
    };
	/**
	 * Initializes the carousel.
	 * @protected
	 */
    Owl.prototype.initialize = function () {
        this.enter('initializing');
        this.trigger('initialize');
        this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl);
        if (this.settings.autoWidth && !this.is('pre-loading')) {
            var imgs, nestedSelector, width;
            imgs = this.$element.find('img');
            nestedSelector = this.settings.nestedItemSelector ? '.' + this.settings.nestedItemSelector : undefined;
            width = this.$element.children(nestedSelector).width();
            if (imgs.length && width <= 0) {
                this.preloadAutoWidthImages(imgs);
            }
        }
        this.initializeStage();
        this.initializeItems();
        this.registerEventHandlers();
        this.leave('initializing');
        this.trigger('initialized');
    };
	/**
	 * @returns {Boolean} visibility of $element
	 *                    if you know the carousel will always be visible you can set `checkVisibility` to `false` to
	 *                    prevent the expensive browser layout forced reflow the $element.is(':visible') does
	 */
    Owl.prototype.isVisible = function () {
        return this.settings.checkVisibility
            ? this.$element.is(':visible')
            : true;
    };
	/**
	 * Setups the current settings.
	 * @todo Remove responsive classes. Why should adaptive designs be brought into IE8?
	 * @todo Support for media queries by using `matchMedia` would be nice.
	 * @public
	 */
    Owl.prototype.setup = function () {
        var viewport = this.viewport(),
            overwrites = this.options.responsive,
            match = -1,
            settings = null;
        if (!overwrites) {
            settings = $.extend({}, this.options);
        } else {
            $.each(overwrites, function (breakpoint) {
                if (breakpoint <= viewport && breakpoint > match) {
                    match = Number(breakpoint);
                }
            });
            settings = $.extend({}, this.options, overwrites[match]);
            if (typeof settings.stagePadding === 'function') {
                settings.stagePadding = settings.stagePadding();
            }
            delete settings.responsive;
            if (settings.responsiveClass) {
                this.$element.attr('class',
                    this.$element.attr('class').replace(new RegExp('(' + this.options.responsiveClass + '-)\\S+\\s', 'g'), '$1' + match)
                );
            }
        }
        this.trigger('change', { property: { name: 'settings', value: settings } });
        this._breakpoint = match;
        this.settings = settings;
        this.invalidate('settings');
        this.trigger('changed', { property: { name: 'settings', value: this.settings } });
    };
	/**
	 * Updates option logic if necessery.
	 * @protected
	 */
    Owl.prototype.optionsLogic = function () {
        if (this.settings.autoWidth) {
            this.settings.stagePadding = false;
            this.settings.merge = false;
        }
    };
	/**
	 * Prepares an item before add.
	 * @todo Rename event parameter `content` to `item`.
	 * @protected
	 * @returns {jQuery|HTMLElement} - The item container.
	 */
    Owl.prototype.prepare = function (item) {
        var event = this.trigger('prepare', { content: item });
        if (!event.data) {
            event.data = $('<' + this.settings.itemElement + '/>')
                .addClass(this.options.itemClass).append(item)
        }
        this.trigger('prepared', { content: event.data });
        return event.data;
    };
	/**
	 * Updates the view.
	 * @public
	 */
    Owl.prototype.update = function () {
        var i = 0,
            n = this._pipe.length,
            filter = $.proxy(function (p) { return this[p] }, this._invalidated),
            cache = {};
        while (i < n) {
            if (this._invalidated.all || $.grep(this._pipe[i].filter, filter).length > 0) {
                this._pipe[i].run(cache);
            }
            i++;
        }
        this._invalidated = {};
        !this.is('valid') && this.enter('valid');
    };
	/**
	 * Gets the width of the view.
	 * @public
	 * @param {Owl.Width} [dimension=Owl.Width.Default] - The dimension to return.
	 * @returns {Number} - The width of the view in pixel.
	 */
    Owl.prototype.width = function (dimension) {
        dimension = dimension || Owl.Width.Default;
        switch (dimension) {
            case Owl.Width.Inner:
            case Owl.Width.Outer:
                return this._width;
            default:
                return this._width - this.settings.stagePadding * 2 + this.settings.margin;
        }
    };
	/**
	 * Refreshes the carousel primarily for adaptive purposes.
	 * @public
	 */
    Owl.prototype.refresh = function () {
        this.enter('refreshing');
        this.trigger('refresh');
        this.setup();
        this.optionsLogic();
        this.$element.addClass(this.options.refreshClass);
        this.update();
        this.$element.removeClass(this.options.refreshClass);
        this.leave('refreshing');
        this.trigger('refreshed');
    };
	/**
	 * Checks window `resize` event.
	 * @protected
	 */
    Owl.prototype.onThrottledResize = function () {
        window.clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate);
    };
	/**
	 * Checks window `resize` event.
	 * @protected
	 */
    Owl.prototype.onResize = function () {
        if (!this._items.length) {
            return false;
        }
        if (this._width === this.$element.width()) {
            return false;
        }
        if (!this.isVisible()) {
            return false;
        }
        this.enter('resizing');
        if (this.trigger('resize').isDefaultPrevented()) {
            this.leave('resizing');
            return false;
        }
        this.invalidate('width');
        this.refresh();
        this.leave('resizing');
        this.trigger('resized');
    };
	/**
	 * Registers event handlers.
	 * @todo Check `msPointerEnabled`
	 * @todo #261
	 * @protected
	 */
    Owl.prototype.registerEventHandlers = function () {
        if ($.support.transition) {
            this.$stage.on($.support.transition.end + '.owl.core', $.proxy(this.onTransitionEnd, this));
        }
        if (this.settings.responsive !== false) {
            this.on(window, 'resize', this._handlers.onThrottledResize);
        }
        if (this.settings.mouseDrag) {
            this.$element.addClass(this.options.dragClass);
            this.$stage.on('mousedown.owl.core', $.proxy(this.onDragStart, this));
            this.$stage.on('dragstart.owl.core selectstart.owl.core', function () { return false });
        }
        if (this.settings.touchDrag) {
            this.$stage.on('touchstart.owl.core', $.proxy(this.onDragStart, this));
            this.$stage.on('touchcancel.owl.core', $.proxy(this.onDragEnd, this));
        }
    };
	/**
	 * Handles `touchstart` and `mousedown` events.
	 * @todo Horizontal swipe threshold as option
	 * @todo #261
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
    Owl.prototype.onDragStart = function (event) {
        var stage = null;
        if (event.which === 3) {
            return;
        }
        if ($.support.transform) {
            stage = this.$stage.css('transform').replace(/.*\(|\)| /g, '').split(',');
            stage = {
                x: stage[stage.length === 16 ? 12 : 4],
                y: stage[stage.length === 16 ? 13 : 5]
            };
        } else {
            stage = this.$stage.position();
            stage = {
                x: this.settings.rtl ?
                    stage.left + this.$stage.width() - this.width() + this.settings.margin :
                    stage.left,
                y: stage.top
            };
        }
        if (this.is('animating')) {
            $.support.transform ? this.animate(stage.x) : this.$stage.stop()
            this.invalidate('position');
        }
        this.$element.toggleClass(this.options.grabClass, event.type === 'mousedown');
        this.speed(0);
        this._drag.time = new Date().getTime();
        this._drag.target = $(event.target);
        this._drag.stage.start = stage;
        this._drag.stage.current = stage;
        this._drag.pointer = this.pointer(event);
        $(document).on('mouseup.owl.core touchend.owl.core', $.proxy(this.onDragEnd, this));
        $(document).one('mousemove.owl.core touchmove.owl.core', $.proxy(function (event) {
            var delta = this.difference(this._drag.pointer, this.pointer(event));
            $(document).on('mousemove.owl.core touchmove.owl.core', $.proxy(this.onDragMove, this));
            if (Math.abs(delta.x) < Math.abs(delta.y) && this.is('valid')) {
                return;
            }
            event.preventDefault();
            this.enter('dragging');
            this.trigger('drag');
        }, this));
    };
	/**
	 * Handles the `touchmove` and `mousemove` events.
	 * @todo #261
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
    Owl.prototype.onDragMove = function (event) {
        var minimum = null,
            maximum = null,
            pull = null,
            delta = this.difference(this._drag.pointer, this.pointer(event)),
            stage = this.difference(this._drag.stage.start, delta);
        if (!this.is('dragging')) {
            return;
        }
        event.preventDefault();
        if (this.settings.loop) {
            minimum = this.coordinates(this.minimum());
            maximum = this.coordinates(this.maximum() + 1) - minimum;
            stage.x = (((stage.x - minimum) % maximum + maximum) % maximum) + minimum;
        } else {
            minimum = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum());
            maximum = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum());
            pull = this.settings.pullDrag ? -1 * delta.x / 5 : 0;
            stage.x = Math.max(Math.min(stage.x, minimum + pull), maximum + pull);
        }
        this._drag.stage.current = stage;
        this.animate(stage.x);
    };
	/**
	 * Handles the `touchend` and `mouseup` events.
	 * @todo #261
	 * @todo Threshold for click event
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
    Owl.prototype.onDragEnd = function (event) {
        var delta = this.difference(this._drag.pointer, this.pointer(event)),
            stage = this._drag.stage.current,
            direction = delta.x > 0 ^ this.settings.rtl ? 'left' : 'right';
        $(document).off('.owl.core');
        this.$element.removeClass(this.options.grabClass);
        if (delta.x !== 0 && this.is('dragging') || !this.is('valid')) {
            this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed);
            this.current(this.closest(stage.x, delta.x !== 0 ? direction : this._drag.direction));
            this.invalidate('position');
            this.update();
            this._drag.direction = direction;
            if (Math.abs(delta.x) > 3 || new Date().getTime() - this._drag.time > 300) {
                this._drag.target.one('click.owl.core', function () { return false; });
            }
        }
        if (!this.is('dragging')) {
            return;
        }
        this.leave('dragging');
        this.trigger('dragged');
    };
	/**
	 * Gets absolute position of the closest item for a coordinate.
	 * @todo Setting `freeDrag` makes `closest` not reusable. See #165.
	 * @protected
	 * @param {Number} coordinate - The coordinate in pixel.
	 * @param {String} direction - The direction to check for the closest item. Ether `left` or `right`.
	 * @return {Number} - The absolute position of the closest item.
	 */
    Owl.prototype.closest = function (coordinate, direction) {
        var position = -1,
            pull = 30,
            width = this.width(),
            coordinates = this.coordinates();
        if (!this.settings.freeDrag) {
            $.each(coordinates, $.proxy(function (index, value) {
                if (direction === 'left' && coordinate > value - pull && coordinate < value + pull) {
                    position = index;
                } else if (direction === 'right' && coordinate > value - width - pull && coordinate < value - width + pull) {
                    position = index + 1;
                } else if (this.op(coordinate, '<', value)
                    && this.op(coordinate, '>', coordinates[index + 1] !== undefined ? coordinates[index + 1] : value - width)) {
                    position = direction === 'left' ? index + 1 : index;
                }
                return position === -1;
            }, this));
        }
        if (!this.settings.loop) {
            if (this.op(coordinate, '>', coordinates[this.minimum()])) {
                position = coordinate = this.minimum();
            } else if (this.op(coordinate, '<', coordinates[this.maximum()])) {
                position = coordinate = this.maximum();
            }
        }
        return position;
    };
	/**
	 * Animates the stage.
	 * @todo #270
	 * @public
	 * @param {Number} coordinate - The coordinate in pixels.
	 */
    Owl.prototype.animate = function (coordinate) {
        var animate = this.speed() > 0;
        this.is('animating') && this.onTransitionEnd();
        if (animate) {
            this.enter('animating');
            this.trigger('translate');
        }
        if ($.support.transform3d && $.support.transition) {
            this.$stage.css({
                transform: 'translate3d(' + coordinate + 'px,0px,0px)',
                transition: (this.speed() / 1000) + 's' + (
                    this.settings.slideTransition ? ' ' + this.settings.slideTransition : ''
                )
            });
        } else if (animate) {
            this.$stage.animate({
                left: coordinate + 'px'
            }, this.speed(), this.settings.fallbackEasing, $.proxy(this.onTransitionEnd, this));
        } else {
            this.$stage.css({
                left: coordinate + 'px'
            });
        }
    };
	/**
	 * Checks whether the carousel is in a specific state or not.
	 * @param {String} state - The state to check.
	 * @returns {Boolean} - The flag which indicates if the carousel is busy.
	 */
    Owl.prototype.is = function (state) {
        return this._states.current[state] && this._states.current[state] > 0;
    };
	/**
	 * Sets the absolute position of the current item.
	 * @public
	 * @param {Number} [position] - The new absolute position or nothing to leave it unchanged.
	 * @returns {Number} - The absolute position of the current item.
	 */
    Owl.prototype.current = function (position) {
        if (position === undefined) {
            return this._current;
        }
        if (this._items.length === 0) {
            return undefined;
        }
        position = this.normalize(position);
        if (this._current !== position) {
            var event = this.trigger('change', { property: { name: 'position', value: position } });
            if (event.data !== undefined) {
                position = this.normalize(event.data);
            }
            this._current = position;
            this.invalidate('position');
            this.trigger('changed', { property: { name: 'position', value: this._current } });
        }
        return this._current;
    };
	/**
	 * Invalidates the given part of the update routine.
	 * @param {String} [part] - The part to invalidate.
	 * @returns {Array.<String>} - The invalidated parts.
	 */
    Owl.prototype.invalidate = function (part) {
        if ($.type(part) === 'string') {
            this._invalidated[part] = true;
            this.is('valid') && this.leave('valid');
        }
        return $.map(this._invalidated, function (v, i) { return i });
    };
	/**
	 * Resets the absolute position of the current item.
	 * @public
	 * @param {Number} position - The absolute position of the new item.
	 */
    Owl.prototype.reset = function (position) {
        position = this.normalize(position);
        if (position === undefined) {
            return;
        }
        this._speed = 0;
        this._current = position;
        this.suppress(['translate', 'translated']);
        this.animate(this.coordinates(position));
        this.release(['translate', 'translated']);
    };
	/**
	 * Normalizes an absolute or a relative position of an item.
	 * @public
	 * @param {Number} position - The absolute or relative position to normalize.
	 * @param {Boolean} [relative=false] - Whether the given position is relative or not.
	 * @returns {Number} - The normalized position.
	 */
    Owl.prototype.normalize = function (position, relative) {
        var n = this._items.length,
            m = relative ? 0 : this._clones.length;
        if (!this.isNumeric(position) || n < 1) {
            position = undefined;
        } else if (position < 0 || position >= n + m) {
            position = ((position - m / 2) % n + n) % n + m / 2;
        }
        return position;
    };
	/**
	 * Converts an absolute position of an item into a relative one.
	 * @public
	 * @param {Number} position - The absolute position to convert.
	 * @returns {Number} - The converted position.
	 */
    Owl.prototype.relative = function (position) {
        position -= this._clones.length / 2;
        return this.normalize(position, true);
    };
	/**
	 * Gets the maximum position for the current item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
    Owl.prototype.maximum = function (relative) {
        var settings = this.settings,
            maximum = this._coordinates.length,
            iterator,
            reciprocalItemsWidth,
            elementWidth;
        if (settings.loop) {
            maximum = this._clones.length / 2 + this._items.length - 1;
        } else if (settings.autoWidth || settings.merge) {
            iterator = this._items.length;
            if (iterator) {
                reciprocalItemsWidth = this._items[--iterator].width();
                elementWidth = this.$element.width();
                while (iterator--) {
                    reciprocalItemsWidth += this._items[iterator].width() + this.settings.margin;
                    if (reciprocalItemsWidth > elementWidth) {
                        break;
                    }
                }
            }
            maximum = iterator + 1;
        } else if (settings.center) {
            maximum = this._items.length - 1;
        } else {
            maximum = this._items.length - settings.items;
        }
        if (relative) {
            maximum -= this._clones.length / 2;
        }
        return Math.max(maximum, 0);
    };
	/**
	 * Gets the minimum position for the current item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
    Owl.prototype.minimum = function (relative) {
        return relative ? 0 : this._clones.length / 2;
    };
	/**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
    Owl.prototype.items = function (position) {
        if (position === undefined) {
            return this._items.slice();
        }
        position = this.normalize(position, true);
        return this._items[position];
    };
	/**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
    Owl.prototype.mergers = function (position) {
        if (position === undefined) {
            return this._mergers.slice();
        }
        position = this.normalize(position, true);
        return this._mergers[position];
    };
	/**
	 * Gets the absolute positions of clones for an item.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @returns {Array.<Number>} - The absolute positions of clones for the item or all if no position was given.
	 */
    Owl.prototype.clones = function (position) {
        var odd = this._clones.length / 2,
            even = odd + this._items.length,
            map = function (index) { return index % 2 === 0 ? even + index / 2 : odd - (index + 1) / 2 };
        if (position === undefined) {
            return $.map(this._clones, function (v, i) { return map(i) });
        }
        return $.map(this._clones, function (v, i) { return v === position ? map(i) : null });
    };
	/**
	 * Sets the current animation speed.
	 * @public
	 * @param {Number} [speed] - The animation speed in milliseconds or nothing to leave it unchanged.
	 * @returns {Number} - The current animation speed in milliseconds.
	 */
    Owl.prototype.speed = function (speed) {
        if (speed !== undefined) {
            this._speed = speed;
        }
        return this._speed;
    };
	/**
	 * Gets the coordinate of an item.
	 * @todo The name of this method is missleanding.
	 * @public
	 * @param {Number} position - The absolute position of the item within `minimum()` and `maximum()`.
	 * @returns {Number|Array.<Number>} - The coordinate of the item in pixel or all coordinates.
	 */
    Owl.prototype.coordinates = function (position) {
        var multiplier = 1,
            newPosition = position - 1,
            coordinate;
        if (position === undefined) {
            return $.map(this._coordinates, $.proxy(function (coordinate, index) {
                return this.coordinates(index);
            }, this));
        }
        if (this.settings.center) {
            if (this.settings.rtl) {
                multiplier = -1;
                newPosition = position + 1;
            }
            coordinate = this._coordinates[position];
            coordinate += (this.width() - coordinate + (this._coordinates[newPosition] || 0)) / 2 * multiplier;
        } else {
            coordinate = this._coordinates[newPosition] || 0;
        }
        coordinate = Math.ceil(coordinate);
        return coordinate;
    };
	/**
	 * Calculates the speed for a translation.
	 * @protected
	 * @param {Number} from - The absolute position of the start item.
	 * @param {Number} to - The absolute position of the target item.
	 * @param {Number} [factor=undefined] - The time factor in milliseconds.
	 * @returns {Number} - The time in milliseconds for the translation.
	 */
    Owl.prototype.duration = function (from, to, factor) {
        if (factor === 0) {
            return 0;
        }
        return Math.min(Math.max(Math.abs(to - from), 1), 6) * Math.abs((factor || this.settings.smartSpeed));
    };
	/**
	 * Slides to the specified item.
	 * @public
	 * @param {Number} position - The position of the item.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
    Owl.prototype.to = function (position, speed) {
        var current = this.current(),
            revert = null,
            distance = position - this.relative(current),
            direction = (distance > 0) - (distance < 0),
            items = this._items.length,
            minimum = this.minimum(),
            maximum = this.maximum();
        if (this.settings.loop) {
            if (!this.settings.rewind && Math.abs(distance) > items / 2) {
                distance += direction * -1 * items;
            }
            position = current + distance;
            revert = ((position - minimum) % items + items) % items + minimum;
            if (revert !== position && revert - distance <= maximum && revert - distance > 0) {
                current = revert - distance;
                position = revert;
                this.reset(current);
            }
        } else if (this.settings.rewind) {
            maximum += 1;
            position = (position % maximum + maximum) % maximum;
        } else {
            position = Math.max(minimum, Math.min(maximum, position));
        }
        this.speed(this.duration(current, position, speed));
        this.current(position);
        if (this.isVisible()) {
            this.update();
        }
    };
	/**
	 * Slides to the next item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
    Owl.prototype.next = function (speed) {
        speed = speed || false;
        this.to(this.relative(this.current()) + 1, speed);
    };
	/**
	 * Slides to the previous item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
    Owl.prototype.prev = function (speed) {
        speed = speed || false;
        this.to(this.relative(this.current()) - 1, speed);
    };
	/**
	 * Handles the end of an animation.
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
    Owl.prototype.onTransitionEnd = function (event) {
        if (event !== undefined) {
            event.stopPropagation();
            if ((event.target || event.srcElement || event.originalTarget) !== this.$stage.get(0)) {
                return false;
            }
        }
        this.leave('animating');
        this.trigger('translated');
    };
	/**
	 * Gets viewport width.
	 * @protected
	 * @return {Number} - The width in pixel.
	 */
    Owl.prototype.viewport = function () {
        var width;
        if (this.options.responsiveBaseElement !== window) {
            width = $(this.options.responsiveBaseElement).width();
        } else if (window.innerWidth) {
            width = window.innerWidth;
        } else if (document.documentElement && document.documentElement.clientWidth) {
            width = document.documentElement.clientWidth;
        } else {
            console.warn('Can not detect viewport width.');
        }
        return width;
    };
	/**
	 * Replaces the current content.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The new content.
	 */
    Owl.prototype.replace = function (content) {
        this.$stage.empty();
        this._items = [];
        if (content) {
            content = (content instanceof jQuery) ? content : $(content);
        }
        if (this.settings.nestedItemSelector) {
            content = content.find('.' + this.settings.nestedItemSelector);
        }
        content.filter(function () {
            return this.nodeType === 1;
        }).each($.proxy(function (index, item) {
            item = this.prepare(item);
            this.$stage.append(item);
            this._items.push(item);
            this._mergers.push(item.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
        }, this));
        this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);
        this.invalidate('items');
    };
	/**
	 * Adds an item.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The item content to add.
	 * @param {Number} [position] - The relative position at which to insert the item otherwise the item will be added to the end.
	 */
    Owl.prototype.add = function (content, position) {
        var current = this.relative(this._current);
        position = position === undefined ? this._items.length : this.normalize(position, true);
        content = content instanceof jQuery ? content : $(content);
        this.trigger('add', { content: content, position: position });
        content = this.prepare(content);
        if (this._items.length === 0 || position === this._items.length) {
            this._items.length === 0 && this.$stage.append(content);
            this._items.length !== 0 && this._items[position - 1].after(content);
            this._items.push(content);
            this._mergers.push(content.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
        } else {
            this._items[position].before(content);
            this._items.splice(position, 0, content);
            this._mergers.splice(position, 0, content.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1);
        }
        this._items[current] && this.reset(this._items[current].index());
        this.invalidate('items');
        this.trigger('added', { content: content, position: position });
    };
	/**
	 * Removes an item by its position.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {Number} position - The relative position of the item to remove.
	 */
    Owl.prototype.remove = function (position) {
        position = this.normalize(position, true);
        if (position === undefined) {
            return;
        }
        this.trigger('remove', { content: this._items[position], position: position });
        this._items[position].remove();
        this._items.splice(position, 1);
        this._mergers.splice(position, 1);
        this.invalidate('items');
        this.trigger('removed', { content: null, position: position });
    };
	/**
	 * Preloads images with auto width.
	 * @todo Replace by a more generic approach
	 * @protected
	 */
    Owl.prototype.preloadAutoWidthImages = function (images) {
        images.each($.proxy(function (i, element) {
            this.enter('pre-loading');
            element = $(element);
            $(new Image()).one('load', $.proxy(function (e) {
                element.attr('src', e.target.src);
                element.css('opacity', 1);
                this.leave('pre-loading');
                !this.is('pre-loading') && !this.is('initializing') && this.refresh();
            }, this)).attr('src', element.attr('src') || element.attr('data-src') || element.attr('data-src-retina'));
        }, this));
    };
	/**
	 * Destroys the carousel.
	 * @public
	 */
    Owl.prototype.destroy = function () {
        this.$element.off('.owl.core');
        this.$stage.off('.owl.core');
        $(document).off('.owl.core');
        if (this.settings.responsive !== false) {
            window.clearTimeout(this.resizeTimer);
            this.off(window, 'resize', this._handlers.onThrottledResize);
        }
        for (var i in this._plugins) {
            this._plugins[i].destroy();
        }
        this.$stage.children('.cloned').remove();
        this.$stage.unwrap();
        this.$stage.children().contents().unwrap();
        this.$stage.children().unwrap();
        this.$stage.remove();
        this.$element
            .removeClass(this.options.refreshClass)
            .removeClass(this.options.loadingClass)
            .removeClass(this.options.loadedClass)
            .removeClass(this.options.rtlClass)
            .removeClass(this.options.dragClass)
            .removeClass(this.options.grabClass)
            .attr('class', this.$element.attr('class').replace(new RegExp(this.options.responsiveClass + '-\\S+\\s', 'g'), ''))
            .removeData('owl.carousel');
    };
	/**
	 * Operators to calculate right-to-left and left-to-right.
	 * @protected
	 * @param {Number} [a] - The left side operand.
	 * @param {String} [o] - The operator.
	 * @param {Number} [b] - The right side operand.
	 */
    Owl.prototype.op = function (a, o, b) {
        var rtl = this.settings.rtl;
        switch (o) {
            case '<':
                return rtl ? a > b : a < b;
            case '>':
                return rtl ? a < b : a > b;
            case '>=':
                return rtl ? a <= b : a >= b;
            case '<=':
                return rtl ? a >= b : a <= b;
            default:
                break;
        }
    };
	/**
	 * Attaches to an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The event handler to attach.
	 * @param {Boolean} capture - Wether the event should be handled at the capturing phase or not.
	 */
    Owl.prototype.on = function (element, event, listener, capture) {
        if (element.addEventListener) {
            element.addEventListener(event, listener, capture);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, listener);
        }
    };
	/**
	 * Detaches from an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The attached event handler to detach.
	 * @param {Boolean} capture - Wether the attached event handler was registered as a capturing listener or not.
	 */
    Owl.prototype.off = function (element, event, listener, capture) {
        if (element.removeEventListener) {
            element.removeEventListener(event, listener, capture);
        } else if (element.detachEvent) {
            element.detachEvent('on' + event, listener);
        }
    };
	/**
	 * Triggers a public event.
	 * @todo Remove `status`, `relatedTarget` should be used instead.
	 * @protected
	 * @param {String} name - The event name.
	 * @param {*} [data=null] - The event data.
	 * @param {String} [namespace=carousel] - The event namespace.
	 * @param {String} [state] - The state which is associated with the event.
	 * @param {Boolean} [enter=false] - Indicates if the call enters the specified state or not.
	 * @returns {Event} - The event arguments.
	 */
    Owl.prototype.trigger = function (name, data, namespace, state, enter) {
        var status = {
            item: { count: this._items.length, index: this.current() }
        }, handler = $.camelCase(
            $.grep(['on', name, namespace], function (v) { return v })
                .join('-').toLowerCase()
        ), event = $.Event(
            [name, 'owl', namespace || 'carousel'].join('.').toLowerCase(),
            $.extend({ relatedTarget: this }, status, data)
        );
        if (!this._supress[name]) {
            $.each(this._plugins, function (name, plugin) {
                if (plugin.onTrigger) {
                    plugin.onTrigger(event);
                }
            });
            this.register({ type: Owl.Type.Event, name: name });
            this.$element.trigger(event);
            if (this.settings && typeof this.settings[handler] === 'function') {
                this.settings[handler].call(this, event);
            }
        }
        return event;
    };
	/**
	 * Enters a state.
	 * @param name - The state name.
	 */
    Owl.prototype.enter = function (name) {
        $.each([name].concat(this._states.tags[name] || []), $.proxy(function (i, name) {
            if (this._states.current[name] === undefined) {
                this._states.current[name] = 0;
            }
            this._states.current[name]++;
        }, this));
    };
	/**
	 * Leaves a state.
	 * @param name - The state name.
	 */
    Owl.prototype.leave = function (name) {
        $.each([name].concat(this._states.tags[name] || []), $.proxy(function (i, name) {
            this._states.current[name]--;
        }, this));
    };
	/**
	 * Registers an event or state.
	 * @public
	 * @param {Object} object - The event or state to register.
	 */
    Owl.prototype.register = function (object) {
        if (object.type === Owl.Type.Event) {
            if (!$.event.special[object.name]) {
                $.event.special[object.name] = {};
            }
            if (!$.event.special[object.name].owl) {
                var _default = $.event.special[object.name]._default;
                $.event.special[object.name]._default = function (e) {
                    if (_default && _default.apply && (!e.namespace || e.namespace.indexOf('owl') === -1)) {
                        return _default.apply(this, arguments);
                    }
                    return e.namespace && e.namespace.indexOf('owl') > -1;
                };
                $.event.special[object.name].owl = true;
            }
        } else if (object.type === Owl.Type.State) {
            if (!this._states.tags[object.name]) {
                this._states.tags[object.name] = object.tags;
            } else {
                this._states.tags[object.name] = this._states.tags[object.name].concat(object.tags);
            }
            this._states.tags[object.name] = $.grep(this._states.tags[object.name], $.proxy(function (tag, i) {
                return $.inArray(tag, this._states.tags[object.name]) === i;
            }, this));
        }
    };
	/**
	 * Suppresses events.
	 * @protected
	 * @param {Array.<String>} events - The events to suppress.
	 */
    Owl.prototype.suppress = function (events) {
        $.each(events, $.proxy(function (index, event) {
            this._supress[event] = true;
        }, this));
    };
	/**
	 * Releases suppressed events.
	 * @protected
	 * @param {Array.<String>} events - The events to release.
	 */
    Owl.prototype.release = function (events) {
        $.each(events, $.proxy(function (index, event) {
            delete this._supress[event];
        }, this));
    };
	/**
	 * Gets unified pointer coordinates from event.
	 * @todo #261
	 * @protected
	 * @param {Event} - The `mousedown` or `touchstart` event.
	 * @returns {Object} - Contains `x` and `y` coordinates of current pointer position.
	 */
    Owl.prototype.pointer = function (event) {
        var result = { x: null, y: null };
        event = event.originalEvent || event || window.event;
        event = event.touches && event.touches.length ?
            event.touches[0] : event.changedTouches && event.changedTouches.length ?
                event.changedTouches[0] : event;
        if (event.pageX) {
            result.x = event.pageX;
            result.y = event.pageY;
        } else {
            result.x = event.clientX;
            result.y = event.clientY;
        }
        return result;
    };
	/**
	 * Determines if the input is a Number or something that can be coerced to a Number
	 * @protected
	 * @param {Number|String|Object|Array|Boolean|RegExp|Function|Symbol} - The input to be tested
	 * @returns {Boolean} - An indication if the input is a Number or can be coerced to a Number
	 */
    Owl.prototype.isNumeric = function (number) {
        return !isNaN(parseFloat(number));
    };
	/**
	 * Gets the difference of two vectors.
	 * @todo #261
	 * @protected
	 * @param {Object} - The first vector.
	 * @param {Object} - The second vector.
	 * @returns {Object} - The difference.
	 */
    Owl.prototype.difference = function (first, second) {
        return {
            x: first.x - second.x,
            y: first.y - second.y
        };
    };
	/**
	 * The jQuery Plugin for the Owl Carousel
	 * @todo Navigation plugin `next` and `prev`
	 * @public
	 */
    $.fn.owlCarousel = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var $this = $(this),
                data = $this.data('owl.carousel');
            if (!data) {
                data = new Owl(this, typeof option == 'object' && option);
                $this.data('owl.carousel', data);
                $.each([
                    'next', 'prev', 'to', 'destroy', 'refresh', 'replace', 'add', 'remove'
                ], function (i, event) {
                    data.register({ type: Owl.Type.Event, name: event });
                    data.$element.on(event + '.owl.carousel.core', $.proxy(function (e) {
                        if (e.namespace && e.relatedTarget !== this) {
                            this.suppress([event]);
                            data[event].apply(this, [].slice.call(arguments, 1));
                            this.release([event]);
                        }
                    }, data));
                });
            }
            if (typeof option == 'string' && option.charAt(0) !== '_') {
                data[option].apply(data, args);
            }
        });
    };
	/**
	 * The constructor for the jQuery Plugin
	 * @public
	 */
    $.fn.owlCarousel.Constructor = Owl;
})(window.Zepto || window.jQuery, window, document);
/**
 * AutoRefresh Plugin
 * @version 2.3.4
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {
	/**
	 * Creates the auto refresh plugin.
	 * @class The Auto Refresh Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
    var AutoRefresh = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
        this._core = carousel;
		/**
		 * Refresh interval.
		 * @protected
		 * @type {number}
		 */
        this._interval = null;
		/**
		 * Whether the element is currently visible or not.
		 * @protected
		 * @type {Boolean}
		 */
        this._visible = null;
		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
        this._handlers = {
            'initialized.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.autoRefresh) {
                    this.watch();
                }
            }, this)
        };
        this._core.options = $.extend({}, AutoRefresh.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
    };
	/**
	 * Default options.
	 * @public
	 */
    AutoRefresh.Defaults = {
        autoRefresh: true,
        autoRefreshInterval: 500
    };
	/**
	 * Watches the element.
	 */
    AutoRefresh.prototype.watch = function () {
        if (this._interval) {
            return;
        }
        this._visible = this._core.isVisible();
        this._interval = window.setInterval($.proxy(this.refresh, this), this._core.settings.autoRefreshInterval);
    };
	/**
	 * Refreshes the element.
	 */
    AutoRefresh.prototype.refresh = function () {
        if (this._core.isVisible() === this._visible) {
            return;
        }
        this._visible = !this._visible;
        this._core.$element.toggleClass('owl-hidden', !this._visible);
        this._visible && (this._core.invalidate('width') && this._core.refresh());
    };
	/**
	 * Destroys the plugin.
	 */
    AutoRefresh.prototype.destroy = function () {
        var handler, property;
        window.clearInterval(this._interval);
        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.AutoRefresh = AutoRefresh;
})(window.Zepto || window.jQuery, window, document);
/**
 * Lazy Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {
	/**
	 * Creates the lazy plugin.
	 * @class The Lazy Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
    var Lazy = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
        this._core = carousel;
		/**
		 * Already loaded items.
		 * @protected
		 * @type {Array.<jQuery>}
		 */
        this._loaded = [];
		/**
		 * Event handlers.
		 * @protected
		 * @type {Object}
		 */
        this._handlers = {
            'initialized.owl.carousel change.owl.carousel resized.owl.carousel': $.proxy(function (e) {
                if (!e.namespace) {
                    return;
                }
                if (!this._core.settings || !this._core.settings.lazyLoad) {
                    return;
                }
                if ((e.property && e.property.name == 'position') || e.type == 'initialized') {
                    var settings = this._core.settings,
                        n = (settings.center && Math.ceil(settings.items / 2) || settings.items),
                        i = ((settings.center && n * -1) || 0),
                        position = (e.property && e.property.value !== undefined ? e.property.value : this._core.current()) + i,
                        clones = this._core.clones().length,
                        load = $.proxy(function (i, v) { this.load(v) }, this);
                    if (settings.lazyLoadEager > 0) {
                        n += settings.lazyLoadEager;
                        if (settings.loop) {
                            position -= settings.lazyLoadEager;
                            n++;
                        }
                    }
                    while (i++ < n) {
                        this.load(clones / 2 + this._core.relative(position));
                        clones && $.each(this._core.clones(this._core.relative(position)), load);
                        position++;
                    }
                }
            }, this)
        };
        this._core.options = $.extend({}, Lazy.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
    };
	/**
	 * Default options.
	 * @public
	 */
    Lazy.Defaults = {
        lazyLoad: false,
        lazyLoadEager: 0
    };
	/**
	 * Loads all resources of an item at the specified position.
	 * @param {Number} position - The absolute position of the item.
	 * @protected
	 */
    Lazy.prototype.load = function (position) {
        var $item = this._core.$stage.children().eq(position),
            $elements = $item && $item.find('.owl-lazy');
        if (!$elements || $.inArray($item.get(0), this._loaded) > -1) {
            return;
        }
        $elements.each($.proxy(function (index, element) {
            var $element = $(element), image,
                url = (window.devicePixelRatio > 1 && $element.attr('data-src-retina')) || $element.attr('data-src') || $element.attr('data-srcset');
            this._core.trigger('load', { element: $element, url: url }, 'lazy');
            if ($element.is('img')) {
                $element.one('load.owl.lazy', $.proxy(function () {
                    $element.css('opacity', 1);
                    this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
                }, this)).attr('src', url);
            } else if ($element.is('source')) {
                $element.one('load.owl.lazy', $.proxy(function () {
                    this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
                }, this)).attr('srcset', url);
            } else {
                image = new Image();
                image.onload = $.proxy(function () {
                    $element.css({
                        'background-image': 'url("' + url + '")',
                        'opacity': '1'
                    });
                    this._core.trigger('loaded', { element: $element, url: url }, 'lazy');
                }, this);
                image.src = url;
            }
        }, this));
        this._loaded.push($item.get(0));
    };
	/**
	 * Destroys the plugin.
	 * @public
	 */
    Lazy.prototype.destroy = function () {
        var handler, property;
        for (handler in this.handlers) {
            this._core.$element.off(handler, this.handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.Lazy = Lazy;
})(window.Zepto || window.jQuery, window, document);
/**
 * AutoHeight Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {
	/**
	 * Creates the auto height plugin.
	 * @class The Auto Height Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
    var AutoHeight = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
        this._core = carousel;
        this._previousHeight = null;
		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
        this._handlers = {
            'initialized.owl.carousel refreshed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.autoHeight) {
                    this.update();
                }
            }, this),
            'changed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.autoHeight && e.property.name === 'position') {
                    this.update();
                }
            }, this),
            'loaded.owl.lazy': $.proxy(function (e) {
                if (e.namespace && this._core.settings.autoHeight
                    && e.element.closest('.' + this._core.settings.itemClass).index() === this._core.current()) {
                    this.update();
                }
            }, this)
        };
        this._core.options = $.extend({}, AutoHeight.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
        this._intervalId = null;
        var refThis = this;
        $(window).on('load', function () {
            if (refThis._core.settings.autoHeight) {
                refThis.update();
            }
        });
        $(window).resize(function () {
            if (refThis._core.settings.autoHeight) {
                if (refThis._intervalId != null) {
                    clearTimeout(refThis._intervalId);
                }
                refThis._intervalId = setTimeout(function () {
                    refThis.update();
                }, 250);
            }
        });
    };
	/**
	 * Default options.
	 * @public
	 */
    AutoHeight.Defaults = {
        autoHeight: false,
        autoHeightClass: 'owl-height'
    };
	/**
	 * Updates the view.
	 */
    AutoHeight.prototype.update = function () {
        var start = this._core._current,
            end = start + this._core.settings.items,
            lazyLoadEnabled = this._core.settings.lazyLoad,
            visible = this._core.$stage.children().toArray().slice(start, end),
            heights = [],
            maxheight = 0;
        $.each(visible, function (index, item) {
            heights.push($(item).height());
        });
        maxheight = Math.max.apply(null, heights);
        if (maxheight <= 1 && lazyLoadEnabled && this._previousHeight) {
            maxheight = this._previousHeight;
        }
        this._previousHeight = maxheight;
        this._core.$stage.parent()
            .height(maxheight)
            .addClass(this._core.settings.autoHeightClass);
    };
    AutoHeight.prototype.destroy = function () {
        var handler, property;
        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] !== 'function' && (this[property] = null);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.AutoHeight = AutoHeight;
})(window.Zepto || window.jQuery, window, document);
/**
 * Video Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {
	/**
	 * Creates the video plugin.
	 * @class The Video Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
    var Video = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
        this._core = carousel;
		/**
		 * Cache all video URLs.
		 * @protected
		 * @type {Object}
		 */
        this._videos = {};
		/**
		 * Current playing item.
		 * @protected
		 * @type {jQuery}
		 */
        this._playing = null;
		/**
		 * All event handlers.
		 * @todo The cloned content removale is too late
		 * @protected
		 * @type {Object}
		 */
        this._handlers = {
            'initialized.owl.carousel': $.proxy(function (e) {
                if (e.namespace) {
                    this._core.register({ type: 'state', name: 'playing', tags: ['interacting'] });
                }
            }, this),
            'resize.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.video && this.isInFullScreen()) {
                    e.preventDefault();
                }
            }, this),
            'refreshed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.is('resizing')) {
                    this._core.$stage.find('.cloned .owl-video-frame').remove();
                }
            }, this),
            'changed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && e.property.name === 'position' && this._playing) {
                    this.stop();
                }
            }, this),
            'prepared.owl.carousel': $.proxy(function (e) {
                if (!e.namespace) {
                    return;
                }
                var $element = $(e.content).find('.owl-video');
                if ($element.length) {
                    $element.css('display', 'none');
                    this.fetch($element, $(e.content));
                }
            }, this)
        };
        this._core.options = $.extend({}, Video.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
        this._core.$element.on('click.owl.video', '.owl-video-play-icon', $.proxy(function (e) {
            this.play(e);
        }, this));
    };
	/**
	 * Default options.
	 * @public
	 */
    Video.Defaults = {
        video: false,
        videoHeight: false,
        videoWidth: false
    };
	/**
	 * Gets the video ID and the type (YouTube/Vimeo/vzaar only).
	 * @protected
	 * @param {jQuery} target - The target containing the video data.
	 * @param {jQuery} item - The item containing the video.
	 */
    Video.prototype.fetch = function (target, item) {
        var type = (function () {
            if (target.attr('data-vimeo-id')) {
                return 'vimeo';
            } else if (target.attr('data-vzaar-id')) {
                return 'vzaar'
            } else {
                return 'youtube';
            }
        })(),
            id = target.attr('data-vimeo-id') || target.attr('data-youtube-id') || target.attr('data-vzaar-id'),
            width = target.attr('data-width') || this._core.settings.videoWidth,
            height = target.attr('data-height') || this._core.settings.videoHeight,
            url = target.attr('href');
        if (url) {
			/*
					Parses the id's out of the following urls (and probably more):
					https://www.youtube.com/watch?v=:id
					https://youtu.be/:id
					https://vimeo.com/:id
					https://vimeo.com/channels/:channel/:id
					https://vimeo.com/groups/:group/videos/:id
					https://app.vzaar.com/videos/:id
					Visual example: https://regexper.com/#(http%3A%7Chttps%3A%7C)%5C%2F%5C%2F(player.%7Cwww.%7Capp.)%3F(vimeo%5C.com%7Cyoutu(be%5C.com%7C%5C.be%7Cbe%5C.googleapis%5C.com)%7Cvzaar%5C.com)%5C%2F(video%5C%2F%7Cvideos%5C%2F%7Cembed%5C%2F%7Cchannels%5C%2F.%2B%5C%2F%7Cgroups%5C%2F.%2B%5C%2F%7Cwatch%5C%3Fv%3D%7Cv%5C%2F)%3F(%5BA-Za-z0-9._%25-%5D*)(%5C%26%5CS%2B)%3F
			*/
            id = url.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
            if (id[3].indexOf('youtu') > -1) {
                type = 'youtube';
            } else if (id[3].indexOf('vimeo') > -1) {
                type = 'vimeo';
            } else if (id[3].indexOf('vzaar') > -1) {
                type = 'vzaar';
            } else {
                throw new Error('Video URL not supported.');
            }
            id = id[6];
        } else {
            throw new Error('Missing video URL.');
        }
        this._videos[url] = {
            type: type,
            id: id,
            width: width,
            height: height
        };
        item.attr('data-video', url);
        this.thumbnail(target, this._videos[url]);
    };
	/**
	 * Creates video thumbnail.
	 * @protected
	 * @param {jQuery} target - The target containing the video data.
	 * @param {Object} info - The video info object.
	 * @see `fetch`
	 */
    Video.prototype.thumbnail = function (target, video) {
        var tnLink,
            icon,
            path,
            dimensions = video.width && video.height ? 'width:' + video.width + 'px;height:' + video.height + 'px;' : '',
            customTn = target.find('img'),
            srcType = 'src',
            lazyClass = '',
            settings = this._core.settings,
            create = function (path) {
                icon = '<div class="owl-video-play-icon"></div>';
                if (settings.lazyLoad) {
                    tnLink = $('<div/>', {
                        "class": 'owl-video-tn ' + lazyClass,
                        "srcType": path
                    });
                } else {
                    tnLink = $('<div/>', {
                        "class": "owl-video-tn",
                        "style": 'opacity:1;background-image:url(' + path + ')'
                    });
                }
                target.after(tnLink);
                target.after(icon);
            };
        target.wrap($('<div/>', {
            "class": "owl-video-wrapper",
            "style": dimensions
        }));
        if (this._core.settings.lazyLoad) {
            srcType = 'data-src';
            lazyClass = 'owl-lazy';
        }
        if (customTn.length) {
            create(customTn.attr(srcType));
            customTn.remove();
            return false;
        }
        if (video.type === 'youtube') {
            path = "//img.youtube.com/vi/" + video.id + "/hqdefault.jpg";
            create(path);
        } else if (video.type === 'vimeo') {
            $.ajax({
                type: 'GET',
                url: '//vimeo.com/api/v2/video/' + video.id + '.json',
                jsonp: 'callback',
                dataType: 'jsonp',
                success: function (data) {
                    path = data[0].thumbnail_large;
                    create(path);
                }
            });
        } else if (video.type === 'vzaar') {
            $.ajax({
                type: 'GET',
                url: '//vzaar.com/api/videos/' + video.id + '.json',
                jsonp: 'callback',
                dataType: 'jsonp',
                success: function (data) {
                    path = data.framegrab_url;
                    create(path);
                }
            });
        }
    };
	/**
	 * Stops the current video.
	 * @public
	 */
    Video.prototype.stop = function () {
        this._core.trigger('stop', null, 'video');
        this._playing.find('.owl-video-frame').remove();
        this._playing.removeClass('owl-video-playing');
        this._playing = null;
        this._core.leave('playing');
        this._core.trigger('stopped', null, 'video');
    };
	/**
	 * Starts the current video.
	 * @public
	 * @param {Event} event - The event arguments.
	 */
    Video.prototype.play = function (event) {
        var target = $(event.target),
            item = target.closest('.' + this._core.settings.itemClass),
            video = this._videos[item.attr('data-video')],
            width = video.width || '100%',
            height = video.height || this._core.$stage.height(),
            html,
            iframe;
        if (this._playing) {
            return;
        }
        this._core.enter('playing');
        this._core.trigger('play', null, 'video');
        item = this._core.items(this._core.relative(item.index()));
        this._core.reset(item.index());
        html = $('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>');
        html.attr('height', height);
        html.attr('width', width);
        if (video.type === 'youtube') {
            html.attr('src', '//www.youtube.com/embed/' + video.id + '?autoplay=1&rel=0&v=' + video.id);
        } else if (video.type === 'vimeo') {
            html.attr('src', '//player.vimeo.com/video/' + video.id + '?autoplay=1');
        } else if (video.type === 'vzaar') {
            html.attr('src', '//view.vzaar.com/' + video.id + '/player?autoplay=true');
        }
        iframe = $(html).wrap('<div class="owl-video-frame" />').insertAfter(item.find('.owl-video'));
        this._playing = item.addClass('owl-video-playing');
    };
	/**
	 * Checks whether an video is currently in full screen mode or not.
	 * @todo Bad style because looks like a readonly method but changes members.
	 * @protected
	 * @returns {Boolean}
	 */
    Video.prototype.isInFullScreen = function () {
        var element = document.fullscreenElement || document.mozFullScreenElement ||
            document.webkitFullscreenElement;
        return element && $(element).parent().hasClass('owl-video-frame');
    };
	/**
	 * Destroys the plugin.
	 */
    Video.prototype.destroy = function () {
        var handler, property;
        this._core.$element.off('click.owl.video');
        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.Video = Video;
})(window.Zepto || window.jQuery, window, document);
/**
 * Animate Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {
	/**
	 * Creates the animate plugin.
	 * @class The Navigation Plugin
	 * @param {Owl} scope - The Owl Carousel
	 */
    var Animate = function (scope) {
        this.core = scope;
        this.core.options = $.extend({}, Animate.Defaults, this.core.options);
        this.swapping = true;
        this.previous = undefined;
        this.next = undefined;
        this.handlers = {
            'change.owl.carousel': $.proxy(function (e) {
                if (e.namespace && e.property.name == 'position') {
                    this.previous = this.core.current();
                    this.next = e.property.value;
                }
            }, this),
            'drag.owl.carousel dragged.owl.carousel translated.owl.carousel': $.proxy(function (e) {
                if (e.namespace) {
                    this.swapping = e.type == 'translated';
                }
            }, this),
            'translate.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn)) {
                    this.swap();
                }
            }, this)
        };
        this.core.$element.on(this.handlers);
    };
	/**
	 * Default options.
	 * @public
	 */
    Animate.Defaults = {
        animateOut: false,
        animateIn: false
    };
	/**
	 * Toggles the animation classes whenever an translations starts.
	 * @protected
	 * @returns {Boolean|undefined}
	 */
    Animate.prototype.swap = function () {
        if (this.core.settings.items !== 1) {
            return;
        }
        if (!$.support.animation || !$.support.transition) {
            return;
        }
        this.core.speed(0);
        var left,
            clear = $.proxy(this.clear, this),
            previous = this.core.$stage.children().eq(this.previous),
            next = this.core.$stage.children().eq(this.next),
            incoming = this.core.settings.animateIn,
            outgoing = this.core.settings.animateOut;
        if (this.core.current() === this.previous) {
            return;
        }
        if (outgoing) {
            left = this.core.coordinates(this.previous) - this.core.coordinates(this.next);
            previous.one($.support.animation.end, clear)
                .css({ 'left': left + 'px' })
                .addClass('animated owl-animated-out')
                .addClass(outgoing);
        }
        if (incoming) {
            next.one($.support.animation.end, clear)
                .addClass('animated owl-animated-in')
                .addClass(incoming);
        }
    };
    Animate.prototype.clear = function (e) {
        $(e.target).css({ 'left': '' })
            .removeClass('animated owl-animated-out owl-animated-in')
            .removeClass(this.core.settings.animateIn)
            .removeClass(this.core.settings.animateOut);
        this.core.onTransitionEnd();
    };
	/**
	 * Destroys the plugin.
	 * @public
	 */
    Animate.prototype.destroy = function () {
        var handler, property;
        for (handler in this.handlers) {
            this.core.$element.off(handler, this.handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.Animate = Animate;
})(window.Zepto || window.jQuery, window, document);
/**
 * Autoplay Plugin
 * @version 2.3.4
 * @author Bartosz Wojciechowski
 * @author Artus Kolanowski
 * @author David Deutsch
 * @author Tom De Caluwé
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {
	/**
	 * Creates the autoplay plugin.
	 * @class The Autoplay Plugin
	 * @param {Owl} scope - The Owl Carousel
	 */
    var Autoplay = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
        this._core = carousel;
		/**
		 * The autoplay timeout id.
		 * @type {Number}
		 */
        this._call = null;
		/**
		 * Depending on the state of the plugin, this variable contains either
		 * the start time of the timer or the current timer value if it's
		 * paused. Since we start in a paused state we initialize the timer
		 * value.
		 * @type {Number}
		 */
        this._time = 0;
		/**
		 * Stores the timeout currently used.
		 * @type {Number}
		 */
        this._timeout = 0;
		/**
		 * Indicates whenever the autoplay is paused.
		 * @type {Boolean}
		 */
        this._paused = true;
		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
        this._handlers = {
            'changed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && e.property.name === 'settings') {
                    if (this._core.settings.autoplay) {
                        this.play();
                    } else {
                        this.stop();
                    }
                } else if (e.namespace && e.property.name === 'position' && this._paused) {
                    this._time = 0;
                }
            }, this),
            'initialized.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.autoplay) {
                    this.play();
                }
            }, this),
            'play.owl.autoplay': $.proxy(function (e, t, s) {
                if (e.namespace) {
                    this.play(t, s);
                }
            }, this),
            'stop.owl.autoplay': $.proxy(function (e) {
                if (e.namespace) {
                    this.stop();
                }
            }, this),
            'mouseover.owl.autoplay': $.proxy(function () {
                if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
                    this.pause();
                }
            }, this),
            'mouseleave.owl.autoplay': $.proxy(function () {
                if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
                    this.play();
                }
            }, this),
            'touchstart.owl.core': $.proxy(function () {
                if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) {
                    this.pause();
                }
            }, this),
            'touchend.owl.core': $.proxy(function () {
                if (this._core.settings.autoplayHoverPause) {
                    this.play();
                }
            }, this)
        };
        this._core.$element.on(this._handlers);
        this._core.options = $.extend({}, Autoplay.Defaults, this._core.options);
    };
	/**
	 * Default options.
	 * @public
	 */
    Autoplay.Defaults = {
        autoplay: false,
        autoplayTimeout: 5000,
        autoplayHoverPause: false,
        autoplaySpeed: false
    };
	/**
	 * Transition to the next slide and set a timeout for the next transition.
	 * @private
	 * @param {Number} [speed] - The animation speed for the animations.
	 */
    Autoplay.prototype._next = function (speed) {
        this._call = window.setTimeout(
            $.proxy(this._next, this, speed),
            this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read()
        );
        if (this._core.is('interacting') || document.hidden) {
            return;
        }
        this._core.next(speed || this._core.settings.autoplaySpeed);
    }
	/**
	 * Reads the current timer value when the timer is playing.
	 * @public
	 */
    Autoplay.prototype.read = function () {
        return new Date().getTime() - this._time;
    };
	/**
	 * Starts the autoplay.
	 * @public
	 * @param {Number} [timeout] - The interval before the next animation starts.
	 * @param {Number} [speed] - The animation speed for the animations.
	 */
    Autoplay.prototype.play = function (timeout, speed) {
        var elapsed;
        if (!this._core.is('rotating')) {
            this._core.enter('rotating');
        }
        timeout = timeout || this._core.settings.autoplayTimeout;
        elapsed = Math.min(this._time % (this._timeout || timeout), timeout);
        if (this._paused) {
            this._time = this.read();
            this._paused = false;
        } else {
            window.clearTimeout(this._call);
        }
        this._time += this.read() % timeout - elapsed;
        this._timeout = timeout;
        this._call = window.setTimeout($.proxy(this._next, this, speed), timeout - elapsed);
    };
	/**
	 * Stops the autoplay.
	 * @public
	 */
    Autoplay.prototype.stop = function () {
        if (this._core.is('rotating')) {
            this._time = 0;
            this._paused = true;
            window.clearTimeout(this._call);
            this._core.leave('rotating');
        }
    };
	/**
	 * Pauses the autoplay.
	 * @public
	 */
    Autoplay.prototype.pause = function () {
        if (this._core.is('rotating') && !this._paused) {
            this._time = this.read();
            this._paused = true;
            window.clearTimeout(this._call);
        }
    };
	/**
	 * Destroys the plugin.
	 */
    Autoplay.prototype.destroy = function () {
        var handler, property;
        this.stop();
        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.autoplay = Autoplay;
})(window.Zepto || window.jQuery, window, document);
/**
 * Navigation Plugin
 * @version 2.3.4
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {
    'use strict';
	/**
	 * Creates the navigation plugin.
	 * @class The Navigation Plugin
	 * @param {Owl} carousel - The Owl Carousel.
	 */
    var Navigation = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
        this._core = carousel;
		/**
		 * Indicates whether the plugin is initialized or not.
		 * @protected
		 * @type {Boolean}
		 */
        this._initialized = false;
		/**
		 * The current paging indexes.
		 * @protected
		 * @type {Array}
		 */
        this._pages = [];
		/**
		 * All DOM elements of the user interface.
		 * @protected
		 * @type {Object}
		 */
        this._controls = {};
		/**
		 * Markup for an indicator.
		 * @protected
		 * @type {Array.<String>}
		 */
        this._templates = [];
		/**
		 * The carousel element.
		 * @type {jQuery}
		 */
        this.$element = this._core.$element;
		/**
		 * Overridden methods of the carousel.
		 * @protected
		 * @type {Object}
		 */
        this._overrides = {
            next: this._core.next,
            prev: this._core.prev,
            to: this._core.to
        };
		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
        this._handlers = {
            'prepared.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.dotsData) {
                    this._templates.push('<div class="' + this._core.settings.dotClass + '">' +
                        $(e.content).find('[data-dot]').addBack('[data-dot]').attr('data-dot') + '</div>');
                }
            }, this),
            'added.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.dotsData) {
                    this._templates.splice(e.position, 0, this._templates.pop());
                }
            }, this),
            'remove.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.dotsData) {
                    this._templates.splice(e.position, 1);
                }
            }, this),
            'changed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && e.property.name == 'position') {
                    this.draw();
                }
            }, this),
            'initialized.owl.carousel': $.proxy(function (e) {
                if (e.namespace && !this._initialized) {
                    this._core.trigger('initialize', null, 'navigation');
                    this.initialize();
                    this.update();
                    this.draw();
                    this._initialized = true;
                    this._core.trigger('initialized', null, 'navigation');
                }
            }, this),
            'refreshed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._initialized) {
                    this._core.trigger('refresh', null, 'navigation');
                    this.update();
                    this.draw();
                    this._core.trigger('refreshed', null, 'navigation');
                }
            }, this)
        };
        this._core.options = $.extend({}, Navigation.Defaults, this._core.options);
        this.$element.on(this._handlers);
    };
	/**
	 * Default options.
	 * @public
	 * @todo Rename `slideBy` to `navBy`
	 */
    Navigation.Defaults = {
        nav: false,
        navText: [
            '<span aria-label="' + 'Previous' + '">&#x2039;</span>',
            '<span aria-label="' + 'Next' + '">&#x203a;</span>'
        ],
        navSpeed: false,
        navElement: 'button type="button" role="presentation"',
        navContainer: false,
        navContainerClass: 'owl-nav',
        navClass: [
            'owl-prev',
            'owl-next'
        ],
        slideBy: 1,
        dotClass: 'owl-dot',
        dotsClass: 'owl-dots',
        dots: true,
        dotsEach: false,
        dotsData: false,
        dotsSpeed: false,
        dotsContainer: false
    };
	/**
	 * Initializes the layout of the plugin and extends the carousel.
	 * @protected
	 */
    Navigation.prototype.initialize = function () {
        var override,
            settings = this._core.settings;
        this._controls.$relative = (settings.navContainer ? $(settings.navContainer)
            : $('<div>').addClass(settings.navContainerClass).appendTo(this.$element)).addClass('disabled');
        this._controls.$previous = $('<' + settings.navElement + '>')
            .addClass(settings.navClass[0])
            .html(settings.navText[0])
            .prependTo(this._controls.$relative)
            .on('click', $.proxy(function (e) {
                this.prev(settings.navSpeed);
            }, this));
        this._controls.$next = $('<' + settings.navElement + '>')
            .addClass(settings.navClass[1])
            .html(settings.navText[1])
            .appendTo(this._controls.$relative)
            .on('click', $.proxy(function (e) {
                this.next(settings.navSpeed);
            }, this));
        if (!settings.dotsData) {
            this._templates = [$('<button role="button">')
                .addClass(settings.dotClass)
                .append($('<span>'))
                .prop('outerHTML')];
        }
        this._controls.$absolute = (settings.dotsContainer ? $(settings.dotsContainer)
            : $('<div>').addClass(settings.dotsClass).appendTo(this.$element)).addClass('disabled');
        this._controls.$absolute.on('click', 'button', $.proxy(function (e) {
            var index = $(e.target).parent().is(this._controls.$absolute)
                ? $(e.target).index() : $(e.target).parent().index();
            e.preventDefault();
            this.to(index, settings.dotsSpeed);
        }, this));
		/*$el.on('focusin', function() {
			$(document).off(".carousel");
			$(document).on('keydown.carousel', function(e) {
				if(e.keyCode == 37) {
					$el.trigger('prev.owl')
				}
				if(e.keyCode == 39) {
					$el.trigger('next.owl')
				}
			});
		});*/
        for (override in this._overrides) {
            this._core[override] = $.proxy(this[override], this);
        }
    };
	/**
	 * Destroys the plugin.
	 * @protected
	 */
    Navigation.prototype.destroy = function () {
        var handler, control, property, override, settings;
        settings = this._core.settings;
        for (handler in this._handlers) {
            this.$element.off(handler, this._handlers[handler]);
        }
        for (control in this._controls) {
            if (control === '$relative' && settings.navContainer) {
                this._controls[control].html('');
            } else {
                this._controls[control].remove();
            }
        }
        for (override in this.overides) {
            this._core[override] = this._overrides[override];
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };
	/**
	 * Updates the internal state.
	 * @protected
	 */
    Navigation.prototype.update = function () {
        var i, j, k,
            lower = this._core.clones().length / 2,
            upper = lower + this._core.items().length,
            maximum = this._core.maximum(true),
            settings = this._core.settings,
            size = settings.center || settings.autoWidth || settings.dotsData
                ? 1 : settings.dotsEach || settings.items;
        if (settings.slideBy !== 'page') {
            settings.slideBy = Math.min(settings.slideBy, settings.items);
        }
        if (settings.dots || settings.slideBy == 'page') {
            this._pages = [];
            for (i = lower, j = 0, k = 0; i < upper; i++) {
                if (j >= size || j === 0) {
                    this._pages.push({
                        start: Math.min(maximum, i - lower),
                        end: i - lower + size - 1
                    });
                    if (Math.min(maximum, i - lower) === maximum) {
                        break;
                    }
                    j = 0, ++k;
                }
                j += this._core.mergers(this._core.relative(i));
            }
        }
    };
	/**
	 * Draws the user interface.
	 * @todo The option `dotsData` wont work.
	 * @protected
	 */
    Navigation.prototype.draw = function () {
        var difference,
            settings = this._core.settings,
            disabled = this._core.items().length <= settings.items,
            index = this._core.relative(this._core.current()),
            loop = settings.loop || settings.rewind;
        this._controls.$relative.toggleClass('disabled', !settings.nav || disabled);
        if (settings.nav) {
            this._controls.$previous.toggleClass('disabled', !loop && index <= this._core.minimum(true));
            this._controls.$next.toggleClass('disabled', !loop && index >= this._core.maximum(true));
        }
        this._controls.$absolute.toggleClass('disabled', !settings.dots || disabled);
        if (settings.dots) {
            difference = this._pages.length - this._controls.$absolute.children().length;
            if (settings.dotsData && difference !== 0) {
                this._controls.$absolute.html(this._templates.join(''));
            } else if (difference > 0) {
                this._controls.$absolute.append(new Array(difference + 1).join(this._templates[0]));
            } else if (difference < 0) {
                this._controls.$absolute.children().slice(difference).remove();
            }
            this._controls.$absolute.find('.active').removeClass('active');
            this._controls.$absolute.children().eq($.inArray(this.current(), this._pages)).addClass('active');
        }
    };
	/**
	 * Extends event data.
	 * @protected
	 * @param {Event} event - The event object which gets thrown.
	 */
    Navigation.prototype.onTrigger = function (event) {
        var settings = this._core.settings;
        event.page = {
            index: $.inArray(this.current(), this._pages),
            count: this._pages.length,
            size: settings && (settings.center || settings.autoWidth || settings.dotsData
                ? 1 : settings.dotsEach || settings.items)
        };
    };
	/**
	 * Gets the current page position of the carousel.
	 * @protected
	 * @returns {Number}
	 */
    Navigation.prototype.current = function () {
        var current = this._core.relative(this._core.current());
        return $.grep(this._pages, $.proxy(function (page, index) {
            return page.start <= current && page.end >= current;
        }, this)).pop();
    };
	/**
	 * Gets the current succesor/predecessor position.
	 * @protected
	 * @returns {Number}
	 */
    Navigation.prototype.getPosition = function (successor) {
        var position, length,
            settings = this._core.settings;
        if (settings.slideBy == 'page') {
            position = $.inArray(this.current(), this._pages);
            length = this._pages.length;
            successor ? ++position : --position;
            position = this._pages[((position % length) + length) % length].start;
        } else {
            position = this._core.relative(this._core.current());
            length = this._core.items().length;
            successor ? position += settings.slideBy : position -= settings.slideBy;
        }
        return position;
    };
	/**
	 * Slides to the next item or page.
	 * @public
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.
	 */
    Navigation.prototype.next = function (speed) {
        $.proxy(this._overrides.to, this._core)(this.getPosition(true), speed);
    };
	/**
	 * Slides to the previous item or page.
	 * @public
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.
	 */
    Navigation.prototype.prev = function (speed) {
        $.proxy(this._overrides.to, this._core)(this.getPosition(false), speed);
    };
	/**
	 * Slides to the specified item or page.
	 * @public
	 * @param {Number} position - The position of the item or page.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 * @param {Boolean} [standard=false] - Whether to use the standard behaviour or not.
	 */
    Navigation.prototype.to = function (position, speed, standard) {
        var length;
        if (!standard && this._pages.length) {
            length = this._pages.length;
            $.proxy(this._overrides.to, this._core)(this._pages[((position % length) + length) % length].start, speed);
        } else {
            $.proxy(this._overrides.to, this._core)(position, speed);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.Navigation = Navigation;
})(window.Zepto || window.jQuery, window, document);
/**
 * Hash Plugin
 * @version 2.3.4
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {
    'use strict';
	/**
	 * Creates the hash plugin.
	 * @class The Hash Plugin
	 * @param {Owl} carousel - The Owl Carousel
	 */
    var Hash = function (carousel) {
		/**
		 * Reference to the core.
		 * @protected
		 * @type {Owl}
		 */
        this._core = carousel;
		/**
		 * Hash index for the items.
		 * @protected
		 * @type {Object}
		 */
        this._hashes = {};
		/**
		 * The carousel element.
		 * @type {jQuery}
		 */
        this.$element = this._core.$element;
		/**
		 * All event handlers.
		 * @protected
		 * @type {Object}
		 */
        this._handlers = {
            'initialized.owl.carousel': $.proxy(function (e) {
                if (e.namespace && this._core.settings.startPosition === 'URLHash') {
                    $(window).trigger('hashchange.owl.navigation');
                }
            }, this),
            'prepared.owl.carousel': $.proxy(function (e) {
                if (e.namespace) {
                    var hash = $(e.content).find('[data-hash]').addBack('[data-hash]').attr('data-hash');
                    if (!hash) {
                        return;
                    }
                    this._hashes[hash] = e.content;
                }
            }, this),
            'changed.owl.carousel': $.proxy(function (e) {
                if (e.namespace && e.property.name === 'position') {
                    var current = this._core.items(this._core.relative(this._core.current())),
                        hash = $.map(this._hashes, function (item, hash) {
                            return item === current ? hash : null;
                        }).join();
                    if (!hash || window.location.hash.slice(1) === hash) {
                        return;
                    }
                    window.location.hash = hash;
                }
            }, this)
        };
        this._core.options = $.extend({}, Hash.Defaults, this._core.options);
        this.$element.on(this._handlers);
        $(window).on('hashchange.owl.navigation', $.proxy(function (e) {
            var hash = window.location.hash.substring(1),
                items = this._core.$stage.children(),
                position = this._hashes[hash] && items.index(this._hashes[hash]);
            if (position === undefined || position === this._core.current()) {
                return;
            }
            this._core.to(this._core.relative(position), false, true);
        }, this));
    };
	/**
	 * Default options.
	 * @public
	 */
    Hash.Defaults = {
        URLhashListener: false
    };
	/**
	 * Destroys the plugin.
	 * @public
	 */
    Hash.prototype.destroy = function () {
        var handler, property;
        $(window).off('hashchange.owl.navigation');
        for (handler in this._handlers) {
            this._core.$element.off(handler, this._handlers[handler]);
        }
        for (property in Object.getOwnPropertyNames(this)) {
            typeof this[property] != 'function' && (this[property] = null);
        }
    };
    $.fn.owlCarousel.Constructor.Plugins.Hash = Hash;
})(window.Zepto || window.jQuery, window, document);
/**
 * Support Plugin
 *
 * @version 2.3.4
 * @author Vivid Planet Software GmbH
 * @author Artus Kolanowski
 * @author David Deutsch
 * @license The MIT License (MIT)
 */
; (function ($, window, document, undefined) {
    var style = $('<support>').get(0).style,
        prefixes = 'Webkit Moz O ms'.split(' '),
        events = {
            transition: {
                end: {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd',
                    transition: 'transitionend'
                }
            },
            animation: {
                end: {
                    WebkitAnimation: 'webkitAnimationEnd',
                    MozAnimation: 'animationend',
                    OAnimation: 'oAnimationEnd',
                    animation: 'animationend'
                }
            }
        },
        tests = {
            csstransforms: function () {
                return !!test('transform');
            },
            csstransforms3d: function () {
                return !!test('perspective');
            },
            csstransitions: function () {
                return !!test('transition');
            },
            cssanimations: function () {
                return !!test('animation');
            }
        };
    function test(property, prefixed) {
        var result = false,
            upper = property.charAt(0).toUpperCase() + property.slice(1);
        $.each((property + ' ' + prefixes.join(upper + ' ') + upper).split(' '), function (i, property) {
            if (style[property] !== undefined) {
                result = prefixed ? property : true;
                return false;
            }
        });
        return result;
    }
    function prefixed(property) {
        return test(property, true);
    }
    if (tests.csstransitions()) {
        /* jshint -W053 */
        $.support.transition = new String(prefixed('transition'))
        $.support.transition.end = events.transition.end[$.support.transition];
    }
    if (tests.cssanimations()) {
        /* jshint -W053 */
        $.support.animation = new String(prefixed('animation'))
        $.support.animation.end = events.animation.end[$.support.animation];
    }
    if (tests.csstransforms()) {
        /* jshint -W053 */
        $.support.transform = new String(prefixed('transform'));
        $.support.transform3d = tests.csstransforms3d();
    }
})(window.Zepto || window.jQuery, window, document);
/*!
 * jQuery UI Core 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)}(function(a){var e,t,n,i;function r(e,t){var n,i,r,o=e.nodeName.toLowerCase();return"area"===o?(i=(n=e.parentNode).name,!(!e.href||!i||"map"!==n.nodeName.toLowerCase())&&(!!(r=a("img[usemap='#"+i+"']")[0])&&s(r))):(/^(input|select|textarea|button|object)$/.test(o)?!e.disabled:"a"===o&&e.href||t)&&s(e)}function s(e){return a.expr.filters.visible(e)&&!a(e).parents().addBack().filter(function(){return"hidden"===a.css(this,"visibility")}).length}a.ui=a.ui||{},a.extend(a.ui,{version:"1.11.4",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),a.fn.extend({scrollParent:function(e){var t=this.css("position"),n="absolute"===t,i=e?/(auto|scroll|hidden)/:/(auto|scroll)/,r=this.parents().filter(function(){var e=a(this);return(!n||"static"!==e.css("position"))&&i.test(e.css("overflow")+e.css("overflow-y")+e.css("overflow-x"))}).eq(0);return"fixed"!==t&&r.length?r:a(this[0].ownerDocument||document)},uniqueId:(e=0,function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++e)})}),removeUniqueId:function(){return this.each(function(){/^ui-id-\d+$/.test(this.id)&&a(this).removeAttr("id")})}}),a.extend(a.expr[":"],{data:a.expr.createPseudo?a.expr.createPseudo(function(t){return function(e){return!!a.data(e,t)}}):function(e,t,n){return!!a.data(e,n[3])},focusable:function(e){return r(e,!isNaN(a.attr(e,"tabindex")))},tabbable:function(e){var t=a.attr(e,"tabindex"),n=isNaN(t);return(n||0<=t)&&r(e,!n)}}),a("<a>").outerWidth(1).jquery||a.each(["Width","Height"],function(e,n){var r="Width"===n?["Left","Right"]:["Top","Bottom"],i=n.toLowerCase(),o={innerWidth:a.fn.innerWidth,innerHeight:a.fn.innerHeight,outerWidth:a.fn.outerWidth,outerHeight:a.fn.outerHeight};function s(e,t,n,i){return a.each(r,function(){t-=parseFloat(a.css(e,"padding"+this))||0,n&&(t-=parseFloat(a.css(e,"border"+this+"Width"))||0),i&&(t-=parseFloat(a.css(e,"margin"+this))||0)}),t}a.fn["inner"+n]=function(e){return void 0===e?o["inner"+n].call(this):this.each(function(){a(this).css(i,s(this,e)+"px")})},a.fn["outer"+n]=function(e,t){return"number"!=typeof e?o["outer"+n].call(this,e):this.each(function(){a(this).css(i,s(this,e,!0,t)+"px")})}}),a.fn.addBack||(a.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),a("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(a.fn.removeData=(t=a.fn.removeData,function(e){return arguments.length?t.call(this,a.camelCase(e)):t.call(this)})),a.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),a.fn.extend({focus:(i=a.fn.focus,function(t,n){return"number"==typeof t?this.each(function(){var e=this;setTimeout(function(){a(e).focus(),n&&n.call(e)},t)}):i.apply(this,arguments)}),disableSelection:(n="onselectstart"in document.createElement("div")?"selectstart":"mousedown",function(){return this.bind(n+".ui-disableSelection",function(e){e.preventDefault()})}),enableSelection:function(){return this.unbind(".ui-disableSelection")},zIndex:function(e){if(void 0!==e)return this.css("zIndex",e);if(this.length)for(var t,n,i=a(this[0]);i.length&&i[0]!==document;){if(("absolute"===(t=i.css("position"))||"relative"===t||"fixed"===t)&&(n=parseInt(i.css("zIndex"),10),!isNaN(n)&&0!==n))return n;i=i.parent()}return 0}}),a.ui.plugin={add:function(e,t,n){var i,r=a.ui[e].prototype;for(i in n)r.plugins[i]=r.plugins[i]||[],r.plugins[i].push([t,n[i]])},call:function(e,t,n,i){var r,o=e.plugins[t];if(o&&(i||e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType))for(r=0;r<o.length;r++)e.options[o[r][0]]&&o[r][1].apply(e.element,n)}}});
/*!
 * jQuery UI Datepicker 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/datepicker/
 */
!function(e){"function"==typeof define&&define.amd?define(["jquery","./core"],e):e(jQuery)}(function(b){var r;function e(){this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},b.extend(this._defaults,this.regional[""]),this.regional.en=b.extend(!0,{},this.regional[""]),this.regional["en-US"]=b.extend(!0,{},this.regional.en),this.dpDiv=a(b("<div id='"+this._mainDivId+"' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))}function a(e){var t="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return e.delegate(t,"mouseout",function(){b(this).removeClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&b(this).removeClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&b(this).removeClass("ui-datepicker-next-hover")}).delegate(t,"mouseover",n)}function n(){b.datepicker._isDisabledDatepicker(r.inline?r.dpDiv.parent()[0]:r.input[0])||(b(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),b(this).addClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&b(this).addClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&b(this).addClass("ui-datepicker-next-hover"))}function h(e,t){for(var a in b.extend(e,t),t)null==t[a]&&(e[a]=t[a]);return e}return b.extend(b.ui,{datepicker:{version:"1.11.4"}}),b.extend(e.prototype,{markerClassName:"hasDatepicker",maxRows:4,_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(e){return h(this._defaults,e||{}),this},_attachDatepicker:function(e,t){var a,i,s;i="div"===(a=e.nodeName.toLowerCase())||"span"===a,e.id||(this.uuid+=1,e.id="dp"+this.uuid),(s=this._newInst(b(e),i)).settings=b.extend({},t||{}),"input"===a?this._connectDatepicker(e,s):i&&this._inlineDatepicker(e,s)},_newInst:function(e,t){return{id:e[0].id.replace(/([^A-Za-z0-9_\-])/g,"\\\\$1"),input:e,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:t,dpDiv:t?a(b("<div class='"+this._inlineClass+" ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")):this.dpDiv}},_connectDatepicker:function(e,t){var a=b(e);t.append=b([]),t.trigger=b([]),a.hasClass(this.markerClassName)||(this._attachments(a,t),a.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp),this._autoSize(t),b.data(e,"datepicker",t),t.settings.disabled&&this._disableDatepicker(e))},_attachments:function(e,t){var a,i,s,r=this._get(t,"appendText"),n=this._get(t,"isRTL");t.append&&t.append.remove(),r&&(t.append=b("<span class='"+this._appendClass+"'>"+r+"</span>"),e[n?"before":"after"](t.append)),e.unbind("focus",this._showDatepicker),t.trigger&&t.trigger.remove(),"focus"!==(a=this._get(t,"showOn"))&&"both"!==a||e.focus(this._showDatepicker),"button"!==a&&"both"!==a||(i=this._get(t,"buttonText"),s=this._get(t,"buttonImage"),t.trigger=b(this._get(t,"buttonImageOnly")?b("<img/>").addClass(this._triggerClass).attr({src:s,alt:i,title:i}):b("<button type='button'></button>").addClass(this._triggerClass).html(s?b("<img/>").attr({src:s,alt:i,title:i}):i)),e[n?"before":"after"](t.trigger),t.trigger.click(function(){return b.datepicker._datepickerShowing&&b.datepicker._lastInput===e[0]?b.datepicker._hideDatepicker():(b.datepicker._datepickerShowing&&b.datepicker._lastInput!==e[0]&&b.datepicker._hideDatepicker(),b.datepicker._showDatepicker(e[0])),!1}))},_autoSize:function(e){if(this._get(e,"autoSize")&&!e.inline){var t,a,i,s,r=new Date(2009,11,20),n=this._get(e,"dateFormat");n.match(/[DM]/)&&(t=function(e){for(s=i=a=0;s<e.length;s++)e[s].length>a&&(a=e[s].length,i=s);return i},r.setMonth(t(this._get(e,n.match(/MM/)?"monthNames":"monthNamesShort"))),r.setDate(t(this._get(e,n.match(/DD/)?"dayNames":"dayNamesShort"))+20-r.getDay())),e.input.attr("size",this._formatDate(e,r).length)}},_inlineDatepicker:function(e,t){var a=b(e);a.hasClass(this.markerClassName)||(a.addClass(this.markerClassName).append(t.dpDiv),b.data(e,"datepicker",t),this._setDate(t,this._getDefaultDate(t),!0),this._updateDatepicker(t),this._updateAlternate(t),t.settings.disabled&&this._disableDatepicker(e),t.dpDiv.css("display","block"))},_dialogDatepicker:function(e,t,a,i,s){var r,n,d,c,o,l=this._dialogInst;return l||(this.uuid+=1,r="dp"+this.uuid,this._dialogInput=b("<input type='text' id='"+r+"' style='position: absolute; top: -100px; width: 0px;'/>"),this._dialogInput.keydown(this._doKeyDown),b("body").append(this._dialogInput),(l=this._dialogInst=this._newInst(this._dialogInput,!1)).settings={},b.data(this._dialogInput[0],"datepicker",l)),h(l.settings,i||{}),t=t&&t.constructor===Date?this._formatDate(l,t):t,this._dialogInput.val(t),this._pos=s?s.length?s:[s.pageX,s.pageY]:null,this._pos||(n=document.documentElement.clientWidth,d=document.documentElement.clientHeight,c=document.documentElement.scrollLeft||document.body.scrollLeft,o=document.documentElement.scrollTop||document.body.scrollTop,this._pos=[n/2-100+c,d/2-150+o]),this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),l.settings.onSelect=a,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),b.blockUI&&b.blockUI(this.dpDiv),b.data(this._dialogInput[0],"datepicker",l),this},_destroyDatepicker:function(e){var t,a=b(e),i=b.data(e,"datepicker");a.hasClass(this.markerClassName)&&(t=e.nodeName.toLowerCase(),b.removeData(e,"datepicker"),"input"===t?(i.append.remove(),i.trigger.remove(),a.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):"div"!==t&&"span"!==t||a.removeClass(this.markerClassName).empty(),r===i&&(r=null))},_enableDatepicker:function(t){var e,a,i=b(t),s=b.data(t,"datepicker");i.hasClass(this.markerClassName)&&("input"===(e=t.nodeName.toLowerCase())?(t.disabled=!1,s.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})):"div"!==e&&"span"!==e||((a=i.children("."+this._inlineClass)).children().removeClass("ui-state-disabled"),a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)),this._disabledInputs=b.map(this._disabledInputs,function(e){return e===t?null:e}))},_disableDatepicker:function(t){var e,a,i=b(t),s=b.data(t,"datepicker");i.hasClass(this.markerClassName)&&("input"===(e=t.nodeName.toLowerCase())?(t.disabled=!0,s.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})):"div"!==e&&"span"!==e||((a=i.children("."+this._inlineClass)).children().addClass("ui-state-disabled"),a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)),this._disabledInputs=b.map(this._disabledInputs,function(e){return e===t?null:e}),this._disabledInputs[this._disabledInputs.length]=t)},_isDisabledDatepicker:function(e){if(!e)return!1;for(var t=0;t<this._disabledInputs.length;t++)if(this._disabledInputs[t]===e)return!0;return!1},_getInst:function(e){try{return b.data(e,"datepicker")}catch(e){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(e,t,a){var i,s,r,n,d=this._getInst(e);if(2===arguments.length&&"string"==typeof t)return"defaults"===t?b.extend({},b.datepicker._defaults):d?"all"===t?b.extend({},d.settings):this._get(d,t):null;i=t||{},"string"==typeof t&&((i={})[t]=a),d&&(this._curInst===d&&this._hideDatepicker(),s=this._getDateDatepicker(e,!0),r=this._getMinMaxDate(d,"min"),n=this._getMinMaxDate(d,"max"),h(d.settings,i),null!==r&&void 0!==i.dateFormat&&void 0===i.minDate&&(d.settings.minDate=this._formatDate(d,r)),null!==n&&void 0!==i.dateFormat&&void 0===i.maxDate&&(d.settings.maxDate=this._formatDate(d,n)),"disabled"in i&&(i.disabled?this._disableDatepicker(e):this._enableDatepicker(e)),this._attachments(b(e),d),this._autoSize(d),this._setDate(d,s),this._updateAlternate(d),this._updateDatepicker(d))},_changeDatepicker:function(e,t,a){this._optionDatepicker(e,t,a)},_refreshDatepicker:function(e){var t=this._getInst(e);t&&this._updateDatepicker(t)},_setDateDatepicker:function(e,t){var a=this._getInst(e);a&&(this._setDate(a,t),this._updateDatepicker(a),this._updateAlternate(a))},_getDateDatepicker:function(e,t){var a=this._getInst(e);return a&&!a.inline&&this._setDateFromField(a,t),a?this._getDate(a):null},_doKeyDown:function(e){var t,a,i,s=b.datepicker._getInst(e.target),r=!0,n=s.dpDiv.is(".ui-datepicker-rtl");if(s._keyEvent=!0,b.datepicker._datepickerShowing)switch(e.keyCode){case 9:b.datepicker._hideDatepicker(),r=!1;break;case 13:return(i=b("td."+b.datepicker._dayOverClass+":not(."+b.datepicker._currentClass+")",s.dpDiv))[0]&&b.datepicker._selectDay(e.target,s.selectedMonth,s.selectedYear,i[0]),(t=b.datepicker._get(s,"onSelect"))?(a=b.datepicker._formatDate(s),t.apply(s.input?s.input[0]:null,[a,s])):b.datepicker._hideDatepicker(),!1;case 27:b.datepicker._hideDatepicker();break;case 33:b.datepicker._adjustDate(e.target,e.ctrlKey?-b.datepicker._get(s,"stepBigMonths"):-b.datepicker._get(s,"stepMonths"),"M");break;case 34:b.datepicker._adjustDate(e.target,e.ctrlKey?+b.datepicker._get(s,"stepBigMonths"):+b.datepicker._get(s,"stepMonths"),"M");break;case 35:(e.ctrlKey||e.metaKey)&&b.datepicker._clearDate(e.target),r=e.ctrlKey||e.metaKey;break;case 36:(e.ctrlKey||e.metaKey)&&b.datepicker._gotoToday(e.target),r=e.ctrlKey||e.metaKey;break;case 37:(e.ctrlKey||e.metaKey)&&b.datepicker._adjustDate(e.target,n?1:-1,"D"),r=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&b.datepicker._adjustDate(e.target,e.ctrlKey?-b.datepicker._get(s,"stepBigMonths"):-b.datepicker._get(s,"stepMonths"),"M");break;case 38:(e.ctrlKey||e.metaKey)&&b.datepicker._adjustDate(e.target,-7,"D"),r=e.ctrlKey||e.metaKey;break;case 39:(e.ctrlKey||e.metaKey)&&b.datepicker._adjustDate(e.target,n?-1:1,"D"),r=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&b.datepicker._adjustDate(e.target,e.ctrlKey?+b.datepicker._get(s,"stepBigMonths"):+b.datepicker._get(s,"stepMonths"),"M");break;case 40:(e.ctrlKey||e.metaKey)&&b.datepicker._adjustDate(e.target,7,"D"),r=e.ctrlKey||e.metaKey;break;default:r=!1}else 36===e.keyCode&&e.ctrlKey?b.datepicker._showDatepicker(this):r=!1;r&&(e.preventDefault(),e.stopPropagation())},_doKeyPress:function(e){var t,a,i=b.datepicker._getInst(e.target);if(b.datepicker._get(i,"constrainInput"))return t=b.datepicker._possibleChars(b.datepicker._get(i,"dateFormat")),a=String.fromCharCode(null==e.charCode?e.keyCode:e.charCode),e.ctrlKey||e.metaKey||a<" "||!t||-1<t.indexOf(a)},_doKeyUp:function(e){var t=b.datepicker._getInst(e.target);if(t.input.val()!==t.lastVal)try{b.datepicker.parseDate(b.datepicker._get(t,"dateFormat"),t.input?t.input.val():null,b.datepicker._getFormatConfig(t))&&(b.datepicker._setDateFromField(t),b.datepicker._updateAlternate(t),b.datepicker._updateDatepicker(t))}catch(e){}return!0},_showDatepicker:function(e){var t,a,i,s,r,n,d;"input"!==(e=e.target||e).nodeName.toLowerCase()&&(e=b("input",e.parentNode)[0]),b.datepicker._isDisabledDatepicker(e)||b.datepicker._lastInput===e||(t=b.datepicker._getInst(e),b.datepicker._curInst&&b.datepicker._curInst!==t&&(b.datepicker._curInst.dpDiv.stop(!0,!0),t&&b.datepicker._datepickerShowing&&b.datepicker._hideDatepicker(b.datepicker._curInst.input[0])),!1!==(i=(a=b.datepicker._get(t,"beforeShow"))?a.apply(e,[e,t]):{})&&(h(t.settings,i),t.lastVal=null,b.datepicker._lastInput=e,b.datepicker._setDateFromField(t),b.datepicker._inDialog&&(e.value=""),b.datepicker._pos||(b.datepicker._pos=b.datepicker._findPos(e),b.datepicker._pos[1]+=e.offsetHeight),s=!1,b(e).parents().each(function(){return!(s|="fixed"===b(this).css("position"))}),r={left:b.datepicker._pos[0],top:b.datepicker._pos[1]},b.datepicker._pos=null,t.dpDiv.empty(),t.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),b.datepicker._updateDatepicker(t),r=b.datepicker._checkOffset(t,r,s),t.dpDiv.css({position:b.datepicker._inDialog&&b.blockUI?"static":s?"fixed":"absolute",display:"none",left:r.left+"px",top:r.top+"px"}),t.inline||(n=b.datepicker._get(t,"showAnim"),d=b.datepicker._get(t,"duration"),t.dpDiv.css("z-index",function(e){for(var t,a;e.length&&e[0]!==document;){if(("absolute"===(t=e.css("position"))||"relative"===t||"fixed"===t)&&(a=parseInt(e.css("zIndex"),10),!isNaN(a)&&0!==a))return a;e=e.parent()}return 0}(b(e))+1),b.datepicker._datepickerShowing=!0,b.effects&&b.effects.effect[n]?t.dpDiv.show(n,b.datepicker._get(t,"showOptions"),d):t.dpDiv[n||"show"](n?d:null),b.datepicker._shouldFocusInput(t)&&t.input.focus(),b.datepicker._curInst=t)))},_updateDatepicker:function(e){this.maxRows=4,(r=e).dpDiv.empty().append(this._generateHTML(e)),this._attachHandlers(e);var t,a=this._getNumberOfMonths(e),i=a[1],s=e.dpDiv.find("."+this._dayOverClass+" a");0<s.length&&n.apply(s.get(0)),e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),1<i&&e.dpDiv.addClass("ui-datepicker-multi-"+i).css("width",17*i+"em"),e.dpDiv[(1!==a[0]||1!==a[1]?"add":"remove")+"Class"]("ui-datepicker-multi"),e.dpDiv[(this._get(e,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),e===b.datepicker._curInst&&b.datepicker._datepickerShowing&&b.datepicker._shouldFocusInput(e)&&e.input.focus(),e.yearshtml&&(t=e.yearshtml,setTimeout(function(){t===e.yearshtml&&e.yearshtml&&e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml),t=e.yearshtml=null},0))},_shouldFocusInput:function(e){return e.input&&e.input.is(":visible")&&!e.input.is(":disabled")&&!e.input.is(":focus")},_checkOffset:function(e,t,a){var i=e.dpDiv.outerWidth(),s=e.dpDiv.outerHeight(),r=e.input?e.input.outerWidth():0,n=e.input?e.input.outerHeight():0,d=document.documentElement.clientWidth+(a?0:b(document).scrollLeft()),c=document.documentElement.clientHeight+(a?0:b(document).scrollTop());return t.left-=this._get(e,"isRTL")?i-r:0,t.left-=a&&t.left===e.input.offset().left?b(document).scrollLeft():0,t.top-=a&&t.top===e.input.offset().top+n?b(document).scrollTop():0,t.left-=Math.min(t.left,t.left+i>d&&i<d?Math.abs(t.left+i-d):0),t.top-=Math.min(t.top,t.top+s>c&&s<c?Math.abs(s+n):0),t},_findPos:function(e){for(var t,a=this._getInst(e),i=this._get(a,"isRTL");e&&("hidden"===e.type||1!==e.nodeType||b.expr.filters.hidden(e));)e=e[i?"previousSibling":"nextSibling"];return[(t=b(e).offset()).left,t.top]},_hideDatepicker:function(e){var t,a,i,s,r=this._curInst;!r||e&&r!==b.data(e,"datepicker")||this._datepickerShowing&&(t=this._get(r,"showAnim"),a=this._get(r,"duration"),i=function(){b.datepicker._tidyDialog(r)},b.effects&&(b.effects.effect[t]||b.effects[t])?r.dpDiv.hide(t,b.datepicker._get(r,"showOptions"),a,i):r.dpDiv["slideDown"===t?"slideUp":"fadeIn"===t?"fadeOut":"hide"](t?a:null,i),t||i(),this._datepickerShowing=!1,(s=this._get(r,"onClose"))&&s.apply(r.input?r.input[0]:null,[r.input?r.input.val():"",r]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),b.blockUI&&(b.unblockUI(),b("body").append(this.dpDiv))),this._inDialog=!1)},_tidyDialog:function(e){e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(e){if(b.datepicker._curInst){var t=b(e.target),a=b.datepicker._getInst(t[0]);(t[0].id===b.datepicker._mainDivId||0!==t.parents("#"+b.datepicker._mainDivId).length||t.hasClass(b.datepicker.markerClassName)||t.closest("."+b.datepicker._triggerClass).length||!b.datepicker._datepickerShowing||b.datepicker._inDialog&&b.blockUI)&&(!t.hasClass(b.datepicker.markerClassName)||b.datepicker._curInst===a)||b.datepicker._hideDatepicker()}},_adjustDate:function(e,t,a){var i=b(e),s=this._getInst(i[0]);this._isDisabledDatepicker(i[0])||(this._adjustInstDate(s,t+("M"===a?this._get(s,"showCurrentAtPos"):0),a),this._updateDatepicker(s))},_gotoToday:function(e){var t,a=b(e),i=this._getInst(a[0]);this._get(i,"gotoCurrent")&&i.currentDay?(i.selectedDay=i.currentDay,i.drawMonth=i.selectedMonth=i.currentMonth,i.drawYear=i.selectedYear=i.currentYear):(t=new Date,i.selectedDay=t.getDate(),i.drawMonth=i.selectedMonth=t.getMonth(),i.drawYear=i.selectedYear=t.getFullYear()),this._notifyChange(i),this._adjustDate(a)},_selectMonthYear:function(e,t,a){var i=b(e),s=this._getInst(i[0]);s["selected"+("M"===a?"Month":"Year")]=s["draw"+("M"===a?"Month":"Year")]=parseInt(t.options[t.selectedIndex].value,10),this._notifyChange(s),this._adjustDate(i)},_selectDay:function(e,t,a,i){var s,r=b(e);b(i).hasClass(this._unselectableClass)||this._isDisabledDatepicker(r[0])||((s=this._getInst(r[0])).selectedDay=s.currentDay=b("a",i).html(),s.selectedMonth=s.currentMonth=t,s.selectedYear=s.currentYear=a,this._selectDate(e,this._formatDate(s,s.currentDay,s.currentMonth,s.currentYear)))},_clearDate:function(e){var t=b(e);this._selectDate(t,"")},_selectDate:function(e,t){var a,i=b(e),s=this._getInst(i[0]);t=null!=t?t:this._formatDate(s),s.input&&s.input.val(t),this._updateAlternate(s),(a=this._get(s,"onSelect"))?a.apply(s.input?s.input[0]:null,[t,s]):s.input&&s.input.trigger("change"),s.inline?this._updateDatepicker(s):(this._hideDatepicker(),this._lastInput=s.input[0],"object"!=typeof s.input[0]&&s.input.focus(),this._lastInput=null)},_updateAlternate:function(e){var t,a,i,s=this._get(e,"altField");s&&(t=this._get(e,"altFormat")||this._get(e,"dateFormat"),a=this._getDate(e),i=this.formatDate(t,a,this._getFormatConfig(e)),b(s).each(function(){b(this).val(i)}))},noWeekends:function(e){var t=e.getDay();return[0<t&&t<6,""]},iso8601Week:function(e){var t,a=new Date(e.getTime());return a.setDate(a.getDate()+4-(a.getDay()||7)),t=a.getTime(),a.setMonth(0),a.setDate(1),Math.floor(Math.round((t-a)/864e5)/7)+1},parseDate:function(a,r,e){if(null==a||null==r)throw"Invalid arguments";if(""===(r="object"==typeof r?r.toString():r+""))return null;function n(e){var t=d+1<a.length&&a.charAt(d+1)===e;return t&&d++,t}function t(e){var t=n(e),a="@"===e?14:"!"===e?20:"y"===e&&t?4:"o"===e?3:2,i=new RegExp("^\\d{"+("y"===e?a:1)+","+a+"}"),s=r.substring(h).match(i);if(!s)throw"Missing number at position "+h;return h+=s[0].length,parseInt(s[0],10)}function i(e,t,a){var i=-1,s=b.map(n(e)?a:t,function(e,t){return[[t,e]]}).sort(function(e,t){return-(e[1].length-t[1].length)});if(b.each(s,function(e,t){var a=t[1];if(r.substr(h,a.length).toLowerCase()===a.toLowerCase())return i=t[0],h+=a.length,!1}),-1!==i)return i+1;throw"Unknown name at position "+h}function s(){if(r.charAt(h)!==a.charAt(d))throw"Unexpected literal at position "+h;h++}var d,c,o,l,h=0,u=(e?e.shortYearCutoff:null)||this._defaults.shortYearCutoff,p="string"!=typeof u?u:(new Date).getFullYear()%100+parseInt(u,10),g=(e?e.dayNamesShort:null)||this._defaults.dayNamesShort,_=(e?e.dayNames:null)||this._defaults.dayNames,f=(e?e.monthNamesShort:null)||this._defaults.monthNamesShort,k=(e?e.monthNames:null)||this._defaults.monthNames,D=-1,m=-1,y=-1,v=-1,M=!1;for(d=0;d<a.length;d++)if(M)"'"!==a.charAt(d)||n("'")?s():M=!1;else switch(a.charAt(d)){case"d":y=t("d");break;case"D":i("D",g,_);break;case"o":v=t("o");break;case"m":m=t("m");break;case"M":m=i("M",f,k);break;case"y":D=t("y");break;case"@":D=(l=new Date(t("@"))).getFullYear(),m=l.getMonth()+1,y=l.getDate();break;case"!":D=(l=new Date((t("!")-this._ticksTo1970)/1e4)).getFullYear(),m=l.getMonth()+1,y=l.getDate();break;case"'":n("'")?s():M=!0;break;default:s()}if(h<r.length&&(o=r.substr(h),!/^\s+/.test(o)))throw"Extra/unparsed characters found in date: "+o;if(-1===D?D=(new Date).getFullYear():D<100&&(D+=(new Date).getFullYear()-(new Date).getFullYear()%100+(D<=p?0:-100)),-1<v)for(m=1,y=v;;){if(y<=(c=this._getDaysInMonth(D,m-1)))break;m++,y-=c}if((l=this._daylightSavingAdjust(new Date(D,m-1,y))).getFullYear()!==D||l.getMonth()+1!==m||l.getDate()!==y)throw"Invalid date";return l},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:24*(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925))*60*60*1e7,formatDate:function(a,e,t){if(!e)return"";function s(e){var t=n+1<a.length&&a.charAt(n+1)===e;return t&&n++,t}function i(e,t,a){var i=""+t;if(s(e))for(;i.length<a;)i="0"+i;return i}function r(e,t,a,i){return s(e)?i[t]:a[t]}var n,d=(t?t.dayNamesShort:null)||this._defaults.dayNamesShort,c=(t?t.dayNames:null)||this._defaults.dayNames,o=(t?t.monthNamesShort:null)||this._defaults.monthNamesShort,l=(t?t.monthNames:null)||this._defaults.monthNames,h="",u=!1;if(e)for(n=0;n<a.length;n++)if(u)"'"!==a.charAt(n)||s("'")?h+=a.charAt(n):u=!1;else switch(a.charAt(n)){case"d":h+=i("d",e.getDate(),2);break;case"D":h+=r("D",e.getDay(),d,c);break;case"o":h+=i("o",Math.round((new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime()-new Date(e.getFullYear(),0,0).getTime())/864e5),3);break;case"m":h+=i("m",e.getMonth()+1,2);break;case"M":h+=r("M",e.getMonth(),o,l);break;case"y":h+=s("y")?e.getFullYear():(e.getYear()%100<10?"0":"")+e.getYear()%100;break;case"@":h+=e.getTime();break;case"!":h+=1e4*e.getTime()+this._ticksTo1970;break;case"'":s("'")?h+="'":u=!0;break;default:h+=a.charAt(n)}return h},_possibleChars:function(a){function e(e){var t=i+1<a.length&&a.charAt(i+1)===e;return t&&i++,t}var i,t="",s=!1;for(i=0;i<a.length;i++)if(s)"'"!==a.charAt(i)||e("'")?t+=a.charAt(i):s=!1;else switch(a.charAt(i)){case"d":case"m":case"y":case"@":t+="0123456789";break;case"D":case"M":return null;case"'":e("'")?t+="'":s=!0;break;default:t+=a.charAt(i)}return t},_get:function(e,t){return void 0!==e.settings[t]?e.settings[t]:this._defaults[t]},_setDateFromField:function(e,t){if(e.input.val()!==e.lastVal){var a=this._get(e,"dateFormat"),i=e.lastVal=e.input?e.input.val():null,s=this._getDefaultDate(e),r=s,n=this._getFormatConfig(e);try{r=this.parseDate(a,i,n)||s}catch(e){i=t?"":i}e.selectedDay=r.getDate(),e.drawMonth=e.selectedMonth=r.getMonth(),e.drawYear=e.selectedYear=r.getFullYear(),e.currentDay=i?r.getDate():0,e.currentMonth=i?r.getMonth():0,e.currentYear=i?r.getFullYear():0,this._adjustInstDate(e)}},_getDefaultDate:function(e){return this._restrictMinMax(e,this._determineDate(e,this._get(e,"defaultDate"),new Date))},_determineDate:function(d,e,t){var a,i,s=null==e||""===e?t:"string"==typeof e?function(e){try{return b.datepicker.parseDate(b.datepicker._get(d,"dateFormat"),e,b.datepicker._getFormatConfig(d))}catch(e){}for(var t=(e.toLowerCase().match(/^c/)?b.datepicker._getDate(d):null)||new Date,a=t.getFullYear(),i=t.getMonth(),s=t.getDate(),r=/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,n=r.exec(e);n;){switch(n[2]||"d"){case"d":case"D":s+=parseInt(n[1],10);break;case"w":case"W":s+=7*parseInt(n[1],10);break;case"m":case"M":i+=parseInt(n[1],10),s=Math.min(s,b.datepicker._getDaysInMonth(a,i));break;case"y":case"Y":a+=parseInt(n[1],10),s=Math.min(s,b.datepicker._getDaysInMonth(a,i))}n=r.exec(e)}return new Date(a,i,s)}(e):"number"==typeof e?isNaN(e)?t:(a=e,(i=new Date).setDate(i.getDate()+a),i):new Date(e.getTime());return(s=s&&"Invalid Date"===s.toString()?t:s)&&(s.setHours(0),s.setMinutes(0),s.setSeconds(0),s.setMilliseconds(0)),this._daylightSavingAdjust(s)},_daylightSavingAdjust:function(e){return e?(e.setHours(12<e.getHours()?e.getHours()+2:0),e):null},_setDate:function(e,t,a){var i=!t,s=e.selectedMonth,r=e.selectedYear,n=this._restrictMinMax(e,this._determineDate(e,t,new Date));e.selectedDay=e.currentDay=n.getDate(),e.drawMonth=e.selectedMonth=e.currentMonth=n.getMonth(),e.drawYear=e.selectedYear=e.currentYear=n.getFullYear(),s===e.selectedMonth&&r===e.selectedYear||a||this._notifyChange(e),this._adjustInstDate(e),e.input&&e.input.val(i?"":this._formatDate(e))},_getDate:function(e){return!e.currentYear||e.input&&""===e.input.val()?null:this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay))},_attachHandlers:function(e){var t=this._get(e,"stepMonths"),a="#"+e.id.replace(/\\\\/g,"\\");e.dpDiv.find("[data-handler]").map(function(){var e={prev:function(){b.datepicker._adjustDate(a,-t,"M")},next:function(){b.datepicker._adjustDate(a,+t,"M")},hide:function(){b.datepicker._hideDatepicker()},today:function(){b.datepicker._gotoToday(a)},selectDay:function(){return b.datepicker._selectDay(a,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return b.datepicker._selectMonthYear(a,this,"M"),!1},selectYear:function(){return b.datepicker._selectMonthYear(a,this,"Y"),!1}};b(this).bind(this.getAttribute("data-event"),e[this.getAttribute("data-handler")])})},_generateHTML:function(e){var t,a,i,s,r,n,d,c,o,l,h,u,p,g,_,f,k,D,m,y,v,M,b,w,C,I,x,Y,S,N,F,T,A,K,j,O,R,L,W,E=new Date,H=this._daylightSavingAdjust(new Date(E.getFullYear(),E.getMonth(),E.getDate())),P=this._get(e,"isRTL"),U=this._get(e,"showButtonPanel"),z=this._get(e,"hideIfNoPrevNext"),B=this._get(e,"navigationAsDateFormat"),J=this._getNumberOfMonths(e),V=this._get(e,"showCurrentAtPos"),q=this._get(e,"stepMonths"),Q=1!==J[0]||1!==J[1],X=this._daylightSavingAdjust(e.currentDay?new Date(e.currentYear,e.currentMonth,e.currentDay):new Date(9999,9,9)),Z=this._getMinMaxDate(e,"min"),$=this._getMinMaxDate(e,"max"),G=e.drawMonth-V,ee=e.drawYear;if(G<0&&(G+=12,ee--),$)for(t=this._daylightSavingAdjust(new Date($.getFullYear(),$.getMonth()-J[0]*J[1]+1,$.getDate())),t=Z&&t<Z?Z:t;this._daylightSavingAdjust(new Date(ee,G,1))>t;)--G<0&&(G=11,ee--);for(e.drawMonth=G,e.drawYear=ee,a=this._get(e,"prevText"),a=B?this.formatDate(a,this._daylightSavingAdjust(new Date(ee,G-q,1)),this._getFormatConfig(e)):a,i=this._canAdjustMonth(e,-1,ee,G)?"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='"+a+"'><span class='ui-icon ui-icon-circle-triangle-"+(P?"e":"w")+"'>"+a+"</span></a>":z?"":"<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+a+"'><span class='ui-icon ui-icon-circle-triangle-"+(P?"e":"w")+"'>"+a+"</span></a>",s=this._get(e,"nextText"),s=B?this.formatDate(s,this._daylightSavingAdjust(new Date(ee,G+q,1)),this._getFormatConfig(e)):s,r=this._canAdjustMonth(e,1,ee,G)?"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='"+s+"'><span class='ui-icon ui-icon-circle-triangle-"+(P?"w":"e")+"'>"+s+"</span></a>":z?"":"<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+s+"'><span class='ui-icon ui-icon-circle-triangle-"+(P?"w":"e")+"'>"+s+"</span></a>",n=this._get(e,"currentText"),d=this._get(e,"gotoCurrent")&&e.currentDay?X:H,n=B?this.formatDate(n,d,this._getFormatConfig(e)):n,c=e.inline?"":"<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>"+this._get(e,"closeText")+"</button>",o=U?"<div class='ui-datepicker-buttonpane ui-widget-content'>"+(P?c:"")+(this._isInRange(e,d)?"<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>"+n+"</button>":"")+(P?"":c)+"</div>":"",l=parseInt(this._get(e,"firstDay"),10),l=isNaN(l)?0:l,h=this._get(e,"showWeek"),u=this._get(e,"dayNames"),p=this._get(e,"dayNamesMin"),g=this._get(e,"monthNames"),_=this._get(e,"monthNamesShort"),f=this._get(e,"beforeShowDay"),k=this._get(e,"showOtherMonths"),D=this._get(e,"selectOtherMonths"),m=this._getDefaultDate(e),y="",M=0;M<J[0];M++){for(b="",this.maxRows=4,w=0;w<J[1];w++){if(C=this._daylightSavingAdjust(new Date(ee,G,e.selectedDay)),I=" ui-corner-all",x="",Q){if(x+="<div class='ui-datepicker-group",1<J[1])switch(w){case 0:x+=" ui-datepicker-group-first",I=" ui-corner-"+(P?"right":"left");break;case J[1]-1:x+=" ui-datepicker-group-last",I=" ui-corner-"+(P?"left":"right");break;default:x+=" ui-datepicker-group-middle",I=""}x+="'>"}for(x+="<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix"+I+"'>"+(/all|left/.test(I)&&0===M?P?r:i:"")+(/all|right/.test(I)&&0===M?P?i:r:"")+this._generateMonthYearHeader(e,G,ee,Z,$,0<M||0<w,g,_)+"</div><table class='ui-datepicker-calendar'><thead><tr>",Y=h?"<th class='ui-datepicker-week-col'>"+this._get(e,"weekHeader")+"</th>":"",v=0;v<7;v++)Y+="<th scope='col'"+(5<=(v+l+6)%7?" class='ui-datepicker-week-end'":"")+"><span title='"+u[S=(v+l)%7]+"'>"+p[S]+"</span></th>";for(x+=Y+"</tr></thead><tbody>",N=this._getDaysInMonth(ee,G),ee===e.selectedYear&&G===e.selectedMonth&&(e.selectedDay=Math.min(e.selectedDay,N)),F=(this._getFirstDayOfMonth(ee,G)-l+7)%7,T=Math.ceil((F+N)/7),A=Q&&this.maxRows>T?this.maxRows:T,this.maxRows=A,K=this._daylightSavingAdjust(new Date(ee,G,1-F)),j=0;j<A;j++){for(x+="<tr>",O=h?"<td class='ui-datepicker-week-col'>"+this._get(e,"calculateWeek")(K)+"</td>":"",v=0;v<7;v++)R=f?f.apply(e.input?e.input[0]:null,[K]):[!0,""],W=(L=K.getMonth()!==G)&&!D||!R[0]||Z&&K<Z||$&&$<K,O+="<td class='"+(5<=(v+l+6)%7?" ui-datepicker-week-end":"")+(L?" ui-datepicker-other-month":"")+(K.getTime()===C.getTime()&&G===e.selectedMonth&&e._keyEvent||m.getTime()===K.getTime()&&m.getTime()===C.getTime()?" "+this._dayOverClass:"")+(W?" "+this._unselectableClass+" ui-state-disabled":"")+(L&&!k?"":" "+R[1]+(K.getTime()===X.getTime()?" "+this._currentClass:"")+(K.getTime()===H.getTime()?" ui-datepicker-today":""))+"'"+(L&&!k||!R[2]?"":" title='"+R[2].replace(/'/g,"&#39;")+"'")+(W?"":" data-handler='selectDay' data-event='click' data-month='"+K.getMonth()+"' data-year='"+K.getFullYear()+"'")+">"+(L&&!k?"&#xa0;":W?"<span class='ui-state-default'>"+K.getDate()+"</span>":"<a class='ui-state-default"+(K.getTime()===H.getTime()?" ui-state-highlight":"")+(K.getTime()===X.getTime()?" ui-state-active":"")+(L?" ui-priority-secondary":"")+"' href='#'>"+K.getDate()+"</a>")+"</td>",K.setDate(K.getDate()+1),K=this._daylightSavingAdjust(K);x+=O+"</tr>"}11<++G&&(G=0,ee++),b+=x+="</tbody></table>"+(Q?"</div>"+(0<J[0]&&w===J[1]-1?"<div class='ui-datepicker-row-break'></div>":""):"")}y+=b}return y+=o,e._keyEvent=!1,y},_generateMonthYearHeader:function(e,t,a,i,s,r,n,d){var c,o,l,h,u,p,g,_,f=this._get(e,"changeMonth"),k=this._get(e,"changeYear"),D=this._get(e,"showMonthAfterYear"),m="<div class='ui-datepicker-title'>",y="";if(r||!f)y+="<span class='ui-datepicker-month'>"+n[t]+"</span>";else{for(c=i&&i.getFullYear()===a,o=s&&s.getFullYear()===a,y+="<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",l=0;l<12;l++)(!c||l>=i.getMonth())&&(!o||l<=s.getMonth())&&(y+="<option value='"+l+"'"+(l===t?" selected='selected'":"")+">"+d[l]+"</option>");y+="</select>"}if(D||(m+=y+(!r&&f&&k?"":"&#xa0;")),!e.yearshtml)if(e.yearshtml="",r||!k)m+="<span class='ui-datepicker-year'>"+a+"</span>";else{for(h=this._get(e,"yearRange").split(":"),u=(new Date).getFullYear(),g=(p=function(e){var t=e.match(/c[+\-].*/)?a+parseInt(e.substring(1),10):e.match(/[+\-].*/)?u+parseInt(e,10):parseInt(e,10);return isNaN(t)?u:t})(h[0]),_=Math.max(g,p(h[1]||"")),g=i?Math.max(g,i.getFullYear()):g,_=s?Math.min(_,s.getFullYear()):_,e.yearshtml+="<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";g<=_;g++)e.yearshtml+="<option value='"+g+"'"+(g===a?" selected='selected'":"")+">"+g+"</option>";e.yearshtml+="</select>",m+=e.yearshtml,e.yearshtml=null}return m+=this._get(e,"yearSuffix"),D&&(m+=(!r&&f&&k?"":"&#xa0;")+y),m+="</div>"},_adjustInstDate:function(e,t,a){var i=e.drawYear+("Y"===a?t:0),s=e.drawMonth+("M"===a?t:0),r=Math.min(e.selectedDay,this._getDaysInMonth(i,s))+("D"===a?t:0),n=this._restrictMinMax(e,this._daylightSavingAdjust(new Date(i,s,r)));e.selectedDay=n.getDate(),e.drawMonth=e.selectedMonth=n.getMonth(),e.drawYear=e.selectedYear=n.getFullYear(),"M"!==a&&"Y"!==a||this._notifyChange(e)},_restrictMinMax:function(e,t){var a=this._getMinMaxDate(e,"min"),i=this._getMinMaxDate(e,"max"),s=a&&t<a?a:t;return i&&i<s?i:s},_notifyChange:function(e){var t=this._get(e,"onChangeMonthYear");t&&t.apply(e.input?e.input[0]:null,[e.selectedYear,e.selectedMonth+1,e])},_getNumberOfMonths:function(e){var t=this._get(e,"numberOfMonths");return null==t?[1,1]:"number"==typeof t?[1,t]:t},_getMinMaxDate:function(e,t){return this._determineDate(e,this._get(e,t+"Date"),null)},_getDaysInMonth:function(e,t){return 32-this._daylightSavingAdjust(new Date(e,t,32)).getDate()},_getFirstDayOfMonth:function(e,t){return new Date(e,t,1).getDay()},_canAdjustMonth:function(e,t,a,i){var s=this._getNumberOfMonths(e),r=this._daylightSavingAdjust(new Date(a,i+(t<0?t:s[0]*s[1]),1));return t<0&&r.setDate(this._getDaysInMonth(r.getFullYear(),r.getMonth())),this._isInRange(e,r)},_isInRange:function(e,t){var a,i,s=this._getMinMaxDate(e,"min"),r=this._getMinMaxDate(e,"max"),n=null,d=null,c=this._get(e,"yearRange");return c&&(a=c.split(":"),i=(new Date).getFullYear(),n=parseInt(a[0],10),d=parseInt(a[1],10),a[0].match(/[+\-].*/)&&(n+=i),a[1].match(/[+\-].*/)&&(d+=i)),(!s||t.getTime()>=s.getTime())&&(!r||t.getTime()<=r.getTime())&&(!n||t.getFullYear()>=n)&&(!d||t.getFullYear()<=d)},_getFormatConfig:function(e){var t=this._get(e,"shortYearCutoff");return{shortYearCutoff:t="string"!=typeof t?t:(new Date).getFullYear()%100+parseInt(t,10),dayNamesShort:this._get(e,"dayNamesShort"),dayNames:this._get(e,"dayNames"),monthNamesShort:this._get(e,"monthNamesShort"),monthNames:this._get(e,"monthNames")}},_formatDate:function(e,t,a,i){t||(e.currentDay=e.selectedDay,e.currentMonth=e.selectedMonth,e.currentYear=e.selectedYear);var s=t?"object"==typeof t?t:this._daylightSavingAdjust(new Date(i,a,t)):this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));return this.formatDate(this._get(e,"dateFormat"),s,this._getFormatConfig(e))}}),b.fn.datepicker=function(e){if(!this.length)return this;b.datepicker.initialized||(b(document).mousedown(b.datepicker._checkExternalClick),b.datepicker.initialized=!0),0===b("#"+b.datepicker._mainDivId).length&&b("body").append(b.datepicker.dpDiv);var t=Array.prototype.slice.call(arguments,1);return"string"!=typeof e||"isDisabled"!==e&&"getDate"!==e&&"widget"!==e?"option"===e&&2===arguments.length&&"string"==typeof arguments[1]?b.datepicker["_"+e+"Datepicker"].apply(b.datepicker,[this[0]].concat(t)):this.each(function(){"string"==typeof e?b.datepicker["_"+e+"Datepicker"].apply(b.datepicker,[this].concat(t)):b.datepicker._attachDatepicker(this,e)}):b.datepicker["_"+e+"Datepicker"].apply(b.datepicker,[this[0]].concat(t))},b.datepicker=new e,b.datepicker.initialized=!1,b.datepicker.uuid=(new Date).getTime(),b.datepicker.version="1.11.4",b.datepicker});

!function(){function t(){if(this.complete){var e=this.getAttribute("data-lazy-src");if(e&&this.src!==e)this.addEventListener("onload",t);else{var d=this.width,n=this.height;d&&d>0&&n&&n>0&&(this.setAttribute("width",d),this.setAttribute("height",n),i(this))}}else this.addEventListener("onload",t)}var e=function(){for(var e=document.querySelectorAll("img[data-recalc-dims]"),i=0;i<e.length;i++)t.call(e[i])},i=function(t){t.removeAttribute("data-recalc-dims"),t.removeAttribute("scale")};"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",e):e()),document.body.addEventListener("is.post-load",e)}();
/*! WOW wow.js - v1.3.0 - 2016-10-04
* https://wowjs.uk
* Copyright (c) 2016 Thomas Grainger; Licensed MIT */!function(a,b){if("function"==typeof define&&define.amd)define(["module","exports"],b);else if("undefined"!=typeof exports)b(module,exports);else{var c={exports:{}};b(c,c.exports),a.WOW=c.exports}}(this,function(a,b){"use strict";function c(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function d(a,b){return b.indexOf(a)>=0}function e(a,b){for(var c in b)if(null==a[c]){var d=b[c];a[c]=d}return a}function f(a){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)}function g(a){var b=arguments.length<=1||void 0===arguments[1]?!1:arguments[1],c=arguments.length<=2||void 0===arguments[2]?!1:arguments[2],d=arguments.length<=3||void 0===arguments[3]?null:arguments[3],e=void 0;return null!=document.createEvent?(e=document.createEvent("CustomEvent"),e.initCustomEvent(a,b,c,d)):null!=document.createEventObject?(e=document.createEventObject(),e.eventType=a):e.eventName=a,e}function h(a,b){null!=a.dispatchEvent?a.dispatchEvent(b):b in(null!=a)?a[b]():"on"+b in(null!=a)&&a["on"+b]()}function i(a,b,c){null!=a.addEventListener?a.addEventListener(b,c,!1):null!=a.attachEvent?a.attachEvent("on"+b,c):a[b]=c}function j(a,b,c){null!=a.removeEventListener?a.removeEventListener(b,c,!1):null!=a.detachEvent?a.detachEvent("on"+b,c):delete a[b]}function k(){return"innerHeight"in window?window.innerHeight:document.documentElement.clientHeight}Object.defineProperty(b,"__esModule",{value:!0});var l,m,n=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),o=window.WeakMap||window.MozWeakMap||function(){function a(){c(this,a),this.keys=[],this.values=[]}return n(a,[{key:"get",value:function(a){for(var b=0;b<this.keys.length;b++){var c=this.keys[b];if(c===a)return this.values[b]}}},{key:"set",value:function(a,b){for(var c=0;c<this.keys.length;c++){var d=this.keys[c];if(d===a)return this.values[c]=b,this}return this.keys.push(a),this.values.push(b),this}}]),a}(),p=window.MutationObserver||window.WebkitMutationObserver||window.MozMutationObserver||(m=l=function(){function a(){c(this,a),"undefined"!=typeof console&&null!==console&&(console.warn("MutationObserver is not supported by your browser."),console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content."))}return n(a,[{key:"observe",value:function(){}}]),a}(),l.notSupported=!0,m),q=window.getComputedStyle||function(a){var b=/(\-([a-z]){1})/g;return{getPropertyValue:function(c){"float"===c&&(c="styleFloat"),b.test(c)&&c.replace(b,function(a,b){return b.toUpperCase()});var d=a.currentStyle;return(null!=d?d[c]:void 0)||null}}},r=function(){function a(){var b=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];c(this,a),this.defaults={boxClass:"wow",animateClass:"animated",offset:0,mobile:!0,live:!0,callback:null,scrollContainer:null,resetAnimation:!0},this.animate=function(){return"requestAnimationFrame"in window?function(a){return window.requestAnimationFrame(a)}:function(a){return a()}}(),this.vendors=["moz","webkit"],this.start=this.start.bind(this),this.resetAnimation=this.resetAnimation.bind(this),this.scrollHandler=this.scrollHandler.bind(this),this.scrollCallback=this.scrollCallback.bind(this),this.scrolled=!0,this.config=e(b,this.defaults),null!=b.scrollContainer&&(this.config.scrollContainer=document.querySelector(b.scrollContainer)),this.animationNameCache=new o,this.wowEvent=g(this.config.boxClass)}return n(a,[{key:"init",value:function(){this.element=window.document.documentElement,d(document.readyState,["interactive","complete"])?this.start():i(document,"DOMContentLoaded",this.start),this.finished=[]}},{key:"start",value:function(){var a=this;if(this.stopped=!1,this.boxes=[].slice.call(this.element.querySelectorAll("."+this.config.boxClass)),this.all=this.boxes.slice(0),this.boxes.length)if(this.disabled())this.resetStyle();else for(var b=0;b<this.boxes.length;b++){var c=this.boxes[b];this.applyStyle(c,!0)}if(this.disabled()||(i(this.config.scrollContainer||window,"scroll",this.scrollHandler),i(window,"resize",this.scrollHandler),this.interval=setInterval(this.scrollCallback,50)),this.config.live){var d=new p(function(b){for(var c=0;c<b.length;c++)for(var d=b[c],e=0;e<d.addedNodes.length;e++){var f=d.addedNodes[e];a.doSync(f)}});d.observe(document.body,{childList:!0,subtree:!0})}}},{key:"stop",value:function(){this.stopped=!0,j(this.config.scrollContainer||window,"scroll",this.scrollHandler),j(window,"resize",this.scrollHandler),null!=this.interval&&clearInterval(this.interval)}},{key:"sync",value:function(){p.notSupported&&this.doSync(this.element)}},{key:"doSync",value:function(a){if("undefined"!=typeof a&&null!==a||(a=this.element),1===a.nodeType){a=a.parentNode||a;for(var b=a.querySelectorAll("."+this.config.boxClass),c=0;c<b.length;c++){var e=b[c];d(e,this.all)||(this.boxes.push(e),this.all.push(e),this.stopped||this.disabled()?this.resetStyle():this.applyStyle(e,!0),this.scrolled=!0)}}}},{key:"show",value:function(a){return this.applyStyle(a),a.className=a.className+" "+this.config.animateClass,null!=this.config.callback&&this.config.callback(a),h(a,this.wowEvent),this.config.resetAnimation&&(i(a,"animationend",this.resetAnimation),i(a,"oanimationend",this.resetAnimation),i(a,"webkitAnimationEnd",this.resetAnimation),i(a,"MSAnimationEnd",this.resetAnimation)),a}},{key:"applyStyle",value:function(a,b){var c=this,d=a.getAttribute("data-wow-duration"),e=a.getAttribute("data-wow-delay"),f=a.getAttribute("data-wow-iteration");return this.animate(function(){return c.customStyle(a,b,d,e,f)})}},{key:"resetStyle",value:function(){for(var a=0;a<this.boxes.length;a++){var b=this.boxes[a];b.style.visibility="visible"}}},{key:"resetAnimation",value:function(a){if(a.type.toLowerCase().indexOf("animationend")>=0){var b=a.target||a.srcElement;b.className=b.className.replace(this.config.animateClass,"").trim()}}},{key:"customStyle",value:function(a,b,c,d,e){return b&&this.cacheAnimationName(a),a.style.visibility=b?"hidden":"visible",c&&this.vendorSet(a.style,{animationDuration:c}),d&&this.vendorSet(a.style,{animationDelay:d}),e&&this.vendorSet(a.style,{animationIterationCount:e}),this.vendorSet(a.style,{animationName:b?"none":this.cachedAnimationName(a)}),a}},{key:"vendorSet",value:function(a,b){for(var c in b)if(b.hasOwnProperty(c)){var d=b[c];a[""+c]=d;for(var e=0;e<this.vendors.length;e++){var f=this.vendors[e];a[""+f+c.charAt(0).toUpperCase()+c.substr(1)]=d}}}},{key:"vendorCSS",value:function(a,b){for(var c=q(a),d=c.getPropertyCSSValue(b),e=0;e<this.vendors.length;e++){var f=this.vendors[e];d=d||c.getPropertyCSSValue("-"+f+"-"+b)}return d}},{key:"animationName",value:function(a){var b=void 0;try{b=this.vendorCSS(a,"animation-name").cssText}catch(c){b=q(a).getPropertyValue("animation-name")}return"none"===b?"":b}},{key:"cacheAnimationName",value:function(a){return this.animationNameCache.set(a,this.animationName(a))}},{key:"cachedAnimationName",value:function(a){return this.animationNameCache.get(a)}},{key:"scrollHandler",value:function(){this.scrolled=!0}},{key:"scrollCallback",value:function(){if(this.scrolled){this.scrolled=!1;for(var a=[],b=0;b<this.boxes.length;b++){var c=this.boxes[b];if(c){if(this.isVisible(c)){this.show(c);continue}a.push(c)}}this.boxes=a,this.boxes.length||this.config.live||this.stop()}}},{key:"offsetTop",value:function(a){for(;void 0===a.offsetTop;)a=a.parentNode;for(var b=a.offsetTop;a.offsetParent;)a=a.offsetParent,b+=a.offsetTop;return b}},{key:"isVisible",value:function(a){var b=a.getAttribute("data-wow-offset")||this.config.offset,c=this.config.scrollContainer&&this.config.scrollContainer.scrollTop||window.pageYOffset,d=c+Math.min(this.element.clientHeight,k())-b,e=this.offsetTop(a),f=e+a.clientHeight;return d>=e&&f>=c}},{key:"disabled",value:function(){return!this.config.mobile&&f(navigator.userAgent)}}]),a}();b["default"]=r,a.exports=b["default"]});
window.wp=window.wp||{},window.wp["./assets/js/frontend.blocks"]=function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=509)}({13:function(t,e){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(e){return"function"==typeof Symbol&&"symbol"===n(Symbol.iterator)?t.exports=i=function(t){return n(t)}:t.exports=i=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":n(t)},i(e)}t.exports=i},20:function(t,e,n){"use strict";function i(t,e,n){var i=function(t){var e={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"mozAnimationEnd",WebkitAnimation:"webkitAnimationEnd"};for(var n in e)if(void 0!==t.style[n])return e[n]}(document.createElement("div")),o=void 0!==e.animation?e.animation:"",a=void 0!==e.duration?e.duration:"1s",d=void 0!==e.delay?e.delay:"0s";return t.css({"animation-duration":a,"animation-delay":d,"-webkit-animation-delay":d}),t.addClass("animated "+o).one(i,function(){jQuery(this).removeClass("animated "+o),"function"==typeof n&&n()}),this}e.a=i},27:function(t,e,n){function i(t){return o(t)||a(t)||d()}var o=n(31),a=n(30),d=n(32);t.exports=i},30:function(t,e){function n(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}t.exports=n},31:function(t,e){function n(t){if(Array.isArray(t))return t}t.exports=n},32:function(t,e){function n(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}t.exports=n},509:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});n(510)},510:function(t,e,n){"use strict";n(511)},511:function(t,e,n){"use strict";var i=(n(512),n(513)),o=(n.n(i),n(514)),a=(n.n(o),n(515)),d=(n.n(a),n(516)),c=(n.n(d),n(517),n(518),n(519)),s=(n.n(c),n(520),n(521),n(522)),r=(n.n(s),n(523)),l=(n.n(r),n(524)),u=(n.n(l),n(525)),p=(n.n(u),n(526)),f=(n.n(p),n(527)),w=(n.n(f),n(528)),g=(n.n(w),n(529)),m=(n.n(g),n(530),n(531),n(532));n.n(m)},512:function(t,e,n){"use strict";var i=n(20);!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){t(".wp-block-getwid-icon:not(.getwid-init)").each(function(e,n){t(n).addClass("getwid-init"),t(".getwid-animation.wp-block-getwid-icon__wrapper").mouseenter(function(){Object(i.a)(t(this),{animation:t(this).attr("data-animation")})})})};n()})}(jQuery)},513:function(t,e){!function(t){t(document).ready(function(e){function n(){var t=document.createElement("script");t.type="text/javascript",t.src="https://www.youtube.com/iframe_api",t.id="youtube_video_api_js";var e=!1;document.getElementsByTagName("head")[0].appendChild(t),t.onload=t.onreadystatechange=function(){e||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState||(e=!0,t.onload=t.onreadystatechange=null)}}function i(t){var e=/(?:https?:\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?\.com\/\S*(?:(?:\/e(?:mbed))?\/v?|(?:watch\?)?(?:\S*?&?vi?\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;return!!t.match(e)&&RegExp.$1}var o;window.onYouTubeIframeAPIReady=function(){o.each(function(e){var n=t(this).attr("id"),i=t("#"+n).parent().attr("youtube-video-autoplay"),o=t("#"+n).parent().attr("youtube-video-loop"),a=t("#"+n).parent().attr("youtube-video-muted"),d=t("#"+n).closest(".wp-block-getwid-section__wrapper").find(".getwid-background-video-controls .getwid-background-video-play"),c=t("#"+n).closest(".wp-block-getwid-section__wrapper").find(".getwid-background-video-controls .getwid-background-video-mute"),s=new YT.Player(n,{playerVars:{autoplay:"true"==i?1:0,controls:0,disablekb:1,fs:0,cc_load_policy:0,iv_load_policy:3,loop:"true"==o?1:0,playlist:"true"==o?n:"",modestbranding:1,rel:0,showinfo:0,enablejsapi:1,mute:"true"==a?1:0,autohide:1,playsinline:1},height:"100%",width:"100%",videoId:n,events:{onReady:function(t){},onStateChange:function(t){0==t.data&&"false"==o&&(t.target.f.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}',"*"),d.html('<i class="getwid-icon getwid-icon-play"></i>'),i="false")}}});t(s.f).on("load",function(){"true"==i?d.html('<i class="getwid-icon getwid-icon-pause"></i>'):"false"==i&&d.html('<i class="getwid-icon getwid-icon-play"></i>'),"true"==a?c.html('<i class="getwid-icon getwid-icon-mute"></i>'):"false"==a&&c.html('<i class="getwid-icon getwid-icon-volume-up"></i>'),t(d).on("click",function(t){"true"==i?(s.f.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}',"*"),d.html('<i class="getwid-icon getwid-icon-play"></i>'),i="false"):"false"==i&&(s.f.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}',"*"),d.html('<i class="getwid-icon getwid-icon-pause"></i>'),i="true")}),t(c).on("click",function(t){"true"==a?(s.f.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}',"*"),c.html('<i class="getwid-icon getwid-icon-volume-up"></i>'),a="false"):"false"==a&&(s.f.contentWindow.postMessage('{"event":"command","func":"mute","args":""}',"*"),c.html('<i class="getwid-icon getwid-icon-mute"></i>'),a="true")})})})},t(document.body).on("post-load",function(t){a(),d(),c(),s()});var a=function(){o=t(".wp-block-getwid-section__background-video.source-youtube .wp-block-getwid-section__background-video-youtube:not(.getwid-init)"),o.each(function(e){t(this).addClass("getwid-init");var n=i(t(this).parent().attr("youtube-video-url"));t(this).attr("id",n)}),o.length&&(t("#youtube_video_api_js").length||n())},d=function(){var e,n,i,o,a,d,c=t(".wp-block-getwid-section__background-slider:not(.getwid-init)");c.length&&"undefined"!=typeof imagesLoaded&&c.each(function(c){d=t(this),e=1==d.data("autoplay"),n=parseInt(d.data("autoplay-speed")),i="fade"==d.data("slide-effect"),o=parseInt(d.data("slide-speed")),a=1==d.data("infinite"),t(this).addClass("getwid-init"),d.imagesLoaded().done(function(d){t(d.elements[0]).slick({arrows:!1,dots:!1,rows:0,slidesToShow:1,slidesToScroll:1,autoplay:e,autoplaySpeed:n,fade:i,speed:o,infinite:a})})})},c=function(){if("undefined"!=typeof WOW){new WOW({boxClass:"getwid-anim",mobile:!1}).init()}},s=function(){t(".wp-block-getwid-section:not(.getwid-init)").each(function(e){t(this).addClass("getwid-init");var n=t(this),i=n.find(".wp-block-getwid-section__background-video.source-media-library").get(0),o=n.find(".getwid-background-video-play"),a=n.find(".getwid-background-video-mute");n.find(".wp-block-getwid-section__background-video.source-media-library").on("play",function(t){o.html('<i class="getwid-icon getwid-icon-pause"></i>')}).on("pause",function(t){o.html('<i class="getwid-icon getwid-icon-play"></i>')}),n.on("click",".getwid-background-video-play",function(t){t.preventDefault(),i&&(i.paused?i.play():i.pause())}),n.ready(function(){i&&(i.paused?o.html('<i class="getwid-icon getwid-icon-play"></i>'):o.html('<i class="getwid-icon getwid-icon-pause"></i>'),i.muted?a.html('<i class="getwid-icon getwid-icon-mute"></i>'):a.html('<i class="getwid-icon getwid-icon-volume-up"></i>'))}),n.on("click",".getwid-background-video-mute",function(t){t.preventDefault(),i&&(i.muted=!i.muted,i.muted?a.html('<i class="getwid-icon getwid-icon-mute"></i>'):a.html('<i class="getwid-icon getwid-icon-volume-up"></i>'))})})};a(),d(),c(),s()})}(jQuery)},514:function(t,e){!function(t){t(document).ready(function(e){function n(t){for(var e="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",i=n.length,o=0;o<t;o++)e+=n.charAt(Math.floor(Math.random()*i));return e}t(document.body).on("post-load",function(t){i()});var i=function(){var e=t(".wp-block-getwid-tabs:not(.getwid-init)"),i=0;e.each(function(e){var o=n(5);t(this).addClass("getwid-init"),i=t(this).data("active-tab");var a=t(this).find(".wp-block-getwid-tabs__nav-links");t(this).find(".wp-block-getwid-tabs__nav-link").each(function(e,n){t(n).find("a").attr("href","#tab-".concat(o,"-").concat(e))}),t(this).find(".wp-block-getwid-tabs__tab-content").each(function(e,n){t(n).attr("id","tab-".concat(o,"-").concat(e))});var d=t(this).find(".wp-block-getwid-tabs__nav-link").detach();t(a).prepend(d),t(this).find(".wp-block-getwid-tabs__tab-content").eq(i).addClass("is-active-tab"),t(this).tabs({active:i,activate:function(t,e){e.newPanel.closest(".wp-block-getwid-tabs").find(".wp-block-getwid-tabs__tab-content").removeClass("is-active-tab"),e.newPanel.addClass("is-active-tab")}})})};i()})}(jQuery)},515:function(t,e){!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){var e=t(".wp-block-getwid-accordion:not(.getwid-init)"),n=0;e.each(function(e,i){t(this).addClass("getwid-init"),n="none"!=t(this).data("active-element")&&parseInt(t(this).data("active-element"),10),t(i).accordion({header:".wp-block-getwid-accordion__header-wrapper",icons:!1,animate:!1,collapsible:!0,active:n,heightStyle:"content",create:function(t,e){},activate:function(e,n){if(n.newPanel.length){var i=n.newPanel.find(".wp-block-getwid-accordion__content").outerHeight(!0);i&&t(n.newPanel).animate({height:i},{queue:!1,duration:500,complete:function(){t(this).css("height","")}})}if(n.oldPanel.length){var o=n.oldPanel.find(".wp-block-getwid-accordion__content").outerHeight(!0);o&&(t(n.oldPanel).css("height",o),t(n.oldPanel).animate({height:0},{queue:!1,duration:500,complete:function(){t(this).css("height","")}}))}}})})};n()})}(jQuery)},516:function(t,e){!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){t(".wp-block-getwid-toggle:not(.getwid-init)").each(function(e,n){t(this).addClass("getwid-init"),t(n).find(".wp-block-getwid-toggle__row").on("click",".wp-block-getwid-toggle__header-wrapper",function(e){var n=t(this).parent(),i=n.find(".wp-block-getwid-toggle__content-wrapper"),o=n.find(".wp-block-getwid-toggle__content").outerHeight(!0);e.preventDefault(),n.hasClass("is-active")?(n.removeClass("is-active"),i.css("height",o),t(i).animate({height:0},{queue:!1,duration:500,complete:function(){t(this).css("height","")}})):(t(i).animate({height:o},{queue:!1,duration:500,complete:function(){t(this).css("height","")}}),n.addClass("is-active"))})})};n()})}(jQuery)},517:function(t,e,n){"use strict";var i=n(20);!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){t(".wp-block-getwid-icon-box:not(.getwid-init)").each(function(e,n){t(n).addClass("getwid-init"),t(".getwid-animation.wp-block-getwid-icon-box").mouseenter(function(){Object(i.a)(t(this).find(".wp-block-getwid-icon-box__icon-wrapper"),{animation:t(this).attr("data-animation")})})})};n()})}(jQuery)},518:function(t,e,n){"use strict";var i=n(20);!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){var e,n,o,a,d,c,s,r,l=t(".wp-block-getwid-media-text-slider:not(.getwid-init) .wp-block-getwid-media-text-slider__content");l.each(function(l){s=t(this),s.closest(".wp-block-getwid-media-text-slider").addClass("getwid-init"),r=void 0!==t(this).closest(".wp-block-getwid-media-text-slider").data("animation"),e=1==s.data("slide-autoplay"),n=1==s.data("slide-pause-on-hover"),o=parseInt(s.data("slide-autoplay-speed")),a="fade"==s.data("slide-effect"),d=parseInt(s.data("slide-speed")),c=1==s.data("infinite"),r&&t(this).find(".wp-block-getwid-media-text-slider-slide .wp-block-getwid-media-text-slider-slide-content__content").css("opacity","0"),s.on("init",function(){if(c)if(1==a)var e=t(this).find(".wp-block-getwid-media-text-slider-slide__content-wrapper").eq(0).find(".wp-block-getwid-media-text-slider-slide-content__content");else var e=t(this).find(".wp-block-getwid-media-text-slider-slide__content-wrapper").eq(1).find(".wp-block-getwid-media-text-slider-slide-content__content");else var e=t(this).find(".wp-block-getwid-media-text-slider-slide__content-wrapper").first().find(".wp-block-getwid-media-text-slider-slide-content__content");r&&e.css("opacity","1")});var u=!1;s.on("beforeChange",function(t,e,n,i){u=n==i}),s.on("afterChange",function(e,n,o){if(!u){r&&t(this).find(".wp-block-getwid-media-text-slider-slide .wp-block-getwid-media-text-slider-slide-content__content").css("opacity","0");var a=t(this).find('.wp-block-getwid-media-text-slider-slide[data-slick-index="'+o+'"]').find(".wp-block-getwid-media-text-slider-slide-content__content");r&&a.length&&Object(i.a)(a,{animation:t(this).closest(".wp-block-getwid-media-text-slider").data("animation"),duration:t(this).closest(".wp-block-getwid-media-text-slider").data("duration"),delay:t(this).closest(".wp-block-getwid-media-text-slider").data("delay")},a.css("opacity","1"))}});var p=t(this).closest(".".concat("wp-block-getwid-media-text-slider")),f=!p.hasClass("has-arrows-none"),w=!p.hasClass("has-dots-none");s.slick({rows:0,slidesToShow:1,slidesToScroll:1,autoplay:e,pauseOnHover:n,autoplaySpeed:o,fade:a,speed:d,infinite:c,arrows:f,dots:w})})};n()})}(jQuery)},519:function(t,e){!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){var e,n,i,o,a,d,c,s,r,l,u,p,f,w,g,m,h,_,b,v=t(".wp-block-getwid-images-slider:not(.getwid-init) .wp-block-getwid-images-slider__wrapper");v.length&&"undefined"!=typeof imagesLoaded&&v.each(function(v){e=t(this),e.closest(".wp-block-getwid-images-slider").addClass("getwid-init"),e.imagesLoaded().done(function(e){var v=t(e.elements[0]);n="fade"==v.data("effect"),i=v.data("slides-show")&&"slide"==v.data("effect")?parseInt(v.data("slides-show")):1,o=v.data("slides-show-laptop")?parseInt(v.data("slides-show-laptop")):1,a=v.data("slides-show-tablet")?parseInt(v.data("slides-show-tablet")):1,d=v.data("slides-show-mobile")?parseInt(v.data("slides-show-mobile")):1,c=v.data("slides-scroll")?parseInt(v.data("slides-scroll")):1,s=1==v.data("autoplay"),r=parseInt(v.data("autoplay-speed"))?parseInt(v.data("autoplay-speed")):2e3,l=1==v.data("infinite"),u=parseInt(v.data("animation-speed")),p=1==v.data("center-mode"),f=1==v.data("variable-width"),w=1==v.data("pause-hover"),g="none"!=v.data("arrows"),m="none"!=v.data("dots"),h=v.data("height")?v.data("height"):void 0,_=!!v.data("reset-on-tablet"),b=!!v.data("reset-on-mobile"),t(e.elements[0]).slick({arrows:g,dots:m,rows:0,slidesToShow:i,slidesToScroll:c,autoplay:s,autoplaySpeed:r,fade:n,speed:u,infinite:l,centerMode:p,variableWidth:f,pauseOnHover:w,adaptiveHeight:!0,responsive:[{breakpoint:991,settings:{slidesToShow:o,slidesToScroll:1}},{breakpoint:768,settings:{slidesToShow:a,slidesToScroll:1}},{breakpoint:468,settings:{slidesToShow:d,slidesToScroll:1}}]})})})};n()})}(jQuery)},520:function(module,__webpack_exports__,__webpack_require__){"use strict";var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_typeof__=__webpack_require__(13),__WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_typeof___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_typeof__);!function($){var _this=this;$(document).ready(function(event){function removeAllAttributes(t){var e=$.map(t[0].attributes,function(t){return t.name});$.each(e,function(e,n){"class"!=n&&t.removeAttr(n)})}function mapStyles(mapData){var mapStyle=mapData.mapStyle,customStyle=mapData.customStyle;if("object"==__WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_typeof___default()(mapStyle))return null;if("default"!=mapStyle){if("custom"!=mapStyle)return stylesArr[mapStyle];try{return eval(customStyle)}catch(t){if(!(t instanceof SyntaxError))throw t;console.error(t.message)}}}function initMarkers(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=t.mapMarkers,o=i[e].coords,a=new google.maps.Marker({position:o,map:n,draggable:!1,animation:google.maps.Animation.DROP});i[e].bounce&&setTimeout(function(){return a.setAnimation(google.maps.Animation.BOUNCE)},2e3);var d="";""!=unescape(i[e].description)&&(d="\n\t\t\t\t\t<div class='getwid-poi-info-window'>\n\t\t\t\t\t\t".concat(_unescape(i[e].description),"\n\t\t\t\t\t</div>\n\t\t\t\t")),attachMessage(a,d,i[e].popUpOpen,i[e].popUpMaxWidth)}function attachMessage(t,e,n,i){var o=new google.maps.InfoWindow({content:e,maxWidth:i});n&&""!=o.content&&o.open(t.get("map"),t),google.maps.event.clearInstanceListeners(t),t.addListener("click",function(){""!=o.content&&o.open(t.get("map"),t)})}$(document.body).on("post-load",function(t){getwid_init_map()});var getwid_init_map=function(){var t=$(".wp-block-getwid-map:not(.getwid-init)");"undefined"!=typeof google?t.each(function(t,e){$(_this).addClass("getwid-init"),$(e).find(".wp-block-getwid-map__points").remove();var n=$(e).find(".wp-block-getwid-map__container")[0],i=$(e).data("map-center"),o=$(e).data("map-markers"),a=$(e).data("map-zoom"),d=$(e).data("map-style"),c=$(e).data("custom-style"),s=$(e).data("zoom-control"),r=$(e).data("type-control"),l=$(e).data("interaction"),u=$(e).data("street-view-control"),p=$(e).data("full-screen-control");removeAllAttributes($(e));var f={mapCenter:i,mapZoom:a,interaction:l,mapStyle:d,customStyle:c,zoomControl:s,mapTypeControl:r,streetViewControl:u,fullscreenControl:p,mapMarkers:o},w=new google.maps.Map(n,{center:i,styles:mapStyles(f),gestureHandling:l,zoomControl:s,mapTypeControl:r,streetViewControl:u,fullscreenControl:p,zoom:a});void 0!==o&&o.length&&$.each(o,function(t,e){initMarkers(f,t,w)})}):t.length&&t.each(function(t,e){var n=$(e);n.find(".wp-block-getwid-map__container").remove(),$(n).prepend('<iframe src="https://www.google.com/maps/embed" style="border:0;" allowfullscreen="" width="100%" height="400px" frameborder="0"></iframe>')})};getwid_init_map()})}(jQuery)},521:function(t,e,n){"use strict";var i=n(20);!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){t(".wp-block-getwid-image-box:not(.getwid-init)").each(function(e,n){t(n).addClass("getwid-init"),t(".getwid-animation.wp-block-getwid-image-box").mouseenter(function(){Object(i.a)(t(this).find(".wp-block-getwid-image-box__image-wrapper"),{animation:t(this).attr("data-animation")})})})};n()})}(jQuery)},522:function(t,e){!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){t(".wp-block-getwid-progress-bar:not(.getwid-init)").each(function(e){function n(e){c.find(t("".concat(d,"__progress"))).css("width","".concat(e,"%")),c.find(t("".concat(d,"__percent"))).text("".concat(e,"%"))}function i(e){var n=c.find(t("".concat(d,"__progress"))),i=function(){return Math.round(n.width()/n.parent().width()*100)};n.animate({width:"".concat(e,"%")},{duration:2e3,progress:function(){c.find(t("".concat(d,"__percent"))).text(i()+"%")}})}t(this).addClass("getwid-init");var o,a,d=".wp-block-getwid-progress-bar",c=t(this);o=c.find("".concat(d,"__wrapper")).data("fill-amount"),a=c.find("".concat(d,"__wrapper")).data("is-animated");var s=c.find(t("".concat(d,"__wrapper"))),r=new Waypoint({element:s.get(0),handler:function(){a?i(o):n(o),r.destroy()},offset:"100%"});t(window).resize(function(){n(o)})})};n()})}(jQuery)},523:function(t,e){!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){t(".wp-block-getwid-circle-progress-bar:not(.getwid-init)").each(function(e){function n(){var t=f.find("".concat(p,"__canvas")).get(0);t.width=parseFloat(r),t.height=parseFloat(r)}function i(t,e){var i=f.find("".concat(p,"__canvas")).get(0).getContext("2d"),o="auto"===l?r/14:l,c=r/2,s=Math.PI/180*-90;n(),i.clearRect(0,0,r,r),i.beginPath(),i.arc(c,c,c-o/2,s,s+2*Math.PI),i.lineWidth=o,i.strokeStyle=a,i.stroke(),i.beginPath(),i.arc(c,c,c-o/2,s,s+2*Math.PI*(t/100)),i.lineWidth=o,i.strokeStyle=d,i.stroke(),i.beginPath(),i.textAlign="center",i.font="16px serif",i.fillText(e||t+"%",c+6.5,c+5),i.stroke()}function o(t){var e=0,n=setInterval(function(){i(e,t),++e>c&&clearInterval(n)},35)}var a,d,c,s,r,l,u,p=".wp-block-getwid-circle-progress-bar",f=t(this);t(this).addClass("getwid-init"),a=f.find("".concat(p,"__wrapper")).data("background-color")?f.find("".concat(p,"__wrapper")).data("background-color"):"#eeeeee",d=f.find("".concat(p,"__wrapper")).data("text-color")?f.find("".concat(p,"__wrapper")).data("text-color"):"#0000ee",c=f.find("".concat(p,"__wrapper")).data("fill-amount"),s=f.find("".concat(p,"__wrapper")).data("is-animated"),r=f.find("".concat(p,"__wrapper")).data("size"),l=f.find("".concat(p,"__wrapper")).data("thickness"),u=f.find("".concat(p,"__wrapper")).data("value");var w=f.find(t("".concat(p,"__wrapper"))),g=new Waypoint({element:w.get(0),handler:function(){s?o(u):i(c,u),g.destroy()},offset:"100%"})})};n()})}(jQuery)},524:function(t,e){!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){t(".wp-block-getwid-counter:not(.getwid-init)").each(function(e){function n(){if(!r)return null;switch(f){case"outExpo":return function(t,e,n,i){return n*(1-Math.pow(2,-10*t/i))*1024/1023+e};case"outQuintic":return function(t,e,n,i){var o=(t/=i)*t,a=o*t;return e+n*(a*o+-5*o*o+10*a+-10*o+5*t)};case"outCubic":return function(t,e,n,i){var o=(t/=i)*t;return e+n*(o*t+-3*o+3*t)}}}function i(){switch(w){case"eastern_arabic":return["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];case"farsi":return["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];default:return null}}function o(){return{startVal:a,decimalPlaces:c,duration:s,useEasing:r,useGrouping:l,separator:u,decimal:p,easingFn:n(),numerals:i()}}t(this).addClass("getwid-init");var a,d,c,s,r,l,u,p,f,w,g=".wp-block-getwid-counter",m=t(this);a=m.find("".concat(g,"__wrapper")).data("start"),d=m.find("".concat(g,"__wrapper")).data("end"),c=m.find("".concat(g,"__wrapper")).data("decimal-places"),s=m.find("".concat(g,"__wrapper")).data("duration"),r=m.find("".concat(g,"__wrapper")).data("use-easing"),l=m.find("".concat(g,"__wrapper")).data("use-grouping"),u=m.find("".concat(g,"__wrapper")).data("separator"),p=m.find("".concat(g,"__wrapper")).data("decimal"),f=m.find("".concat(g,"__wrapper")).data("easing-fn"),w=m.find("".concat(g,"__wrapper")).data("numerals");var h=m.find("".concat(g,"__number")),_=new Waypoint({element:h.get(0),handler:function(){new CountUp(h.get(0),d,o()).start(),_.destroy()},offset:"100%"})})};n()})}(jQuery)},525:function(t,e){!function(t){var e=this;t(document).ready(function(n){t(document.body).on("post-load",function(t){i()});var i=function(){t(".wp-block-getwid-contact-form__form:not(.getwid-init)").each(function(n,i){t(e).addClass("getwid-init");var o,a=t(i).find("p[class$=__result]"),d=t(i).find("button[type='submit']"),c=t(i).find(".wp-block-getwid-captcha");c.length&&function(){if(c.length){var t=c.data("sitekey"),e=c.data("theme");grecaptcha.ready(function(){o=grecaptcha.render(c[0],{sitekey:t,theme:e})})}}(),a.hide(),t(i).submit(function(e){e.preventDefault(),d.prop("disabled",!0);var n={action:"getwid_send_mail",security:Getwid.nonces.recaptcha_v2_contact_form,data:t(i).serialize()};""!=a.text()&&a.hide(300),t.post(Getwid.ajax_url,n,function(e){a.hasClass("success")?a.removeClass("success"):a.hasClass("fail")&&a.removeClass("fail"),d.prop("disabled",!1),c.length&&e.success&&grecaptcha.reset(o),e.success?(t(i)[0].reset(),a.addClass("success")):a.addClass("fail"),a.html(e.data),a.show(300)})})})};i()})}(jQuery)},526:function(t,e){!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){var e=t(".wp-block-getwid-post-carousel:not(.getwid-init) .wp-block-getwid-post-carousel__wrapper");e.length&&"undefined"!=typeof imagesLoaded&&e.each(function(e){getwid_post_carousel=t(this);var n=getwid_post_carousel.data("slider-option"),i=n.sliderSlidesToShowDesktop,o=n.getwid_slidesToShowLaptop,a=n.getwid_slidesToShowTablet,d=n.getwid_slidesToShowMobile,c=n.getwid_slidesToScroll,s=n.getwid_autoplay,r=n.getwid_autoplay_speed,l=n.getwid_infinite,u=n.getwid_animation_speed,p=n.getwid_center_mode,f=n.getwid_pause_on_hover,w=n.getwid_arrows,g=n.getwid_dots;f=!1,c=parseInt(c),i=parseInt(i),o=parseInt(o),d=parseInt(d),a=parseInt(a),w="none"!=w,g="none"!=g,getwid_post_carousel.closest(".wp-block-getwid-post-carousel").addClass("getwid-init"),getwid_post_carousel.imagesLoaded().done(function(e){t(e.elements[0]).slick({arrows:w,dots:g,rows:0,slidesToShow:i,slidesToScroll:c,autoplay:s,autoplaySpeed:r,fade:!1,speed:u,infinite:l,centerMode:p,variableWidth:!1,pauseOnHover:f,adaptiveHeight:!0,responsive:[{breakpoint:991,settings:{slidesToShow:o,slidesToScroll:1}},{breakpoint:768,settings:{slidesToShow:a,slidesToScroll:1}},{breakpoint:468,settings:{slidesToShow:d,slidesToScroll:1}}]})})})};n()})}(jQuery)},527:function(t,e){!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){var e=t(".wp-block-getwid-post-slider:not(.getwid-init) .wp-block-getwid-post-slider__content");e.length&&"undefined"!=typeof imagesLoaded&&e.each(function(e){getwid_post_slider=t(this);var n=getwid_post_slider.data("slider-option"),i=n.getwid_fade_effect,o=n.getwid_autoplay,a=n.getwid_autoplay_speed,d=n.getwid_infinite,c=n.getwid_animation_speed,s=n.getwid_arrows,r=n.getwid_dots;i="fade"==i,getwid_pause_on_hover=!1,s="none"!=s,r="none"!=r,getwid_post_slider.closest(".wp-block-getwid-post-slider").addClass("getwid-init"),getwid_post_slider.imagesLoaded().done(function(e){t(e.elements[0]).slick({arrows:s,dots:r,rows:0,slidesToShow:1,slidesToScroll:1,autoplay:o,autoplaySpeed:a,fade:i,speed:c,infinite:d,centerMode:!1,variableWidth:!1,pauseOnHover:!1,adaptiveHeight:!0})})})};n()})}(jQuery)},528:function(t,e){!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){t(".wp-block-getwid-video-popup:not(.getwid-init)").each(function(e){t(this).addClass("getwid-init"),t(this).find(".wp-block-getwid-video-popup__link").magnificPopup({mainClass:"getwid-video-popup",type:"iframe",iframe:{patterns:{youtube:{index:"youtu",id:function(t){if(-1!=t.indexOf("youtube.com/")){var e=t.match(/v=(.+)(\&|$)/);if(void 0!==e[1])return e[1]}if(-1!=t.indexOf("youtu.be/")){var n=t.match(/be\/(.+)(\?|$)/);if(void 0!==n[1])return n[1]}},src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},dailymotion:{index:"dailymotion.com",id:function(t){var e=t.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);return null!==e?void 0!==e[4]?e[4]:e[2]:null},src:"https://www.dailymotion.com/embed/video/%id%"}}}})})};n()})}(jQuery)},529:function(t,e){!function(t){var e=this;t(document).ready(function(n){t(document.body).on("post-load",function(t){i()});var i=function(){t(".wp-block-getwid-mailchimp__form:not(.getwid-init)").each(function(n,i){t(e).addClass("getwid-init");var o=t(i).find("p[class$=__result]"),a=t(i).find("button[type='submit']");o.hide(),t(i).submit(function(e){e.preventDefault(),a.prop("disabled",!0);var n={action:"getwid_subscribe",data:t(i).serialize()};""!=o.text()&&o.hide(300),t.post(Getwid.ajax_url,n,function(e){o.hasClass("success")?o.removeClass("success"):o.hasClass("fail")&&o.removeClass("fail"),a.prop("disabled",!1),e.success?(t(i)[0].reset(),o.addClass("success")):o.addClass("fail"),o.html(e.data),o.show(300)})})})};i()})}(jQuery)},530:function(t,e,n){"use strict";var i=n(20);!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){t(".wp-block-getwid-image-hotspot:not(.getwid-init)").each(function(e,n){t(this).addClass("getwid-init");var o=t(n).data("trigger"),a=t(n).data("theme"),d=t(n).data("tooltip-animation"),c=t(n).data("arrow"),s=t(n).data("image-points");t(".getwid-animation .wp-block-getwid-image-hotspot__dot").mouseenter(function(){Object(i.a)(t(this),{animation:t(this).closest(".getwid-animation").attr("data-animation")})}),t(n).find(".wp-block-getwid-image-hotspot__dot").each(function(e,n){var i=t(n),r=i.data("point-id"),l=_unescape(i.find(".wp-block-getwid-image-hotspot__dot-title").html()),u=_unescape(s[r].content),p=s[r].popUpOpen,f=s[r].placement,w=s[r].popUpWidth,g=tippy(n,{maxWidth:parseInt(w,10),hideOnClick:"multiple"!=o||"toggle",theme:a,animation:d,animateFill:!1,interactive:!0,trigger:"hover"==o?"mouseenter":"click",arrow:c,placement:f,allowHTML:!0,content:'<div class="wp-block-getwid-image-hotspot__tooltip"><div class="wp-block-getwid-image-hotspot__tooltip-title">'.concat(l,'</div><div class="wp-block-getwid-image-hotspot__tooltip-content">').concat(u,"</div></div>")});p&&setTimeout(function(){g.show()},1e3),i.find(".wp-block-getwid-image-hotspot__dot-description").remove(),new Waypoint({element:n,handler:function(e){t(this.element).addClass("is-visible")},offset:"100%"})})})};n()})}(jQuery)},531:function(t,e,n){"use strict";var i=n(27),o=n.n(i);!function(t){var e=this;t(document).ready(function(n){t(document.body).on("post-load",function(t){i()});var i=function(){t(".wp-block-getwid-content-timeline:not(.getwid-init)").each(function(n,i){t(e).addClass("getwid-init");var a=!1,d="wp-block-getwid-content-timeline-item",c=t(i).find(".".concat(d)),s="none"!=t(i).data("animation")?t(i).data("animation"):null,r=t(i).find("div[class$=__point]").data("point-color"),l=t(i).data("filling");t.each(c,function(e,n){s&&(n.getBoundingClientRect().top>.8*window.innerHeight?t(n).addClass("is-hidden"):t(n).addClass(s));var i=t(n).find(".".concat(d,"__content-wrapper"));(0==i.children().length||i.find(".".concat(d,"__mobile-meta")).is(":only-child"))&&i.addClass("has-no-content")});var u=function(e){t.each(c,function(n,i){t(i).hasClass("is-hidden")&&i.getBoundingClientRect().top<=.8*window.innerHeight&&(t(i).removeClass("is-hidden"),t(i).addClass(e))}),a=!1};s&&t(document).scroll(function(){a||(a=!0,window.requestAnimationFrame?window.requestAnimationFrame(function(){return u(s)}):setTimeout(function(){return u(s)},250))});var p=t(window).height()/2,f=function(){var e=t(i).find(".".concat(d,"__point")),n=0;t.each(e,function(t,i){e[t+1]&&(n+=e[t+1].getBoundingClientRect().top-i.getBoundingClientRect().top)});var a=t(i).find("div[class$=__line]"),c=e.get(),s=o()(c),r=s[0],l=(s.slice(1),t(r).position().top+t(r).height()/2);a.css({height:n,top:l})},w=function(){var e=t(i).find(".".concat(d,"__point")),n=e.get(),a=o()(n);a[0],a.slice(1).length&&t.each(e,function(e,n){var i=n.getBoundingClientRect().top,o=t(n).parents(".".concat(d))[0];i<=p?(t(o).hasClass("is-active")||t(o).addClass("is-active"),t(n).find(":first-child").css({borderColor:r||""})):(t(o).hasClass("is-active")&&t(o).removeClass("is-active"),t(n).find(":first-child").css({borderColor:""}))})},g=function(){var e=t(i).find(".".concat(d,"__point")),n=t(i).find("div[class*=__bar]")[0],a=n.getBoundingClientRect().top,c=e.toArray(),s=o()(c),r=s[0],l=s.slice(1),u=p-r.getBoundingClientRect().top;if(l.length){var f=l.slice(-1).pop(),w=f.getBoundingClientRect().top;a<=p&&w>=p&&t(n).css({height:u}),a>=p&&t(n).css({height:0}),w<=p&&t(n).css({height:"100%"})}};t(document).ready(function(){var e=setInterval(function(){"complete"==document.readyState&&(f(),l&&(w(),g()),l&&t(document).scroll(function(){w(),g()}),clearInterval(e))},1e3)}),t(window).resize(function(){f(),l&&(w(),g())})})};i()})}(jQuery)},532:function(t,e){!function(t){t(document).ready(function(e){t(document.body).on("post-load",function(t){n()});var n=function(){t(".wp-block-getwid-countdown:not(.getwid-init)").each(function(e,n){t(this).addClass("getwid-init");var i=jQuery(n).find(".wp-block-getwid-countdown__content"),o=i.data("datetime"),a=i.data("years"),d=i.data("months"),c=i.data("weeks"),s=i.data("days"),r=i.data("hours"),l=i.data("minutes"),u=i.data("seconds"),p=i.data("bg-color"),f="negative"==o?"":o,w="";a&&(w+="Y"),d&&(w+="O"),c&&(w+="W"),s&&(w+="D"),r&&(w+="H"),l&&(w+="M"),u&&(w+="S"),i.countdown({until:f,format:w,onTick:function(t){var e=jQuery(".countdown-section",i);p&&e.css("background-color",p)}})})};n()})}(jQuery)}});
(function($){'use strict';if(typeof wpcf7==='undefined'||wpcf7===null){return;}
wpcf7=$.extend({cached:0,inputs:[]},wpcf7);$(function(){wpcf7.supportHtml5=(function(){var features={};var input=document.createElement('input');features.placeholder='placeholder'in input;var inputTypes=['email','url','tel','number','range','date'];$.each(inputTypes,function(index,value){input.setAttribute('type',value);features[value]=input.type!=='text';});return features;})();$('div.wpcf7 > form').each(function(){var $form=$(this);wpcf7.initForm($form);if(wpcf7.cached){wpcf7.refill($form);}});});wpcf7.getId=function(form){return parseInt($('input[name="_wpcf7"]',form).val(),10);};wpcf7.initForm=function(form){var $form=$(form);wpcf7.setStatus($form,'init');$form.submit(function(event){if(!wpcf7.supportHtml5.placeholder){$('[placeholder].placeheld',$form).each(function(i,n){$(n).val('').removeClass('placeheld');});}
if(typeof window.FormData==='function'){wpcf7.submit($form);event.preventDefault();}});$('.wpcf7-submit',$form).after('<span class="ajax-loader"></span>');wpcf7.toggleSubmit($form);$form.on('click','.wpcf7-acceptance',function(){wpcf7.toggleSubmit($form);});$('.wpcf7-exclusive-checkbox',$form).on('click','input:checkbox',function(){var name=$(this).attr('name');$form.find('input:checkbox[name="'+name+'"]').not(this).prop('checked',false);});$('.wpcf7-list-item.has-free-text',$form).each(function(){var $freetext=$(':input.wpcf7-free-text',this);var $wrap=$(this).closest('.wpcf7-form-control');if($(':checkbox, :radio',this).is(':checked')){$freetext.prop('disabled',false);}else{$freetext.prop('disabled',true);}
$wrap.on('change',':checkbox, :radio',function(){var $cb=$('.has-free-text',$wrap).find(':checkbox, :radio');if($cb.is(':checked')){$freetext.prop('disabled',false).focus();}else{$freetext.prop('disabled',true);}});});if(!wpcf7.supportHtml5.placeholder){$('[placeholder]',$form).each(function(){$(this).val($(this).attr('placeholder'));$(this).addClass('placeheld');$(this).focus(function(){if($(this).hasClass('placeheld')){$(this).val('').removeClass('placeheld');}});$(this).blur(function(){if(''===$(this).val()){$(this).val($(this).attr('placeholder'));$(this).addClass('placeheld');}});});}
if(wpcf7.jqueryUi&&!wpcf7.supportHtml5.date){$form.find('input.wpcf7-date[type="date"]').each(function(){$(this).datepicker({dateFormat:'yy-mm-dd',minDate:new Date($(this).attr('min')),maxDate:new Date($(this).attr('max'))});});}
if(wpcf7.jqueryUi&&!wpcf7.supportHtml5.number){$form.find('input.wpcf7-number[type="number"]').each(function(){$(this).spinner({min:$(this).attr('min'),max:$(this).attr('max'),step:$(this).attr('step')});});}
wpcf7.resetCounter($form);$form.on('change','.wpcf7-validates-as-url',function(){var val=$.trim($(this).val());if(val&&!val.match(/^[a-z][a-z0-9.+-]*:/i)&&-1!==val.indexOf('.')){val=val.replace(/^\/+/,'');val='http://'+val;}
$(this).val(val);});};wpcf7.submit=function(form){if(typeof window.FormData!=='function'){return;}
var $form=$(form);$('.ajax-loader',$form).addClass('is-active');wpcf7.clearResponse($form);var formData=new FormData($form.get(0));var detail={id:$form.closest('div.wpcf7').attr('id'),status:'init',inputs:[],formData:formData};$.each($form.serializeArray(),function(i,field){if('_wpcf7'==field.name){detail.contactFormId=field.value;}else if('_wpcf7_version'==field.name){detail.pluginVersion=field.value;}else if('_wpcf7_locale'==field.name){detail.contactFormLocale=field.value;}else if('_wpcf7_unit_tag'==field.name){detail.unitTag=field.value;}else if('_wpcf7_container_post'==field.name){detail.containerPostId=field.value;}else if(field.name.match(/^_/)){}else{detail.inputs.push(field);}});wpcf7.triggerEvent($form.closest('div.wpcf7'),'beforesubmit',detail);var ajaxSuccess=function(data,status,xhr,$form){detail.id=$(data.into).attr('id');detail.status=data.status;detail.apiResponse=data;switch(data.status){case'init':wpcf7.setStatus($form,'init');break;case'validation_failed':$.each(data.invalid_fields,function(i,n){$(n.into,$form).each(function(){wpcf7.notValidTip(this,n.message);$('.wpcf7-form-control',this).addClass('wpcf7-not-valid');$('[aria-invalid]',this).attr('aria-invalid','true');});});wpcf7.setStatus($form,'invalid');wpcf7.triggerEvent(data.into,'invalid',detail);break;case'acceptance_missing':wpcf7.setStatus($form,'unaccepted');wpcf7.triggerEvent(data.into,'unaccepted',detail);break;case'spam':wpcf7.setStatus($form,'spam');wpcf7.triggerEvent(data.into,'spam',detail);break;case'aborted':wpcf7.setStatus($form,'aborted');wpcf7.triggerEvent(data.into,'aborted',detail);break;case'mail_sent':wpcf7.setStatus($form,'sent');wpcf7.triggerEvent(data.into,'mailsent',detail);break;case'mail_failed':wpcf7.setStatus($form,'failed');wpcf7.triggerEvent(data.into,'mailfailed',detail);break;default:wpcf7.setStatus($form,'custom-'+data.status.replace(/[^0-9a-z]+/i,'-'));}
wpcf7.refill($form,data);wpcf7.triggerEvent(data.into,'submit',detail);if('mail_sent'==data.status){$form.each(function(){this.reset();});wpcf7.toggleSubmit($form);wpcf7.resetCounter($form);}
if(!wpcf7.supportHtml5.placeholder){$form.find('[placeholder].placeheld').each(function(i,n){$(n).val($(n).attr('placeholder'));});}
$('.wpcf7-response-output',$form).html('').append(data.message).slideDown('fast');$('.screen-reader-response',$form.closest('.wpcf7')).each(function(){var $response=$(this);$response.html('').append(data.message);if(data.invalid_fields){var $invalids=$('<ul></ul>');$.each(data.invalid_fields,function(i,n){if(n.idref){var $li=$('<li></li>').append($('<a></a>').attr('href','#'+n.idref).append(n.message));}else{var $li=$('<li></li>').append(n.message);}
$invalids.append($li);});$response.append($invalids);}
$response.focus();});if(data.posted_data_hash){$form.find('input[name="_wpcf7_posted_data_hash"]').first().val(data.posted_data_hash);}};$.ajax({type:'POST',url:wpcf7.apiSettings.getRoute('/contact-forms/'+wpcf7.getId($form)+'/feedback'),data:formData,dataType:'json',processData:false,contentType:false}).done(function(data,status,xhr){ajaxSuccess(data,status,xhr,$form);$('.ajax-loader',$form).removeClass('is-active');}).fail(function(xhr,status,error){var $e=$('<div class="ajax-error"></div>').text(error.message);$form.after($e);});};wpcf7.triggerEvent=function(target,name,detail){var event=new CustomEvent('wpcf7'+name,{bubbles:true,detail:detail});$(target).get(0).dispatchEvent(event);};wpcf7.setStatus=function(form,status){var $form=$(form);var prevStatus=$form.data('status');$form.data('status',status);$form.addClass(status);if(prevStatus&&prevStatus!==status){$form.removeClass(prevStatus);}}
wpcf7.toggleSubmit=function(form,state){var $form=$(form);var $submit=$('input:submit',$form);if(typeof state!=='undefined'){$submit.prop('disabled',!state);return;}
if($form.hasClass('wpcf7-acceptance-as-validation')){return;}
$submit.prop('disabled',false);$('.wpcf7-acceptance',$form).each(function(){var $span=$(this);var $input=$('input:checkbox',$span);if(!$span.hasClass('optional')){if($span.hasClass('invert')&&$input.is(':checked')||!$span.hasClass('invert')&&!$input.is(':checked')){$submit.prop('disabled',true);return false;}}});};wpcf7.resetCounter=function(form){var $form=$(form);$('.wpcf7-character-count',$form).each(function(){var $count=$(this);var name=$count.attr('data-target-name');var down=$count.hasClass('down');var starting=parseInt($count.attr('data-starting-value'),10);var maximum=parseInt($count.attr('data-maximum-value'),10);var minimum=parseInt($count.attr('data-minimum-value'),10);var updateCount=function(target){var $target=$(target);var length=$target.val().length;var count=down?starting-length:length;$count.attr('data-current-value',count);$count.text(count);if(maximum&&maximum<length){$count.addClass('too-long');}else{$count.removeClass('too-long');}
if(minimum&&length<minimum){$count.addClass('too-short');}else{$count.removeClass('too-short');}};$(':input[name="'+name+'"]',$form).each(function(){updateCount(this);$(this).keyup(function(){updateCount(this);});});});};wpcf7.notValidTip=function(target,message){var $target=$(target);$('.wpcf7-not-valid-tip',$target).remove();$('<span></span>').attr({'class':'wpcf7-not-valid-tip','role':'alert','aria-hidden':'true',}).text(message).appendTo($target);if($target.is('.use-floating-validation-tip *')){var fadeOut=function(target){$(target).not(':hidden').animate({opacity:0},'fast',function(){$(this).css({'z-index':-100});});};$target.on('mouseover','.wpcf7-not-valid-tip',function(){fadeOut(this);});$target.on('focus',':input',function(){fadeOut($('.wpcf7-not-valid-tip',$target));});}};wpcf7.refill=function(form,data){var $form=$(form);var refillCaptcha=function($form,items){$.each(items,function(i,n){$form.find(':input[name="'+i+'"]').val('');$form.find('img.wpcf7-captcha-'+i).attr('src',n);var match=/([0-9]+)\.(png|gif|jpeg)$/.exec(n);$form.find('input:hidden[name="_wpcf7_captcha_challenge_'+i+'"]').attr('value',match[1]);});};var refillQuiz=function($form,items){$.each(items,function(i,n){$form.find(':input[name="'+i+'"]').val('');$form.find(':input[name="'+i+'"]').siblings('span.wpcf7-quiz-label').text(n[0]);$form.find('input:hidden[name="_wpcf7_quiz_answer_'+i+'"]').attr('value',n[1]);});};if(typeof data==='undefined'){$.ajax({type:'GET',url:wpcf7.apiSettings.getRoute('/contact-forms/'+wpcf7.getId($form)+'/refill'),beforeSend:function(xhr){var nonce=$form.find(':input[name="_wpnonce"]').val();if(nonce){xhr.setRequestHeader('X-WP-Nonce',nonce);}},dataType:'json'}).done(function(data,status,xhr){if(data.captcha){refillCaptcha($form,data.captcha);}
if(data.quiz){refillQuiz($form,data.quiz);}});}else{if(data.captcha){refillCaptcha($form,data.captcha);}
if(data.quiz){refillQuiz($form,data.quiz);}}};wpcf7.clearResponse=function(form){var $form=$(form);$form.siblings('.screen-reader-response').html('');$('.wpcf7-not-valid-tip',$form).remove();$('[aria-invalid]',$form).attr('aria-invalid','false');$('.wpcf7-form-control',$form).removeClass('wpcf7-not-valid');$('.wpcf7-response-output',$form).hide().empty();};wpcf7.apiSettings.getRoute=function(path){var url=wpcf7.apiSettings.root;url=url.replace(wpcf7.apiSettings.namespace,wpcf7.apiSettings.namespace+path);return url;};})(jQuery);(function(){if(typeof window.CustomEvent==="function")return false;function CustomEvent(event,params){params=params||{bubbles:false,cancelable:false,detail:undefined};var evt=document.createEvent('CustomEvent');evt.initCustomEvent(event,params.bubbles,params.cancelable,params.detail);return evt;}
CustomEvent.prototype=window.Event.prototype;window.CustomEvent=CustomEvent;})();
function poll_vote(l){jQuery(document).ready(function(o){poll_answer_id="",poll_multiple_ans=0,poll_multiple_ans_count=0,o("#poll_multiple_ans_"+l).length&&(poll_multiple_ans=parseInt(o("#poll_multiple_ans_"+l).val())),o("#polls_form_"+l+" input:checkbox, #polls_form_"+l+" input:radio, #polls_form_"+l+" option").each(function(l){(o(this).is(":checked")||o(this).is(":selected"))&&(poll_multiple_ans>0?(poll_answer_id=o(this).val()+","+poll_answer_id,poll_multiple_ans_count++):poll_answer_id=parseInt(o(this).val()))}),poll_multiple_ans>0?poll_multiple_ans_count>0&&poll_multiple_ans_count<=poll_multiple_ans?(poll_answer_id=poll_answer_id.substring(0,poll_answer_id.length-1),poll_process(l,poll_answer_id)):0==poll_multiple_ans_count?alert(pollsL10n.text_valid):alert(pollsL10n.text_multiple+" "+poll_multiple_ans):poll_answer_id>0?poll_process(l,poll_answer_id):alert(pollsL10n.text_valid)})}function poll_process(l,o){jQuery(document).ready(function(s){poll_nonce=s("#poll_"+l+"_nonce").val(),pollsL10n.show_fading?(s("#polls-"+l).fadeTo("def",0),pollsL10n.show_loading&&s("#polls-"+l+"-loading").show(),s.ajax({type:"POST",xhrFields:{withCredentials:!0},url:pollsL10n.ajax_url,data:"action=polls&view=process&poll_id="+l+"&poll_"+l+"="+o+"&poll_"+l+"_nonce="+poll_nonce,cache:!1,success:poll_process_success(l)})):(pollsL10n.show_loading&&s("#polls-"+l+"-loading").show(),s.ajax({type:"POST",xhrFields:{withCredentials:!0},url:pollsL10n.ajax_url,data:"action=polls&view=process&poll_id="+l+"&poll_"+l+"="+o+"&poll_"+l+"_nonce="+poll_nonce,cache:!1,success:poll_process_success(l)}))})}function poll_result(l){jQuery(document).ready(function(o){poll_nonce=o("#poll_"+l+"_nonce").val(),pollsL10n.show_fading?(o("#polls-"+l).fadeTo("def",0),pollsL10n.show_loading&&o("#polls-"+l+"-loading").show(),o.ajax({type:"POST",xhrFields:{withCredentials:!0},url:pollsL10n.ajax_url,data:"action=polls&view=result&poll_id="+l+"&poll_"+l+"_nonce="+poll_nonce,cache:!1,success:poll_process_success(l)})):(pollsL10n.show_loading&&o("#polls-"+l+"-loading").show(),o.ajax({type:"POST",xhrFields:{withCredentials:!0},url:pollsL10n.ajax_url,data:"action=polls&view=result&poll_id="+l+"&poll_"+l+"_nonce="+poll_nonce,cache:!1,success:poll_process_success(l)}))})}function poll_booth(l){jQuery(document).ready(function(o){poll_nonce=o("#poll_"+l+"_nonce").val(),pollsL10n.show_fading?(o("#polls-"+l).fadeTo("def",0),pollsL10n.show_loading&&o("#polls-"+l+"-loading").show(),o.ajax({type:"POST",xhrFields:{withCredentials:!0},url:pollsL10n.ajax_url,data:"action=polls&view=booth&poll_id="+l+"&poll_"+l+"_nonce="+poll_nonce,cache:!1,success:poll_process_success(l)})):(pollsL10n.show_loading&&o("#polls-"+l+"-loading").show(),o.ajax({type:"POST",xhrFields:{withCredentials:!0},url:pollsL10n.ajax_url,data:"action=polls&view=booth&poll_id="+l+"&poll_"+l+"_nonce="+poll_nonce,cache:!1,success:poll_process_success(l)}))})}function poll_process_success(l){return function(o){jQuery(document).ready(function(s){s("#polls-"+l).replaceWith(o),pollsL10n.show_loading&&s("#polls-"+l+"-loading").hide(),pollsL10n.show_fading&&s("#polls-"+l).fadeTo("def",1)})}}pollsL10n.show_loading=parseInt(pollsL10n.show_loading),pollsL10n.show_fading=parseInt(pollsL10n.show_fading);
(function($){"use strict";var search_modal=$('#search-modal'),search_field=search_modal.find('.search-field');$('#search-toggle, #close-search-modal').on('click',function(e){e.preventDefault();search_modal.toggleClass('opened');if(search_modal.hasClass('opened')){search_field.focus();}else{search_field.blur();}});var masthead,menuToggle,siteNavigation,siteHeaderMenu;function initMainNavigation(container){var dropdownToggle=$('<button />',{'class':'dropdown-toggle','aria-expanded':false,'html':'<span class="lnr lnr-chevron-down"></span>'});container.find('.menu-item-has-children > a').after(dropdownToggle);container.find('.current-menu-ancestor > button').addClass('toggled-on');container.find('.current-menu-ancestor > .children, .current-menu-ancestor > .sub-menu').addClass('toggled-on');container.find('.menu-item-has-children').attr('aria-haspopup','true');container.on('click','.dropdown-toggle',function(e){var _this=$(this);e.preventDefault();_this.toggleClass('toggled-on');_this.next('.children, .sub-menu').toggleClass('toggled-on');_this.attr('aria-expanded',_this.attr('aria-expanded')==='false'?'true':'false');});}
initMainNavigation($('.main-navigation'));masthead=$('#masthead');menuToggle=masthead.find('#menu-toggle');(function(){if(!menuToggle.length){return;}
menuToggle.add(siteNavigation).attr('aria-expanded','false');menuToggle.on('click',function(){$(this).add(siteHeaderMenu).toggleClass('toggled-on');$(this).add(siteNavigation).attr('aria-expanded',$(this).add(siteNavigation).attr('aria-expanded')==='false'?'true':'false');});})();function subMenuPosition(){$('.sub-menu').each(function(){$(this).removeClass('toleft');if(($(this).parent().offset().left+$(this).parent().width()-$(window).width()+230)>0){$(this).addClass('toleft');}});}
function prependElement(container,element){if(container.firstChild){return container.insertBefore(element,container.firstChild);}else{return container.appendChild(element);}}
function showButton(element){element.className=element.className.replace('is-empty','');}
function hideButton(element){if(!element.classList.contains('is-empty')){element.className+=' is-empty';}}
function getAvailableSpace(button,container){return container.offsetWidth-button.offsetWidth-85;}
function isOverflowingNavivation(list,button,container){return list.offsetWidth>getAvailableSpace(button,container);}
function addItemToVisibleList(toggleButton,container,visibleList,hiddenList){if(getAvailableSpace(toggleButton,container)>breaks[breaks.length-1]){visibleList.appendChild(hiddenList.firstChild);breaks.pop();addItemToVisibleList(toggleButton,container,visibleList,hiddenList);}}
var navContainer=document.querySelector('.main-navigation-wrapper');var breaks=[];if(navContainer){function updateNavigationMenu(container){if(!container.parentNode.querySelector('.primary-menu[id]')){return;}
var visibleList=container.parentNode.querySelector('.primary-menu[id]');var hiddenList=visibleList.parentNode.nextElementSibling.querySelector('.hidden-links');var toggleButton=visibleList.parentNode.nextElementSibling.querySelector('.primary-menu-more-toggle');if((window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)<=991){while(breaks.length>0){visibleList.appendChild(hiddenList.firstChild);breaks.pop();addItemToVisibleList(toggleButton,container,visibleList,hiddenList);}
return;}
if(isOverflowingNavivation(visibleList,toggleButton,container)){breaks.push(visibleList.offsetWidth);prependElement(hiddenList,!visibleList.lastChild||null===visibleList.lastChild?visibleList.previousElementSibling:visibleList.lastChild);showButton(toggleButton);}else{addItemToVisibleList(toggleButton,container,visibleList,hiddenList);if(breaks.length<2){hideButton(toggleButton);}}
if(isOverflowingNavivation(visibleList,toggleButton,container)){updateNavigationMenu(container);}}
document.addEventListener('DOMContentLoaded',function(){updateNavigationMenu(navContainer);var hasSelectiveRefresh=('undefined'!==typeof wp&&wp.customize&&wp.customize.selectiveRefresh&&wp.customize.navMenusPreview.NavMenuInstancePartial);if(hasSelectiveRefresh){wp.customize.selectiveRefresh.bind('partial-content-rendered',function(placement){var isNewNavMenu=(placement&&placement.partial.id.includes('nav_menu_instance')&&'null'!==placement.container[0].parentNode&&placement.container[0].parentNode.classList.contains('main-navigation'));if(isNewNavMenu){updateNavigationMenu(placement.container[0].parentNode);}});}});window.addEventListener('load',function(){updateNavigationMenu(navContainer);subMenuPosition();});var timeout;window.addEventListener('resize',function(){function checkMenu(){if(timeout){clearTimeout(timeout);timeout=undefined;}
timeout=setTimeout(function(){updateNavigationMenu(navContainer);subMenuPosition();},100);}
checkMenu();subMenuPosition();});updateNavigationMenu(navContainer);subMenuPosition();}})(jQuery);
(function(){"use strict";var container,button,menu,links,i,len;container=document.getElementById('site-navigation');if(!container){return;}
button=container.getElementsByTagName('button')[0];if('undefined'===typeof button){return;}
menu=container.getElementsByTagName('ul')[0];if('undefined'===typeof menu){button.style.display='none';return;}
menu.setAttribute('aria-expanded','false');if(-1===menu.className.indexOf('nav-menu')){menu.className+=' nav-menu';}
button.onclick=function(){if(-1!==container.className.indexOf('toggled')){container.className=container.className.replace(' toggled','');button.setAttribute('aria-expanded','false');menu.setAttribute('aria-expanded','false');}else{container.className+=' toggled';button.setAttribute('aria-expanded','true');menu.setAttribute('aria-expanded','true');}};links=menu.getElementsByTagName('a');for(i=0,len=links.length;i<len;i++){links[i].addEventListener('focus',toggleFocus,true);links[i].addEventListener('blur',toggleFocus,true);}
function toggleFocus(){var self=this;while(-1===self.className.indexOf('nav-menu')){if('li'===self.tagName.toLowerCase()){if(-1!==self.className.indexOf('focus')){self.className=self.className.replace(' focus','');}else{self.className+=' focus';}}
self=self.parentElement;}}
(function(container){var touchStartFn,i,parentLink=container.querySelectorAll('.menu-item-has-children > a, .page_item_has_children > a');if('ontouchstart'in window){touchStartFn=function(e){var menuItem=this.parentNode,i;if(!menuItem.classList.contains('focus')){e.preventDefault();for(i=0;i<menuItem.parentNode.children.length;++i){if(menuItem===menuItem.parentNode.children[i]){continue;}
menuItem.parentNode.children[i].classList.remove('focus');}
menuItem.classList.add('focus');}else{menuItem.classList.remove('focus');}};for(i=0;i<parentLink.length;++i){parentLink[i].addEventListener('touchstart',touchStartFn,false);}}}(container));})();
(function(){"use strict";var isIe=/(trident|msie)/i.test(navigator.userAgent);if(isIe&&document.getElementById&&window.addEventListener){window.addEventListener('hashchange',function(){var id=location.hash.substring(1),element;if(!(/^[A-z0-9_-]+$/.test(id))){return;}
element=document.getElementById(id);if(element){if(!(/^(?:a|select|input|button|textarea)$/i.test(element.tagName))){element.tabIndex=-1;}
element.focus();}},false);}})();
(function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d})},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='',b(b.s=4)})({4:function(){(function(a){function b(a){let b={};a[0].hasAttribute('data-dots')&&(b.dots=!!a.data('dots')),a[0].hasAttribute('data-arrows')&&(b.arrows=!!a.data('arrows')),a[0].hasAttribute('data-infinite')&&(b.infinite=!!a.data('infinite')),a[0].hasAttribute('data-speed')&&(b.speed=a.data('speed')),a[0].hasAttribute('data-slideitemdesktop')&&(b.slidesToShow=a.data('slideitemdesktop')),a[0].hasAttribute('data-slidescroll-desktop')&&(b.slidesToScroll=a.data('slidescroll-desktop')),b.nextArrow=a[0].hasAttribute('data-nextarrow')?'<span class="slick-next"><i class="'+a.data('nextarrow')+'"></i></span>':'<span class="slick-next"><i class="fas fa-angle-right"></i></span>',b.prevArrow=a[0].hasAttribute('data-prevarrow')?'<span class="slick-prev"><i class="'+a.data('prevarrow')+'"></i></span>':'<span class="slick-prev"><i class="fas fa-angle-left"></i></span>',a[0].hasAttribute('data-autoplay')&&(b.autoplay=a.data('autoplay')),a[0].hasAttribute('data-autoplayspeed')&&(b.autoplaySpeed=a.data('autoplayspeed')),a[0].hasAttribute('data-fade')&&(b.fade=a.data('fade')),a[0].hasAttribute('data-mode-center')&&(b.centerMode=a.data('mode-center')),a[0].hasAttribute('data-mode-center-padding')&&(b.centerPadding=a.data('mode-center-padding'));let c={},d={};a[0].hasAttribute('data-slideitemtablet')&&(c.slidesToShow=a.data('slideitemtablet')),a[0].hasAttribute('data-slidescroll-tablet')&&(c.slidesToScroll=a.data('slidescroll-tablet')),a[0].hasAttribute('data-dotstablet')&&(c.dots=!!a.data('dotstablet')),a[0].hasAttribute('data-arrowstablet')&&(c.arrows=!!a.data('arrowstablet')),a[0].hasAttribute('data-slideitemmobile')&&(d.slidesToShow=a.data('slideitemmobile')),a[0].hasAttribute('data-slidescroll-mobile')&&(d.slidesToScroll=a.data('slidescroll-mobile')),a[0].hasAttribute('data-dotsmobile')&&(d.dots=!!a.data('dotsmobile')),a[0].hasAttribute('data-arrowsmobile')&&(d.arrows=!!a.data('arrowsmobile'));b.responsive=[],b.responsive.push({breakpoint:1024,settings:c}),b.responsive.push({breakpoint:480,settings:d}),a[0].hasAttribute('data-arrowspositiondesktop')&&'gutentor-slick-a-default-desktop'!==a.data('arrowspositiondesktop')&&(b.appendArrows=a.siblings('.gutentor-slick-arrows')),a.slick(b)}function c(a,b=!1){let c={};c=b?{type:'image',closeBtnInside:!1,gallery:{enabled:!0},fixedContentPos:!1}:{disableOn:700,type:'iframe',mainClass:'mfp-fade',removalDelay:160,preloader:!1,fixedContentPos:!1},a.magnificPopup(c)}function d(a){let b={barColor:a.data('barcolor'),trackColor:a.data('trackcolor'),scaleColor:a.data('scalecolor'),size:a.data('size'),lineCap:a.data('linecap'),animate:a.data('animate'),lineWidth:a.data('linewidth')};a.easyPieChart(b)}function e(a){let b=parseInt(a.data('start')),c=parseInt(a.data('end')),d=parseInt(a.data('duration')),e=new CountUp(a[0],b,c,0,d);e.start()}function f(a){let b=a.data('eventdate');if(void 0===b||null===b)return a.html('<span>Please set validate Date and time for countdown </span>'),!1;let c=a.data('expiredtext'),d=a.find('.day'),e=a.find('.hour'),f=a.find('.min'),g=a.find('.sec'),h=b.split('T');if(2!==h.length)return!1;let i=h[0],j=h[1],k=i.split('-');if(3!==k.length)return!1;let l=j.split(':');if(3!==l.length)return!1;let m=parseInt(k[0]),n=parseInt(k[1])-1,o=parseInt(k[2]),p=parseInt(l[0]),q=parseInt(l[1]),r=parseInt(l[2]),s=new Date(m,n,o,p,q,r,0).getTime(),t=setInterval(function(){var b=Math.floor;let h=new Date().getTime(),i=s-h,j=b(i/86400000),k=b(i%86400000/3600000),l=b(i%3600000/60000),m=b(i%60000/1e3);d.html(j),e.html(k),f.html(l),g.html(m),0>i&&(clearInterval(t),a.html('<span>'+c+'</span>'))},1e3)}function g(a,b){if(a.fireEvent)a.fireEvent('on'+b);else{let c=document.createEvent('Events');c.initEvent(b,!0,!1),a.dispatchEvent(c)}}function h(){l.on('click','.gutentor-tabs-list',function(){let b=a(this),c=b.data('index'),d=b.closest('.gutentor-tabs'),e=d.next('.gutentor-tabs-content-wrap'),f=e.find('.'+c);f.siblings().removeClass('gutentor-tab-content-active'),b.siblings().removeClass('gutentor-tab-active'),f.addClass('gutentor-tab-content-active'),b.addClass('gutentor-tab-active')})}function i(b){l.on('click',b,function(c){c.preventDefault(),'.gutentor-show-more-button'===b?a(this).closest('.gutentor-single-item-content').addClass('show-more-content'):a(this).closest('.gutentor-single-item-content').removeClass('show-more-content')})}function j(a){let b;switch(a){case'gp4-animation-1':b='<div class="gutentor-loading-wrap"></div>';break;case'gp4-animation-2':b='<div class="gutentor-loading-wrap"><div class="gutentor-loading-2"><div></div><div></div><div></div></div></div>';break;case'gp4-animation-3':b='<div class="gutentor-loading-wrap"><div class="gutentor-loading-3"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';break;case'gp4-animation-4':b='<div class="gutentor-loading-wrap"></div>';break;case'gp4-animation-5':b='<div class="gutentor-loading-wrap"><div class="gutentor-loading-5"></div></div>';break;default:b='';}return b}function k(b,c,d=!1){return c.innerBlockType=b.data('i-b'),c.blockId=b.find('.gutentor-post-module').data('gbid'),c.postId=b.data('gpid'),b.find('.gutentor-filter-navigation').length?(c.gTax=b.find('.gutentor-filter-navigation').data('gtax'),c.gTerm=b.find('.gutentor-filter-item-active').children().attr('data-gterm')):(c.gTax='default',c.gTerm='default'),c.paged||(c.paged=1),!(parseInt(b.attr('data-maxnumpages'))<parseInt(c.paged))&&void a.ajax({type:'GET',url:gutentorLS.restUrl+'gutentor-self-api/v1/gadvancedb',data:c,beforeSend:function(a){b.addClass(b.data('l-ani')),a.setRequestHeader('X-WP-Nonce',gutentorLS.restNonce),b.removeClass('gutentor-loaded'),b.find('.gutentor-post-module .grid-container').append(j(b.data('l-ani')))}}).done(function(e){d?b.find('.gutentor-post-module .grid-container .grid-row').append(a(e.pBlog).find('.grid-container .grid-row').html()):b.find('.gutentor-post-module').replaceWith(e.pBlog),b.find('.gutentor-pagination').children().not(':first-child').not(':last-child').remove();let f=parseInt(c.paged),g=parseInt(e.max_num_pages);b.find('.gutentor-pagination').children('.gutentor-pagination-prev').after(e.pagination).children().attr('data-gpage',1<f?f-1:1),b.attr('data-maxnumpages',g),b.find('.gutentor-pagination').children('.gutentor-pagination-next').children().attr('data-gpage',g>f?f+1:g),1>=f?(b.find('.gutentor-pagination').children('.gutentor-pagination-prev').children().addClass('gutentor-disabled'),b.find('.gutentor-navigation').find('.g-nav-prev').addClass('gutentor-disabled')):(b.find('.gutentor-pagination').children('.gutentor-pagination-prev').children().removeClass('gutentor-disabled'),b.find('.gutentor-navigation').find('.g-nav-prev').removeClass('gutentor-disabled')),g<=f?(b.find('.gutentor-pagination').children('.gutentor-pagination-next').children().addClass('gutentor-disabled'),b.find('.gutentor-navigation').find('.g-nav-next').addClass('gutentor-disabled')):(b.find('.gutentor-pagination').children('.gutentor-pagination-next').children().removeClass('gutentor-disabled'),b.find('.gutentor-navigation').find('.g-nav-next').removeClass('gutentor-disabled'))}).fail(function(a,b,c){console.log(a+' :: '+b+' :: '+c)}).always(function(){b.removeClass(b.data('l-ani')),b.addClass('gutentor-loaded'),b.find('.gutentor-post-module .grid-container').find('.gutentor-loading-wrap').remove()})}const l=a(document),m=a('.gutentor-porgress-bar-item'),n=a('.gutentor-element-progressbar'),o=a('.gutentor-counter'),p=a('.gutentor-element-counter'),q=a(window),r=q.width();a.fn.trigger2=function(b){return this.each(function(){let c=a(this).get(0);g(c,b)})},l.on('click','.gutentor-filter-navigation .gutentor-filter-item>a',function(b){b.preventDefault();let c=a(this),d=c.closest('.gutentor-filter-list'),e=c.closest('.gutentor-advanced-post-module');return!c.parent().hasClass('gutentor-filter-item-active')&&void(d.find('.gutentor-filter-item').removeClass('gutentor-filter-item-active'),c.parent().addClass('gutentor-filter-item-active'),k(e,{}))}),l.on('click','.gutentor-pagination a',function(b){b.preventDefault();let c=a(this),d=c.closest('.gutentor-advanced-post-module');if(c.hasClass('gutentor-disabled'))return!1;if(c.parent().hasClass('gutentor-pagination-active'))return!1;let e=c.parent().siblings('.gutentor-pagination-active').children().attr('data-gpage');if(e==c.attr('data-gpage'))return!1;let f={paged:c.attr('data-gpage')};k(d,f)}),l.on('click','.gutentor-navigation a',function(b){b.preventDefault();let c=a(this),d=c.closest('.gutentor-navigation'),e=c.closest('.gutentor-advanced-post-module');if(c.hasClass('gutentor-disabled'))return!1;let f,g=parseInt(d.attr('data-gpage'));f=c.hasClass('g-nav-prev')?g-1:g+1;let h={paged:f};d.attr('data-gpage',f),k(e,h)}),l.on('click','.gutentor-post-footer a.gutentor-button',function(b){b.preventDefault();let c=a(this),d=c.closest('.gutentor-advanced-post-module');if(!c.attr('data-gpage'))c.attr('data-gpage',2);else if(d.attr('data-maxnumpages')&&d.attr('data-maxnumpages')<c.attr('data-gpage'))return c.addClass('gutentor-disabled'),!1;let e={paged:c.attr('data-gpage')};c.attr('data-gpage',parseInt(c.attr('data-gpage'))+1),k(d,e,!0)}),l.ready(function(){if('undefined'!=typeof WOW&&new WOW().init(),a('.gutentor-video-popup-holder').each(function(){c(a(this))}),a('.gutentor-element-button-link-popup').each(function(){c(a(this))}),'undefined'!=typeof a.fn.slick&&(a('.gutentor-slider-wrapper').each(function(){b(a(this))}),a('.gutentor-module-slider-row').each(function(){b(a(this))}),a('.gutentor-carousel-row').each(function(){b(a(this))}),a('.gutentor-image-carousel-row').each(function(){b(a(this))}),a('.gutentor-module-carousel-row').each(function(){b(a(this))}),a('.gutentor-m7-carousel-row').each(function(){b(a(this))})),l.on('click','.gutentor-accordion-heading',function(b){var c=a(this),d=c.closest('.gutentor-accordion-wrap'),e=c.closest('.gutentor-single-item'),f=e.find('.gutentor-accordion-body'),g=d.siblings('.gutentor-accordion-wrap'),h=d.find('.gutentor-accordion-icon');g.each(function(){a(this).find('.gutentor-accordion-body').slideUp(),a(this).find('.gutentor-accordion-heading').removeClass('active')}),f.is(':visible')?(f.slideUp().removeClass('gutentor-active-body'),c.removeClass('active')):(f.slideDown().addClass('gutentor-active-body'),c.addClass('active')),b.preventDefault()}),l.on('click','.gutentor-module-accordion-item-heading',function(b){let c=a(this),d=c.closest('.gutentor-module-accordion'),e=c.closest('.gutentor-module-accordion-item'),f=c.closest('.gutentor-module-accordion-panel');f.toggleClass('gutentor-module-accordion-active'),accordion_icon_wrap=c.find('.gutentor-module-accordion-icon'),accordion_icon_wrap.toggleClass('gutentor-module-accordion-icon-active'),d.hasClass('gutentor-module-accordion-enable-toggle')&&f.hasClass('gutentor-module-accordion-active')&&(e.siblings().find('.gutentor-module-accordion-panel').removeClass('gutentor-module-accordion-active'),accordion_icon_wrap.removeClass('gutentor-module-accordion-active')),b.preventDefault()}),a('.gutentor-module-tabs-item').on('click',function(b){let c=a(this);var d=c.index();c.hasClass('gutentor-tabs-nav-active')||(c.addClass('gutentor-tabs-nav-active'),c.siblings().removeClass('gutentor-tabs-nav-active'),c.closest('.gutentor-module-tabs-wrap').find('.gutentor-module-tabs-content.gutentor-tabs-content-active').removeClass('gutentor-tabs-content-active'),c.closest('.gutentor-module-tabs-wrap').find('.gutentor-module-tabs-content').eq(d).addClass('gutentor-tabs-content-active'),b.preventDefault())}),l.on('click','.gutentor-countup-wrap',function(){a(this).addClass('gutentor-countup-open')}),l.on('click','.gutentor-countup-box-close',function(){a('.gutentor-countup-box').addClass('hide-input'),a(this).hide()}),l.on('click','.gutentor-countup',function(){a('.gutentor-countup-box').removeClass('hide-input')}),m.length&&m.waypoint(function(){a('.gutentor-progressbar-circular').each(function(){d(a(this))})},{offset:'100%'}),a('.gutentor-porgress-bar-item .progressbar').css('width',function(){return a(this).attr('data-width')+'%'}),n.length&&n.waypoint(function(){a('.gutentor-element-progressbar-circular').each(function(){d(a(this))}),a('.gutentor-element-progressbar-box .gutentor-element-progressbar-horizontal').css('width',function(){return a(this).attr('data-width')+'%'})},{offset:'100%'}),o.length){new Waypoint({element:o,handler:function(b){'down'===b&&(o.find('.gutentor-single-item-number').each(function(){e(a(this))}),this.destroy())},offset:'50%'})}if(p.length&&new Waypoint({element:p,handler:function(b){'down'===b&&(p.find('.gutentor-counter-number-main').each(function(){e(a(this))}),this.destroy())},offset:'50%'}),a('.gutentor-countdown-wrapper').each(function(){f(a(this))}),'undefined'!=typeof a.fn.flexMenu){var g=a('.g-responsive-menu');g.length&&g.flexMenu({threshold:0,cutoff:0,linkText:'<span class="screen-reader-text">More</span>',linkTextAll:'<span class="screen-reader-text">More</span>',linkTitle:'',linkTitleAll:'',showOnHover:!!(991<r)})}i('.gutentor-show-more-button'),i('.gutentor-show-less-action-button'),'undefined'!=typeof a.fn.AcmeTicker&&(a('.gutentor-post-module-p5').each(function(){let b=a(this),c=b.find('.gutentor-news-ticker-data'),d=b.find('.gutentor-news-ticker-controls').find('.gutentor-news-ticker-pause'),e=b.find('.gutentor-news-ticker-controls').find('.gutentor-news-ticker-prev'),f=b.find('.gutentor-news-ticker-controls').find('.gutentor-news-ticker-next'),g={type:'horizontal',direction:'right',speed:600,controls:{toggle:d}};b.attr('data-type')&&(g.type=b.attr('data-type'),'marquee'!==b.attr('data-type')&&(g.controls.prev=e,g.controls.next=f)),b.attr('data-direction')&&(g.direction=b.attr('data-direction')),b.attr('data-speed')&&(g.speed=+b.attr('data-speed')),b.attr('data-pauseOnHover')&&(g.pauseOnHover='1'===b.attr('data-pauseOnHover')),c.AcmeTicker(g)}),a(document).on('acmeTickerToggle',function(b,c){a(c).closest('.gutentor-news-ticker').toggleClass('gutentor-ticker-pause')})),h()}),q.on('load',function(){function b(a){let b='';for(let c in a)b+=a[c];return b}let d=a('.gutentor-gallery-wrapper');d.each(function(){let b=a(this);if(b.hasClass('enable-masonry')){let a=b.find('.full-width-row');a.imagesLoaded(function(){b.fadeIn('slow'),a.masonry({itemSelector:'.gutentor-gallery-item'})})}c(b.find('.image-gallery'),!0)});let e,f={},g={},h={},i=a('.gutentor-filter-item-wrap');i.length&&i.isotope({itemSelector:'.gutentor-gallery-item',layoutMode:'fitRows',filter:function(){let b=a(this),c=!(e&&h[e])||b.text().match(h[e]),d=!(e&&g[e])||b.is(g[e]);return c&&d}}),a('.gutentor-filter-group').on('click','.gutentor-filter-btn',function(){a(this).siblings().removeClass('gutentor-filter-btn-active'),a(this).addClass('gutentor-filter-btn-active');let c=a(this).closest('.gutentor-filter-wrapper');e=c.attr('data-filter-number');let d=a(this),h=d.parents('.gutentor-filter-group'),i=h.attr('data-filter-group');f[e]===void 0&&(f[e]={}),f[e][i]=d.attr('data-filter'),g[e]===void 0&&(g[e]={}),g[e]=b(f[e]);let j=a(this).closest('.gutentor-filter-container').next('.gutentor-filter-item-wrap');j.isotope()}),a('.gutentor-search-filter').keyup(function(a,b){let c;return b=b||100,function(){clearTimeout(c);let d=arguments,e=this;c=setTimeout(function(){a.apply(e,d)},b)}}(function(){let b=a(this).closest('.gutentor-filter-wrapper');e=b.attr('data-filter-number'),h[e]=new RegExp(a(this).val(),'gi');let c=a(this).closest('.gutentor-filter-container').next('.gutentor-filter-item-wrap');c.isotope()})),l.find('.gutentor-filter-wrapper').each(function(b){let d=a(this);d.attr('data-filter-number',b),c(d.find('.image-gallery'),!0);let e=d.find('.gutentor-filter-item-wrap');d.hasClass('enable-masonry')&&e.isotope({layoutMode:'masonry'})}),'undefined'!=typeof a.fn.theiaStickySidebar&&a('.gutentor-enable-sticky-column').each(function(){let b=a(this),c=b.find('.grid-row:first').children('.gutentor-single-column'),d=b.attr('data-top'),e=b.attr('data-bottom');c.theiaStickySidebar({additionalMarginTop:parseInt(d),additionalMarginBottom:parseInt(e)})})})})(jQuery)}});
/*! This file is auto-generated */
!function(d,l){"use strict";var e=!1,o=!1;if(l.querySelector)if(d.addEventListener)e=!0;if(d.wp=d.wp||{},!d.wp.receiveEmbedMessage)if(d.wp.receiveEmbedMessage=function(e){var t=e.data;if(t)if(t.secret||t.message||t.value)if(!/[^a-zA-Z0-9]/.test(t.secret)){var r,a,i,s,n,o=l.querySelectorAll('iframe[data-secret="'+t.secret+'"]'),c=l.querySelectorAll('blockquote[data-secret="'+t.secret+'"]');for(r=0;r<c.length;r++)c[r].style.display="none";for(r=0;r<o.length;r++)if(a=o[r],e.source===a.contentWindow){if(a.removeAttribute("style"),"height"===t.message){if(1e3<(i=parseInt(t.value,10)))i=1e3;else if(~~i<200)i=200;a.height=i}if("link"===t.message)if(s=l.createElement("a"),n=l.createElement("a"),s.href=a.getAttribute("src"),n.href=t.value,n.host===s.host)if(l.activeElement===a)d.top.location.href=t.value}}},e)d.addEventListener("message",d.wp.receiveEmbedMessage,!1),l.addEventListener("DOMContentLoaded",t,!1),d.addEventListener("load",t,!1);function t(){if(!o){o=!0;var e,t,r,a,i=-1!==navigator.appVersion.indexOf("MSIE 10"),s=!!navigator.userAgent.match(/Trident.*rv:11\./),n=l.querySelectorAll("iframe.wp-embedded-content");for(t=0;t<n.length;t++){if(!(r=n[t]).getAttribute("data-secret"))a=Math.random().toString(36).substr(2,10),r.src+="#?secret="+a,r.setAttribute("data-secret",a);if(i||s)(e=r.cloneNode(!0)).removeAttribute("security"),r.parentNode.replaceChild(e,r)}}}}(window,document);