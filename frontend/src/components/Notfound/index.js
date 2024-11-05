import {useNavigate} from 'react-router-dom'
import './index.css'

const Notfound = () => {
  const navigate = useNavigate()
  const onclickhome = () => {
    navigate("/")
  }

  return (
    <div className="nfcon">
      <img
        src="https://res.cloudinary.com/dxbf8wo2m/image/upload/v1729504276/erroring_1_lda2i0.png"
        alt="page not found"
        className="nfimage"
      />
      <h1 className="nfheading">Page Not Found</h1>
      <p className="nfpara">
        we are sorry, the page you requested could not be found.Please go back
        to the homepage.
      </p>
      <button type="button" className="nfbutton" onClick={onclickhome}>
        Home Page
      </button>
    </div>
  )
}

export default Notfound
