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
import sinon from 'sinon'
import fetchMock from 'fetch-mock'

import StyleSheet from '@instructure/ui-stylesheet'

import ReactComponentWrapper from './reactComponentWrapper'

import initConsole from './initConsole'
import { newMutationObserver } from './shims'

class Sandbox {
  constructor () {
    initConsole()

    // eslint-disable-next-line no-console
    console.log('[ui-test-utils] Initializing test sandbox...')

    this._sandbox = sinon.createSandbox()

    this._attributes = {
      document: [...document.documentElement.attributes],
      body: [...document.body.attributes]
    }

    this._addedNodes = []
    this._observer = newMutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        Array.from(mutation.addedNodes).forEach((addedNode) => {
          this._addedNodes.push(addedNode)
        })
      })
    })

    try {
      // global Mocha (or Jest?) beforeEach
      beforeEach(this.setup.bind(this))
    } catch (e) {} // eslint-disable-line no-empty
  }

  teardown () {
    this._observer.disconnect()

    ReactComponentWrapper.unmount()

    StyleSheet.flush()

    this._sandbox.resetHistory()
    this._sandbox.restore()

    window.localStorage.clear()
    window.sessionStorage.clear()

    if (this._originalWindowOnError) {
      window.onerror = this._originalWindowOnError
    }

    if (this._originalConsoleError) {
      console.error = this._originalConsoleError
    }

    setAttributes(document.documentElement, this._attributes.document)
    setAttributes(document.body, this._attributes.body)

    this._addedNodes.forEach((node) => node && typeof node.remove === 'function' && node.remove())
    this._addedNodes = []

    fetchMock.restore()

    if (global.viewport) {
      global.viewport.set('large')
    }
  }

  setup () {
    try {
      this.teardown()

      document.documentElement.setAttribute('dir', 'ltr')
      document.documentElement.setAttribute('lang', 'en-US')

      // override mocha's onerror handler
      if (typeof window.onerror === 'function') {
        this._originalWindowOnError = window.onerror
        window.onerror = overrideWindowOnError(window.onerror)
      }

      // for prop-type warnings:
      if (typeof console.error === 'function') {
        this._originalConsoleError = console.error
        console.error = overrideConsoleError(console.error)
      }

      this._observer.observe(document.head, { childList: true })
      this._observer.observe(document.body, { childList: true })

      // We need to call 'mock' at least once
      // in order to get fetch-mock to error out on unexpected actual fetch calls,
      // so we call it with a bogus path that should never get hit.
      fetchMock.mock('bananas', 'bananas')
    } catch (e) {
      console.warn(`[ui-test-utils] error in test setup: ${e}`)
    }
  }

  stub (obj, method, fn) {
    if (typeof fn === 'function') {
      return this._sandbox.stub(obj, method).callsFake(fn)
    } else {
      return this._sandbox.stub(obj, method)
    }
  }

  spy (obj, method) {
    return this._sandbox.spy(obj, method)
  }

  mount (element, options) {
    return ReactComponentWrapper.mount(element, options)
  }

  viewport () {
    if (!global.viewport) {
      console.error('[ui-test-utils] the `viewport` global has not been configured. See https://github.com/squidfunk/karma-viewport.')
    }
    return global.viewport
  }
}

function overrideWindowOnError (windowOnError) {
  return (err, url, line) => {
    const error = (typeof err === 'string') ? err : err.toString()

    // Prevent default window errors for uncaught errors in React 16+ here.
    // The promise returned by the mount, setProps, and setContext utils will be rejected when they are thrown.
    // Ignore them here so that they don't fail the test when they have been handled.
    if (error.startsWith('Error: Warning:') ||
      error.startsWith('Uncaught Error: Warning:') ||
      error.startsWith('The above error occurred')) {
      return true
    }

    return windowOnError(err, url, line)
  }
}

function overrideConsoleError (consoleError) {
  return (first, ...rest) => {
    const error = (typeof first === 'string') ? first : first.toString()

    if (error.startsWith('Warning:')) {
      // throw an error so that prop type validation errors are caught in our tests:
      throw new Error(first)
    }

    // ignore the noisy/extra uncaught error messages fired by React 16+
    if (error.startsWith('Uncaught Error: Warning:') ||
      error.startsWith('The above error occurred')) {
      return
    }

    if (process.env.DEBUG) {
      return consoleError(first, ...rest)
    }
  }
}

function setAttributes (element, attributes = []) {
  if (element && element.attributes) {
    [...element.attributes].forEach((attribute) => {
      element.removeAttribute(attribute.name)
    })
    attributes.forEach((attribute) => {
      element.setAttribute(attribute.name, attribute.value)
    })
  }
}

// only allow one Sandbox instance
const sandbox = new Sandbox()
const viewport = sandbox.viewport
const mount = (element, context) => sandbox.mount(element, context)
const stub = (obj, method, fn) => sandbox.stub(obj, method, fn)
const spy = (obj, method) => sandbox.spy(obj, method)

export {
  viewport,
  mount,
  stub,
  spy
}
