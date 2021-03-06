streetlightApp.controller('matrixCtrl', ['$scope', 'persistentAppSettings', function ($scope, persistentAppSettings) {

	// matrix code from http://thecodeplayer.com/walkthrough/matrix-rain-animation-html5-canvas-javascript
	var c = document.getElementById("matrix");
	var ctx = c.getContext("2d");

	//making the canvas full screen
	c.height = window.innerHeight;
	c.width = window.innerWidth;

	//chinese characters - taken from the unicode charset
	var chinese = "田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑";
	//converting the string into an array of single characters
	chinese = chinese.split("");

	fontSizeRatio = parseInt(persistentAppSettings.get('fontSize'))/100.0
	$scope.flipScreenVertically = persistentAppSettings.getBoolean('verticalFlip')
	
	var font_size = parseInt(60 * fontSizeRatio);
	var columns = c.width/font_size; //number of columns for the rain
	//an array of drops - one per column
	var drops = [];
	//x below is the x coordinate
	//1 = y co-ordinate of the drop(same for every drop initially)
	for(var x = 0; x < columns; x++)
		drops[x] = 1; 

	//drawing the characters
	function drawMatrixStep()
	{
		//Black BG for the canvas
		//translucent BG to show trail
		ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
		ctx.fillRect(0, 0, c.width, c.height);
		
		ctx.fillStyle = "#0F0"; //green text
		ctx.font = font_size + "px arial";
		//looping over drops
		for(var i = 0; i < drops.length; i++)
		{
			//a random chinese character to print
			var text = chinese[Math.floor(Math.random()*chinese.length)];
			//x = i*font_size, y = value of drops[i]*font_size
			ctx.fillText(text, i*font_size, drops[i]*font_size);
			
			//sending the drop back to the top randomly after it has crossed the screen
			//adding a randomness to the reset to make the drops scattered on the Y axis
			if(drops[i]*font_size > c.height && Math.random() > 0.975)
				drops[i] = 0;
			
			//incrementing Y coordinate
			drops[i]++;
		}
	}


	var intervalID = setInterval(drawMatrixStep, 50);
	
	var onPositionUpdated = function(position){
		if(intervalID)
			clearInterval(intervalID)

        var speedMetersPerSecond = (position.coords.speed || .0) + 0.1

    	var intervalMillis = 200 - (speedMetersPerSecond * 3.6)*9
    	if(intervalMillis < 10)
    		intervalMillis = 10
    	intervalID = setInterval(drawMatrixStep, intervalMillis);
    }

    var onPositionGatheringFailed = function(error){console.log('watchPosition error: '+error)}

    var geoOptions = {
      enableHighAccuracy: true, 
      timeout           : 300
    };

    var watchPositionID = navigator.geolocation.watchPosition(onPositionUpdated, onPositionGatheringFailed, geoOptions)

    $scope.$on('$destroy',function(){
      navigator.geolocation.clearWatch(watchPositionID)
    });
}]);
