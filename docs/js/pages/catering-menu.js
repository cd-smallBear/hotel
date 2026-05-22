require.config(Hotel.requireConfig);

define(["ajaxSub","dropdownSelect","bsDialog","webuploader.setting","dropdownSelectText"],function(ajaxSub,dropdownSelect,dialog,upload,dropdownSelectText){

   //菜品列表
    $("#menuList-data").on("click",".menu-enable",function(){
       var id = this.getAttribute("data-id");
       dialog.alert("","要操作的id: 　" + id,{
           backdrop:false
       });
       // ajax({   打开注释
       //     url : "",
       //     data : {
       //         id : id
       //     },
       //     failCall:function(msg){
       //         dialog.alert("操作提示",msg || "操作失败","type-error");
       //     }
       // });
    });

    //增加菜单
    var page = Hotel.page();
    if(/cateringMenu|cateringMeal/.test(page) ){
        /* 初始logo图片上传 */
        upload({
            uploadbtn : $("#uploadMenuCateImage"),
            imgswrap  : $("#uploadMenuCateImageContainer"),
            fileNumLimit : 1
        });
        /* 初始详情图片上传 */
        upload({
            uploadbtn : $("#uploadMenuCateDetail"),
            imgswrap  : $("#uploadMenuCateDetailContainer"),
            fileNumLimit : 5
        });

        dropdownSelect( $("#dropdown-menuCate") );

        if(page == "cateringMeal"){
            //初始远程加载数据下拉选择
            $("#dropdownText-menuCate").dropdownText({
                // url : "",
                isSearch : true,  //可搜索
                fileValue : "type",   // 默认如果是string 数组 不需要此配置项，如果为 object Array , type为["value","id"] ,value为显示的值,id为要上传的值 ，或者type为function(data){ return [data.value,data.id] ,[0],可以自定义}
                dataList : ["汤","点心","烧菜","烧烤","炖菜"], //传入url ,删掉此行
                valueSure:function(value,id){
                    alert(value,id);
                }
            });
     //添加菜品
            $("#addMenuCate").click(function(){
                dialog.ajaxPage("添加菜品",HotelConfig.root + "/forms/dialog-addMenuCate.html",function($element,dialog){
                    //如果你要在这儿初始一些操作
                },{
                    classes : "modal-wid600",
                    buttons:[
                        {
                            label:"取消"
                        },{
                            label:"增加菜品",
                            closable:false,
                            class:"btn btn-primary",
                            action:function(dialog){
                                //do something example: submit formData
                                var _this = this ,form = dialog.$body.find("form");
                                dialog.setClosable(false).disableBtn().spin(_this);

                                console.log(Hotel.serializeObject(form));

                                // ajax({
                                //     url : "",
                                //     successCall:function(){
                                //         dialog.close();
                                //         $("#dropdownText-menuCate").data("dropdownText").refresh();
                                //     },
                                //     failCall:function(){
                                //         dialog.setClosable(true).enableBtn().unspin(_this);
                                //     }
                                // });
                                setTimeout(function(){
                                    dialog.close();
                                    //更新下拉选择插件
                                    $("#dropdownText-menuCate").data("dropdownText").refresh();
                                },1000)
                            }
                        }
                    ]
                });
            });
        }
    }

    //增加分组
    $("#addMenuGroup").click(function(){
        dialog.ajaxPage("添加分组",HotelConfig.root + "/forms/dialog-addMenuGroup.html",function($element,dialog){
            //初始远程加载数据下拉选择
            $element.find("#dropdownText-menuCate").dropdownText({
                // url : "",
                dataList : ["汤","点心","烧菜","烧烤","炖菜"], //传入url ,删掉此行
                valueSure:function(value,id){
                    alert(value,id);
                }
            });
        },{
            classes : "modal-wid600",
            buttons:[
                {
                    label:"取消"
                },{
                    label:"确定",
                    closable:false,
                    class:"btn btn-primary",
                    action:function(dialog){
                        //do something example: submit formData
                        var _this = this ,form = dialog.$body.find("form");
                        dialog.setClosable(false).disableBtn().spin(_this);

                        console.log(Hotel.serializeObject(form));

                        // ajax({
                        //     url : "",
                        //     successCall:function(){
                        //         dialog.close();
                        //     },
                        //     failCall:function(){
                        //         dialog.setClosable(true).enableBtn().unspin(_this);
                        //     }
                        // });
                        setTimeout(function(){
                            dialog.close();
                        },1000)
                    }
                }
            ]
        });
    });

    //增加标签
    $("#addMenuTag").click(function(){
        dialog.ajaxPage("添加标签",HotelConfig.root + "/forms/dialog-addMenuTag.html",function($element,dialog){
            //如果你要在这儿初始一些操作
        },{
            classes : "modal-wid600",
            buttons:[
                {
                    label:"取消"
                },{
                    label:"确定",
                    closable:false,
                    class:"btn btn-primary",
                    action:function(dialog){
                        //do something example: submit formData
                        var _this = this ,form = dialog.$body.find("form");
                        dialog.setClosable(false).disableBtn().spin(_this);

                        console.log(Hotel.serializeObject(form));

                        // ajax({
                        //     url : "",
                        //     successCall:function(){
                        //         dialog.close();
                        //     },
                        //     failCall:function(){
                        //         dialog.setClosable(true).enableBtn().unspin(_this);
                        //     }
                        // });
                        setTimeout(function(){
                            dialog.close();
                        },1000)
                    }
                }
            ]
        });
    });

    //启用规格
    $("#radio-opotions-box").on("click",".radio",function(){
        var _this = $(this),
            target = _this.data("target"),
            active = _this.data("active"),
            flag   = active == "open";

        $("#" + target)[ flag ? "removeClass" : "addClass" ]("d-none");
        if(flag && openDropdown){
            openDropdown();
            openDropdown = null;
        }

    });
    function openDropdown(){
        $("#dropdownText-Rule").dropdownText({
            // url : "",
            dataList : ["份","盘","碗"], //传入url ,删掉此行
            valueSure:function(value,id){
                alert(value,id);
            }
        });
    }
    $("#addMenuRule").click(function(){
        dialog.ajaxPage("添加规格",HotelConfig.root + "/forms/dialog-addMenuRule.html",function($element,dialog){

        },{
            classes : "modal-wid600",
            buttons:[
                {
                    label:"取消"
                },{
                    label:"添加规格",
                    closable:false,
                    class:"btn btn-primary",
                    action:function(dialog){
                        //do something example: submit formData
                        var _this = this ,form = dialog.$body.find("form");
                        dialog.setClosable(false).disableBtn().spin(_this);

                        console.log(Hotel.serializeObject(form));

                        // ajax({
                        //     url : "",
                        //     successCall:function(){
                        //         dialog.close();
                        //     },
                        //     failCall:function(){
                        //         dialog.setClosable(true).enableBtn().unspin(_this);
                        //     }
                        // });
                        setTimeout(function(){
                            dialog.close();
                        },1000)
                    }
                }
            ]
        });
    });
    //新增口味
    $("#addMenuTaste").click(function(){
        dialog.ajaxPage("添加口味",HotelConfig.root + "/forms/dialog-addMenuTaste.html",function($element,dialog){
            //如果你要在这儿初始一些操作
        },{
            classes : "modal-wid600",
            buttons:[
                {
                    label:"取消"
                },{
                    label:"确定",
                    closable:false,
                    class:"btn btn-primary",
                    action:function(dialog){
                        //do something example: submit formData
                        var _this = this ,form = dialog.$body.find("form");
                        dialog.setClosable(false).disableBtn().spin(_this);

                        console.log(Hotel.serializeObject(form));

                        // ajax({
                        //     url : "",
                        //     successCall:function(){
                        //         dialog.close();
                        //     },
                        //     failCall:function(){
                        //         dialog.setClosable(true).enableBtn().unspin(_this);
                        //     }
                        // });
                        setTimeout(function(){
                            dialog.close();
                        },1000)
                    }
                }
            ]
        });
    });
});
    
