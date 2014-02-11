$(function(){

	var allAppts = [];
	var d = new Date();
	var counter = 0;
	


	/* takes a single date option
		and returns a string representation with
		the format of thursday, MM/DD/YYYY
	*/
	var buildDateStr = function(){
		var options = {weekday: "long", year: "numeric", month: "numeric", day: "numeric"};

		return d.toLocaleString("en-US", options);
	};


	//Returns an array of new dates
	var getFutureDateArray = function(d, len){
		var ary = [];
		var date = d;

		for(var i = 0; i < len; i++){
			ary.push(buildDateStr(date));
			date.setDate(date.getDate() + 1);
		}

		return ary;
	};

	//Creates new LIs with date from getFutureDate
	var newDay = function() {
		for (var i = 0; i < 7; i++) {
			var newLi = $('<li id="date"></li>').append(getFutureDateArray(d, i));
			$('#calendar').append(newLi);
		}
	};

	/**
	 * Creates new Time
	 * @return {String} [Time in HH:MM AM/PM]
	 */
	var makeTime = function() {

		var hours = d.getHours();
		if (hours > 12) {
			hours = (hours - 12);
			ampm = "PM";
		}
		else {
			hours = hours;
			ampm = "AM";
		}
		var mins = d.getMinutes();
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
    var newDate = function() {
		var newDiv = $('<div class="new-day">');
		var newDateHolder = $('<h4 class="date" id="date"></h4>');
		var newDayDiv = newDiv.append(newDateHolder);
    };



    //end variables







    //Functions

    //Pushes date into time-bar div
    pushDate();


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


});