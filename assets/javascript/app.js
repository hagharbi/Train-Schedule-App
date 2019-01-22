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

    // Event handler to add train schedule
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
        var current = moment().format('HH:mm');
        $("#currentTime").html(current);
        setTimeout(currentTime, 1000);
    };

    // Grabs new added train schedules
    database.ref().on(
        "child_added",
        function(snapshot) {

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

            // Convert start time 
            var startTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
            
            // Calculate difference between times in minutes
            var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
            
            // Calculate the remainder in frequency
            var timeRemain = timeDiff % trainFreq;

            // Calculate Minutes to next train
            var minToArrival = trainFreq - timeRemain;

            // Next Train time
            var nextTrain = moment().add(minToArrival, "minutes");


            // Append to the table row to display employee data
            var addTrainRow = $("#add-train-row");
            var newTrain = $("<tr>").append(
                $("<td>").text(trainName),
                $("<td>").text(trainDest),
                $("<td>").text(trainFreq),
                $("<td>").text(moment(nextTrain).format("HH:mm")),
                $("<td>").text(minToArrival),
                $("<td>").html("<i id='update' class='fa fa-edit' style='color:blue' aria-hidden='true'></i>"),
                $("<td>").html("<i id='close' class='fa fa-times' style='color:red' aria-hidden='true'></i>")
            );
                $(addTrainRow).append(newTrain);

                // Removes train schedule entry 
                $('table').on('click', '#close', function(e){
                $(this).closest('tr').remove()
                })

                // Delete from Firebase(pending)

                // Edit train schdule entry (pending)
        }
        
    )
    
    currentTime();
    
    // Update train schedule once every minute
    setInterval(function () {
        window.location.reload();
    }, 60000);
});