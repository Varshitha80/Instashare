import {Component} from 'react'
import Cookies from 'js-cookie'
import {Rings} from 'react-loader-spinner'
import Header from '../Header'
import Userstories from '../Userstories'
import Postsdetails from '../Postsdetails'
import './index.css'

class Home extends Component {
  state = {
    isloadinguserstories: true,
    userstorieslist: [],
    userstorieserror: false,
    postslist: [],
    postserror: false,
    isloadingposts: true,
    nosearchfound: false,
  }

  componentDidMount() {
    this.getuserstories()
    this.getpostslist()
  }

  getuserstories = async () => {
    const jwttoken = Cookies.get('jwt_token')
    const url = '/api/stories'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwttoken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedstories = data.stories.map(eachstory => ({
        userid: eachstory.user_id,
        username: eachstory.user_name,
        storyurl: eachstory.story_url,
      }))
      this.setState({
        userstorieslist: updatedstories,
        isloadinguserstories: false,
      })
    } else {
      this.setState({isloadinguserstories: false, userstorieserror: true})
    }
  }

  getpostslist = async () => {
    const jwttoken = Cookies.get('jwt_token')
    const url = '/api/posts'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwttoken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedposts = data.postsdata[0].posts.map(eachpost => ({
        postid: eachpost.post_id,
        userid: eachpost.user_id,
        username: eachpost.user_name,
        profilepic: eachpost.profile_pic,
        imageurl: eachpost.post_details.image_url,
        caption: eachpost.post_details.caption,
        likescount: eachpost.likes_count,
        createdat: eachpost.created_at,
        comments: eachpost.comments.map(eachcomment => ({
          commentusername: eachcomment.user_name,
          commentuserid: eachcomment.user_id,
          comment: eachcomment.comment,
        })),
      }))
      this.setState({
        isloadingposts: false,
        postslist: updatedposts,
      })
    } else {
      this.setState({isloadingposts: false, postserror: true})
    }
  }

  updatelike = async (postid, likestatus) => {
    const {postslist} = this.state
    const jwttoken = Cookies.get('jwt_token')
    const url = `/api/posts/${postid}/like`
    const userdetails = {like_status: likestatus}
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwttoken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userdetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    let updatedpostsdata = postslist
    updatedpostsdata = updatedpostsdata.map(each => {
      if (each.postid === postid && likestatus) {
        return {...each, message: data.message, likescount: each.likescount + 1}
      }
      if (each.postid === postid && !likestatus) {
        return {...each, message: data.message, likescount: each.likescount - 1}
      }
      return each
    })
    this.setState({postslist: updatedpostsdata})
  }

  onclicktryagain = () => {
    const {userstorieserror, postserror} = this.state
    if (userstorieserror) {
      this.getuserstories()
    } else if (postserror) {
      this.getpostslist()
    }
  }

  updatesearch = async searchvalue => {
    const jwttoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU"
    const url = `https://apis.ccbp.in/insta-share/posts?search=${searchvalue}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwttoken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedsearchposts = data.posts.map(eachpost => ({
        postid: eachpost.post_id,
        userid: eachpost.user_id,
        username: eachpost.user_name,
        profilepic: eachpost.profile_pic,
        imageurl: eachpost.post_details.image_url,
        caption: eachpost.post_details.caption,
        likescount: eachpost.likes_count,
        createdat: eachpost.created_at,
        comments: eachpost.comments.map(eachcomment => ({
          commentusername: eachcomment.user_name,
          commentuserid: eachcomment.user_id,
          comment: eachcomment.comment,
        })),
      }))
      if (updatedsearchposts.length !== 0) {
        this.setState({
          postslist: updatedsearchposts,
          nosearchfound: false,
          isloadingposts: false,
        })
      } else {
        this.setState({nosearchfound: true, isloadingposts: false})
      }
    } else {
      this.setState({isloadingposts: false, postserror: true})
    }
  }

  renderuserstories = () => {
    const {userstorieslist} = this.state
    return (
      <div className='homecon2'>
        <ul className='list'>
          <Userstories userstories={userstorieslist} />
        </ul>
      </div>
    )
  }

  renderposts = () => {
    const {postslist} = this.state
    return (
      <div className='homecon2'>
        <ul className='list'>
          {postslist.map(each => (
            <Postsdetails
              details={each}
              key={each.postid}
              updatelike={this.updatelike}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderfailure = () => (
    <div className='homecon3'>
      <img
        src='https://res.cloudinary.com/dxbf8wo2m/image/upload/v1729412545/alert-triangle_f5lpx0.png'
        alt='failure view'
        className='errorimage'
      />
      <p className='errorheading'>Something went wrong. Please try again</p>
      <button
        type='button'
        className='errorbutton'
        onClick={this.onclicktryagain}
      >
        Try again
      </button>
    </div>
  )

  renderloader = () => (
    <div className='loader-container homecon3' testid='loader'>
      <Rings type='TailSpin' color='#4094EF' height={50} width={50} />
    </div>
  )

  rendernosearch = () => (
    <div className='homecon4'>
      <img
        src='https://res.cloudinary.com/dxbf8wo2m/image/upload/v1729751401/Group_vjmiwz.png'
        alt='search not found'
        className='nosearchimage'
      />
      <h1 className='nosearchheading'>Search Not Found</h1>
      <p className='nosearchpara'>Try different keyword or search again</p>
    </div>
  )

  render() {
    const {
      isloadinguserstories,
      userstorieserror,
      isloadingposts,
      postserror,
      nosearchfound,
    } = this.state
    const authbutton1 = userstorieserror
      ? this.renderfailure()
      : this.renderuserstories()
    const authbutton2 = postserror ? this.renderfailure() : this.renderposts()
    const list1 = isloadinguserstories ? this.renderloader() : authbutton1
    const list2 = isloadingposts ? this.renderloader() : authbutton2
    return (
      <div className='homecon1'>
        <Header updatesearch={this.updatesearch} />
        {nosearchfound ? (
          this.rendernosearch()
        ) : (
          <>
            {list1} {list2}
          </>
        )}
      </div>
    )
  }
}

export default Home
