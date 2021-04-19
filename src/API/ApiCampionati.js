import { polishString, parseCompleteTag, parseIsleTag, parseParams, extractProp, prepareURLforProxy } from './commons'

const season = "29";

export default function ApiCampionati(then, error) {
    fetch(prepareURLforProxy("fisr_ls_1.php"), { redirect: 'manual' })
        .then((res) => { return res.text(); })
        .then(data => { then(parse(data)); })
        .catch(e => { console.log(e); error() })
}

function parse(data) {

    data = polishString(data);
    let camp = [];
    let ind = data.indexOf("</a>");
    while (ind !== -1) {
        // get and process the current block
        let working = data.substr(0, ind + 4);
        camp.push(parseCampionato(working));

        // go to the next one
        data = data.replace(working, "");
        ind = data.indexOf("</a>");
    }

    // filtering Campionati of this season
    camp = camp.filter(elem => elem.season === season);
    camp = camp.filter(elem => (elem.name !== "" && elem.name !== "\"" && elem.name !== "'" && elem.name !== " "));

    return camp;
}

function parseCampionato(str) {
    // parsing the string as a tag
    let tag = parseCompleteTag(str);
    tag.params = parseParams(extractProp(tag, "config_params"));

    // creating a new Campionato
    let camp = { id: 0, name: "", teams: [], logo: "", season: "", dur_tempo: 0, abbr: "" };
    camp.id = parseInt(extractProp(tag, "id"));
    camp.name = extractProp(tag, "name").trim();

    // create abbreviation for the campionato
    let ret = camp.name.match(/ (A1)|(A2)|(B)|(FEMM)|U[0-9]* /);
    camp.abbr = (ret != null) ? ret[0].trim() : "";

    // extracting season
    let season_str = extractProp(tag, "class");
    camp.season = season_str.substr(season_str.indexOf("temp_") + 5);

    // extracting logo
    let img_tag = parseIsleTag(tag.content.substr(tag.content.indexOf("<img")));
    camp.logo = extractProp(img_tag, "src");

    // extracting teams
    let teams_tag = parseIsleTag(tag.content.substr(tag.content.indexOf("<input")));
    let teams_str = extractProp(teams_tag, "value");
    camp.teams = teams_str.split(";").filter(elem => elem !== "\"").map(elem => {
        let info = elem.split(",");
        return { name: info[2], id: info[1], logo: "https://ns3104249.ip-54-37-85.eu/fisr/images/logos_clubes/" + info[0] };
    })

    // extracting period duration
    try {
        camp.dur_tempo = parseInt(tag.params.filter(elem => elem.name === "tpo_reg")[0].value);
    } catch (e) { camp.dur_tempo = 25; }

    return camp;
}