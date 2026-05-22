(function( factory ) {
  if( window.define ) {
    define([], factory)
  }else {
    window.App = factory()
  }
}(function() {
  var $ = window.jQuery

  /**
   * 页面缓存
   * @method PageCache
   * @param  {[type]}  maxCount 缓存数量
   */
  function PageCache( maxCount ) {
    this.count = 0
    this.maxCount = maxCount || 0 // 默认为0，不限定长度
    this.cache = {}
  }
  PageCache.prototype = {
    getPage: function( url ) {
      return this.cache[url] || null
    },
    addPage: function( url, html ) {
      // 如果缓存原来不存在， 递加数量
      if( !this.cache[url] ) {
        this.count ++
      }

      // 如果数量限制存在，并且超出数量限制，就清空第一个缓存
      if( this.maxCount > 0 && this.count > this.maxCount ) {
        this.clearPage( Object.keys(this.cache)[0] )
      }

      this.cache[url] = html
    },
    clearPage: function( url ) {
      if( this.cache[url] ) {
        delete this.cache[url]
        this.count --
      }
    },
    clear: function() {
      this.count = 0
      this.cache = {}
    },
  }

  App.defaultOpt = {
    onPageInit: null,
    hostDir: window.Cms.rootDir,
    defaultUrl: '/enterprise/index.html',
  }
  /**
   * [App description]
   * @param {Object} opt
   * @method App
   */
  function App( opt ) {
    this.opt = $.extend( {}, App.defaultOpt, opt )
    this.pageCache = new PageCache()
    this.$container = $('.g-main')

    this.init()
    // a标签处理
    this.preventDefaultA()
    this.initPopState()
  }

  App.prototype = {
    init: function() {
      var _url = this.getCutUrl()

      this.loadPage( _url || this.opt.defaultUrl )
    },
    // url, 是否缓存, 附加参数
    loadPage: function( url, cache, param ) {
      var _page, _cache

      _cache = cache == undefined ? false : !!eval(cache) // 默认不打开缓存

      if( _cache ) {
        _page = this.pageCache.getPage( url )
      }

      if( _page ) {
        this.renderPage( url, _page )
      }else {
        // 如果缓存不存在，就加载页面
        this.ajaxLoadPage( url, param, function( html ) {
          // 缓存页面
          _cache && this.pageCache.addPage( url, html )
          this.renderPage( url, html )
        }.bind(this) )
      }

      // 加入历史记录
      if( url !== this.getCutUrl() ) {
        window.history.pushState && window.history.pushState({
          type: 'page',
          url: url,
        }, '', '#' + url )
      }
    },
    back: function() {
      window.history && window.history.back()
    },
    // 异步加载页面
    ajaxLoadPage: function( url, param, callback ) {
      $.get( this.opt.hostDir + url, param || {}, function( msg ) {
        callback( msg )
      })
    },
    preventDefaultA: function() {
      $(document).on('click', 'a', function( evt ) {
        var $tar = $(evt.currentTarget),
            param,
            href = $tar.attr('href')

        // 排除.ext以及直接选择id的a标签
        if( !$tar.hasClass('ext')
            && $tar.attr('target') == null // 过滤没设置target属性的
            && href
            && href.indexOf('#')<0
            && href.indexOf('javascript')<0 ) {
          evt.preventDefault()
          //左菜单高亮
          var menu = $tar.closest(".aside-menu");
          if(menu.length){
            menu.find(".active").removeClass("active");
            $tar.parents("li").addClass("active");
          }
          param = $tar.data() || {}

          this.loadPage( href, param.cache, param )
        }
      }.bind(this) )
    },
    renderPage: function( url, html ) {
      this.$container.html( html )

      $(this).trigger('pageInit')

      this.query = this.parseUrlQuery( url )

      this.opt.onPageInit && this.opt.onPageInit( {
        name: this.$container.find('.g-content').data('page'),
        url: url,
        query: this.query,
      } )
    },
    getQuery: function() {
      return this.query
    },
    getCutUrl: function( url ) {
      var _url = url || window.location.hash


      if( _url.length )
        _url = _url.indexOf('#')>-1 ? _url.split('#')[1] : this.opt.defaultUrl

      return _url
    },
    parseUrlQuery: function( _url ) {
      var query = {}, i, params, param, url

      url = _url || location.href

      if (typeof url === 'string' && url.length) {
        url = (url.indexOf('#') > -1) ? url.split('#')[0] : url
        if (url.indexOf('?') > -1) url = url.split('?')[1]
        else return query

        params = url.split('&')
        for (i = 0; i < params.length; i ++) {
          param = params[i].split('=')
          query[param[0]] = param[1]
        }
      }
      return query
    },
    initPopState: function() {
      window.addEventListener('popstate', function(evt) {
        var _state = evt.state

        console && console.log( 'pop', _state)
        if(_state && _state.type === 'page' && _state.url != '') {
          this.loadPage( _state.url )
        }/* else {
          this.loadPage( this.opt.defaultUrl )
        }*/
      }.bind(this) )
    },
  }

  // 暴露控件
  App.PageCache = PageCache

  return App
} ) )
