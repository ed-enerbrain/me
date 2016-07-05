var init = function() {
    $.getJSON('data/data.json', function(data) {
        console.log(data);

        generateData(data);

        document.title = data.bio.greetings + " " + data.bio.name + " " + data.bio.surname;

        setTimeout(function() {
            fillCanvasExperiences(data);
        }, 100);

    });
};

var generateData = function(data) {
    for (var k in data) {

        if (k == "experiences") {
            data.experiences_info = generateExperiencesResume(data[k]);
        }

        var source = $('#'+k+'-template').html();
        var template = Handlebars.compile(source);

        var html = template(data[k]);
        $('#'+k).html(html);
    }
};


var generateExperiencesResume = function(exp) {
    // mocked generator of start end global
    var start = {   year: new Date().getFullYear(), month: 12};
    var end = {     year: 0,
        month: 0
    };
    for(var k in exp) {
        if(exp[k].start.year < start.year || (exp[k].start.year == start.year && exp[k].start.month < start.month)) {
            start.month = exp[k].start.month;
            start.year = exp[k].start.year;
        }
        if (exp[k].end.year > end.year || (exp[k].end.year == end.year && exp[k].end.month > end.month)) {
            end.month = exp[k].end.month;
            end.year = exp[k].end.year;
        }
    }
    return {
        "start" : start,
        "end" : end
    };
    // mocked generator of start end global
};

var fillCanvasExperiences = function(data) {
    var canvas = document.getElementById('experiences-canvas');
    var ctx = canvas.getContext("2d");

    var canvasHeight = $('#experiences').height();

    canvas.width = 180;
    canvas.height = canvasHeight;

    var expInfo = data.experiences_info;

    var totalMonths = (12 - expInfo.start.month) + ((expInfo.end.year) - (expInfo.start.year+1))*12 + (expInfo.end.month);
    var partialMonths = Math.floor(canvasHeight / totalMonths);

    // draw months/years
    ctx.font = "12px Arial";

    ctx.moveTo(60,0);
    ctx.lineTo(60,canvasHeight);
    ctx.stroke();

    var yearTable = {};

    var year = expInfo.start.year;
    var i = expInfo.start.month;
    var month = expInfo.start.month;
    while (year <= expInfo.end.year) {
        var h = canvasHeight-(partialMonths * i);
        if (month == 12) {
            ctx.moveTo(50, h);
            ctx.lineTo(70, h);
            ctx.stroke();
            month = 0;
            year++;
            yearTable[year] = h;
            ctx.strokeText(year, 10, h);
        } else {
            ctx.moveTo(55, h);
            ctx.lineTo(65, h);
            ctx.stroke();
        }
        i++;
        month++;
    }

    // draw connections

    var elements = document.getElementsByClassName('experience');
    for (var k = data.experiences.length-1; k >= 0; k--) {
        var exp = data.experiences[k];

        var h_start_begin = yearTable[exp.start.year] + (partialMonths * exp.start.month);
        var h_start_finish = elements[k].offsetTop + elements[k].offsetHeight;

        var h_end_begin = yearTable[exp.end.year] + (partialMonths * exp.end.month);
        var h_end_finish = elements[k].offsetTop;

        ctx.moveTo(75, h_start_begin);
        ctx.lineTo(150, h_start_finish);
        ctx.stroke();

        ctx.moveTo(75, h_end_begin);
        ctx.lineTo(150, h_end_finish);
        ctx.stroke();
    }

};

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
window.onload = init();