define(["webuploader","bsDialog"],function(WebUploader,bsDialog){
//var head = $("head")[0],
//    body = document.body,
//
//    win = window;
//
//    if(!$("#webuploader.css").length){
//        var link = document.createElement("link");
//            link.rel = "styleSheet";
//            link.type = "text/css";
//            link.href = "../css/lib/webuploader.css";
//            link.id = "webuploader.css";
//            head.appendChild(link);
//    }


    var uploadOptions = {
        uploadbtn   : null,  //JQ  DOM
        imgswrap    : null,   //JQ DOM
        hideNodeName: '', //隐藏域值存的 ID
        multiple    : false,  //  一个按钮存隐藏域多个值
        swfUrl      : HotelConfig.root + '/js/lib/webuploader/Uploader.swf',
        serverUrl   : HotelConfig.root + '/attachment/upload',//uploadAndThumbnail
        fileNumLimit: undefined,
        resImgPathUrl: 'https://s3.cn-north-1.amazonaws.com.cn/test.temp-store/',
        beforeFileQueued:null,//上传前回调
        fileQueued   : null,     //上传中图片回调
        fileSuccessed: null,  //上传图片成功后回调
        fileRemoveed : null,   //删除上传图片后回调 this - > 上传实例
        initImageUploader: initImageUploader,
        init         : $.noop,
        instance     : null,
        isAppenditem : true,
        uploadLimit  : false, //是否禁止上传
        cutFileNum   : 0,  //上传张数限制数
        formData  : {
            // claz:'',
            // auth:1,
            // serviceType : 0
        }
    };
    //主体函数
    var errorui = '<div class="file-actions"><i class="ui-icons remove upload-remove"></i></div>';
    var uploadTips = '<p class="upload-tips"><i class="ui-state-warning"></i>未添加图片</p>';
    var instanceArray = [];
    function alertError (error){
        bsDialog.show({
            title   : '上传提示',
            msg     : error || '上传失败',//reason
            type    : "type-error",
            timeout : 1500,
            classes : "bootstrap-alert modal-warning modal-no-backdrop",
            backdrop: false
        });
    }
    function initImageUploader(uploadOptions) {
        var $container     = uploadOptions.imgswrap,
            uploadedfile   = null,
            thumbFile      = $("<input type='file' class='d-none'" + (uploadOptions.fileNumLimit > 1 ? "multiple" : "") + " />"),
            uploadInstance = null,
            _this          = this;
            if(uploadOptions.fileNumLimit > 1 && !$container){ //如果是单张上传 忽略
                uploadOptions.imgswrap = $container = uploadOptions.uploadbtn.siblings('.upload-img-wrapper');
            }
            // 检查是否还能继续上传图片
            uploadOptions.cutFileNum  = uploadOptions.cutFileNum - 0;
            //提示
            uploadOptions.tips = function(){
                var tips = $(uploadTips);
                !uploadOptions.cutFileNum && $container.append(tips);
                return tips;
            }();

            function checkUpload() {
                // @bug ie9 不兼容flash visibility会导致连接丢失
                if( Hotel.browser.ie && Hotel.browser.ie===9 ){
                    return
                }

                if(uploadOptions.cutFileNum >= uploadOptions.fileNumLimit ) {
                    uploadOptions.uploadbtn.addClass('upload-disabled')
                }
            }

            uploadOptions.cutFileNum && checkUpload();

            this.clear = function() {
                uploadInstance.reset();
                uploadOptions.cutFileNum = 0;
                uploadOptions.imgswrap.empty();
                uploadOptions.uploadbtn.removeClass("upload-disabled");
            },
            

            uploadInstance = new WebUploader.Uploader({
                // runtimeOrder: 'flash,html5',
                swf   : uploadOptions.swfUrl,
                server: uploadOptions.serverUrl,
                fileNumLimit: uploadOptions.fileNumLimit,
                accept: {
                    title: 'Images',
                    extensions: 'jpg,jpeg,png',
                    mimeTypes: 'image/*'
                },
                fileSingleSizeLimit: 5 * 1024 * 1024,
                formData : uploadOptions.formData,
                pick     : thumbFile[0].files ? undefined : uploadOptions.uploadbtn[0],
                auto     : true,
                duplicate: true,
                headers: {Accept: '*/*'}, // add @tag 兼容IE, text/*后台无法接收
            }).on('beforeFileQueued', function(file) {
                if (uploadOptions.fileNumLimit == 1 && uploadedfile) {
                    uploadInstance.removeFile(uploadedfile, true);
                } 

                if(uploadOptions.uploadLimit){
                    return false;
                }
                if(uploadOptions.cutFileNum >= uploadOptions.fileNumLimit ) {
                    uploadOptions.uploadLimit = true;
                    var dialog = bsDialog.show({
                        title: '上传提示',
                        msg  : '上传图片数量不超过' + uploadOptions.fileNumLimit + '张!',
                        type : "type-danger",
                        classes : 'bootstrap-alert modal-warning modal-no-backdrop',
                        backdrop: false
                    });
                    dialog.$modal.on("hidden.bs.modal",function(){
                        uploadOptions.uploadLimit = false;
                    });
                    return false
                }

                uploadOptions.cutFileNum++;

                uploadOptions.tips = uploadOptions.tips.remove();

                checkUpload();

                if(uploadOptions.beforeFileQueued){
                    return uploadOptions.beforeFileQueued.call(uploadOptions);
                }
            })
            .on('fileQueued', function(file) {
                var item = '<div id="' + file.id + '" class="img-item-new">' +
                    '<div class="file-img-pane">' +
                    '<span class="file-img-box"><img class="imger d-none" alt=""/></span>' +
                    '<div class="file-img-progress">上传中<strong class="pie">...</strong></div>' +
                    '</div>' +
                    (!uploadOptions.fileNumLimit ?
                        '<div class="file-img-name">' +
                        '<input type="text" class="form-control editor" value="' + file.name + '" />' +
                        '</div>' : '') +
                    '</div>';
                    if(uploadOptions.isAppenditem){
                        if ($container) {
                            $container.append($(item));
                        } else {
                            var imgswrap = uploadOptions.uploadbtn.siblings('.upload-img-wrapper');
                            if (imgswrap.find(".img-item-new").length) {
                                imgswrap.find(".file-img-pane").append('<div class="file-img-progress">上传中<strong class="pie">...</strong></div>');
                            } else {
                                imgswrap.append($(item));
                            }
                        }
                    }
                    if (uploadOptions.fileQueued) {
                        uploadOptions.fileQueued(file,uploadOptions.uploadbtn);
                    }
            })
            .on('uploadSuccess', function(file, res) {
                if (res.success) {
                    if(uploadOptions.isAppenditem){
                        $('#' + file.id).append(errorui)
                        .find(".imger")
                        .removeClass("d-none")
                        .attr("src",res.data.url)
                        .end()
                        .find(".upload-remove")
                        .data("key",res.data.pathKey);
                    }

                    if (uploadOptions.fileSuccessed) {
                        uploadOptions.fileSuccessed(file, res, uploadOptions.uploadbtn,uploadOptions);
                    }
                    if(uploadOptions.sendFile){
                        if(!uploadOptions.sendFileValue){
                            uploadOptions.sendFileValue = res.data.pathKey;
                        }else{
                            if(uploadOptions.fileNumLimit == 1){
                                uploadOptions.sendFileValue =  res.data.pathKey;
                            }else{
                                uploadOptions.sendFileValue += "," + res.data.pathKey;
                            }
                        }
                        uploadOptions.sendFile.val(uploadOptions.sendFileValue);
                    }
                } else {
                    alertError(res.msg);
                    resDelete (uploadOptions,file);
                }

            }).on('uploadError', function(file, reason) {
                resDelete (uploadOptions,file);
                alertError();//reason
            }).on('uploadComplete', function(file) {
                $('#' + file.id).find('.file-img-progress').remove();
                if (!$container) {
                    uploadOptions.uploadbtn.siblings('.upload-img-wrapper').find('.file-img-progress').remove();
                }
                uploadedfile = file;
                //获取每一个上传实例,供RemoveImage 访问;
                instanceArray = $.map(instanceArray, function(item, i, arr) {
                    if (item.uploader == uploadInstance) {
                        return $.extend(item,{file: file});
                    } else {
                        return item;
                    }
                });
            }).on("error", function(error, max, file) {
              if( error == 'F_EXCEED_SIZE' ) {
                error = '上传的文件大小不能超过' + ~~(max/1024/1024) + 'M'
              }else if( error == 'Q_TYPE_DENIED' ) {
                error = '请上传' + this.options.accept.map(function(el) {
                  return el.extensions.toUpperCase()
                }).join('、') + '格式文件'
              }
                alertError();
                resetUploadState.call(uploadOptions);
            });

        if (thumbFile[0].files) {
            uploadOptions.uploadbtn
            // .addClass("webuploader-pick")
            .append(thumbFile);
            var fileName = uploadOptions.uploadbtn.data('name');
            if(fileName){
                var sendFile = uploadOptions.uploadbtn.find("[name="+ fileName +"]");
                if(sendFile.length){
                    uploadOptions.sendFile = sendFile;
                    uploadOptions.sendFileValue = sendFile.val();
                }else{
                    uploadOptions.sendFile = $('<input type="hidden" name="' + fileName + '" class="'+ fileName +'">');
                }
                uploadOptions.uploadbtn.append(uploadOptions.sendFile);
            }
            thumbFile.change(function(evt) {
              var _target = evt.target,
                  _list

              _list = Array.prototype.slice.call(_target.files)
                .map( function(el) {
                  return new WebUploader.File(new WebUploader.Lib.File(WebUploader.guid('rt_'), el))
                })

              _list.length && uploadInstance.addFile( _list )

              _target.value = ''
            });
        }

        instanceArray.push({uploader : uploadInstance,uploadOptions:uploadOptions});
    }

    //reset 上传
    function resetUploadState(){
        if(!this.fileNumLimit){
            return;
        }
        this.cutFileNum--;
        if(this.cutFileNum < this.fileNumLimit){
            this.uploadbtn.removeClass("upload-disabled");
        }
        if(!this.cutFileNum){
         this.tips.appendTo(this.imgswrap);   
        }
    }
    //上传出错删除loading
    function resDelete (uploadOptions,file){
        var progress = uploadOptions.uploadbtn.siblings('.upload-img-wrapper').find('.file-img-progress');
        var pack = null;
            if($('#' + file.id).length ){
                pack = $('#' + file.id).append(errorui);
            }else{
                pack = progress.prev();
            }
            pack.find(".imger").removeClass("d-none").attr("src", HotelConfig.root + "/images/uploadError.png")
            progress.remove();
    }
    //删除已经存在的图片
    function removeImage(node) {
        var imgwrap = $(node).closest(".img-item-new"),
            currentUploader = null,
            replaceKey =  $(node).data("key"),
            btn = imgwrap.parent().siblings("label");

            if(!replaceKey){
                replaceKey = imgwrap.find(".imger").attr("src").slice(Hotel.uploadImageTruncate);
            }
            $.each(instanceArray, function(i, item) {
                if (item.uploadOptions.uploadbtn.length) {
                    if (item.uploadOptions.uploadbtn[0] == btn[0]) {
                        currentUploader = item;
                    }
                }
            });

            if(currentUploader){
                currentUploader.file && currentUploader.uploader.removeFile(currentUploader.file);
                if(currentUploader.uploadOptions.sendFile){
                    if(!currentUploader.uploadOptions.sendFileValue){
                        currentUploader.uploadOptions.sendFileValue = currentUploader.uploadOptions.sendFile.val();
                    }
                    currentUploader.uploadOptions.sendFileValue = currentUploader.uploadOptions.sendFileValue
                    .replace(replaceKey,"")
                    .replace(/^,|,$/,"")
                    .replace(/,,/,",");
                    currentUploader.uploadOptions.sendFile.val(currentUploader.uploadOptions.sendFileValue);
                }
                resetUploadState.call(currentUploader.uploadOptions);
                if (currentUploader.uploadOptions.fileRemoveed) {
                    currentUploader.uploadOptions.fileRemoveed.call(currentUploader || window, btn, imgwrap, node);
                }
            }else{
                btn.find('.' + btn.data('name') ).val('');
            }
            imgwrap.remove();
    }

      function pubInterface(options) {
        var uploadArray = []
        if(options.formData){
          var formData = options.formData;
          options.formData = {};
          $.extend(options.formData,uploadOptions.formData,formData);
        }
        options = $.extend({},uploadOptions, options || {});

        if (!pubInterface.inited) {
          pubInterface.inited = true;
          $(options.wrap || document).on("click", ".upload-remove", function(e) {
            removeImage(this);
          });
          options.init();
        }
        $.each(options.uploadbtn, function(i, item) {
          var wrap = null;
          if (options.imgswrap) {
            wrap = options.imgswrap.eq(i);
          }

          var up = new initImageUploader($.extend({}, options, { uploadbtn: $(item), imgswrap: wrap }));
          uploadArray.push(up);
        });

        return uploadArray;
      }
      pubInterface.hasLoading = function($dom) {
        return $dom.find('.file-img-progress').length
      }

      //提供对外访问接口
      return pubInterface
});
