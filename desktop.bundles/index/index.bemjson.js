({
    block: 'page',
    title: 'Ежедневник',
    favicon: '/favicon.ico',
    head: [
        { elem: 'css', url: '_index.css', ie: false },
        { elem: 'css', url: '_index.ie.css', ie: 'gte IE 6' },
        { elem: 'meta', attrs: { name: 'description', content: '' }}
    ],
    content:[
        {
            block: 'b-diary'
        },
        { elem: 'js', url: 'index.bemhtml.js' },
        { elem: 'js', url: '_index.js' }
    ]
})
