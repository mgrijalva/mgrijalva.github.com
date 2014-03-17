var json;
var colors = new Array();
var width = document.body.getBoundingClientRect().width - 50;
var height = 500;
console.log("Window size: " + width + "," + height);
var chap_num = 0;
var fill = d3.scale.category20();

var movie_num = 0; // Indicates currectly selected movie from movies array

document.getElementById("decrease_chapter").style.opacity = 0.25;

// Setup up elements on the page:
for (var i = 0; i < movies.length; i++) {
    opt = document.createElement("option");
    opt.id = i.toString();
    opt.innerHTML = movies[i][0];
    document.getElementById("movie_list").add(opt);
}

loadJSON(movies[movie_num][1]); // Load a movie so something is displayed

// Generic key press event (used for arrow keys)
window.onkeydown = function(ev) {
    if (ev.keyCode == 37) { // Left arrow key
        prevChapter();
    }
    else if (ev.keyCode == 39) { // Right arrow key
        nextChapter();
    }
}

// Event fired when new movie is chosen
function switchMovie() {
    var list = document.getElementById("movie_list");
    movie_num = parseInt(list.options[list.selectedIndex].id); // Get movie id number (index to movies array)
    
    chap_num = 0;

    colors = []
    loadJSON(movies[movie_num][1]); // Load the JSON file for this movie
    document.getElementById("movie_list").blur(); // Move focus so user doesn't accidentally change movie with up/down arrow
}

// Event fired for right arrow press or clicking right button
function nextChapter() {
    if (chap_num == json.chapters.length - 1) return;
    chap_num += 1;

    console.log("Chapter " + chap_num.toString())

    //fadeOut(changeCloud);  
    changeCloud();

    document.getElementById("chapter_number").innerHTML = "Chapter " + (chap_num + 1) + "/" + json.chapters.length;
    document.getElementById("decrease_chapter").style.opacity = 1.0;
    if (chap_num == json.chapters.length - 1) {
        document.getElementById("increase_chapter").style.opacity = 0.2;
    }
}

// Event fired for left arrow press or clicking left button
function prevChapter() {
    if (chap_num == 0) return;
    chap_num -= 1;

    console.log("Chapter " + chap_num.toString())

    //fadeOut(changeCloud);
    changeCloud();

    document.getElementById("chapter_number").innerHTML = "Chapter " + (chap_num + 1) + "/" + json.chapters.length;
    document.getElementById("increase_chapter").style.opacity = 1.0;
    if (chap_num == 0) {
        document.getElementById("decrease_chapter").style.opacity = 0.2;
    }
}

// Load the given json file
function loadJSON(json_file) {
    d3.select("svg").remove(); // Remove the old cloud
    chap_num = 0;

    d3.json(json_file, function(error, data) {
        console.log("JSON data loaded");
        if (error) {
            console.warn("ERROR: " + error);
        }
        json = data;

        // Get rid of chapters with no words
        while (data.chapters[chap_num].words.length == 0) chap_num += 1;

        document.getElementById("chapter_number").innerHTML = "Chapter " + (chap_num + 1) + "/" + json.chapters.length;
        colors = [] // Make sure colors array is empty
        for (var i = 0; i < data.chapters[chap_num].colors.length; i++)
        {
            colors.push(data.chapters[chap_num].colors[i]);
        }
        prepareCloud(data.chapters[chap_num].words);
    });
}

// Prepare a word cloud
function prepareCloud(words)
{    
    var i = 0;
    //console.log("Preparing " + words.length + " words");
    d3.layout.cloud().size([width, height])
        .words(words.map(function(d) {
            return {text: d.word, size: d.count * 12};
            }))
        .padding(1)
        .rotate(0)
        .font("Impact")
        .fontSize(function(d) {
            return d.size;
            })
        .on("end", draw)
        .start();
}

// Draw the word cloud
function draw(words) 
{
    d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width/2 + ",300)")
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { 
            index = parseInt(Math.random() * colors.length); // Choose a random color
            return colors[index];
            })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { 
            if (d.text == "bad") console.log("bad processed");
            return d.text; 
        });
        /*.attr("opacity", 0.0)
        .transition()
        .duration(500)
        .attr("opacity", 1.0);*/

    //d3.timer.flush();
    d3.timer(animateRight, 1000);
}

// Delete the current cloud and change to another chapter
function changeCloud() {
    d3.select("svg").remove(); // Remove the old cloud

    if (json.chapters[chap_num].words.length == 0)
    {
        var h2 = document.createElement("h2");
        h2.id = "warning";
        h2.innerHTML = "No speech in this chapter";
        var center = document.createElement("center");
        center.appendChild(h2);
        document.body.appendChild(center);
    }
    else
    {
        var element = document.getElementById("warning");
        if (element != null) element.parentNode.removeChild(element);
        colors = [] // Get rid of old colors
        console.log("color count: " + colors.length)
        for (var i = 0; i < json.chapters[chap_num].colors.length; i++)
        {
            colors.push(json.chapters[chap_num].colors[i]);
        }
        prepareCloud(json.chapters[chap_num].words); // Make the new cloud!
    }
}

// Fade out the current cloud. Call given callback when done
/*function fadeOut(callback)
{
    d3.select("body")
        .selectAll("text")
        .transition()
        .attr("opacity", 0.0)
        .duration(500)
    d3.timer(callback, 1000);
}*/

function animateRight()
{
    d3.select("body")
        .selectAll("text")
        .transition()
        .delay(function() {
            return Math.random() * 1000;
        })
        .duration(500)
        .ease("elastic")
        .attr("x", json.chapters[chap_num].motion * 100)
    d3.timer(animateLeft, 1000);
    return true;
}

function animateLeft()
{
    d3.select("body")
        .selectAll("text")
        .transition()
        .delay(function() {
            return Math.random() * 1000;
        })
        .duration(500)
        .ease("elastic")
        .attr("x", 0)
    d3.timer(animateRight, 1000);
    return true;
}
