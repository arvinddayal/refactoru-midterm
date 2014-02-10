$(function(){

	var allAppts = [];

	/**
	 * Creates new Date
	 * @return {String} [Date in HH:MM AM/PM]
	 */
	var makeTime = function() {
		var d = new Date();
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

    //end variables


    //Functions

    //Pushes date into time-bar div
    pushDate();


    //Clicking on + Icon Toggles Appt. Form
    $('#add-button').click(function(){
		$('#appt-form').toggle('display');
    });

    //Clicking Submit Button stores info in ___, clears form
    $('#submit-appt').click(function(e){
		e.preventDefault();
		var x =$(this).parent().serializeArray();
		$(this).prev('input').val("");
		$(this).prev().prev('input').val("");
		allAppts.push(x);
    });







});