import {Component} from 'react'
import {Rings} from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'
import Popup from 'reactjs-popup'
import './index.css'
import { useParams } from 'react-router-dom'


const withRouter = (Component) => {
  const Wrapper = (props) => {
    const params = useParams();
    return <Component {...props} params={params} />
  }
  return Wrapper;
}
class Userprofile extends Component {
  state = {
    profiledata: {
      posts: [],
      stories: [],
    },
    isloading: true,
    profileerror: false,
  }

  componentDidMount() {
    this.getuserprofiledata()
  }

  getuserprofiledata = async () => {
    const {id} = this.props.params
    const jwttoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU"
    const url = `https://apis.ccbp.in/insta-share/users/${id}`
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
        id: data.user_details.id,
        userid: data.user_details.user_id,
        username: data.user_details.user_name,
        profilepic: data.user_details.profile_pic,
        followerscount: data.user_details.followers_count,
        followingcount: data.user_details.following_count,
        userbio: data.user_details.user_bio,
        postscount: data.user_details.posts_count,
        posts: data.user_details.posts.map(eachpost => ({
          postid: eachpost.id,
          postimageurl: eachpost.image,
        })),
        stories: data.user_details.stories.map(eachstory => ({
          storyid: eachstory.id,
          storyimage: eachstory.image,
        })),
      }
      this.setState({profiledata: updateddata, isloading: false})
    } else {
      this.setState({profileerror: true, isloading: false})
    }
  }

  onclicktryagain = () => this.getuserprofiledata()

  renderloader = () => (
    <div className="loader-container" testid="loader">
      <Rings type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderuserprofile = () => {
    const {profiledata} = this.state
    const {
      userid,
      username,
      profilepic,
      followerscount,
      followingcount,
      userbio,
      postscount,
      posts,
      stories,
    } = profiledata

    return (
      <div className="usercon2">
        <div className="usercon3">
          <Popup 
          trigger={<img src={profilepic}  alt="user profile"  className="userprofileimage" />}
          modal
          closeOnDocumentClick
          overlayClassName="popup-overlay"
          contentClassName="popup-content"
          >
            <img src={profilepic} alt="user profile" className="fullscreen-image"/>
          </Popup>
          <div className="usercon4">
            <h1 className="usernameheading">{username}</h1>
            <div className="usercon3">
              <p className="usernamecounts">
                {postscount} <span className="spancounts">posts</span>
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
        {stories.length === 0 ? null : (
          <ul className="userlist usercon3 ulstory">
            {stories.map(eachstory => (
              <li key={eachstory.storyid}>
                <Popup 
                trigger={
                <div className="storyimagebackground">
                  <img
                    src={eachstory.storyimage}
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
                <img src={eachstory.storyimage} alt="user story" className='fullscreen-image' />
              </Popup>
              </li>
            ))}
          </ul>
        )}
        <hr className='hr'/>
        <div className="usercon3">
          <BsGrid3X3 size={24} />
          <h1 className="postsheading">Posts</h1>
        </div>
        {posts.length === 0 ? (
          <div className="usercon5">
            <BiCamera size={48} className="icon" />
            <h1 className="noposts">No Posts Yet</h1>
          </div>
        ) : (
          <ul className="userlist postslist">
            {posts.map(eachpost => (
              <li key={eachpost.postid}>
                <Popup 
                trigger = {
                <img
                  src={eachpost.postimageurl}
                  alt="user post"
                  className="postsimage"
                />
                }
                modal
                closeOnDocumentClick
                 overlayClassName="popup-overlay"
              contentClassName="popup-content"
              >
                <img src={eachpost.postimageurl} alt="user post" className='funnscreen-image' />
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
    const {profileerror, isloading} = this.state
    const authbutton = profileerror
      ? this.renderfailure()
      : this.renderuserprofile()
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

export default withRouter(Userprofile)
