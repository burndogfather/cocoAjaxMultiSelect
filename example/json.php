<?php
	header('Content-Type: application/json; charset=UTF-8');
	header('Access-Control-Allow-Origin: *');
	//데이터베이스정보를 수정하여 테스트해주세요
	//데이터베이스는 testdb.sql 파일을 이용하실 수 있습니다.
	$dbconn = mysqli_connect('127.0.0.1','db_id','db_pw','db_name', '3306');

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
	
	$query = mysqli_query($dbconn,$sql);
	
	$output = array();
	while($result = mysqli_fetch_array($query)){
		array_push($output, array('sid'=>$result['sid'], 'username'=>$result['username']));
	}
	echo json_encode($output);
?>