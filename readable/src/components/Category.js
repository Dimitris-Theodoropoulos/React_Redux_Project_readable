import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changeCategoryFocus } from '../actions'
import { Link } from 'react-router-dom'

class Category extends Component {

  toggleClass = () => {
    if (this.props.focus.focus === this.props.name) {
      return 'w3-bar-item w3-button w3-blue'
    }else {
      return 'w3-bar-item w3-button'
    }
  }

  render() {
    return (
      <div>
        <Link
          to={this.props.name}
          onClick={() => this.props.dispatch(changeCategoryFocus(this.props.name))}
          className={this.toggleClass()}>
            {this.props.name}
        </Link>
      </div>
    )
  }
}

function mapStateToProps ({ state, posts, changeCategoryFocus }) {
  return {
      state: state,
      posts: Object.keys(posts).map(key => posts[key]),
      focus: changeCategoryFocus,
  }
}

export default connect(
  mapStateToProps,
)(Category)
