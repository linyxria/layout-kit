import { createComponent } from '@lit/react'
import { ScreenFit as ScreenFitElement } from '@screen-fit/core'
import React from 'react'

export const ScreenFit = createComponent({
  tagName: 'screen-fit',
  elementClass: ScreenFitElement,
  react: React,
  events: {
    onscale: 'scale',
  },
})
