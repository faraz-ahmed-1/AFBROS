export const getToken = () => {

    return (
        localStorage.getItem("token") ||
        sessionStorage.getItem("token")
    );

};


export const isFinanceManager = () => {

    return Boolean(getToken());

};


export const isGuest = () => {

    return (
        !getToken() &&
        sessionStorage.getItem(
            "afbros_guest"
        ) === "true"
    );

};


export const hasSiteAccess = () => {

    return (
        isFinanceManager() ||
        isGuest()
    );

};


export const enterGuestMode = () => {

    localStorage.removeItem("token");

    sessionStorage.removeItem("token");

    sessionStorage.setItem(
        "afbros_guest",
        "true"
    );

};


export const leaveGuestMode = () => {

    sessionStorage.removeItem(
        "afbros_guest"
    );

};


export const clearAuthentication = () => {

    localStorage.removeItem("token");

    sessionStorage.removeItem("token");

    sessionStorage.removeItem(
        "afbros_guest"
    );

};