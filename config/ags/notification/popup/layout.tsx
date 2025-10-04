import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Variable, bind, timeout } from "astal"

import Notifd from "gi://AstalNotifd";
import GLib from 'gi://GLib';
import Gio from 'gi://GSound';
import Gst from 'gi://Gst';

// --- SETTINGS --- //
const SOUND_FILE_NAME = 'sound.mp3'

const N_WIDTH = 400
const N_HEIGHT = 125

const MAX_NOTIFS = 3

const DEFAULT_TIMEOUT = 5000

function do_nothing() {
        return 0
}

// prepare sound file
Gst.init(null);
const path = GLib.build_filenamev([GLib.get_current_dir(), SOUND_FILE_NAME]);
const fileUri = GLib.filename_to_uri(path, null);

// from example
const isIcon = (icon: string) =>
    !!Astal.Icon.lookup_icon(icon)
const fileExists = (path: string) =>
    GLib.file_test(path, GLib.FileTest.EXISTS)
const time = (time: number, format = "%H:%M") => GLib.DateTime
    .new_from_unix_local(time)
    .format(format)!

function play_sound() {
        const playbin = Gst.ElementFactory.make('playbin', 'playbin');
        playbin.set_property('uri', fileUri);
        //print(GLib.get_current_dir()+'/sound.mp3')
        playbin.set_state(Gst.State.PLAYING);
}

function Notification( notif:Notifd.Notification) {
        const { START, CENTER, END } = Gtk.Align

        return <eventbox  widthRequest={N_WIDTH} heightRequest={N_HEIGHT}
        //setup={() => {}}
        //onHoverLost={}
        //onClick={() => notif.dismiss()}
        >
                <box className="notification" vertical>
                        <box className="header">
                                {(notif.appIcon || notif.desktopEntry) && <icon
                                className="app-icon"
                                visible={Boolean(notif.appIcon || notif.desktopEntry)}
                                icon={notif.appIcon || notif.desktopEntry}
                                />}
                                <label
                                className="app-name"
                                halign={START}
                                truncate
                                label={notif.appName || "Unknown"}
                                />
                                <label
                                className="time"
                                hexpand
                                halign={END}
                                label={time(notif.time)}
                                />
                                <button className="close_button" onClicked={() => notif.dismiss()}>
                                        <icon className="close_button_icon" icon="window-close-symbolic" />
                                </button>
                        </box>
                        {/*<Gtk.Separator visible />*/}
                        <box className="content" vexpand hexpand>
                                {notif.image && fileExists(notif.image) && <box
                                valign={START}
                                className="image"
                                css={`background-image: url('${notif.image}')`}
                                />}
                                {notif.image && isIcon(notif.image) && <box
                                expand={false}
                                valign={START}
                                className="icon-image">
                                <icon icon={notif.image} expand halign={CENTER} valign={CENTER} />
                                </box>}

                                <box vertical>

                                <label
                                className="summary"
                                halign={START}
                                xalign={0}
                                label={notif.summary}
                                truncate
                                />
                                {notif.body && <label
                                className="body"
                                wrap
                                useMarkup
                                halign={START}
                                xalign={0}
                                justifyFill
                                label={notif.body}
                                />}
                        </box>
                        </box>
                        {notif.get_actions().length > 0 && <box className="actions">
                                {notif.get_actions().map(({ label, id }) => (
                                <button className="action_button"
                                hexpand
                                onClicked={() => notif.invoke(id)}>
                                <label label={label} halign={CENTER} hexpand />
                                </button>
                        ))}
                        </box>}
                </box>
        </eventbox>
}

class notif_list implements Subscribable {
        // the underlying map to keep track of id widget pairs
        private map: Map<number, Gtk.Widget> = new Map()

        // it makes sense to use a Variable under the hood and use its
        // reactivity implementation instead of keeping track of subscribers ourselves
        private var: Variable<Array<Gtk.Widget>> = Variable([])

        private set(key: number, value: Gtk.Widget) {
                // in case of replacecment destroy previous widget
                this.map.get(key)?.destroy()
                this.map.set(key, value)
                this.notifiy()
        }
        private delete(key: number) {
                this.map.get(key)?.destroy()
                this.map.delete(key)
                this.notifiy()
        }

        private notifiy() {
                this.var.set([...this.map.values()].reverse())
        }

        constructor() {
                const notifd = Notifd.get_default();
                notifd.connect("notified", (_, id) => {
                        play_sound()
                        this.set(id, Notification(notifd.get_notification(id)))
                })
                notifd.connect("resolved", (_, id) => {
                        this.delete(id)
                })

        }

        // needed by the Subscribable interface
        get() {
                return this.var.get()
        }

        // needed by the Subscribable interface
        subscribe(callback: (list: Array<Gtk.Widget>) => void) {
                return this.var.subscribe(callback)
        }
}

export default function main() {
        const { TOP, LEFT } = Astal.WindowAnchor

        const notifs = new notif_list()

    	return <window name="notif-popup"
                namespace="AGSnotif-daemon"
        	
                exclusivity={Astal.Exclusivity.IGNORE}
        	keymode={Astal.Keymode.NONE}
                margin-top="68"
		layer={3}
                anchor={TOP}
        	application={App}>

                <box className="notification-list" vertical noImplicitDestroy>
                        {bind(notifs)}
                </box> 

		
                {/*<Notification/>*/}
	</window>
}
