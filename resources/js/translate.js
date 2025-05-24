import es from '../../lang/es.json';

const translationData = {
    es
};

let currentLang = localStorage.getItem('lang') || 'es';

export function __(key) {

    if (currentLang === 'es') {
        return translationData['es'][key] || key;
    }

    return key;
}

export function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    window.location.reload();
}
