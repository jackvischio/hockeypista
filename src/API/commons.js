// ----- TITLE CASE -----
export function titleCase(str) {
    return str.toLowerCase().split(' ').map(word => (word.charAt(0).toUpperCase() + word.slice(1))).join(' ');
}

// ----- POLISH STRING -----
export function polishString(str) {
    str = str.replaceAll("<br>", " ");
    str = str.replaceAll(/[ ]+/g, " ");
    str = str.replaceAll(/\t/g, "");
    str = str.replaceAll(/(\r\n|\n|\r)/gm, "");
    str = str.trim();
    return str;
}

// ----- PARSE A COMPLETE TAG <tag>...</tag> -----
export function parseCompleteTag(str) {
    var tag = { type: "", props: [], params: [], content: "" };

    var openTagStr = str.substr(0, str.indexOf(">")).trim();
    tag.type = openTagStr.substr(1, openTagStr.indexOf(" "));
    openTagStr = openTagStr.substr(openTagStr.indexOf(" ") + 1);
    openTagStr = openTagStr.replaceAll(/=\" /gm, '="');
    var props = openTagStr.split(/\" /g);
    props.forEach(p => {
        tag.props.push(parseProperty(p + '"'));
    });

    try {
        tag.params = parseParams(tag.props.filter(elem => elem.ident == "config_params")[0].value);
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
    str = str.replaceAll("'", "\"");
    var props = str.split(/\" /g);
    props.forEach(p => {
        tag.props.push(parseProperty(p + '"'));
    });

    return tag;
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
        return tag.props.filter(elem => elem.name == prop)[0].value;
    } catch (e) { console.log(e); return ""; }
}

// ----- REMOVE TAGS
export function removeTags(str, tagname, multiple, removeContent) {
    if (multiple) {
        if (removeContent) {
            let re = new RegExp("<" + tagname + "[^><]*>[^><]*</" + tagname + ">", "g");
            return polishString(str.replaceAll(re, ""));
        } else {
            let re = new RegExp("<[/]*" + tagname + "[^><]*>", "g");
            return polishString(str.replaceAll(re, ""));
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

// ----- REDIRECTIONS -----
function GoToCampionato(id) { window.location.href = "campionato.html?idc=" + id; }