const getStatusName = (status) => {
    switch (status) {
        case 'waiting_for_players':
            return "Waiting for players";
        case 'intro':
            return "Intro";
        case 'round':
            return "Round"
        case 'questions':
            return "Questions";
        case 'weakest_choose':
            return "Weakest choose";
        case 'weakest_reveal':
            return "Weakest reveal";
        case 'final':
            return "Final";
        case 'final_questions':
            return "Final questions";
        case 'end':
            return "Game over";
    }
}

export {
    getStatusName
}
