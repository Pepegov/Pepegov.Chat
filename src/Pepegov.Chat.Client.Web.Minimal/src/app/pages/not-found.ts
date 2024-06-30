export default function loadNotFound() {
    return fetch('./app/notFound/notFound.component.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('app')!.innerHTML = html;
        })
        .catch(err => console.warn('Something went wrong.', err));
}
