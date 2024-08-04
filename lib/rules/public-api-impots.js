const { isPathRelative } = require('../helpers/index')

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: null,
        docs: {
            description: 'f',
            recommended: false,
            url: null,
        },
        fixable: null,
        schema: [
            {
                type: 'object',
                properties: {
                    alias: {
                        type: 'string',
                    },
                },
            },
        ],
        messages: {},
    },

    create(context) {
        const alias = context.options[0]?.alias || ''

        const checkingLayers = {
            entities: 'entities',
            features: 'features',
            pages: 'pages',
            widgets: 'widgets',
        }

        return {
            // node  с которой мы будем рабоать можно ее посмотреть на сайте astexplorer.net
            // Если написать там импорт то увидим ее node
            ImportDeclaration(node) {
                // entities/Article
                const value = node.source.value

                const importTo = alias ? value.replace(`${alias}/`, '') : value

                if (isPathRelative(importTo)) {
                    return
                }

                //  [entities,article,model]
                const segments = importTo.split('/')
                const isImportNotPublicApi = segments.length > 2
                const layer = segments[0]

                if (!checkingLayers[layer]) {
                    return
                }

                if (isImportNotPublicApi) {
                    context.report(
                        node,
                        'Абсолютный импорт разрешен только из Publick API'
                    )
                }
            },
        }
    },
}
