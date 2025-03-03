;(function($, window, document, undefined){
	var pluginName = 'cocoAjaxMultiSelect',
	page = 1,
	searchtext = null,
	termTimeout = null,
	canScrollAjax = true,
	viewCnt = 0,
	defaults = {
		'ajaxCode': function(input, page, pagging){ 
			alert('ERROR! ajaxfunc 옵션을 반드시 작성해주세요!'); 
			throw "stop"; 
		}, //ajax 호출코드 반드시 동기방식으로 사용해야함.
		checkedCode:function(selectedArray, _this){
			//console.log(selectedArray);
			//console.log(_this);
		}, //체크를 선택하거나 해지할때 호출할 수 있는 콜백코드
		blurCode:function(selectedArray, _this){
			//console.log(selectedArray);
			//console.log(_this);
		}, //셀렉트창을 빠져나올때 호출할 수 있는 콜백코드
		'arrayInKey':'uuid', //배열이나 객체의 변수의 key값
		'arrayInValue':'name', //배열이나 객체의 변수의 value값
		'arrayInImage':false, //이미지로 대체되는 경우 value값
		'regularExpression':'[a-z|A-Z|가-힣| ]{2,}', //입력값이 정규식에 해당되면 ajax 호출을 실행한다.
		'delay':700, //마지막검색이 수행된 직후 200ms 뒤에 검색할 수 있다.
		'pageUnit':20, //pagging이 true일경우, 한번에 출력할 갯수
		'scrollLeftLoad':100, //다음 page를 호출할 스크롤의 남은 높이값
		'height':300 //select창의 높이값
	};
	//메인함수
	function cocoAjaxMultiSelect(element, options) {
		this.selectedval = new Array();
		this.selectedkey = new Array();
		this.selectedArray = new Array();
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
			
			let force_key = false;
			if(this.element.hasAttribute('force_selected_key')){
				force_key = $(this.element).attr('force_selected_key').split(',');
				if(value.split(',').length !== force_key.length){
					console.log('[cocoAjaxMultiSelect]-사전입력값에 오류가 있습니다!\ㅜvalue에 넣은 값의 수와 force_selected_key값이 서로 다릅니다');
				}
			}
			$(this.element).attr('autocomplete', 'off');
			$(this.element).after("<label for='"+id+"' ajaxselect_label></label>");
			$("label[for='"+id+"']").after("<s for='"+id+"'></s>");
			
			
			if(multiple === 'multiple'){
				if(value !== ''){
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
			//this.holdonFocus();
			this.checkboxControl();
			this.searchBtn();
		},
		
		
		
		
		//select하단 나오기
		detailshow:function(id, data_arr, multiple, width, top, left){
			let _this = this;
			let detail_li = '';
			if($(".ajaxselect_detail[for='"+id+"']").length == 0){
				detail_li += "<ul for='"+id+"' class='ajaxselect_detail' style='height="+this.settings['height']+"'>";	
			}
			viewCnt = 0;
			
			if(data_arr){
				let checkkey = false;
				if(this.selectedkey.length > 0){
					checkkey = true;
				}
				if(data_arr.length > 0){
					
					if(_this.settings['arrayInImage']){
						for(let i=0; i<data_arr.length; i++){
							if(checkkey === true && _this.selectedkey.includes(data_arr[i][String(_this.settings['arrayInKey'])])){
								if(data_arr[i][String(_this.settings['arrayInImage'])]){
									detail_li += "<li class='img' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' name='"+data_arr[i][String(_this.settings['arrayInValue'])]+"' style='background-image:url("+data_arr[i][String(_this.settings['arrayInImage'])]+");'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</li>";
								}else{
									detail_li += "<li id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' class='nonimg' name='"+data_arr[i][String(_this.settings['arrayInValue'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</li>";
								}
							}else if(checkkey === false && _this.selectedval.includes(data_arr[i][String(_this.settings['arrayInValue'])])){
								if(data_arr[i][String(_this.settings['arrayInImage'])]){
									detail_li += "<li class='img' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' name='"+data_arr[i][String(_this.settings['arrayInValue'])]+"' style='background-image:url("+data_arr[i][String(_this.settings['arrayInImage'])]+");'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</li>";
								}else{
									detail_li += "<li id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' class='nonimg' name='"+data_arr[i][String(_this.settings['arrayInValue'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</li>";
								}
							}else{
								if(data_arr[i][String(_this.settings['arrayInImage'])]){
									detail_li += "<li class='img' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'  name='"+data_arr[i][String(_this.settings['arrayInValue'])]+"' style='background-image:url("+data_arr[i][String(_this.settings['arrayInImage'])]+");'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</li>";
								}else{
									detail_li += "<li id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' class='nonimg' name='"+data_arr[i][String(_this.settings['arrayInValue'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</li>";
								}
							}
							viewCnt++;
						}
					}else{
						if(multiple){
							for(let i=0; i<data_arr.length; i++){
								if(checkkey === true && _this.selectedkey.includes(data_arr[i][String(_this.settings['arrayInKey'])])){
									detail_li += "<li><input type='checkbox' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' checked /><label for='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</label></li>";
								}else if(checkkey === false && _this.selectedval.includes(data_arr[i][String(_this.settings['arrayInValue'])])){
									detail_li += "<li><input type='checkbox' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' checked /><label for='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</label></li>";
								}else{
									detail_li += "<li><input type='checkbox' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' /><label for='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</label></li>";
								}
								viewCnt++;
							}
						}else{
							for(let i=0; i<data_arr.length; i++){
								if(checkkey === true && _this.selectedkey.includes(data_arr[i][String(_this.settings['arrayInKey'])])){
									detail_li += "<li><input type='radio' name='"+id+"' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' checked /><label for='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</label></li>";
								}else if(checkkey === false && _this.selectedval.includes(data_arr[i][String(this.settings['arrayInValue'])])){
									detail_li += "<li><input type='radio' name='"+id+"' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' checked /><label for='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</label></li>";
								}else{
									detail_li += "<li><input type='radio' name='"+id+"' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' /><label for='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</label></li>";
								}
								viewCnt++;
							}
						}
					}
					
					
					
				}else{
					viewCnt++;
					detail_li += "<li><article>검색결과가 없습니다</article></li>";
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
			
			$(".ajaxselect_detail[for='"+id+"']").scroll(function(){
				return new Promise(function(resolve, reject) {
					let scrollTop = $(".ajaxselect_detail[for='"+id+"']").scrollTop();
					let detailViewHeight = _this.settings['height'];
					let resultViewHeight = $(".ajaxselect_detail[for='"+id+"'] li").outerHeight() * viewCnt;
					if(canScrollAjax && ( scrollTop + _this.settings['scrollLeftLoad'] >= resultViewHeight - detailViewHeight && viewCnt >= _this.settings['pageUnit'] || $(".ajaxselect_detail[for='"+id+"']").prop("scrollHeight") === $(".ajaxselect_detail[for='"+id+"']").prop("clientHeight") ) ){
						page++;
						_this.settings['ajaxCode'](searchtext, page, _this.settings['pageUnit']).then((data)=>{
							if(data){
								if(data.length > 0){
									//현재페이지에 이어서 출력
									_this.moreshow(id, data, multiple).then(()=>{
										resolve();
									}).catch(function(err){
										if(termTimeout != null){
											clearTimeout(termTimeout); 
										}
										termTimeout = null;
										canScrollAjax = false;
									});
								}else{
									//더이상출력할 페이지가 없음.
									canScrollAjax = false;
								}
							}else{
								canScrollAjax = false;
							}
						});
					}
					
				});
			});
			$(".ajaxselect_detail[for='"+id+"']").css({top:top, left:left, width:width, height:this.settings['height']}); //불러온트리의 위치를 보정
			$("s[for='"+id+"']").hide();
			
		},
		
		//스크롤링하면 추가 데이터 넣기
		moreshow:function(id, data_arr, multiple){
			let _this = this;
			let data_lengh = data_arr.length;
			return new Promise(function(resolve, reject) {
				if(data_lengh > 0 && canScrollAjax){
					canScrollAjax = false;
					viewCnt = data_lengh + viewCnt;
					let more_detail_li = '';
					
					let checkkey = false;
					if(_this.selectedkey.length > 0){
						checkkey = true;
					}
					
					if(_this.settings['arrayInImage']){
						for(let i=0; i<data_lengh; i++){
							if(checkkey === true && _this.selectedkey.includes(data_arr[i][String(_this.settings['arrayInKey'])])){
								if(data_arr[i][String(_this.settings['arrayInImage'])]){
									more_detail_li += "<li id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' class='img' name='"+data_arr[i][String(_this.settings['arrayInValue'])]+"' style='background-image:url("+data_arr[i][String(_this.settings['arrayInImage'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</li>";
								}else{
									more_detail_li += "<li id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' class='nonimg' name='"+data_arr[i][String(_this.settings['arrayInValue'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</li>";
								}
							}else if(checkkey === false && _this.selectedval.includes(data_arr[i][String(_this.settings['arrayInValue'])])){
								if(data_arr[i][String(_this.settings['arrayInImage'])]){
									more_detail_li += "<li id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' class='img' name='"+data_arr[i][String(_this.settings['arrayInValue'])]+"' style='background-image:url("+data_arr[i][String(_this.settings['arrayInImage'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</li>";
								}else{
									more_detail_li += "<li id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' class='nonimg' name='"+data_arr[i][String(_this.settings['arrayInValue'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</li>";
								}
								
							}else{
								if(data_arr[i][String(_this.settings['arrayInImage'])]){
									more_detail_li += "<li id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' class='img' style='background-image:url("+data_arr[i][String(_this.settings['arrayInImage'])]+"' name='"+data_arr[i][String(_this.settings['arrayInValue'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</li>";
								}else{
									more_detail_li += "<li id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' class='nonimg' name='"+data_arr[i][String(_this.settings['arrayInValue'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</li>";
								}
							}
						}
					}else{
						if(multiple){
							for(let i=0; i<data_lengh; i++){
								if(checkkey === true && _this.selectedkey.includes(data_arr[i][String(_this.settings['arrayInKey'])])){
									more_detail_li += "<li><input type='checkbox' name='"+id+"' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' checked /><label for='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</label></li>";
								}else if(checkkey === false && _this.selectedval.includes(data_arr[i][String(_this.settings['arrayInValue'])])){
									more_detail_li += "<li><input type='checkbox' name='"+id+"' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' checked /><label for='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</label></li>";
								}else{
									more_detail_li += "<li><input type='checkbox' name='"+id+"' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' /><label for='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</label></li>";
								}
							}
						}else{
							for(let i=0; i<data_lengh; i++){
								if(checkkey === true && _this.selectedkey.includes(data_arr[i][String(_this.settings['arrayInKey'])])){
									more_detail_li += "<li><input type='radio' name='"+id+"' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' checked /><label for='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</label></li>";
								}else if(checkkey === false && _this.selectedval.includes(data_arr[i][String(_this.settings['arrayInValue'])])){
									more_detail_li += "<li><input type='radio' name='"+id+"' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' checked /><label for='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</label></li>";
								}else{
									more_detail_li += "<li><input type='radio' name='"+id+"' id='"+data_arr[i][String(_this.settings['arrayInKey'])]+"' /><label for='"+data_arr[i][String(_this.settings['arrayInKey'])]+"'>"+data_arr[i][String(_this.settings['arrayInValue'])]+"</label></li>";
								}
							}
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
			let _this = this;
			$(document).on('click.cocoAjaxMultiSelect',"#"+this.$element.attr('id')+"[type='cocoAjaxMultiSelect']",function(event){
				event.stopImmediatePropagation();
				event.stopPropagation();
				let focus = $(this).attr('focus');
				let id = $(this).attr('id');
				let multiple = $(this).attr('multiple');
				if(multiple === 'multiple'){
					multiple = true;
				}else{
					multiple = false;
				}
				let value = $(this).val();
				
				let force_key = false;
				if(this.hasAttribute('force_selected_key')){
					force_key = $(this).attr('force_selected_key');
				}
				if(typeof focus == 'undefined' || focus == null || focus == ''){
					//닫힌상태에서 열기
					$(this).attr('autocomplete','off');
					$(this).val('');//입력값 초기화 > 검색어를 입력할 수 있도록
					$(this).removeAttr('readonly');//키보드입력가능하게
					$(this).attr('focus', 'on'); //검색아이콘으로 변경
					
					if(force_key){
						_this.selectedkey = force_key.split(',');
						_this.selectedval = value.split(',');
						if(_this.selectedkey.length !== _this.selectedval.length){
							alert('ERROR! force_selected_key의 갯수와 value값의 갯수가 다릅니다.'); 
							throw "stop"; 
						}
						for(let i=0; i<_this.selectedkey.length; i++){
							_this.settings['ajaxCode'](_this.selectedval[i], 1, 1, _this.selectedkey[i]).then((data)=>{
								if(typeof(_this.selectedArray) === 'undefined'){
									_this.selectedArray = new Array();
								}
								if(data.length > 0){
									for(let d=0; d<data.length; d++){
										_this.selectedArray[data[d][String(_this.settings['arrayInKey'])]] = data[d][String(_this.settings['arrayInValue'])];
									}
								}
							});
						}
					}else{
						if(value !== ''){
							_this.selectedval = value.split(',');
							for(let i=0; i<_this.selectedval.length; i++){
								_this.settings['ajaxCode'](_this.selectedval[i], 1, 1).then((data)=>{
									if(typeof(_this.selectedArray) === 'undefined'){
										_this.selectedArray = new Array();
									}
									if(data.length > 0){
										for(let d=0; d<data.length; d++){
											_this.selectedArray[data[d][String(_this.settings['arrayInKey'])]] = data[d][String(_this.settings['arrayInValue'])];
										}
									}
								});
							}
						}else{
							_this.selectedval = new Array();
							_this.selectedkey = new Array();
							_this.selectedArray = new Array();
						}
					}
					
					
					_this.settings['ajaxCode'](searchtext, page, _this.settings['pageUnit']).then((data)=>{
						//$('body').prepend("<div for='"+id+"' class='ajaxselect_over'></div>");
						$("#"+id+"[type='cocoAjaxMultiSelect']").val(searchtext);
						
						let scrollHeight = Math.max(
							document.body.scrollHeight, document.documentElement.scrollHeight,
							document.body.offsetHeight, document.documentElement.offsetHeight,
							document.body.clientHeight, document.documentElement.clientHeight
						);
						let overheight = scrollHeight + document.documentElement.scrollHeight - document.documentElement.clientHeight;
						
						//$("label[for='"+id+"'][ajaxselect_label]").after("<div for='"+id+"' class='ajaxselect_over' style='height:"+overheight+"px;'></div>");
						$("#"+id+"[type='cocoAjaxMultiSelect']").before("<div for='"+id+"' class='ajaxselect_over' style='height:"+overheight+"px;'></div>");
						//setTimeout(() => $("#"+id+"[type='cocoAjaxMultiSelect']").focus(), 100);
						
						_this.detailshow(id, data, multiple, $(this).outerWidth()-30, $(this).position().top+32, $(this).position().left);

						if(data){
							if(data.length >= _this.settings['pageUnit']){
								canScrollAjax = true;
							}else{
								canScrollAjax = false;
							}
						}else{
							canScrollAjax = false;
						}
						
					});
				}else{
					
				}
			});
			
		},
		
		//다른영역을 클릭하면 select화면이 나타나지 않음
		closeListener:function(){
			let multiple = this.$element.attr('multiple');
			let _this = this;
			$(document).on('click.cocoAjaxMultiSelect',".ajaxselect_over[for='"+this.$element.attr('id')+"']",function(event){
				event.stopImmediatePropagation();
				event.stopPropagation();
				let overfor = $(this).attr('for');
				if(typeof overfor != 'undefined' && overfor != null && overfor != ''){
					let values = '';
					let keys = '';
					
					if(_this.selectedval !== undefined && _this.selectedkey !== undefined){
						//모달창을 제대로 닫을때
						for(let i=0; i<_this.selectedval.length; i++){
							values += _this.selectedval[i];
							if(i < _this.selectedval.length - 1){
								values += ',';
							}
						}
						for(let i=0; i<_this.selectedkey.length; i++){
							keys += _this.selectedkey[i];
							if(i < _this.selectedkey.length - 1){
								keys += ',';
							}
						}
						
						$("#"+String(overfor)+"[type='cocoAjaxMultiSelect']").val(values).promise().done(function(){
							if($("#"+String(overfor)+"[type='cocoAjaxMultiSelect']").is('[force_selected_key]')){
								$("#"+String(overfor)+"[type='cocoAjaxMultiSelect']").attr('force_selected_key', keys).promise().done(function(){
									_this.settings['blurCode'](_this.selectedArray, _this);
								});
							}else{
								_this.settings['blurCode'](_this.selectedArray, _this);
							}
							
						});
						
						if(multiple === 'multiple'){
							if(_this.selectedval.length > 0){
								$("s[for='"+overfor+"']").text(_this.selectedval.length);
								$("s[for='"+overfor+"']").show();
							}else{
								$("s[for='"+overfor+"']").hide();
							}
						}else{
							$("s[for='"+overfor+"']").hide();
						}
					}else{
						//모달창을 제대로 닫지 않고 SPA로 페이지이동 발생시
						//$(".ajaxselect_detail[for='"+overfor+"']")
						
						$("s[for='"+overfor+"']").hide();
					}
					
					$("input[type='cocoAjaxMultiSelect']").removeAttr('focus');
					//$("input[type='cocoAjaxMultiSelect']").attr('readonly',true);
					$(".ajaxselect_detail[for='"+overfor+"']").remove();
					$(".ajaxselect_over[for='"+overfor+"']").remove();
					
				}
				page = 1;
				canScrollAjax = true;
				$(this).remove();
			});
		},
		
		//키보드입력시
		inputListener:function(){
			let _this = this;
			let inputReg = new RegExp(this.settings['regularExpression'], 'g');
			//엔터키 감지용
			$(document).on('keypress.cocoAjaxMultiSelect',"#"+this.$element.attr('id')+"[type='cocoAjaxMultiSelect']",function(e){
				e.stopImmediatePropagation();
				e.stopPropagation();
				if(e.keyCode == 13){
					if(termTimeout != null){
						clearTimeout(termTimeout); 
					}
					page = 1;
					let focus = $(this).attr('focus');
					let id = $(this).attr('id');
					let multiple = $(this).attr('multiple');
					if(multiple === 'multiple'){
						multiple = true;
					}else{
						multiple = false;
					}
					if(focus == 'on'){
						_this.settings['ajaxCode']($(this).val(), page, _this.settings['pageUnit']).then((data)=>{
							searchtext = $(this).val();
							_this.detailshow(id, data, multiple, $(this).outerWidth()-30, $(this).position().top+32, $(this).position().left);
	
							if(data){
								if(data.length >= _this.settings['pageUnit']){
									canScrollAjax = true;
								}else{
									canScrollAjax = false;
								}
							}else{
								canScrollAjax = false;
							}
							
						});
					}
				}
			});
			$(document).on('input.cocoAjaxMultiSelect',"#"+this.$element.attr('id')+"[type='cocoAjaxMultiSelect']",function(event){
				event.stopImmediatePropagation();
				event.stopPropagation();
				page = 1;
				let focus = $(this).attr('focus');
				let id = $(this).attr('id');
				let multiple = $(this).attr('multiple');
				if(multiple === 'multiple'){
					multiple = true;
				}else{
					multiple = false;
				}
				if(focus == 'on'){
					if(termTimeout != null){
						clearTimeout(termTimeout); 
						termTimeout = null;
					}
					var keypromise = new Promise((resolve, reject) => {
						if(inputReg.test($(this).val()) || $(this).val() == ''){
							termTimeout = setTimeout(function(){
								resolve();
							}, _this.settings['delay']);
						}else{
							reject();
						}
					});
					
					keypromise.then(()=>{
						_this.settings['ajaxCode']($(this).val(), page, _this.settings['pageUnit']).then((data)=>{
							searchtext = $(this).val();
							_this.detailshow(id, data, multiple, $(this).outerWidth()-30, $(this).position().top+32, $(this).position().left);
			
							
							if(data){
								if(data.length >= _this.settings['pageUnit']){
									canScrollAjax = true;
								}else{
									canScrollAjax = false;
								}
							}else{
								canScrollAjax = false;
							}
							
						});
					}).catch(function(err){
						if(termTimeout != null){
							clearTimeout(termTimeout); 
							termTimeout = null;
						}
						canScrollAjax = true;
					});
						
				}else{
					//열고 닫힌뒤 키보드입력시 입력막기
					if(termTimeout != null){
						clearTimeout(termTimeout); 
						termTimeout = null;
					}
					if(event.keyCode != ''){
						event.returnValue = false;
					}
					canScrollAjax = true;
					//$(this).blur();
				}
			});
		},
		
		//select화면을 선택해도 포커스를 강제하기
		holdonFocus:function(){
			$(document).on('blur.cocoAjaxMultiSelect',"#"+this.$element.attr('id')+"[type='cocoAjaxMultiSelect']",function(event){
				event.stopImmediatePropagation();
				event.stopPropagation();
				if($(this).attr('focus') == 'on'){
					$(this).focus();
				}
			});
		},
		
		
		
		//select하단에서 체크박스 선택시
		checkboxControl:function(){
			let _this = this;
			let multiple = this.$element.attr('multiple');
			if(_this.settings['arrayInImage']){
				$(document).on('click.cocoAjaxMultiSelect',".ajaxselect_detail[for='"+this.$element.attr('id')+"'] li",function(event){
					event.stopImmediatePropagation();
					event.stopPropagation();
					let __this = _this;
					let value = $(this).attr('name');
					let key = $(this).attr('id');
					this.selectedkey = new Array(key);
					this.selectedval = new Array(value);
					this.selectedArray = new Array();
					this.selectedArray[key] = value;
					_this.settings['checkedCode'](this.selectedArray, __this);
					
					let overfor = $(this).parent().attr('for');
					if(typeof overfor != 'undefined' && overfor != null && overfor != ''){
						let values = '';
						let keys = '';
						
						if(__this.selectedval !== undefined && __this.selectedkey !== undefined){
							//모달창을 제대로 닫을때
							for(let i=0; i<__this.selectedval.length; i++){
								values += __this.selectedval[i];
								if(i < __this.selectedval.length - 1){
									values += ',';
								}
							}
							for(let i=0; i<__this.selectedkey.length; i++){
								keys += __this.selectedkey[i];
								if(i < __this.selectedkey.length - 1){
									keys += ',';
								}
							}
							$("#"+String(overfor)+"[type='cocoAjaxMultiSelect']").val(values).promise().done(function(){
								if($("#"+String(overfor)+"[type='cocoAjaxMultiSelect']").is('[force_selected_key]')){
									$("#"+String(overfor)+"[type='cocoAjaxMultiSelect']").attr('force_selected_key', keys).promise().done(function(){
										_this.settings['blurCode'](__this.selectedArray, _this);
									});
								}else{
									_this.settings['blurCode'](__this.selectedArray, _this);
								}
								
							});
							
							
						}else{
							$("s[for='"+overfor+"']").hide();
						}
						
						$("input[type='cocoAjaxMultiSelect']").removeAttr('focus');
						//$("input[type='cocoAjaxMultiSelect']").attr('readonly',true);
						$(".ajaxselect_detail[for='"+overfor+"']").remove();
						$(".ajaxselect_over[for='"+overfor+"']").remove();
						
					}
					page = 1;
					canScrollAjax = true;
					$(this).parent().remove();
				});
			}else{
				$(document).on('change.cocoAjaxMultiSelect',".ajaxselect_detail[for='"+this.$element.attr('id')+"'] input",function(event){
					event.stopImmediatePropagation();
					event.stopPropagation();
					let __this = _this;
					let value = $(this).next('label').text();
					let key = $(this).attr('id');
					let overfor = $(this).parent().attr('for');
					if($(this).is(":checked")){
						if(multiple){
							__this.selectedkey.push(key);
							__this.selectedval.push(value);
							__this.selectedArray[key] = value;
						}else{
							__this.selectedkey = new Array(key);
							__this.selectedval = new Array(value);
							__this.selectedArray = new Array();
							__this.selectedArray[key] = value;
							
						
							
						}
						
					}else{
						if(multiple){
							if(__this.selectedArray[key]){
								__this.selectedkey.splice(__this.selectedkey.indexOf(key), 1);
								__this.selectedval.splice(__this.selectedval.indexOf(value), 1);
								delete __this.selectedArray[key];
							}
						}
					}
					_this.settings['checkedCode'](__this.selectedArray, __this);
					
					if(!multiple){
						$(".ajaxselect_over[for='"+_this.$element.attr('id')+"']").click();
						
					}
				});
			}
			
		},
		
		//검색버튼
		searchBtn:function(){
			let _this = this;
			
			page = 1;
			$(document).on('click.cocoAjaxMultiSelect',"label[for='"+this.$element.attr('id')+"']",function(event){
				let focus = $(_this.element).attr('focus');
				let id = $(_this.element).attr('id');
				let multiple = $(_this.element).attr('multiple');
				if(multiple === 'multiple'){
					multiple = true;
				}else{
					multiple = false;
				}
				let searchtext = $(_this.element).val();
				if(focus === 'on'){
					_this.settings['ajaxCode'](searchtext, page, _this.settings['pageUnit']).then((data)=>{
						
						_this.detailshow(id, data, multiple, $(_this.element).outerWidth()-30, $(_this.element).position().top+32, $(_this.element).position().left);
				
						if(data){
							if(data.length >= _this.settings['pageUnit']){
								canScrollAjax = true;
							}else{
								canScrollAjax = false;
							}
						}else{
							canScrollAjax = false;
						}
						
					});
				}
			});
		}
		
		
		
		
	});
	
	
	//함수실행@@
	$.fn[ pluginName ] = function(options){
		return this.each(function() {
			if(!$.data(this, pluginName)){
				$.data(this, pluginName, new cocoAjaxMultiSelect(this, options));
			}
		});
	};
})(jQuery, window, document);
