import {init as debug} from './debug'
import {init as download} from './download'
export function initParsers (ant) {
	ant.element.registerHook ("ant-debug", debug)	
	ant.element.registerHook ("ant-download", download)	

}
