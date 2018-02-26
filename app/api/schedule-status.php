<?php
function read_file($fname, $default){
	$x = $default;
	if($myfile = fopen($fname, "r")){
		$x = fgets($myfile);
		fclose($myfile);
	}
	return trim($x);
}
function write_file($fname, $x){
	$myfile = fopen($fname, "w") or die("Unable to open file!");
	fwrite($myfile, $x);
	fclose($myfile);
}
if ($_SERVER['REQUEST_METHOD']=='GET'){
	$data = ['schedule_status'=>intval(read_file("/var/run/schedule-status.txt",0))];
	header('Content-Type: application/json');
	echo json_encode($data);
}else{
	$data = json_decode(file_get_contents('php://input'), true);
	if( $data['schedule_status'] == 0 || $data['schedule_status'] == 1){
		write_file("/var/run/schedule-status.txt",$data['schedule_status']);
	}
}
?>
