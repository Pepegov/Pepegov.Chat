export default function loadAbout() {
    return fetch('./app/about/about.component.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('app')!.innerHTML = html;
        })
        .catch(err => console.warn('Something went wrong.', err));
}