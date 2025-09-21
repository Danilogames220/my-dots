import { App } from "astal/gtk3"
import style from "./style.css"
import main from "./layout"

App.start({
    	instanceName: "osd",
    	css: style,
        main() {
		App.get_monitors().map(main)
    	},
})
