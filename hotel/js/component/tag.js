define([],function(){
   return function(JQdom,callback){
     JQdom.on("click",".tag",function(){
          var _this = $(this);
              _this.toggleClass("active");
              $.isFunction(callback) && callback(_this);
     })
   }
})