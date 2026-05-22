require.config(Hotel.requireConfig);

define(["ajaxSub","dropdownSelect","jeDate"],function(ajaxSub,dropdownSelect){

    dropdownSelect($("#dropdown-status"));
    $("#createOrder").jeDate({
      format:"YYYY-MM-DD"
    })

});
    
