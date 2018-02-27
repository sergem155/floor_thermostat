<?php
function read_file($fname, $default){
	$x = $default;
	if($myfile = fopen($fname, "r")){
		$x = fread($myfile,10000);
		fclose($myfile);
	}
	return trim($x);
}

function write_file($fname, $x){
	$myfile = fopen($fname, "w") or die("Unable to open file!");
	fwrite($myfile, $x);
	fclose($myfile);
}

// loads crontab, tries to match on/off lines, throws away the rest
function load_schedules(){
	$schedules = array();
	exec('crontab -l',$output);
	//$output=read_file("/run/lock/crontab-init.txt",''); // test file instead of loading live crontab
	//$output=explode("\n", $output);
	foreach($output as $line){
		$line=trim($line);
		if(!strpos($line,'#')){
			#echo $line;
			if(preg_match('/^(\*|[\d,]+)\s(\*|[\d,]+)\s(\*|[\d,]+)\s(\*|[\d,]+)\s(\*|[\d,]+)\s\/home\/pi\/settemp.sh\s(\d+)$/m',$line,$matches)){
				#var_dump($matches);
				$schedule = array();
				$schedule['minute']=$matches[1];
				$schedule['hour']=$matches[2];
				$schedule['time']=sprintf("%02d:%02d",$matches[2],$matches[1]);
				$schedule['temp']=$matches[6];
				if(!strpos($matches[5],',')){
					$schedule['days_of_week']=array(0,1,2,3,4,5,6);
					$schedule['days_key']=$matches[5];
				}else{
					$schedule['days_of_week']=explode(',',$matches[5]);
					asort($schedule['days_of_week'],SORT_NUMERIC);
					$schedule['days_key']=implode(',',$schedule['days_of_week']);
					if($schedule['days_key']=='0,1,2,3,4,5,6'){
						$schedule['days_key']='*';
					}
				}
				#var_dump($schedule);			
				if(!array_key_exists($schedule['days_key'],$schedules)){
					$schedules[$schedule['days_key']]=array();
				}
				$schedules[$schedule['days_key']][$schedule['time']]=$schedule;
			}
		}
	}
	ksort($schedules);
	foreach(array_keys($schedules) as $key)
		ksort($schedules[$key]);
	// pair the schedules
	$paired_schedules=array();
	foreach($schedules as $days){
		$last = false;
		foreach(array_keys($days) as $time){
			if($last==false){
				$last=$days[$time];
			}else{
				if($last['time']<$days[$time]['time'] && $last['temp']>$days[$time]['temp']){
					array_push($paired_schedules,
						array('minute1'=>intval($last['minute']),
						'hour1'=>intval($last['hour']),
						'temp1'=>intval($last['temp']),
						'minute2'=>intval($days[$time]['minute']),
						'hour2'=>intval($days[$time]['hour']),
						'temp2'=>intval($days[$time]['temp']),
						'days'=>array_values($last['days_of_week']),
						'scheduleId'=>$days[$time]['days_key'].'-'.$last['time'].'-'.$days[$time]['time']
						));
				}else{
					$last=$days[$time];
				}			
			}
		}
	}
	return $paired_schedules;
}

if ($_SERVER['REQUEST_METHOD']=='GET'){
	$item = FALSE;
	if(isset($_REQUEST['item']) && !empty($_REQUEST['item']) && $_REQUEST['item']!='list'){
		$item = $_REQUEST['item'];
	}
	$paired_schedules=load_schedules();
	header('Content-Type: application/json');
	if($item){ // getting specific item
		$schedule_item = array();
		foreach($paired_schedules as $struct) {
			if ($item == $struct['scheduleId']) {
				$schedule_item = $struct;
				break;
			}
		}
		echo json_encode($schedule_item);
	}else{ // getting list of things
		echo json_encode($paired_schedules);
	}
}elseif($_SERVER['REQUEST_METHOD']=='POST'){ // saving complete crontab
	// load crontab
	$paired_schedules=load_schedules();
	$data = json_decode(file_get_contents('php://input'), true);
	// delete entry if replacing
	foreach($paired_schedules as $key => $struct) {
		if ($data['scheduleId'] == $struct['scheduleId']) {
			unset($paired_schedules[$key]);
		}
	}
	// insert entry
	array_push($paired_schedules,$data);
	// render complete crontab
	$crontab = "";
	foreach($paired_schedules as $struct) {
		extract($struct);
		$crontab .= "$minute1 $hour1 * * ".implode(',',$days)." /home/pi/settemp.sh $temp1\n"
			."$minute2 $hour2 * * ".implode(',',$days)." /home/pi/settemp.sh $temp2\n";
	}
	// install updated crontab
	write_file("/run/lock/crontab.txt",$crontab);
	exec('crontab /run/lock/crontab.txt');
	unlink("/run/lock/crontab.txt");
}elseif($_SERVER['REQUEST_METHOD']=='DELETE'){ // delete item, save complete crontab
	$item = FALSE;
	if(isset($_REQUEST['item']) && !empty($_REQUEST['item']) && $_REQUEST['item']!='list'){
		$item = $_REQUEST['item'];
	}
	if(!$item) die;
	// load crontab
	$paired_schedules=load_schedules();
	// delete entry if replacing
	foreach($paired_schedules as $key => $struct) {
		if ($item == $struct['scheduleId']) {
			unset($paired_schedules[$key]);
		}
	}
	// render complete crontab
	$crontab = "";
	foreach($paired_schedules as $struct) {
		extract($struct);
		$crontab .= "$minute1 $hour1 * * ".implode(',',$days)." /home/pi/settemp.sh $temp1\n"
			."$minute2 $hour2 * * ".implode(',',$days)." /home/pi/settemp.sh $temp2\n";
	}
	// install updated crontab
	write_file("/run/lock/crontab.txt",$crontab);
	exec('crontab /run/lock/crontab.txt');
	unlink("/run/lock/crontab.txt");
}else{
	// do nothing
}

?>
