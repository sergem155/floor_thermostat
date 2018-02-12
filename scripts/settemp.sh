#!/bin/bash
if [[ $(< /tmp/schedule-status.txt) != 0 ]]; then
	echo $1 > /tmp/set-temp.txt
fi
