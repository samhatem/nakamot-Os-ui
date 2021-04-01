import * as React from 'react'
import styled from 'styled-components'

import test from './test.png'

const GalleryFrame = styled.div`
  width: 100%;
  height: 80%;
  min-height: 258px;
  display: flex;
  align-items: center;
  flex-direction: center;
  /* background-color: ${props => props.theme.black}; */
`

const ImgStyle = styled.img`
  width: 100%;
  box-sizing: border-box;
  /* background-color: ${props => props.theme.black}; */
`

export default function Gallery() {
  return (
    <GalleryFrame>
      <ImgStyle src={test} alt="Logo" />
    </GalleryFrame>
  )
}
