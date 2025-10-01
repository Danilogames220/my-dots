#!/bin/bash
# TODO make transition be at mouse pos
# - use the percentages instead of offset

# only checks for extention
is_image_file() {
        local path="$1"

        extention="${path##*.}"
        if [ "$extention" == "jpg" ] ||
                [ "$extention" == "jpeg" ] ||
                [ "$extention" == "png" ]; then
                echo $path
        fi
}

set_wall() {
        swww img "$1" --transition-type grow #--transition-pos 0,0
        wal -i "$1"
        #bash ~/.config/assets/scripts/reset-p-style.sh
}

# --- MAIN FUNCTIONS --- #

a_isdir() {
        # get all images from dir
        for file in "$1"/*; do
                img=$(is_image_file "$file")
                walls+=("$img")
        done

        # pick random wallpaper from array
        wlenght="${#walls[@]}"
        wrand="$(($RANDOM % $wlenght))"
        wall="${walls[$wrand]}"

        set_wall "$wall"
}

a_isfile() {
        # check if file is a image
        wall=$(is_image_file "$1")
        if [ -z "$wall" ]; then
                echo "ERROR: file is not a image file"
                exit 12
        fi

        set_wall "$wall"
}

# --- MAIN --- #

# no $1
if [ -z "$1" ]; then
        echo "ERROR: No arguments defined"
        exit 10
fi

# if $1 is a dir
if [ -d "$1" ]; then
        echo "Directory detected"
        a_isdir "$1"
        exit 0
fi

# if $1 is a file
if [ -f "$1" ]; then
        echo "file detected"
        a_isfile "$1"
        exit 0
fi

# $1 doesn't exist / invalid argument
echo "ERROR: ($1) does not exist OR is a invalid argument"
exit 11
