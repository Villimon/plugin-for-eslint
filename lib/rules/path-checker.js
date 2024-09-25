/**
 * @fileoverview feature sliced relative path checker
 * @author villimon
 */
'use strict';

const path = require('path');
const { isPathRelative } = require('../helpers/index');
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: null,
        docs: {
            description: 'feature sliced relative path checker',
            recommended: false,
            url: null,
        },
        // Чтобы автофикс работал
        fixable: 'code',
        // Данные приходящие из вне, с настройкой плагина
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
        // Массивы schema
        const alias = context.options[0]?.alias || '';
        return {
            // node  с которой мы будем рабоать можно ее посмотреть на сайте astexplorer.net
            // Если написать там импорт то увидим ее node
            ImportDeclaration(node) {
                try {
                    // entities/Article
                    const value = node.source.value;

                    const importTo = alias
                        ? value.replace(`${alias}/`, '')
                        : value;

                    // Текущий файл в котором мы находимся
                    const fromFilename = context.getFilename();

                    if (shouldBeRelative(fromFilename, importTo)) {
                        context.report({
                            node,
                            messages:
                                'В рамках одного слайса все пути должны быть относительными',
                            fix: (fixer) => {
                                // entites/Article/Article.tsx
                                const normalizedPath =
                                    getNormalizedCurrentFilePath(fromFilename)
                                        .split('/')
                                        .slice(0, -1)
                                        .join('/');
                                let relativePath = path
                                    .relative(normalizedPath, `/${importTo}`)
                                    .split('\\')
                                    .join('/');

                                if (!relativePath.startsWith('.')) {
                                    relativePath = './' + relativePath;
                                }

                                return fixer.replaceText(
                                    node.source,
                                    `'${relativePath}'`
                                );
                            },
                        });
                    }
                } catch (e) {
                    console.log(e);
                }
            },
        };
    },
};

const layers = {
    entities: 'entities',
    features: 'features',
    shared: 'shared',
    pages: 'pages',
    widgets: 'widgets',
};

function getNormalizedCurrentFilePath(currentFilePath) {
    // Сделать путь на всех операционках одинаковым
    const normalizedPath = path.toNamespacedPath(currentFilePath);
    const projectFrom = normalizedPath.split('src')[1];
    return projectFrom?.split('\\').join('/');
}

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

    const projectFrom = getNormalizedCurrentFilePath(from);
    const fromArray = projectFrom.split('/');
    const fromLayer = fromArray[1];
    const fromSlice = fromArray[2];

    if (!fromLayer || !fromSlice || !layers[fromLayer]) {
        return false;
    }

    return fromSlice === toSlice && fromLayer === toLayer;
}
