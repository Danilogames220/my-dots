// stuff might break if u try loading from a dir not in ~/ or inside it
// TODO 
// - search bar
// - random wallpaper
import { App, Widget, Astal, Gtk, Gdk } from "astal/gtk3"
import { Variable, exec, execAsync, bind } from "astal"
import Apps from "gi://AstalApps"
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

// --- SETTINGS --- //
const main_width = 1200
const main_height = 900
const row_count = 3


// --- CONSTANTS --- //
const home_dir = GLib.get_home_dir()

// --- NON CONSANT VARIABLES -- //
const current_dir = Variable(home_dir + "/Wallpapers") // starts from home dir
const input_text = Variable("")



// --- FUNCTIONS --- //
function get_wallpapers (wall_path: Sting) {
	const raw_buff = exec(`bash get-wallpapers.sh ${wall_path}`)
	const files = raw_buff.split('\n')
	return files
}



// --- ELEMENTS --- //
function Directory({ path }: { path:string }) {
	let fname = path.replace(current_dir.get(), "")

	function on_click() {
		if (path == "/../" || path == "/..") {
			current_dir.set(
				GLib.path_get_dirname( current_dir.get() )
			)

		} else {
			current_dir.set(path)
		}
	}

	return <button
	className="dir-button"

	widthRequest={main_width / row_count - 1}
	onClicked={() => on_click()}
	>
		<box vertical>
			<box
	   		heightRequest={180}
			halign="3" // center icon
			>
				<icon 
				icon="folder"
				css="font-size: 10.6em;"
				/>
			</box>
			<label
			truncate
			className="dir-text"
			label={fname}
			/>
		</box>
	</button>
}

function Wallpaper({ path }: { path:string }) {
	let fname = path.replace(current_dir.get(), "")
	let fpath = path.replace(fname, "")

	return <button
	className="wallpaper-button"

	widthRequest={main_width / row_count - 1}
	onClicked={async () => {
		print(path)
		try {
			//window_p.hide()
			await execAsync(`bash ${home_dir}/.config/swww/set-wallpaper.sh "${path}"`);
		} catch (err) {
			//logError(err);
			App.quit()
		}
		App.quit()
	}}
	>
		<box vertical>
			<box
			className="wallpaper-image"
	   		heightRequest={180}
			css={`
				background-image: url('${fpath}/.thumb${fname}');
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center;
			`}
			/>

			<label
			className="wallpaper-text"
			truncate
			label={fname}
			/>
		</box>
	</button>
}

function Wall_grid({ path }: { path:string }) {
	const files = get_wallpapers(path)
	
	const colums = []
	files.forEach(path => {
		if (path[path.length - 1] == '/') {
			colums.push(<Directory path={path.slice(0, -1)}/>)
		} else {
			colums.push(<Wallpaper path={path}/>)
		}
	})

	const rows = []
	const clength = colums.length
	const last_row_size = clength % row_count;
	//print("total elements: " + clength)
	for (let i = 0; i < clength; i += row_count) {
		
		var row_buff = []
		
		if (i + last_row_size + 1 >= clength) {
			// LAST ROW
			
			for (let j = 0; j < last_row_size; j++) {
				row_buff.push(colums[i + j])
			}
		} else {
			for (let j = 0; j < row_count; j++) {
				row_buff.push(colums[i + j])
			}
		}	


		rows.push(<box className="wallpaper_row" horisontal>
			  	{row_buff}
			  </box>)
	}

	return <scrollable vexpand>
		<box vertical>
			{rows}
		</box>
	</scrollable>
}


function Top_bar() {
	return <box
	heightRequest={20}
	>
		<button
		child={<icon icon="window-close"/>}
		onClicked={() => {
			App.quit()

		}}
		/>
		<button
		child={<icon icon="system-search"/>}
		/>
		<entry
		hexpand

                placeholderText="Search..."
                //text={}
		onChanged={(self) => {
			input_text.set(self.text)

		}}
                //onActivate={onEnter}
                />
		
		<button
		onClicked={() => {
			print("shuffle clicked")
			//current_dir.set("/Wallpapers/gay")
		}}
		child={<icon icon="media-playlist-shuffle"/>}
		/>
	</box>;

}

function Content() {
	const vartest = Variable("thing")

	//const st_buff = search_text(value => print(value));
	return <box 
	   	className="content" 
	   	
		widthRequest={main_width}
	   	heightRequest={main_height}
	   
	   	vertical
	   	>
			<Top_bar/>
			{current_dir(self => <Wall_grid path={self}/>)}
			
			<label label={current_dir(self => "~" + self.slice(home_dir.length))}/>
	</box>

}


// --- MAIN --- //
export default function Main(gdkmonitor: Gdk.Monitor) {
	//const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
    	return <window
		name="wall-picker"
                namespace="AGSwall-picker"
		//visible="false"

        	gdkmonitor={gdkmonitor}
		keymode={Astal.Keymode.ON_DEMAND}
        	//exclusivity={Astal.Exclusivity.EXCLUSIVE}
        	application={App}

		child={<Content/>}

		onKeyPressEvent={function (self, event: Gdk.Event) {
            	if (event.get_keyval()[1] === Gdk.KEY_Escape)
			App.quit()
			//self.hide()
        	}}
		/>
}
