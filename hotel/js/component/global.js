(function () {
 var HotelConfig = window.HotelConfig = {
        root : "/hotel/hotel",
        JsVersion : 1
     };
    var Hotel = window.Hotel = {
        // 方法，验证规则
        regex: {
            number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
            numxsm: /^[\d]+(\.[\d]{0,2})?$/, // 百份比验证
            mobile: /^(1(3|4|5|7|8)\d{9})$/i, // 手机验证
            tel: /^(0[0-9]{2,3})?(\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$|(^[48]00(\-)?\d{7}?)$/, // /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/, // 座机验证 change @tag 可不要-
            decimal: /^(([1-9]\d*)(\.[\d]{1,2})?|0\.[\d]{1,2})$/, // 运单录入输入项
            email: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
            faxes: /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
            http: /^(?:http(?:s|):\/\/|)(?:(?:\w*?)\.|)(?:\w*?)\.(?:\w{2,4})(?:\?.*|\/.*|)$/ig, // 网址格式
            qq: /^[1-9][0-9]{4,10}$/ //QQ验证
        },
        format: function (num, length) {
            var num = num + "",
                length = length || 4;
            if (num.length > length) {
                return num.substring(0, length) + " " + arguments.callee(num.substring(length), length);
            } else {
                return num;
            }
        },
        formatDate: function (timestamp) {
            if (!timestamp) {
                throw Error('timestamp is not empty!');
                return;
            }
            var date = new Date(timestamp);
            var year = date.getFullYear(),
                month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
                day = date.getDate();
            return year + '-' + month + "-" + day;
        },
        formatDouble: function (number) {
          // 判断是否为数字类型
          if( Cms.regex.number.test(number) ) {
            number = number + '';
            if (Cms.regex.numxsm.test(number)) {
                // 如果最后一位为0，并且.不在第一位
                if (number.slice(-1) == '0' && number.indexOf(".") > 0)
                  number = number.slice(0, -1)
                return number - 0
            } else return Cms.formatDouble((number - 0).toFixed(2))
          }else return number
        },

        // 弹出loading
        alertLoading: function(tit, hasBg) {
            var $tar, $bg

            $('body').find('> .pre-loading, >.pre-loading-bg').remove()

            $tar = $('<div class="pre-loading">{title}</div>'.replace(/{title}/,
              tit || '数据加载中,请稍后...'))

            hasBg && ($bg = $('<div class="pre-loading-bg" />').appendTo('body'))

            $tar.appendTo('body')
                .css('transform', 'translate({x}px, {y}px);'
                                    .replace(/{x}/, -$tar.outerWidth() * .5)
                                    .replace(/{y}/, -$tar.outerHeight() * .5))
                // .css('margin-left', -$tar.outerWidth() * .5 + "px")
                // .css('margin-top', -$tar.outerHeight() * .5 + "px");

            return function() {
                $tar.remove()
                $bg && $bg.remove()
            }
        },
        //转表单为对象
        serializeObject: function (form, isempty) {
            var isArray = false,
                objectData = {},
                isEmpty = isempty == undefined ? false : isempty,
                arrayData = form.serializeArray();

            $.each(arrayData, function () {
                var value;
                if (this.value) {
                    value = this.value;
                } else {
                    value = !isEmpty ? null : '';
                }
                //if (value != '') {
                if (objectData[this.name] == undefined) {
                    objectData[this.name] = value;
                } else {
                    if (!(objectData[this.name] instanceof Array )) {
                        objectData[this.name] = [objectData[this.name]];
                    }
                    isArray = true;
                    objectData[this.name].push(value);
                }
                //}

            });
            if (isArray) { // 如果有数组值变成1，2，3，4这样的字符串
                $.each(objectData, function (o, v) {
                    if (v instanceof Array) {
                        objectData[o] = v.join(",");
                    }
                });
            }
            return objectData;
        },
        randomString: function (len) {
            len = len || 32;
            /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            var maxPos = $chars.length;
            var pwd = [];
            for (var i = 0; i < len; i++) {
                pwd.push( $chars.charAt(Math.floor(Math.random() * maxPos)) );
            }
            return pwd.join("");
        },
        equal: function (a1, a2) {
            var t1 = Object.prototype.toString.call(a1),
                t2 = Object.prototype.toString.call(a2)

            if (t1 === '[object Object]' &&
                t2 === '[object Object]') {
                return Cms.equalOb(a1, a2)
            } else if (t1 === '[object Array]' &&
                t2 === '[object Array]') {
                return Cms.equalArr(a1, a2)
            } else {
                // 弱对比
                return a1 == a2
            }
        },
        // 对比object
        equalOb: function (ob1, ob2) {
            if (Object.keys(ob1).length === Object.keys(ob2).length) {
                for (var _f in ob1) {
                    if (ob1.hasOwnProperty(_f) &&
                        !Cms.equal(ob1[_f], ob2[_f])) {
                        return false
                    }
                }
                return true
            } else return false
        },
        // 对比Array
        equalArr: function (ar1, ar2) {
            var l1 = ar1.length, i;

            if (l1 == ar2.length) {
                for (i = 0; i < l1; i++) {
                    if (!Cms.equal(ar1[i], ar2[i])){
                        return false
                    }
                }
                return true
            } else return false
        },
        /**
         * require工具
         * @method requireUtil
         * @param  {string}    name [class名]
         * @param  {string}    method [调用方法名]
         */
        requireUtil: function (name, method) {
            require([name], function (fun) {
                if (method) fun[method]()
                else fun()
            })
        },
        page : function(){
            var content = $("#content");
           if(content.length){
               return content.data("page");
           }
        },
        // 帮助实现 transition
        reflow: function () {
            Array.prototype.slice.call(arguments).forEach(function (element) {
                new Function('bs', 'return bs')(element.offsetHeight)
            })
        },
        // 打开图片预览
        openEnlargeImg: function () {
            $(document).on('click.imgpreview', 'img:not(.previewEnlargeImg)', function (evt) {
                var _img = new Image(),
                    $img = $(_img),
                    $mask = $('<div class="modal-backdrop fade" />'),
                    $target = $(evt.target),
                    _imgWid, _imgHeg,
                    _wWid = window.innerWidth,
                    _wHeg = window.innerHeight,
                    _scale = 1

                _img.src = evt.target.src


                _imgWid = _img.width
                _imgHeg = _img.height
                if (_imgWid >= _wWid || _imgHeg >= _wHeg) { // 防止超出屏幕
                    _scale = Math.min((_wWid - 40) / _imgWid, (_wHeg - 40) / _imgHeg)

                    _imgWid *= _scale,
                        _imgHeg *= _scale
                }

                $img.attr('class', 'previewEnlargeImg').css($target.offset()).appendTo('body')
                $mask.appendTo('body')

                Cms.reflow($mask[0], _img)

                // 设置居中
                $img.css({
                    left: (_wWid - _imgWid) * .5,
                    top: (_wHeg - _imgHeg) * .5,
                    width: _imgWid,
                    height: _imgHeg,
                })
                $mask.addClass('in')

                $(document).one('click.closePrerview-enlarge', function () {
                    $img.remove()
                    $mask.remove()
                })
            })

            window.app && $(window.app).one('pageRemove', function () {
                Cms.closeEnlargeImg()
            })
        },
        closeEnlargeImg: function () {
            $(document).off('click.imgpreview')
        },
        requireConfig: {
            baseUrl: HotelConfig.root + '/js',
            //  urlArgs: function(id, url) {
            //    console.log('arg: ', arguments)
            //    return url + '?v=' + '1'
            //  },
            urlArgs: 'v=' + HotelConfig.JsVersion,
            shim: {
                'jquery': {
                    exports: '$'
                },
                '  table': {
                    exports: 'table'
                },
                'edit': {
                    exports: 'editable'
                }
            },
            paths: {
                // 'validate'   : 'lib/validate',
                'webuploader': 'lib/webuploader',
                'jeDate'     : 'lib/jquery.jedate',
                // 'btTree'     : 'lib/bootstrap-treeview',
                // 'table'      : 'lib/bootstrap.table',
                // 'template'   : 'lib/template',
                // 'echarts'    : 'lib/echarts.min',
                // 'lazyload'   : 'lib/jquery.lazyload.min',

                'ajaxSub'       : 'component/ajaxsub',
                // 'tag'           : 'component/tag',
                // 'addProduct'    : 'component/new-product',
                // 'autoComplete'  : 'component/auto-complete',
                // 'areaCaseSelecter'   : 'component/area-case-selecter',
                'webuploader.setting': 'component/webuploader.setting',
                'bsDialog'      : 'component/bs-dialog',
       
           
                'dropdownSelect': 'component/dropdown.select',
                'dropdownSelectText': 'component/dropdown.select-text',
                // 'ngUtil'        : 'component/ng-util',
                // 'createMap'     : 'component/createMap',
                // 'fileUploader'  : 'component/webuploader.file',
                // 'starJudge'     : 'component/star-judge',
                // 'caseSelecter'  : 'component/case-selecter',
                // 'netMap'        : 'component/netMap',
                // 'numbox'        : 'component/numbox',
                // 'pager'         : 'component/pager',
                // 'pointsMap'     : 'component/pointsMap',
                // 'showProduct'   : 'component/showProduct',
                // 'downtime'      : 'component/downtime',
                // 'selectTable'   : 'component/selecttable',
                // 'migrate'       : 'component/jquery-migrate-1.2.1.min',
                // 'jqprint'       : 'component/jquery.jqprint-0.3',
                // 'help'          : 'component/help',

                // 'setup'         : "pages/setup"
            }
        },

        toggle : {
            target : null,
            setTarget : function(ele){
                if(ele.nodeType || ele[0].nodeType){
                    this.target = ele;
                }
            },
            removeTarget : function(){
              this.target = null;
            },
            disable : function(){
                $("body").on("click.disabledAllAlick",function(e){
                    if(this.target && this.target.has(e.target).length){
                        return true;
                    }
                    return false;
                }.bind(this));
            },
            enable : function(){
                $("body").off("click.disabledAllAlick");
            },
            fire : function(status){
                status = status || "disable" ;
                this[status]();
                return this;
            },
            remove : function(){
                return delete Cms.toggle;
            }
        },
        session : function(){
            return window.sessionStorage && {
                    getter :function(name){
                        return sessionStorage.getItem(name);
                    },
                    setter : function(key,value){
                        sessionStorage.setItem(key,value);
                    },
                    remove : function(name){
                        name = (name || "").split(" ");
                        name.forEach(function(item,i,arr){
                            sessionStorage.removeItem(item);
                        });
                    }
            }
        }(),
        AjaxJson: (function() {
        function AjaxJson(form) {
          this.data = {}

          if( null != form ) {
            // 如果为object
            if( Object.prototype.toString.call(form)=='[object Object]' ) {
              $.extend( this.data, form )
            }else {
              $.extend(this.data, Cms.serializeObject($(form)) )
            }
          }
        }
        AjaxJson.prototype = {
          constructor: AjaxJson,
          append: function(key, value) {
            key && value && (this.data[key] = value)
          },
          delete: function(key) {
            key && delete this.data[key]
          },
          getData: function() {
            return this.data
          },
        }

        return AjaxJson
      }()),
        // 获取浏览器类型及型号
        browser: (function( ua ) {
          var ret = {},
              webkit = ua.match( /WebKit\/([\d.]+)/ ),
              chrome = ua.match( /Chrome\/([\d.]+)/ ) ||
                  ua.match( /CriOS\/([\d.]+)/ ),

              ie = ua.match( /MSIE\s([\d\.]+)/ ) ||
                  ua.match( /(?:trident)(?:.*rv:([\w.]+))?/i ),
              firefox = ua.match( /Firefox\/([\d.]+)/ ),
              safari = ua.match( /Safari\/([\d.]+)/ ),
              opera = ua.match( /OPR\/([\d.]+)/ )

          webkit && (ret.webkit = parseFloat( webkit[1] ))
          chrome && (ret.chrome = parseFloat( chrome[1] ))
          ie && (ret.ie = parseFloat( ie[1] ))
          firefox && (ret.firefox = parseFloat( firefox[1] ))
          safari && (ret.safari = parseFloat( safari[1] ))
          opera && (ret.opera = parseFloat( opera[1] ))

          return ret
      })( navigator.userAgent ),
    };

}())
