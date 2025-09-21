import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Variable, bind } from "astal"
import GLib from 'gi://GLib'

// --- SETTINGS --- //
const WIDTH = 800
const MAX_ITEMS = 10
const ITEM_HEIGHT = 50

const EXTRA_SPACING = 10

const TOP_SPACING = 300

// --- CONSTANTS --- //
const app_list = Variable([])

const apps = new Apps.Apps()
const search_text = Variable("")
const hide_apps = Variable(true)

// --- CLASSES --- //
class App_category {
        constructor(name: string, apps) {
                this.name = name;
                this.apps = apps;
        }
}

// --- FUNCTIONS --- //
function get_pinned_apps() {
  return 0
}

function get_apps(text: string = "") {
        const list = apps.fuzzy_query(text)

        const cats = []
        list.forEach(app =>{
                let app_cat = app.categories[0]
                
                let is_repeat: bool = 0
                cats.forEach(cat => {
                        let cat_name = cat.name
                        
                        if (cat_name == app_cat) {
                                is_repeat = 1
                        }
                })

                if (!is_repeat) {
                        cats.push(new App_category(app_cat, [app]))
                } else {
                        cats.forEach(cat => {
                                if (cat.name == app_cat) cat.apps.push(app)
                        })
                } 
        })

        //cats.forEach(category => {
        //        print(category.apps[0].name)
        //})

        app_list.set(cats)

}

// --- ELEMENTS --- //
function Appentry({ app, is_highlight }: { app:Apps.Application, is_highlight:bool}) {
	return <button hexpand
	heightRequest={ITEM_HEIGHT}
	className={is_highlight == false ? "app-entry" : "app-entry-high"}

	child={
		<box horisontal
		className="app-entry-box"
		>
			<icon className="app-icon" icon={app.iconName}/>
			<label className="app-text" label={app.name}/>
			
		</box>
	}

	onClicked={button => {
		print(app.entry)
		app.launch()
		App.quit()
	}}
	/>
}

function Appcategory({ name }:  {name:string}) {
        return <box className="app-category"
        >
                <label
                label={name}
                truncate
                
                halign="1"
                />
        </box>
}

function Search() {
	return <entry
	//text={search_text()}
	onChanged={(self) => search_text.set(self.text) }
	/>
}

function Applist({ text }: { text:string }) {
        get_apps(text)
        //print(app_list.get()[0].apps[0].name)
        
        const app_buff = app_list.get()
        
        const content = []
        let first_app = false
        app_buff.forEach(category => {
                content.push(<Appcategory name={category.name}/>)
                category.apps.forEach(app => {
                        if (!first_app) {
                                content.push(<Appentry app={app} is_highlight="1"/>)
                                first_app = true
                        } else {
                                content.push(<Appentry app={app} is_highlight="0"/>)
                        }
                }) 
        })

        if (text || hide_apps.get() == false) return <scrollable heightRequest={(ITEM_HEIGHT * MAX_ITEMS + EXTRA_SPACING)}
	className="app-list"
	hexpand
        onScrollEvent={scroll => print(scroll.get_vadjustment())}
	>
			<box vertical
			//className="app-list"
			>
				{content}
			</box>
	</scrollable>

	return <box vertical vexpand>
	</box>
}

function on_enter(text) {
	if (apps.fuzzy_query(text)) print("aa")
	apps.fuzzy_query(text)?.[0].launch()
	App.quit()
}

function Content() {
	return <box vertical 
	className="content"
	widthRequest={WIDTH}
	//heightRequest={HEIGHT}
	>	            

		<entry
		className="app-search"

                placeholderText="Search..."
                text={search_text()}
                onChanged={self => search_text.set(self.text)}
                onActivate={self => on_enter(self.text)}
                />

                <box>
			{search_text(self => <Applist text={self}/>)}
		</box>
		
	</box>
}

// --- MAIN --- //
export default function main() {

	hide_apps(() => print("hide_apps changed"))
    	return <window name="ags-launcher"
		className="win"
                namespace="AGSapp-launcher"
        	
                exclusivity={Astal.Exclusivity.IGNORE}
        	keymode={Astal.Keymode.ON_DEMAND}
		layer={3}

		anchor={
			Astal.WindowAnchor.BOTTOM |
			Astal.WindowAnchor.TOP |
			Astal.WindowAnchor.LEFT |
			Astal.WindowAnchor.RIGHT
		}
		application={App}
		
		child={//<box valign={3} halign={3}>
			<eventbox expand css="" onClick={() => App.quit()}>
				<box valign={1} halign={3} vertical>
					<box heightRequest={TOP_SPACING}/>
					<Content/>
				</box>
			</eventbox>
		//</box>
		}

		onKeyPressEvent={function (self, event: Gdk.Event) {
            	if (event.get_keyval()[1] === Gdk.KEY_Escape) {
			App.quit()
		}
		if (event.get_keyval()[1] === Gdk.KEY_Tab) {
			hide_apps.set(!hide_apps.get())
			search_text.set(search_text.get() + " ")
			search_text.set(search_text.get().slice(0, -1))
			print(hide_apps.get())
		}
		}}/>
}
