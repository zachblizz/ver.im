$(function() {
	var socket = io();
	var uname = getParameterByName('uname');
	var cmds;
	var users = {};

	$.get('/cmds', function(data, status) {
		if (status === 'success') {
			cmds = data;
		} else {
			console.log('there was an issue with getting the cmds', status);
		}
	});

	$('h2').html('Hello, ' + uname + '! Welcome to ver.im');

	// TODO: only have to emit this once...
	$('#usr-msg').on('input', function() {
		socket.emit('typing', uname);
	});

	$('#msg-board').submit(function() {
		var trimmed = $('#usr-msg').val().trim()

		if ("" !== trimmed && "/cmds" !== trimmed
			&& trimmed.indexOf('<script>') < 0 && '/clear' !== trimmed 
			&& trimmed.indexOf('/add') !== 0) {

			var msg = removeTags($('#usr-msg').val().trim());
			if ("" !== msg ) {
				socket.emit('chat message', msg, uname);
			} else {
				$('#msgs').append($('<li>').html('<img src="pics/invalid.png" />')); 
			}
		} else if ("/cmds" === trimmed) {
			showCommands(cmds);
		} else if (trimmed.indexOf('/add') === 0) {
			addCommand(trimmed);
		}  else if ("/clear" === trimmed) {
			$('#msgs').html('');
		}
		$('#usr-msg').val('');
		return false;
	});

	socket.on('chat message', function(m, name, online) {
		displayUsrsOnline(online, users)

		if (!$('#usr-msg').is(':focus')) {
			alert(name + " said something!!");
		}

		$('#' + name + '-typing').css('display', 'none');

		var msgStart = '<span style="font-size: 9px;">' + getMsgTime() + '</span> <b>' + name + ':</b> ';
		var msg = m;

		if (cmds[msg]) {
			msg = cmds[msg]
		}

		$('#msgs').append($('<li>').html(msgStart + msg));
	});

	socket.on('typing', function(name) {
		$('#' + name + '-typing').css('display', 'inline-block');
	});
});

function addCommand(cmd, cmds) {
	var scriptSplit = cmd.split('<');
	var cmd = scriptSplit[0].split(' ')[1];
	var outcome = '<' + scriptSplit[1]

	$.get('/addCmd?cmd=' + cmd + '&outcome=' + outcome, function(data, status) {
		if (status === 'success') {
			alert(data.msg)
		}
	});

	$.get('/cmds', function(data, status) {
		if (status === 'success') {
			cmds = data;
		} else {
			console.log('there was an issue with getting the cmds', status);
		}
	})
}

function displayUsrsOnline(online, users) {
	$('#usrs').html('<h3>Users Online</h3>');
	online.forEach(function(name) {
		if (!users[name]) {
			users[name] = name;
		}
	})

	for (name in users) {
		$('#usrs').append($('<li>').html(name + '<span id="' + name + '-typing" style="display: none; font-size: 9px;">&nbsp;&nbsp;typing...</span>'));
	}
}

function showCommands(cmds) {
	for (var cmd in cmds) {
		$('#msgs').append($('<li>').html('<b>' + cmd + ':</b> ' + cmds[cmd])); 
	}
	$('#usr-msg').val('');
}

function removeTags(html) {
	var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

	var tagOrComment = new RegExp(
	    '<(?:'
	    // Comment body.
	    + '!--(?:(?:-*[^->])*--+|-?)'
	    // Special "raw text" elements whose content should be elided.
	    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
	    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
	    // Regular name
	    + '|/?[a-z]'
	    + tagBody
	    + ')>',
	    'gi');

	var oldHtml;
	do {
		oldHtml = html;
		html = html.replace(tagOrComment, '');
	} while (html !== oldHtml);
	return html.replace(/</g, '&lt;');
}

function getMsgTime() {
    var date = new Date();
    return (date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()) + ":" 
                + (date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()) + ":" 
                + (date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds());
}

function getParameterByName(name, url) {
    if (!url)
      url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}