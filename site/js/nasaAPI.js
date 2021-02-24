//Nasa api: picture of the day
var url = 'https://api.nasa.gov/planetary/apod?api_key=wbd6EJoZF3JrqvtX8iWkchhUJAQ4APcJ84asv4bB'

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

