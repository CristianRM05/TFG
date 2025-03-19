import translations from '../../lang/es.json';

export function __(key) {
    return translations[key] || key;
}
