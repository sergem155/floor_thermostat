# Software for Raspberry PI-based Thermostat for NuHeat Floor
[Blog post with full description](http://blog.sergem.net/how-i-built-a-thermostat-for-nuheat-floor/)

![](http://blog.sergem.net/wp-content/uploads/2018/03/wall.jpg)



### Base Thermostat

** holdtemp.py ** - python script reading temperature from ADC, then turning relay on or off based on the temperature threshold in /run/lock/set-temp.txt. Writes current temp to /run/lock/current-temp.txt

** restart-holdtemp.sh ** - shell script to kill holdtemp if it hangs (and does not update current-temp.txt for 2 minutes)

** settemp.sh ** - shell script that sets set-temp.txt - runs from cron. Ignores the setting if the file /run/lock/schedule-status.txt is not present, this is used to disable scheduled operation while leaving schedule settings in place

### Web-based Controls

** /var/www/thermostat ** - contains php scripts for reading and writing crontable and current-temp, as well as html, css, fonts and javascript to display web ui. The UI can be used from any browser, e.g. from a phone

### Screen

** runkiosk.sh ** - script to launch X11 GUI, with Chromium browser in kiosk mode pointing to the web-based thermostat user interface URL (http://localhost)

### Dimmer

** dimmer.py ** - script that reads light sensor and sets PWM pulse width that adjusts screen backlight

Requires pigpiod to be installed and running


