var init = function() {
    $.getJSON('data/data.json', function(data) {
        console.log(data);

        generateData(data);

        document.title = data.bio.greetings + " " + data.bio.name + " " + data.bio.surname;
    });
};

var generateData = function(data) {
    for (var k in data) {
        var source = $('#'+k+'-template').html();
        var template = Handlebars.compile(source);

        var html = template(data[k]);
        $('#'+k).html(html);
    }
};


window.onload = init();