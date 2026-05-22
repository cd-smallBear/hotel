define([],function(){
    var _DefaultOpts = {
        initVal  : 1,
        step     : 1,
        sign     : '%',
        min      : 1,
        max      : 100,
        isSign   : false,  //是否显示带符号
        writeable : true, //是否可输入
        callback  : null  //change 回调
    }
    function Amount ($input,opts){
        this.input = $input;
        this.opts = $.extend(_DefaultOpts,opts);
        this.init();
    }

    Amount.prototype = {
        constructor : Amount,
        init:  function(){
            this.createHtml();
            this.set( this.input.val() || this.opts.initVal)
            this.addEvent();
        },
        createHtml: function(){
            this.container   = $('<div class="m-numbox"></div>');
            this.decreaseBtn  = $('<button type="button" class="numbox-btn numbox-btn-minus">-</button>');
            this.increaseBtn  = $('<button type="button" class="numbox-btn numbox-btn-plus">+</button>');
            this.inputContainer = $('<div class="numbox-pack"></div>');
            this.input.addClass('numbox-text').removeClass("numbox-initialize");
            if(this.opts.isSign){
                this.hidden = $('<input type="text" class="' + this.input.attr("class") + '">');
                this.input.addClass("d-none");
                this.hidden.appendTo(this.inputContainer);
            }
            this.container.insertAfter(this.input);
            this.decreaseBtn.appendTo(this.container);
            this.increaseBtn.appendTo(this.container);
            this.inputContainer.appendTo(this.container);
            this.input.appendTo(this.inputContainer);
        },
        addEvent:function(){
            this.decreaseBtn.click(function(){
                this.decrease();
            }.bind(this));
            this.increaseBtn.click(function(){
                this.increase();
            }.bind(this));
            if(this.opts.writeable){
                var _this = this;
                (this.hidden || this.input).on("input",function(){
                    var val = this.value.replace(/[^\d]+/g,'');
                        _this.set(val);
                })
                // .on("keyup",function(e){
                    // if(e.which == 8){  //按退格键,向下键
                        // _this.decrease();
                    // }
                    // if(e.which == 38){  //向上键
                    //     _this.increase();
                    // }
                // });
            }else{
                this.input.prop("disabled",true);
                this.hidden && hidden.prop("disabled",true);
            }
        },
        increase:function(){
            this.curVal += this.opts.step;
            this.set( this.curVal);
        },
        decrease:function(){
            this.curVal -= this.opts.step;
            this.set( this.curVal);
        },
        set:function(val){
            val = val - 0 ;
            val > this.opts.max ? val = this.opts.max : val ;
            val < this.opts.min ? val = this.opts.min : val ;
            this.curVal = val;

            this.input.val(val).trigger("change");
            this.hidden && this.hidden.val(val + this.opts.sign);
            this.decreaseBtn.prop("disabled", this.curVal == this.opts.min ? true : false);
            this.increaseBtn.prop("disabled", this.curVal == this.opts.max ? true : false);
            this.opts.callback && this.opts.callback.call(this);
        }
    }

    $.fn.amount = function( _opt ) {
      var instance = this.data('amount'),
          opt = $.extend( {}, _DefaultOpts, _opt )

      if( null == instance ) {
        if( this.length>1 ) {
          this.each(function(index, el) {
            instance = $(el).amount(opt)
          })
        }else {
          instance = new Amount( this, $.extend( opt, this.data() ) )
          this.data('amount', instance)
        }
      }

      if( typeof _opt == 'string' ) {
        instance[_opt].apply( instance, Array.prototype.slice.call(arguments, 1) )
      }

      return instance
    }

    return Amount
});
