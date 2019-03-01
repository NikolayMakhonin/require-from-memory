// import {raiseMouseEvent} from './events'

let prevTarget = null
let target
let prevX = null
let prevY = null
let prevType = null
let inProcess = false

export function onMouseEvent(type, x, y, options) {
	if (inProcess) {
		return true
	}

	try {
		// console.log(type);

		if (type === 'touchend' || type === 'mouseup') {
			x = prevX
			y = prevY
			target = prevTarget
			prevTarget = null
		} else {
			// console.log(x + ", " + y);
			target = document.elementFromPoint(x, y)

			const {isVisiblePredicate} = options

			while (true) {
				if (target == null) {
					return true
				}

				if (isVisiblePredicate == null || isVisiblePredicate(target)) {
					break
				}

				target = target.parentNode
			}

			if (target !== prevTarget) {
				const {hoverClass} = options
				if (hoverClass) {
					if (prevTarget != null) {
						prevTarget.classList.remove(hoverClass)
					}
					if (target != null) {
						target.classList.add(hoverClass)
					}
				}
				if (options.emitEnterOut) {
					emitEvent(prevTarget, 'mouseout')
					emitEvent(target, 'mouseenter')
				}
			} else if (prevType === type && type === 'mousemove') {
				return true
			}

			prevType = type
			prevX = x
			prevY = y
			prevTarget = target
		}

		if (options.emitEvents) {
			emitEvent(target, type)
		}
	} catch (error) {
		console.log(error)
	}

	function emitEvent(eventTarget, eventType) {
		if (!eventTarget) {
			return
		}

		try {
			const mouseEvent = document.createEvent('MouseEvent')
			mouseEvent.initMouseEvent(
				eventType, false, true, window, 0,
				x, y, x, y,
				false, false, false, false,
				0 /* button  left */, eventTarget
			)
			inProcess = true
			try {
				const result = eventTarget.dispatchEvent(mouseEvent)
				// console.log(result)
				// raiseMouseEvent(target, type, x, y, mouseEvent)
			} catch (error2) {
				console.log(error2)
			}
			inProcess = false
		} catch (error) {
			console.log(error)
		}
	}

	return true
}

export function touchToMouse(element, childsPredicate) {
	element.addEventListener('touchstart', function (e) {
		const x = e.pageX || e.touches[0].pageX
		const y = e.pageY || e.touches[0].pageY
		onMouseEvent('mousedown', x, y, childsPredicate)
		e.stopPropagation()
		e.preventDefault()
		return false
	}, {bubbles: false})

	element.addEventListener('touchmove', function (e) {
		const x = e.pageX || e.touches[0].pageX
		const y = e.pageY || e.touches[0].pageY
		onMouseEvent('mousemove', x, y, childsPredicate)
		e.stopPropagation()
		e.preventDefault()
		return false
	}, {bubbles: false})

	element.addEventListener('touchend', function (e) {
		onMouseEvent('mouseup')
		e.stopPropagation()
		e.preventDefault()
		return false
	}, {bubbles: false})
}

export default {
	touchToMouse
}
