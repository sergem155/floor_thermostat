#!/usr/bin/python
import spidev
import traceback, time, os
import datetime
from time import sleep
import RPi.GPIO as GPIO

# handle signals, to make sure Finally clause below is run in all cases:
from signal import *
import sys
def cleanup(signum,frame):
	sys.exit(0)
for sig in (SIGHUP, SIGTERM, SIGABRT, SIGILL, SIGINT, SIGSEGV):
	signal(sig, cleanup)

# Tell python which pin mode to use
GPIO.setmode(GPIO.BOARD)
#thermistor control
GPIO.setup(13, GPIO.OUT, initial=GPIO.LOW)
#relay control
GPIO.setup(15, GPIO.OUT, initial=GPIO.LOW)

#ADC setup
spi = spidev.SpiDev()
spi.open(0,0)
spi.max_speed_hz = 256000

# read SPI data from MCP3202 ADC chip, 2 possible adc's (0 thru 1)
def readadc():
	adcnum=1
	GPIO.output(13,GPIO.HIGH) # turn on current in floor sensor thermistor
	r = spi.xfer2([1,0x40,0]) # 0x40 = differential, channel 1, MSB first
	adcout = ((r[1]&15) << 8) + r[2]
	GPIO.output(13,GPIO.LOW) # turn off thermistor so it won't heat up uselessly
	return adcout

def readtemp():
	acc = 0
	counter = 0
	t = time.clock()+0.5
	while (time.clock()<t): # take multiple readings to average mains 60Hz interference
		acc+= readadc()
		counter+=1
	temp = acc/counter
	temp = int(round(-0.110690811535918 * temp + 479.58)) # convert to degrees F
	return temp

relay = 0
def turn_off():
	GPIO.output(15,GPIO.LOW)
	relay = 0
	write_file('/run/lock/relay-state.txt',"off")

def turn_on():
	GPIO.output(15,GPIO.HIGH)
	relay = 1
	write_file('/run/lock/relay-state.txt',"on")

def read_file(filename, default):
	retval = default;
	try:
		with open(filename,'r') as f: 
			retval = f.read().strip()
			f.close()		
	except:
		pass
	return retval

os.umask(0) # se we could set desired attributes below
def write_file(filename, data):
	with os.fdopen(os.open(filename, os.O_WRONLY | os.O_CREAT, 0o660), 'w') as f:
		f.write(str(data))
		f.truncate()
		f.close()

try:
	turn_off()
	while(1):
		temp=readtemp()
		# doubles up as a keepalive:
		write_file('/run/lock/current-temp.txt',str(temp))
		settemp = int(read_file('/run/lock/set-temp.txt', "41"))
		print datetime.datetime.now()
		print settemp
		print temp
		print relay
		if 32 > temp or temp > 90:
			turn_off() # reading is outside of sane range
		else:
			if temp < settemp and relay == 0:
				turn_on()
			if temp >= settemp+1 and relay == 1:
				turn_off()
		sleep(10)
			
except:
	traceback.print_exc()
finally:
	# to make sure the relay is off in all cases
	print "Finally"	
	GPIO.cleanup()
