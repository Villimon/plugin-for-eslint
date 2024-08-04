/**
 * @fileoverview feature sliced relative path checker
 * @author villimon
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/path-checker'),
    RuleTester = require('eslint').RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('path-checker', rule, {
    valid: [
        {
            filename:
                'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\Article',
            code: "import {addCommentFormActions,addCommentFormReducer} from '../../model/slice/addCommentFormSlice';",
            errors: [],
        },
    ],

    invalid: [
        {
            filename:
                'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\pages\\Article',
            code: "import {addCommentFormActions,addCommentFormReducer} from '@/pages/Article/model/slice/addCommentFormSlice';",
            errors: [
                {
                    message:
                        'В рамках одного слайса все пути должны быть относительными',
                },
            ],
            options: [
                {
                    alias: '@',
                },
            ],
        },
        {
            filename:
                'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\pages\\Article',
            code: "import {addCommentFormActions,addCommentFormReducer} from 'pages/Article/model/slice/addCommentFormSlice';",
            errors: [
                {
                    message:
                        'В рамках одного слайса все пути должны быть относительными',
                },
            ],
        },
    ],
})
