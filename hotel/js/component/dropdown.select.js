define([],function(){
   return function(JQdom,callback,bool){
        //var once = false;
     JQdom.on("click.dropdown",function(e, dom ){
          var _this = $(dom || e.target),input,hidden,offset,modalDialog,modalDialogOffset;

              if(_this.data("toggle") == "dropdown"){
                  //modal-dialog里含有 dropdown , 修改定位方式
                  modalDialog = _this.closest(".modal-dialog");
                  //if(modalDialog.length && !CMSApi.browser.ie ) {
                  if(modalDialog.length ) {
                      var css = {
                          position : "fixed",
                          width    : _this.outerWidth(),
                          minWidth : "auto"
                      };
                      offset = _this.offset();
                      modalDialogOffset = modalDialog.offset();

                      //if (getComputedStyle(document.body, null).transform) { //如果支持才 计算
                      if (!Hotel.browser.ie) { // 非IE都减
                          css.top = offset.top - modalDialogOffset.top + _this.outerHeight();
                          css.left = offset.left - modalDialogOffset.left;
                      } else {
                          css.top = offset.top + _this.outerHeight();
                          css.left = offset.left;
                      }
                      _this.nextAll(".dropdown-menu").css(css);
                  }

                  //if(!once){
                  //    once = true;
                  //    _this.on("focus",function(){
                  //        console.log(1)
                  //        _this[0].blur();
                  //    });
                  //}
                  return true;
              }
              if( !_this.hasClass("dropdown-item")){
                  if( !_this.parent().hasClass("dropdown-menu")){
                      return true;
                  }
                 return false;
              }
              input = _this.closest(".m-select").find(".select-txt");
              hidden = input.siblings("[name="+ input.data("name") +"]");
             if(!hidden.length){
                 hidden = input.siblings("[type=hidden]"); //如果存在没有名字
             }
              _this.addClass("active").siblings().removeClass("active");
              input.val(_this.text()).data('value',_this.data("value"));
              hidden.val(_this.data("value"));
              
              
              hidden.valid && hidden[0].form && hidden.valid();
             if(bool){ //重置
                 bool = false;
                 JQdom.on("clear.dropdown",function(){
                     JQdom.find(".select-txt").each(function(){
                        var _this = $(this);
                             _this.val(this.defaultValue)
                             .siblings("[name="+ _this.data("name") +"]").val("");
                     });
                 });
             }
              $.isFunction(callback) && callback.call(_this,input,hidden);
     }).on("triggerSelect",function(e,data){ // data : array or boolean
         var fn = null;
         if(typeof data == "boolean"){
             fn = function(){
               JQdom.trigger("click.dropdown",$(this).find(".dropdown-item").first());
             }
         }else{
             fn = function(i,item){
                 $(this).find(".dropdown-item").each(function(idx,value){
                     if(this.getAttribute("data-value") == data[i]){
                         JQdom.trigger("click.dropdown",this);
                         return false;
                     }
                 });
             }
         }
         JQdom.find(".dropdown-menu").each(fn);
     });
   };
});