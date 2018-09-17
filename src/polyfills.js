/* eslint no-extend-native: 0 */

import startsWith from 'core-js/library/fn/string/virtual/starts-with'
import find from 'core-js/library/fn/array/virtual/find'
import assign from 'core-js/library/fn/object/assign.js'
import values from 'core-js/library/fn/object/values.js'

String.prototype.startsWith = startsWith
Array.prototype.find = find
Object.assign = assign
Object.values = values

// This was made because 'unique' was appearing as key on for in loops
// e.g: [1,2,3] was looping as '1', '2', '3', 'unique'
Object.defineProperty(Array.prototype, 'unique', { enumerable: false })

require('core-js/es6/object')
require('core-js/es6/map')
require('core-js/library/fn/array/includes')
require('core-js/es6/promise')
require('core-js/es7/promise')
