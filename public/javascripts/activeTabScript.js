

function setNavTab() {

    var navbarUl = document.getElementsByClassName("navbar-nav")[0];
    const listItems = navbarUl.getElementsByClassName("nav-item");

    let matches = [];

    for (let i = 0; i < listItems.length; i++) {
        const listItem = listItems[i];
        const anchor = listItem.getElementsByTagName("a")[0];
        const href = anchor.getAttribute("href");
        //console.log("Found this: " + href);

        let match = {
            "string": href,
            "length": href.length,
            "goodness": window.location.pathname.indexOf(href),
            "listItem": listItem,
        };
        if (match.goodness > -1) {
            matches.push(match);
        }
    }

    matches.sort((a, b) => {
        return b.length - a.length;
    });

    matches[0].listItem.classList.add("active");
    //console.log("Matches: " + matches.length);
    //console.log(matches);
}

setNavTab();