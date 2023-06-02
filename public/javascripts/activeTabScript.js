
/*$('.nav.navbar-nav > li').on('click', function(e) {
    $('.nav.navbar-nav > li').removeClass('active');
    $(this).addClass('active');
});*/

function setNavTab() {
    
    /*
    $.each($('#navbar').find('li'), function() {        
        console.log("Found this: " + $(this).find('a').attr('href'));
        $(this).toggleClass('active', 
            window.location.pathname.indexOf($(this).find('a').attr('href')) > -1);
    });
    */

    var navbarUl = document.getElementsByClassName("navbar-nav")[0];
    const listItems = navbarUl.getElementsByClassName("nav-item");
    console.log("Found this many list items: " + listItems.length);
    for (let i = 0; i < listItems.length; i++) {
        const listItem = listItems[i];
        const anchor = listItem.getElementsByTagName("a")[0];
        const href = anchor.getAttribute("href");
        console.log("Found this: " + href);
        if (window.location.pathname.indexOf(href) > -1) {
            listItem.classList.add("active");
        }
    }
    
    /*

    var navItems = document.getElement("ul.navbar-nav").getElements("li");
    navItems.forEach(element => {
        console.log("Found this: " + element.find('a').attr('href'));
    });

    */

    console.log("Active tab script loaded.");
    console.log(window.location.pathname); 
}

setNavTab();