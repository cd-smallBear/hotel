{% set target ="餐饮管理" %}
{% set selectedMenu = {caption:'餐饮管理',child : '菜单管理',subChild : "菜品列表"} %}
{% extends "../../../layout/_layout-admin.swig" %}


{% block title -%}
{% parent %}-{{target}}
{%- endblock %}

{%- block style %}
<link rel="stylesheet" href="{{css.root + 'admin.css'}}">
<link rel="stylesheet" href="{{css.pages + 'catering.css'}}">
{% endblock -%}

{% block content %}
<div class="g-content" id="content" data-page="cateringMenu">
	<div class="catering-panel">
		<form action="" class="form addmenu-form">
			<div class="form-group row">
				<span class="offset-sm-label col-form-label label-required">菜品图片</span>
				<div class="offset-sm-input">
					<div class="upload-container menuCate-logo clearfix">
						<div class="upload-img-wrapper" id="uploadMenuCateImageContainer"></div>
						<label class="btn btn-sm btn-primary upload-btn" id="uploadMenuCateImage" data-name="url">上传图片</label>
						<strong class="upload-help">建议尺寸 600px * 600px</strong>
					</div>
				</div>
			</div>
			<div class="form-group row">
				<span class="offset-sm-label col-form-label label-required">菜品名称</span>
				<div class="offset-sm-input">
					<input type="text" class="form-control">
				</div>
			</div>
			<div class="form-group row">
				<span class="offset-sm-label col-form-label">第三方编码</span>
				<div class="offset-sm-input">
					<input type="text" class="form-control">
				</div>
			</div>
			<div class="form-group row">
				<span class="offset-sm-label col-form-label label-required">销售价</span>
				<div class="offset-sm-input ui-options" id="radio-opotions-box">
					<span class="option">
						<span class="ui-radio">
							<input type="radio" name="rule" class="ui-radio-normal radio" id="closeRule" checked data-active="close" data-target="openRuleBox">
							<label for="closeRule" class="ui-radio-emulation"></label>
						</span>
						<label for="closeRule" class="ui-label">单一售价</label>
					</span>
					<span class="ption">
						<span class="ui-radio">
							<input type="radio" name="rule" class="ui-radio-normal radio" id="openRule" data-active="open" data-target="openRuleBox">
							<label for="openRule" class="ui-radio-emulation"></label>
						</span>
						<label for="openRule" class="ui-label">启用规格</label>
					</span>
					<div class="openRule-box d-none" id="openRuleBox">
						<input type="text" class="form-control" data-name="rule" id="dropdownText-Rule" readonly placeholder="请选择">
						<a href="../store/rule.html" class="btn btn-outline-primary align-top">添加规格</a>
					</div>
				</div>
			</div>
			<div class="form-group row">
				<span class="offset-sm-label col-form-label">菜品口味</span>
				<div class="offset-sm-input">
					<div class="m-switch">
						<input type="checkbox" class="ui-checkbox-normal switch-check menu-enable" id="menu-taste">
						<label for="menu-taste"></label>
					</div>
					<span class="menu-taste-label form-control-static">口味请设置</span>
				</div>
			</div>
			<div class="form-group row">
				<span class="offset-sm-label col-form-label">菜品分组</span>
				<div class="offset-sm-input">
					<div class="m-select" id="dropdown-menuCate">
						<input type="text" class="form-control select-txt" value="请选择" readonly data-toggle="dropdown" data-name="menu-category">
						<input type="hidden" name="menu-category">
						<span class="select-caret"></span>
						<div class="dropdown-menu">
							<a href="javascript:;" class="dropdown-item" data-value="0">全部</a>
							<a href="javascript:;" class="dropdown-item" data-value="1">菜品一</a>
							<a href="javascript:;" class="dropdown-item" data-value="2">菜品二</a>
							<a href="javascript:;" class="dropdown-item" data-value="3">菜品三</a>
						</div>
					</div>
				</div>
			</div>
			<div class="form-group row">
				<span class="offset-sm-label col-form-label">菜品标签</span>
				<div class="offset-sm-input">
					<button type="button" class="btn btn-subsidiary">+增加标签</button>
				</div>
			</div>
			<div class="form-group row">
				<span class="offset-sm-label col-form-label">商品信息</span>
				<div class="offset-sm-input">
					<div class="upload-container">
						<label class="btn btn-sm btn-primary upload-btn" id="uploadMenuCateDetail" data-name="sUrl">上传图片</label>
						<strong class="upload-help">建议尺寸 800px * 450px (最多可上传5张)</strong>
						<div class="upload-img-wrapper pb-2 clearfix" id="uploadMenuCateDetailContainer"></div>
					</div>
					<textarea name="mark" class="form-control" cols="10" rows="10" placeholder="最多可以输入150个汉字"></textarea>
					<div class="submit-row btns pt-1">
						<input type="submit" class="btn btn-success" value="提交">
						<button type="button" class="btn btn-outline-success" onclick="history.back();">返回</button>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
{% endblock %}
{% block scripts %}
<script src="{{js.lib.root + 'require.js'}}" data-main="{{js.pages + 'catering-menu.js'}}"></script>
{% endblock %}
