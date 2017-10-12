import React, { Component } from 'react';
import { connect } from 'react-redux'
import { changeCategoryFocus, sortPostsByAction, getAllCategories, getAllPosts, getAllComments, addNewPostAsynch, setNumberOfCommentsAsynch } from '../actions'
import Category from './Category'
import Post from './Post'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'

const customStyles = {
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 250,
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

class App extends Component {
  state = {
    addPostModalOpen: false,
    postTitle: '',
    postBody: '',
    postCategory: '',
    postAuthor: '',
    visibility: 'hidden'
  }

  componentWillMount () {
    this.props.dispatch(getAllCategories())
    this.props.dispatch(getAllPosts())
    this.props.dispatch(getAllComments())
    this.props.dispatch(setNumberOfCommentsAsynch())
    this.props.dispatch(changeCategoryFocus(this.props.focus))
  }

  toggleClass = () => {
    if (this.props.changeCategoryFocus.focus === '') {
      return 'w3-bar-item w3-button w3-blue'
    }else {
      return 'w3-bar-item w3-button'
    }
  }

  handleSortByVote = () => {
    this.props.dispatch(sortPostsByAction({ sortType: 'votes' }))
  }

  handleSortByTime = () => {
    this.props.dispatch(sortPostsByAction({ sortType: 'time' }))
  }

  openAddPostModal = () => this.setState(() => ({ addPostModalOpen: true }))
  closeAddPostModal = () => this.setState(() => ({ addPostModalOpen: false, visibility: 'hidden' }))

  handleTitleChange = (e) => {
    this.setState({ postTitle: e.target.value })
  }

  handleBodyChange = (e) => {
    this.setState({ postBody: e.target.value })
  }

  handleCategoryChange = (e) => {
    this.setState({ postCategory: e.target.value })
  }

  handleAuthorChange = (e) => {
    this.setState({ postAuthor: e.target.value })
  }

  generateId = () => {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
    })
  }

  submitNewPost = () => {
    const id = this.generateId()
    const timestamp = Date.now()
    const { postTitle, postBody, postCategory, postAuthor } = this.state
    this.props.dispatch(addNewPostAsynch(id, timestamp, postTitle, postBody, postCategory, postAuthor))
    this.closeAddPostModal()
    this.setState({
      postTitle: '',
      postBody: '',
      postCategory: '',
      postAuthor: '',
    })
  }

  checkFields = () => {
    if (this.state.postTitle === '' || this.state.postBody === '' || this.state.postCategory === '' || this.state.postAuthor === '') {
      this.setState({ visibility: '' })
    }else {
      this.submitNewPost()
    }
  }

  render() {
    const { addPostModalOpen, visibility } = this.state
    return (
      <div>
        <div className='w3-container'>
          <div className='w3-bar w3-black'>
            <Link
              to='/'
              onClick={() => this.props.dispatch(changeCategoryFocus(''))}
              className={this.toggleClass()}>
                ALL POSTS
           </Link>
            {this.props.categories.map(category =>
              <Category
                name={category.name}
                key={category.name}/>
            )}
          </div>
        </div>
        <div className='w3-container'>
          <br />
          <div className='w3-dropdown-hover w3-margin-right'>
            <button
              className='w3-button w3-black'>
                SORT BY
            </button>
            <div className='w3-dropdown-content w3-bar-block w3-border'>
              <button
                onClick={this.handleSortByVote}
                className='w3-bar-item w3-button'>
                  Number of Votes
              </button>
              <button
                onClick={this.handleSortByTime}
                className='w3-bar-item w3-button'>
                  Date Submitted
              </button>
            </div>
          </div>
          <button
            onClick={this.openAddPostModal}
            className='w3-button w3-green'>
              Submit new post
          </button>
          <br />
          <br />
          <br />
          {
            this.props.posts.sortPostsBy === 'normal' &&
            this.props.sortedPostsByVotes.filter(post => (post.category === this.props.focus || this.props.focus === '') && !post.deleted).map(post => (
              <Post
                key={post.id}
                id={post.id}
                votes={post.voteScore}
                posted={post.timestamp}
                title={post.title}
                author={post.author}
                category={post.category}
                body={post.body}
                numberOfComments={post.numberOfComments}
              />
            ))
          }
          {
            this.props.posts.sortPostsBy === 'votes' &&
            this.props.sortedPostsByVotes.filter(post => (post.category === this.props.focus || this.props.focus === '') && !post.deleted).map(post => (
              <Post
                key={post.id}
                id={post.id}
                votes={post.voteScore}
                posted={post.timestamp}
                title={post.title}
                author={post.author}
                category={post.category}
                body={post.body}
                numberOfComments={post.numberOfComments}
              />
            ))
          }
          {
            this.props.posts.sortPostsBy === 'time' &&
            this.props.sortedPostsByTime.filter(post => (post.category === this.props.focus || this.props.focus === '') && !post.deleted).map(post => (
              <Post
                key={post.id}
                id={post.id}
                votes={post.voteScore}
                posted={post.timestamp}
                title={post.title}
                author={post.author}
                category={post.category}
                body={post.body}
                numberOfComments={post.numberOfComments}
              />
            ))
          }
        </div>
        <Modal
          className='modal'
          overlayClassName='overlay'
          isOpen={addPostModalOpen}
          onRequestClose={this.closeAddPostModal}
          contentLabel='Modal'
          style={customStyles}
        >
          <form className='w3-container'>
            <div className='w3-section'>
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
              <select className='w3-select w3-border w3-margin-bottom'
                      value={this.state.postCategory}
                      onChange={this.handleCategoryChange}>
                <option value='' disabled>Post Category</option>
                <option value='react'>react</option>
                <option value='redux'>redux</option>
                <option value='udacity'>udacity</option>
              </select>
              <label>
                <b>Author of the post</b>
              </label>
              <input
                className='w3-input w3-border w3-margin-bottom'
                type='text'
                placeholder='Enter author'
                value={this.state.postAuthor}
                onChange={this.handleAuthorChange}
              />
            </div>
          </form>
          <div className='w3-container w3-border-top w3-padding-16 w3-light-grey'>
            <button
              type='button'
              onClick={this.closeAddPostModal}
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

function mapStateToProps ({ categories, posts, changeCategoryFocus, comments }) {
  const postsArray = Object.keys(posts.posts).map(key => posts.posts[key])
  const categoriesArray = Object.keys(categories).map(key => categories[key])
  const sortPostsByTime = postsArray.slice(0)
  const sortPostsByVotes = postsArray.slice(0)
  const sortedPostsByVotes = sortPostsByVotes.sort((a, b) => b.voteScore - a.voteScore)
  const sortedPostsByTime = sortPostsByTime.sort((a, b) => b.timestamp - a.timestamp)

  return {
      categories: categoriesArray,
      posts: { sortPostsBy: posts.sortPostsBy, posts: postsArray, },
      changeCategoryFocus,
      sortedPostsByVotes: sortedPostsByVotes,
      sortedPostsByTime: sortedPostsByTime,
      comments: Object.keys(comments.comments).map(key => comments.comments[key]),
  }
}

export default connect(
  mapStateToProps,
)(App)
