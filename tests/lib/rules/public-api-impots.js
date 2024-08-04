/**
 * @fileoverview f
 * @author villimon
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/public-api-impots'),
    RuleTester = require('eslint').RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const aliasOptions = [
    {
        alias: '@',
    },
]

const ruleTester = new RuleTester()
ruleTester.run('public-api-impots', rule, {
    valid: [
        {
            code: "import {addCommentFormActions,addCommentFormReducer} from '../../model/slice/addCommentFormSlice';",
            errors: [],
        },
        {
            code: "import {addCommentFormActions,addCommentFormReducer} from '@/pages/Articles'",
            errors: [],
            options: aliasOptions,
        },
    ],

    invalid: [
        {
            code: "import {addCommentFormActions,addCommentFormReducer} from '@/pages/Article/model/slice/addCommentFormSlice';",
            errors: [
                {
                    message: 'Абсолютный импорт разрешен только из Publick API',
                },
            ],
            options: aliasOptions,
        },
    ],
})
