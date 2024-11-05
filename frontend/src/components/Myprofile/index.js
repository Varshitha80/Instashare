import { Component } from 'react'
import { Rings } from 'react-loader-spinner'
import Cookies from 'js-cookie'
import { BsGrid3X3 } from 'react-icons/bs'
import { BiCamera } from 'react-icons/bi'
import { LiaEdit } from "react-icons/lia"
import { PiPlusThin } from "react-icons/pi"
import { Link } from 'react-router-dom'
import Popup from 'reactjs-popup'
import Header from '../Header'
import './index.css'

class Myprofile extends Component {
  state = {
    profiledata: {
      posts: [],
      stories: [],
    },
    isloading: true,
    profileerror: false,
  }

  componentDidMount() {
    this.getmyprofiledata()
  }

  getmyprofiledata = async () => {
    const jwttoken = Cookies.get('jwt_token')
    const url = '/api/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwttoken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updateddata = {
        userid: data.profile.user_id,
        username: data.profile.user_name,
        profilepic: data.profile.profile_pic,
        followerscount: data.profile.followers_count,
        followingcount: data.profile.following_count,
        userbio: data.profile.user_bio,
        posts: data.profile.posts.map(eachpost => ({
          postid: eachpost._id,
          postimageurl: eachpost.image,
        })),
        stories: data.profile.stories.map(eachstory => ({
          storyid: eachstory._id,
          storyimage: eachstory.image,
        })),
      }
      this.setState({ profiledata: updateddata, isloading: false })
    } else {
      this.setState({ profileerror: true, isloading: false })
    }
  }

  onclicktryagain = () => this.getmyprofiledata()

  renderloader = () => (
    <div className="loader-container" testid="loader">
      <Rings type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  rendermyprofile = () => {
    const { profiledata } = this.state
    const {
      userid,
      username,
      profilepic,
      followerscount,
      followingcount,
      userbio,
      posts,
      stories,
    } = profiledata

    return (
      <div className="usercon2">
        <div className='fullcon'>
          <div className="usercon3">
            <Popup
              trigger={<img src={profilepic} alt="my profile" className="userprofileimage" />}
              modal
              closeOnDocumentClick
              overlayClassName="popup-overlay"
              contentClassName="popup-content"
            >
              <img src={profilepic} alt="my profile" className="fullscreen-image" />
            </Popup>
            <div className="usercon4">
              <h1 className="usernameheading">{username}</h1>
              <div className="usercon3">
                <p className="usernamecounts">
                  {posts.length} <span className="spancounts">posts</span>
                </p>
                <p className="usernamecounts">
                  {followerscount} <span className="spancounts">followers</span>
                </p>
                <p className="usernamecounts">
                  {followingcount} <span className="spancounts">following</span>
                </p>
              </div>
              <p className="usernamecounts">{userid}</p>
              <p className="spancounts">{userbio}</p>
            </div>
          </div>
          <div className='editcon1'>
            <Link to="/update-profile" className='editicon'><LiaEdit size={28} /></Link>
          </div>
        </div>
        {stories.length === 0 ? (
          <div className='storyimagebackground'>
            <Link to="/update-story" className='editicon'><PiPlusThin size={30} /></Link>
          </div>
        ) : (
          <ul className="userlist usercon3 ulstory">
            {stories.map(eachstory => (
              <li key={eachstory.storyid}>
                <Popup
                  trigger={
                    <div className="storyimagebackground">
                      <img src={eachstory.storyimage} alt="my story" className="storyimage" />
                    </div>
                  }
                  modal
                  closeOnDocumentClick
                  overlayClassName="popup-overlay"
              contentClassName="popup-content"
                >
                  <img src={eachstory.storyimage} alt="my story" className="fullscreen-image" />
                </Popup>
              </li>
            ))}
            <li className='storyimagebackground'>
              <Link to="/update-story" className='editicon'><PiPlusThin size={30} /></Link>
            </li>
          </ul>
        )}
        <hr className='hr' />
        <div className='usercon7'>
          <div className="usercon3">
            <BsGrid3X3 size={24} />
            <h1 className="postsheading">Posts</h1>
          </div>
          {posts.length === 0 ? null : <Link to="/update-post" className='editicon'><PiPlusThin size={30} /></Link>}
        </div>
        {posts.length === 0 ? (
          <div className="usercon5 usercon6">
            <Link to="/update-post" className='editicon'><BiCamera size={48} /></Link>
            <h1 className="noposts">No Posts Yet</h1>
          </div>
        ) : (
          <ul className="userlist postslist">
            {posts.map(eachpost => (
              <li key={eachpost.postid}>
                <Popup
                  trigger={
                    <img src={eachpost.postimageurl} alt="my post" className="postsimage" />
                  }
                  modal
                  closeOnDocumentClick
                  overlayClassName="popup-overlay"
              contentClassName="popup-content"
                >
                  <img src={eachpost.postimageurl} alt="my post" className="fullscreen-image" />
                </Popup>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  renderfailure = () => (
    <div className="homecon3">
      <img
        src="https://res.cloudinary.com/dxbf8wo2m/image/upload/v1729412545/alert-triangle_f5lpx0.png"
        alt="failure view"
        className="errorimage"
      />
      <p className="errorheading">Something went wrong. Please try again</p>
      <button
        type="button"
        className="errorbutton"
        onClick={this.onclicktryagain}
      >
        Try again
      </button>
    </div>
  )

  render() {
    const { profileerror, isloading } = this.state
    const authbutton = profileerror ? this.renderfailure() : this.rendermyprofile()
    return (
      <div className="usercon1">
        <ul className="userlist">
          <Header />
        </ul>
        {isloading ? this.renderloader() : authbutton}
      </div>
    )
  }
}

export default Myprofile
