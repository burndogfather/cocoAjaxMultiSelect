# cocoAjaxMultiSelect  
  
Ajax, xhr, fetch등을 이용하여 다중선택창을 만들수 있는 라이브러리입니다.  
  
  
[Ajax 다중선택 데모](https://www.dadolcorp.com/cocoajaxmultiselect/example/example-jquery-multi.html)  
[Ajax 다중선택 코드보기](https://github.com/squarehacker/cocoAjaxMultiSelect/blob/main/example/example-jquery-multi.html)  
  
[Ajax 단일선택 데모](https://www.dadolcorp.com/cocoajaxmultiselect/example/example-jquery.html)  
[Ajax 단일선택 코드보기](https://github.com/squarehacker/cocoAjaxMultiSelect/blob/main/example/example-jquery.html)  
  
[xhr 다중선택 데모](https://www.dadolcorp.com/cocoajaxmultiselect/example/example-xhr-multi.html)  
[xhr 다중선택 코드보기](https://github.com/squarehacker/cocoAjaxMultiSelect/blob/main/example/example-xhr-multi.html)  
  
[xhr 단일선택 데모](https://www.dadolcorp.com/cocoajaxmultiselect/example/example-xhr.html)  
[xhr 단일선택 코드보기](https://github.com/squarehacker/cocoAjaxMultiSelect/blob/main/example/example-xhr.html)  
  
[fetch 다중선택 데모](https://www.dadolcorp.com/cocoajaxmultiselect/example/example-fetch-multi.html)  
[fetch 다중선택 코드보기](https://github.com/squarehacker/cocoAjaxMultiSelect/blob/main/example/example-fetch-multi.html)  
  
[fetch 단일선택 데모](https://www.dadolcorp.com/cocoajaxmultiselect/example/example-fetch.html)  
[fetch 단일선택 코드보기](https://github.com/squarehacker/cocoAjaxMultiSelect/blob/main/example/example-fetch.html)  
  
[미리선택된 다중선택 데모](https://www.dadolcorp.com/cocoajaxmultiselect/example/example-is-value.html)  
[미리선택된 다중선택 코드보기](https://github.com/squarehacker/cocoAjaxMultiSelect/blob/main/example/example-is-value.html)  
   
   
   
------  
  
  
  
### 주요기능  
  
- ```<input/>``` 태그만 사용
- 검색기능 지원
- 무한스크롤방식의 페이징 지원
- 호출-응답 커스텀 가능
- 콜백코드 커스텀 가능
- 사전선택 값 설정가능  
  
  
  
  
------  
  
  
  
### 다음의 라이브러리가 필요합니다.  
  
> 필요한 라이브러리  
> - jQuery 3.5.1 이상 : 본 라이브러리 동작을 위해 종속적으로 필요로 합니다.  
> - XEIcon : 아이콘호출을 위해 사용합니다.  
>  
>```html
><script src='https://code.jquery.com/jquery-3.5.1.min.js'></script>  
><link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/xeicon@2.3.3/xeicon.min.css'>  
>```
  
  
  
------  
  
  
  
# 시작하기
  
### 1. ```<head>``` 태그안에 아래의 코드를 붙입니다.
```html
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<!-- UTF-8언어셋 지정 -->
<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/xeicon@2.3.3/xeicon.min.css'>
<!-- XEIcon 아이콘 라이브러리 -->
<link rel='stylesheet' href='https://cdn.jsdelivr.net/gh/squarehacker/cocoAjaxMultiSelect/src/cocoAjaxMultiSelect.css'>
<!-- cocoAjaxMultiSelect CSS -->
<script src='https://code.jquery.com/jquery-3.5.1.min.js'></script>
<!-- jQuery 3.5.1~ -->
<script src='https://cdn.jsdelivr.net/gh/squarehacker/cocoAjaxMultiSelect/src/cocoAjaxMultiSelect.min.js'></script>
<!-- cocoAjaxMultiSelect JS -->
```
  
  
### 2. ```html``` 코드상에 아래코드를 입력합니다.
```html
<input id='test' type='cocoAjaxMultiSelect' value='가을,바다,태양,요셉' placeholder='여러명의 이름을 선택' multiple/>
<!--
   <input type='cocoAjaxMultiSelect' /> 으로 사용
   type : 'cocoAjaxMultiSelect' (필수)
   value : 사전에 선택될 항목을 쉼표로 구분하여 입력 (선택)
   placeholder : 미입력된 화면에서 보여줄 text (선택)
   multiple : 다중선택시 필요 / 미입력시 단일선택으로 적용됨 (선택)
-->
```

### 3. ```javascript``` 코드상에 아래코드를 입력합니다.
```javascript
$('#test').cocoAjaxMultiSelect({
    ajaxCode: function(input, page, pagging){
        return new Promise(function(resolve, reject) {
            $.ajax({
                url:'https://www.dadolcorp.com/cocoajaxmultiselect/example/json.php',
                type:'POST',
                async:false,
                dataType:'json',
                data:{username:input,page:page,pagging:pagging},
                error:function(request,status,error){
                    reject(request);
                }
            }).done(function(data){
                resolve(data);
            });
        });
    },
    checkedCode:function(selectValue){
        console.log(selectValue);
    },
    arrayInKey:'sid',
    arrayInValue:'username',
    regularExpression:'(.*?)',
    delay:600,
    pageUnit:10,
    scrollLeftLoad:100,
    height:300
});
```
