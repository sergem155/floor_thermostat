#!/bin/sh
xset -dpms # disable DPMS (Energy Star) features.
xset s off # disable screen saver
xset s noblank # don't blank the video device
matchbox-window-manager -use_titlebar no &
/usr/bin/chromium-browser --start-fullscreen --noerrdialogs --incognito --disable-infobars --kiosk "http://localhost"
