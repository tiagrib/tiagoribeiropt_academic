var TrajectoryEnum = {
  Line: 1,
  Square: 2,
  Circle: 3,
  LineStep3D: 4,
  Random: 5
};

var settings;
var gui = new dat.GUI({ load: getPresetJSON(), preset: 'Paper-D', autoPlace: false});
var transferChart;
var plotCharts = []

var viewer;
var div_eq_order;
var div_eq;
var div_eqparam;
var loadingPreset = false;

var fontSizeMultiplier = 1.0;

var trajectories = new Map()
//var dpr = window.devicePixelRatio || 1;

function makeTrajectories() {
	trajectories.set(TrajectoryEnum.Line, new VectorStateMachine(
									new Map([	[0.0, [1, 0, 0]], 
												[0.5, [-1, 0, 0]]
											])))
	trajectories.set(TrajectoryEnum.Square, new VectorStateMachine(
										new Map([	[0.0, [1, 1, 0]], 
													[0.25, [1, -1, 0]], 
													[0.5, [-1, -1, 0]],
													[0.75, [-1, 1, 0]]
												])))
	trajectories.set(TrajectoryEnum.LineStep3D, new VectorStateMachine(makeLineStep3DTrajectory()))	
	trajectories.set(TrajectoryEnum.Circle, new VectorStateMachine(makeCircularTrajectory()))	
	trajectories.set(TrajectoryEnum.Random, new VectorStateMachine(makeRandomTrajectory()))	
}

function makeCircularTrajectory(count=50) {
	var t = 0
	var points = []
	var radius = 0.5*settings.trajectory.Size
	for (i=0; i<count; i++) {
		angle = (i / (count/2)) * Math.PI;
		x = (radius * Math.cos(angle));
		y = (radius * Math.sin(angle));
		points.push([t, [x, 0, y]])
		t+=1.0/count
	}
	return new Map(points)
}

function makeLineStep3DTrajectory(count=10) {
	var t = 0
	var points = []
	for (var c=0;c<count;c++) {
		points.push([t, [t*settings.trajectory.Size, t*settings.trajectory.Size, t*settings.trajectory.Size]])
		t+=1.0/count
	}
	return new Map(points)
}

function makeRandomTrajectory(count=10) {
	var t = 0
	var points = []
	/*points = [	[0.0, [-0.65,0,0]],
				[0.1, [0.765879,0,0]],
				[0.2, [0.38920974,0,0]],
				[0.3, [ 0.696850,0,0]],
				[0.4, [ 0.45437,0,0]],
				[0.5, [ -0.027315714,0,0]],
				[0.6, [-0.846512,0,0]],
				[0.7, [-0.87196,0,0]],
				[0.8, [-0.939779,0,0]],
				[0.9, [-0.8119909,0,0]]
			]
	return new Map(points)*/
	for (var c=0;c<count;c++) {
		x = (Math.random()-0.5)*2;
		y = (Math.random()-0.5)*2;
		z = (Math.random()-0.5)*2;
		points.push([t, [x, y, z]])
		t+=1.0/count
	}
	return new Map(points)
}

function runFilterViewer(	glContainer, controlsContainer, transferContainer, 
							plotContainerX, plotContainerY, plotContainerZ, 
							eqOrderDiv, equationDiv, equationParamsDiv) {
	viewer = initViewer(glContainer);
	div_eq_order = eqOrderDiv
	div_eq = equationDiv
	div_eqparam = equationParamsDiv

	fontSizeMultiplier = 1.0/dpr

	makeGUI(viewer.controls, controlsContainer);
	makeTrajectories()
	createGeometry();
	var plotContainers = [plotContainerX, plotContainerY, plotContainerZ]
	for (var i=0;i<channelsList.length;i++) {
		c  = channelsList[i]
		console.log('Create channel', c)
		filters3[i] = new NuttyFilter(c);
		outputChannels[i] = [0,0,0,0];
	}
	update();
	makeFilterGraphs(transferContainer, plotContainers)
	filterChanged()
	updateFilterEquations()
	updateTrajectoryGUI()
	animate();
}

function getXYZLabel(i) {
	return i==0 ? "X" : (i==1 ? "Y" : "Z" )
}

function makeFilterGraphs(transferContainer, plotContainers) {
	transferChart = makeBaseChart({
		container:transferContainer, 
		title:"", 
		yLabels: ['H(x)'],
		scaleTypeX:'logarithmic', 
		scaleTypeY:'logarithmic'
	});

	pushDataset(transferChart, [], 'H(x)', 'rgba(20, 150, 50, 1)', 3, 0, 'logarithmic', 'logarithmic', true, 0, false, '')
	pushDataset(transferChart, [], '\u03bb(H(x))', 'rgba(150, 50, 50, 1)', 3, 0, 'logarithmic', 'logarithmic', false, 0, false, '')
	pushDataset(transferChart, [], 'y=x', 'rgba(150, 150, 150, 1)', 2, 0, 'logarithmic', 'logarithmic', false, 0, true, '')

	for (i=0;i<plotContainers.length;i++) {
		plotChart = makeBaseChart({
			container:plotContainers[i], 
			title:"", 
			yLabels: ["Position", "Velocity", "Acceleration", "Jerk", "Set-Point"],
			yColors: ['rgba(30, 30, 30, 1)', 'rgba(0, 200, 0, 1)', 'rgba(0, 0, 250, 1)', 'rgba(230, 0, 0, 1)', 'rgba(100,100,100,1)'],
			scaleTypeX:'linear', 
			scaleTypeY:'linear'
		});
		pushDataset(plotChart, [], 'Position', 'rgba(30, 30, 30, 1)', 3, 0, 'linear', 'linear', true, 0, false, "Time (seconds)")
		pushDataset(plotChart, [], "Velocity", 'rgba(0, 200, 0, 1)', 2, 0, 'linear', 'linear', false, 1)
		pushDataset(plotChart, [], "Acceleration", 'rgba(0, 0, 250, 1)', 2, 0, 'linear', 'linear', false, 2)
		pushDataset(plotChart, [], "Jerk", 'rgba(230, 0, 0, 1)', 2, 0, 'linear', 'linear', false, 3)
		pushDataset(plotChart, [], "Set-Point", 'rgba(100, 100, 100, 1)', 2, 0, 'linear', 'linear', false, 4, true)
		plotChart.config.options.scales.yAxes[4].display=false;
		plotCharts.push(plotChart)
	}


	updateGraphs();
}

function pushDataset(chart, data, dataSetLabel, color, width, pointWidth, scaleTypeX='linear', scaleTypeY='linear', makeXAxis = true, axisId=0, dashed=false, xAxisLabel=null) {
	if (xAxisLabel == null) xAxisLabel = dataSetLabel
	isFirstDataset = chart.data.datasets.length==0
	dash = dashed ? [10,5] : []
	chart.data.labels.push(dataSetLabel);
	chart.data.datasets.push({
		label: dataSetLabel,
		fontSize: 12*fontSizeMultiplier,
		data: data,
		fill: false,
		borderDash: dash,
		borderColor: [color],
		borderWidth: width*fontSizeMultiplier,
		pointRadius: pointWidth*fontSizeMultiplier,
		backgroundColor: [color],
		yAxisID: "y-axis-"+axisId.toString()
	});
	if (makeXAxis) {
		newxAxes = {
			display: true,
			type: scaleTypeX,
			position: 'bottom',
			gridLines: {
				//zeroLineColor: "rgba(0,255,0,1)"
			},
			ticks: {
				callback: function(value, index, values) {//needed to change the scientific notation results from using logarithmic scale
	                return Number(value.toString().substring(0,7));//pass tick values as a string into Number function
	                return value
	            },
	            beginAtZero: true,
	            maxTicksLimit: 22,
	            fontSize: 12*fontSizeMultiplier
			},
			afterBuildTicks: function(self) {
				return
	        	self.ticks = []
			    self.ticks.push(0);
			    self.ticks.push(0.0005);
			    self.ticks.push(0.002);
			    self.ticks.push(0.01);
			    self.ticks.push(0.05);
			    self.ticks.push(0.2);
			    self.ticks.push(0.5);
			    self.ticks.push(1);
			    self.ticks.push(2);
			    self.ticks.push(5);
			    self.ticks.push(20);
			    self.ticks.push(90);
  			},
			scaleLabel: {
				display: true,
				labelString: xAxisLabel,
				fontSize: xAxisLabel==''?0:13*fontSizeMultiplier
			}
		}
		if (isFirstDataset) chart.config.options.scales.xAxes[0] = newxAxes;
		else chart.config.options.scales.xAxes.push(newxAxes);
	}
}

function makeBaseChart({container, title, datasets, yLabels, yColors=null, scaleTypeX='linear', scaleTypeY='linear'}) {
	yAxesList = []
	maxYTicks = Math.round(container.clientHeight/30)
	yFontSize = Math.min(12, container.clientWidth/50)
	for (var i=0;i<yLabels.length;i++) {
		color_i = yColors == null ? "#101010" : yColors[i]
		yAxesList.push({
			display:true,
			type: scaleTypeY,
			id: "y-axis-"+i.toString(),
			ticks: {
				beginAtZero: true,
				callback: function(value, index, values) {
                    		return Number(value.toString().substring(0,7));//pass tick values as a string into Number function
                },
                fontColor: color_i,
                maxTicksLimit: maxYTicks,
                fontSize: yFontSize*fontSizeMultiplier
			},
	        afterBuildTicks: function(self) {
	        	return
	        	self.ticks = []
			    self.ticks.push(0);
			    self.ticks.push(0.0005);
			    self.ticks.push(0.002);
			    self.ticks.push(0.01);
			    self.ticks.push(0.05);
			    self.ticks.push(0.2);
			    //self.ticks.push(0.4);
			    self.ticks.push(1);
			    //self.ticks.push(2);
			    self.ticks.push(5);
			    self.ticks.push(20);
			    self.ticks.push(90);
  			},
			gridLines: {
		        display: true,
		    	color: "rgba(80,99,255,0.2)"
		    },
		    scaleLabel: {
		    	display: true,
		    	labelString: yLabels[i],
		    	fontColor: color_i,
		    	fontSize: 13*fontSizeMultiplier
		    }
		});
	}
	var chart = new Chart.Line(container, {
		data: {labels: [], datasets: []},
		options: {
			title: {
				display: title==""?false:true ,
				text: title
			},

			legend: {
				labels: {
					useLineStyle: true,
					fontColor: "#000",
					fontSize: 12*fontSizeMultiplier
				}
			},
			maintainAspectRatio: false,
			responsive: true,
			stacked: false,
			elements: {
	            line: {
	                tension: 0 // disables bezier curves
	            }
        	},
	        scaleOverride: true,
			scales: {
				xAxes: [],
				yAxes: yAxesList
			}
		}
	});
	
	return chart;
}


var FilterViewerSettings = function(controller) {
	this.trajectory = {
		Size : 5,
		Interval: 10,
		Type: TrajectoryEnum.Square,
		NewRandom : trajectoryTypeChanged
	}
	
	this.filterSettings = {
		Order : FilterOrderEnum.First,
		TanhLimiter : true,
		Stabilizer : true
	}
	this.filterLimits = {
		MaxV : 100,
		MaxA : 500,
		MaxJ : 50000
	}
	this.filterTuning = {
		CoefficientA : 0.2,
		CoefficientB : 0.06,
		CoefficientC : 1.0,
		//CoefficientD : -0.2,
		AutoUpdate : false
	}
	this.show = {
		SetPoint : true,
		Position : true,
		Velocity : true,
		Acceleration : true,
		Jerk : true
	}
	this.controls = {
		ResetView : controller.reset,
		ResetObject : resetObject,
		ResetObjectOnFilterSettingsChange : true
	}
};

function resetObject(value) {
	for (var i=0;i<channelsList.length;i++) {
		trajType = parseInt(settings.trajectory.Type)
		startPos = trajectories.get(trajType).sample(0)
		filters3[i].Reset(startPos[i]*settings.trajectory.Size)
		outputChannels[i][1] = filters3[i].O[0][0];
	}
	lastTime = false
	lastPushedTime = 0
}

function motionChangedPreview(value) 
{
	updateMotionGraph(value);
}
function filterChangedPreview(value) 
{
	updateGraphs(value, 1000, settings.filterTuning.AutoUpdate);
}

function motionChanged(value) 
{
	updateMotionGraph(value);
}

function string_of_enum(e,value) 
{
  for (var k in e) if (e[k] == value) return k;
  return null;
}

function updateFilterEquations() {
	div_eq_order.innerText = "- " + string_of_enum(FilterOrderEnum, settings.filterSettings.Order) + " Order"
	div_eq.innerText = filters3[0].ToLatex(settings)
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,div_eq]);
}

function filterChanged(value) {
	for (var i=0;i<channelsList.length;i++) {
		filters3[i] = configureFilter(filters3[i])
	}
	div_eqparam.innerHTML  = filters3[0].ToHtmlParams(settings, 12/dpr)
	//div_eqparam.style.setProperty("font-size", parseFloat(getComputedStyle(document.getElementById("containerEquationParams")).fontSize)*(1.0/dpr) + "px");
	/*div_eqparam.innerText = filters3[0].ToLatexParams(settings.filterSettings.Order)
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,div_eqparam]);*/
	updateGraphs(value);
	if (settings.controls.ResetObjectOnFilterSettingsChange){
		resetObject()
	}
}

function configureFilter(filter) {
	filter.SetLimitsInRadians(settings.filterLimits.MaxV, settings.filterLimits.MaxA, settings.filterLimits.MaxA, settings.filterLimits.MaxJ)
	filter.SetSmoothing(settings.filterTuning.CoefficientA, settings.filterTuning.CoefficientB, settings.filterTuning.CoefficientC, 0)
	filter.useTanhLimiter = settings.filterSettings.TanhLimiter
	filter.useStabilizer = settings.filterSettings.Stabilizer
	return filter
}

function updateGraphs(value, resolution=4000, performUpdateMotionGraph=true) {
	updateTransferChart(value, resolution)
	if (performUpdateMotionGraph) updateMotionGraph(value)
}

var disabledOpacity = 0.2

function motionShowChanged(value) {
	if(typeof settings.filterSettings.Order =='string') settings.filterSettings.Order = parseInt(settings.filterSettings.Order)
	for (var axis=0;axis<3;axis++) 
	{
		plotCharts[axis].config.options.scales.yAxes[0].display=settings.show.Position;
		plotCharts[axis].config.options.scales.yAxes[1].display=settings.show.Velocity && settings.filterSettings.Order>=FilterOrderEnum.First;
		plotCharts[axis].config.options.scales.yAxes[2].display=settings.show.Acceleration && settings.filterSettings.Order>=FilterOrderEnum.Second;
		plotCharts[axis].config.options.scales.yAxes[3].display=settings.show.Jerk && settings.filterSettings.Order>=FilterOrderEnum.Third;

		for (var i=0;i<4;i++) {
			plotCharts[axis].data.datasets[i].hidden = !plotCharts[axis].config.options.scales.yAxes[i].display;
		}
		plotCharts[axis].data.datasets[4].hidden = !settings.show.SetPoint;
		
		plotCharts[axis].update(0);
	}
	maxJctrl = getController(gui, settings.filterLimits, gui_folder_text_limits, "MaxJ").domElement
	maxActrl = getController(gui, settings.filterLimits, gui_folder_text_limits, "MaxA").domElement
	maxVctrl = getController(gui, settings.filterLimits, gui_folder_text_limits, "MaxV").domElement
	showJctrl = getController(gui, settings.show, gui_folder_text_visibility, "Jerk")
	showVctrl = getController(gui, settings.show, gui_folder_text_visibility, "Velocity")
	showActrl = getController(gui, settings.show, gui_folder_text_visibility, "Acceleration")

	
	if (settings.filterSettings.Order>=FilterOrderEnum.First) {
		maxVctrl.style.pointerEvents = ""
		maxVctrl.style.opacity = 1;
		showVctrl.domElement.style.opacity = 1;
		showVctrl.__checkbox.disabled = false
	}else{
		maxVctrl.style.pointerEvents = "none"
		maxVctrl.style.opacity = disabledOpacity;
		showVctrl.domElement.style.opacity = disabledOpacity;
		showVctrl.__checkbox.disabled = true
	}

	if (settings.filterSettings.Order>=FilterOrderEnum.Second) {
		maxActrl.style.pointerEvents =  ""
		maxActrl.style.opacity = 1;
		showActrl.domElement.style.opacity = 1;
		showActrl.__checkbox.disabled = false
	} else {
		maxActrl.style.pointerEvents =  "none"
		maxActrl.style.opacity = disabledOpacity;
		showActrl.domElement.style.opacity = disabledOpacity;
		showActrl.__checkbox.disabled = true
	}

	if (settings.filterSettings.Order>=FilterOrderEnum.Third) {
		maxJctrl.style.pointerEvents =  ""
		maxJctrl.style.opacity = 1;
		showJctrl.domElement.style.opacity = 1;
		showJctrl.__checkbox.disabled = false
	} else {
		maxJctrl.style.pointerEvents =  "none"
		maxJctrl.style.opacity = disabledOpacity;
		showJctrl.domElement.style.opacity = disabledOpacity;
		showJctrl.__checkbox.disabled = true
	}
}

function updateMotionGraph(value, resolution=1000) 
{
	if (loadingPreset) return
	num_graphs = 4
	motionShowChanged(value)
	var orderCount = parseInt(settings.filterSettings.Order+1)
	console.log(orderCount)
	dT = settings.trajectory.Interval/resolution;
	trajType = parseInt(settings.trajectory.Type)
	startPos = trajectories.get(trajType).sample(0)
	for (var axis=0;axis<3;axis++) {
		newData = Array(orderCount)
		for (var d=0;d<orderCount-1;d++) 
		{
			newData[d] = new Array(resolution)
		}
		setpoint_data = new Array(resolution)
		
		
		minX = Array(orderCount).fill(Number.MAX_VALUE);
		minY = Array(orderCount).fill(Number.MAX_VALUE);
		maxX = Array(orderCount).fill(-Number.MAX_VALUE);
		maxY = Array(orderCount).fill(-Number.MAX_VALUE);
		
		filter = new NuttyFilter(axis);
		filter = configureFilter(filter)
		filter.Reset(startPos[axis]*settings.trajectory.Size)
		if (!trajectories.has(trajType)) return

		for(var i=0;i<resolution;i++) {
			vX = i*dT
			trajectoryPosition = vX / settings.trajectory.Interval
			v = trajectories.get(trajType).sample(trajectoryPosition)
			point = v.map(function(x) { return (x*settings.trajectory.Size)});
			filter.Run(point[axis], dT, settings.filterSettings.Order)
			for (var d=0;d<orderCount-1;d++) 
			{
				newData[d][i] = {x: vX, y:filter.O[d][0]}
			}
			setpoint_data[i] = {x: vX, y:point[axis]}
		}
		plotCharts[axis].config.options.scales.xAxes[0].ticks.max = settings.trajectory.Interval;
		plotCharts[axis].config.options.scales.xAxes[0].ticks.min = 0;
		limits = [0, settings.filterLimits.MaxV, settings.filterLimits.MaxA, settings.filterLimits.MaxJ]
		for (var d=0;d<orderCount-1;d++) 
		{
			if (d>0) {
				plotCharts[axis].config.options.scales.yAxes[d].ticks.max = limits[d];
				plotCharts[axis].config.options.scales.yAxes[d].ticks.min = -limits[d];
			}
			plotCharts[axis].data.datasets[d].data = newData[d];
		}
		plotCharts[axis].data.datasets[4].data = setpoint_data;
		//plotCharts[axis].data.datasets[0].data = []
		
		//plotCharts[axis].data.datasets[1].data = newData[1];
		plotCharts[axis].update(0)
	}	
}

function updateTransferChart(value, resolution=1000)
{
	if (loadingPreset) return
	xy = []
	newData = []
	newDataLimited = []
	minY = settings.filterLimits.MaxV;
	maxY = 0;
	maxX = 0;
	if (settings.filterSettings.Stabilizer) {	
		filter = new NuttyFilter(0);
		filter = configureFilter(filter)
		filter.Reset(0)
		for (i=0;i<resolution;i++) {
			vX = i/resolution;
			vX = 2*settings.filterLimits.MaxV*Math.pow(vX, 1000*vX+4)
			fX = filter.stabilizer(vX)
			//b=1.0
			//a=1.0
			//fX = (Math.tanh(Math.pow(vX/b,a)-Math.PI)+1)/2

			vY = vX*fX

			vX = Math.max(0.0001, vX)
			vY = Math.max(0.0001, vY)

			if (i==resolution-1){
				xPow = Math.pow(10, Math.round(vX).toString().length-1)
				yPow = Math.pow(10, Math.round(vY).toString().length-1)
				maxX = Math.max(maxX, Math.ceil(vX/xPow)*xPow*1.0);
				maxY = Math.max(maxY, Math.ceil(vY/yPow)*yPow*1.0);
			}
			else{
				minY = Math.min(minY, vY);
			}
			maxY = Math.max(maxY, vY);
			maxX = Math.max(maxX, vX);
			if (i==0) {
				newData.push({x:0, y:0})
				newDataLimited.push({x:0, y:0})
				xy.push({x:0, y:0})
			}else{
				newData.push({x:vX, y:vY});
				newDataLimited.push({x:vX, y:limit(vY, settings.filterLimits.MaxV, true)});
				xy_value = settings.filterLimits.MaxV*i/resolution
				xy.push({x:xy_value, y:xy_value})
			}
		}
	}
	//console.log(newData)
	transferChart.config.options.scales.yAxes[0].ticks.max = settings.filterLimits.MaxV;
	transferChart.config.options.scales.yAxes[0].ticks.min = minY;
	transferChart.config.options.scales.xAxes[0].ticks.max = settings.filterLimits.MaxV*1;
	transferChart.data.datasets[0].data = newData;
	transferChart.data.datasets[1].data = newDataLimited;
	transferChart.data.datasets[2].data = xy;
	transferChart.update(0)
}

function CommitGraphPoint(vX, vY, minX, minY, maxX, maxY, isLast) {
	if (isLast) {
		xPow = Math.pow(10, Math.round(vX).toString().length-1)
		yPow = Math.pow(10, Math.round(vY).toString().length-1)
		vXtest = Math.ceil(vX/xPow)*xPow*1.0
		vYtest = Math.ceil(vY/yPow)*yPow*1.0
		maxX = Math.max(maxX, vXtest);
		maxY = Math.max(maxY, vYtest);
		minX = Math.min(minX, vXtest);
		minY = Math.min(minY, vYtest);
	} else { 
		maxX = Math.max(maxX, vX);
		maxY = Math.max(maxY, vY);
		minX = Math.min(minX, vX);
		minY = Math.min(minY, vY);
	}
	return [{x: vX, y:vY}, minX, minY, maxX, maxY]
}

function getPresetJSON() {
	preset = {
		"preset": "Light",
		"closed": false,
		"remembered": {},
		"folders": {
		    "Trajectory": {
		      "preset": "Default",
		      "closed": false,
		      "folders": {}
		    },
		    "Filter Settings": {
		      "preset": "Default",
		      "closed": false,
		      "folders": {}
		    },
		    "Character Control (transfer function)": {
		      "preset": "Default",
		      "closed": false,
		      "folders": {}
		    },
		    "Kinematic Limits": {
		      "preset": "Default",
		      "closed": false,
		      "folders": {}
		    },
		    "Plot Visibility": {
		      "preset": "Default",
		      "closed": false,
		      "folders": {}
		    },
		    "Object/3D Controls": {
		      "preset": "Default",
		      "closed": false,
		      "folders": {}
		    }
		}
	}
	for (var p in Presets) {
		preset.remembered[p] = {
			"0": {
				"Order": FilterOrderEnum.Third,
				"Stabilizer": true,
				"TanhLimiter": true
			},
			"2": {
				"CoefficientA": Presets[p][0][0],
				"CoefficientB": Presets[p][0][1],
				"CoefficientC": Presets[p][0][2]
				///*"CoefficientD": Presets[p][0][2],
				
			},
			"1": {
				"MaxV": Presets[p][1][0],
				"MaxA": Presets[p][1][1],
				"MaxJ": Presets[p][1][3]
			}
		}
	}
	return preset
}

gui_folder_text_trajectory = 'Trajectory'
gui_folder_text_settings = 'Filter Settings'
gui_folder_text_tuning = 'Character Control (transfer function)'
gui_folder_text_limits = 'Kinematic Limits'
gui_folder_text_visibility = 'Plot Visibility'
gui_folder_text_controls = 'Object/3D Controls'

gui_folder_dom = {}

function makeGUI(controller, controlsContainer) {
	settings = new FilterViewerSettings(controller);
	gui.remember(settings.filterSettings);
	gui.remember(settings.filterLimits);
	gui.remember(settings.filterTuning);
	var f_traj = gui.addFolder(gui_folder_text_trajectory);
	f_traj.open()
	gui_folder_dom[gui_folder_text_trajectory] = f_traj
	var f_filterSettings = gui.addFolder(gui_folder_text_settings);
	f_filterSettings.open()
	var f_filterTuning = gui.addFolder(gui_folder_text_tuning);
	f_filterTuning.open()
	var f_limits = gui.addFolder(gui_folder_text_limits);
	f_limits.open()
	var f_vis = gui.addFolder(gui_folder_text_visibility);
	f_vis.open()
	var f_controls = gui.addFolder(gui_folder_text_controls);
	f_controls.open()

	ctrlTime = f_traj.add(settings.trajectory, 'Interval', 1, 30).name('Duration');
	ctrlTrajSize = f_traj.add(settings.trajectory, 'Size', 1, 10).name('Length');
	ctrlTrajType = f_traj.add(settings.trajectory, 'Type', {'Line':TrajectoryEnum.Line, 'Square':TrajectoryEnum.Square, 'Circle':TrajectoryEnum.Circle, 'LineStep3D':TrajectoryEnum.LineStep3D, 'Random':TrajectoryEnum.Random});
	f_traj.add(settings.trajectory, 'NewRandom');

	ctrlFilterOrder = f_filterSettings.add(settings.filterSettings, 'Order', {'First':FilterOrderEnum.First, 'Second':FilterOrderEnum.Second, 'Third':FilterOrderEnum.Third});
	stabilizerChanged = f_filterSettings.add(settings.filterSettings, 'Stabilizer').name("Character Control");
	tanhLimiterChanged = f_filterSettings.add(settings.filterSettings, 'TanhLimiter').name("Use Tanh Limiter")

	var ctrlV = f_limits.add(settings.filterLimits, 'MaxV', 1, 100).name('Max Velocity');
	var ctrlA = f_limits.add(settings.filterLimits, 'MaxA', 1, 1000).name('Max Acceleration');
	var ctrlJ = f_limits.add(settings.filterLimits, 'MaxJ', 1, 100000).name('Max Jerk');
	var ctrlCA = f_filterTuning.add(settings.filterTuning, 'CoefficientA', 0.0, 1.0).name('Smooth');
	var ctrlCB = f_filterTuning.add(settings.filterTuning, 'CoefficientB', 0.00001, 0.9999999).name('Responsive');
	//var ctrlCC = f_filterTuning.add(settings.filterTuning, 'CoefficientC', 0.0, 100).name('Energy Exponent');
	//var ctrlCD = f_filterTuning.add(settings.filterTuning, 'CoefficientD', -1.0, 1.0).name('Release Smooth');
	
	f_filterTuning.add(settings.filterTuning, 'AutoUpdate').name('Auto Update Graphs');
	
	
	showSP = f_vis.add(settings.show, 'SetPoint').name("Show Set-Point")
	showP = f_vis.add(settings.show, 'Position').name("Show Position");
	showV = f_vis.add(settings.show, 'Velocity').name("Show Velocity");
	showA = f_vis.add(settings.show, 'Acceleration').name("Show Accel.");
	showJ = f_vis.add(settings.show, 'Jerk').name("Show Jerk");
	f_controls.add(settings.controls, 'ResetView').name("Reset Camera");
	f_controls.add(settings.controls, 'ResetObject').name("Reset Motion");
	f_controls.add(settings.controls, 'ResetObjectOnFilterSettingsChange').name('Reset on change');
	
	stabilizerChanged.onFinishChange(filterChangedRewriteEquations);
	tanhLimiterChanged.onFinishChange(filterChangedRewriteEquations);

	showSP.onChange(motionShowChanged);
	showP.onChange(motionShowChanged);
	showV.onChange(motionShowChanged);
	showA.onChange(motionShowChanged);
	showJ.onChange(motionShowChanged);

	ctrlV.onChange(motionChangedPreview);
	ctrlA.onChange(motionChangedPreview);
	ctrlJ.onChange(motionChangedPreviewJerk);
	ctrlCA.onChange(filterChangedPreview);
	ctrlCB.onChange(filterChangedPreview);
	//ctrlCC.onChange(filterChangedPreview);
	//ctrlCD.onChange(filterChangedPreview);

	ctrlV.onFinishChange(filterChanged);
	ctrlA.onFinishChange(filterChanged);
	ctrlJ.onFinishChange(filterChangedJerk);
	ctrlCA.onFinishChange(filterChanged);
	ctrlCB.onFinishChange(filterChanged);
	//ctrlCC.onFinishChange(filterChanged);
	//ctrlCD.onFinishChange(filterChanged);

	ctrlTime.onChange(motionChangedPreview);
	ctrlTime.onFinishChange(motionChanged);
	ctrlTrajSize.onChange(motionChangedPreview);
	ctrlTrajSize.onFinishChange(trajSizeChanged);
	ctrlFilterOrder.onChange(filterOrderChanged);
	ctrlTrajType.onChange(trajectoryTypeChanged);
	//gui.__ul.childNodes[1].classList += ' longtext';
	//gui.__ul.childNodes[2].classList += ' full_width';
	controlsContainer.appendChild(gui.domElement);
}

function filterChangedRewriteEquations(value) {
	filterChanged()
	updateFilterEquations()
	elem_a = getController(gui, settings.filterTuning, gui_folder_text_tuning, "CoefficientA").domElement
	elem_b = getController(gui, settings.filterTuning, gui_folder_text_tuning, "CoefficientB").domElement
	//elem_c = getController(gui, settings.filterTuning, gui_folder_text_tuning, "CoefficientC").domElement
	//elem_d = getController(gui, settings.filterTuning, gui_folder_text_tuning, "CoefficientD").domElement
	if (settings.filterSettings.Stabilizer) {
		elem_a.style.pointerEvents = ""
		elem_a.style.opacity = 1;
		elem_b.style.pointerEvents = ""
		elem_b.style.opacity = 1;
		/*elem_c.style.pointerEvents = ""
		elem_c.style.opacity = 1;*/
		/*elem_d.style.pointerEvents = ""
		elem_d.style.opacity = 1;*/
	}else{
		elem_a.style.pointerEvents = "none"
		elem_a.style.opacity = disabledOpacity;
		elem_b.style.pointerEvents = "none"
		elem_b.style.opacity = disabledOpacity;
		/*elem_c.style.pointerEvents = "none"
		elem_c.style.opacity = disabledOpacity;*/
		/*elem_d.style.pointerEvents = "none"
		elem_d.style.opacity = disabledOpacity;*/
	}
}

function motionChangedPreviewJerk(value) 
{
	if (loadingPreset) {
		console.log("finished loading preset.")
		loadingPreset = false
		updateGraphs()
		filterChanged()
		resetObject()
	}else{
		motionChangedPreview(value)
	}
}

function filterChangedJerk(value) 
{
	if (loadingPreset) {
		console.log("finished loading preset.")
		loadingPreset = false
		updateGraphs()
		filterChanged()
		resetObject()
	}else{
		motionChanged(value)
	}
}

var t0 = performance.now();

function filterOrderChanged(value) {
	stack = new Error().stack
	if (stack.includes("each@")) {
		loadingPreset = true
		console.log("loading preset...")
	}
	else{
		filterChanged(value)
	}
	updateFilterEquations()
}

function trajSizeChanged(value) {
	updateTrajectoryGUI()
	motionChanged(value)
}

var trajectoryPathObjects = []

function updateTrajectoryGUI() {
	newRandomButton = getController(gui, settings.trajectory, gui_folder_text_trajectory, "NewRandom").domElement
	if (settings.trajectory.Type==TrajectoryEnum.Random) {
		newRandomButton.children[0].innerText = "";
	}else{
		newRandomButton.children[0].innerText = "(deactivated)";
	}

	for (var i=0;i<trajectoryPathObjects.length;i++) {
		scene.remove(trajectoryPathObjects[i])
		//trajectoryPathObjects[i].dispose()
	}
	trajectoryPathObjects = []
	trajType = parseInt(settings.trajectory.Type)
	traj = trajectories.get(trajType)
	firstValue = null
	for (i=0;i<traj.index.length-1;i++) {
		percent = traj.index[i]
		value = traj.sample(percent)
		if (i==0) firstValue = value
		if (i==traj.index.length-2){
			nextValue = firstValue
		} else {
			nextValue = traj.sample(traj.index[i+1])
		}
		var dir = new THREE.Vector3( nextValue[0]-value[0], nextValue[1]-value[1], nextValue[2]-value[2]);
		dir.multiplyScalar(settings.trajectory.Size)
		var length = dir.length();
		dir.normalize();
		var start = new THREE.Vector3(value[0], value[1], value[2]);
		start.multiplyScalar(settings.trajectory.Size)
		var color = 0xffff00;
		var arrowHelper = new THREE.ArrowHelper( dir, start, length, color, 1);
		trajectoryPathObjects.push(arrowHelper)
		scene.add( arrowHelper );
	}
}

function trajectoryTypeChanged(value) {
	trajectories.set(TrajectoryEnum.Random, new VectorStateMachine(makeRandomTrajectory()))	
	motionChanged(value);
	updateTrajectoryGUI()
}

function getController(gui, object, folder, property)
{
  for (var i = 0; i < gui.__folders[folder].__controllers.length; i++)
  {
    var controller = gui.__folders[folder].__controllers[i];
    if (controller.object == object && controller.property == property)
      return controller;
  }
  return null;
}


var lastPushedTime = 0;
var lastPushDirection = 1

function getTrajectoryTarget(settings, lastTime = null, elapsedTime = null) {
	if (!lastTime) {
		if (lastPushedTime == 0) {
			lastPushedTime = clock.elapsedTime;
			return [0,0,0]
		}
		elapsed = (clock.elapsedTime-lastPushedTime) % settings.trajectory.Interval
	}
	else{
		elapsed = (elapsedTime-lastTime) % settings.trajectory.Interval
	}
	trajType = parseInt(settings.trajectory.Type)
	if (trajectories.has(trajType)) {
		trajectoryPosition = elapsed / settings.trajectory.Interval
		v = trajectories.get(trajType).sample(trajectoryPosition)
		return v.map(function(x) { return x*settings.trajectory.Size});
	}else{
		return [0,0,0]
	}
}

function createGeometry() {
	var geometry = new THREE.TorusKnotGeometry(1, 0.5, 200, 50);
	var material = new THREE.MeshPhysicalMaterial( { 
		color: 0xFFFFFF,
	    roughness: 0.9,
	    metalness: 0.3,
	    clearCoat: 0.3,
	    clearCoatRoughness: 0.4,
	    reflectivity: 0.5
	} );
	objects['obj'] = new THREE.Mesh( geometry, material );
	scene.add(objects['obj']);

	var geometry = new THREE.SphereGeometry(0.9, 30, 30);
	var material = new THREE.MeshPhysicalMaterial( { 
		color: 0x111111,
	    roughness: 0.9,
	    metalness: 0.3,
	    clearCoat: 0.3,
	    clearCoatRoughness: 0.4,
	    reflectivity: 0.5
	} );
	objects['setpoint'] = new THREE.Mesh( geometry, material );
	scene.add(objects['setpoint']);
}

var motionX = [0,0,0];
var motionY = [0,0,0];
var motionZ = [0,0,0];
var channelsList = ['filterX', 'filterY', 'filterZ']
var filters3 = {}
var outputChannels = {}

function applyFilter3(dT) {
	if (dT <= 0) return;
	for (var i=0;i<channelsList.length;i++) {
		filters3[i].Run(outputChannels[i][0], dT, settings.filterSettings.Order)
		outputChannels[i][1] = filters3[i].O[0][0];
	}
}


var animate = function (now) {
	if (!isDefined(settings)) return;
	requestAnimationFrame( animate );
	dT = clock.getDelta();
	[spX, spY, spZ] = getTrajectoryTarget(settings);

	objects['setpoint'].position.x = spX;
	objects['setpoint'].position.y = spY;
	objects['setpoint'].position.z = spZ;

	outputChannels[0][0] = spX
	outputChannels[1][0] = spY
	outputChannels[2][0] = spZ
	applyFilter3(dT);
	pos = objects['obj'].position;
	pos.x = outputChannels[0][1]
	pos.y = outputChannels[1][1]
	pos.z = outputChannels[2][1]
	objects['obj'].position = pos
	update();
};



