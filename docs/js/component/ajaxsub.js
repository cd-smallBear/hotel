
define([], function() {
  var $token,
      defaultOpt,
      activedAjaxAccesser = {};//防止按钮异步请求两次

  /**
   * 设置token
   * @method setOrGetToken
   * @param  {[type]} token [description]
   * @return {[type]} [description]
   */
  function setOrGetToken( token ) {
    if( !$token || !$token.length ) {
        $token = $('head [name=token]')
    }

    token && $token.attr('content', token)

    return $token.attr('content')
  }

  /**
   * token和重定向，设置
   * @method tokenAndRedirect
   * @param  {[type]}         xhr [description]
   */
  function tokenAndRedirect(xhr) {
    //  token， 重定向
    var token = xhr.getResponseHeader('token'),
        redirectUrl = xhr.getResponseHeader('X-Redirect');

    token && setOrGetToken( token )
    redirectUrl && (window.location = redirectUrl)
  }

  // 设置token
  $.ajaxPrefilter(function(options, originalOptions, xhr) {
      var url = options.url,
          data = options.data || "",
          status,
          accesserData = activedAjaxAccesser[url];
      if (!options.crossDomain && options.dataType != 'html') {
          xhr.setRequestHeader('token', setOrGetToken());
      }

      //过滤重复请求
      if(accesserData == undefined){
          activedAjaxAccesser[url] = [];
      }else{
          status = accesserData.some(function(item,i,arry){
              return Hotel.equal(data,item);
          });
      }
      if(status){
          xhr.abort();
      }else{
          activedAjaxAccesser[url].push(data);
          xhr._data = data;
      }
  });

  // 更新token,或者判断是否重定向
  $(document).ajaxComplete(function(event, xhr, settings) {
      tokenAndRedirect(xhr)

      // 删除已经完成的xhr accesser
      var idx,item;
      for ( var key in activedAjaxAccesser){
            item = activedAjaxAccesser[key];

           idx = item.findIndex(function(item,i,arr){
               return Hotel.equal(item ,xhr._data);
           });
           if(idx != undefined){
               item.splice(idx,1);
               if( !activedAjaxAccesser[key].length ){
                   delete activedAjaxAccesser[key];
               }
           }
      }
  });

  defaultOpt = {
     url: '',
     type: 'get',
     data: {},
     cache: false,
     dataType: 'json',
     beforeSend: function(xhr) {
      //  xhr.setRequestHeader('token', setOrGetToken() )

       this.beforeSendCall && this.beforeSendCall(xhr)
     },
     complete: function(xhr, textStatus) {
      //  tokenAndRedirect(xhr)

       this.completeCall && this.completeCall(textStatus)
     },
     success: function(data, textStatus, xhr) {
       data.success ?
        this.successCall( (data.data || data.data == 0) ? data.data : data, textStatus, xhr) :
        this.failCall(data.msg, textStatus, xhr)
     },

     error: function(xhr, textStatus, errorThrown) {
      //tokenAndRedirect(xhr)
       this.errorCall && this.errorCall(errorThrown)
     },
     beforeSendCall: function(param) {
     },
     completeCall: function(param) {
     },
     successCall: function(param) {
         // do something...
     },
     failCall: function(msg) {
     },
     errorCall: function(param) {
         // do something...
     },
  }

    /**
     * 异步加载方法
     * @method ajax
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    function ajax(opt) {
      var options = {}, _completeFunc, $submitBtn

      if( null != opt.data ) {
        // 处理formData数据
        if( window.FormData && opt.data instanceof FormData ) {
          $.extend( options, {
            contentType: false,
            processData: false,
          })

        // 如果为ajaxJson数据，就转换
        }else if( opt.data instanceof Hotel.AjaxJson ) {
          $.extend( opt, {
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(opt.data.getData()),
          })
        }
      }

      options = $.extend( {}, defaultOpt, options, opt)

      // 如果传递按钮
      if( ($submitBtn = options.submitBtn) ) {
        $submitBtn = $($submitBtn)
        $submitBtn.addClass('disabled')

        _completeFunc = options.complete
        options.complete = function() {
          var _arg = Array.prototype.slice.call(arguments)

          // 延迟执行
          setTimeout( function() {
            $submitBtn.removeClass('disabled')
          }, 300)

          _completeFunc && _completeFunc.apply(this, _arg )
        }
      }

      return $.ajax( options )
    }
    ajax.get = function( url, data, callback, opt ) {
      return ajax( $.extend( {
        url: url,
        data: data,
        success: callback,
        type: 'get',
      }, opt ))
    }

    ajax.post = function( url, data, callback, opt ) {
      return ajax( $.extend( {
        url: url,
        type: 'post',
        data: data,
        success: callback,
      }, opt ))
    }

    ajax.tokenAndRedirect = tokenAndRedirect

    return ajax
})
