<?php
	header('Content-Type: application/json; charset=UTF-8');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

	$dbconn = mysqli_connect('db','git.coco','password','git.coco', '3306');
	//데이터베이스 아이피, 데이터베이스 이름, 데이터베이스 패스워드, 데이터베이스명, 포트번호

	//fetch받기
	$fetchdata = json_decode(file_get_contents('php://input'),true);
	foreach($fetchdata as $key => $value){
		$_POST[$key] = $value;
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
	
	$sql = "SELECT sid,username FROM cocoajaxmultiselect";
	if($searchtxt){
		$sql .= " WHERE username LIKE '%".$searchtxt."%'";
	}
	if($page != -1 && $pagging != -1){
		$page = ( $page - 1 ) * $pagging;
		$sql .= " LIMIT ".$page.", ".$pagging." ";
	}
	
	$output = array();
	$query = mysqli_query($dbconn,$sql);
	while($result = mysqli_fetch_array($query)){
		array_push($output, array('sid'=>$result['sid'], 'username'=>$result['username']));
	}
	echo json_encode($output);
?>