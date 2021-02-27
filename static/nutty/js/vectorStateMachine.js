class VectorStateMachine {
	constructor(states) {
		this.states = states
		this.index = []
		for (var [key, value] of this.states) {
			this.index.push(key)
		}
		this.index.sort()
		if (this.index[this.index.length-1]!=1) {
			this.index.push(1)
		}
	}

	sample(position) {
		var lastKey = null
		for (var [key, value] of this.states) {
			if (lastKey == null || key > position) lastKey = key
			if (position == 1) break
			if (key > position) break
		}
		return this.states.get(lastKey)
	}

}