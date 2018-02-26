#!/bin/bash
if [[ $(< /var/run/schedule-status.txt) != 0 ]]; then
	echo $1 > /var/run/set-temp.txt
fi
