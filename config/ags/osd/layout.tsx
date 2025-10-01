import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Variable, bind, exec, execAsync } from "astal"
import { timeout } from "astal/time"
import { monitorFile, readFileAsync } from "astal/file"
import GObject, { register, property } from "astal/gobject"

import Wp from "gi://AstalWp"

const WIDTH = 325

const MARGIN = 2

const FONT_SIZE = 20

const TIMEOUT = 2000

const is_visible = Variable(false)
const volume_visible = Variable(false)
const brightness_visible = Variable(false)

// brightness class
// TODO move this to a seprate file
@register({ GTypeName: "Brightness" })
class Brightness extends GObject.Object {
        #current_screen = exec(`bash -c "ls -w1 /sys/class/backlight | head -1"`)
        #max = exec("brightnessctl max")

        private get_raw(): number {
                return exec("brightnessctl get")
        }

        #value = this.get_raw() / this.#max || 1

        @property(Number)
        get screen() { return this.#value}
        set screen(percent) {
                if (percent < 0)
                        percent = 0

                if (percent > 1)
                        percent = 1

                execAsync(`brightnessctl set ${Math.floor(percent * 100)}% -q`).then(() => {
                        this.#value = percent
                        this.notify("screen")
                })
        }

        @property(String)
        get icon() {
                /*
                // change icon depending on bnightness level
                let val = this.#value
                if (val <= 1 && val > 0.6) return "display-brightness-high-symbolic"
                if (val <= 0.6 && val > 0.35) return "display-brightness-medium-symbolic"
                if (val <= 0.35 && val > 0.05) return "display-brightness-low-symbolic"
                if (val <= 0.05) return "display-brightness-low-symbolic"
                */

                return "display-brightness-symbolic"
        }

        constructor() {
                super()

                // send signal on brightness change 
                monitorFile(`/sys/class/backlight/${this.#current_screen}/brightness`, async f => {
                        const v = await readFileAsync(f)
                        this.#value = v / this.#max
                        this.notify("screen")
                })
        }

}

function OSDvolume({ visible }: { visible: Variable<boolean> }) {
        const speaker = Wp.get_default()!.get_default_speaker()

        const value = Variable(0)
        const icon = Variable()

        function change(value: number) {
                speaker.volume = value
        }

        let count = 0
        function show(val: number, icon_name: string) {
                visible.set(true)
                icon.set(icon_name)
                
                value.set(val)

                count++
                timeout(TIMEOUT, () => {
                        count--
                        if (count === 0) visible.set(false)
                })
        }

        return <revealer 
                revealChild={visible()}

                setup={(self) => {
                        if (speaker) {
                                self.hook(speaker, "notify::volume", () => {
                                        show(speaker.volume, speaker.volumeIcon)
                                        brightness_visible.set(false)
                                })
                                self.hook(speaker, "notify::mute", () => {
                                        show(speaker.volume, speaker.volumeIcon)
                                        brightness_visible.set(false)
                                })
                        }

                }}
        >
                <box className="content"
                widthRequest={WIDTH}
                hidden="true"
                >
                        <icon className="icon" 
                        icon={icon()}
                        css={`font-size: ${FONT_SIZE * 1.2}px;`}
                        />

                        <slider className="slider" 
                        valign="3" 
                        hexpand 
                        value={value()}
                        min="0"
		        //heightRequest={HEIGHT}
                        onDragged={({ value }) => change(value)}
                        />

                        <label className="value" 
                        label={value(val => `${Math.round(val * 100)}`)}
                        widthRequest={FONT_SIZE * 2.2}
                        css={`font-size: ${FONT_SIZE}px;`}
                        />
                </box>
        </revealer>

}


function OSDbrightness({ visible }: { visible: Variable<boolean> }) {
        const brightness = new Brightness()

        const value = Variable(0)
        const icon = Variable()

        function change(value: number) {
                brightness.screen = value
        }

        let count = 0
        function show(val: number, icon_name: string) {
                visible.set(true)
                icon.set(icon_name)
                
                value.set(val)

                count++
                timeout(TIMEOUT, () => {
                        count--
                        if (count === 0) visible.set(false)
                })
        }

        return <revealer 
                revealChild={visible()}

                setup={(self) => {
                        self.hook(brightness, "notify::screen", () => {
                                volume_visible.set(false)
                                show(brightness.screen, brightness.icon)
                        })
                }}
        >
                <box className="content"
                widthRequest={WIDTH}
                hidden="true"
                >
                        <icon className="icon" 
                        icon={icon()}
                        css={`font-size: ${FONT_SIZE * 1.2}px;`}
                        />

                        <slider className="slider" 
                        valign="3" 
                        hexpand 
                        value={value()}
                        min="0"
		        //heightRequest={HEIGHT}
                        onDragged={({ value }) => change(value)}
                        />

                        <label className="value" 
                        label={value(val => `${Math.round(val * 100)}`)}
                        widthRequest={FONT_SIZE * 2.2}
                        css={`font-size: ${FONT_SIZE}px;`}
                        />
                </box>
        </revealer>

}

export default function main() {

    	return <window 
                name="osd"
                namespace="AGSosd"
		
                layer={Astal.Layer.OVERLAY}
                anchor={Astal.WindowAnchor.BOTTOM}
                
                margin={MARGIN}

        	exclusivity={Astal.Exclusivity.IGNORE}
        	keymode={Astal.Keymode.NONE}
        	
                application={App}
        >
                <box vertical>
                        <OSDvolume visible={volume_visible}/>
                        <OSDbrightness visible={brightness_visible}/>	
                </box>
	</window>
}
