findVideos();
//window.addEventListener("focus", findVideos);

/**
 * Find all videos on the page. 
 */
function findVideos() {
    var embeds_col = document.getElementsByTagName('embed');
    var objects = document.getElementsByTagName('object');
    var count = 0;

    // Convert collection to array
    var embeds = [];
    for (var i = 0; i < embeds_col.length; i++) {
        ++count;
    }

    // Check object tags that don't have <embed> element
    for (var i = 0; i < objects.length; i++) {
        if (!/<embed/.test(objects[i].innerHTML)) {
            ++count;
        }
    }

	// Default to always showing the extension if the user is in Google Reader, reddit, or digg
	var doc_title = document.getElementsByTagName('title')
	if (/^(Google Reader|reddit|Digg).*?/.test(doc_title[0].innerHTML)) {
		console.log(doc_title[0].innerHTML)
		++count;
	};

	// Also show extension if on IMDb and on a media page - film or tv episode
	if (onIMDbMediaPage(doc_title[0].innerHTML, document.URL)) {
		console.log(doc_title[0].innerHTML + ' - on media page')
		++count;
	};

    if (count > 0)
    {
		doNotifyBoxee(count);
    }
};

function doNotifyBoxee(count) {
    var port = chrome.extension.connect({name: "boxeeNotify"});
	port.postMessage({found: (count != undefined)});
};

/**
 * Check if we're on IMDb and on a film or TV episode page
 */
function onIMDbMediaPage(title, url) {
	// Must have IMDb in the page title, and IMDb ID in the URL (tt\d{7})
	return (/.*(IMDb).*/.test(title) && /(tt\d{7})/.test(url));
}

/**
 * Attempt to add the IMDb item to the Boxee queue
 */
function addIMDbToQueue(url) {

	console.log('Attempting to add IMDb item to Boxee Queue');

	// get IMDb ID from url
	var imdbID = /(tt\d{7})/.exec(url);

	console.log('IMDb ID: '+imdbID[0]);

	// Get the Boxee ID for this film / tv episode via their API (undocumented)
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(data) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			console.log(xhr.responseText);

			var boxeeID = /boxee:id>(\d{1,8})<\/boxee:id/.exec(xhr.responseText);
			console.log('Response from boxee received id= '+boxeeID[1]);
		}
	}

	// Make XHR to Boxee. Cross origin XHR permitted by extension manifest ;)
	var submissionUrl = 'http://res.boxee.tv/title/movie/?imdb_id=' + imdbID[1];
	console.log('url= '+submissionUrl)
	xhr.open('GET', submissionUrl, true);
	xhr.send();

	console.log('Request for boxeeID and data sent');
}