$(function(){

	var date = new Date();

	var save = function () {
		localStorage['allAppts'] = JSON.stringify(allAppts);
		localStorage['allTasks'] = JSON.stringify(allTasks);
	};

	var allAppts = [
		{
			date: '02/14/2014',
			appointment: 'Presentation'
		},
		{
			date: '02/15/2014',
			appointment: 'Saturday'
		}
	];

	var allTasks = [
		{
			task: "Mid-Term"
		},
		{
			task: "Learn How To Code"
		}
	];

	var restoreAll = function() {
		if(localStorage.allTasks){
			allTasks = JSON.parse(localStorage['allTasks']);
			allAppts = JSON.parse(localStorage['allAppts']);
		}
	};

	/**
	 * Creates new Time
	 * @return {String} [Time in HH:MM AM/PM]
	 */
	var makeTime = function() {
		date = new Date();
		var hours = date.getHours();
		if (hours > 12) {
			hours = (hours - 12);
			ampm = "PM";
		}
		else {
			hours = hours;
			ampm = "AM";
		}
		var mins = date.getMinutes();
		if (mins < 10) {
			mins = "0" + mins;
		}
		var time = hours + ":" + mins + " " + ampm;
		return time;
	};

	/**
	 * pushes date to Time Bar (Top Left Corner)
	 * @return {[String]} [Updates every second]
	 */
    var pushDate = function(){
		var x = function() {
			$("#time-bar").text(makeTime);
		};
		setInterval(x,1000);
    };

    //Weather Info JS Starts Here
    var loc = '80303';
    var u = 'f';
 
    var query = "SELECT item.condition FROM weather.forecast WHERE location='" + loc + "' AND u='" + u + "'";
    var cacheBuster = Math.floor((new Date().getTime()) / 1200 / 1000);
    var url = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + '&format=json&_nocache=' + cacheBuster;
 
    window['wxCallback'] = function(data) {
        var info = data.query.results.channel.item.condition;
        $('.wxIcon').css({
            backgroundPosition: '-' + (61 * info.code) + 'px 0'
        }).attr({
            title: info.text
        });
        $('.wxIcon2').append('<img src="http://l.yimg.com/a/i/us/we/52/' + info.code + '.gif" width="34" height="34" title="' + info.text + '" />');
        $('.wxTemp').html(info.temp + '&deg;' + (u.toUpperCase()));
    };
 
    $.ajax({
        url: url,
        dataType: 'jsonp',
        cache: true,
        jsonpCallback: 'wxCallback'
    });
    //Weather Info JS Ends Here

    //Creates new date div
    var newDate = function(date) {
		var dayStr= date.toDateString();
		var newDiv = $('<div class="new-day" data-date="{0}"></div>'.supplant([moment(dayStr).format("MM/DD/YYYY")]));
		var newDateHolder = $('<h4 class="date" id="date">{0}</h4>'.supplant([dayStr]));
		var newDay = newDiv.append(newDateHolder);
		$('#calendar').append(newDay);
    };

    //Renders first two weeks in calendar
    var createTwoWeek = function() {
		for (var i = 0; i < 14; i++) {
			var date = new Date();
			date.setDate(date.getDate() + i);
			newDate(date);
		}
    };

    //Creates new appointment UL with appointment info and archive button
    var newAppt = function(apptInst) {
		var newApptUl = $('<ul class="new-appt" id="new-appt"></ul>');
		var newApptLi = $('<li>{0}</li>'.supplant([apptInst]));
		var newDelLi = $('<li class="archive-appt"><a id="archive-appt" href="#">Archive Appt</a></li>');
		var newApptEl = newApptUl.append(newApptLi, newDelLi);
		return newApptEl;
    };

    //Searches allAppts Object, pushes appointment value into match date
    var addAppts = function(allAppts) {
		$('.new-appt').remove();
		for (var i = 0; i < allAppts.length; i++) {
			var apptInst = allAppts[i].appointment;
			if (allAppts[i].date == $('.calendar').find("[data-date='" + allAppts[i].date + "']")); {
				$('.calendar').find("[data-date='" + allAppts[i].date + "']").append(newAppt(apptInst));
			}
		}
    };

    //Creates new task UL with task info and archive button
    var newTask = function(taskInst) {
		var newTaskUl = $('<ul class="new-task" id="new-task"></ul>');
		var newTaskLi = $('<li>{0}</li>'.supplant([taskInst]));
		var newDelLi = $('<li class="archive-task"><a id="archive-task" href="#">Archive</a></li>');
		var newTaskEl = newTaskUl.append(newTaskLi, newDelLi);
		return newTaskEl;
    };

    //Searches allTasks Object, pushes task value into match date
    var addTasks = function(allTasks) {
		$('.new-task').remove();
		for (var i = 0; i < allTasks.length; i++) {
			var taskInst = allTasks[i].task;
			if (allTasks[i].task.substr(0,8) !== "archived") {
				$('.task-list').append(newTask(taskInst));
			}
		}
    };

    //Get Appt Form Info
    var getNewAppt = function() {
		return {
			date: $('#datebox').val(),
			appointment: $('#apptbox').val()
		};
    };
   
    //Get Task Form Info
    var getNewTask = function() {
		return {
			task: $('#taskbox').val(),
		};
    };

    //Archive appointments
    var archiveAppt = function(apptText) {
		for (var i = 0; i < allAppts.length; i++) {
			if (allAppts[i].appointment == apptText) {
				allAppts[i].date = "archived"+allAppts[i].date;
			}
		}
    };

    //Archive tasks
    var archiveTask = function(taskText) {
		for (var i = 0; i < allTasks.length; i++) {
			if (allTasks[i].task == taskText){
				allTasks[i].task = "archived"+allTasks[i].task;
			}
		}
    };

    //Creates archived tasks UL and restore button
    var createArchivedTasks = function(archTaskInst) {
		var archTaskUl = $('<ul class="new-task" id="new-task"></ul>');
		var archTaskLi = $('<li>{0}</li>'.supplant([archTaskInst.substr(8)]));
		var archResLi = $('<li class="restore-task"><a id="restore-task" href="#">Restore</a></li>');
		var archTaskEl = archTaskUl.append(archTaskLi, archResLi);
		return archTaskEl;
    };

    //Populates archived tasks to DOM
    var showArchivedTasks = function(allTasks) {
		$('.archived-tasks').empty();
		for (var i = 0; i < allTasks.length; i++) {
			archTaskInst = allTasks[i].task;
			if (allTasks[i].task.substr(0,8) == "archived") {
				$('.archived-tasks').append(createArchivedTasks(archTaskInst));
			}
		}
    };

    //restore archived tasks
    var restoreTasks = function(archTaskText) {
		for (var i = 0; i < allTasks.length; i++) {
			if (allTasks[i].task.substr(8) == archTaskText) {
				allTasks[i].task = allTasks[i].task.substr(8);
			}
		}
    };

    //Creates archived appts UL and restore button
    var createArchivedAppts = function(archApptInstA, archApptInstD) {
		var archApptUl = $('<ul class="new-appt1" id="new-appt1"></ul>');
		var archApptLi = $('<li>{0}, {1}</li>'.supplant([archApptInstA, archApptInstD.substr(8)]));
		var archResLi = $('<li class="restore-appt"><a id="restore-appt" href="#">Restore</a></li>');
		var archTaskEl = archApptUl.append(archApptLi, archResLi);
		return archTaskEl;
    };

    //Populates archived appts to DOM
    var showArchivedAppts = function(allAppts) {
		$('.archived-appts').empty();
		for (var i = 0; i < allAppts.length; i++) {
			archApptInstA = allAppts[i].appointment;
			archApptInstD = allAppts[i].date;
			if (allAppts[i].date.substr(0,8) == "archived") {
				$('.archived-appts').append(createArchivedAppts(archApptInstA, archApptInstD));
			}
		}
    };

    //restore archived appts
    var restoreAppts = function(archApptText) {
		for (var i = 0; i < allAppts.length; i++) {
			if (allAppts[i].date.substr(8) == archApptText) {
				allAppts[i].date = allAppts[i].date.substr(8);
			}
		}
    };
    
    //end variables

    //Functions

    //Retrieve local storage
    restoreAll();
    // restoreT();
    //Pushes date into time-bar div
    pushDate();
	//Populates first two weeks with any stored appts
	createTwoWeek();
	//Populates any stored appts
	addAppts(allAppts);
	//Populates any stored tasks
	addTasks(allTasks);

    //Clicking on + Icon Toggles Appt. Form
    $('#add-appt').click(function(){
		$('#appt-form').toggle('display');
    });

    //Clicking on + Icon Toggles Task Form
    $('#add-task').click(function(){
		$('#task-form').toggle('display');
    });

    //Clicking on "view archive" Toggles Archived Tasks div
    $('#view-arch-tasks').click(function(){
		$('.archived-tasks').toggle('display');
		showArchivedTasks(allTasks);
    });

    //Clicking on "view archive" Toggles Archived Appts div
    $('#view-arch-appts').click(function(){
		$('.archived-appts').toggle('display');
		showArchivedAppts(allAppts);
    });
    
    //Clicking on date toggles display of appointments
    $(document).on('click', "#date", function(){
		$(this).nextAll('ul').toggle('display');
    });

    //Clicking Form Submit Button stores info in allAppts array, clears form, updates DOM
    $('#submit-appt').click(function(e){
		e.preventDefault();
		var x = getNewAppt();
		allAppts.push(x);
		addAppts(allAppts);
		save();
		$(this).prev('input').val("");
		$(this).prev().prev('input').val("");
		$('#appt-form').toggle('display');
    });

    //Clicking Task Submit Button stores info in allTasks array, clears form, updates DOM
    $('#submit-task').click(function(e){
		e.preventDefault();
		var x = getNewTask();
		allTasks.push(x);
		addTasks(allTasks);
		save();
		$(this).prev('input').val("");
		$('#task-form').toggle('display');
    });

    //Clicking "archive appt" removes appointment UL/LI, archives appt
    $(document).on('click', "#archive-appt", function(){
		var apptText = $(this).parent().prev().text();
		archiveAppt(apptText);
		save();
		$(this).parent().parent('ul').remove();
    });

    //Clicking "archive" removes appointment UL/LI, archives task
    $(document).on('click', "#archive-task", function(){
		var taskText = $(this).parent().prev('li').text();
		archiveTask(taskText);
		save();
		$(this).parent().parent('ul').remove();
    });

    //Clicking "restore" in tasks un-archives that task
    $(document).on('click', "#restore-task", function(){
		var archTaskText = $(this).parent().prev().text();
		restoreTasks(archTaskText);
		addTasks(allTasks);
		save();
		$('.archived-tasks').toggle('display');
    });

    //Clicking "restore" in appts un-archives that appts
    $(document).on('click', "#restore-appt", function() {
		var archApptText = $(this).parent().prev().text().substr(-10);
		restoreAppts(archApptText);
		addAppts(allAppts);
		save();
		$('.archived-appts').toggle('display');
    });

    //Infinite scroll for calendar, adds new days, updates DOM with appts
	$('#calendar').on('scroll', function scrollHandler() {
		var distanceFromBottom = $('#calendar').height() - $('#calendar').scrollTop() - $('#calendar').height();
		if(distanceFromBottom < $('#calendar').height()) {
		var x = $('div.new-day:last').data('date');
		y = (new Date(x));
		y.setDate(y.getDate()+1);
		newDate(y);
		}
		addAppts(allAppts);
	});

});