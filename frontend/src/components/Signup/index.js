import {Component} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import './index.css'

class Signup extends Component {
  state = {username: '', password: '',email:'', showerror: false, errormsg: ''}

  onsubmitsucess = () => {
    const {navigate} = this.props
    navigate("/login")
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

  onchangeemail = event => {
    this.setState({email:event.target.value})
  } 
  

  onsubmitform = async event => {
    event.preventDefault()
    const {username, password,email} = this.state
    const userdetails = {username,email, password}
    const url = '/api/register'
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
      this.onsubmitsucess()
    } else {
      this.onsubmitfailure(data.message)
    }
  }

  render() {
    const {username, password,email, showerror, errormsg} = this.state
    return (
      <div className="logincon1">
        <div>
          <img
            src="https://res.cloudinary.com/dxbf8wo2m/image/upload/q_auto:best/v1729164693/Illustration_tf47px.png"
            alt="website login"
            className="landingimage"
          />
        </div>
        <form className="signupcon2" onSubmit={this.onsubmitform}>
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
            <label htmlFor="email" className="loginlabel">
              EMAIL
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              id="email"
              onChange={this.onchangeemail}
              value={email}
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
            Signup
          </button>
          <div className='signupcon'>
            <p className='signuppara'>Already have an account?</p>
            <Link to="/login" className='signuptext'>Login</Link>
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

export default withNavigate(Signup)
