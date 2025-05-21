export {}

declare global {
    var _sessions: Map<string, Session> | undefined;
    var _users : Map<string, User> | undefined;
}