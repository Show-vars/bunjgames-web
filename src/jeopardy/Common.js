const getStatusName = (status) => {
    switch (status) {
        case 'waiting_for_players':
            return "Waiting for players";
        case 'themes_all':
            return "All themes";
        case 'round_themes':
            return "Round themes";
        case 'questions':
            return "Questions";
        case 'question_event':
            return "Question event";
        case 'question':
            return "Question";
        case 'question_end':
            return "Question end";
        case 'final_themes':
            return "Final themes";
        case 'final_bets':
            return "Final bets";
        case 'final_question':
            return "Final question";
        case 'final_question_timer':
            return "Final answer";
        case 'final_end':
            return "Final question end";
        case 'game_end':
            return "Game over";
    }
}

const getTypeName = (status) => {
    switch (status) {
        case 'standard':
            return "Standard";
        case 'auction':
            return "Auction";
        case 'bagcat':
            return "Cat in the bag";
    }
}

export {getStatusName, getTypeName}
