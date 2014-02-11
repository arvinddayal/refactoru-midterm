$(function(){

	var allAppts = [];
	var date = new Date();
	var counter = 0;
	
	//returns a string representation with
	//the format of thursday, MM/DD/YYYY
	var currentDayStr = function(date){
		return moment().format("dddd, MMMM Do YYYY");
		// return date.toDateString();
	};


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

  //   var createTwoDay = function(date) {
		// for (var i = 0; i < 2; i++) {
		// 	var date = new Date();
		// 	date.setDate(date.getDate() + i);
		// 	newDate(date);
		// }
  //   };


    

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
		console.log(x);
		y = (new Date(x));
		y.setDate(y.getDate()+1);
		newDate(y);
		}
	});

	













});