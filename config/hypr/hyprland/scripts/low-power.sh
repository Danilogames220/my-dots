#!/bin/sh
# WARNING: if the script is stopped while run_while() is running, run_while() is gonna continue to run

# --- SETTINGS --- #
lp_percentage=10
lp_brightness=10
# these two are in seconds
bat_check_interval=1
rh_interval=30

notif_sound_path="~/.config/sounds/volume-change.ogg"

get_battery_val() {
        echo $(upower -i "$(upower -e | grep BAT)" | grep -E "percentage" | awk '{print $2}' | tr -d '%')
}
get_brightness() {
        current=$(brightnessctl g)
        max=$(brightnessctl m)

        awk "begin { print(($current / $max) * 100) }"
}
set_brightness() {
        brightnessctl s "$1%"
}

battery_val=$(get_battery_val)

previus_brightness=$(get_brightness)

is_low_power=0
low_power_ran=0
not_low_power_ran=1

# Temp file to act as shared flag
END_THREAD_FILE="/tmp/low-power-temp"

# function to run while is low power
run_while() {
        while true; do
                if [[ -f "$END_THREAD_FILE" ]]; then
                        run_after
                        break
                fi

                notify-send 'Low Power!' "Please connect your device to a charger" -t 60000
                ffplay -nodisp -autoexit "$notif_sound_path"

                sleep "$rh_interval"
        done
}

# function that runs the first time the system goes to low power
run_once() {
        previus_brightness=$(get_brightness)
        set_brightness $lp_brightness

        rm -f "$END_THREAD_FILE"
        run_while &
        run_while_pid=$!
}

# function to run after the system is no longer on low power
run_after() {
        #echo "no longer on low power"
        set_brightness $previus_brightness

}

while true; do
        battery_val=$(get_battery_val)

        if [[ $battery_val -le $lp_percentage ]]; then
                is_low_power=1
        else
                is_low_power=0
        fi

        if [[ $is_low_power -eq 1 && $low_power_ran -eq 0 ]]; then
                run_once

                low_power_ran=1
                not_low_power_ran=0
        fi

        if [[ $is_low_power -eq 0 && $not_low_power_ran -eq 0 ]]; then
                # fully clear temp
                touch "$END_THREAD_FILE"
                trap 'rm -f "$END_THREAD_FILE"' EXIT

                not_low_power_ran=1
                low_power_ran=0

        fi

        sleep "$bat_check_interval"
done
