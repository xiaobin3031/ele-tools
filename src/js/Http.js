const defaultAjax6Option = {
    type: 'POST',
    // contentType: 'application/x-www-form-urlencoded;charset=utf-8'
    header: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
    }
};
function formatParams(data = {}){
    // return Object.keys(data).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(JSON.stringify(data[k]))}`).join('&');
    return Object.keys(data).map(k => `${k}=${data[k]}`).join('&');
}

export default function Http(url, data = {}, options={}){
    return new Promise((resolve, reject) => {
        const _options = {...defaultAjax6Option, ...options}
        _options.header = {...defaultAjax6Option.header, ...options.header}
        const xhr = new XMLHttpRequest();
        if(!_options.type){
            _options.type = 'post';
        }
        if (_options.type.toLowerCase() === 'get') {
            xhr.open(_options.type, `${url}?${formatParams(data)}`, true);
            Object.keys(_options.header || {}).forEach(k => xhr.setRequestHeader(k, _options.header[k]));
            xhr.send(null);
        } else if (_options.type.toLowerCase() === 'post') {
            xhr.open(_options.type, url, true);
            Object.keys(_options.header || {}).forEach(k => xhr.setRequestHeader(k, _options.header[k]));
            xhr.send(JSON.stringify(data));
        }
        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.response || '{}'));
            } else {
                reject(JSON.parse(xhr.response || '{}'));
            }
        }
    });
}