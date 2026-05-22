(function( App, Cms ) {
  require.config({
    baseUrl: Cms.rootDir + '/js/',
    shim: {
      'jquery': {
        exports: '$',
      },
      'table': {
        exports: 'table',
      },
      'edit': {
        exports: 'editable',
      },
    },
    paths: {
      'validate'      : 'lib/validate',
      'webuploader'   : 'lib/webuploader',
      'jeDate'        : 'lib/jquery.jedate',
      'btTree'        : 'lib/bootstrap-treeview',
      'table'         : 'lib/bootstrap.table',
      'edit'          : 'lib/bootstrap.table.editable',
      'template'      : 'lib/template',
      'baiduMap'      : ['https://api.map.baidu.com/getscript?v=2.0&ak=CKmrIrkyFiamOWQzd4fua7LwiqxSaKxm&services=&t=20170324173232&s=1'],
      'select2'       : 'lib/select2.full',
      'echarts'       : 'lib/echarts.min',
      'angular'       : 'lib/angular.min',
      'unslider'      : 'lib/unslider',


      'dataMaterialCate'              : 'datas/material-category',

      'ajaxSub'                       : 'component/ajaxsub',
      'webuploader.setting'           : 'component/webuploader.setting',
      'bsDialog'                      : 'component/bs-dialog',
      'bsDialogForm'                  : 'component/bs-dialog-form',
      'areaCaseSelecter'              : 'component/area-case-selecter',
      'caseSelector'                  : 'component/case-selector',
      'formToken'                     : 'component/formtoken',
      'dropdownSelect'                : 'component/dropdown.select',
      'bsSelect'                      : 'component/bootstra-select',
      'autoComplete'                  : 'component/auto-complete',
      'ngUtil'                        : 'component/ng-util',
      'createMap'                     : 'component/createMap',
      'netMap'                        : 'component/netMap',
      'pointsMap'                     : 'component/pointsMap',
      'fileUploader'                  : 'component/webuploader.file',
      'tag'                           : 'component/tag',
      'addProduct'                    : 'component/addProduct',
      'starJudge'                     : 'component/star-judge',
      'pager'                         : 'component/pager',
      'numbox'                        : 'component/numbox',
      'selectTable'                   : 'component/selecttable',
      'stickup': 'component/stickup',
      'dyncNavBar': 'component/dync-navbar',



      'account'           : 'pages/account',
      'enterprise'        : 'pages/enterprise',
      'addNeed'           : 'pages/add-need',
      'config'            : 'pages/config',
      'config-enterprise' : 'pages/config-enterprise',
      'config-enterprisePreview' : 'pages/config-enterPreview',
      'material'          : 'pages/material',
      'materialDetail'    : 'pages/materialDetail',
      'purDetailOrder'    : 'pages/pur-detail-order',
      'storage'           : 'pages/storage',
      'product'           : 'pages/product',
      'addGood'           : 'pages/add-good',
      'addGoodDetail'     : 'pages/new-gooddetail',
      'addMerchants'      : 'pages/add-merchants',
      'inviteBid'         : 'pages/invite-bid',
      'inviteBidDetail'   : 'pages/invite-bid-detail',
      'materialBuy'       : 'pages/material-buy',
      'enterPreview'      : 'pages/enterPreview',
    },
  })

  // document.addEventListener("error", function(e){
  //   var elem = e.target;
  //   console.log('ddd', elem, elem.src)
  //   // if(elem.tagName.toLowerCase() === 'img'){
  //   // elem.src = "/img/hint.jpg";
  //   // }
  //   }, true /*指定事件处理函数在捕获阶段执行*/);

  window.app = new App({
    onPageInit: function(pageData) {
      switch(pageData.name) {
        case 'account-manage' :
          Cms.requireUtil('account','manage');
        break
        case 'account-changepsd' :
          Cms.requireUtil('account','changepsd');
        break
        case 'material-purchase-order' :                     //物资采购start
          Cms.requireUtil('material','purchaseOrder');
        break
        case 'material-purchase-plan' :
          Cms.requireUtil('material','purchasePlan');
        break
        case 'material-order-dts':
          Cms.requireUtil('material', 'orderDetails');
        break
        case 'add-purchase-plan':
          Cms.requireUtil('material', 'addPurchasePlan');
        break
        case 'add-purchase-order':
          Cms.requireUtil('material', 'addPurchaseOrder');
        break
        case 'material-materialDetail':
          Cms.requireUtil('materialDetail');
        break
        case 'material-buy':
          Cms.requireUtil('materialBuy');
        break
        case 'material-producerApply':
          Cms.requireUtil('material', 'producerApply');
        break
        case 'material-purchaseHall':
          Cms.requireUtil('material', 'purchaseHall');
        break
        case 'material-partner' :
          Cms.requireUtil('material','partner');
        break                                                //物资采购over
        case 'product-saleOrder' :                       //产品销售
          Cms.requireUtil('product','saleOrder');
        break
        case 'product-merchants-add' :                       //产品销售
          Cms.requireUtil('addMerchants');
        break
        case 'product-salePlan' :                       //产品销售
          Cms.requireUtil('product','salePlan');
        break
        case 'product-needsHall' :                       //产品销售
          Cms.requireUtil('product','needsHall');
        break
        case 'storage-orderlist' :                           //仓储物流start
          Cms.requireUtil('storage','orderlist');
        break
        case 'storage-logistics-add' :
          Cms.requireUtil('storage','logisticsAdd');
        break
        case 'storage-logisticsTpos-add' :
          Cms.requireUtil('storage','logisticsTposAdd');
        break
        case 'storage-manage' :
          Cms.requireUtil('storage','manage');
        break
        case 'enterprise-needs' :
          Cms.requireUtil('enterprise', 'needs');
        break
        case 'enterprise-proxySale' :
          Cms.requireUtil('enterprise', 'proxySale');
        break
        case 'enterprise-diyHall' :
          Cms.requireUtil('enterprise', 'diyHall');
        break
        case 'tst-plan':
          Cms.requireUtil('enterprise', 'tstPlan');
        break
        case 'enterprise-productPutAway':
          Cms.requireUtil('enterprise', 'productPutAway');
        break
        case 'enterprise-nets':
          Cms.requireUtil('enterprise', 'nets');
        break
        case 'enterprise-addStore':
          Cms.requireUtil('enterprise', 'addStore');
        break
        case 'enterprise-store-detail':
          Cms.requireUtil('enterprise', 'storeDetail');
        break
        case 'enterprise-net-detail':
          Cms.requireUtil('enterprise', 'netDetail');
        break
        case 'enterprise-add-need':
          Cms.requireUtil('addNeed');
        break
        case 'config-serverRule':
          Cms.requireUtil('config', 'serverRule');
        break
        case 'config-contact':
          Cms.requireUtil('config', 'contact');
        break
        case 'config-sales':
          Cms.requireUtil('config', 'sales');
        break
        case 'config-storage':
          Cms.requireUtil('config', 'storage');
        break
        case 'config-enterprise':
          Cms.requireUtil('config-enterprise');
        break
        case 'config-enterprisePreview':
          Cms.requireUtil('config-enterprisePreview');
        break
        case 'config-addCarriage':
          Cms.requireUtil('config','addCarriageTmpl');
        break
      }
    }
  });
}( window.App, window.Cms ) )
