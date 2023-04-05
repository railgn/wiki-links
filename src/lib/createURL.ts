export default function createURL() {
    const char =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "/game/";
    for (let i = 0; i < 5; i++) {
        result += char.charAt(Math.floor(Math.random() * char.length));
    }
    return result;
}
