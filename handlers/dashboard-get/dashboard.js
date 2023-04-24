export async function handler(_request, response) {
    response.render('dashboard', {
        headTitle: 'Dashboard'
    });
}
export default handler;
