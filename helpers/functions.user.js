export function userIsAdmin(request) {
    return request.session?.user?.isAdmin ?? false;
}
export function userCanUpdate(request) {
    return request.session?.user?.canUpdate ?? false;
}
