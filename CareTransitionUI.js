var checkBox = function(app) {

    // local private variable
    var self = this;
    var checkBox;

    self.addCheckBox = function(checkBoxAttr) {

    	checkBox = app.svg.rect(checkBoxAttr.x, checkBoxAttr.y, checkBoxAttr.size,
                                    checkBoxAttr.size);

    	checkBox.attr({
                id: checkBoxAttr.id,
                class: checkBoxAttr.class,
                fill: checkBoxAttr.fill,
                stroke: checkBoxAttr.stroke,
                strokeWidth: checkBoxAttr.strokeWidth
        });

       self.checked(checkBoxAttr.checked, checkBoxAttr.fill);

        return self;
    },

    self.checked = function(isCheck, fill) {
    	if(isCheck)
    		checkBox.attr('fill', fill);
    	else
    		checkBox.attr('fill','none');

    	return self;
    },

    self.addTitle = function(checkBoxAttr) {
    	var title = app.makeText(checkBoxAttr.x, checkBoxAttr.y, checkBoxAttr.size,
                                     checkBoxAttr.text, checkBoxAttr.stroke, checkBoxAttr.color);
    	title.attr({
    		id:checkBoxAttr.id,
    		class:checkBoxAttr.class
    	});

    	return self;
    }

    return self;
};

var textBox = function(app) {

    var self = this;
    var textBox;
    var title;

    self.addTextBox = function(textBoxAttr) {
        textBox = app.svg.rect(textBoxAttr.x, textBoxAttr.y, textBoxAttr.sizeX,
            textBoxAttr.sizeY);

        textBox.attr({
            id: textBoxAttr.id,
            class: textBoxAttr.class,
            fill:'white',
            stroke:'black',
            strokeWidth:0.05
        });
    },

    self.addText = function(textBoxAttr) {
        title = app.makeText(textBoxAttr.x, textBoxAttr.y, textBoxAttr.size,
            textBoxAttr.text, textBoxAttr.stroke, textBoxAttr.color);
        title.attr({
            id:textBoxAttr.id,
            class:textBoxAttr.class
        });

        return self;
    },

    self.getTextContent = function() {
      return title.node.textContent;
    },

    self.setTextContent = function(text) {
        title.node.textContent = text;

        return self;
    },

    self.isSelected = function(selected) {
        if(selected)
            d3.select('#stickyTextBox')
                .style('stroke-width','0.2');
        else
            d3.select('#stickyTextBox')
                .style('stroke-width','0.05');

        return self;
    }

    return self;
};

var radioButton = function(app) {

    // local private variable
    var self = this;
    var radioButton;
    var roundness = 2;

    self.addRadioButton = function(radioButtonAttr) {

    	radioButton = app.svg.rect(radioButtonAttr.x, radioButtonAttr.y, radioButtonAttr.size,
                                     radioButtonAttr.size,roundness);

    	radioButton.attr({
                id: radioButtonAttr.id,
                class: radioButtonAttr.class,
                fill: radioButtonAttr.fill,
                stroke: radioButtonAttr.stroke,
                strokeWidth: radioButtonAttr.strokeWidth
        });

       self.selected(radioButtonAttr.selected, radioButtonAttr.fill);

        return self;
    }

    self.selected = function(isSelected, fill) {
    	if(isSelected)
    		radioButton.attr('fill', fill);
    	else
    		radioButton.attr('fill','none');

    	return self;
    }

    self.addTitle = function(radioButtonAttr) {
    	var title = app.makeText(radioButtonAttr.x, radioButtonAttr.y, radioButtonAttr.size, 
                                    radioButtonAttr.text, radioButtonAttr.stroke, radioButtonAttr.color);
    	title.attr({
    		id:radioButtonAttr.id,
    		class:radioButtonAttr.class
    	});

    	return self;
    }

    return self;
};

var interaction = function(app) {

    var self= this;
    var position = {x: 0, y: 0};
    var action = {HOVER: 'pointerMove',
        CLICK: 'pointerRelease'};
    var actionFrom = {RECT:'RECT',
        IMG: 'IMG',
        NONE: 'NONE'};
    var views = {PATIENTSLIST:0,
        PATIENTSINGLE:1};
    var buttons = {HOMEBUTTON:'#homeButton',
        ANOMALYBUTTON:'#anomalyButtonRect',
        COMPAREPREVDAYBUTTON:'#comparePrevDayButtonRect',
        DAY1BUTTON: '#day1ButtonRect',
        DAY2BUTTON: '#day2ButtonRect',
        DAY3BUTTON: '#day3ButtonRect',
        NOTES: '#noteCheckBox',
        STICKYTEXTBOX: '#stickyTextBox'};
    var checkBoxs = {ANOMALY: 0,
        COMPAREPREVDAY: 0,
        NOTES: 0};
    var radioButtons = {DAY1: 0,
        DAY2: 0,
        DAY3: 1};
    var textBoxs ={
        STICKYTEXTBOX: 1
    };
    var currentView = null;
    var currentDay = 4;
    var width = 0;
    var height = 0;

    self.setPosition = function(x, y) {
        position.x = x;
        position.y = y;

        return self;
    },

    self.getPosition = function(x, y) {
        return position;
    },

    self.getCurrentView = function() {
        
        return currentView;
    },

    self.setAspect = function(w,h) {
        width = w;
        height = h;
    },

    self.getAspect = function() {
        
        return {width: width, height: height};
    },

    self.isViewPatientsList = function() {
        if(currentView == views.PATIENTSLIST)
            return true;

        return false;
    },

    self.isViewPatientSingle = function() {
        if(currentView == views.PATIENTSINGLE)
            return true;

        return false;
    },

    self.changeView = function(view) {
        var self = this;

        if(view !='None')
        {
            if(view != 'resize')
                currentView = !view ? views.PATIENTSLIST: view;

            if (currentView == views.PATIENTSLIST)
                return 'patientsList';
            else if (currentView == views.PATIENTSINGLE)
                return 'patientSingle';
        }

    },

    self.isHover = function(userAction) {
        if(userAction == action.HOVER)
            return true;

        return false;
    },

    self.isClick = function(userAction) {
        if(userAction == action.CLICK)
            return true;

        return false;
    },

    self.isAction = function(list, caller) {
      var self = this;
        var listElementX = 0;
        var listElementY = 0;
        var listElementWidth = 0;
        var listElementHeight = 0;
        var listElementYOffest = 1.78;
        var listElementAspectWidth = 100 / width;
        var listElementAspectHeight = 100 / height;
        var rect = false;
        var img = false;
        var selectedElement = null;



        for (var i = 0; i < list.length; i++)
        {
            if ($(list[i])[0].localName == "rect")
            {
                var listElementX = $(list[i])[0].x.baseVal.value;
                var listElementY = $(list[i])[0].y.baseVal.value * listElementYOffest;
                var listElementWidth = $(list[i])[0].width.baseVal.value;
                var listElementHeight = $(list[i])[0].height.baseVal.value * listElementYOffest;

                if (position.x > listElementX && position.x < listElementX + listElementWidth &&
                    position.y > listElementY && position.y < listElementY + listElementHeight)
                        return {action:actionFrom.RECT, selectedElement: list[i]};


            }
            else if($(list[i])[0].localName == "img")
            {
                var listElementX = parseInt($(list[i])[0].style.left);
                var listElementY = parseInt($(list[i])[0].style.top);
                var listElementWidth = parseInt($(list[i])[0].style.width);
                var listElementHeight = parseInt($(list[i])[0].style.height);

                if (position.x > listElementX * listElementAspectWidth && position.x < (listElementX + listElementWidth) * listElementAspectWidth &&
                    position.y > listElementY * listElementAspectHeight && position.y < (listElementY + listElementHeight) * listElementAspectHeight)
                    return {action:actionFrom.IMG, selectedElement: list[i]};
            }
        }
        return self;
    },

    self.getHoverElementFrom = function(list, view) {
        var self= this;
        self.setHoverStyle(self.isAction(list, action.HOVER), view);

        return null;
    },


    self.setHoverStyle = function(element, view) {
        var self = this;
        if(view == views.PATIENTSLIST)
        {
            if(element.action == actionFrom.RECT)
            {
                d3.selectAll('.bedRect')
                    .style('stroke-width','0.0');

                d3.select(element.selectedElement)
                    .style('stroke','#555')
                    .style('stroke-width','0.1');

            }
        }
        else if(view == views.PATIENTSINGLE)
        {
            d3.selectAll('.patientSingleUIList')
                .style({
                    "-webkit-filter": "drop-shadow(0px 0px 0px #222)",
                    "filter": "drop-shadow(0px 0px 0px #222)"
                });

            if(element.action == actionFrom.RECT) {
                d3.selectAll('.chartElemDOD').remove();
                if (d3.select(element.selectedElement).attr('class') == 'hoverRect')
                {
                    var gridNumber = $(element.selectedElement)[0].id.match(/\d+/g).map(Number)[0];
                    var gridValue = Snap('#grid'+gridNumber).data(gridNumber);
                    if(gridValue)
                        self.setHoverNote(element, gridValue, 'chartElement');
                }
                else if(d3.select(element.selectedElement).attr('class') == 'medCollection')
                {
                    var medCollection = Snap('#'+d3.select(element.selectedElement).attr('id')).data();
                    medCollection = Object.keys(medCollection).map(function(key){return medCollection[key]})
                    if(medCollection.length)
                        self.setHoverNote(element, medCollection, 'medElement');
                }
            }
            else if(element.action == actionFrom.IMG)
            {
                d3.select(element.selectedElement)
                    .style({
                        "-webkit-filter": "drop-shadow(5px 5px 5px #222) ",
                        "filter": "drop-shadow(5px 5px 5px #222)"
                    });
            }

        }
        return self;
    },

    self.setHoverNote = function(element, data, sender) {

            var svg = d3.select('.sageItem').append('svg')
                .attr("width", width/5.2)
                .attr("height", function(){
                    if(sender == 'chartElement')
                        return height/10.8;
                    else
                        return height/2;
                })
                .attr('class', 'chartElemDOD patientListUI')
                .style('position','absolute')
                .style('top', function(){
                    if(sender == 'chartElement')
                        return (position.y * height/100)-height/10.8 + 'px';
                    else
                        return (position.y * height/100)-height/2 + 'px'
                })
                .style('left',function(){
                    if(sender == 'chartElement')
                        return (position.x * width/100)+'px';
                    else
                        return (position.x * width/100)-width/10+'px';
                });

            svg.append('rect')
                .attr("width", width/5.2)
                .attr("height", function(){
                    if(sender == 'chartElement')
                        return height/10.8;
                    else
                        return height/2;
                })
                .attr("rx", 5)
                .attr("ry", 5)
                .style({
                    fill:'#000',
                    opacity:'0.6'
                });

            if(sender == 'chartElement')
            {
                var text = svg.append('text')
                    .text(data)
                    .attr('x', 10)
                    .attr('y', 0)
                    .attr('dy',function(){
                        return height / 18;
                    })
                    .attr('class', 'dodText')
                    .style('fill', 'white')
                    .style('font-size',function(){
                        return height / 36+'px';
                });
            }
            else
            {
                data.forEach(function(d,i){
                    var text = svg.append('text')
                        .text(d)
                        .attr('x', 10)
                        .attr('y', function(){
                            return i*height/27;
                        })
                        .attr('dy',function(){
                            return height / 18;
                        })
                        .attr('class', 'dodText')
                        .style('fill', 'white')
                        .style('font-size',function(){
                            return height / 36+'px';
                        });
                });
            }


    },

    self.getClickElementFrom = function(list, view) {
        var self = this;
        var response = 'None';

        var element = self.isAction(list, action.CLICK);

        if(view == views.PATIENTSLIST)
        {
            if(element.action == actionFrom.RECT)
                return views.PATIENTSINGLE;
        }
        else if(view == views.PATIENTSINGLE)
        {

            switch(element.selectedElement)
            {
                case buttons.HOMEBUTTON:
                    response =  views.PATIENTSLIST;
                    break;
                case buttons.ANOMALYBUTTON:
                    checkBoxs.ANOMALY = !checkBoxs.ANOMALY;
                    response = views.PATIENTSINGLE;
                    break;
                case buttons.COMPAREPREVDAYBUTTON:
                    checkBoxs.COMPAREPREVDAY = !checkBoxs.COMPAREPREVDAY;
                    response = views.PATIENTSINGLE;
                    break;
                case buttons.DAY1BUTTON:
                    radioButtons.DAY1 = 1;
                    radioButtons.DAY2 = radioButtons.DAY3 = 0;
                    response = views.PATIENTSINGLE;
                    currentDay = 2;
                    break;
                case buttons.DAY2BUTTON:
                    radioButtons.DAY2 = 1;
                    radioButtons.DAY3 = radioButtons.DAY1 = 0;
                    response = views.PATIENTSINGLE;
                    currentDay = 3;
                    break;
                case buttons.DAY3BUTTON:
                    radioButtons.DAY3 = 1;
                    radioButtons.DAY1 = radioButtons.DAY2 = 0;
                    response = views.PATIENTSINGLE;
                    currentDay = 4;
                    break;
                case buttons.NOTES:
                    checkBoxs.NOTES = !checkBoxs.NOTES;
                    response = views.PATIENTSINGLE;

            }

        }
        return response;
    },

    self.isCheckBoxSelected = function(button) {
        return checkBoxs[button];
    },

    self.isRadioButtonSelected = function(button) {
        return radioButtons[button];
    },

    self.isTextBoxSelected = function(textBox) {
        return textBoxs[textBox];
    },

    self.getCurrentDay = function() {
        return currentDay;
    },

    self.enableNoteCheckBox = function() {
        checkBoxs['NOTES'] = 1;
        return views.PATIENTSINGLE;
    }

    return self;
};

var starPlot = function(app) {

    var self = this;

    self.createStarPlot = function(starAttr) {

        var containerClass = 'radar-chart';
        var w = starAttr.appWidth / 8;
        var h = starAttr.appHeight / 4.5;
        var maxValue = 10;
        var minValue = 0;
        var axisLine = true;
        var axisText = false;
        var levels = 0;
        var circles = false;
        var radius = 3;

        d3.select(app.element)
          .append('div')
          .attr('id', starAttr.id)
          .attr('class', starAttr.class)
          .style({
                'position': 'absolute',
                'top': starAttr.top,
                'left': starAttr.left
        });

        var chart = RadarChart.chart();
        var svg = d3.select('#' + starAttr.id)
                    .append('svg')
                    .attr('id', starAttr.id + '_svg')
                    .style('height', function() {
                        return starAttr.appHeight / starAttr.heightOffset;
                    })
                    .style('width', function() {
                        return starAttr.appWidth / starAttr.widthOffset;
                    });

        chart.config();

  

        if(starAttr.type == 1)
        {
            w = starAttr.appWidth / 12;
            h = starAttr.appHeight / 6.75;
            axisText = true;
        }

        else if(starAttr.type == 2)
        {
            axisLine = true;
            circles = true;
            radius = appWidth/480;
        }

        chart.config({
            containerClass: containerClass,
            w: w,
            h: h,
            maxValue: maxValue,
            minValue: minValue,
            axisLine: axisLine,
            axisText: axisText,
            levels: levels,
            circles: circles,
            radius: radius
        });

        svg.append('g').classed('focus', 1).datum(starAttr.data).call(chart);

        return null;
    }

    return self;
};

var stickyNote = function(app) {

    var self = this;
    var x = y = width = height = topY = leftX = day = 0;
    var textContent;

    self.addNote = function(stickyNoteAttr) {

        x = stickyNoteAttr.x;
        y = stickyNoteAttr.y;
        topY = stickyNoteAttr.top;
        leftX = stickyNoteAttr.left;
        width = stickyNoteAttr.width;
        height = stickyNoteAttr.height;
        textContent = stickyNoteAttr.text;
        day = stickyNoteAttr.day;

        var svg = d3.select('.sageItem').append('svg')
            .attr("width", stickyNoteAttr.width)
            .attr("height", stickyNoteAttr.height)
            .attr('class', 'stickyNote')
            .style({
                position: 'absolute',
                top: stickyNoteAttr.top,
                left: stickyNoteAttr.left
            });

        var text = svg.append('text')
            .text(stickyNoteAttr.text)
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy',function(){
                return appHeight / 18;
            })
            .attr('class', 'stickyText')
            .style('fill', 'black')
            .style('font-size',function(){
                return appHeight / 36+'px';
            });

        bbox = text[0][0].getBBox();
        ctm = text[0][0].getCTM();

        rect = svg.insert('rect','text')
            .attr('x', bbox.x)
            .attr('y', bbox.y)
            .attr('class','stickyNoteRect')
            .attr('width', stickyNoteAttr.width)
            .attr('height', stickyNoteAttr.height)
            .style('fill','#ffeda0')
            .style('opacity','0.8');

        self.setTM(rect[0][0], ctm);
    },

    self.setTM = function(element, m) {
        var self = this;
        element.transform.baseVal.initialize(element.ownerSVGElement.createSVGTransformFromMatrix(m));

        return self;
    },

    self.getPosition = function()
    {
        return {x: x, y: y, width: width, height: height};
    },

    self.getAttributes = function() {
        return {x: x, y: y, width: width, height: height, top: topY, left: leftX, text: textContent, day: day};
    }

        return self;

};

var render = function(app) {
    var self = this;

    var totalNoOfPatients = 8;
    var patientBedPosition = [];
    var bedConstants = {
        class: "bedRect patientListUI",
        fill: "#FAFAFA",
        strokeWidth:0
    };
    var patientStatus = {STABLE: '#777', IMPROVING: '#67a9cf', CRITICAL: '#ef8a62'}

    self.arrangePatientBed = function() {
       
       var x = 2;
       var y = 6;
       var dx =24;
       var dy = 21;
       for(var i = 0; i < totalNoOfPatients; i++)
       {
            patientBedPosition.push({
                x: x,
                y: y,
                width: 22.5,
                height: 20
            });

            x += dx;

            if(i == 3)
            {
                x = 2;
                y += dy;
            }
       }

        return patientBedPosition;
    },

    self.renderPatientBed = function(i, patientAttr, appWidth, appHeight) {

        self.arrangePatientBed();

        var currentPatientStatus = null;
        var bed = app.svg.rect(patientBedPosition[i].x,
                                patientBedPosition[i].y,
                                patientBedPosition[i].width,
                                patientBedPosition[i].height);

        bed.attr({
            id: patientAttr.id,
            class: bedConstants.class,
            fill: bedConstants.fill,
            strokeWidth: bedConstants.strokeWidth
        });

        d3.select(app.element)
          .append('img')
          .attr({
                'src': patientAttr.imageSrc,
                'class': "patientDisplayPic patientListUI"
          })
          .style({
                'top': appHeight / patientAttr.yOffset + 'px',
                'left': appWidth / patientAttr.xOffset + 'px'
        });

        if(patientAttr.status == 'stable')
            currentPatientStatus = patientStatus.STABLE;
        else if(patientAttr.status == 'improving')
            currentPatientStatus = patientStatus.IMPROVING;
        else
            currentPatientStatus = patientStatus.CRITICAL;

        app.svg.polygon(patientAttr.statusPosition.x1,
            patientAttr.statusPosition.y1,
            patientAttr.statusPosition.x2,
            patientAttr.statusPosition.y2,
            patientAttr.statusPosition.x3,
            patientAttr.statusPosition.y3)
            .attr({
                class: "patientListUI",
                "stroke": "none",
                "fill": currentPatientStatus,
                "stroke-width": "0.2",
                "opacity": "0.8"
            });

        var dayLength = app.makeText(patientAttr.dayPosition.x, patientAttr.dayPosition.y, "2.0px", 'Day: ' + patientAttr.day, 0, 'black');
        dayLength.attr({
            class: "patientListUI"
        });

        var ventLength = app.makeText(patientAttr.ventPosition.x, patientAttr.ventPosition.y, "2.0px", 'Vent: ' + patientAttr.vent, 0, 'black');
        ventLength.attr({
            class: "patientListUI"
        });

        var name = app.makeText(patientAttr.namePosition.x, patientAttr.namePosition.y, "1.5px", patientAttr.name, 0, 'black');
        name.attr({
            class: "patientListUI"
        });

        var age = app.makeText(patientAttr.agePosition.x, patientAttr.agePosition.y, "1.5px", patientAttr.age, 0, 'black');
        age.attr({
            class: "patientListUI"
        });

        return self;
    },

    self.patientListUIClearScreen = function() {

        $('.patientListUI').remove();
        $('.patientSingleVis').remove();
        $('.visText').remove();
        d3.selectAll('.stickyNote').remove();
        d3.selectAll('.stickyNoteRect').remove();
        d3.selectAll('.stickyText').remove();
    },

    self.patientUIInsertImage = function(imageAttr) {

        d3.select(app.element)
            .append('img')
            .attr({
                'src': imageAttr.src,
                'class': imageAttr.class
            })
            .style({
                'position': 'absolute',
                'top': imageAttr.appHeight / imageAttr.yOffset + 'px',
                'left': imageAttr.appWidth / imageAttr.xOffset + 'px',
                'width': imageAttr.appWidth / imageAttr.widthOffset + 'px',
                'height': imageAttr.appHeight / imageAttr.heightOffset + 'px'
        });

        return self;
    }
};

var dataCollection = function() {
    var self = this;

    var patientsAttr=[];
    var currentPatientAttr;
    var healthScore = {'low':'#9e9ac8','medium':'#807dba','high':'#6a51a3','extreme':'#4a1486'};

    self.getStarPlotData = function(data) {

        return [
                [
                    {
                        axis: "MAP",
                        value: data.MAP
                    },
                    {
                        axis: "Resp",
                        value: data.RESP
                    },
                    {
                        axis: "SPo2",
                        value: data.SPO2
                    },
                    {
                        axis: "Temp",
                        value: data.TEMP
                    },
                    {
                        axis: "HR",
                        value: data.HR
                    }
                ]
              ]
    },

    self.getNormalStarPlotData = function() {
        var normalData = {MAP: 5, RESP: 5, SPO2: 5, TEMP: 5, HR: 5};
      return self.getStarPlotData(normalData);
    },

    self.addPatient = function(patientAttributes) {
        currentPatientAttr = patientAttributes;
        patientsAttr.push(patientAttributes);
    },

    self.getPatients = function() {
        return patientsAttr;
    },

    self.getPatientData = function() {
        return currentPatientAttr;
    },

    self.getHealthScore = function(score) {
        return healthScore[score];
    },

    self.getPatientSingleUIList= function() {
        var list = ['#homeButton',
            '#infoButton',
            '#questionButton',
            '#anomalyButtonRect',
            '#comparePrevDayButtonRect',
            '#day1ButtonRect',
            '#day2ButtonRect',
            '#day3ButtonRect',
            '#stickyTextBox',
            '#noteCheckBox'];
        return list;
    },

    self.getPatientSingleTimelineList = function() {

        var numOfItem = 13;
        var noOfHours = 24;
        var counter  = 0;
        var list = [];
        while(counter < numOfItem * noOfHours)
        {
            counter++;
            list.push('#grid'+counter);
        }

        list.push('#medicationGeneral',
            '#medicationPain',
            '#medicationResp',
            '#medicationDiabetes',
            '#medicationCardio');

        return list;
    }

        return self;
};

var helper = function(app) {

	var self = this;

	self.gridLine = function() {

	return self;	
	
	}
};




