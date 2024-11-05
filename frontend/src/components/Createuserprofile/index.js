import {Component} from 'react'
import Cookies from 'js-cookie'
import {Navigate,useNavigate} from 'react-router-dom'
import './index.css'

class Createuserprofile extends Component {
     state = {userid:'',username:'',userbio:'',errormsg:'',showerror:false}

      onchangeuserid = event => {
        this.setState({userid: event.target.value})
      }
    
      onchangeusername = event => {
        this.setState({username: event.target.value})
      }

      onchangeuserbio = event => {
        this.setState({userbio:event.target.value})
      }
    
      onsubmitform = async event => {
        event.preventDefault()
        const {username,userbio,userid} = this.state
        const userdetails = {user_name:username,user_bio:userbio,user_id:userid}
        const jwttoken = Cookies.get('jwt_token')
        const url = '/api/profile'
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwttoken}`
          },
          body: JSON.stringify(userdetails),
        }
        const response = await fetch(url, options)
        const data = await response.json()
        if (response.ok) {
          const {navigate} = this.props 
          navigate('/')
        } else {
          this.setState({errormsg:data.message,showerror:true})
        }
      }
    
      render() {
        const {username,userbio,userid, showerror, errormsg} = this.state
        const jwttoken = Cookies.get('jwt_token')
        if (jwttoken === undefined) {
          return <Navigate to="/login" />
        }
        return (
          <div className="logincon1">
            <div>
              <img
                src="https://res.cloudinary.com/dxbf8wo2m/image/upload/q_auto:best/v1729164693/Illustration_tf47px.png"
                alt="website login"
                className="landingimage"
              />
            </div>
            <form className="logincon2" onSubmit={this.onsubmitform}>
              <div className="logincon3">
                <img
                  src="https://res.cloudinary.com/dxbf8wo2m/image/upload/q_100/v1729163351/logo_qv7elu.png"
                  alt="website logo"
                  className="loginlogo"
                />
                <h1 className="logoheading">Insta Share</h1>
              </div>
              <div className="logincon4">
                <label htmlFor="username" className="loginlabel">
                  USERNAME
                </label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  id="username"
                  onChange={this.onchangeusername}
                  value={username}
                  className="logininput"
                />
              </div>
              <div className="logincon4">
                <label htmlFor="userid" className="loginlabel">
                  USERID
                </label>
                <input
                  type="text"
                  placeholder="Enter Userid"
                  id="userid"
                  onChange={this.onchangeuserid}
                  value={userid}
                  className="logininput"
                />
              </div>
              <div className="logincon4">
                <label htmlFor="userbio" className="loginlabel">
                  BIO
                </label>
                <input
                  type="text"
                  placeholder="Enter Bio"
                  id="userbio"
                  onChange={this.onchangeuserbio}
                  value={userbio}
                  className="logininput"
                />
              </div>
              {showerror && <p className="errormsg">{errormsg}</p>}
              <button type="submit" className="loginbutton">
                Create Profile
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
export default withNavigate(Createuserprofile)