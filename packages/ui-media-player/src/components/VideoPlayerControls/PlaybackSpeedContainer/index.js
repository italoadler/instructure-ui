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

import PlaybackSpeed from './PlaybackSpeed'
import VideoPlayerPopover from '../../VideoPlayerPopover'
import { PLAYBACK_SPEED_OPTIONS } from '../../VideoPlayer'
import { Consumer } from '../../VideoPlayer/VideoPlayerContext'

/**
---
private: true
---
@module PlaybackSpeedContainer
**/
export default class PlaybackSpeedContainer extends Component {
  handleKeyDown = (showControls) => (e) => {
    e.preventDefault()
    showControls()
  }

  handleOnSelect = (setPlaybackSpeed) => (e, [speed]) => {
    setPlaybackSpeed(speed)
  }

  handleOnMouseMove = (showControls) => () => {
    showControls()
  }

  render () {
    return (
      <Consumer>
        {({
          state,
          mediaPlayerWrapperRef,
          actions
        }) => (
            <VideoPlayerPopover showControls={state.showControls}>
              {({ showPopover }, togglePopover ) => (
                <PlaybackSpeed
                  showPopover={showPopover}
                  togglePopover={togglePopover}
                  videoId={state.videoId}
                  mountNode={mediaPlayerWrapperRef}
                  playbackSpeed={state.playbackSpeed}
                  playbackSpeedOptions={PLAYBACK_SPEED_OPTIONS}
                  handleKeyDown={this.handleKeyDown(actions.showControls)}
                  handleOnSelect={this.handleOnSelect(actions.setPlaybackSpeed)}
                  handleOnMouseMove={this.handleOnMouseMove(actions.showControls)}
                  {...this.props}
                />
              )}
            </VideoPlayerPopover>
        )}
      </Consumer>
    )
  }
}
