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
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import View from '@instructure/ui-layout/lib/components/View'

import themeable from '@instructure/ui-themeable'
import testable from '@instructure/ui-testable'
import ThemeablePropTypes from '@instructure/ui-themeable/lib/utils/ThemeablePropTypes'
import { omitProps } from '@instructure/ui-utils/lib/react/passthroughProps'
import error from '@instructure/ui-utils/lib/error'
import { deprecatePropValues } from '@instructure/ui-utils/lib/react/deprecated'

import styles from './styles.css'
import theme from './theme'

/**
---
parent: List
---
**/
@testable()
@themeable(theme, styles)
export default class ListItem extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    variant: deprecatePropValues(
      PropTypes.oneOf(['default', 'unstyled', 'inline']),
      ['pipe'],
      'For the same functionality, use `inline` on the `variant` prop and set the `delimiter` prop to `pipe`.'
    ),
    delimiter: PropTypes.oneOf(['none', 'pipe', 'slash', 'arrow', 'dashed', 'solid']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    /**
    * Valid values are `0`, `none`, `auto`, `xxx-small`, `xx-small`, `x-small`,
    * `small`, `medium`, `large`, `x-large`, `xx-large`. Apply these values via
    * familiar CSS-like shorthand. For example: `margin="small auto large"`.
    */
    margin: ThemeablePropTypes.spacing,
    /**
    * Valid values are `0`, `none`, `xxx-small`, `xx-small`, `x-small`,
    * `small`, `medium`, `large`, `x-large`, `xx-large`. Apply these values via
    * familiar CSS-like shorthand. For example: `padding="small x-large large"`.
    */
    padding: ThemeablePropTypes.spacing,
    spacing: PropTypes.oneOf([
      'none',
      'xxx-small',
      'xx-small',
      'x-small',
      'small',
      'medium',
      'large',
      'x-large',
      'xx-large'
    ]),
    elementRef: PropTypes.func
  }

  render () {
    const passthroughProps = View.omitViewProps(
      omitProps(this.props, ListItem.propTypes),
      ListItem
    )

    const delimiter = (this.props.variant === 'pipe') ? 'pipe' : this.props.delimiter
    const variant = (this.props.variant === 'pipe') ? 'inline' : this.props.variant
    const size = (this.props.variant === 'pipe') ? 'small' : this.props.size

    const noDelimiter = (delimiter === 'none' && variant !== 'inline')

    const noSpacing = (
      this.props.delimiter !== 'none' ||
      this.props.variant === 'pipe' ||
      this.props.spacing === 'none'
    )

    error(
      !(noSpacing && this.props.spacing),
      'List',
      `\`itemSpacing\` has no effect inside Lists with the \`delimiter\`
      prop set to anything other than \`none\`, or with a \`variant\` of \`pipe\`.`
    )

    const classes = {
      [styles.root]: true,
      [styles[variant]]: true,
      [styles[size]]: size,
      [styles[`delimiter--${delimiter}`]]: true,
      [styles[`spacing--${this.props.spacing}`]]: this.props.spacing && !noSpacing
    }
    return (
      <View
        {...passthroughProps}
        as="li"
        margin={this.props.margin}
        padding={this.props.padding}
        className={classnames(classes)}
        elementRef={this.props.elementRef}
      >
        {this.props.children}
        {!noDelimiter && (
          <span
            className={styles.delimiter}
            aria-hidden="true"
          />
        )}
      </View>
    )
  }
}
