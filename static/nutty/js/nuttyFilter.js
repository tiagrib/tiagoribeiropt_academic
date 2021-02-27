var FilterOrderEnum = {
	None: 1,
  	First: 2,
  	Second: 3,
  	Third: 4,
};

var Presets = {}
var precision = 0.00000000001
var nearZero = precision
var equation_decimals = 3

Presets['Slow'] = [[1.0, 0.0, 1, 1.0], [40.0, 10.0, 10.0, 100.0], FilterOrderEnum.First]
Presets['Fast Smooth'] = [[0.93, 0.92, 1, 0.398], [65.0, 700.0, 700.0, 100000.0], FilterOrderEnum.Third]
Presets['Fast'] = [[0.776, 0.4, 1, 0.5], [100.0, 1000, 1000, 100000.0], FilterOrderEnum.Third]
Presets['Loose'] = [[0.55, 0.5, 1, 0.6], [100.0, 200, 200, 20000.0], FilterOrderEnum.Third]
Presets['Pendular'] = [[0.0, 1.0, 1, 1], [100.0, 60.0, 60.0, 50000.0], FilterOrderEnum.Third]
Presets['Paper-A'] = [[1.0, 1.0, 1, 1.0], [20.0, 100.0, 100.0, 10000.0], FilterOrderEnum.Third]
Presets['Paper-B'] = [[0.1, 0.0, 1, 1.0], [20.0, 100.0, 100.0, 10000.0], FilterOrderEnum.Third]
Presets['Paper-C'] = [[0.1, 0.0, 1, 1.0], [90.0, 700.0, 700.0, 50000.0], FilterOrderEnum.Third]
Presets['Paper-D'] = [[0.95, 1.0, 1, 1.0], [90.0, 700.0, 700.0, 50000.0], FilterOrderEnum.Third]
Presets['Paper-E'] = [[0.95, 0.2, 1, 1.0], [90.0, 700.0, 700.0, 50000.0], FilterOrderEnum.Third]


var DEFAULT_MOTION_CHARACTER = 'Fast Smooth'
var DEFAULT_FILTER_A = Presets[DEFAULT_MOTION_CHARACTER][0][0],
	DEFAULT_FILTER_B = Presets[DEFAULT_MOTION_CHARACTER][0][1],
	DEFAULT_FILTER_C = Presets[DEFAULT_MOTION_CHARACTER][0][2],
	DEFAULT_FILTER_D = Presets[DEFAULT_MOTION_CHARACTER][0][3];
var DEFAULT_FILTER_LIM_V = Presets[DEFAULT_MOTION_CHARACTER][1][0],
	DEFAULT_FILTER_LIM_A = Presets[DEFAULT_MOTION_CHARACTER][1][1],
	DEFAULT_FILTER_LIM_D = Presets[DEFAULT_MOTION_CHARACTER][1][2],
	DEFAULT_FILTER_LIM_J = Presets[DEFAULT_MOTION_CHARACTER][1][3];

function rollVector4(v, v0) {
	return [v0, v[0], v[1], v[2]]
}
function rollVector3(v, v0) {
	return [v0, v[0], v[1]]
}
function deriv(xf, xi, dT) {
	return (xf - xi)/dT
}

function limit(x, lim, useTanhLimiter=true) {
	if (useTanhLimiter) {
		return lim*0.5*Math.tanh(x/(lim*0.5))
	}
	else return Math.min(lim, Math.max(-lim, x))
}
function sign(x) {
	if (x >= 0) return 1
	return -1
}




function makeOutputFromJerk(dT, o1, v1, a1, newv, newa, newj, order) {
	if (order==FilterOrderEnum.Third) {
		newa = a1 + newj*dT
		newv = v1 + a1*dT + newj*dT*dT/2
		newx = o1 + v1*dT + a1*dT*dT/2 + newj*dT*dT*dT/6
	}
	else if (order==FilterOrderEnum.Second) {
		newj = 0
		newv = v1 + newa*dT
		newx = o1 + v1*dT + newa*dT*dT/2
	}
	else {
		newj = 0
		newa = 0
		newx = o1 + newv*dT
	}
	return [newx, newv, newa, newj]
}

function htmlCell(text, fontSize, align='') {
	return "<td " + (align==''?'':"align="+align)+"><p style='font-size:"+fontSize+"px'>"+text+"</td>"
}

class NuttyFilter {
	constructor(name, initialPosition=0) {
		this.name = name
		this.useStabilizer = false
		this.useTanhLimiter = true
		this.initialPosition = initialPosition
		this.SP = [0,0,0,0]
		this.O = [[initialPosition,initialPosition,initialPosition], [0,0,0], [0,0,0], [0,0,0]]
		this.SetLimitsInDegrees(DEFAULT_FILTER_LIM_V, DEFAULT_FILTER_LIM_A, DEFAULT_FILTER_LIM_D, DEFAULT_FILTER_LIM_J)
		this.SetSmoothing(DEFAULT_FILTER_A, DEFAULT_FILTER_B, DEFAULT_FILTER_C, DEFAULT_FILTER_D)
	}

	Reset(initialValue = 0) {
		this.SP = [initialValue,0,0,0]
		this.O = [[initialValue,initialValue,initialValue], [0,0,0], [0,0,0], [0,0,0]]
	}

	SetSmoothing(a, b, c, d) {
		this.Smoothing = [a, b, c, d]
	}
	SetLimitsInRadians(v, a, d, j) {
		this.Limits = [v, a, d, j] 
	}
	SetLimitsInDegrees(v, a, d, j){
		this.SetLimitsInRadians(Math.radians(v), Math.radians(a), Math.radians(d), Math.radians(j))
	}

	Run(setPoint, dT, filterOrder) {
		this.SP = rollVector4(this.SP, setPoint)
		this.CalculateFilter(dT, filterOrder)
		return this.O[0][0]
	}

	ToLatexParams(order) {
		var s = "$"
		s += "a="+this.Smoothing[0].toFixed(equation_decimals) + " \\\\"
		s += "b="+this.Smoothing[1].toFixed(equation_decimals) + " \\\\"
		s += "c="+this.Smoothing[2].toFixed(equation_decimals) + " \\\\"
		s += "d="+this.Smoothing[3].toFixed(equation_decimals) + " \\\\"
		s += "velocity\\_limit="+this.Limits[0].toFixed(equation_decimals) + " \\\\"
		if (order > FilterOrderEnum.First) s += "accel\\_limit="+this.Limits[1].toFixed(equation_decimals) + " \\\\"
		if (order > FilterOrderEnum.Second) s += "jerk\\_limit="+this.Limits[3].toFixed(equation_decimals) + " \\\\"
		return s+"$"
	}
	
	ToHtmlParams(settings, fontSize) {
		var s = "<font size='" + fontSize + "'><table>"
		if (settings.filterSettings.Stabilizer) {
			s += "<tr>"+htmlCell("a", fontSize, 'right')+htmlCell("=", fontSize)+htmlCell(this.Smoothing[0].toFixed(equation_decimals), fontSize)+"</tr>"
			s += "<tr>"+htmlCell("b", fontSize, 'right')+htmlCell("=", fontSize)+htmlCell(this.Smoothing[1].toFixed(equation_decimals), fontSize)+"</tr>"
		}
		s += "<tr>"+htmlCell("velocity_limit", fontSize, 'right')+htmlCell("=", fontSize)+htmlCell(this.Limits[0].toFixed(0), fontSize)+"</tr>"
		if (settings.filterSettings.Order > FilterOrderEnum.First) {
			s += "<tr>"+htmlCell("accel_limit", fontSize, 'right')+htmlCell("=", fontSize)+htmlCell(this.Limits[1].toFixed(0), fontSize)+"</tr>"
		}
		if (settings.filterSettings.Order > FilterOrderEnum.Second) {
			s += "<tr>"+htmlCell("jerk_limit", fontSize, 'right')+htmlCell("=", fontSize)+htmlCell(this.Limits[3].toFixed(0), fontSize)+"</tr>"
		}
		s += "<tr>"+htmlCell("&epsilon;", fontSize, 'right')+htmlCell("=", fontSize)+htmlCell("0.00000001", fontSize)+"</tr>"
		s += "<tr>"+htmlCell("0 &le; a &le; 1", fontSize, 'right')+htmlCell("&amp;", fontSize)+htmlCell("0 &le; b < 1", fontSize)+"</tr>"
			//s += "<tr><td align='right'>b &ge; &epsilon;, c &ge; &epsilon;</td></tr>"
			//s += "<tr><td align='right'> -1 &le; d &le; 1</td></tr>"
		return s+"</table></font>"
	}

	ToLatex(settings) {
		//return ""
		var s = "$\\newcommand\{\\sgn\}\{\\text\{sgn\}\}\\\\"
		s+="\\newcommand\{\\Eta\}\{\\text\{H\}\}\\\\"
		s+="\\begin\{align\}"
		if (settings.filterSettings.Order == FilterOrderEnum.First) {
			s+="x(t_i) & = x(t_\{i-1\}) + \\lambda(\\Eta(\\dot\{x\}(t_i)), velocity\\_limit) \\\\"
		} else if (settings.filterSettings.Order == FilterOrderEnum.Second) {
			s+="X(x, t_i) & = x(t_\{i-1\}) + \\lambda(\\psi(t_i), velocity\\_limit) \\\\"
			s+="\\psi(t_i) & = \\dot\{x\}(t_\{i-1\}) + \\lambda(\\frac\{\\Eta(\\dot\{x\}(t_i))-\\dot\{x\}(t_\{i-1\})\}\{\\Delta t\}, accel\\_limit) \\\\"
		} else if (settings.filterSettings.Order == FilterOrderEnum.Third) {
			s+="X(x, t_i) & = x(t_\{i-1\}) + \\lambda(\\psi(t_i), velocity\\_limit) \\\\"
			s+="\\psi(x, t_i) & = \\dot\{x\}(t_\{i-1\}) + \\lambda(\\frac\{\\xi(x, t_i)-\\dot\{x\}(t_\{i-1\})\}\{\\Delta t\}, acceleration\\_limit) \\\\"
			var xi_part = "\\frac\{\\Eta(\\dot\{x\})-\\dot\{x\}(t_\{i-1\})\}\{\\Delta t\}"
			s+="\\xi(x, t_i) & = \\ddot\{x\}(t_\{i-1\}) + \\lambda(\\frac\{"+xi_part+"-\\ddot\{x\}(t_\{i-1\})\}\{\\Delta t\}, jerk\\_limit) \\\\"
		}
		if (settings.filterSettings.Stabilizer) {
			s+="\\Eta(v) & ="
			s+="\\frac\{v\}\{2\}\\cdot \\Bigg(\\tanh\\bigg(\\Big(\\frac\{\\lvert v\\rvert\}\{1-b\}\\Big)^\{1-a\}-\\pi\\bigg)"
			//s+="\\cdot \\tanh\\bigg(\\Big(\\frac\{x\}\{c\}\\Big)^2-d\\cdot\\pi\\bigg)\\Bigg) \\\\"
			s+="+1 \\Bigg) \\\\"
		}else{
			s+="\\Eta(v) & = v\\\\"
		}
		if (settings.filterSettings.TanhLimiter) {
			s+="\\lambda(x, k) & = \\frac\{k\}\{2\}\\cdot \\tanh(x/\\frac\{k\}\{2\})\\\\"
		}else{
			s+="\\lambda(x, k) & = min(k, max(-k, x))\\\\"
		}
		s+="\\end\{align\}"
		
		return s+"$"
	}

	CalculateFilter(dT, filterOrder) {
		
		if (filterOrder == FilterOrderEnum.First) {
			var [new_o, new_ov, new_oa, new_oj] = this.calculate1(dT, 	this.SP[0], this.O[0][0], this.O[0][1], this.O[0][2], this.Limits[0], 
																		this.Smoothing[0], this.Smoothing[1], this.Smoothing[2], this.Smoothing[3])
			/*var [v, o_v1, a_rel, o_a1, j_rel] = this.calculateDerivatives(dT, 	this.SP[0], this.O[0][0], this.O[0][1], this.O[0][2], 
																				this.Smoothing[0], this.Smoothing[1], this.Smoothing[2], this.Smoothing[3], this.useStabilizer)
			var [new_o, new_ov, new_oa, new_oj] = this.transfer1(dT, v, j_rel, o_a1, o_v1, this.O[0][0], this.Limits[0])*/
		}
		else if (filterOrder == FilterOrderEnum.Second) {
			var [new_o, new_ov, new_oa, new_oj] = this.calculate2(dT, 	this.SP[0], this.O[0][0], this.O[0][1], this.O[0][2], this.Limits[0], this.Limits[1], 
																		this.Smoothing[0], this.Smoothing[1], this.Smoothing[2], this.Smoothing[3])
			/*var [v, o_v1, a_rel, o_a1, j_rel] = this.calculateDerivatives(dT, 	this.SP[0], this.O[0][0], this.O[0][1], this.O[0][2], 
																				this.Smoothing[0], this.Smoothing[1], this.Smoothing[2], this.Smoothing[3], this.useStabilizer)
			var breaking = sign(o_v1) !== sign(a_rel)
			var [new_o, new_ov, new_oa, new_oj] = this.transfer2(dT, v, j_rel, o_a1, o_v1, this.O[0][0], breaking ? this.Limits[2] : this.Limits[1], this.Limits[0])*/
		} else {
			var [new_o, new_ov, new_oa, new_oj] = this.calculate3(dT, 	this.SP[0], this.O[0][0], this.O[0][1], this.O[0][2], this.Limits[0], this.Limits[1], this.Limits[3], 
																		this.Smoothing[0], this.Smoothing[1], this.Smoothing[2], this.Smoothing[3])
			/*var [v, o_v1, a_rel, o_a1, j_rel] = this.calculateDerivatives(dT, 	this.SP[0], this.O[0][0], this.O[0][1], this.O[0][2], 
																				this.Smoothing[0], this.Smoothing[1], this.Smoothing[2], this.Smoothing[3], this.useStabilizer)
			var breaking = sign(o_v1) !== sign(a_rel)
			var [new_o, new_ov, new_oa, new_oj] = this.transfer3(dT, v, j_rel, o_a1, o_v1, this.O[0][0], this.Limits[3], breaking ? this.Limits[2] : this.Limits[1], this.Limits[0], this.name==0)*/
		}
		this.O[0] = rollVector3(this.O[0], new_o)
		this.O[1] = rollVector3(this.O[1], new_ov)
		this.O[2] = rollVector3(this.O[2], new_oa)
		this.O[3] = rollVector3(this.O[3], new_oj)
	}


	stabilizer(v, a=1, b=1, c = 1, d = 0) {
		a = this.Smoothing[0]
		b = this.Smoothing[1]
		//c = this.Smoothing[2]
		c=1
		if (!this.useStabilizer) return v
		if (Math.abs(v) <= precision) return 0
		var s, f2, f3, f, g
		s = sign(v)
		v = Math.abs(v)
		/*a = Math.max(0, a)
		b = Math.max(nearZero, b)*/
		c = Math.max(0.00000001, c)
		//if (b == 1) a = 1;
		f2 = Math.tanh(Math.pow(v/(1-b),(1-a))-Math.PI)
		f = f2
		g = (f+1)/2
		return s*v*g
	}

	calculateDerivatives(dT, sp, o1, o2, o3, smoothenA, smoothenB, smoothenC, smoothenD) {
		var v = deriv(sp, o1, dT)
		var v_corrected = v
		if (Math.abs(v_corrected) < precision) v_corrected = 0
		if (this.useStabilizer && v_corrected!=0) v_corrected = stabilizer(v_corrected)
		var v_tMinus1 = deriv(o1, o2, dT)
		var v_tMinus2 = deriv(o2, o3, dT)
		var a_corrected = deriv(v_corrected, v_tMinus1, dT)
		var a_tMinus1 = deriv(v_tMinus1, v_tMinus2, dT)
		var j_rel = deriv(a_corrected, a_tMinus1, dT)
		return [v, v_tMinus1, a_corrected, a_tMinus1, j_rel]
	}

	transfer3(dT, v, j, a1, v1, o1, limJ, limA, limV) {
		var newj = limit(j, limJ, this.useTanhLimiter)
		var newv = v1 + a1*dT + newj*dT*dT/2
		newv = limit(newv, limV, this.useTanhLimiter)
		var newa = deriv(newv, v1, dT)
		newa = limit(newa, limA, this.useTanhLimiter)
		newj = deriv(newa, a1, dT)
		newj = limit(newj, limJ, this.useTanhLimiter)
		return makeOutputFromJerk(dT, o1, v1, a1, newv, newa, newj, FilterOrderEnum.Third)
	}

	calculate3(dT, x, x_1, x_2, x_3, limV, limA, limJ, smoothenA, smoothenB, smoothenC, smoothenD) {
		var newj, newa, newv, newx

		var xD = deriv(x, x_1, dT)
		xD = this.stabilizer(xD)

		var xD_1 = deriv(x_1, x_2, dT)
		var xD_2 = deriv(x_2, x_3, dT)
		var xDD_1 = deriv(xD_1, xD_2, dT)
		var xDD = deriv(xD, xD_1, dT)
		var xDDD = deriv(xDD, xDD_1, dT)
		
		newj = limit(xDDD, limJ, this.useTanhLimiter)
		newa = xDD_1 +newj*dT
		newa = limit(newa, limA, this.useTanhLimiter)
		newv = xD_1 + newa*dT
		newv = limit(newv, limV, this.useTanhLimiter)
		newx = x_1 + newv*dT

		var xD_2 = deriv(x_2, x_3, dT)
		var xDD_1 = deriv(xD_1, xD_2, dT)

		newa = deriv(newv, xD_1, dT)
		newj = deriv(newa, xDD_1, dT)
		return [newx, newv, newa, newj]
	}

	
	calculate2(dT, x, x_1, x_2, x_3, limV, limA, smoothenA, smoothenB, smoothenC, smoothenD) {
		var newj, newa, newv, newx
		var xD = deriv(x, x_1, dT)
		xD = this.stabilizer(xD)

		var xD_1 = deriv(x_1, x_2, dT)
		var xDD = deriv(xD, xD_1, dT)

		newa = limit(xDD, limA, this.useTanhLimiter)
		newv = xD_1 + newa*dT
		newv = limit(newv, limV, this.useTanhLimiter)
		newx = x_1 + newv*dT

		var xD_2 = deriv(x_2, x_3, dT)
		var xDD_1 = deriv(xD_1, xD_2, dT)

		newa = deriv(newv, xD_1, dT)
		newj = deriv(newa, xDD_1, dT)
		return [newx, newv, newa, newj]
	}
	calculate1(dT, x, x_1, x_2, x_3, limV, smoothenA, smoothenB, smoothenC, smoothenD) {
		var newj, newa, newv, newx
		var xD = deriv(x, x_1, dT)
		xD = this.stabilizer(xD)

		newv = limit(xD, limV, this.useTanhLimiter)
		newx = x_1 + newv*dT

		var xD_1 = deriv(x_1, x_2, dT)
		var xDD = deriv(xD, xD_1, dT)
		var xD_2 = deriv(x_2, x_3, dT)
		var xDD_1 = deriv(xD_1, xD_2, dT)

		newa = deriv(newv, xD_1, dT)
		newj = deriv(newa, xDD_1, dT)
		return [newx, newv, newa, newj]
	}

	transfer1(dT, v, j, a1, v1, o1, limV) {
		var newv = v1 + a1*dT + j*dT*dT/2
		newv = limit(newv, limV, this.useTanhLimiter)
		var newa = deriv(newv, v1, dT)
		var newj = deriv(newa, a1, dT)
		return makeOutputFromJerk(dT, o1, v1, a1, newv, newa, newj, FilterOrderEnum.First)
	}
	//bom filtro 0.14, 0.583, -0.4, 5.7
	transfer2(dT, v, j, a1, v1, o1, limA, limV) {
		var newa = a1 + j*dT
		var newa = limit(newa, limA, this.useTanhLimiter)
		var newv = v1 + newa*dT
		newv = limit(newv, limV, this.useTanhLimiter)
		newa = deriv(newv, v1, dT)
		newa = limit(newa, limA, this.useTanhLimiter)
		var newj = deriv(newa, a1, dT)
		return makeOutputFromJerk(dT, o1, v1, a1, newv, newa, newj, FilterOrderEnum.Second)
	}
	calculateLimitedV(v, limV) {
		newv = limit(v, limV, this.useTanhLimiter)
		limitedV = limit(newv, limV, this.useTanhLimiter)
		if (Math.abs(newv) > Math.abs(limitedV)) newv = limitedV
		return newv
	}
}