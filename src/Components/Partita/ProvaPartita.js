export default function ProvaPartita() {
    return {
        actions: [],
        campionato: {
            idc: 0,
            girone: "---",
            nome: "Campionato",
            tempo: 0
        },
        currentTime: "-----",
        date: { day: "01/01/2000", hour: "00:00" },
        idp: 0,
        place: "---",
        playing: false,
        falliA: 0,
        falliB: 0,
        goalsA: 0,
        goalsB: 0,
        referees: {
            aus: "",
            ref1: "",
            ref2: ""
        },
        teamA: {
            logo: "https://via.placeholder.com/30x30.png?text=A",
            nome: "A",
            small: "A",
            giocatori: [],
            tecnici: []
        },
        teamB: {
            logo: "https://via.placeholder.com/30x30.png?text=B",
            nome: "B",
            small: "B",
            giocatori: [],
            tecnici: []
        },
    }
}