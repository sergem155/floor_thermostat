#!/usr/bin/python
import spidev
import traceback, time, os
import datetime
from time import sleep
import RPi.GPIO as GPIO

# Tell python what pin mode to use
GPIO.setmode(GPIO.BOARD)
#thermistor control
GPIO.setup(13, GPIO.OUT, initial=GPIO.LOW)
#relay control
GPIO.setup(15, GPIO.OUT, initial=GPIO.LOW)

#ADC setup
spi = spidev.SpiDev()
spi.open(0,0)
spi.max_speed_hz = 256000

# read SPI data from MCP3202 chip, 2 possible adc's (0 thru 1)
def readadc():
	adcnum=1
	GPIO.output(13,GPIO.HIGH)
	r = spi.xfer2([1,0x40,0]) # 0x40 = differential, channel 1, MSB first
	adcout = ((r[1]&15) << 8) + r[2]
	GPIO.output(13,GPIO.LOW)
	return adcout

def readtemp():
	acc = 0
	counter = 0
	t = time.clock()+0.5
	while (time.clock()<t):
		acc+= readadc()
		counter+=1
	temp = acc/counter
	temp = int(round(-0.110690811535918 * temp + 479.58))
	return temp

def read_file(filename, default):
	retval = default;
	try:
		with open('/run/lock/set-temp.txt','r') as f: 
			retval = f.read().strip()
			f.close()		
	except:
		pass
	return retval

os.umask(0)
def write_file(filename, data):
	with os.fdopen(os.open(filename, os.O_WRONLY | os.O_CREAT, 0o660), 'w') as f:
		f.write(str(data))
		f.truncate()
		f.close()

try:
	relay = 0
	oldtemp=0
	while(1):
		temp=readtemp()
		if(temp!=oldtemp):
			oldtemp=temp
			write_file('/run/lock/current-temp.txt',str(temp))
		settemp = int(read_file('/run/lock/set-temp.txt', "41"))
		print datetime.datetime.now()
		print settemp
		print temp
		print relay
		if temp < settemp and relay == 0:
			GPIO.output(15,GPIO.HIGH)
			relay = 1
			write_file('/run/lock/relay-state.txt',"on")
		if temp >= settemp+1 and relay == 1:
			GPIO.output(15,GPIO.LOW)
			relay = 0
			write_file('/run/lock/relay-state.txt',"off")
		sleep(60)
			
except:
	traceback.print_exc()
finally:
	GPIO.cleanup()
