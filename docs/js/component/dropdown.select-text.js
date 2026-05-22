define(["ajaxSub"], function(ajax) {
    /**   配合 bt dropdown
     * @param opt
     *    url : 远程地址www
     *    data :请求额外数据
     *    dataList : 根据已有的数据渲染
     *    valueChange: //change回调
     *    valueSure  : 每次点击确定回调
     *    isClear : false
     *    isSearch : false; 默认不开启搜索;
     *    valueField : //如果调用传进来 type : array
     *    norecord  : "没有记录"
     *    align     : "bottom"             type : string  (bottom , top)
     *    filterData : 过滤返回的数据  type : function
     * */
    var drodownItemTmpl = '<a href="javascript:;" class="dropdown-option tag tag-default"></a>';

    function Main($input, opt) {
        this.$input = $input;
        this.opt = $.extend({
            type: "get",
            noRecord: "没有记录",
            tipsHtml: '<p class="text-helper"><i class="ui-state-warning"></i>{text}</p>',
            tipsSearch: function (text) {
                return "没有找到与 " + text + " 相关的选项"
            }
        }, opt);
        this.isLoading = false;
        this.dataList = null;
        this.selectedValue = null;
        this.init();
    }

    Main.prototype = {
        constructor: Main,
        init: function () {
            var _this = this, dataName;
            this.$container = $('<div class="m-select">');
            this.$container.insertBefore(this.$input);
            this.$input.appendTo(this.$container);

            this.$input.attr("data-toggle", "dropdown");
            this.$input.prop("readonly", !_this.opt.isSearch);

            if (_this.opt.dataList) { //如果传进来
                _this._resulteExec(_this.opt.dataList);
            } else {
                this.$input.on("click.loadData", function(e){
                    _this._sendLoad.call(_this,e);
                });
            }
            dataName = this.$input.attr("data-name");
            if (dataName) {
                this.$hidden = $('<input type="hidden" name="' + dataName + '">');
                this.$hidden.insertAfter(this.$input);
            }
        },
        _sendLoad : function(e){
            if (!this.isLoading && !this.dataList) {
                this.isLoading = true;
                this._loadData();
            } else {
                this.$input.off("click.loadData"); //如果手动传进来data，在实例后。
                this.$container.addClass("open");
            }
            //else{
            //    if(_this.dataList){ //快速点击有数据的情况下才打开
            //        _this.$container.addClass("open");
            //    }
            //}
            e && (e.stopPropagation());
        },
        refresh : function(){
            this.isRefresh = true;
            this.dataList = null;
            this.selectedValue = null;
            this.setValue("","");
            this._sendLoad();
        },
        _resulteExec: function (data) {
            this.opt.filterData && (data = this.opt.filterData(data) );
            if(!this.isRefresh){
               this.createSelectPanel();
            }
            if (data instanceof Array) {
                if (data.length) {
                    this.dataList = data;
                    this.createSelectOption();

                    if(!this.isRefresh){
                       this._createSelectEvent();
                    }
                } else {
                    //if(_this.opt.valueField){
                    //    var obj = {};
                    //    obj[_this.opt.valueField[0]] = _this.opt.noRecord;
                    //    _this.dataList = [obj];
                    //}else{
                    //    _this.dataList = [_this.opt.noRecord];
                    //}

                    this._createNorecord();
                }
            } else {
                this._createNorecord();
            }
            this.isRefresh = false;
            setTimeout(this._fixed.bind(this),200);
            // this._fixed();
        },
        _fixed : function(){
            var css = null,offset,modalDialog,modalDialogOffset;
                 modalDialog = this.$container.closest(".modal-dialog");

                if(modalDialog.length ) {
                    css = {
                       position: "fixed"
                    };
                    offset = this.$input.offset();
                    modalDialogOffset = modalDialog.offset();

                    if (!Hotel.browser.ie) { // 非IE都减
                        css.top = offset.top - modalDialogOffset.top + this.$input.outerHeight();
                        css.left = offset.left - modalDialogOffset.left;
                    } else {
                        css.top = offset.top + this.$input.outerHeight();
                        css.left = offset.left;
                    }
                    this.$hintContainer.css(css);
                }
        },
        _loadData: function () {
            var _this = this;
            _this.$input.addClass("input-loading");
            ajax({
                url: this.opt.url,
                type: this.opt.type,
                data: this.opt.data,
                successCall: function (data) {
                    _this.$input.off("click.loadData");
                    _this.$container.addClass("open");
                    _this._resulteExec(data);
                },
                completeCall: function () {
                    _this.$input.removeClass("input-loading");
                    _this.isLoading = false;
                },
                // error: function () {
                //     _this.isLoading = false;
                 //   如果失败没有绑定再次请求
                // }
            });
        },
        _createNorecord: function (textContent) {
            this.$optionsContent.html(function () {
                return this.opt.tipsHtml.replace(/{text}/, textContent || this.opt.noRecord);
            }.bind(this));
        },
        createSelectOption: function (filter) { // type function
            var _this = this;
            var map = $.map(_this.dataList, function (item, idx) {
                var value = _this._generatorText(item, false), itemElement;
                if (filter && filter(value) == false) {
                    return null;
                }
                itemElement = $(drodownItemTmpl);
                itemElement
                    .data("value", item)
                    .html(value);
                return itemElement;

            });
            if (!map.length) {
                _this._createNorecord(_this.opt.tipsSearch(_this.searchText));
                return;
            }
            _this.options = map;
            this.$optionsContent.html(map);
        },
        setOption: function (data) {//更换选项
            this.dataList = data;
            this.selectedValue = null;
            this.createSelectOption();
        },
        createSelectPanel: function () {
            var css = null;
            this.$hintContainer = $('<div class="dropdown-menu dropdown-options-panel"></div>');
            this.$optionsContent = $('<div class="options-content"></div>')
            this.$statusbar = $('<div class="options-status"/>');
            this.$btn = $('<button type="button" class="btn btn-success">确定</button>');

            this.$hintContainer.appendTo(this.$container);
            this.$optionsContent.appendTo(this.$hintContainer);
            this.$statusbar.appendTo(this.$hintContainer);
            this.$btn.appendTo(this.$statusbar);
            css = {
                left: this.$input.position().left
            };
            if (this.opt.align && this.opt.align == "top") {
                css.top = 0;
                css.marginTop = "-" + (this.$hintContainer.outerHeight(true) + 10) + "px";
            } else {
                css.top = this.$input.outerHeight() + 2;
            }
            this.$hintContainer.css(css);
        },
        _search: function (value) {
            var filter = null;
            if (value) {
                value = value.trim();
                filter = function (val) {
                    return val.indexOf(value) != -1;
                }
            }
            this._searchText = value;
            this.selectedValue = null;
            this.createSelectOption(filter);
        },
        _addSelectedClass: function () {
            var _this = this;
            $.each(this.options, function (idx, ele) {
                var value = ele.data("value");
                if(typeof value == "string"){
                    if(value == _this.selectedValue){
                        ele.addClass("active");
                        return false;
                    }
                }else if(value.id == _this.selectedValue.id){
                    ele.addClass("active");
                    return false;
                }
            });
        },
        _createSelectEvent: function () {
            var _this = this, timer = null;
            this.$hintContainer.on("click", function (e) {
                var $this = $(e.target),
                    value = $this.data("value");

                if (value) {
                    $this.addClass("active").siblings().removeClass("active");
                    _this.selectedValue = value;
                }
                e.stopPropagation();
            });

            if (this.opt.isSearch) {
                this.$input.on("input", function () {
                    var element = this;
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function () {
                        _this._search(element.value);
                    }, 200);

                });
                //    .on("click",function(e){ 不知道当初为什么要用点击 方式
                //    if(!_this.$container.hasClass("open")){
                //        _this.$container.addClass("open");
                //    }
                //    e.stopPropagation();
                //});
            }
            this.$btn.click(function (e) {
                var value = hidden = _this.selectedValue, text;
                if (!value) {
                    return false;
                }
                text = _this._generatorText(_this.selectedValue, true);
                if (_this.opt.valueField) {
                    value = text[0];
                    hidden = text[1];
                }
                _this.setValue(value, hidden);
                _this.$container.removeClass("open");
                e.stopPropagation();
            });
        },
        _generatorText: function (data, isBtn) { // isBtn : true 设置input,hidden; false 设置显示的item文本
            var type = Object.prototype.toString.call(this.opt.valueField), value;
            if (type == "[object Array]") {
                value = [data[this.opt.valueField[0]], data[this.opt.valueField[1]]];
            } else if (type == "[object Function]") {
                value = this.opt.valueField(data);
            } else {
                value = data;
            }
            return isBtn ? value : value.join ? value[0] : value;
        },
        setSelect: function (data, dataList) {
            if (!this.dataList) {
                this._resulteExec(dataList);
            }
            this.selectedValue = data;
            this._addSelectedClass();
            this.$btn.click();
        },
        setValue: function (inputValue, hiddenValue) {
            if (this.preValue != inputValue) {
                this.preValue = inputValue;
                this.$input.val(inputValue).trigger("change");
                if (this.$hidden) {
                    this.$hidden.val(hiddenValue);
                }
                if (this.$input.valid && this.$input[0].form) {
                    this.$input.valid();
                }
                this.opt.valueChange && this.opt.valueChange.apply(this, Array.prototype.slice.call(arguments, 0));
            }

            this.opt.valueSure && this.opt.valueSure.apply(this, Array.prototype.slice.call(arguments, 0));

            if (this.opt.isClear) {
                if (inputValue) {
                    !this.$clear && this._createClear();
                } else {
                    this._removeClear();
                }
            }

        },
        _createClear: function () {
            this.$clear = $('<span class="area-selector-remove"><i class="iconfont-del"></i></span>');
            this.$clear.on("click", function () {
                this.selectedValue = null;
                this.setValue("", "");
            }.bind(this)).insertAfter(this.$input);
        },
        _removeClear: function () {
            this.$clear.off("click");
            this.$clear.remove();
            this.$clear = null;
        },
        destroy: function () {
            this.$input.off("click.loadData").removeData("dropdownText").val("");
            if (this.$hintContainer) {
                this.$hidden && this.$hidden.remove();
                this.$clear && this._removeClear();
                this.$btn.off("click");

                this.$hintContainer.off("click").remove();
            }

            return this.$input;
        }

    };
    //jq 对象方法
    $.extend($.fn, {
        dropdownText: function (opt) {
            var data = this.data("dropdownText");
            if (!data) {
                data = new Main(this, opt);
                this.data("dropdownText", data);
            }
            return data;
        }
    });
     return Main;
});
