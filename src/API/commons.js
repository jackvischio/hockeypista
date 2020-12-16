import $ from 'jquery'

// ----- TITLE CASE -----
export function titleCase(str) {
    return str.toLowerCase().split(' ').map(word => (word.charAt(0).toUpperCase() + word.slice(1))).join(' ');
}

// ----- POLISH STRING -----
export function polishString(str) {
    str = str.replace(/<br>/g, " ");
    str = str.replace(/[ ]+/g, " ");
    str = str.replace(/\t/g, "");
    str = str.replace(/(\r\n|\n|\r)/gm, "");
    str = str.trim();
    return str;
}

// ----- PARSE A COMPLETE TAG <tag>...</tag> -----
export function parseCompleteTag(str) {
    var tag = { type: "", props: [], params: [], content: "" };

    var openTagStr = str.substr(0, str.indexOf(">")).trim();
    tag.type = openTagStr.substr(1, openTagStr.indexOf(" "));
    openTagStr = openTagStr.substr(openTagStr.indexOf(" ") + 1);
    openTagStr = openTagStr.replace(/=" /gm, '="');
    var props = openTagStr.split(/" /g);
    props.forEach(p => {
        tag.props.push(parseProperty(p + '"'));
    });

    try {
        tag.params = parseParams(tag.props.filter(elem => elem.ident === "config_params")[0].value);
    } catch (e) { }

    // content
    str = str.substr(str.indexOf(">") + 1)
    tag.content = str.substr(0, str.lastIndexOf("<")).trim();

    return tag;
}

// ----- PARSE A TAG WITHOUT CLOSING TAG <img/>
export function parseIsleTag(str) {
    var tag = { type: "", props: [], params: [], content: "" };

    tag.type = str.substr(1, str.indexOf(" "));
    str = str.substr(str.indexOf(" ") + 1);

    str = str.substr(0, str.indexOf(">")).trim();
    str = str.replace(/'/g, "\"");
    var props = str.split(/" /g);
    props.forEach(p => {
        tag.props.push(parseProperty(p + '"'));
    });

    return tag;
}

// ----- PARSE TABLE -----
export function parseTable(inp) {
    var table = { id: "", props: [], rows: [] };

    let str = polishString(inp);

    // retrieving opening tag
    let openTagStr = str.substr(0, str.indexOf(">") + 1).trim();
    str = str.replace(openTagStr, "");
    openTagStr = openTagStr.substr(openTagStr.indexOf(" ") + 1);
    let props = openTagStr.split(/" /g);
    $.each(props, i => {
        table.props.push(parseProperty(props[i] + '"'));
    });

    // content
    let content = str.substr(0, str.indexOf("</table"));
    content = content.replace(/<thead>/g, "");
    content = content.replace(/<\/thead>/g, "");
    content = content.replace(/<tbody>/g, "");
    content = content.replace(/<\/tbody>/, "");
    content = content.substr(content.indexOf("<tr>"), content.lastIndexOf("</tr>") + 5);

    do {
        let current = content.substr(0, content.indexOf("</tr>") + 5);
        content = content.replace(current, "");
        current = current.substr(0, current.length - 5).substr(4);
        var row = { cells: [] };
        do {
            let actual = current.substr(0, current.indexOf("</td>") + 5);
            current = current.replace(actual, "");
            let openTag = actual.substr(0, actual.indexOf(">") + 1)
            let contentTag = actual.replace(openTag, "");
            openTag = openTag.substr(4);
            var cell = { props: [], content: "" };
            props = openTagStr.split(/" /g);
            props.forEach(i => {
                cell.props.push(parseProperty(props[i] + '"'));
            });
            cell.content = contentTag.substr(0, contentTag.length - 5);
            row.cells.push(cell);

        } while (current !== "");
        table.rows.push(row);
    } while (content !== "");

    return table;
}

// ------ PARSE A PROPERTY -----
export function parseProperty(str) {
    str = str.replace("'", "\"");
    let id = str.substring(0, str.indexOf("="));
    let val = str.substring(str.indexOf("\"") + 1, str.lastIndexOf("\""));
    return { name: id, value: val };
}

// ----- PARSE PARAMS (params property of some tags) -----
export function parseParams(str) {
    return str.split(";").map(str => {
        let ind = str.indexOf(":");
        return { name: str.substr(0, ind), value: str.substr(ind + 1) };
    });
}

// ----- EXTRACT PROPERTY VALUE -----
export function extractProp(tag, prop) {
    try {
        return tag.props.filter(elem => elem.name === prop)[0].value;
    } catch (e) { return ""; }
}

// ----- REMOVE TAGS
export function removeTags(str, tagname, multiple, removeContent) {
    if (multiple) {
        if (removeContent) {
            let re = new RegExp("<" + tagname + "[^><]*>[^><]*</" + tagname + ">", "g");
            return polishString(str.replace(re, ""));
        } else {
            let re = new RegExp("<[/]*" + tagname + "[^><]*>", "g");
            return polishString(str.replace(re, ""));
        }
    } else {
        if (removeContent) {
            let re = new RegExp("<" + tagname + "[^><]*>[^><]*</" + tagname + ">", "");
            return polishString(str.replace(re, ""));
        } else {
            // does not work so well, better if you check again
            let re = new RegExp("<[/]*" + tagname + "[^><]*>", "");
            return polishString(str.replace(re, ""));
        }
    }
}

export function myReplaceAll(input, search, repl) {
    while (input.indexOf(search) >= 0) {
        input = input.replace(search, repl);
    }
    return input;
}