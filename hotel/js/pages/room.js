require.config(Hotel.requireConfig);
define(["ajaxSub","dropdownSelect","bsDialog","webuploader.setting"],function(ajaxSub,dropdownSelect,bsDialog,upload){
    
    dropdownSelect($("#search"));
    
    //添加房间
    $("#add-room").click(function(){
      bsDialog.ajaxPage("添加房间",HotelConfig.root + "/forms/dialog-addRoom.html",function($element,dialog){
        //激活下拉选择
        dropdownSelect($element.find("#room-condition"));
        //初始图片上传
        upload({
          uploadbtn : $element.find("#uploadRoomImage"),
          imgswrap  : $element.find("#uploadRoomImageContainer"),
          fileNumLimit : 2
        });
      },{
        classes : "modal-wid1000",
        buttons:[
          {
            label:"取消"
          },{
            label:"添加",
            closable:false,
            class:"btn btn-primary",
            action:function(dialog){
              //do something example: submit formData
              alert("do something")
            }
          }
        ]
      })
    });

    //添加楼层
    $("#add-floor").click(function(){
      bsDialog.ajaxPage("添加楼层",HotelConfig.root + "/forms/dialog-addFloor.html",function($element,dialog){
        //添加删除事件
        $element.on("click",".delete",function(){
           alert("do something")
        });

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
              //do something example: submit formData
            }
          }
        ]
      })
    });

    //添加房型
    $("#add-roomCate").click(function(){
      bsDialog.ajaxPage("添加房型",HotelConfig.root + "/forms/dialog-addRoomCate.html",function($element,dialog){
        //添加删除事件
        $element.on("click",".delete",function(){
           alert("do something")
        });

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
              //do something example: submit formData
            }
          }
        ]
      })
    });

});
    
// Web Worker
// var webWorker = new Worker("/hotel/js/pages/webWorker.js");
//  webWorker.onmessage = function(e){
//
//    console.log(e.data);
//  }
