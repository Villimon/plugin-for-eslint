/**
 * @fileoverview feature sliced relative path checker
 * @author villimon
 */
'use strict';

const path = require('path');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: 'feature sliced relative path checker',
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
        messages: {}, // Add messageId and message
    },

    create(context) {
        return {
            // node  с которой мы будем рабоать можно ее посмотреть на сайте astexplorer.net
            // Если написать там импорт то увидим ее node
            ImportDeclaration(node) {
                // entities/Article
                const importTo = node.source.value;

                // Текущий файл в котором мы находимся
                const fromFilename = context.getFilename();

                if (shouldBeRelative(fromFilename, importTo)) {
                    context.report(
                        node,
                        'В рамках одного слайса все пути должны быть относительными'
                    );
                }
            },
        };
    },
};

// Проверка относительный ли путь
function isPathRelative(path) {
    return path === '.' || path.startsWith('./') || path.startsWith('../');
}

const layers = {
    entities: 'entities',
    features: 'features',
    shared: 'shared',
    pages: 'pages',
    widgets: 'widgets',
};

function shouldBeRelative(from, to) {
    if (isPathRelative(to)) {
        return false;
    }
    // Делим строку на сегменты
    // entities/Article
    const toArray = to.split('/');
    const toLayer = toArray[0]; //entities
    const toSlice = toArray[1]; //Article

    if (!toLayer || !toSlice || !layers[toLayer]) {
        return false;
    }

    // Сделать путь на всех операционках одинаковым
    const normalizedPath = path.toNamespacedPath(from);

    const projectFrom = normalizedPath.split('src')[1];
    const fromArray = projectFrom.split('\\');
    const fromLayer = fromArray[1];
    const fromSlice = fromArray[2];

    if (!fromLayer || !fromSlice || !layers[fromLayer]) {
        return false;
    }

    return fromSlice === toSlice && fromLayer === toLayer;
}
