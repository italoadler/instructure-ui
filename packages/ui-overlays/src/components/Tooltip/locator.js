/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - present Instructure, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { locator, parseQueryArguments } from '@instructure/ui-test-utils'

import Tooltip from './index'
import PopoverLocator from '../Popover/locator'

const customMethods = {
  findTrigger: async (...args) => {
    const trigger = await PopoverLocator.findTrigger()
    if (trigger) {
      return trigger.find('[aria-describedby]', ...args)
    } else {
      return null
    }
  },
  findContent: async (...args) => {
    const { options } = parseQueryArguments(...args)
    const content = await PopoverLocator.findContent({ ...options, visible: false })
    if (content) {
      return content.find('[role="tooltip"]', options)
    } else {
      return null
    }
  }
}

export default {
  ...locator(Tooltip.selector, customMethods),
  ...customMethods
}
