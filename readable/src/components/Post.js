import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clickedPostId, votePostUpAsynch, votePostDownAsynch, deletePostAsynch, editPostAsynch } from '../actions'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'

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

class Post extends Component {
  state = {
    visibility: 'hidden',
    postTitle: '',
    postBody: '',
    postCategory: '',
    postAuthor: '',
    editPostModalOpen: false,
  }

  calculateRoundTime = () => {
    const { posted } = this.props
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

  handleClickVoteUp = (e) => {
    e.preventDefault()
    const { id, votes } = this.props
    this.props.dispatch(votePostUpAsynch(id, votes))
  }

  handleClickVoteDown = (e) => {
    e.preventDefault()
    const { id, votes } = this.props
    this.props.dispatch(votePostDownAsynch(id, votes))
  }

  handleDeletePost = (e) => {
    e.preventDefault()
    const id = this.props.id
    this.props.dispatch(deletePostAsynch(id))
  }

  handleEditPost = (e)  => {
    e.preventDefault()
    let title = this.props.title
    let body = this.props.body
    let category = this.props.category
    let author = this.props.author
    this.setState({ postTitle: title, postBody: body, postCategory: category, postAuthor: author, editPostModalOpen: true })
  }

  submitEditedPost = () => {
    const id = this.props.id
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

  handleTitleChange = (e) => {
    e.preventDefault()
    this.setState({ postTitle: e.target.value })
  }

  handleBodyChange = (e) => {
    e.preventDefault()
    this.setState({ postBody: e.target.value })
  }

  openEditPostModal = () => this.setState(() => ({ editPostModalOpen: true }))
  closeEditPostModal = () => this.setState(() => ({ editPostModalOpen: false, visibility: 'hidden' }))

  render() {
    const { editPostModalOpen, visibility } = this.state
    const link = `/${this.props.category}/`.concat(this.props.id)

    return (
      <div className='w3-ul w3-card-4'>
        <div className='w3-bar w3-row'>
          <div className='w3-col' style={{width: 25}}>
            <button
              onClick={this.handleClickVoteUp}
              className='fa fa-arrow-up'
              style={{cursor: 'pointer'}}>
            </button>
            <div>
              {this.props.votes}
            </div>
            <button
              onClick={this.handleClickVoteDown}
              className='fa fa-arrow-down'
              style={{cursor: 'pointer'}}>
            </button>
          </div>
          <div className='w3-rest'>
            <div className='w3-bar-item'>
              <Link
                to={link}
                onClick={() => this.props.dispatch(clickedPostId({ id: this.props.id }))}>
                <b><span className='w3-large'>{this.props.title}</span></b>
              </Link>
              <br />
              <br />
              <span>Submitted by <span>{this.props.author} </span>{this.calculateRoundTime()} ago </span>
              <span> | </span>
              <span>{this.props.numberOfComments} Comments </span>
              <span> | </span>
              <button
                onClick={this.handleEditPost}
                style={{cursor: 'pointer'}}>
                  Edit
              </button>
              <span> | </span>
              <button
                onClick={this.handleDeletePost}
                style={{cursor: 'pointer'}}>
                  Delete
              </button>
            </div>
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
              onClick={this.closeEditPostModal}
              className='w3-button w3-red w3-margin-left w3-right'>
                Cancel
            </button>
            <button
              type='submit'
              onClick={this.checkFields}
              className='w3-button w3-green w3-right'>
                Submit
            </button>
          </div>
          <span style={{visibility: visibility, color: 'red' }}> Please fill all the fields </span>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps ({ posts, comments }) {
  const postsArray = Object.keys(posts.posts).map(key => posts.posts[key])
  const commentsArray = Object.keys(comments.comments).map(key => comments.comments[key])

  return {
      posts: { sortPostsBy: posts.sortPostsBy, posts: postsArray, },
      comments: commentsArray,
  }
}

export default connect(
  mapStateToProps,
)(Post)
