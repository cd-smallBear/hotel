require.config(Hotel.requireConfig);

define(["ajaxSub","dropdownSelect","bsDialog","jeDate"],function(ajaxSub,dropdownSelect,bsDialog){
  
  //下拉选择
  dropdownSelect($("#dropdown-level"));

  //时间选择
  
  $("#startDate").rangeJeDate($("#endDate"));

  $("#add-member").click(function(){
    bsDialog.ajaxPage("创建新会员",HotelConfig.root + "/forms/dialog-addMember.html",function($element,dialog){
      dropdownSelect($element.find("#dropdown-discounts"));
    },{
      classes : "modal-wid600",
      buttons:[
        {
          label:"取消"
        },{
          label:"添加",
          closable:false,
          class:"btn btn-primary",
          action:function(dialog){

          }
        }
      ]
    })
  });

});
    
