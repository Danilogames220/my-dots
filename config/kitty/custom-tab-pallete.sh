active=$(cat ~/.cache/wal/colors-kitty.conf | grep "color14" | cut -d ' ' -f7)
inactive=$(cat ~/.cache/wal/colors-kitty.conf | grep "color11" | cut -d ' ' -f7)

foreground=$(cat ~/.cache/wal/colors-kitty.conf | grep "background" | head -n 1 | cut -d ' ' -f10)

echo "active_tab_background ${active}" > ~/.config/kitty/sh-colors.conf
echo -e "inactive_tab_background ${inactive}" >> ~/.config/kitty/sh-colors.conf

echo -e "active_tab_foreground ${foreground}" >> ~/.config/kitty/sh-colors.conf
echo -e "inactive_tab_foreground ${foreground}" >> ~/.config/kitty/sh-colors.conf

echo -e "background ${foreground}" >> ~/.config/kitty/sh-colors.conf
