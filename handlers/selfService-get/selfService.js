export function handler(request, response) {
    response.render('selfService.ejs', {
        headTitle: 'Self Service'
    });
}
export default handler;
