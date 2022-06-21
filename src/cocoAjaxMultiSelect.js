;(function($){
	"use strict";
	var pluginName = 'cocoAjaxMultiSelect',
	page = 1,
	searchtext = null,
	termTimeout = null,
	selectedval,
	canScrollAjax = true,
	viewCnt = 0,
	defaults = {
		'ajaxCode': function(input, page, pagging){ 
			alert('ERROR! ajaxfunc 옵션을 반드시 작성해주세요!'); 
			throw "stop"; 
		}, //ajax 호출코드 반드시 동기방식으로 사용해야함.
		checkedCode:function(selectValue){
			console.log(selectValue);
		}, //체크를 선택하거나 해지할때 호출할 수 있는 콜백코드
		'arrayInKey':'uuid', //배열이나 객체의 변수의 key값
		'arrayInValue':'name', //배열이나 객체의 변수의 value값
		'regularExpression':'[a-z|A-Z|가-힣| ]{2,}', //입력값이 정규식에 해당되면 ajax 호출을 실행한다.
		'delay':700, //마지막검색이 수행된 직후 200ms 뒤에 검색할 수 있다.
		'pageUnit':20, //pagging이 true일경우, 한번에 출력할 갯수
		'scrollLeftLoad':100, //다음 page를 호출할 스크롤의 남은 높이값
		'height':300 //select창의 높이값
	};
	//메인함수
	function cocoAjaxMultiSelect(element, options) {
		this.element = element;
		this.$element = $(element);
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	};
	
	//호출할 수 있도록 프로토타이핑
	$.extend(cocoAjaxMultiSelect.prototype,{
		init: function(){
			let id = $(this.element).attr('id');
			let value = $(this.element).val();
			let multiple = $(this.element).attr('multiple');
			$(this.element).after("<label for='"+id+"'></label>");
			$("label[for='"+id+"']").after("<s for='"+id+"'></s>");
			if(multiple == 'multiple'){
				if(value != ''){
					$("s[for='"+id+"']").text(value.split(',').length);
				}else{
					$("s[for='"+id+"']").hide();
					$("s[for='"+id+"']").text('');
				}
			}else{
				$("s[for='"+id+"']").hide();
			}
			
			
			this.clickListener();
			this.closeListener();
			this.inputListener();
			this.holdonFocus();
			this.checkboxControl();
		},
		
		//select하단에서 체크박스 선택시
		checkboxControl:function(){
			var _this = this;
			let multiple = this.$element.attr('multiple');
			$('html').on('click.cocoAjaxMultiSelect',".ajaxselect_detail[for='"+this.$element.attr('id')+"'] input",function(){
				let is_checked = $(this).attr('checked');
				let value = $(this).next('label').text();
				
				if(is_checked == 'checked'){
					if(multiple){
						selectedval = selectedval.filter((element) => element !== value);
					}
					
				}else{
					if(multiple){
						selectedval.push(value);
					}else{
						selectedval = new Array(value);
					}
					
				}
				_this.settings['checkedCode'](selectedval);
			});
		},
		
		
		//select하단 나오기
		detailshow:function(id, data_arr, multiple, width, top, left){
			
			let type = 'checkbox';
			if(multiple){
				type = 'checkbox';
			}else{
				type = 'radio';
			}
			
			let detail_li = '';
			if($(".ajaxselect_detail[for='"+id+"']").length == 0){
				detail_li += "<ul for='"+id+"' class='ajaxselect_detail' style='max-height:"+this.settings['height']+"'>";	
			}
			viewCnt = 0;
			if(data_arr.length > 0){
				for(let i=0; i<data_arr.length; i++){
					if(selectedval.includes(data_arr[i][String(this.settings['arrayInValue'])])){
						detail_li += "<li><input type='"+type+"' name='"+id+"' id='"+data_arr[i][String(this.settings['arrayInKey'])]+"' checked /><label for='"+data_arr[i][String(this.settings['arrayInKey'])]+"'>"+data_arr[i][String(this.settings['arrayInValue'])]+"</label></li>";
					}else{
						detail_li += "<li><input type='"+type+"' name='"+id+"' id='"+data_arr[i][String(this.settings['arrayInKey'])]+"' /><label for='"+data_arr[i][String(this.settings['arrayInKey'])]+"'>"+data_arr[i][String(this.settings['arrayInValue'])]+"</label></li>";
					}
					viewCnt++;
				}
			}else{
				viewCnt++;
				detail_li += "<li><article>검색결과가 없습니다</article></li>";
			}
			
			if($(".ajaxselect_detail[for='"+id+"']").length == 0){
				detail_li += "</ul>";
				$("s[for='"+id+"']").after(detail_li);			
			}else{
				$(".ajaxselect_detail[for='"+id+"']").html(detail_li);
			}
			
			var _this = this;
			var id = $(this.element).attr('id');
			$(".ajaxselect_detail[for='"+id+"']").scroll(function(){
				return new Promise(function(resolve, reject) {
					let scrollTop = $(".ajaxselect_detail[for='"+id+"']").scrollTop();
					let detailViewHeight = _this.settings['height'];
					let resultViewHeight = $(".ajaxselect_detail[for='"+id+"'] li").outerHeight() * viewCnt;
					if(canScrollAjax && scrollTop + _this.settings['scrollLeftLoad'] >= resultViewHeight - detailViewHeight && viewCnt >= _this.settings['pageUnit']){
						page++;
						_this.settings['ajaxCode'](searchtext, page, _this.settings['pageUnit']).then((data)=>{
							if(data.length > 0){
								//현재페이지에 이어서 출력
								_this.moreshow(id, data, type).then(()=>{
									resolve();
								}).catch(function(err){
									if(termTimeout != null){
										clearTimeout(termTimeout); 
									}
									canScrollAjax = false;
								});
							}else{
								//더이상출력할 페이지가 없음.
								canScrollAjax = false;
							}
						});
					}
				});
			});
			$(".ajaxselect_detail[for='"+id+"']").css({top:top, left:left, width:width}); //불러온트리의 위치를 보정
			$("s[for='"+id+"']").hide();
		},
		
		//스크롤링하면 추가 데이터 넣기
		moreshow:function(id, data_arr, type){
			var _this = this;
			let data_lengh = data_arr.length;
			return new Promise(function(resolve, reject) {
				if(data_lengh > 0 && canScrollAjax){
					canScrollAjax = false;
					viewCnt = data_lengh + viewCnt;
					let more_detail_li = '';
					for(let i=0; i<data_lengh; i++){
						if(selectedval.includes(data_arr[i][String(_this.settings['arrayInValue'])])){
							more_detail_li += "<li><input type='"+type+"' name='"+id+"' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' checked /><label for='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</label></li>";
						}else{
							more_detail_li += "<li><input type='"+type+"' name='"+id+"' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' /><label for='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</label></li>";
						}
					}
					$(".ajaxselect_detail[for='"+id+"']").append(more_detail_li).promise().done(function(){
						if(data_lengh >= _this.settings['pageUnit']){
							canScrollAjax = true;
							resolve();
						}else{
							canScrollAjax = false;
							reject();
						}
					});
				}
			});
		},
		
		//클릭시 하단에 select화면이 나옴
		clickListener:function(){
			var _this = this;
			$('html').on('click.cocoAjaxMultiSelect',"#"+this.$element.attr('id')+"[type='cocoAjaxMultiSelect']", function(){
				let focus = $(this).attr('focus');
				let id = $(this).attr('id');
				let multiple = $(this).attr('multiple');
				if(multiple == 'multiple'){
					multiple = true;
				}else{
					multiple = false;
				}
				let value = $(this).val();
				if(value != ''){
					selectedval = value.split(',');
					searchtext = null;
				}else{
					selectedval = new Array();
				}
				
				if(typeof focus == 'undefined' || focus == null || focus == ''){
					//닫힌상태에서 열기
					$(this).attr('autocomplete','off');
					$(this).val('');//입력값 초기화 > 검색어를 입력할 수 있도록
					$(this).attr('readonly', false);//키보드입력가능하게
					$(this).attr('focus', 'on'); //검색아이콘으로 변경
					
					
					_this.settings['ajaxCode'](searchtext, page, _this.settings['pageUnit']).then((data)=>{
						_this.$element.before("<div for='"+id+"' class='ajaxselect_over'></div>"); //닫는화면 불러오기
						_this.detailshow(id, data, multiple, $(this).outerWidth()-30, $(this).offset().top+32, $(this).offset().left);
						if(data.length >= _this.settings['pageUnit']){
							canScrollAjax = true;
						}else{
							canScrollAjax = false;
						}
					});
					
					
				}
			});
			
		},
		
		//다른영역을 클릭하면 select화면이 나타나지 않음
		closeListener:function(){
			let multiple = this.$element.attr('multiple');
			$('html').on('click.cocoAjaxMultiSelect',".ajaxselect_over[for='"+this.$element.attr('id')+"']",function(){
				let overfor = $(this).attr('for');
				if(typeof overfor != 'undefined' && overfor != null && overfor != ''){
					let values = '';
					for(var i=0; i<selectedval.length; i++){
						values += selectedval[i];
						if(i < selectedval.length - 1){
							values += ',';
						}
					}
					$("#"+String(overfor)+"[type='cocoAjaxMultiSelect']").val(values);
					if(multiple == 'multiple'){
						if(selectedval.length > 0){
							$("s[for='"+overfor+"']").text(selectedval.length);
							$("s[for='"+overfor+"']").show();
						}else{
							$("s[for='"+overfor+"']").hide();
						}
					}else{
						$("s[for='"+overfor+"']").hide();
					}
					
					$("input[type='cocoAjaxMultiSelect']").removeAttr('focus');
					$("input[type='cocoAjaxMultiSelect']").attr('readonly',true);
					$(".ajaxselect_detail[for='"+overfor+"']").remove();
					$(".ajaxselect_over[for='"+overfor+"']").remove();
				}
				page = 1;
				canScrollAjax = true;
				searchtext = null;
				$(this).remove();
			});
		},
		
		//키보드입력시
		inputListener:function(){
			var _this = this;
			let inputReg = new RegExp(this.settings['regularExpression'], 'g');
			//엔터키 감지용
			$('html').on('keypress.cocoAjaxMultiSelect',"#"+this.$element.attr('id')+"[type='cocoAjaxMultiSelect']",function(e){
				let keycode = e.keyCode;
				if(keycode == 13){
					if(termTimeout != null){
						clearTimeout(termTimeout); 
					}
					page = 1;
					let focus = $(this).attr('focus');
					let id = $(this).attr('id');
					let multiple = $(this).attr('multiple');
					if(multiple == 'multiple'){
						multiple = true;
					}else{
						multiple = false;
					}
					if(focus == 'on'){
						_this.settings['ajaxCode']($(this).val(), page, _this.settings['pageUnit']).then((data)=>{
							if($(".ajaxselect_detail[for='"+id+"']").length > 0){
								searchtext = $(this).val();
								_this.$element.before("<div for='"+id+"' class='ajaxselect_over'></div>"); //닫는화면 불러오기
								_this.detailshow(id, data, multiple, $(this).outerWidth()-30, $(this).offset().top+32, $(this).offset().left);
								if(data.length >= _this.settings['pageUnit']){
									canScrollAjax = true;
								}else{
									canScrollAjax = false;
								}
							}
						});
					}
				}
			});
			$('html').on('input.cocoAjaxMultiSelect',"#"+this.$element.attr('id')+"[type='cocoAjaxMultiSelect']",function(event){
				page = 1;
				let focus = $(this).attr('focus');
				let id = $(this).attr('id');
				let multiple = $(this).attr('multiple');
				if(multiple == 'multiple'){
					multiple = true;
				}else{
					multiple = false;
				}
				if(focus == 'on'){
					
					if(termTimeout != null){
						clearTimeout(termTimeout); 
					}
					var keypromise = new Promise((resolve, reject) => {
						if(inputReg.test($(this).val()) || $(this).val() == ''){
							termTimeout = setTimeout(function(){
								termTimeout = null;
								resolve();
							}, _this.settings['delay']);
						}else{
							reject();
						}
					});
					
					keypromise.then(()=>{
						_this.settings['ajaxCode']($(this).val(), page, _this.settings['pageUnit']).then((data)=>{
							if($(".ajaxselect_detail[for='"+id+"']").length > 0){
								searchtext = $(this).val();
								_this.$element.before("<div for='"+id+"' class='ajaxselect_over'></div>"); //닫는화면 불러오기
								_this.detailshow(id, data, multiple, $(this).outerWidth()-30, $(this).offset().top+32, $(this).offset().left);
								if(data.length >= _this.settings['pageUnit']){
									canScrollAjax = true;
								}else{
									canScrollAjax = false;
								}
							}
						});
					}).catch(function(err){
						if(termTimeout != null){
							clearTimeout(termTimeout); 
						}
						canScrollAjax = true;
						searchtext = null;
					});
						
				}else{
					//열고 닫힌뒤 키보드입력시 입력막기
					if(termTimeout != null){
						clearTimeout(termTimeout); 
					}
					var key = event.keyCode;
					if(key != ''){
						event.returnValue = false;
					}
					canScrollAjax = true;
					searchtext = null;
					$(this).blur();
				}
			});
		},
		
		//select화면을 선택해도 포커스를 강제하기
		holdonFocus:function(){
			$('html').on('blur.cocoAjaxMultiSelect',"#"+this.$element.attr('id')+"[type='cocoAjaxMultiSelect']",function(){
				if($(this).attr('focus') == 'on'){
					$(this).focus();
				}
			});
		}
	});
	
	//함수실행@@
	$.fn[ pluginName ] = function(options){
		return this.each(function() {
			if(!$.data(this, "plugin_" + pluginName)){
			$.data(this, "plugin_" + pluginName,
				new cocoAjaxMultiSelect(this, options));
			}
		});
	};
})(jQuery);