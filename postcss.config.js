const plugins = Object.assign(
    {
        autoprefixer: {},
        cssnano: {},
        'postcss-normalize': {},
        'postcss-sort-media-queries': {sort: 'desktop-first'}
    }
);

module.exports = {plugins};
