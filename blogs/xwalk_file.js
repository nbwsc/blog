/**
 * 
 * virtualPath:
 *         String names[] = {
            "ALARMS",
            "DCIM",
            "DOWNLOADS",
            "MOVIES",
            "MUSIC",
            "NOTIFICATIONS",
            "PICTURES",
            "PODCASTS",
            "RINGTONES",
			'cachedir'
        };
 * 
 * @param  String virtualPath
 * @param  String filename
 * @param  String content
 * @param  function callback
 */
function writeFile(virtualPath, filename, content, callback) {
	virtualPath = virtualPath ? virtualPath : "DOWNLOADS";
	filename = filename ? filename : "wscfile.txt";
	xwalk.experimental.native_file_system.requestNativeFileSystem(virtualPath,
		function (fs) {
			fs.root.getFile("/" + virtualPath + "/" + filename, {
				create: true
			}, function (entry) {
				entry.createWriter(function (writer) {

					var blob = new Blob([content], {
						type: "text/plain"
					});
					writer.write(blob);
					callback && callback(entry, writer);
				},
					function (e) {
						console.error(e)
					});
			},
				function (e) {
					console.error(e)
				});
		});
}
/**
 * @param  String virtualPath
 * @param  String filename
 * @param  function successCallback
 * @param  function nofileCallback
 */
function readFile(virtualPath, filename, successCallback, nofileCallback) {
	virtualPath = virtualPath ? virtualPath : "DOWNLOADS";
	filename = filename ? filename : "wscfile.txt";
	xwalk.experimental.native_file_system.requestNativeFileSystem(virtualPath,
		function (fs) {
			fs.root.getFile("/" + virtualPath + "/" + filename, {
				create: false
			}, function (entry) {
				entry.file(function (file) {
					reader = new FileReader();
					reader.onloadend = function (e) {
						successCallback && successCallback(this.result);
					};
					reader.readAsText(file);
				},
					function (e) {
						console.error("entry file error", e)
					});
			},
				function (e) {
					//no file error appear here
					nofileCallback && nofileCallback()
					console.error("getFile error", e)
				});
		},
		function (e) {
			//virtualpath error
			console.error('requestNativeFileSystem error', e)
		});
}
/**
 * @param  String virtualPath
 * @param  String filename
 * @param  function successCallback
 * @param  function failCallback
 */
function removeFile(virtualPath, filename, successCallback, failCallback) {
	xwalk.experimental.native_file_system.requestNativeFileSystem(virtualPath,
		function (fs) {
			fs.root.getFile("/" + virtualPath + "/" + filename, {
				create: false
			}, function (entry) {
				entry.remove(function () {
					successCallback && successCallback();
				},
					function (e) {
						console.error("entry remove error", e)
						failCallback && failCallback();
					});
			},
				function (e) {
					console.error("getFile error", e)
					failCallback && failCallback();
				});
		}
	);

}



/*
* test case
* please run the code in xwalk env
*/
(function () {
	if (typeof xwalk === 'undefined') {
		console.error('test fail : cant find xwalk')
		return;
	}

	var current_test = 0;
	var test_list = [
		writeFile,
		readFile,
		removeFile,
		createDirectory,
		readDirectoryEntries,
		removeDirectory,
		endTest
	];

	function runNextTest() {
		if (current_test < test_list.length) {
			test_list[current_test++]();
		}
	};

	function reportFail(message) {
		console.log(message);
		document.title = "Fail";
		document.body.innerText = "Fail";
	};

	function endTest() {
		document.title = "Pass";
		document.body.innerText = "Pass";
	};

	function writeFile() {
		xwalk.experimental.native_file_system.requestNativeFileSystem("cachedir",
			function (fs) {
				fs.root.getFile("/cachedir/1.txt", { create: true }, function (entry) {
					entry.createWriter(function (writer) {
						var blob = new Blob(["1234567890"], { type: "text/plain" });
						writer.write(blob);
						runNextTest();
					},
						function (e) { reportFail(JSON.stringify(e)) });
				},
					function (e) { reportFail(JSON.stringify(e)) });
			});
	}

	function readFile() {
		xwalk.experimental.native_file_system.requestNativeFileSystem("cachedir",
			function (fs) {
				fs.root.getFile("/cachedir/1.txt", { create: false }, function (entry) {
					entry.file(function (file) {
						reader = new FileReader();
						reader.onloadend = function (e) {
							if ("1234567890" == this.result) {
								runNextTest();
							} else {
								reportFail();
							}
						};
						reader.readAsText(file);
					},
						function (e) { reportFail(JSON.stringify(e)) });
				},
					function (e) { reportFail(JSON.stringify(e)) });
			},
			function (e) { reportFail(JSON.stringify(e)) });
	};


	function removeFile() {
		xwalk.experimental.native_file_system.requestNativeFileSystem("cachedir",
			function (fs) {
				fs.root.getFile("/cachedir/1.txt", { create: false }, function (entry) {
					entry.remove(function () {
						runNextTest();
					},
						function (e) { reportFail(JSON.stringify(e)) });
				},
					function (e) { reportFail(JSON.stringify(e)) });
			}
		);
	}

	function createDirectory() {
		xwalk.experimental.native_file_system.requestNativeFileSystem("cachedir",
			function (fs) {
				fs.root.getDirectory("/cachedir/justfortest", { create: true }, function (entry) {
					runNextTest();
				},
					function (e) { reportFail(JSON.stringify(e)) });
			}
		);
	}

	function readDirectoryEntries() {
		xwalk.experimental.native_file_system.requestNativeFileSystem("cachedir",
			function (fs) {
				fs.root.getDirectory("/cachedir/", { create: false }, function (entry) {
					var dirReader = entry.createReader();
					var entries = [];
					dirReader.readEntries(function (results) {
						if (0 < results.length) {
							runNextTest();
						} else {
							reportFail("You app home directory is empty!");
						}
					},
						function (e) { reportFail(JSON.stringify(e)) }
					);
					runNextTest();
				},
					function (e) { reportFail(JSON.stringify(e)) });
			}
		);
	}

	function removeDirectory() {
		xwalk.experimental.native_file_system.requestNativeFileSystem("cachedir",
			function (fs) {
				fs.root.getDirectory("/cachedir/justfortest", { create: false }, function (entry) {
					entry.remove(function () { runNextTest(); },
						function (e) { reportFail(JSON.stringify(e)) });
				},
					function (e) { reportFail(JSON.stringify(e)) });
			}
		);
	}

	runNextTest();
}())
