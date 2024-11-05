import {Link} from 'react-router-dom'
import {FcLike} from 'react-icons/fc'
import {BsHeart} from 'react-icons/bs'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'

import './index.css'

const Postsdetails = props => {
  const {details, updatelike} = props
  const {
    postid,
    userid,
    username,
    profilepic,
    imageurl,
    caption,
    likescount,
    createdat,
    comments,
    message,
  } = details

  const isliked = message === 'Post has been liked'

  const onclickheart = () => {
    updatelike(postid, true)
  }
  const onclickfclike = () => {
    updatelike(postid, false)
  }

  return (
    <li className="postcon">
      <div className="buttoncon1">
        <div className='userprofilecon'>
        <div className="imagebackground">
          <img
            src={profilepic}
            alt="post author profile"
            className="userprofile"
          />
        </div>
        <Link to={`/users/${userid}`} className="linkedtext">
          <p className="username">{username}</p>
        </Link>
        </div>
        <button type="button" className='followbutton'>Follow</button>
      </div>
      <img src={imageurl} alt="post" className="postimage" />
      <div className="downcon">
        <div className="likecon">
          {isliked ? (
            <button
              type="button"
              testid="unLikeIcon"
              className="likebutton"
              onClick={onclickfclike}
            >
              <FcLike size={24} />
            </button>
          ) : (
            <button
              type="button"
              testid="likeIcon"
              className="likebutton"
              onClick={onclickheart}
            >
              <BsHeart size={20} />
            </button>
          )}
          <button type="button" className="likebutton">
            <FaRegComment size={19.23} />
          </button>
          <button type="button" className="likebutton">
            <BiShareAlt size={24} />
          </button>
        </div>
        <p className="likescount">{likescount} likes</p>
        <p className="caption">{caption}</p>
        {comments.map(comment => (
          <div key={comment.commentuserid}>
            <p className="commentusername">
              {comment.commentusername}
              <span className="commentusernamespan"> {comment.comment}</span>
            </p>
          </div>
        ))}
        <p className="createdat">{createdat}</p>
      </div>
    </li>
  )
}

export default Postsdetails
