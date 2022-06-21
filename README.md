# cocoAjaxMultiSelect  
  
Ajax, xhr, fetch등을 이용하여 다중선택창을 만들수 있는 라이브러리입니다.  
  
![작동예시](https://user-images.githubusercontent.com/101985768/174756567-a6b35130-d20b-457f-8197-24222906fcb2.gif)  


### 주요기능  
  
- ```<input/>``` 태그만 사용
- 검색기능 지원
- 무한스크롤방식의 페이징 지원
- 호출-응답 커스텀 가능
- 콜백코드 커스텀 가능
- 사전선택 값 설정가능  
  
  
------  

### 데모  

/example 에 데모를 코드와 샘플 데이터베이스도 있어요!😻
  
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

<!-- UTF-8언어셋 지정 -->
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  
<!-- 종속 라이브러리 -->
<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/xeicon@2.3.3/xeicon.min.css'>
<link rel='stylesheet' href='https://cdn.jsdelivr.net/gh/squarehacker/cocoAjaxMultiSelect/src/cocoAjaxMultiSelect.css'>
  
<!-- cocoAjaxMultiSelect 라이브러리 -->
<script src='https://code.jquery.com/jquery-3.5.1.min.js'></script>
<script src='https://cdn.jsdelivr.net/gh/squarehacker/cocoAjaxMultiSelect/src/cocoAjaxMultiSelect.min.js'></script>

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
    regularExpression:'[a-z|A-Z|가-힣| ]{2,}',
    delay:600,
    pageUnit:10,
    scrollLeftLoad:100,
    height:300
});


/**
    ajaxCode : 선택창클릭, 키보드입력, 엔터키에 매핑되어 보여줄 데이터를 처리하는 코드 (동기작업 필수)
        - input : 검색창에 입력된 값
        - page : 현재페이지 값 (1페이지부터 ++)
        - pagging : 페이징단위 값
        - reject() : ajaxCode내에서 요청실패처리
        - resolve(json데이터) : ajaxCode내에서 요청성공에 대한 동기처리
        
    checkedCode : 사용자가 선택항목을 변경시 마다 실행되는 코드
        - selectValue : 사용자가 선택한 항목들의 배열 값
    
    arrayInKey : resolve(json데이터)에 입력되는 ajax결과배열의 key 값 (사용자에게 보여지지 않음)
    arrayInValue : resolve(json데이터)에 입력되는 ajax결과배열의 value 값 (사용자에게 보여짐)
    regularExpression : ajax조회하는 검색어의 정규식 조건
    delay : 잦은호출을 방지하기 위해 키보드입력시 ajax조회 지연시간
    pageUnit : 한페이지에 보여질 데이터수
    scrollLeftLoad : 다음페이지로 추가호출할 스크롤길이
    height : 선택창의 높이
**/
```
