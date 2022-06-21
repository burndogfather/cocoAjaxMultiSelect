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
  
1. ```<head>``` 태그안에 아래의 코드를 붙입니다.
```html
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/xeicon@2.3.3/xeicon.min.css'>
<link rel='stylesheet' href='https://cdn.jsdelivr.net/gh/squarehacker/cocoAjaxMultiSelect/src/cocoAjaxMultiSelect.css'>
<script src='https://code.jquery.com/jquery-3.5.1.min.js'></script>
<script src='https://cdn.jsdelivr.net/gh/squarehacker/cocoAjaxMultiSelect/src/cocoAjaxMultiSelect.min.js'></script>
```
  
  ---
  
2. ```html``` 코드상에 아래코드를 입력합니다.
```html
<input id='test' type='cocoAjaxMultiSelect' value='가을,바다,태양,요셉' placeholder='여러명의 이름을 선택' multiple/>
```
- id를 반드시 등록해야 라이브러리가 정상적으로 매핑됨
- type은 cocoAjaxMultiSelect
- value에는 미리 선택되어야할 값을 넣거나 불필요하다면 value를 사용하지 않습니다.
- 단일선택시 multiple 삭제 / 다중선택시 multiple 추가

3. ```javascript``` 코드상에 아래코드를 입력합니다.
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
