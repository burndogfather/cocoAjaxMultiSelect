<?php
	header('Content-Type: application/json; charset=UTF-8');
	header('Access-Control-Allow-Origin: *');
	
	//fetch데이터가 있을경우 POST로 전달
	$fetchdata = json_decode(file_get_contents('php://input'),true);
	if(is_array($fetchdata)){
		foreach($fetchdata as $key => $value){
			$_POST[$key] = $value;
		}
	}
	
	//POST 입력값 searchtext, page, pagging
	if(isset($_POST['username'])){
		$searchtxt = $_POST['username'];
	}else{
		$searchtxt = false;
	}
	if(isset($_POST['page']) && isset($_POST['pagging'])){
		$page = $_POST['page'];
		$pagging = $_POST['pagging'];
	}else{
		$page = -1;
		$pagging = -1;
	}
	
	//쿼리만들기
	$sql = "SELECT sid,username FROM cocoajaxmultiselect";
	if($searchtxt){
		$sql .= " WHERE username LIKE '%".$searchtxt."%'";
	}
	if($page != -1 && $pagging != -1){
		$page = ( $page - 1 ) * $pagging;
		$sql .= " LIMIT ".$page.", ".$pagging." ";
	}
	
	//데이터베이스 연결 및 쿼리
	$dbconn = mysqli_connect('db.sqs.kr','git.coco','password','git.coco', '3306');
	//데이터베이스 아이피, 데이터베이스 이름, 데이터베이스 패스워드, 데이터베이스명, 포트번호
	$query = mysqli_query($dbconn,$sql);
	
	//key-value의 2차원 형태의 배열로 재정렬
	$output = array();
	while($result = mysqli_fetch_array($query)){
		array_push($output, array('sid'=>$result['sid'], 'username'=>$result['username']));
	}
	
	//JSON형태로 출력
	echo json_encode($output);
?>