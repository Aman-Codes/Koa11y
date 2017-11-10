function cleanURL (url) {
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

module.exports = cleanURL;
