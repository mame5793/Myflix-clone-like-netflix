import React from 'react'
import './Fotter.css'
import youtube_icon from '../../assets/youtube_icon.png'
import twitter_icon from '../../assets/twitter_icon.png'
import instagram_icon from '../../assets/instagram_icon.png'
import facebook_icon from '../../assets/youtube_icon.png'

const Fotter = () => {
  return (
    <div className='fotter'>

<div className="footer-icon">
<img src={youtube_icon} alt="face-book" />
<img src={twitter_icon} alt="face-book" />
<img src={instagram_icon} alt="face-book" />
<img src={facebook_icon} alt="face-book" />
</div>
 <ul>
  <li>Audio Description</li>
    <li>Help center</li>
  <li>Gift Card</li>
  <li>Vacancy</li>
  <li>Term to use</li>
  <li>Corporate information</li>
 <li>Contat Us</li>
 <li>Privacy</li>
 </ul>
 <p className='copy-right'>@2025</p>
    </div>
  )
}

export default Fotter