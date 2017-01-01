
var $ = window.$;
var ugui = window.ugui;

// Wait for the document to load, then load settings for the user, then run the app.
$(document).ready(function () {
    ugui.helpers.loadSettings(runApp);
});

// Container for your app's custom JS
function runApp () {

    require('nw.gui').Window.get().showDevTools();

    var fs = require('fs');
    var path = require('path');

    function cleanURL () {
        var url = $('#url').val();
        url = url.replace('https://', '');
        url = url.replace('http://', '');
        url = url.replace('www.', '');
        url = url.replace('.html', '');
        url = url.replace('.htm', '');
        url = url.replace('.php', '');
        url = url.replace('.aspx', '');
        url = url.replace('.asp', '');
        url = url.replace('.cfm', '');
        url = url.split('.').join(' ');
        url = url.split('/').join(' ');
        url = url.split('?').join(' ');
        url = url.split('&').join(' ');
        url = url.split('|').join(' ');
        url = url.split('=').join(' ');
        url = url.split('*').join(' ');
        url = url.split('\\').join(' ');
        url = url.split('"').join(' ');
        url = url.split(':').join(' ');
        url = url.split('<').join(' ');
        url = url.split('>').join(' ');
        return url;
    }

    function unlockRun () {
        ugui.helpers.buildUGUIArgObject();
        var url = ugui.args.url.value;
        var dest = ugui.args.folderPicker.value;
        var file = ugui.args.output.value;
        if (url && dest && file) {
            $('#run').prop('disabled', false);
        } else {
            $('#run').prop('disabled', true);
        }
    }

    function urlKeyup () {
        reset();
        var url = cleanURL();
        $('#output').val(url);
        ugui.helpers.saveSettings();
        unlockRun();
    }
    $('#url').change(urlKeyup);
    $('#url').keyup(urlKeyup);

    $('#output').change(unlockRun);
    $('#output').keyup(unlockRun);

    function prefillURL () {
        $('#url').val('http://google.com');
        urlKeyup();
    }
    function prefillOutput () {
        var homePath = '';
        if (process.platform == 'linux') {
            homePath = process.env.HOME;
        } else if (process.platform == 'win32') {
            homePath = process.env.USERPROFILE;
        } else if (process.platform == 'darwin') {
            homePath = '/Users/' + process.env.USER;
            if (process.env.HOME) {
                homePath = process.env.HOME;
            }
        }
        var myDesktopPath = path.join(homePath, 'Desktop');
        $('#folderPicker').val(myDesktopPath);
    }
    function prefillData () {
        ugui.helpers.buildUGUIArgObject();
        if (!ugui.args.url.value) {
            prefillURL();
        }
        if (!ugui.args.folderPicker.value) {
            prefillOutput();
        }
    }
    prefillData();

    function reset () {
        $('#results').empty();
        $('#button-badges .badge').html('0');
    }

    function successMessage (file, ext) {
        var filetype = ext.toUpperCase();
        if (filetype == 'MARKDOWN') {
            filetype = 'Markdown';
        }
        var message =
            '<div class="alert alert-info alert-dismissible" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '<h4>' +
                    '<p>Your <strong>' + filetype + '</strong> file has been saved.</p>' +
                '</h4>' +
                '<p>' + file + '</p>' +
            '</div>';
        $('#results').html(message);
    }
    function errorMessage (error) {
        var markup =
            '<div class="alert alert-danger alert-dismissible" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '<h4>' +
                    '<p>Pa11y Error:</p>' +
                '</h4>' +
                '<p>' + error + '</p>' +
            '</div>';
        $('#results').html(markup);
    }


    $('#outputFolderIcon').click(function () {
        $('#outputFolderBrowse').click();
    });

    $('#outputFolderBrowse').change(function () {
        reset();
        var userDir = $(this).val();
        $('#folderPicker').val(userDir);
        ugui.helpers.saveSettings();
    });

    if (ugui.args.badgeError.value == 'false') {
        $('#button-badges .btn-danger').addClass('disabled');
    }
    if (ugui.args.badgeWarning.value == 'false') {
        $('#button-badges .btn-warning').addClass('disabled');
    }
    if (ugui.args.badgeNotice.value == 'false') {
        $('#button-badges .btn-primary').addClass('disabled');
    }

    $('#button-badges .btn-danger, #button-badges .btn-warning, #button-badges .btn-primary').click(function () {
        reset();

        if ($(this).hasClass('disabled')) {
            $(this).removeClass('disabled');
            $(this).val('true');
        } else {
            $(this).addClass('disabled');
            $(this).val('false');
        }

        ugui.helpers.buildUGUIArgObject();
        ugui.helpers.saveSettings();
    });

    function toggleImageAlts () {
        ugui.helpers.buildUGUIArgObject();
        if (ugui.args.outputhtml.htmlticked) {
            $('#imageAltsSection').show();
        } else {
            $('#imageAltsSection').hide();
        }
    }

    $('input[name="standard"], input[name="outputtype"]').change(function () {
        reset();
        toggleImageAlts();
        ugui.helpers.saveSettings();
    });

    function clipboard (data) {
        $('#clipboard').click(function () {
            var dummy = document.createElement('textarea');
            dummy.setAttribute('id', 'dummy');
            document.body.appendChild(dummy);
            var dumNode = document.getElementById('dummy');
            dumNode.value = data;
            dumNode.select();
            document.execCommand('copy');
            document.body.removeChild(dumNode);
        });
    }

    // Attempt to get the latest Image Alts script from GitHub
    var getImgAlts = $.get('https://raw.githubusercontent.com/TheJaredWilcurt/UGUI-pa11y/master/_scripts/imgalts.min.js', function (data) {
        clipboard(data);
    });
    // If we cannot access the latest, use the version that shipped with UGUI: Pa11y
    getImgAlts.fail(function () {
        var data = fs.readFileSync('_scripts/imgalts.min.js', 'binary');
        clipboard(data);
    });

    $('#run').click(function (evt) {
        $('#spinner').fadeIn('slow');
        evt.preventDefault();
        reset();

        ugui.helpers.buildUGUIArgObject();

        var filetype = 'html';
        var ext = '.html';
        if (ugui.args.outputcsv.htmlticked) {
            filetype = 'csv';
            ext = '.csv';
        } else if (ugui.args.outputhtml.htmlticked) {
            filetype = 'html';
            ext = '.html';
        } else if (ugui.args.outputjson.htmlticked) {
            filetype = 'json';
            ext = '.json';
        } else if (ugui.args.outputmd.htmlticked) {
            filetype = 'markdown';
            ext = '.md';
        } else if (ugui.args.outputxml.htmlticked) {
            filetype = 'xml';
            ext = '.xml';
        }

        var standard = 'WCAG2AA';
        if (ugui.args.standardsection.htmlticked) {
            standard = 'Section508';
        } else if (ugui.args.standardwcaga.htmlticked) {
            standard = 'WCAG2A';
        } else if (ugui.args.standardwcagaa.htmlticked) {
            standard = 'WCAG2AA';
        } else if (ugui.args.standardwcagaaa.htmlticked) {
            standard = 'WCAG2AAA';
        }

        var ignore = [];
        if ($('#button-badges .btn-danger').hasClass('disabled')) {
            ignore.push('error');
        }
        if ($('#button-badges .btn-warning').hasClass('disabled')) {
            ignore.push('warning');
        }
        if ($('#button-badges .btn-primary').hasClass('disabled')) {
            ignore.push('notice');
        }

        var url = ugui.args.url.value;
        var folderPicker = ugui.args.folderPicker.value;
        var fileName = ugui.args.output.value;

        var pa11y = require('pa11y');
        var phantomjs = require('phantomjs-prebuilt');

        var test = pa11y({
            'phantomjs': {
                'path': phantomjs.path
            },
            'allowedStandards': [standard],
            'standard': standard,
            'reporter': filetype,
            'ignore': ignore
        });

        test.run(url, function (error, results) {
            $('#spinner').fadeOut('slow');

            if (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                errorMessage(error.message);
                return;
            }

            // Badges
            var badges = {
                'errors': 0,
                'warnings': 0,
                'notices': 0
            };

            for (var i = 0; i < results.length; i++) {
                var theType = results[i].type;
                if (theType == 'error') {
                    badges.errors = badges.errors + 1;
                } else if (theType == 'warning') {
                    badges.warnings = badges.warnings + 1;
                } else if (theType == 'notice') {
                    badges.notices = badges.notices + 1;
                }
            }
            $('#button-row .btn-danger span').text(badges.errors);
            $('#button-row .btn-warning span').text(badges.warnings);
            $('#button-row .btn-primary span').text(badges.notices);

            // JSON
            if (ugui.args.outputjson.htmlticked) {
                var output = {};
                output.results = results;
                output = JSON.stringify(output, null, 2);
                var file = path.join(folderPicker, fileName + ext);
                ugui.helpers.writeToFile(file, output);
                $('#results').html(successMessage(file, filetype));
            // CSV
            } else if (ugui.args.outputcsv.htmlticked) {
                var json2csv = require('json2csv');
                var fields = [];
                for (var key in results[0]) {
                    fields.push(key);
                }
                var output = json2csv({
                    'data': results,
                    'fields': fields
                });

                var file = path.join(folderPicker, fileName + ext);
                ugui.helpers.writeToFile(file, output);

                successMessage(file, filetype);
            // Markdown
            } else if (ugui.args.outputmd.htmlticked) {
                var output = '';
                var hr = '\n* * *\n\n';
                for (var i = 0; i < results.length; i++) {
                    var current = results[i];
                    var code = '**Code:** ' + current.code + '  \n';
                    var type = '**Type:** ' + current.type + '  \n';
                    var typeCode = '**Type Code:** ' + current.typeCode + '  \n';
                    var message = '**Message:** ' + current.message + '  \n';
                    var selector = '**Selector:** `' + current.selector + '`  \n';
                    var context = '**Context:**\n```\n' + current.context + '\n```\n';
                    output = output + code + type + typeCode + message + selector + context;
                    if (i < results.length - 1) {
                        output = output + hr;
                    }
                }

                var file = path.join(folderPicker, fileName + ext);
                ugui.helpers.writeToFile(file, output);

                successMessage(file, filetype);
            // XML
            } else if (ugui.args.outputxml.htmlticked) {
                var output = '<?xml version="1.0" encoding="UTF-8"?>\n<pa11y>\n';
                for (var i = 0; i < results.length; i++) {
                    var current = results[i];
                    var result =
                        '  <result>\n' +
                        '    <code>' + current.code + '</code>\n' +
                        '    <type typecode="' + current.typeCode + '">' + current.type + '</type>\n' +
                        '    <message>' + current.message + '</message>\n' +
                        '    <selector><![CDATA[' + current.selector + ']]></selector>\n' +
                        '    <context><![CDATA[' + current.context + ']]></context>\n' +
                        '  </result>\n';
                    output = output + result;
                }
                output = output + '</pa11y>\n';

                var file = path.join(folderPicker, fileName + ext);
                ugui.helpers.writeToFile(file, output);

                successMessage(file, filetype);
            // HTML
            } else {
                var returnedErrors = '';
                var returnedWarnings = '';
                var returnedNotices = '';
                var panelColor = '';
                for (var i = 0; i < results.length; i++) {
                    var theType = results[i].type;
                    if (theType == 'warning') {
                        panelColor = 'warning';
                    } else if (theType == 'error') {
                        panelColor = 'danger';
                    } else if (theType == 'notice') {
                        panelColor = 'primary';
                    }

                    var theContext = results[i].context;
                    theContext = theContext.split('<').join('&lt;');

                    var entry =
                      '<div class="panel panel-' + panelColor + '">\n' +
                        '<div class="panel-heading">' + results[i].code + '</div>\n' +
                        '<div class="panel-body">\n' +
                          '<strong class="text-capitalize">' + results[i].type + ':</strong> ' + results[i].message + '<br /><br />\n' +
                          '<pre><code>' + theContext + '</code></pre>\n' +
                        '</div>\n' +
                        '<div class="panel-footer text-sm"><h4><small>' + results[i].selector + '</small></h4></div>\n' +
                      '</div>\n';

                    if (theType == 'error') {
                        returnedErrors = returnedErrors + entry;
                    } else if (theType == 'warning') {
                        returnedWarnings = returnedWarnings + entry;
                    } else if (theType == 'notice') {
                        returnedNotices = returnedNotices + entry;
                    }
                }

                $.get('_markup/template.html', function (template) {
                    var results = returnedErrors + returnedWarnings + returnedNotices;
                    var buttons = '';
                    $('#button-badges button:not(".disabled")').each(function () {
                        buttons = buttons + $(this).prop('outerHTML') + '\n';
                    });
                    var imgAlts = $('#imagealts').val();
                    var output =
                        template +
                        '      <span id="buttons">' + buttons + '</span>\n' +
                        '      <h1>' + url + '</h1>\n' +
                        '    </div>\n' +
                            imgAlts + '\n' +
                        '      <div class="row">' + results + '</div>\n' +
                        '    </div>\n' +
                        '    <script>\n' +
                        '      var errorButton = document.querySelectorAll(\'.btn-danger\')[0];\n' +
                        '      var warningButton = document.querySelectorAll(\'.btn-warning\')[0];\n' +
                        '      var noticeButton = document.querySelectorAll(\'.btn-primary\')[0];\n' +
                        '      var allErrors = document.querySelectorAll(\'.panel-danger\');\n' +
                        '      var allWarnings = document.querySelectorAll(\'.panel-warning\');\n' +
                        '      var allNotices = document.querySelectorAll(\'.panel-primary\');\n\n' +
                        '      function hideAll (arr) {\n' +
                        '        for (var i = 0; i < arr.length; i++) {\n' +
                        '          arr[i].classList.add(\'hide\');\n' +
                        '        }\n' +
                        '      }\n\n' +
                        '      function showAll (arr) {\n' +
                        '        for (var i = 0; i < arr.length; i++) {\n' +
                        '          arr[i].classList.remove(\'hide\');\n' +
                        '        }\n' +
                        '      }\n\n' +
                        '      errorButton.addEventListener(\'click\', function () {\n' +
                        '        if (this.classList.contains(\'disabled\')) {\n' +
                        '          this.classList.remove(\'disabled\');\n' +
                        '          showAll(allErrors);\n' +
                        '        } else {\n' +
                        '          this.classList.add(\'disabled\');\n' +
                        '          hideAll(allErrors);\n' +
                        '        }\n' +
                        '      });\n' +
                        '      warningButton.addEventListener(\'click\', function () {\n' +
                        '        if (this.classList.contains(\'disabled\')) {\n' +
                        '          this.classList.remove(\'disabled\');\n' +
                        '          showAll(allWarnings);\n' +
                        '        } else {\n' +
                        '          this.classList.add(\'disabled\');\n' +
                        '          hideAll(allWarnings);\n' +
                        '        }\n' +
                        '      });\n' +
                        '      noticeButton.addEventListener(\'click\', function () {\n' +
                        '        if (this.classList.contains(\'disabled\')) {\n' +
                        '          this.classList.remove(\'disabled\');\n' +
                        '          showAll(allNotices);\n' +
                        '        } else {\n' +
                        '          this.classList.add(\'disabled\');\n' +
                        '          hideAll(allNotices);\n' +
                        '        }\n' +
                        '      });\n' +
                        '    </script>\n' +
                        '  </body>\n' +
                        '</html>';
                    var file = path.join(folderPicker, fileName + ext);
                    ugui.helpers.writeToFile(file, output);

                    successMessage(file, filetype);
                });
            }
        });
    });

    function phantomImgAlts (url, callback) {
        if (!url) {
            console.log('Pass in a URL.');
            return;
        }
        var path = require('path');
        var exec = require('child_process').execFile;
        var phantomjs = require('phantomjs-prebuilt');
        var binPath = phantomjs.path;

        var childArgs = [path.join(process.cwd(), '_scripts', 'phantom-imgalts.js'), url];

        exec(binPath, childArgs, function (err, stdout, stderr) {
            if (err) {
                console.log(err);
                errorMessage(err);
                return;
            }

            if (stderr) {
                console.log(stderr);
                errorMessage(stderr);
                return;
            }

            if (callback) {
                if (stdout == 'No URL passed in.') {
                    console.log(stdout);
                } else {
                    var data = JSON.parse(stdout);
                    callback(data);
                }
            } else {
                console.log(stdout);
            }
        });
    }

    toggleImageAlts();
    unlockRun();
    if (
        !ugui.args.outputcsv.htmlticked &&
        !ugui.args.outputxml.htmlticked &&
        !ugui.args.outputmd.htmlticked &&
        !ugui.args.outputjson.htmlticked &&
        !ugui.args.outputhtml.htmlticked
    ) {
        $('#output-btn label[for="html"]').click();
    }

} // end runApp();
