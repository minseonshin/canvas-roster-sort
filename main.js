// ==UserScript==
// @name         myscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sort canvas roster
// @author       You
// @match        https://canvas.uw.edu/courses/*/users
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uw.edu
// @grant        none
// ==/UserScript==

// for testing locally
// @match        file:///home/minseon/test.html
// chrome://extensions , "Allow access to file URLs"
(function() {
    setTimeout(function() {
        const tableColumns = document.querySelectorAll('table.roster thead tr th');
        // https://stackoverflow.com/a/42907920/
        // https://stackoverflow.com/questions/282670/easiest-way-to-sort-dom-nodes
        // https://stackoverflow.com/questions/10186192/javascript-sort-of-html-elements
        for (const a of tableColumns) {
            if (a.textContent.includes("Last Activity")) {
                a.addEventListener("click", g);
                a.style.color = "blue";
                console.log("Sort Function Added");
            }
        }
    }, 5000);
    function g() {
        var months = [ "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec" ];
        var my_time = function(a) {
            let a1 = ((a.getElementsByTagName("td")[6]).getElementsByTagName("div")[0]).getAttribute('data-html-tooltip-title');
            if(!a1){a1 = "Sep 1, 2022 at 00:00am";}
            let a2 = a1.split(" ");
            let n1 = a2.length;
            let d0 = 2022; // year
            if(n1==4){d0++;}
            let d1 = months.indexOf(a2[0]); // month
            let d2 = parseInt(a2[1]); // day
            let a3 = a2[n1-1].split(":");
            let d3 = parseInt(a3[0]); // hour; parseInt("5pm") = 5, see https://stackoverflow.com/questions/4090518/what-is-the-difference-between-parseint-and-number
            if(d3 == 12){d3=0;}
            d3 += (a3[a3.length-1].charAt(a3[a3.length-1].length-2) == 'a' ? 0 : 12);
            let d4 = 0; // minute
            if(a3.length == 2){d4 = parseInt(a3[a3.length-1].substring(0,2));}
            return(60*(24*(32*(12*d0+d1)+d2)+d3)+d4);
        }
        var sort_by_name = function(a, b) {
            let au = my_time(a);
            let bu = my_time(b);
            return (au == bu ? 0 : (au > bu ? -1 : 1));
        }

        var list = document.querySelectorAll('tbody.collectionViewItems')[0];
        var items = list.children;
        var ia = [];
        for (var it in items) {
            if (items[it].nodeType == 1) { ia.push(items[it]); }
        }
        ia.sort(sort_by_name);
        for (var i = 0; i < ia.length; i++) {
            list.appendChild(ia[i]);
        }
    }
})();
