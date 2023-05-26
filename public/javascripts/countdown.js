// countdown timer to a date and time I specify as an argument. 
// I will use this time to change a text on the webpage and update it to create a countdown effect.
// display the results in days, hours, minutes and seconds.

const countdown = (dateTextId, countdownTextId) => {
    
    const dateTextElement = document.getElementById(dateTextId);
    const countDownTextElement = document.getElementById(countdownTextId);
    //const countDownDate = new Date(date).getTime();
    
    if(dateTextElement === null || countDownTextElement === null) 
    {
        return;
    }

    const countDownDate = new Date(dateTextElement.innerHTML).getTime();

    const x = setInterval(
        function () {
            const now = new Date().getTime();
            const distance = countDownDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            //const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // hours
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // hours
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); // minutes
            const seconds = Math.floor((distance % (1000 * 60)) / 1000); // seconds
            countDownTextElement.innerHTML.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
            
            if (distance < 0) {
                clearInterval(x);
                countDownTextElement.innerHTML = "EXPIRED";
            }
        }, 1000);

}

// create Date that is 5 days from now
const date = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
countdown("countdowntime", "countdowntext");

//countdown(con.date, "countdowntext");
// countdown("Jan 5, 2021 15:37:25", "demo"); // test
// countdown("Jan 5, 2021 15:37:25", "demo"); // test
// countdown("Jan 5, 2021 15:37:25", "demo"); // test
// countdown("Jan 5, 2021 15:37:25", "demo"); // test

