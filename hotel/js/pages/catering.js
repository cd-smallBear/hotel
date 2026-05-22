require.config(Hotel.requireConfig);

define(["ajaxSub","dropdownSelect","bsDialog","jeDate"],function(ajaxSub,dropdownSelect,dialog){
   //订单管理
   dropdownSelect($("#search-bar"));
   $("#tradeDate").jeDate({
       format : "YYYY-MM-DD"
   });
});
    
