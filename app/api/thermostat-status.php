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
// TODO: data sanity checks
	$data = ['temp'=>read_file("/tmp/current-temp.txt","0"), 'set_temp'=>read_file("/tmp/set-temp.txt","41"), 'relay'=>read_file("/tmp/relay-state.txt","off")];
	header('Content-Type: application/json');
	echo json_encode($data);
}else{
	$data = json_decode(file_get_contents('php://input'), true);
	if( $data['set_temp'] > 40 && $data['set_temp'] < 90){
		write_file("/tmp/set-temp.txt",$data['set_temp']);
	}
}
?>
