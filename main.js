$(function(){

	var allAppts = [];
	var allTasks = [];
	var date = new Date();
	localStorage["allAppts"] = JSON.stringify(allAppts);
	var storedAppts = JSON.parse(localStorage["allAppts"]);
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
		var dayStr = date.toDateString();
		var newDiv = $('<div class="new-day" data-date="{0}"></div>'.supplant([moment(dayStr).format("MM/DD/YYYY")]));
		var newDateHolder = $('<h4 class="date" id="date">{0}</h4>'.supplant([dayStr]));
		var newDay = newDiv.append(newDateHolder);
		$('#calendar').append(newDay);
    };


    var createTwoWeek = function() {
		for (var i = 0; i < 14; i++) {
			var date = new Date();
			date.setDate(date.getDate() + i);
			newDate(date);
		}
    };

    var newAppt = function(allAppts) {
		var newApptUl = $('<ul class="new appt" id="new-appt></ul>');
		var newApptLi = $('<li>{0}</li>'.supplant(allAppts['value']));
		var newDelLi = $('<li><a id="delete-button" href="#">Delete Appt</a></li>');
		var newApptEl = newApptUl.append(newApptLi, newDelLi);
		return newApptEl;
    };

    //Searches allAppts Object, pushes k/v pairs into match date
    var addAppts = function(allAppts) {
		for (var i = 0; i < allAppts.length; i++) {
			if (allAppts['key']=== $('div.new-day').data('date')) {
				$('div.new-day').append(newAppt);
			}
		}
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
		var x = $(this).parent().serializeArray();
		allAppts.push(x);
		$(this).prev('input').val("");
		$(this).prev().prev('input').val("");
		console.log(allAppts);
		addAppts();
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