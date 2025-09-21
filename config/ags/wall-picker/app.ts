import { App } from "astal/gtk3"
import style from "./style.css"
import Main from "./layout"

App.start({
    	instanceName: "wall-picker",
    	css: style,
    	main() {
		App.get_monitors().map(Main)
    	},
})
