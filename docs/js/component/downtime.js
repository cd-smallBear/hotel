/*
 * @param input  需要验证的输入字段 jqDOM  || emailDom ->邮箱验证
 btn 触发验证的 jqDOM
 AsyncObject 需要验证的输入字段的异步请求返回值 return Ajax Object
 * */
define(["ajaxSub","bsDialog"], function(ajax,bsDialog) {
    return function(input,random ,btn, url){
        var _this = this;

        _this.input = input;
        _this.randomCode = random || null;
        _this.btn = btn;
        _this.url = url;

        _this.isArrowQuest = true;
        _this.switchDom = function(input,url){
            _this.input = input;
            _this.url = url;
        };
        _this.clearDownTime= function(){
            clearInterval(_this.timer);
            _this.btn.removeAttr("disabled").removeClass("disabled").html("获取验证码");
            _this.isDowntime = false;
        };
        _this.remoteRandom  = function(){
            function pie(){
                //if(_this.randomCode[0].deferredSync){
                    _this.randomCode[0].deferredSync.done(function(data){
                        _this.randomCode[0].deferredSync = null;
                        if(data.success){
                            _this.send();
                        }
                    });
                //}
            }
            if(_this.randomCode  ){

                if( _this.randomCode[0].deferredSync ){
                   pie();
                }else{
                   var state = _this.randomCode.valid();
                        if(state){
                            pie();
                            return true;
                        }else{
                            _this.randomCode.focus();
                        }
                }
                return false;
            }
            return true;
        };
        _this.validator = function() {   // @param isDeferred 是否需要延迟发送
            if (!_this.input.valid()) {
                _this.input.focus();
                return false;
            }
            if(_this.isDowntime || _this.isQueen){
                return;
            }
            if(_this.input[0].deferredSync){
                _this.isQueen = true;
                _this.input[0].deferredSync.done(function(data){
                    _this.input[0].deferredSync = null;
                    _this.isQueen = false;

                    if(data.success){
                        if (_this.remoteRandom() == false ){
                            return ;
                        }
                        _this.send();
                    }
                });
            }else{
                if (_this.remoteRandom() == false ){
                    return ;
                }
                _this.send();
            }
        };
        _this.send = function(){
            var data =  {
                number: _this.input.val()
            };
            if(!_this.isArrowQuest){
                return;
            }
            _this.isArrowQuest = false;
            if(_this.randomCode){
                data.randomCode = _this.randomCode.val();
            }
            ajax({
                url : _this.url,
                type: 'post',
                data: data,
                beforeSendCall: function(xhr) {
                    _this.btn.prop("disabled", true);
                },
                successCall: function(data) {
                    if(_this.btn[0].regType == 2){
                        var strDom = $('<span class="btn btn-default" style="position:absolute;top:24px;right:0;padding:0;" data-container="body" data-toggle="popover" data-placement="right" data-content="邮箱发送成功，请打开邮箱获取验证码"></span>');
                        strDom.insertAfter(_this.btn);
                        strDom.popover("show");
                        setTimeout(function(){
                            strDom.popover('hide');
                        },5000);
                    }
                    _this.countdown();
                },
                failCall:function(msg){
                    _this.btn.prop("disabled", false);
                    bsDialog.alert("提示",msg,"type-error",{
                        classes : "modal-error"
                    });
                },
                completeCall:function(){
                    _this.isArrowQuest  = true;
                },
                error: function(error) {
                    _this.btn.prop("disabled", false);
                    bsDialog.alert("提示",error,{
                        classes : "modal-error"
                    });
                }
            });
        }
        _this.countdown = function() {
            var  _this = this,times = 59;
            _this.timer = null;
            _this.btn.html(times + "s后重新获取").addClass("disabled");
            _this.isDowntime = true;
            _this.timer = setInterval(function() {
                times --;
                if (times <= 0) {
                    _this.clearDownTime();
                } else {
                    _this.btn.html(times + "s后重新获取");
                }
            }, 1000);
            return this;
        }
        _this.btn.on("click",_this.validator);
    }
});