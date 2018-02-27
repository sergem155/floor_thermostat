#!/bin/bash
if [[ $(< /run/lock/schedule-status.txt) != 0 ]]; then
	echo $1 > /run/lock/set-temp.txt
fi
