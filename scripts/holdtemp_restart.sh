#!/bin/sh
find /run/lock/current-temp.txt -mmin +5 -exec killall -r -HUP ".*holdtemp.py" \;
sleep 1
if ! pgrep -x "holdtemp.py" > /dev/null
then 
	/var/www/thermostat/scripts/holdtemp.py > /dev/null&
fi
