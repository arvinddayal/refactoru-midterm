$(function(){

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
		}
	];

	var date = new Date();

	localStorage['allAppts'] = JSON.stringify(allAppts);
	var storedAppts = JSON.parse(localStorage['allAppts']);
	
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

    //Get Form Info
    var getNewAppt = function() {
		return {
			date: $('#datebox').val(),
			appointment: $('#apptbox').val()
		};
    };
   
    //Get Form Info
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

    //end variables




    //Functions

    //Pushes date into time-bar div
    pushDate();
	createTwoWeek();

    //Clicking on + Icon Toggles Appt. Form
    $('#add-appt').click(function(){
		$('#appt-form').toggle('display');
    });

    //Clicking on + Icon Toggles Task Form
    $('#add-task').click(function(){
		$('#task-form').toggle('display');
    });

    //Clicking on "view archive" Icon Toggles Archived Tasks div
    $('#view-archive').click(function(){
		$('.archived-tasks').toggle('display');
		showArchivedTasks(allTasks);
    });



    //Clicking Form Submit Button stores info in allAppts array, clears form, updates DOM
    $('#submit-appt').click(function(e){
		e.preventDefault();
		var x = getNewAppt();
		allAppts.push(x);
		addAppts(allAppts);
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
		$(this).prev('input').val("");
		$('#task-form').toggle('display');
    });

    //Clicking on date toggles display of appointments
    $(document).on('click', "#date", function(){
		$(this).nextAll('ul').toggle('display');
    });

    //Clicking "archive appt" removes appointment UL/LI, archives appt
    $(document).on('click', "#archive-appt", function(){
		var apptText = $(this).parent().prev().text();
		archiveAppt(apptText);
		$(this).parent().parent('ul').remove();
    });

    //Clicking "archive" removes appointment UL/LI, archives task
    $(document).on('click', "#archive-task", function(){
		var taskText = $(this).parent().prev('li').text();
		archiveTask(taskText);
		$(this).parent().parent('ul').remove();
    });

    //Clicking "restore" in tasks un-archives that task
    $(document).on('click', "#restore-task", function(){
		var archTaskText = $(this).parent().prev().text();
		restoreTasks(archTaskText);
		addTasks(allTasks);
		$('.archived-tasks').toggle('display');
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