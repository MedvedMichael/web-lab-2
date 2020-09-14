const templateEngine = (text, data) => {
    const reg = /<#([^%>]+)?#>/g
    const regForJSCode = /(^( )?(var|const|if|for|else|switch|case|break|{|}|;))(?:(?=\()|(?= )|$)/g


    let code = 'let collector = [];\n',
        currentPosition = 0, match = '';

    const value = [], name = []
    if (typeof(data) === "object") {
        for (var k in data) {
            name.push(k)
            value.push(data[k]);
        }
    }

    const add = (line, isJS) => {
        isJS ? (code += line.match(regForJSCode) ? `${line}\n` : `collector.push(${line});\n`) :
            (code += line != '' ? `collector.push("${line.replace(/"/g, '\\"')}");\n` : '');
        return add
    }

    while (match = reg.exec(text)){
        add(text.slice(currentPosition, match.index))(match[1], true);
        currentPosition = match.index + match[0].length;
    }

    
    add(text.substr(currentPosition, text.length - currentPosition));
    code += 'return collector.join("");'
    
    return new Function(name, code.replace(/[\r\t\n]/g, '')).apply(this, value);
}

export default templateEngine