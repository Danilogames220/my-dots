#!/bin/bash

if [ "$1" != ~/"Wallpapers" ] &&
   [ "$1" != ~/"Wallpapers/" ]; then 
	echo "/../"
fi

for file in "$1"/*; do
	# dirs should end with "/"
	if [ -d "$file" ]; then
		echo "$file"/
	fi

	extention="${file##*.}"
	if [ "$extention" == "jpg" ] || 
	   [ "$extention" == "jpeg" ] || 
	   [ "$extention" == "png" ]; 
           then
		echo $file;
	fi
done
