export function raiseEvent(e) {
	const listener = this[`on${e.type}`]
	if (listener) {
		listener.call(this, e)
	}
}

export function raiseMouseEvent(target, type, x, y) {
	const mouseEvent = document.createEvent('MouseEvent')
	mouseEvent.initMouseEvent(
		type, true, false, window, 0,
		x, y, x, y,
		false, false, false, false,
		0 /* button  left */, this
	)
	raiseEvent(target, mouseEvent)
}

export default {
	raiseMouseEvent
}
