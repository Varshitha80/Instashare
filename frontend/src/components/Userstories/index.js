import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css'
import {useState, useRef, useEffect} from 'react'
import Popup from 'reactjs-popup';

// Custom Next Arrow
const NextArrow = ({onClick, isDisabled}) => (
  <div
    className={`arrowbackground nextarrow ${
      isDisabled ? 'disabled-arrow' : ''
    }`}
    onClick={() => {
      if (!isDisabled) {
        console.log('Next arrow clicked')
        onClick()
      }
    }}
    role="button"
    tabIndex={0}
    aria-disabled={isDisabled}
  >
    <img
      src="https://res.cloudinary.com/dxbf8wo2m/image/upload/v1729335328/Icon_njokkw.png"
      alt="Next"
    />
  </div>
)

// Custom Previous Arrow
const PrevArrow = ({onClick, isDisabled}) => (
  <div
    className={`arrowbackground prevarrow ${
      isDisabled ? 'disabled-arrow' : ''
    }`}
    onClick={() => {
      if (!isDisabled) {
        console.log('Prev arrow clicked')
        onClick()
      }
    }}
    role="button"
    tabIndex={0}
    aria-disabled={isDisabled}
  >
    <img
      src="https://res.cloudinary.com/dxbf8wo2m/image/upload/v1729335730/Icon_1_twvjij.png"
      alt="Previous"
    />
  </div>
)

const Userstories = ({userstories}) => {
  const [currentSlide, setCurrentSlide] = useState(0) // Track the current slide
  const slickRef = useRef(null) // Reference to the slider

  const totalSlides = userstories.length

  useEffect(() => {}, [currentSlide])

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    afterChange: index => {
      setCurrentSlide(index) // Update the current slide after a change
    },
    nextArrow: (
      <NextArrow
        isDisabled={currentSlide >= totalSlides - 7} // Disable next arrow if on the last slide
        onClick={() => slickRef.current.slickNext()}
      />
    ),
    prevArrow: (
      <PrevArrow
        isDisabled={currentSlide === 0} // Disable prev arrow if on the first slide
        onClick={() => slickRef.current.slickPrev()}
      />
    ),
  }

  return (
    <li className="storycon1">
      <Slider {...settings} ref={slickRef}>
        {userstories.map(story => (
          <div className="storygap" key={story.userid}>
            <Popup 
            trigger={
            <div className="storycon">
              <img
                src={story.storyurl}
                alt="user story"
                className="storyimage"
              />
            </div>
            }
            modal
            closeOnDocumentClick
             overlayClassName="popup-overlay"
              contentClassName="popup-content"
              >
                <img src={story.storyurl} alt="user story" className='fullscreen-image' />
              </Popup>
            <p className="storyname">{story.username}</p>
          </div>
        ))}
      </Slider>
    </li>
  )
}

export default Userstories
