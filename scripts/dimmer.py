#!/usr/bin/python
import read_tsl
import pigpio
from time import sleep
import traceback

pin=18
min_lux=0.6
max_lux=5

current_bl=1000000

pi = pigpio.pi()

def set_bl(start, stop):
	i=start		
	if(start > stop):
		while(i > stop):
			pi.hardware_PWM(18, 6000, i)
			i-=10000
			sleep(0.02)
	else: # start < stop
		while(i < stop):
			pi.hardware_PWM(18, 6000, i)
			i+=10000
			sleep(0.02)

tsl = read_tsl.Tsl2591()  # initialize
while(True):	
	# read lighting
	tsl.set_gain(read_tsl.GAIN_HIGH)
	tsl.set_timing(read_tsl.INTEGRATIONTIME_100MS)
	full_test, ir_test = tsl.get_full_luminosity()
	lux = tsl.calculate_lux(full_test, ir_test)
	if lux<min_lux: lux=min_lux
	if lux>max_lux: lux=max_lux
	bl = (lux-min_lux)/(max_lux-min_lux)*0.94+0.06
	bl*=1000000
	if current_bl!=bl:
		set_bl(current_bl,bl)
		current_bl=bl
	sleep(1)


