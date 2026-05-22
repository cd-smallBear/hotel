(function( factory ) {
  if( window.define ) {
    define(factory)
  }else {
    window.App = factory()
  }
}( function() {
  var Modal = $.fn.modal.Constructor

  /**
   * 弹出框
   * @method Bootstrapdialog
   * @param {Object} opt 选项
   */
  function BootstrapDialog( opt ) {
    var _opt = $.extend( {}, BootstrapDialog.defaultOpt, opt )

    this.id = _opt.id || 'bootstraDialog-' + BootstrapDialog.index++

    this.initCreateModal( _opt )
    this.initSet( _opt )

    this.modal = new Modal( this.$modal[0], {
        backdrop: opt.backdrop != undefined ? opt.backdrop : 'static',    // 关闭backdrop处点击关闭的功能
        keyboard: false,
        show: false,
    } )
  }

  // static field
  BootstrapDialog.NAMESPACE     = 'bootstrap-dialog'
  BootstrapDialog.TYPE_DEFAULT  = 'type-default'
  BootstrapDialog.TYPE_INFO     = 'type-info'
  BootstrapDialog.TYPE_PRIMARY  = 'type-primary'
  BootstrapDialog.TYPE_SUCCESS  = 'type-success'
  BootstrapDialog.TYPE_WARNING  = 'type-warning'
  BootstrapDialog.TYPE_DANGER   = 'type-danger'
  BootstrapDialog.TYPE_ERROR    = 'type-error'
  BootstrapDialog.CLASS_ANIMATE = 'fade'
  BootstrapDialog.CLASS_SPIN    = 'ui-spin'

  // 模板
  BootstrapDialog.TPL_TITLE = '<span class="'+ BootstrapDialog.NAMESPACE +'-title">{title}</span>'
  BootstrapDialog.TPL_CLOSE = '<button type="button" class="close" data-dismiss="modal" aria-label="Close"<span aria-hidden="true">×</span></button>'
  BootstrapDialog.TPL_BTN = '<button type="button" class="{class}">{label}</button>'

  BootstrapDialog.index = 0;

  BootstrapDialog.defaultOpt = {
    title: '',
    msg: '',
    type: BootstrapDialog.TYPE_DEFAULT,
    closable: true,
    timeout: false,
    buttons: null,
    class: '',
    animate: true,
    autodestroy: true,
    classes: '',
    footerClass: '',
  }
  BootstrapDialog.btnDefault = {
    label: '',
    class: 'btn btn-secondary',
    spin: false,
    closable: true,
    action: function( dialog ) {
      dialog.close()
    }
  }

  BootstrapDialog.show = function(opt) {
    return new BootstrapDialog( opt ).open()
  }
  BootstrapDialog.alert = function( tit, msg, type, _opt ) {
    var classes;
    if($.isPlainObject(type)){
      _opt = type;
      type = BootstrapDialog.TYPE_SUCCESS;
    }
    if(_opt && _opt.classes){
      classes = _opt.classes;
      delete _opt.classes;
    }
  
    _opt = $.extend( {
      title : tit || '操作提示',
      msg   : msg,
      type  : type || BootstrapDialog.TYPE_SUCCESS,
      timeout: 1500,
      classes: 'bootstrap-alert'
    }, _opt||{} );
    
    if(classes){
      _opt.classes += " " + classes;
    }
    
    return new BootstrapDialog(_opt).open();
  };
  BootstrapDialog.confirm = function( tit, msg, callback, _opt ) {
    var opt = $.extend( {}, {
          submitLabel: '确定',
          classes    : '',
          autoClose  : true
         }, _opt );

    return BootstrapDialog.show({
      title: tit,
      msg  : msg,
      type : BootstrapDialog.TYPE_SUCCESS,
      buttons: [
        {
          label: '取消',
          action: function( dialog ) {
            opt.cancel && opt.cancel.call(this, dialog);
          }
        },
        {
          label: opt.submitLabel,
          spin: true,
          closable: false,
          class: 'btn btn-primary',
          action: function( dialog ) {
            opt.autoClose && dialog.close(); 
            callback.call(this, dialog);
          }
        }
      ],
      classes:'bootstrap-confirm modal-warning' + (opt.classes ? ' '+ opt.classes : '')
    });
  };
  BootstrapDialog.ajaxPage = function( title, url, callback, type, _opt ) {
   if( $.isPlainObject(type) ) {
     _opt = type
     type = '';
   }

   require(['ajaxSub'], function( ajax ) {
     ajax( {
       url: url,
       dataType: 'html',
       success: function(_msg) {
         var $element = $(_msg),
             dialog
 
         dialog = new BootstrapDialog( $.extend({
           title: title || '成功！',
           msg: $element,
           type: type || BootstrapDialog.TYPE_PRIMARY,
         }, _opt ) ).open()
             typeof callback === 'function' && callback( $element, dialog )
       },
     } )
    } )
  }

  BootstrapDialog.prototype = {
    initCreateModal: function( opt ) {
      this.createModal()
      this.createDialog()
      this.createContent()
      this.createHeader( opt.animate )
      this.createBody()
      // this.createFooter()

      this.$modal.append( this.$dialog )
      this.$dialog.append( this.$content )
      this.$content.append( this.$header )
      this.$content.append( this.$body )

      return this
    },
    initSet: function( opt ) {
      var _this = this

      _this.setHeader( BootstrapDialog.TPL_TITLE.replace(/{title}/, opt.title) )
        .setBody( opt.msg )
        .setClosable( opt.closable )
        .setType( opt.type )
        .setClass( opt.classes )
        .setAnimate( opt.animate )
        .setAutodestroy( opt.autodestroy )

      // 如果有按钮就填充按钮
      opt.buttons && this.setButtons( opt.buttons )
      opt.footerClass && this.setFooter( opt.footerClass )

      // 如果有超时，到时间就会自动关闭
      if( $.isNumeric( opt.timeout ) ) {
        setTimeout( function() {
          _this.close()
        }, opt.timeout)
      }

      //  _dropdown 黑块，点击事件
      this.$modal.on('click', function( evt ) {
        if( evt.target !== evt.currentTarget )
          return

        _this.closable && _this.close()
      })

      // 监听关闭事件，是否清空自身
      this.$modal.one('hidden.bs.modal', function(evt) {
        if( this.autodestroy )
          this.destroy()
      }.bind(this) )
    },
    createModal: function() {
      var $modal = $('<div class="modal" role="dialog" ' + 'aria-hidden="true"></div>')
      $modal.prop('id', this.getId())
      $modal.attr('aria-labelledby', this.getId() + '_title')

      this.$modal = $modal
      return $modal
    },
    createDialog: function() {
      var $dialog = $('<div class="modal-dialog"></div>')

      this.$dialog = $dialog
      return $dialog
    },
    createContent: function() {
      var $content = $('<div class="modal-content"></div>')
      this.$content = $content

      return $content
    },
    createHeader: function() {
      var $header = $('<div class="modal-header"></div>')

      this.$header= $header
      return $header
    },
    createBody: function() {
      var $body = $('<div class="modal-body"></div>')

      this.$body = $body
      return $body
    },
    createFooter: function() {
      var $footer = $('<div class="modal-footer"></div>')

      this.$footer = $footer
      return $footer
    },
    createBtn: function( opt ) {
      var _this = this,
          _opt = $.extend( {}, BootstrapDialog.btnDefault, opt ),
          $btn = $( BootstrapDialog.TPL_BTN.replace(/{class}/, _opt.class)
                    .replace(/{label}/, _opt.label) )
      this.$btns ? this.$btns.push($btn) : ( this.$btns = [$btn] )

      // 声明事件
      _opt.action && $btn.on('click', function( evt ) {
        if( _opt.closable ) {
          _this.close()
        }
        _opt.action.call( $btn, _this, evt )
      } )

      this.$footer.append( $btn )

      return this
    },

    setHeader: function( html ) {
      this.$header.html( html )
      return this
    },
    setBody: function( html ) {
      if( html instanceof $ ) {
        this.$body.empty()
        this.$body.append( html )
      }else this.$body.html( html )
      return this
    },
    setClosable: function( boo ) {
      if( boo === this.closable )
        return this

      this.closable = boo
      if( !boo ) {
        this.$closeBtn && this.$closeBtn.remove()
      }else {
        this.$closeBtn = $(BootstrapDialog.TPL_CLOSE).appendTo( this.$header )
      }
      return this
    },
    setType: function( type ) {
      this.type && this.$modal.removeClass( this.type )
      this.$modal.addClass(type)

      this.type = type
      return this
    },
    setClass: function( classes ) {
      this.$modal.removeClass(classes)
          .addClass( classes )
      return this
    },
    setAnimate: function( boo ) {
      if( !boo ) {
        this.animate && this.$modal.removeClass( BootstrapDialog.CLASS_ANIMATE )
      }else {
        this.$modal.addClass( BootstrapDialog.CLASS_ANIMATE )
      }
      this.animate = boo

      return this
    },
    setButtons: function( buttons ) {
      var _this = this

      if( !this.$footer ) {
        this.createFooter().appendTo(this.$content)
      }

      // 如果按钮数量超过1
      if( buttons.length>1 ) {
        this.$footer.addClass('btns')
      }

      _this.remvoeButtons()
      $.each( buttons, function(ix, el) {
        _this.createBtn( el )
      })

      return _this
    },
    setAutodestroy: function( boo ) {
      this.autodestroy = boo
      return this
    },
    setFooter: function( cls ) {
      if( this.$footer ) {
        this.$footer.addClass(cls)
      }
    },

    getId: function() {
      return this.id
    },

    remvoeButtons: function() {
      $.each( this.$buttons, function(ix, el) {
        el.remove()
        el.action && el.off( 'click', el.action )
      } )

      this.$buttons = []

      return this
    },

    spin: function( tar ) {
      tar.addClass(BootstrapDialog.CLASS_SPIN)

      return this
    },
    unspin: function( tar ) {
      tar.removeClass(BootstrapDialog.CLASS_SPIN)

      return this
    },
    disableBtn: function() {
      this.$modal.find('button').prop( 'disabled', true)
      return this
    },
    enableBtn: function() {
      this.$modal.find('button').prop( 'disabled', false)
      return this
    },
    open: function() {
      this.modal.show( this.modal )
      return this
    },
    hide: function() {
      this.modal.hide()
    },
    close: function( isDestroy ) {
      if( isDestroy==true )
        this.autodestroy = isDestroy

      this.hide()

      return this
    },
    destroy: function() {
      this.remvoeButtons()
      this.$modal.off('click')
      this.$modal.remove()
    },
  }

  // --- test
  return BootstrapDialog
}))
