export function userIsAdmin(request) {
    return request.session?.user?.isAdmin ?? false;
}
