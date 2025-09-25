export const themeSwitch = () => {
    const html = document.querySelector('html');
    html.getAttribute('theme');

    if (html.getAttribute('theme') == 'dark')
        html.setAttribute('theme', 'light');
    else    
        html.setAttribute('theme', 'dark')
}