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

import React from 'react'
import { expect, mount, find, stub, within } from '@instructure/ui-test-utils'

import View from '@instructure/ui-layout/lib/components/View'

import Table from '../index'

describe('<Table />', async () => {
  it('should render a caption', async () => {
    await mount(<Table caption="Test table" />)
    const table = await find('table')
    expect(await table.find('caption:contains(Test table)')).to.exist()
  })

  it('should meet a11y standards', async () => {
    await mount(<Table caption="Test table" />)
    const table = await find('table')
    expect(await table.accessible()).to.be.true()
  })

  it('applies a fixed column layout', async () => {
    await mount(<Table caption="Test fixed table" layout="fixed" />)
    const table = await find('table')

    const tableNode = within(table.getDOMNode())
    expect(tableNode.getComputedStyle().tableLayout).to.equal('fixed')
  })

  describe('when passing down props to View', async () => {
    const allowedProps = {
      margin: 'small',
      elementRef: () => {}
    }

    Object.keys(View.propTypes)
      .filter(prop => prop !== 'theme' && prop !== 'children')
      .forEach((prop) => {
        if (Object.keys(allowedProps).indexOf(prop) < 0) {
          it(`should NOT allow the '${prop}' prop`, async () => {
            const consoleError = stub(console, 'error')
            const warning = `Warning: [Table] prop '${prop}' is not allowed.`
            const props = {
              [prop]: 'foo'
            }
            await mount(<Table caption="Test table" {...props} />)
            expect(consoleError)
              .to.be.calledWithExactly(warning)
          })
        } else {
          it(`should allow the '${prop}' prop`, async () => {
            const props = { [prop]: allowedProps[prop] }
            const consoleError = stub(console, 'error')
            await mount(<Table caption="Test table" {...props} />)
            expect(consoleError)
              .to.not.be.called()
          })
        }
    })
  })
})
