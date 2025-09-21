#!/bin/bash
killall dunst
ags quit -i notification-popup
ags run ~/.config/ags/notification/popup/app.ts
