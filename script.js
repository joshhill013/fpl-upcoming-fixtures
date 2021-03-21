//Run extension
if(document.location.href.indexOf("my-team") > -1) {
    updateDOM();
    console.log("Upcoming fixtures extension running");
}
var oldHref = document.location.href;
window.onload = function() {
    var bodyList = document.querySelector("body")
    ,observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                if(document.location.href.indexOf("my-team") > -1 && document.location.href.indexOf("#0") == -1) {
                    updateDOM();
                    console.log("Upcoming fixtures extension running");
                }
            }
        });
    });

    var config = {
        childList: true,
        subtree: true
    };

    observer.observe(bodyList, config);
};

//Update DOM function
function updateDOM () {

    var element = document.getElementsByClassName("sc-AykKC jsjLzv")[1];
    var nextGameweekLink = document.getElementById("nextGameweekLink");

    if(element && !nextGameweekLink) {
              
        //Define variables
        var teams = [];             //array to store team data from FPL API
        var fixtures = [];          //array to store fixture data from FPL API
        var events = [];            //array to store event (gameweek) data from FPL API
        var fplTeam_teams = [];     //array to store the teams (in order) that the players in your fantasy team play for
        var fplTeam_fixtures = [];  //array to store your team's fixtures (in order) for the gameweek currently being viewed

        //Fetch current gameweek no
        var deadlineBar = document.getElementsByClassName("DeadlineBar__DeadlineBarInner-sc-15w29wz-0 hghGMz")[0];
        var deadlineBarText = deadlineBar.getElementsByTagName("H3")[0].innerText.replace(":", "");
        var gameweek = parseInt(deadlineBarText.substring(8, deadlineBarText.length));
        var gameweekLoaded = gameweek;
        console.log("Viewing gameweek: " + gameweekLoaded);

        //Create infoBar
        var saveBar = document.getElementsByClassName("SaveBar-sc-1juyyag-0 fPTxLj")[0];
        var copy = saveBar.cloneNode(true);
        copy.getElementsByTagName("BUTTON")[0].remove();
        copy.className = "infoBar";
        copy.style.visibility = "hidden";
        var info = document.createElement("P");
        info.innerHTML = "Please return to the current gameweek to activate chips or save your team.<br/>(gameweek " + gameweek + ")";
        info.style.textAlign = "center";
        copy.appendChild(info);
        var mainDiv = document.getElementsByClassName("Layout__Main-eg6k6r-1 haICgV")[0];
        mainDiv.insertBefore(copy, mainDiv.children[5]);

        var chipBar = document.getElementsByClassName("MyTeam__ChipList-sc-6ytjxx-0 fIhsxq")[0];
        if(chipBar) {
            chipBar.style.marginBottom = "1.5rem";
        }

        //Clone sidebar element
        var clone = element.cloneNode(true);
        var parent = document.getElementsByClassName("sc-AykKC bQEouU")[0];
        parent.insertBefore(clone, parent.children[2]);

        //Update heading
        clone.getElementsByTagName("H4")[0].innerHTML= deadlineBarText;

        //Remove div containing kit image
        clone.getElementsByTagName("DIV")[2].remove();

        //Duplicate and update links
        var link = clone.getElementsByTagName("A")[0];
        link.id = "nextGameweekLink";
        link.href = "#0";
        var newText = link.innerHTML.replace("Design your kit", "Next");
        link.innerHTML = newText;

        var link2 = link.cloneNode(true);
        var newText2 = link2.innerHTML.replace("Next", "");
        newText2 = newText2.replace("</svg>", "</svg> Previous");
        link2.innerHTML = newText2;
        var reverseArrow = link2.innerHTML.replace("<svg ", "<svg transform='rotate(180)' style='margin-right: 4px;' ");
        link2.innerHTML = reverseArrow;
        link2.style.marginRight = "20px";
        link2.style.visibility = "hidden";

        link2.onclick = function prevGameweek() {

            gameweekLoaded--;

            //Update deadlineBar
            var deadlineDate = new Date(events[gameweekLoaded - 1].deadline_time);
            var deadlineBar = document.getElementsByClassName("DeadlineBar__DeadlineBarInner-sc-15w29wz-0 hghGMz")[0];
            deadlineBar.getElementsByTagName("H3")[0].innerText = "Gameweek " + gameweekLoaded + ":";
            deadlineBar.getElementsByTagName("TIME")[0].dateTime = deadlineDate;
            var component = deadlineDate.toString().split(" ");
            deadlineBar.getElementsByTagName("TIME")[0].innerHTML = component[0] + " " + component[2] + " " + component[1] + " " + component[4].substring(0,5);
            
            //Update fixtures displayed
            var fixtureLabels = document.getElementsByClassName("PitchElementData__ElementValue-sc-1u4y6pr-1 bcESdd");

            for(var i = 0; i < fixtureLabels.length; i++) {

                //Grab teamname
                var teamnameFull = document.getElementsByClassName("Shirt__StyledShirt-k5q8zl-0 hoGPkp")[i].alt;
                fplTeam_teams[i] = teamnameFull;

                //Identify team number from teamname
                var teamNo = -1;
                for(var j = 0; j < teams.length; j++) {
                    if(teams[j].name == teamnameFull) {
                        teamNo = teams[j].id;
                    }
                }

                var newFixtureText = "";

                //Identify next fixture(s)
                for(var j = 0; j < fixtures.length; j++) {
                    if(fixtures[j].event == gameweekLoaded) {
                        if(fixtures[j].team_h == teamNo) {
                            var opponentNo = fixtures[j].team_a;
                            var opponent = teams[opponentNo - 1].short_name;

                            if(newFixtureText != "") {
                                newFixtureText += ", ";
                            }
                            newFixtureText += opponent + " (H)";
                        }
                        else if(fixtures[j].team_a == teamNo) {
                            var opponentNo = fixtures[j].team_h;
                            var opponent = teams[opponentNo - 1].short_name;

                            if(newFixtureText != "") {
                                newFixtureText += ", ";
                            }
                            newFixtureText += opponent + " "+ "(A)";
                        }
                    }
                    var span = fixtureLabels[i].getElementsByTagName("SPAN")[0];
                    if(span) {
                        span.innerHTML = newFixtureText;
                    }
                    else {
                        fixtureLabels[i].innerHTML = "<span>" + newFixtureText + "</span>";
                    }
                    
                    fplTeam_fixtures[i] = newFixtureText;
                }

            }

            //Update heading
            clone.getElementsByTagName("H4")[0].innerHTML = "Gameweek " + gameweekLoaded;

            //Update styling and show/hide links
            if(gameweekLoaded == gameweek) {
                document.getElementsByClassName("Panel__StyledPanel-sc-1nmpshp-0 eSHooN")[1].style.backgroundColor = "rgb(255, 255, 255)";
                link2.style.visibility = "hidden";

                //Show buttons
                if(chipBar) {
                    document.getElementsByClassName("MyTeam__ChipList-sc-6ytjxx-0 fIhsxq")[0].style.visibility = "visible";  //Chips
                }
                document.getElementsByClassName("infoBar")[0].style.visibility = "hidden";                                  //Info
                var saveButton = document.getElementsByClassName("SaveBar-sc-1juyyag-0 fPTxLj")[0];
                if(saveButton) {
                    saveButton.style.visibility = "visible";         //Save
                }
            }

            link.style.visibility = "visible";

            console.log("Viewing gameweek: " + gameweekLoaded);
        }

        var linkParent = document.getElementsByClassName("Panel__StyledPanelFooter-sc-1nmpshp-3 kkbHND")[1];
        linkParent.insertBefore(link2, linkParent.children[0]);
        
        link.onclick = function nextGameweek() {

            gameweekLoaded++;

            //Update deadlineBar
            var deadlineDate = new Date(events[gameweekLoaded - 1].deadline_time);
            var deadlineBar = document.getElementsByClassName("DeadlineBar__DeadlineBarInner-sc-15w29wz-0 hghGMz")[0];
            deadlineBar.getElementsByTagName("H3")[0].innerText = "Gameweek " + gameweekLoaded + ":";
            deadlineBar.getElementsByTagName("TIME")[0].dateTime = deadlineDate;
            var component = deadlineDate.toString().split(" ");
            deadlineBar.getElementsByTagName("TIME")[0].innerHTML = component[0] + " " + component[2] + " " + component[1] + " " + component[4].substring(0,5);

            //Update fixtures displayed
            var fixtureLabels = document.getElementsByClassName("PitchElementData__ElementValue-sc-1u4y6pr-1 bcESdd");

            for(var i = 0; i < fixtureLabels.length; i++) {

                //Grab teamname
                var teamnameFull = document.getElementsByClassName("Shirt__StyledShirt-k5q8zl-0 hoGPkp")[i].alt;
                fplTeam_teams[i] = teamnameFull;

                //Identify team number from teamname
                var teamNo = -1;
                for(var j = 0; j < teams.length; j++) {
                    if(teams[j].name == teamnameFull) {
                        teamNo = teams[j].id;
                    }
                }

                var newFixtureText = "";

                //Identify next fixture(s)
                for(var j = 0; j < fixtures.length; j++) {
                    if(fixtures[j].event == gameweekLoaded) {
                        if(fixtures[j].team_h == teamNo) {
                            var opponentNo = fixtures[j].team_a;
                            var opponent = teams[opponentNo - 1].short_name;

                            if(newFixtureText != "") {
                                newFixtureText += ", ";
                            }
                            newFixtureText += opponent + " (H)";
                        }
                        else if(fixtures[j].team_a == teamNo) {
                            var opponentNo = fixtures[j].team_h;
                            var opponent = teams[opponentNo - 1].short_name;

                            if(newFixtureText != "") {
                                newFixtureText += ", ";
                            }
                            newFixtureText += opponent + " "+ "(A)";
                        }
                    }
                    var span = fixtureLabels[i].getElementsByTagName("SPAN")[0];
                    if(span) {
                        span.innerHTML = newFixtureText;
                    }
                    else {
                        fixtureLabels[i].innerHTML = "<span>" + newFixtureText + "</span>";
                    }
                    
                    fplTeam_fixtures[i] = newFixtureText;
                }

            }

            //Update heading
            clone.getElementsByTagName("H4")[0].innerHTML = "Gameweek " + gameweekLoaded;

            //Update styling and show/hide links
            document.getElementsByClassName("Panel__StyledPanel-sc-1nmpshp-0 eSHooN")[1].style.backgroundColor = "rgb(255, 230, 91)";
            link2.style.visibility = "visible";

            if(!events[gameweekLoaded]) {
                link.style.visibility = "hidden";
            }

            //Hide buttons
            if(chipBar) {
                document.getElementsByClassName("MyTeam__ChipList-sc-6ytjxx-0 fIhsxq")[0].style.visibility = "hidden";  //Chips
            }
            document.getElementsByClassName("infoBar")[0].style.visibility = "visible";                                 //Info
            var saveButton = document.getElementsByClassName("SaveBar-sc-1juyyag-0 fPTxLj")[0];
            if(saveButton) {
                saveButton.style.visibility = "hidden";
            }
            var saveAlert = document.getElementsByClassName("Alert__StyledAlert-sc-1ikq2vy-0 ioOocM")[0];
            if(saveAlert) {
                saveAlert.style.visibility = "hidden";
            }

            
            console.log("Viewing gameweek: " + gameweekLoaded);

            //REFRESH FUNCTION
            document.getElementsByClassName("sc-AykKC fPMvRy")[0].addEventListener('click', function() {    //Pitch event listener

                if(gameweekLoaded != gameweek) {
                
                    setTimeout(function() {
                    
                        //Hide save button
                        var saveButton = document.getElementsByClassName("SaveBar-sc-1juyyag-0 fPTxLj")[0];
                        if(saveButton) {
                            saveButton.style.visibility = "hidden";
                        }

                        //Refresh fixture labels
                        var shirts = document.getElementsByClassName("Shirt__StyledShirt-k5q8zl-0 hoGPkp");
                        var fixtureLabels = document.getElementsByClassName("PitchElementData__ElementValue-sc-1u4y6pr-1 bcESdd");

                        for (var i = 0; i < shirts.length; i++) {
                            for (var j = 0; j < fplTeam_teams.length; j++) {
                                if(shirts[i].alt == fplTeam_teams[j]) {
                                    var spans = fixtureLabels[i].getElementsByTagName("SPAN");
                                    if(spans[0]) {
                                        spans[0].innerHTML = fplTeam_fixtures[j];
                                        if(spans[1]) {
                                            spans[1].innerHTML = "";
                                        }
                                    }
                                    else {
                                        fixtureLabels[i].innerHTML = "<span>" + fplTeam_fixtures[j] + "</span>";
                                    }
                                    break;
                                }
                            }   
                        }

                        var switchButton = document.getElementsByClassName("sc-AykKC fObvLq Button__StyledButton-sc-1no4qep-0 exdJJg")[0];
                        if(switchButton) {
                            switchButton.addEventListener('click', function() {
                                
                                if(gameweekLoaded != gameweek) {

                                    setTimeout(function() {
                                
                                        //Refresh fixture labels
                                        var shirts = document.getElementsByClassName("Shirt__StyledShirt-k5q8zl-0 hoGPkp");
                                        var fixtureLabels = document.getElementsByClassName("PitchElementData__ElementValue-sc-1u4y6pr-1 bcESdd");
                    
                                        for (var i = 0; i < shirts.length; i++) {
                                            for (var j = 0; j < fplTeam_teams.length; j++) {
                                                if(shirts[i].alt == fplTeam_teams[j]) {
                                                    var spans = fixtureLabels[i].getElementsByTagName("SPAN");
                                                    if(spans[0]) {
                                                        spans[0].innerHTML = fplTeam_fixtures[j];
                                                        if(spans[1]) {
                                                            spans[1].innerHTML = "";
                                                        }
                                                    }
                                                    else {
                                                        fixtureLabels[i].innerHTML = "<span>" + fplTeam_fixtures[j] + "</span>";
                                                    }
                                                    break;
                                                }
                                            }   
                                        }
                    
                                    }, 75);
                                }
                            });
                        }
                    }, 75);
                }
            });
        }

        //Fetch fixture data
        let url = 'https://fantasy.premierleague.com/api/fixtures/';
        fetch(url)
        .then(res => res.json())
        .then((data) => {
            fixtures = data;
        })
        .catch(err => { throw err });

        //Fetch team data
        url = 'https://fantasy.premierleague.com/api/bootstrap-static/';
        fetch(url)
        .then(res => res.json())
        .then((data) => {
            teams = data.teams;
            events = data.events;
        })
        .catch(err => { throw err });
    }
    else {
        setTimeout(updateDOM, 1000);
    }
}