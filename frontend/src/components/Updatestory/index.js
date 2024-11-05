import {Component} from 'react'
import Cookies from 'js-cookie'
import {Navigate,useNavigate} from 'react-router-dom'
import './index.css'

class Updatestory extends Component {
     state = {highlightimageurl:'',errormsg:'',showerror:false}

      onchangehighlightimage = event => {
        this.setState({highlightimageurl:event.target.value})
      }
    
      onsubmitform = async event => {
        event.preventDefault()
        const {highlightimageurl} = this.state
        const jwttoken = Cookies.get('jwt_token')
        const url = '/api/profile/story'
        const options = {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwttoken}`
          },
          body: JSON.stringify({image:highlightimageurl}),
        }
        const response = await fetch(url, options)
        const data = await response.json()
        if (response.ok) {
          const {navigate} = this.props 
          navigate('/my-profile')
          this.setState({errormsg:data.message})
        } else {
          this.setState({errormsg:data.message,showerror:true})
        }
      }
    
      render() {
        const {highlightimageurl, showerror, errormsg} = this.state
        const jwttoken = Cookies.get('jwt_token')
        if (jwttoken === undefined) {
          return <Navigate to="/login" />
        }
        return (
          <div className="logincon1">
            <form className="logincon2 conheight1" onSubmit={this.onsubmitform}>
              <div className="logincon3">
                <img
                  src="https://res.cloudinary.com/dxbf8wo2m/image/upload/q_100/v1729163351/logo_qv7elu.png"
                  alt="website logo"
                  className="loginlogo"
                />
                <h1 className="logoheading">Insta Share</h1>
              </div>
              <div className="logincon4">
                <label htmlFor="highlightpic" className="loginlabel">
                  HIGHLIGHT IMAGE
                </label>
                <input
                  type="text"
                  placeholder="Enter Highlight Image Url"
                  id="highlightpic"
                  onChange={this.onchangehighlightimage}
                  value={highlightimageurl}
                  className="logininput"
                />
              </div>
              {showerror && <p className="errormsg">{errormsg}</p>}
              <button type="submit" className="loginbutton">
                Add Highlight
              </button>
            </form>
          </div>
        )
      }
}
    
const withNavigate = (Component) => {
    return (props)=> {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />
      }
    }
export default withNavigate(Updatestory)