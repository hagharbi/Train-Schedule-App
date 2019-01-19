$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC_IBRWPZ_zzOV5IC6VOJeZOlk8pTWFUAY",
        authDomain: "train-schedule-bddf4.firebaseapp.com",
        databaseURL: "https://train-schedule-bddf4.firebaseio.com",
        projectId: "train-schedule-bddf4",
        storageBucket: "train-schedule-bddf4.appspot.com",
        messagingSenderId: "346504777142"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // Create event handler for 'Submit' click
    $("#add-train-button").on("click", function (event) {
        event.preventDefault();

        //Create object with properties
        //set to input field values
        var train = {
            name: $("#train-input").val().trim(),
            destination: $("#destination-input").val().trim(),
            time: $("#time-input").val().trim(),
            frequency: $("#frequency-input").val().trim()
        }

        // Push object to DB
        database.ref().push(train);
        console.log(train);

    });

    function currentTime() {
        var current = moment().format('LT');
        $("#currentTime").html(current);
        setTimeout(currentTime, 1000);

        console.log(current);
    };

    database.ref().on(
        "child_added",
        function(snapshot) {

            var startTimeConverted = moment(snapshot.val().time, "hh:mm").subtract(1, "years");
            var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
            var timeRemain = timeDiff % snapshot.val().frequency;
            var minToArrival = snapshot.val().frequency - timeRemain;
            var nextTrain = moment().add(minToArrival, "minutes");
            var key = snapshot.key;

            var train = snapshot.val();
            console.log("child:", train);

            var trainName = snapshot.val().name;
            var trainDest = snapshot.val().destination;
            var trainTime = snapshot.val().time;
            var trainFreq = snapshot.val().frequency;

            // Train Info
            console.log(trainName);
            console.log(trainDest);
            console.log(trainTime);
            console.log(trainFreq);

            // var departTime = moment.unix(trainTime).format("HH:MM");
            
            // var minutesAway = moment().diff(moment(trainTime, "X"), "HH:MM");

            // var minutesAway = trainTime - currentTime;
            // console.log(minutesAway);


            //Append to the table row to display employee data


            var addTrainRow = $("#add-train-row");
            var newTrain = $("<tr>").append(
                $("<td>").text(trainName),
                $("<td>").text(trainDest),
                $("<td>").text(trainFreq),
                $("<td>").text(moment(nextTrain).format("LT")),
                $("<td>").text(minToArrival),
            );
                $(addTrainRow).append(newTrain);
            
        }
    )
    
    currentTime();

    
});