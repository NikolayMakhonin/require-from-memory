export class TouchToMouse {
	constructor(container, actionsPrefix = '') {
		const mouseUpName = `on${actionsPrefix}mouseup`
		const mouseOutName = `on${actionsPrefix}mouseout`
		const mouseEnterName = `on${actionsPrefix}mouseenter`

		// bind touch
		addListenerWithCoord('touchstart', `on${actionsPrefix}mousedown`)
		addListenerWithCoord('touchmove', `on${actionsPrefix}mousemove`)
		addListener('touchend', mouseUpName)

		// bind mouse
		addListenerWithCoord('mousedown', `on${actionsPrefix}mousedown`)
		addListenerWithCoord('mousemove', `on${actionsPrefix}mousemove`)
		addListener('mouseup', `on${actionsPrefix}mouseup`)

		// prevent duplicate events
		preventEvents('mouseenter')
		preventEvents('mouseout')

		function preventEvents(eventType) {
			container.addEventListener(eventType, function (e) {
				e.stopPropagation()
				e.preventDefault()
				return false
			}, {bubbles: false})
		}

		function addListener(eventType, actionName) {
			container.addEventListener(eventType, function (e) {
				callAction(actionName)
				e.stopPropagation()
				e.preventDefault()
				return false
			}, {bubbles: false})
		}

		function addListenerWithCoord(eventType, actionName) {
			container.addEventListener(eventType, function (e) {
				const {touches} = e
				if (touches) {
					const touches0 = touches[0]
					callAction(actionName, touches0.pageX, touches0.pageY)
				} else {
					callAction(actionName, e.pageX, e.pageY)
				}
				e.stopPropagation()
				e.preventDefault()
				return false
			}, {bubbles: false})
		}

		let prevTarget = null
		let target
		let prevX = null
		let prevY = null
		let isVisiblePredicate

		this.callAction = callAction
		function callAction(actionName, x, y) {
			if (actionName === mouseUpName) {
				x = prevX
				y = prevY
				if (prevTarget && prevTarget[mouseOutName]) {
					prevTarget[mouseOutName](x, y)
				}
				target = prevTarget
				prevTarget = null
			} else {
				if (!Number.isFinite(x) || !Number.isFinite(y)) {
					return
				}

				target = document.elementFromPoint(x, y)

				while (true) {
					if (target == null) {
						return
					}

					if (isVisiblePredicate == null || isVisiblePredicate(target)) {
						break
					}

					target = target.parentNode
				}

				if (target !== prevTarget) {
					if (prevTarget && prevTarget[mouseOutName]) {
						prevTarget[mouseOutName](x, y)
					}
					if (target[mouseEnterName]) {
						target[mouseEnterName](x, y)
					}
				}

				prevX = x
				prevY = y
				prevTarget = target
			}

			if (target[actionName]) {
				target[actionName](x, y)
			}
		}

		Object.defineProperty(this, 'isVisiblePredicate', {
			get() {
				return isVisiblePredicate
			},
			set(value) {
				isVisiblePredicate = value
			},
			enumerable  : true,
			configurable: false
		})
	}
}

export default {
	TouchToMouse
}
