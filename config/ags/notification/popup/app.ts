import { App } from "astal/gtk3"
import style from "./style.css"
import main from "./layout"

App.start({
    	instanceName: "notification-popup",
        css: style,
    	main() {
		App.get_monitors().map(main)
    	},
})
