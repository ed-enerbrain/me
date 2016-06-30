var init = function() {
    $.getJSON('data/data.json', function(data) {
        console.log(data);
    });
};


window.onload = init();