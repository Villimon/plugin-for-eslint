const { isPathRelative } = require('../helpers/index');

const PUBLIC_ERROR = 'PUBLIC_ERROR';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: null,
        docs: {
            description: 'f',
            recommended: false,
            url: null,
        },
        fixable: 'code',
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
        messages: {
            [PUBLIC_ERROR]: 'Абсолютный импорт разрешен только из Publick API',
        },
    },

    create(context) {
        const alias = context.options[0]?.alias || '';

        const checkingLayers = {
            entities: 'entities',
            features: 'features',
            pages: 'pages',
            widgets: 'widgets',
        };

        return {
            // node  с которой мы будем рабоать можно ее посмотреть на сайте astexplorer.net
            // Если написать там импорт то увидим ее node
            ImportDeclaration(node) {
                // entities/Article
                const value = node.source.value;

                const importTo = alias ? value.replace(`${alias}/`, '') : value;

                if (isPathRelative(importTo)) {
                    return;
                }

                //  [entities,article,model]
                const segments = importTo.split('/');
                const layer = segments[0];
                const slice = segments[1];

                if (!checkingLayers[layer]) {
                    return;
                }

                const isImportNotFromPublicApi = segments.length > 2;

                if (isImportNotFromPublicApi) {
                    context.report({
                        node,
                        messageId: PUBLIC_ERROR,
                        fix: (fixer) => {
                            return fixer.replaceText(
                                node.source,
                                `'${alias}/${layer}/${slice}'`
                            );
                        },
                    });
                }
            },
        };
    },
};
