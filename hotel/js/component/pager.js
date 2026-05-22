define(['template','ajaxSub'],function(template,ajax) {
  var _loadData = function(url,data,callback){
      ajax({
          url : url,
          data:data,
          successCall:function(data){
            callback(data);
          }
        });
    }
  var _renderTmpl = function(tmpl,data){
        return template.compile(tmpl)(data);
  }
  function createPagination(container,url,tmpl,opts,data){
    this.container  = container;
    this.url = url;
    this.tmpl = tmpl;
    this.data = data || {};
    this.pager = $('<div class="ui-pages"></div>');
    this.opts =$.extend({
      pageSize : 10,
      pageIndex : 1,
      totalCount: 0,
      totalPages: 0,
      link      : "javascript:;",
      cusPageParams: {
              size: 6,
              prev: 3,
              next: 2
          }
    },opts);
    this.init();
}
createPagination.prototype = {
    constructor :createPagination,
    init:function(){
      for( var i in this.opts){
        this[i] = this.opts[i];
      }
      this.loadData();
    },
    prev     : function(){
      if(this.pageIndex > 1){
        this.pageIndex--;
        this.loadData(this.pageIndex);
      }
    },
    next     : function(){
      if(this.pageIndex < this.totalPages){
        this.pageIndex++;
        this.loadData(this.pageIndex);
      }
    },
    setCallback :function(func){
      this.callback = func;
    },
    generPage: function(){
      var _this = this,html = '',params = this.cusPageParams;
          if (this.totalPages > 1) {
              var start = 0,
                  end = 0;
              if (this.totalPages <= params.size) {
                  start = 1;
                  end = this.totalPages;
              } else {
                  if (this.pageIndex <= params.prev) {
                      start = 1;
                      end = params.size;
                  } else {
                      if (this.totalPages - this.pageIndex  >= params.next) {
                          start = this.pageIndex - params.prev;
                          end = this.pageIndex + params.next;
                      } else {
                          start = this.totalPages - params.size;
                          end = this.totalPages;
                      }
                  }
              }
              for (var i = start; i <= end; i++) {
                  html += '<a href="' + this.opts.link + '" data-index="'+ i +'"' + (this.pageIndex == i ? 'class="page-curr"' : '') + '>' +i+ '</a>';
              }
              if(this.pageIndex > 1){
                html = '<a href="' + this.opts.link + '" data-index="'+ (this.pageIndex - 1) +'" class="page-prev">上一页</a>' + html;
              }
              if(this.pageIndex < this.totalPages){
                html += '<a href="' + this.opts.link + '" data-index="'+ (this.pageIndex - 0 + 1) +'" class="page-next">下一页</a>';
              }
          }
          // return html;
          if(html){
            var pager = this.pager.clone();
              pager.html(html).on("click","a",function(){
                var index = $(this).data("index") || $(this).index();
                if(index){
                  _this.loadData(index);
                }
              });
              pager.appendTo(this.container);
          }
    },
    renderHtml :function(data){
      var bodyString = _renderTmpl(this.tmpl,data);
          this.container.html(bodyString);
          this.generPage();
    },
    loadData : function(pageNum){
      var _this = this;
        if(pageNum){
          if(pageNum == _this.pageIndex){
            return false;
          }else{
            _this.pageIndex = pageNum;
          }
        }
     
        _loadData(_this.url,$.extend({
            pageNo : pageNum || _this.pageIndex,
            pageSize  : _this.pageSize
          },_this.data),function(data){
            if(!_this.totalCount){
              _this.totalCount = data.totalCount;
              _this.totalPages = Math.ceil(data.totalCount / _this.pageSize)
            }
            _this.renderHtml(data);
            _this.callback && _this.callback();
        });
    }
  }
  return createPagination;
});
