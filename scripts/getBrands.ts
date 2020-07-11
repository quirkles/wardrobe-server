import axios from 'axios';

const url =
    'https://mnrwefss2q-dsn.algolia.net/1/indexes/Designer_production/query?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser&x-algolia-application-id=MNRWEFSS2Q&x-algolia-api-key=a3a4de2e05d9e9b463911705fb6323ad';

const getParamString = (query: string) =>
    `query=${query}&page=0&hitsPerPage=100&facetFilters=%5B%22marketplace%3Agrailed%22%5D`;

const chars = 'abcdefghijklmnopqrstuvwxyz';

const results: any[] = [];

let char1Index = 0;

interface Result {
    data: {
        hits: { name: string; slug: string }[];
    };
}

const getBrands = async () => {
    try {
        while (char1Index < chars.length) {
            let char2Index = 0;
            while (char2Index < chars.length) {
                const query = `${chars[char1Index]}${chars[char2Index]}`;
                const result: Result = await axios.post(url, {
                    params: getParamString(query),
                });
                result.data.hits.forEach(({ name, slug }) => results.push({ name, slug }));
                char2Index++;
            }
            char1Index++;
        }
    } catch (e) {
        console.log(e) //eslint-disable-line
    }
};

getBrands().then(() => {
    const seenSlugs: any[] = [];
    const outPut = results
        .filter(({ slug }) => {
            if (seenSlugs.indexOf(slug) === -1) {
                seenSlugs.push(slug);
                return true;
            }
        })
        .sort((a, b) => (a.slug > b.slug ? 1 : -1))
        .map(({ slug, name }) => `('${name.replace("'", "''")}', '${slug}')`)
        .join(',\n');
    console.log(outPut) //eslint-disable-line
});
