
function parseTimeToMilliSeconds(time) {
    var parts = time.split(':');
    return (+parts[0]) * 60 * 60 + (+parts[1]) * 60 * 1000;
}

// countdown timer to a date and time I specify as an argument. 
// I will use this time to change a text on the webpage and update it to create a countdown effect.
// display the results in days, hours, minutes and seconds.

const countdown = (dateTextId, earliestStartTime, countdownTextId) => {

    const dateTextElement = document.getElementById(dateTextId);
    const earliestStartTimeMilliseconds = document.getElementById(earliestStartTime);
    const countDownTextElement = document.getElementById(countdownTextId);

    if (dateTextElement === null || countDownTextElement === null || earliestStartTimeMilliseconds === null) {
        return;
    }

    //console.log("Found this for target time: " + dateTextElement.innerHTML);
    //console.log("Found this for text output: " + countDownTextElement.innerHTML);

    const countDownDate = new Date(Date.parse(dateTextElement.innerHTML));
    const millisecondsIntoDay = parseTimeToMilliSeconds(earliestStartTimeMilliseconds.innerHTML); // convert to hours);
    countDownDate.setTime(date.getTime() + millisecondsIntoDay); // add 15 hours to the date
    countDownTime = countDownDate.getTime();

    //console.log("Countdown date: " + countDownDate.toString());

    const x = setInterval(
        function () {
            const now = new Date().getTime();
            const distance = countDownTime - now;
            //console.log("Distance: " + distance.toString());

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // hours
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); // minutes
            const seconds = Math.floor((distance % (1000 * 60)) / 1000); // seconds
            countDownTextElement.innerHTML = "<strong>countdown:</strong> " + days + "d " + hours
                + "h " + minutes + "m " + seconds + "s ";

            if (distance < 0) {
                clearInterval(x);
                countDownTextElement.innerHTML = "EXPIRED";
            }
        }, 1000);

}

// create Date that is 5 days from now
const date = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
countdown("countdowntime", "earlieststarttime", "countdowntext");

//countdown(con.date, "countdowntext");
// countdown("Jan 5, 2021 15:37:25", "demo"); // test
// countdown("Jan 5, 2021 15:37:25", "demo"); // test
// countdown("Jan 5, 2021 15:37:25", "demo"); // test
// countdown("Jan 5, 2021 15:37:25", "demo"); // test

