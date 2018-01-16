<?php
#$output = shell_exec('crontab -l');
#file_put_contents('/tmp/crontab.txt', $output.'* * * * * NEW_CRON'.PHP_EOL);
#echo exec('crontab /tmp/crontab.txt');
#echo exec('crontab -r');




function write_file($fname, $x){
	$myfile = fopen($fname, "w") or die("Unable to open file!");
	fwrite($myfile, $x);
	fclose($myfile);
}

if ($_SERVER['REQUEST_METHOD']=='GET'){
	$schedules = array();
	exec('crontab -l',$output);
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
						array('minute1'=>$last['minute'],
						'hour1'=>$last['hour'],
						'temp1'=>$last['temp'],
						'minute2'=>$days[$time]['minute'],
						'hour2'=>$days[$time]['hour'],
						'temp2'=>$days[$time]['temp'],
						'days'=>array_values($last['days_of_week']),
						'key'=>$days[$time]['days_key'].'-'.$last['time'].'-'.$days[$time]['time']
						));
				}else{
					$last=$days[$time];
				}			
			}
		}
	}
	header('Content-Type: application/json');
	echo json_encode($paired_schedules);
}else{
	//$data = json_decode(file_get_contents('php://input'), true);
	//if( $data['set_temp'] > 40 && $data['set_temp'] < 90){
	//	write_file("/tmp/set-temp.txt",$data['set_temp']);
	//}
}

?>
