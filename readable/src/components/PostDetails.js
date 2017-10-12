import React, { Component } from 'react'
import Comment from './Comment'
import { connect } from 'react-redux'
import { sortCommentsByAction, increaseComments, getPostComments, addCommentAsynch, votePostUpAsynch, votePostDownAsynch, deletePostAsynch, editPostAsynch } from '../actions'
import Modal from 'react-modal'

const customStyles = {
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 200,
    backgroundColor   : 'rgba(255, 255, 255, 0.75)'
  },
  content : {
    position                   : 'absolute',
    top                        : '40px',
    left                       : '40px',
    right                      : '40px',
    bottom                     : '40px',
    border                     : '1px solid #ccc',
    background                 : '#fff',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '20px'
  }
}

class PostDetails extends Component {
  state = {
    visibility: 'hidden',
    postTitle: '',
    postBody: '',
    postCategory: '',
    postAuthor: '',
    editPostModalOpen: false,
    addCommentModalOpen: false,
    commentBody: '',
    commentAuthor: '',
    commentModalVisibility: 'hidden',
  }

  componentWillMount () {
    const postId = window.location.pathname.split('/')[2]
    this.props.dispatch(getPostComments(postId))
  }

  calculateRoundTime = (posted) => {
    const hours = Math.round((Date.now() - posted) / 3600000)
    if (Math.round(hours / 24 / 30 / 12) > 1) {
      return `${Math.round(hours / 24 / 30 / 12)} years`
    }else if (Math.round(hours / 24 / 30) > 1) {
      return `${Math.round(hours / 24 / 30)} months`
    }else if (Math.round(hours / 24) > 1) {
      return `${Math.round(hours / 24)} days`
    }else {
      return `${hours} hours`
    }
  }

  handleVotePostUp = (id, voteScore) => {
    this.props.dispatch(votePostUpAsynch(id, voteScore))
  }

  handleVotePostDown = (id, voteScore) => {
    this.props.dispatch(votePostDownAsynch(id, voteScore))
  }

  handleDeletePost = (id) => {
    this.props.dispatch(deletePostAsynch(id))
  }

  openEditPostModal = () => this.setState(() => ({ editPostModalOpen: true }))
  closeEditPostModal = () => this.setState(() => ({ editPostModalOpen: false, visibility: 'hidden' }))

  openAddCommentModal = () => this.setState(() => ({ addCommentModalOpen: true }))
  closeAddCommentModal = () => this.setState(() => ({ addCommentModalOpen: false, commentModalVisibility: 'hidden' }))

  handleEditPost = () => {
    const id = this.props.posts.clickedPostId
    let {  title, body, category, author } = this.props.posts.posts[id]
    this.setState({ postTitle: title, postBody: body, postCategory: category, postAuthor: author, editPostModalOpen: true })
  }

  handleTitleChange = (e) => {
    e.preventDefault()
    this.setState({ postTitle: e.target.value })
  }

  handleBodyChange = (e) => {
    e.preventDefault()
    this.setState({ postBody: e.target.value })
  }

  submitEditedPost = () => {
    const id = this.props.posts.clickedPostId
    const { postTitle, postBody } = this.state
    this.props.dispatch(editPostAsynch(id, postTitle, postBody))
    this.closeEditPostModal()
  }

  checkFields = () => {
    if (this.state.postTitle === '' || this.state.postBody === '') {
      this.setState({ visibility: '' })
    }else {
      this.submitEditedPost()
    }
  }

  checkCommentFields = () => {
    if (this.state.commentAuthor === '' || this.state.commentBody === '') {
      this.setState({ commentModalVisibility: '' })
    }else {
      this.submitComment()
    }
  }

  generateId = () => {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
    })
  }

  submitComment = () => {
    const id = this.generateId()
    const timestamp = Date.now()
    const { commentAuthor, commentBody } = this.state
    const parentId = this.props.posts.clickedPostId
    const oldNumberOfComments = this.props.posts.posts[parentId].numberOfComments
    this.props.dispatch(addCommentAsynch(id, timestamp, commentBody, commentAuthor, parentId))
    this.props.dispatch(increaseComments({ id: parentId, numberOfComments: oldNumberOfComments }))
    this.closeAddCommentModal()
    this.setState({
      commentBody: '',
      commentAuthor: '',
      commentModalVisibility: 'hidden',
    })
  }

  sortCommentsByVotes = () => {
    this.props.dispatch(sortCommentsByAction({ sortType: 'votes' }))
  }

  sortCommentsByTime = () => {
    this.props.dispatch(sortCommentsByAction({ sortType: 'time' }))
  }

  handleNewComment = () => {
    this.setState({ addCommentModalOpen: true })
  }

  handleCommentBody = (e) => {
    e.preventDefault()
    this.setState({ commentBody: e.target.value })
  }

  handleCommentAuthor = (e) => {
    e.preventDefault()
    this.setState({ commentAuthor: e.target.value })
  }

  handleBackToHome = () => {
    this.props.history.push('/')
  }

  render () {
    const { editPostModalOpen, visibility, addCommentModalOpen, commentModalVisibility } = this.state
    if (this.props.posts.rehydrated === true) {
      const id = this.props.posts.clickedPostId
      const { author, timestamp, body, title, voteScore, deleted } = this.props.posts.posts[id]
      if (deleted) {
        return (
          <div>
            <span style={{ color: 'red', fontSize: 26 }}>Post is deleted</span>
            <br />
            <button
              onClick={() => this.handleBackToHome()}
              className='w3-button w3-small w3-green'>
              BACK TO HOME PAGE
            </button>
          </div>
        )
      }
      return (
        <div>
          <div className='w3-container'>
            <div className='panel'>
              <div className='w3-col w3-padding-right w3-margin-right' style={{width: 30}}>
                <button
                  onClick={() => this.handleVotePostUp(id, voteScore)}
                  className="fa fa-arrow-up"
                  style={{cursor: 'pointer'}}>
                </button>
                <div>
                  {voteScore}
                </div>
                <button
                  onClick={() => this.handleVotePostDown(id, voteScore)}
                  className='fa fa-arrow-down'
                  style={{cursor: 'pointer'}}>
                </button>
              </div>
              <h2>{title}</h2>
              <span>{`Submitted ${this.calculateRoundTime(timestamp)} ago by ${author}`}</span>
              <br />
            </div>
            <div className='w3-panel w3-margin-left w3-border w3-round w3-light-gray'>
              <p className='w3-large'>
                {body}
              </p>
            </div>
            <div className='w3-panel'>
              <button
                onClick={() => this.handleEditPost()}
                style={{cursor: 'pointer'}}>
                  Edit
              </button>
              <span> | </span>
              <button
                onClick={() => this.handleDeletePost(id)}
                style={{cursor: 'pointer'}}>
                  Delete
              </button>
            </div>
            <button
              onClick={() => this.handleBackToHome()}
              className='w3-button w3-small w3-green'>
              BACK TO HOME PAGE
            </button>
            <br />
            <div className='w3-container'>
              <div className='panel'>
                <span className='margin-right w3-large'><h3>{this.props.posts.posts[id].numberOfComments} COMMENTS</h3></span>
                <span className='w3-dropdown-hover w3-margin-left w3-margin-right'>
                  <button
                    className='w3-button w3-small w3-black'>
                      SORT BY
                  </button>
                  <div className='w3-dropdown-content w3-bar-block w3-border'>
                    <button
                      onClick={() => this.sortCommentsByVotes()}
                      className='w3-bar-item w3-button w3-small'>
                        Number of Votes
                    </button>
                    <button
                      onClick={() => this.sortCommentsByTime()}
                      className='w3-bar-item w3-button w3-small'>
                        Date Submitted
                    </button>
                  </div>
                </span>
                <button
                  onClick={() => this.handleNewComment()}
                  className='w3-button w3-small w3-green'>
                  NEW COMMENT
                </button>
              </div>
              <hr />
              <div className='w3-modal'>
                <div className='w3-modal-content w3-card-4 w3-animate-zoom' style={{maxWidth: 600}}>
                  <div className='w3-center'>
                    <span className='w3-xlarge'>New comment</span>
                    <br />
                    <span className='w3-button w3-xlarge w3-hover-red w3-display-topright' title='Close Modal'>×</span>
                  </div>
                </div>
              </div>
              <ul className='w3-ul w3-border'>
                {
                  this.props.comments.sortCommentsBy === 'normal' &&
                  this.props.sortedCommentsByVotes.filter(comment => !comment.deleted && comment.parentId === id).map(comment => (
                    <li
                      key={comment.id}
                      className='w3-bar w3-row'>
                      <Comment
                        id={comment.id}
                        parentId={comment.parentId}
                        timestamp={comment.timestamp}
                        body={comment.body}
                        author={comment.author}
                        voteScore={comment.voteScore}
                        deleted={comment.deleted}
                        parentDeleted={comment.parentDeleted}
                      />
                    </li>
                  ))
                }
                {
                  this.props.comments.sortCommentsBy === 'votes' &&
                  this.props.sortedCommentsByVotes.filter(comment => !comment.deleted && comment.parentId === id).map(comment => (
                    <li
                      key={comment.id}
                      className='w3-bar w3-row'>
                      <Comment
                        id={comment.id}
                        parentId={comment.parentId}
                        timestamp={comment.timestamp}
                        body={comment.body}
                        author={comment.author}
                        voteScore={comment.voteScore}
                        deleted={comment.deleted}
                        parentDeleted={comment.parentDeleted}
                      />
                    </li>
                  ))
                }
                {
                  this.props.comments.sortCommentsBy === 'time' &&
                  this.props.sortedCommentsByTime.filter(comment => !comment.deleted && comment.parentId === id).map(comment => (
                    <li
                      key={comment.id}
                      className='w3-bar w3-row'>
                      <Comment
                        id={comment.id}
                        parentId={comment.parentId}
                        timestamp={comment.timestamp}
                        body={comment.body}
                        author={comment.author}
                        voteScore={comment.voteScore}
                        deleted={comment.deleted}
                        parentDeleted={comment.parentDeleted}
                      />
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
          <Modal
            className='modal'
            overlayClassName='overlay'
            isOpen={editPostModalOpen}
            onRequestClose={this.closeEditPostModal}
            contentLabel='Modal'
            style={customStyles}
          >
            <form className='w3-container'>
              <div className='w3-section'>
                <b><h3>YOU CAN EDIT ONLY THE TITLE AND THE BODY</h3></b>
                <label>
                  <b>Title of the post</b>
                </label>
                <input
                  className='w3-input w3-border w3-margin-bottom'
                  type='text'
                  placeholder='Enter title'
                  value={this.state.postTitle}
                  onChange={this.handleTitleChange}
                />
                <label>
                  <b>Body of the post</b>
                </label>
                <textarea
                  rows={4}
                  cols={50}
                  className='w3-input w3-border'
                  type='text'
                  placeholder='Enter body'
                  value={this.state.postBody}
                  onChange={this.handleBodyChange}
                />
                <label>
                  <b>Category that the post belongs to</b>
                </label>
                <input
                  className='w3-input w3-border w3-margin-bottom'
                  type='text'
                  placeholder='Enter category'
                  value={this.state.postCategory}
                  readOnly
                />
                <label>
                  <b>Author of the post</b>
                </label>
                <input
                  className='w3-input w3-border w3-margin-bottom'
                  type='text'
                  placeholder='Enter author'
                  value={this.state.postAuthor}
                  readOnly
                />
              </div>
            </form>
            <div className='w3-container w3-border-top w3-padding-16 w3-light-grey'>
              <button
                type='button'
                onClick={() => this.closeEditPostModal()}
                className='w3-button w3-red w3-margin-left w3-right'>
                  Cancel
              </button>
              <button
                type='submit'
                onClick={() => this.checkFields()}
                className='w3-button w3-green w3-right'>
                  Submit
              </button>
            </div>
            <span style={{visibility: visibility, color: 'red' }}> Please fill all the fields </span>
          </Modal>
          <Modal
          className='modal'
          overlayClassName='overlay'
          isOpen={addCommentModalOpen}
          onRequestClose={this.closeAddCommentModal}
          contentLabel='Modal'
          style={customStyles}>
            <form className='w3-container'>
              <div className='w3-section'>
                <label>
                  <b>Author of the comment</b>
                </label>
                <input
                  className='w3-input w3-border w3-margin-bottom'
                  type='text'
                  placeholder='Enter the Author of the comment'
                  value={this.state.commentAuthor}
                  onChange={this.handleCommentAuthor}>
                </input>
                <label>
                  <b>Body of the comment</b>
                </label>
                <textarea
                  rows={4}
                  cols={50}
                  className='w3-input w3-border'
                  placeholder='Enter comment body here'
                  value={this.state.commentBody}
                  onChange={this.handleCommentBody}>
                </textarea>
              </div>
            </form>
            <div className='w3-container w3-border-top w3-padding-16 w3-light-grey'>
              <button
                type='button'
                onClick={() => this.closeAddCommentModal()}
                className='w3-button w3-red w3-margin-left w3-right'>
                  Cancel
              </button>
              <button
                onClick={() => this.checkCommentFields()}
                className='w3-button w3-green w3-right'
                type='submit'>
                  Submit
              </button>
            </div>
            <span style={{visibility: commentModalVisibility, color: 'red' }}> Please fill all the fields </span>
          </Modal>
        </div>
      )
    }else {
      return (
        <div>Loading...</div>
      )
    }
  }
}

function mapStateToProps ({ posts, comments }) {
  const commentsArray = Object.keys(comments.comments).map(key => comments.comments[key])
  const sortCommentsByTime = commentsArray.slice(0)
  const sortCommentsByVotes = commentsArray.slice(0)
  const sortedCommentsByVotes = sortCommentsByVotes.sort((a, b) => b.voteScore - a.voteScore)
  const sortedCommentsByTime = sortCommentsByTime.sort((a, b) => b.timestamp - a.timestamp)

  return {
    posts: posts,
    comments: { sortCommentsBy: comments.sortCommentsBy, comments: commentsArray, },
    sortedCommentsByVotes: sortedCommentsByVotes,
    sortedCommentsByTime: sortedCommentsByTime,
  }
}

export default connect(
  mapStateToProps,
)(PostDetails)
