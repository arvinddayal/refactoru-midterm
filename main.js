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
	var allTasks = [];
	var date = new Date();
	localStorage['allAppts'] = JSON.stringify(allAppts);
	var storedAppts = JSON.parse(localStorage['allAppts']);
	console.log(allAppts);
	
	/**
	 * Creates new Time
	 * @return {String} [Time in HH:MM AM/PM]
	 */
	var makeTime = function() {

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
		setInterval(x, 1000);
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

    //Creates new appointment UL with appointment info and delete button
    var newAppt = function(apptInst) {
		console.log(apptInst);
		var newApptUl = $('<ul class="new appt" id="new-appt"></ul>');
		var newApptLi = $('<li>{0}</li>'.supplant([apptInst]));
		var newDelLi = $('<li><a id="delete-button" href="#">Delete Appt</a></li>');
		var newApptEl = newApptUl.append(newApptLi, newDelLi);
		return newApptEl;
    };

    //Searches allAppts Object, pushes k/v pairs into match date
    var addAppts = function(allAppts) {
		for (var i = 0; i < allAppts.length; i++) {
			var apptInst = allAppts[i].appointment;
			if (allAppts[i].date == $('.calendar').find("[data-date='" + allAppts[i].date + "']")); {
				$('.calendar').find("[data-date='" + allAppts[i].date + "']").append(newAppt(apptInst));
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
    

    //end variables




    //Functions

    //Pushes date into time-bar div
    pushDate();
	createTwoWeek();

    //Clicking on + Icon Toggles Appt. Form
    $('#add-button').click(function(){
		$('#appt-form').toggle('display');
    });

    //Clicking Submit Button stores info in allAppts array, clears form
    $('#submit-appt').click(function(e){
		e.preventDefault();
		var x = getNewAppt();
		allAppts.push(x);
		addAppts(allAppts);
		$(this).prev('input').val("");
		$(this).prev().prev('input').val("");
		$('#appt-form').toggle('display');
    });

    //Clicking on date toggles display of appointments
    $(document).on('click', "#date", function(){
		$(this).nextAll('ul').toggle('display');
    });

    //Clicking "delete" removes LIs and ULs
    $(document).on('click', "#delete-button", function(){
		$(this).parent().parent('ul').remove();
    });

    //Infinite scroll for calendar, adds new days
	$('#calendar-bar').on('scroll', function scrollHandler() {
		var distanceFromBottom = $('#calendar-bar').height() - $('#calendar-bar').scrollTop() - $('#calendar-bar').height();
		if(distanceFromBottom < $('#calendar-bar').height()) {
		var x = $('div.new-day:last').data('date');
		y = (new Date(x));
		y.setDate(y.getDate()+1);
		newDate(y);
		}
	});

	













});