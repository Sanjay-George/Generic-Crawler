export enum configTypes {
    ACTION=1,
    STATE=2
};

export enum elementTypes {
    DEFAULT=0,
    ACTION=1,
    ACTION_TARGET=2,
    ACTION_LABEL=3,
    STATE=4,
    STATE_TARGET=5,
    STATE_LABEL=6
};

export enum actionTypes {
    CLICK=1,
    TEXT=2,
    SELECT=3
};

export enum stateTypes {
    SCRAPE_DATA=1,
    MONITOR_DATA=2
};

export enum crawlerStatus {
    NOT_CONFIGURED=1,
    CONFIGURED=2,
    IN_PROGRESS=3,
    COMPLETED=4,
    FAILED=5
};

export enum specialKeys {
    DOWN_ARROW=1,
    ENTER=2,
    CTRL=3,
    BACKSPACE=4
};