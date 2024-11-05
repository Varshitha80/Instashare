import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link,Navigate,useNavigate} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showerror: false, errormsg: ''}

  onsubmitsucess = jwttoken => {
    Cookies.set('jwt_token', jwttoken, {expires: 30, path: '/'})
    this.checkuserprofile();
  }

  onsubmitfailure = errormsg => {
    this.setState({showerror: true, errormsg})
  }

  onchangepassword = event => {
    this.setState({password: event.target.value})
  }

  onchangeusername = event => {
    this.setState({username: event.target.value})
  }

  onsubmitform = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userdetails = {identifier:username, password}
    const url = '/api/login'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userdetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onsubmitsucess(data.jwt_token)
    } else {
      this.onsubmitfailure(data.message)
    }
  }

  checkuserprofile = async () => {
    const jwttoken = Cookies.get('jwt_token');
    const {navigate} = this.props
    const url = '/api/profile';
    const options = {
      method:'GET',
      headers:{
        'Authorization':`Bearer ${jwttoken}`,
      }
    };
    const response = await fetch(url,options);
    if(response.ok){
      navigate("/");
    }
    else{
      navigate('/create-user-profile')
    }
  }

  render() {
    const {username, password, showerror, errormsg} = this.state
    const jwttoken = Cookies.get('jwt_token')
    if (jwttoken !== undefined) {
      return <Navigate to="/" />
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
              placeholder="Enter Username or Email"
              id="username"
              onChange={this.onchangeusername}
              value={username}
              className="logininput"
            />
          </div>
          <div className="logincon4">
            <label htmlFor="password" className="loginlabel">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              id="password"
              onChange={this.onchangepassword}
              value={password}
              className="logininput"
            />
          </div>
          {showerror && <p className="errormsg">{errormsg}</p>}
          <button type="submit" className="loginbutton">
            Login
          </button>
          <div className='signupcon'>
            <p className='signuppara'>Don't have an account?</p>
            <Link to="/register" className='signuptext'>Sign up</Link>
          </div>
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

export default withNavigate(Login)
