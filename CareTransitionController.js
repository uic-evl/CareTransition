function CareTransitionController(app, resrcPath, views, healthScore) {
    this.app = app;
    this.resrcPath = resrcPath;
    this.path = resrcPath + "/images/";
    this.views = views;
    this.healthScore = healthScore;


    this.patientSingleUIRadioList = {
        day1ButtonRect: 0,
        day2ButtonRect: 0,
        day3ButtonRect: 1
    };
    this.day = 4;
    this.dayMode = 0;
    this.stickyNotes = [];
    this.stickyText = [];
    this.stickyBKText = 'Note Preview';
    this.isSticky = false;

    this.event = new interaction(app);
    this.render = new render(app);
    this.dataManager = new dataCollection();
    this.stickyTextBox = new textBox(app);
}
CareTransitionController.prototype = {
    constructor: CareTransitionController,

    initCareTransition: function(ratio) {
        var self = this;
        self.app.svg.attr("viewBox", "0,0,100," + ratio);

        var appBg = self.app.svg.rect(0, 0, 100, 100);
        appBg.attr({fill: "#ecf0f5", strokeWidth: 0});

        var appTitleBar = self.app.svg.rect(0, 0, 100, 3.2);
        appTitleBar.attr({fill: "#87acdb", strokeWidth: 0});

        self.app.makeText(8, 2.5, "2px", "Care Transition", 0, 'white');
    },

    drawStarPlot: function(id, top, left, data, type) {

        var starPlotElement = new starPlot(this.app);

        starPlotElement.createStarPlot({
            id: id,
            class: 'patientListUI',
            top: top,
            left: left,
            data: data,
            type: type,
            appWidth: self.appWidth,
            appHeight: self.appHeight,
            widthOffset: 3.6,
            heightOffset: 3.2
        });
    },

    initPatientListUI: function() {

        var render = this.render;

        render.patientListUIClearScreen();

        render.patientUIInsertImage({
            src: this.path + 'info.png',
            class: 'patientListUI',
            xOffset: 1.13,
            yOffset: 77.14,
            widthOffset: 48,
            heightOffset: 27,
            appWidth: self.appWidth,
            appHeight: self.appHeight
        });

        render.patientUIInsertImage({
            src: this.path + 'question.png',
            class: 'patientListUI',
            xOffset: 1.06,
            yOffset: 77.14,
            widthOffset: 48,
            heightOffset: 27,
            appWidth: self.appWidth,
            appHeight: self.appHeight
        });
    },

    patientListUI: function() {
        var event = this.event;
        var self = this;
        var appWidth = event.getAspect().width;
        var appHeight = event.getAspect().height;

        self.initPatientListUI();

        d3.csv(self.resrcPath + 'patientListData.csv',function(dataset){
            var dataManager = self.dataManager;
            var render  = self.render;
            var healthScore = [];
            dataset.forEach(function(d, i){

                var dataSrc = d;

                dataManager.addPatient({
                    id: dataSrc.id,
                    imageSrc: self.path + dataSrc.imageSrc,
                    xOffset: parseFloat(dataSrc.xOffset),
                    yOffset: parseFloat(dataSrc.yOffset),
                    day: parseFloat(dataSrc.day),
                    dayPosition: {x: parseFloat(dataSrc.dayPositionX), y: parseFloat(dataSrc.dayPositionY)},
                    vent: parseFloat(dataSrc.vent),
                    ventPosition: {x: parseFloat(dataSrc.ventPositionX), y: parseFloat(dataSrc.ventPositionY)},
                    name: dataSrc.name,
                    namePosition: {x: parseFloat(dataSrc.namePositionX), y: parseFloat(dataSrc.namePositionY)},
                    age: parseFloat(dataSrc.age),
                    agePosition: {x: parseFloat(dataSrc.agePositionX), y: parseFloat(dataSrc.agePositionY)},
                    status: dataSrc.status,
                    statusPosition: {x1: parseFloat(dataSrc.statusPositionX1),
                        y1: parseFloat(dataSrc.statusPositionY1),
                        x2: parseFloat(dataSrc.statusPositionX2),
                        y2: parseFloat(dataSrc.statusPositionY2),
                        x3: parseFloat(dataSrc.statusPositionX3),
                        y3: parseFloat(dataSrc.statusPositionY3)},
                    data: {MAP: parseFloat(dataSrc.MAP),
                        RESP: parseFloat(dataSrc.RESP),
                        SPO2: parseFloat(dataSrc.SPO2),
                        TEMP: parseFloat(dataSrc.TEMP),
                        HR: parseFloat(dataSrc.HR)}
                });

                render.renderPatientBed(i, dataManager.getPatientData(), appWidth, appHeight);
                self.drawStarPlot('chart'+(i+1), appHeight / dataSrc.chartOffsetY + 'px', appWidth / dataSrc.chartOffsetX + 'px',
                    dataManager.getStarPlotData(dataManager.getPatientData().data), 0);
                self.drawStarPlot('chart'+(i+1)+'_normal', appHeight / dataSrc.chartOffsetY + 'px', appWidth / dataSrc.chartOffsetX + 'px',
                    dataManager.getNormalStarPlotData(), 2);

                healthScore.push(dataSrc.healthScore);
            });

            self.patientListUIDraw(healthScore);
            self.patientListUILegend();
            self.patientListUIResize();
        });

    },

    patientListUIDraw: function(healthScore) {
        var dataManager = dataCollection();

        for (var i = 0; i < healthScore.length; i++) {
            $('#chart' + (i + 1) + ' .radar-chart-serie0').each(function() {
                this.style.setProperty('fill', dataManager.getHealthScore(healthScore[i]), 'important');
            });

            $('#chart' + (i + 1) + '_normal .radar-chart-serie0').each(function() {
                this.style.setProperty('fill', '#000', 'important');
                this.style.setProperty('fill-opacity', 1.0, 'important');
            });

            $('#chart' + (i + 1) + '_normal .area').each(function() {
                this.style.setProperty('fill', '#000', 'important');
                this.style.setProperty('fill-opacity', 0.0, 'important');
            });
        }
    },

    patientListUILegend: function() {

        var controlPanelRect = this.app.svg.rect(2, 48, 95, 8);
        controlPanelRect.attr({
            class: "patientListUI",
            fill: "#FAFAFA",
            strokeWidth: 0
        });

        var healthEvalLabel = this.app.makeText(28, 51, "1.5px", "Emergency Score", 0, 'black');
        healthEvalLabel.attr({
            id: "control3",
            class: "patientListUI"
        });

        var healthEvalLabelLow = this.app.makeText(23, 55.5, "1px", "Good", 0, 'black');
        healthEvalLabelLow.attr({
            id: "control4",
            class: "patientListUI"
        });

        var healthEvalLabelHigh = this.app.makeText(52, 55.5, "1px", "Bad", 0, 'black');
        healthEvalLabelHigh.attr({
            id: "control5",
            class: "patientListUI"
        })

        var legendStarPlotData = [
            [{
                    axis: "MAP",
                    value: 5
                },
                {
                    axis: "Resp",
                    value: 5
                },
                {
                    axis: "SPo2",
                    value: 5
                },
                {
                    axis: "Temp",
                    value: 5
                },
                {
                    axis: "HR",
                    value: 5
                }
            ]
        ];

        this.drawStarPlot('legendchart1', self.appHeight / 1.16 + 'px', self.appWidth / 21.3 + 'px', legendStarPlotData, 1);

        $('#legendchart1 .area').each(function() {
            this.style.setProperty('fill', '#6a51a3', 'important');
        });

        var defs = d3.select(this.app.element)
            .append('div')
            .attr('id', 'legendGradient')
            .style({
                "position": "absolute",
                "top": self.appHeight / 1.08 + "px",
                "left": self.appWidth / 4.57 + "px",
                "fill-opacity": "0.5"
            })
            .append('svg')
            .attr("id", "legendSVG")
            .append('defs');

        var linearGradient = defs.append("linearGradient")
            .attr("id", "linear-gradient");

        linearGradient.attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#9e9ac8");

        linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#4a1486");

        d3.select("#legendSVG")
            .append("rect")
            .attr("class", "patientListUI")
            .attr("width", self.appWidth / 3.2)
            .attr("height", self.appHeight / 27)
            .style("fill", "url(#linear-gradient");

        // var legendGoodCircle = this.app.svg.circle(65.7,51.5,2.5);
        // legendGoodCircle.attr({class:"patientListUI","fill":"none","stroke":"#67a9cf","stroke-width":"0.2"});
        this.app.svg.polygon(64.7, 51.5, 64.7, 53.5, 66.7, 51.5).attr({
            class: "patientListUI",
            "stroke": "none",
            "fill": "#67a9cf",
            "stroke-width": "0.2",
            "opacity": "0.8"
        });

        var legendGoodCircleText = this.app.makeText(65.8, 55.5, "1px", "Improving", 0, 'black');
        legendGoodCircleText.attr({
            class: "patientListUI"
        });

        // var legendNeutralCircle = this.app.svg.circle(75.7,51.5,2.5);
        // legendNeutralCircle.attr({class:"patientListUI","fill":"none","stroke":"#777","stroke-width":"0.2"});

        this.app.svg.polygon(75.5, 51.5, 75.5, 53.5, 77.5, 51.5).attr({
            class: "patientListUI",
            "stroke": "none",
            "fill": "#777",
            "stroke-width": "0.2",
            "opacity": "0.8"
        });

        var legendNeutralCircleText = this.app.makeText(75.8, 55.5, "1px", "Stable", 0, 'black');
        legendNeutralCircleText.attr({
            class: "patientListUI"
        });

        // var legendBadCircle = this.app.svg.circle(85.7,51.5,2.5);
        // legendBadCircle.attr({class:"patientListUI","fill":"none","stroke":"#ef8a62","stroke-width":"0.2"});

        this.app.svg.polygon(85.5, 51.5, 85.5, 53.5, 87.5, 51.5).attr({
            class: "patientListUI",
            "stroke": "none",
            "fill": "#ef8a62",
            "stroke-width": "0.2",
            "opacity": "0.8"
        });

        var legendBadCircleText = this.app.makeText(85.8, 55.5, "1px", "Critical", 0, 'black');
        legendBadCircleText.attr({
            class: "patientListUI"
        });
    },

    patientListUIResize: function() {
        $('.patientDisplayPic').each(function() {
            this.style.setProperty('position', 'absolute', 'important');
            this.style.setProperty('width', self.appWidth / 19.2 + "px", 'important');
            this.style.setProperty('height', self.appHeight / 10.8 + "px", 'important');
        });

        $('#legendGradient').each(function() {
            this.style.setProperty('position', 'absolute', 'important');
            this.style.setProperty('top', self.appHeight / 1.09 + "px", 'important');
            this.style.setProperty('left', self.appWidth / 4.57 + "px", 'important');
        });

        $('#legendSVG').each(function() {
            this.style.setProperty('width', self.appWidth / 3.2 + "px", 'important');
            this.style.setProperty('height', self.appHeight / 27 + "px", 'important');
        });

        $('.legend').each(function() {
            this.style.setProperty('font-size', self.appWidth / 96 + "px", 'important');
        });
    },

    viewManager: function(view) {
        var event = this.event;
        event.setAspect(self.appWidth,self.appHeight);
        var currentView = event.changeView(view);
   
        switch(currentView)
        {
            case 'patientsList':
                this.patientListUI();
                break;
            case 'patientSingle':
                this.patientSingleUI();
                break;
        }
    },

    eventManager: function(newPosition, action) {
        // Snap svg rect y goes from 0 ->56.2; mulitpled by 1.78 to scale to  0 - 100
        var _self = this;
        var event = this.event;
        var currentView = event.getCurrentView();
        var dataManager =  this.dataManager;
        var stickyNotes = this.stickyNotes;
        var stickyTextBox = this.stickyTextBox;
        var day = event.getCurrentDay();

        event.setPosition(newPosition.x, newPosition.y);

        if (event.isViewPatientsList()) 
        {
            var patientList = dataManager.getPatients().map(function(d){
                return '#' + d.id;
            });

            if (event.isHover(action)) 
                event.getHoverElementFrom(patientList, currentView);
            else if (event.isClick(action)) 
                this.viewManager(event.getClickElementFrom(patientList, currentView));
        } 
        else if (event.isViewPatientSingle())
        {
            if (event.isHover(action)) {
                event.getHoverElementFrom(dataManager.getPatientSingleUIList().concat(dataManager.getPatientSingleTimelineList()), currentView);
            }
            else if (event.isClick(action))  {

                this.viewManager(event.getClickElementFrom(dataManager.getPatientSingleUIList().concat(dataManager.getPatientSingleTimelineList()), currentView));
                //stickyTextBox.isSelected(event.isTextBoxSelected('STICKYTEXTBOX'));

                if(this.isSticky && event.getPosition().y > 10)
                {
                    var note = new stickyNote(this.app);

                    note.addNote({
                        width: event.getAspect().width / 10,
                        height: event.getAspect().height / 12,
                        x: event.getPosition().x,
                        y: event.getPosition().y,
                        top: event.getPosition().y * event.getAspect().height/100 +'px',
                        left: event.getPosition().x * event.getAspect().width/100 +'px',
                        text: stickyTextBox.getTextContent(),
                        day: day
                    });
                    stickyNotes.push(note.getAttributes());
                    this.isSticky = false;
                }

            }
        }
    },

    isTextBoxSelected: function() {
      var event = this.event;

      return event.isTextBoxSelected('STICKYTEXTBOX');
    },

    fetchKeyBoardInput: function(character) {
        var self = this;
        var stickyText = this.stickyText;
        var stickyTextBox = this.stickyTextBox;
        if(character === 8)
            stickyText.pop();
        else if(character === 13)
        {
           self.showStickyNotes();
            this.isSticky = true;
        }
        else if(stickyText.length < 15)
        {
            character = String.fromCharCode(character)
            stickyText.push(character);
        }

        stickyTextBox.setTextContent(stickyText.join(''));
        this.stickyBKText = stickyText.join('');
    },

    initPatientSingleUI: function() {

        $('.patientListUI').remove();
        $('.visText').remove();
        $('.patientSingleVis').remove();
        $('.medCollection').remove();
       
        d3.select(this.app.element)
            .append('img')
            .attr({
                'src': this.path + 'home.png',
                'id': 'homeButton',
                'class': 'patientSingleUIList patientListUI',
            })
            .style({
                'position': 'absolute',
                'top': self.appHeight / 77.14 + 'px',
                'left': self.appWidth / 2 + 'px',
                'width': self.appWidth / 48 + 'px',
                'height': self.appHeight / 27 + 'px'
            });

        d3.select(this.app.element)
            .append('img')
            .attr({
                'src': this.path + 'info.png',
                'id': 'infoButton',
                'class': 'patientSingleUIList patientListUI',
            })
            .style({
                'position': 'absolute',
                'top': self.appHeight / 77.14 + 'px',
                'left': self.appWidth / 1.13 + 'px',
                'width': self.appWidth / 48 + 'px',
                'height': self.appHeight / 27 + 'px'
            });

        d3.select(this.app.element)
            .append('img')
            .attr({
                'src': this.path + 'question.png',
                'id': 'questionButton',
                'class': 'patientSingleUIList patientListUI',
            })
            .style({
                'position': 'absolute',
                'top': self.appHeight / 77.14 + 'px',
                'left': self.appWidth / 1.06 + 'px',
                'width': self.appWidth / 48 + 'px',
                'height': self.appHeight / 27 + 'px'
            });

        var bgLeftRect = this.app.svg.rect(0.5, 5.5, 58, 14);
        bgLeftRect.attr({
            class: "patientListUI",
            fill: "#FAFAFA",
            strokeWidth: 0
        });

        var bgRightRect = this.app.svg.rect(59, 5.5, 40, 14);
        bgRightRect.attr({
            class: "patientListUI",
            fill: "#FAFAFA",
            strokeWidth: 0
        });

        var bgBottomRect = this.app.svg.rect(0.5, 20.3, 98.5, 35.5);
        bgBottomRect.attr({
            class: "patientListUI",
            fill: "#FAFAFA",
            strokeWidth: 0
        });
    },

    patientSingleUI: function() {
        var event = this.event;
        var self = this;
        self.initPatientSingleUI();
        currentView = self.views.patientSingle;

        if(event.isCheckBoxSelected('COMPAREPREVDAY'))
            self.patientSingleShowPreviousDay(event.getCurrentDay() - 1)

        self.dayMode = 1;
        self.patientSingleCardio(self.app, event.getCurrentDay(), self.dayMode);
        self.patientSinglePulmonary(self.app, event.getCurrentDay(), self.dayMode);
        self.patientSingleChartEvents(event.getCurrentDay());
        self.patientSingleSidebar(self.app);
        self.patientSingleUINoteResize();
        self.patientSingleUILegend();
    },

    patientSingleUILegend: function() {

        var healthEvalLabelLow = this.app.makeText(14, 55.5, "1px", "Good", 0, 'black');
        healthEvalLabelLow.attr({
            id: "control4",
            class: "patientListUI"
        });

        var healthEvalLabelHigh = this.app.makeText(42.5, 55.5, "1px", "Bad", 0, 'black');
        healthEvalLabelHigh.attr({
            id: "control5",
            class: "patientListUI"
        });

        var healthEvalLabel = this.app.makeText(17, 51.5, "1.5px", "Chart-Events", 0, 'black');
        healthEvalLabel.attr({
            id: "control3",
            class: "patientListUI"
        });

        var medLabel = this.app.makeText(64, 51.5, "1.5px", "Medications", 0, 'black');
        medLabel.attr({
            id: "control3",
            class: "patientListUI"
        });

        var defs = d3.select(this.app.element)
            .append('div')
            .attr('id', 'legendGradient')
            .style({
                "position": "absolute",
                "top": self.appHeight / 1.08 + "px",
                "left": self.appWidth / 4.57 + "px",
                "fill-opacity": "0.5"
            })
            .append('svg')
            .attr("id", "legendSVG")
            .append('defs');

        var linearGradient = defs.append("linearGradient")
            .attr("id", "linear-gradient");

        linearGradient.attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#88cba7");

        linearGradient.append("stop")
            .attr("offset", "30%")
            .attr("stop-color", "#b0deb2");

        linearGradient.append("stop")
            .attr("offset", "70%")
            .attr("stop-color", "#f9b6a2");

        linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#cf7f94");

        d3.select("#legendSVG")
            .append("rect")
            .attr("class", "patientListUI")
            .attr("width", self.appWidth / 3.2)
            .attr("height", self.appHeight / 27)
            .attr("fill-opacity",0.7)
            .style("fill", "url(#linear-gradient");


        $('#legendGradient').each(function() {
            this.style.setProperty('position', 'absolute', 'important');
            this.style.setProperty('top', self.appHeight / 1.08 + "px", 'important');
            this.style.setProperty('left', self.appWidth / 8 + "px", 'important');
        });

        $('#legendSVG').each(function() {
            this.style.setProperty('width', self.appWidth / 3.2 + "px", 'important');
            this.style.setProperty('height', self.appHeight / 27 + "px", 'important');
        });

        $('.legend').each(function() {
            this.style.setProperty('font-size', self.appWidth / 96 + "px", 'important');
        });


    },

    patientSingleUINoteResize: function() {
        var event = this.event;
        var stickyNotes = this.stickyNotes;
        var day = event.getCurrentDay();
        var self = this;
        d3.selectAll('.stickyNote').remove();
        d3.selectAll('.stickyNoteRect').remove();
        d3.selectAll('.stickyText').remove();

        if(event.isCheckBoxSelected('NOTES'))
        {
            stickyNotes.forEach(function(d,i) {
                if(d.day == day)
                {
                    var note = new stickyNote(this.app);

                    note.addNote({
                        width: d.width,
                        height: d.height,
                        x: d.x,
                        y: d.y,
                        top: d.top,
                        left: d.left,
                        text: d.text
                    });
                }

            });

        }
        else
        {
            d3.selectAll('.stickyNote').remove();
            d3.selectAll('.stickyNoteRect').remove();
            d3.selectAll('.stickyText').remove();
        }

        $('.stickyNote').each(function(i) {
            this.style.setProperty('z-index', "1", 'important');
            this.style.setProperty('width', event.getAspect().width / 10+ "px", 'important');
            this.style.setProperty('height', event.getAspect().height / 12 + "px", 'important');
            this.style.setProperty('top', stickyNotes[i].y * event.getAspect().height/100 + 'px', 'important');
            this.style.setProperty('left', stickyNotes[i].x * event.getAspect().width/100 + 'px', 'important');
        });

        $('.stickyNoteRect').each(function() {
            this.style.setProperty('width', event.getAspect().width / 12+ "px", 'important');
            this.style.setProperty('height', event.getAspect().height / 6.75 + "px", 'important');
        });

        $('.stickyText').each(function(i) {
            this.style.setProperty('dy', event.getAspect().height / 18, 'important');
            this.style.setProperty('font-size', event.getAspect().height / 36 +'px', 'important');
        });
    },

    showStickyNotes: function() {
      var self = this;
      var event = this.event;
      self.viewManager(event.enableNoteCheckBox());
    },

    patientSingleSidebar: function() {
        var self = this;
        self.patientSingleSettings();
    },

    patientSingleChartEvents: function(day) {
        var self = this;
        var app = this.app;
        var event = this.event;
        var dataManager = this.dataManager;

        var patientTimeline = d3.select(self.app.element)
            .append('div')
            .attr('id', 'patientTimeline')
            .attr('class', 'patientSingleVis');

        var margin = { top: 50, right: 0, bottom: 100, left: 30 },
            width = event.getAspect().width ,
            height = (event.getAspect().height / 1.2) - event.getAspect().height/ 10.8 - event.getAspect().height/ 5.4,
            gridSize = Math.floor(width / 24),
            legendElementWidth = gridSize*2,
            buckets = 9,
            colors = ['#f8f8fa','#cf7f94','#e99795','#f9b6a2','#fcd6b1', '#d2ecb6', '#b0deb2', '#88cba7'],
            medColors = ['#f8f8fa','#decbe4','#e5d8bd','#fdb462', '#fb8072', '#80b1d3'],
            days = ['Activity Tolerance', 'Behaviour', 'Orientation','Verbal Response',
                    'Consciousness', 'Eye Opening', 'Temperature', 'Weight Change', 'Heart Rhythm',
                    'Respiratory Pattern', 'O2 flow', 'Bowel Sound',  'Braden Score'],
            times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
            datasets = ["data.tsv"];

        var svg = d3.select("#patientTimeline").append("svg")
            .attr("width", width )
            .attr("height", height);

        var dayLabels = svg.selectAll(".dayLabel")
            .data(days)
            .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize / 2; })
            .style('font-size',function(d){
                var fontSize = event.getAspect().height / 42;

                return fontSize+'px';
            })
            .style("text-anchor", "end")
            .attr("transform", "translate("+event.getAspect().width / 7.68+"," + gridSize / 1.8  + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

        var timeLabels = svg.selectAll(".timeLabel")
            .data(times)
            .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize / 1.2; })
            .attr("y", 0)
            .style('font-size',function(d){
                var fontSize = event.getAspect().height / 56;

                return fontSize+'px';
            })
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize * 3.7  +","+ event.getAspect().height /80 + ")")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

        var medList = [];
        var hoverElem = []
        var yOffset = 20.4;
        var gridId = 1
        for(var j=1; j<=13; j++)
        {
            var xOffset = 13.7;
            yOffset +=2.05;
            for(var i=1; i<=24; i++)
            {
                hoverElem[gridId] = app.svg.rect(xOffset, yOffset, 3.2, 2);

                hoverElem[gridId].attr({
                    id: 'grid'+gridId++,
                    class:'hoverRect',
                    fill: 'none',
                    stroke: 'none',
                    strokeWidth: 0.1
                });
                xOffset += 3.5;
            }
        }

        var heatmapChart = function(tsvFile) {
            d3.tsv(self.resrcPath+tsvFile,
                function(d) {
                if(d.day == day && d.itemName == 'Medication')
                    medList.push({'item':d.value,'value': d.chartValue});
                if(d.day == day && d.itemName != 'Medication')
                    return {
                        day: +d.item,
                        hour: +d.hour,
                        value: +d.value,
                        item: d.itemName,
                        chartValue: d.chartValue
                    };
                },
                function(error, dataset) {
                    var medData = [];
                    var i =0;

                    while(i<24)
                        medData.push(dataset[i++]);

                    var colorScale = d3.scale.quantile()
                        .domain([0, buckets - 1, d3.max(dataset, function (d) { return d.value; })])
                        .range(colors);

                    var medColorScale = d3.scale.quantile()
                        .domain([0, buckets - 1, d3.max(medData, function (d) { return d.value; })])
                        .range(medColors);

                    var cards = svg.selectAll(".hour")
                        .data(dataset, function(d) {return d.day+':'+d.hour;});

                    cards.append("title");

                    cards.enter().append("rect")
                        .attr("x", function(d) { return ((d.hour - 1) * gridSize / 1.2) + event.getAspect().width / 7.38; })
                        .attr("y", function(d) { return ((d.day - 1) * gridSize / 2) - 10; })
                        .attr("rx", 2)
                        .attr("ry", 2)
                        .attr('id', function(d, i){
                            i++;

                            hoverElem[i].data(i,d.chartValue);
                            return 'g'+i;
                        })
                        .attr("class", function(d,i){

                            return d.chartValue;
                        })
                        .attr("width", gridSize / 1.2)
                        .attr("height", gridSize / 2)
                        .style("fill", colors[0])
                        .style("stroke", "#999")
                        .style("stroke-width", 0.3);

                    cards.transition().duration(1000)
                        .style("fill", function(d) {
                            if(d.item == 'Medication')
                                return medColorScale(d.value);

                            return colorScale(d.value);
                        })
                        .style("opacity", 1.0);
                    cards.select("title").text(function(d) { return d.value; });
                    cards.exit().remove();

                    var medicationGeneral = app.svg.rect(60, 52.5, 4, 2);

                    medicationGeneral.attr({
                        id: 'medicationGeneral',
                        class: 'medCollection',
                        fill: '#decbe4',
                        opacity: 0.1,
                        stroke: 'none',
                        strokeWidth: 0
                    });

                    var medicationGeneralLabel = app.makeText(62, 55.5, "1px", "General", 0, 'black');
                    medicationGeneralLabel.attr('opacity', 0.2);

                    var medicationPain = app.svg.rect(67, 52.5, 4, 2);

                    medicationPain.attr({
                        id: 'medicationPain',
                        class: 'medCollection',
                        fill: '#e5d8bd',
                        opacity: 0.1,
                        stroke: 'none',
                        strokeWidth: 0
                    });
                    var medicationPainLabel = app.makeText(69, 55.5, "1px", "Pain killers", 0, 'black');
                    medicationPainLabel.attr('opacity', 0.2);

                    var medicationResp = app.svg.rect(74, 52.5, 4, 2);
                    medicationResp.attr({
                        id: 'medicationResp',
                        class: 'medCollection',
                        fill: '#fdb462',
                        opacity: 0.1,
                        stroke: 'none',
                        strokeWidth: 0
                    });
                    var medicationRespLabel = app.makeText(76, 55.5, "1px", "Respiratory", 0, 'black');
                    medicationRespLabel.attr('opacity', 0.2);

                    var medicationDiabetes = app.svg.rect(81, 52.5, 4, 2);
                    medicationDiabetes.attr({
                        id: 'medicationDiabetes',
                        class: 'medCollection',
                        fill: '#fb8072',
                        opacity: 0.1,
                        stroke: 'none',
                        strokeWidth: 0
                    });
                    var medicationDiabetesLabel = app.makeText(83, 55.5, "1px", "Diabetes", 0, 'black');
                    medicationDiabetesLabel.attr('opacity', 0.2);

                    var medicationCardio = app.svg.rect(88, 52.5, 4, 2);
                    medicationCardio.attr({
                        id: 'medicationCardio',
                        class: 'medCollection',
                        fill: '#80b1d3',
                        opacity: 0.1,
                        stroke: 'none',
                        strokeWidth: 0
                    });

                    var medicationCardioLabel = app.makeText(90, 55.5, "1px", "Cardio", 0, 'black');
                    medicationCardioLabel.attr('opacity', 0.2);

                    medList.forEach(function(d, i){
                       if(d.item == 'general')
                       {
                           medicationGeneral.attr('opacity', 1);
                           medicationGeneralLabel.attr('opacity', 1);

                           medicationGeneral.data(i, d.value);
                       }
                       else if(d.item == 'pain')
                       {
                           medicationPain.attr('opacity', 1);
                           medicationPainLabel.attr('opacity', 1);

                           medicationPain.data(i, d.value);
                       }
                       else if(d.item == 'respiratory')
                       {
                           medicationResp.attr('opacity', 1);
                           medicationRespLabel.attr('opacity', 1);

                           medicationResp.data(i, d.value);
                       }
                       else if(d.item == 'diabetes')
                       {
                           medicationDiabetes.attr('opacity', 1);
                           medicationDiabetesLabel.attr('opacity', 1);

                           medicationDiabetes.data(i, d.value);
                       }
                       else if(d.item == 'cardio')
                       {
                           medicationCardio.attr('opacity', 1);
                           medicationCardioLabel.attr('opacity', 1);

                           medicationCardio.data(i, d.value);
                       }
                    });
                });

        };

        heatmapChart(datasets[0]);

        $('#patientTimeline').each(function() {
            this.style.setProperty('top', event.getAspect().height / 2.63 + 'px', 'important');
        });
    },

    patientSingleSettings: function(previousDayMode) {
        var event = this.event;
        var stickyTextBox = this.stickyTextBox;

        var self = this;

        var anomalyCheckbox = new checkBox(this.app);
        anomalyCheckbox.addCheckBox({
            id: 'anomalyButtonRect',
            class:'patientListUI',
            x: 60,
            y: 4,
            size: 1,
            fill: '#111',
            stroke:'#555',
            strokeWidth: '0.2', 
            checked: event.isCheckBoxSelected('ANOMALY')
        });

        anomalyCheckbox.addTitle({
            id: 'anomalyButtonTitle',
            class: 'visText',
            x: 64,
            y: 5,
            size: '1.0px',
            color: 'black',
            stroke: 0,
            text: 'Anomalies'
        });

        var comparePrevDayCheckbox = new checkBox(this.app);
        comparePrevDayCheckbox.addCheckBox({
            id: 'comparePrevDayButtonRect',
            class:'patientListUI',
            x: 68,
            y: 4,
            size: 1,
            fill: '#111',
            stroke:'#555',
            strokeWidth: '0.2', 
            checked: event.isCheckBoxSelected('COMPAREPREVDAY')
        });

        comparePrevDayCheckbox.addTitle({
            id: 'comparePrevDayButtonTitle',
            class: 'visText',
            x: 75,
            y: 5,
            size: '1.0px',
            color: 'black',
            stroke: 0,
            text: 'Compare with Yesterday'
        });

        var day1Radio = new radioButton(this.app);
        day1Radio.addRadioButton({
            id: 'day1ButtonRect',
            class: 'patientListUI',
            x: 82,
            y: 4,
            size: 1,
            fill: '#0062ff',
            stroke: '#555',
            strokeWidth: '0.2',
            opacity: '0.8',
            selected: event.isRadioButtonSelected('DAY1')
        });

        day1Radio.addTitle({
            id: 'day1ButtonRect',
            class: 'visText',
            x: 85,
            y: 4.8,
            size: '1.0px',
            color: 'black',
            stroke: 0,
            text: 'Day 1'
        });

        var day2Radio = new radioButton(this.app);
        day2Radio.addRadioButton({
            id: 'day2ButtonRect',
            class: 'patientListUI',
            x: 88,
            y: 4,
            size: 1,
            fill: '#0062ff',
            stroke: '#555',
            strokeWidth: '0.2',
            opacity: '0.8',
            selected: event.isRadioButtonSelected('DAY2')
        });

        day2Radio.addTitle({
            id: 'day2ButtonRect',
            class: 'visText',
            x: 91,
            y: 4.8,
            size: '1.0px',
            color: 'black',
            stroke: 0,
            text: 'Day 2'
        });

        var day3Radio = new radioButton(this.app);
        day3Radio.addRadioButton({
            id: 'day3ButtonRect',
            class: 'patientListUI',
            x: 94,
            y: 4,
            size: 1,
            fill: '#0062ff',
            stroke: '#555',
            strokeWidth: '0.2',
            opacity: '0.8',
            selected: event.isRadioButtonSelected('DAY3')
        });

        day3Radio.addTitle({
            id: 'day3ButtonRect',
            class: 'visText',
            x: 97,
            y: 4.8,
            size: '1.0px',
            color: 'black',
            stroke: 0,
            text: 'Day 3'
        });

        stickyTextBox.addTextBox({
           id: 'stickyTextBox',
           class: 'patientListUI',
           x: 42,
           y: 3.6,
           sizeX: 10,
           sizeY: 1.5
        });

        stickyTextBox.addText({
            id: 'stickyTextBoxTitle',
            class: 'visText',
            x: 47,
            y: 4.7,
            size: '1.0px',
            color: 'grey',
            stroke: 0,
            text: this.stickyBKText
        });

        var noteCheckBox = new checkBox(this.app);
        noteCheckBox.addCheckBox({
            id: "noteCheckBox",
            class: "patientListUI",
            x: 53,
            y: 4,
            size: 1,
            fill: '#111',
            stroke: '#555',
            strokeWidth: '0.2',
            checked: event.isCheckBoxSelected('NOTES')
        });
        noteCheckBox.addTitle({
            id: 'noteCheckBoxTitle',
            class: 'visText',
            x: 56,
            y: 5,
            size: '1.0px',
            color: 'black',
            stroke: 0,
            text: 'Notes'
        });
    },

    patientSingleShowPreviousDay(previousDay) {
        var _self = this.app;
        if(previousDay > 0)
        {
            this.dayMode = 0;
            this.patientSingleCardio(_self, previousDay, this.dayMode);
            this.patientSinglePulmonary(_self, previousDay, this.dayMode);
        }
    },

    patientSingleCardio: function(_self, day, refreshFlag) {
        var event = this.event;
        var valueDump = [];
        var valueMax = [];

        d3.json("http://mthoma52.com/CareTransition/?action=getHourlyCardioData&day="+day, function(cardioData) {

            d3.select(_self.element)
                .append('div')
                .attr('id', 'cardioVis'+day)
                .attr('class', function(d) {
                    var allClasses = 'patientSingleVis';
                        if(!refreshFlag)
                            allClasses +=' previousDay';
                    return  allClasses;
                });

            var cardioDiv = d3.select('#cardioVis'+day)
                .selectAll('.cardioChart')
                .data(cardioData);
            var counter = 0;
            cardioDiv.enter()
                .append("div")
                .attr("class", "cardioChart")
                .append("svg")
                .attr("id", function(d, i) {
                    return "cardioSVG" + i;
                })
                .attr("class", function(d, i) {
                    valueDump = [];
                    var max = d3.max(d.values, function(e) {
                        valueDump.push(parseInt(e.n));
                        return 0;
                    });
                    valueMax.push(d3.max(valueDump));

                    return "cardioSVG";
                })
                .append("g");

            var svg = d3.selectAll('#cardioVis'+day+' .cardioSVG')
                .attr("width", self.appWidth / 12 + "px")
                .attr("height", self.appHeight / 6 + "px");

            var g = svg.select("g");

            g.append("rect")
                .attr("class", "background")
                .style({
                    "pointer-events": "all",
                })
                .attr("width", self.appWidth / 12 + "px")
                .attr("height", self.appHeight / 6.34 + "px");

            var xScale = d3.scale.linear().domain([1, 24]).range([0, self.appWidth / 12.8]);
            var yScale = d3.scale.linear().domain([0, d3.max(valueMax)]).range([self.appHeight / 7.2, 0]);

            var line = d3.svg.line()
                .x(function(d) {
                    return xScale(d.hour);
                })
                .y(function(d) {
                    return yScale(d.n);
                });

            var area = d3.svg.area()
                .x(function(d, i) {
                    return xScale(d.hour);
                })
                .y0(appHeight / 7.2).y1(function(d) {
                    return yScale(d.n);
                });

            var lines = g.append("g");
            var anomolies = [];
            var anomalyList = [];
            var min = 0;
            var max = 0;
            lines.append("path")
                .attr("class", "area_smallMultiples")
                .attr("d", function(c, i) {
                    if (i == 0) {
                        anomolies = [];
                        min = 72;
                        max = 90;
                        c.values.forEach(function(d) {
                            if (+d.n < min || +d.n > max) {
                                anomolies.push({HOUR: d.hour, VALUE: d.n});
                            }
                        });
                        anomalyList[i] = anomolies;
                    } else if (i == 1) {
                        anomolies = [];
                        min = 72;
                        max = 100;
                        c.values.forEach(function(d) {
                            if (d.n < min || d.n > max)
                                anomolies.push({HOUR: d.hour, VALUE: d.n});
                        });
                        anomalyList[i] = anomolies;
                    } else if (i == 2) {
                        anomolies = [];
                        min = 70;
                        max = 110;
                        c.values.forEach(function(d) {
                            if (d.n < min || d.n > max)
                                anomolies.push({HOUR: d.hour, VALUE: d.n});
                        });
                        anomalyList[i] = anomolies;
                    } else if (i == 3) {
                        anomolies = [];
                        min = 15;
                        max = 30;
                        c.values.forEach(function(d) {
                            if (d.n < min || d.n > max)
                                anomolies.push({HOUR: d.hour, VALUE: d.n});
                        });
                        anomalyList[i] = anomolies;
                    }
                    return area(c.values);
                });

            var path = lines.append("path")
                .attr("class", "line_smallMultiples")
                .attr("d", function(c) {
                    return line(c.values);
                });

            if (event.isCheckBoxSelected('ANOMALY')) {
                path[0].forEach(function(d, i) {

                    if (anomalyList[i]) {
                        var pathEl = d;
                        var pathLength = pathEl.getTotalLength();
                        anomalyList[i].forEach(function(d) {

                            var cx = xScale(d.HOUR);
                            var cy = yScale(d.VALUE);

                            var circle = d3.select('#cardioSVG' + i).append("circle")
                                .attr("cx", cx)
                                .attr("cy", cy)
                                .attr("r", self.appWidth / 600)
                                .attr("fill", function(d){
                                    if(!refreshFlag)
                                        return 'orange';
                                    else
                                        return '#de2d26';
                                })
                                .attr("opacity", function(d){
                                    if(!refreshFlag)
                                        return '0.8';
                                    else
                                        return '0.5';
                                });
                        });

                    }

                });
            }
            if(refreshFlag)
            {
                var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .outerTickSize(0)
                .tickSubdivide(1)
                .tickSize(-self.appHeight / 7.2)
                .ticks(5);

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .tickSize(self.appWidth / 12.8)
                .ticks(5);

            g.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            g.append("g")
                .attr("class", "x axis")
                .call(xAxis);

                _self.makeText(3, 7, "1.0px", "Cardio", 0, 'black').attr({
                    class: "visText"
                });
                _self.makeText(17.5, 17, "1px", "hrs", 0, 'black').attr({
                    class: "visText"
                });
                _self.makeText(30.5, 17, "1px", "hrs", 0, 'black').attr({
                    class: "visText"
                });
                _self.makeText(43.5, 17, "1px", "hrs", 0, 'black').attr({
                    class: "visText"
                });
                _self.makeText(56.5, 17, "1px", "hrs", 0, 'black').attr({
                    class: "visText"
                });

                _self.makeText(13, 18.5, "1.0px", "HR", 0, 'black').attr({
                    class: "visText"
                });
                _self.makeText(26, 18.5, "1.0px", "Pulse", 0, 'black').attr({
                    class: "visText"
                });
                _self.makeText(39, 18.5, "1.0px", "MAP", 0, 'black').attr({
                    class: "visText"
                });
                _self.makeText(52, 18.5, "1.0px", "PAPMean", 0, 'black').attr({
                    class: "visText"
                });
            }

            $('#cardioVis'+day).each(function() {
                this.style.setProperty('width', self.appWidth / 1.02 + "px", 'important');
                this.style.setProperty('height', self.appHeight / 2.76 + "px", 'important');
                this.style.setProperty('top', self.appHeight / 9 + "px", 'important');
                this.style.setProperty('left', self.appWidth / 64 + "px", 'important');
            });

            $('.cardioChart').each(function() {
                this.style.setProperty('width', self.appWidth / 12 + "px", '');
                this.style.setProperty('height', self.appHeight / 6.34 + "px", '');
                this.style.setProperty('padding-left', self.appWidth / 24 + "px", '');
            });

            $('.cardioSVG').each(function() {
                this.style.setProperty('padding-left', self.appWidth / 32 + "px", '');
                this.style.setProperty('padding-top', self.appHeight / 33.75 + "px", '');
            });

            $('.tick').each(function() {
                this.style.setProperty('font-size', self.appWidth / 64, '');
            });

        });
    },

    patientSinglePulmonary: function(_self, day, refreshFlag) {
        var valueDump = [];
        var valueMax = [];

        var event = this.event;
        d3.json("http://mthoma52.com/CareTransition/?action=getHourlyPulmonaryData&day="+day, function(pulmonaryData) {
            d3.select(_self.element)
                .append('div')
                .attr('id', 'pulmonaryVis'+day)
                .attr('class', function(d){
                    var allClasses = 'patientSingleVis';
                        if(!refreshFlag)
                            allClasses +=' previousDay';
                    return allClasses;
                });

            var pulmonaryDiv = d3.select('#pulmonaryVis'+day)
                .selectAll('.pulmonaryChart')
                .data(pulmonaryData);

            pulmonaryDiv.enter()
                .append("div")
                .attr("class", "pulmonaryChart")
                .append("svg")
                .attr("id", function(d, i) {
                    return "pulmonarySVG" + i;
                })
                .attr("class", function(d, i) {
                    valueDump = [];
                    var max = d3.max(d.values, function(e) {
                        valueDump.push(parseInt(e.n));
                        return 0;
                    });
                    valueMax.push(d3.max(valueDump));
                    return "pulmonarySVG";
                })
                .append("g");

            var svg = d3.selectAll('#pulmonaryVis'+day+' .pulmonarySVG')
                .attr("width", self.appWidth / 12 + "px")
                .attr("height", self.appHeight / 6 + "px")

            var g = svg.select("g");
            g.append("rect")
                .attr("class", "background")
                .style({
                    "pointer-events": "all",
                })
                .attr("width", self.appWidth / 12 + "px")
                .attr("height", self.appHeight / 6.34 + "px");

            var xScale = d3.scale.linear().domain([1, 24]).range([0, self.appWidth  / 12.8]);
            var yScale = d3.scale.linear().domain([0, d3.max(valueMax)]).range([self.appHeight / 7.2, 0]);

            var line = d3.svg.line()
                .x(function(d) {
                    return xScale(d.hour);
                })
                .y(function(d) {
                    return yScale(d.n);
                });

            var area = d3.svg.area()
                .x(function(d, i) {
                    return xScale(d.hour);
                })
                .y0(appHeight / 7.2).y1(function(d) {
                    return yScale(d.n);
                });

            var lines = g.append("g");

            var anomolies = [];
            var anomalyList = [];
            var min = 0;
            var max = 0;

            lines.append("path")
                .attr("class", "area_smallMultiples")
                .attr("d", function(c, i) {

                    if (i == 0) {
                        anomolies = [];
                        min = 12;
                        max = 20;
                        c.values.forEach(function(d) {
                            if (d.n < min || d.n > max)
                                anomolies.push({HOUR: d.hour, VALUE: d.n});
                        });
                        anomalyList[i] = anomolies;
                    } else if (i == 1) {
                        anomolies = [];
                        min = 94;
                        max = 99;
                        c.values.forEach(function(d) {
                            if (d.n < min || d.n > max)
                                anomolies.push({HOUR: d.hour, VALUE: d.n});
                        });
                        anomalyList[i] = anomolies;

                    }
                    return area(c.values);
                });

            lines.append("path")
                .attr("class", "line_smallMultiples")
                .attr("d", function(c) {
                    return line(c.values);
                });

            var path = lines.append("path")
                .attr("class", "line_smallMultiples")
                .attr("d", function(c) {
                    return line(c.values);
                });

            if (event.isCheckBoxSelected('ANOMALY')) {
                path[0].forEach(function(d, i) {

                    if (anomalyList[i]) {
                        var pathEl = d;
                        var pathLength = pathEl.getTotalLength();
                        anomalyList[i].forEach(function(d) {

                            var cx = xScale(d.HOUR);
                            var cy = yScale(d.VALUE);

                            var circle = d3.select('#pulmonarySVG' + i).append("circle")
                                .attr("cx", cx)
                                .attr("cy", cy)
                                .attr("r", self.appWidth / 600)
                                .attr("fill", function(d){
                                    if(!refreshFlag)
                                        return 'orange';
                                    else
                                        return '#de2d26';
                                })
                                .attr("opacity", function(d){
                                    if(!refreshFlag)
                                        return '0.8';
                                    else
                                        return '0.5';
                                });
                        });

                    }

                });
            }
            if(refreshFlag)
            {
                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .outerTickSize(0)
                    .tickSubdivide(1)
                    .tickSize(-appHeight / 7.2)
                    .ticks(5);

                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .tickSize(appWidth / 12.8)
                    .ticks(5);

                g.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

                g.append("g")
                    .attr("class", "x axis")
                    .call(xAxis);

                _self.makeText(62, 7, "1.0px", "Pulmonary", 0, 'black').attr({
                    class: "visText"
                });
                _self.makeText(76.5, 17, "1px", "hrs", 0, 'black').attr({
                    class: "visText"
                });
                _self.makeText(89.5, 17, "1px", "hrs", 0, 'black').attr({
                    class: "visText"
                });
                _self.makeText(72, 18.5, "1.0px", "Resp", 0, 'black').attr({
                    class: "visText"
                });
                _self.makeText(85, 18.5, "1.0px", "SpO2", 0, 'black').attr({
                    class: "visText"
                });

            }



            $('#pulmonaryVis'+day).each(function() {
                this.style.setProperty('width', appWidth / 1.02 + "px", 'important');
                this.style.setProperty('height', appHeight / 2.76 + "px", 'important');
                this.style.setProperty('top', appHeight / 9 + "px", 'important');
                this.style.setProperty('left', appWidth / 1.65 + "px", 'important');
            });

            $('.pulmonaryChart').each(function() {
                this.style.setProperty('width', appWidth / 12 + "px", '');
                this.style.setProperty('height', appHeight / 6.34 + "px", '');
                this.style.setProperty('padding-left', appWidth / 24 + "px", '');
            });

            $('.pulmonarySVG').each(function() {
                this.style.setProperty('padding-left', appWidth / 32 + "px", '');
                this.style.setProperty('padding-top', appHeight / 33.75 + "px", '');
            });

            $('.tick').each(function() {
                this.style.setProperty('font-size', appWidth / 72, '');
            });


        });
    }
}