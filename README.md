# cocoAjaxMultiSelect  
<img src='https://img.shields.io/github/languages/code-size/squarehacker/cocoAjaxMultiSelect' />
   
Ajax, xhr, fetch등을 이용하여 검색+페이징+다중 선택창을 쉽게 만들수 있는 라이브러리입니다👍  
검색창이나 서브데이터를 불러와야하는 화면에서 편리하게 이용할 수 있어요!
   
![작동예시](https://user-images.githubusercontent.com/101985768/174756567-a6b35130-d20b-457f-8197-24222906fcb2.gif)  
  
### 주요기능  
  
- ```<input/>``` 태그만으로 이용
- 검색기능 지원
- 무한스크롤방식의 페이징 지원
- 호출-응답 커스텀 가능
- 사용자 선택에 따른 콜백 작성가능
- 사전선택 값 설정가능  
- 키보드입력 지연시간 설정가능
- 키보드입력 정규식조건 설정가능
  
------  

### 데모  

데모코드와 대용량 샘플데이터베이스도 있어요!😻 > [/example](https://github.com/squarehacker/cocoAjaxMultiSelect/tree/main/example)  
  
[Ajax 다중선택 데모](https://git.coco.sqs.kr/cocoAjaxMultiSelect/example/example-jquery-multi.html)  
[Ajax 단일선택 데모](https://git.coco.sqs.kr/cocoAjaxMultiSelect/example/example-jquery.html)  
  
[xhr 다중선택 데모](https://git.coco.sqs.kr/cocoAjaxMultiSelect/example/example-xhr-multi.html)  
[xhr 단일선택 데모](https://git.coco.sqs.kr/cocoAjaxMultiSelect/example/example-xhr.html)  
  
[fetch 다중선택 데모](https://git.coco.sqs.kr/cocoAjaxMultiSelect/example/example-fetch-multi.html)  
[fetch 단일선택 데모](https://git.coco.sqs.kr/cocoAjaxMultiSelect/example/example-fetch.html)  
  
[미리선택된 다중선택 데모](https://git.coco.sqs.kr/cocoAjaxMultiSelect/example/example-is-value.html)  
   
------  
  
  
  
# 시작하기 (1~4단계)  
  
### 1. ```<head>``` 태그안에 아래의 코드를 붙입니다.
```html

<!-- UTF-8언어셋 지정 -->
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  
<!-- 종속 라이브러리 -->
<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/xeicon@2.3.3/xeicon.min.css'>
<script src='https://code.jquery.com/jquery-3.5.1.min.js'></script>

<!-- cocoAjaxMultiSelect 라이브러리 -->
<link rel='stylesheet' href='https://git.coco.sqs.kr/cocoAjaxMultiSelect/src/cocoAjaxMultiSelect.css'>
<script src='https://git.coco.sqs.kr/cocoAjaxMultiSelect/src/cocoAjaxMultiSelect.js'></script>

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
                url:'https://git.coco.sqs.kr/cocoAjaxMultiSelect/example/json.php',
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
    checkedCode:function(selectedArray, _this){
        console.log(selectedArray);
    },
    blurCode:function(selectedArray, _this){
      console.log(selectedArray);
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
        - selectedArray : 사용자가 선택한 항목들의 key-value 형태의 배열
        - _this : 현재의 input태그의 Element  
        
    blurCode : 사용자가 선택후 Select를 닫을때 실행되는 코드
        - selectedArray : 사용자가 선택한 항목들의 key-value 형태의 배열
        - _this : 현재의 input태그의 Element  
    
    arrayInKey : resolve(json데이터)에 입력되는 ajax결과배열의 key 값 (사용자에게 보여지지 않음)
    arrayInValue : resolve(json데이터)에 입력되는 ajax결과배열의 value 값 (사용자에게 보여짐)
    regularExpression : ajax조회하는 검색어의 정규식 조건
    delay : 잦은호출을 방지하기 위해 키보드입력시 ajax조회 지연시간
    pageUnit : 한페이지에 보여질 데이터수
    scrollLeftLoad : 다음페이지로 추가호출할 스크롤길이
    height : 선택창의 높이
**/
```
  
  
### 4. 데이터는 이런형태의 JSON이 반환되어야 합니다.  
```json
/*
  설정값이 다음의 조건이 되어있어야 합니다.
  arrayInKey:'sid',
  arrayInValue:'username'
*/
[
  {
    "sid": "2022062114201723174",
    "username": "가람"
  },
  {
    "sid": "2022062114202055377",
    "username": "가빈"
  },
  {
    "sid": "2022062114201649568",
    "username": "가온"
  },
  {
    "sid": "2022062114201994983",
    "username": "가을"
  },
  {
    "sid": "2022062114201757668",
    "username": "강"
  },
  {
    "sid": "2022062114201635586",
    "username": "강민"
  },
  {
    "sid": "2022062114201878478",
    "username": "강빈"
  },
  {
    "sid": "2022062114201887455",
    "username": "강산"
  },
  {
    "sid": "2022062114201696158",
    "username": "강우"
  },
  {
    "sid": "2022062114201922411",
    "username": "강유"
  }
]
```


<<<<<<< HEAD
=======

>>>>>>> 5079795cbc77e3cac6942808088b006f690f4492
------ 

### 새로운기능 
  
- Ajax 검색결과를 이미지형태로도 제공할 수 있습니다. (arrayInImage 옵션추가)
<img src="https://user-images.githubusercontent.com/115865056/196459743-d56e1f08-1b43-4e2b-84d7-c9e636ba6a59.png">


