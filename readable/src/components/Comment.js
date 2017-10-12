import React, { Component } from 'react'
import { decreaseComments, voteCommentUpAsynch, voteCommentDownAsynch, deleteCommentAsynch, editCommentAsynch } from '../actions'
import { connect } from 'react-redux'
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

class Comment extends Component {
  state = {
    visibility: 'hidden',
    commentBody: '',
    commentAuthor: '',
    editCommentModalOpen: false,
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

  handleVoteUp = (id, voteScore) => {
    this.props.dispatch(voteCommentUpAsynch(id, voteScore))
  }

  handleVoteDown = (id, voteScore) => {
    this.props.dispatch(voteCommentDownAsynch(id, voteScore))
  }

  handleDeleteComment = () => {
    const id = this.props.id
    const parentId = this.props.parentId
    const oldNumberOfComments = this.props.posts.posts[parentId].numberOfComments
    this.props.dispatch(deleteCommentAsynch(id))
    this.props.dispatch(decreaseComments({ id: parentId, numberOfComments: oldNumberOfComments }))
  }

  handleCommentBody = (e) => {
    e.preventDefault()
    this.setState({ commentBody: e.target.value })
  }

  openEditCommentModal = () => this.setState(() => ({ editCommentModalOpen: true }))
  closeEditCommentModal = () => this.setState(() => ({ editCommentModalOpen: false, visibility: 'hidden' }))

  handleEditComment = () => {
    this.setState({ commentAuthor: this.props.author, commentBody: this.props.body, editCommentModalOpen: true })
  }

  submitEditedComment = () => {
    const id = this.props.id
    const { commentBody } = this.state
    this.props.dispatch(editCommentAsynch(id, Date.now(), commentBody))
    this.closeEditCommentModal()
  }

  checkCommentFields = () => {
    if ( this.state.commentBody === '') {
      this.setState({ visibility: '' })
    }else {
      this.submitEditedComment()
    }
  }

  render () {
    const { id, timestamp, body, author, voteScore } = this.props
    const { visibility, editCommentModalOpen } = this.state
    return (
      <div className='w3-bar w3-row'>
        <div className='w3-col w3-right' style={{width: 30}}>
          <button
            onClick={() => this.handleVoteUp(id, voteScore)}
            className='fa fa-arrow-up'
            style={{cursor: 'pointer'}}>
          </button>
            {voteScore}
          <button
            onClick={() => this.handleVoteDown(id, voteScore)}
            className='fa fa-arrow-down'
            style={{cursor: 'pointer'}}>
          </button>
        </div>
        <div className='w3-rest'>
          <p>
            {author} Commented {this.calculateRoundTime(timestamp)} ago
          </p>
          <div className='w3-margin-top'>
            <p className='w3-large'>
              {body}
            </p>
            <div className='w3-margin-top'>
            </div>
            <div className='w3-right'>
              <button
                onClick={() => this.handleEditComment()}
                style={{cursor: 'pointer'}}>
                  Edit
              </button>
              <span> | </span>
              <button
                onClick={() => this.handleDeleteComment()}
                style={{cursor: 'pointer'}}>
                  Delete
              </button>
            </div>
          </div>
        </div>
        <Modal
        className='modal'
        overlayClassName='overlay'
        isOpen={editCommentModalOpen}
        onRequestClose={this.closeEditCommentModal}
        contentLabel='Modal'
        style={customStyles}>
          <form className='w3-container'>
            <div className='w3-section'>
              <b><h3>YOU CAN EDIT ONLY THE BODY</h3></b>
              <label>
                <b>Author of the comment</b>
              </label>
              <input
                className='w3-input w3-border w3-margin-bottom'
                type='text'
                value={this.state.commentAuthor}
                readOnly>
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
              onClick={() => this.closeEditCommentModal()}
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
          <span style={{visibility: visibility, color: 'red' }}> Please fill all the fields </span>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps ({ posts }) {
  return {
    posts: posts
  }
}

export default connect(
  mapStateToProps,
)(Comment)
