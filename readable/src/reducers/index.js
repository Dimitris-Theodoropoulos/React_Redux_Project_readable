import { combineReducers } from 'redux'
import { REHYDRATE } from 'redux-persist/constants'

import {
  ADD_CATEGORY,
  ADD_POST,
  CHANGE_CATEGORY_FOCUS,
  VOTE_POST_UP_ACTION,
  VOTE_POST_DOWN_ACTION,
  SORT_POSTS_BY_ACTION,
  DELETE_POST,
  EDIT_POST_ACTION,
  CLICKED_POST_ID,
  ADD_COMMENT,
  SORT_COMMENTS_BY_ACTION,
  VOTE_COMMENT_UP_ACTION,
  VOTE_COMMENT_DOWN_ACTION,
  EDIT_COMMENT_ACTION,
  DELETE_COMMENT_ACTION,
  INCREASE_COMMENTS,
  DECREASE_COMMENTS,
  SET_NUMBER_OF_COMMENTS,
  SET_PARENT_DELETED,
} from '../actions'

function comments (state = { sortCommentsBy: 'normal', comments }, action) {
  const { id, parentId, timestamp, body, author, voteScore, deleted, parentDeleted, sortType } = action
  switch (action.type) {
    case ADD_COMMENT :
      return {
        ...state,
        comments: {
          ...state.comments,
          [id]: {
            id,
            parentId,
            timestamp,
            body,
            author,
            voteScore,
            deleted,
            parentDeleted,
          }
        }
      }
    case SORT_COMMENTS_BY_ACTION :
      return {
        ...state,
        sortCommentsBy: sortType,
      }
    case VOTE_COMMENT_UP_ACTION :
      const newVoteUp = voteScore + 1
      return {
        ...state,
        comments: {
          ...state.comments,
          [id]: {
            ...state.comments[id],
            voteScore: newVoteUp,
          }
        }
      }
    case VOTE_COMMENT_DOWN_ACTION :
        const newVoteDown = voteScore - 1
        return {
          ...state,
          comments: {
            ...state.comments,
            [id]: {
              ...state.comments[id],
              voteScore: newVoteDown,
            }
          }
        }
    case EDIT_COMMENT_ACTION :
      return {
        ...state,
        comments: {
          ...state.comments,
          [id]: {
            ...state.comments[id],
            timestamp: timestamp,
            body: body,
          }
        }
      }
    case DELETE_COMMENT_ACTION :
      return {
        ...state,
        comments: {
          ...state.comments,
          [id]: {
            ...state.comments[id],
            deleted: true,
          }
        }
      }
    case SET_PARENT_DELETED :
      return {
        ...state,
        comments: {
          ...state.comments,
          [id]: {
            ...state.comments[id],
            parentDeleted: true
          }
        }
      }
    default :
      return state
  }
}

function changeCategoryFocus (state = { focus: '' }, action ) {
  switch (action.type) {
    case CHANGE_CATEGORY_FOCUS :
      return {
        focus: action.nameOfCategory,
      }
    default :
      return state
  }
}

function posts (state = { clickedPostId: '', sortPostsBy: 'normal', posts: {}, rehydrated: false }, action) {
  const { id, timestamp, title, body, author, category, voteScore, deleted, sortType, numberOfComments } = action
  switch (action.type) {
    case REHYDRATE :
      return {
        ...state,
        ...action.payload.posts,
        rehydrated: true,
      }
    case ADD_POST :
      return {
        ...state,
        posts: {
          ...state.posts,
          [id]: {
            id,
            timestamp,
            title,
            body,
            category,
            author,
            voteScore,
            deleted,
            numberOfComments,
          }
        }
      }
    case VOTE_POST_UP_ACTION :
      let newScoreUp = voteScore + 1
      return {
        ...state,
        posts: {
          ...state.posts,
          [id]: {
            ...state.posts[id],
            voteScore: newScoreUp
          }
        }
      }
    case VOTE_POST_DOWN_ACTION :
      let newScoreDown = voteScore - 1
      return {
        ...state,
        posts: {
          ...state.posts,
          [id]: {
            ...state.posts[id],
            voteScore: newScoreDown
          }
        }
      }
    case SORT_POSTS_BY_ACTION :
      return {
        ...state,
        sortPostsBy: sortType
      }
    case DELETE_POST :
      return {
        ...state,
        posts: {
          ...state.posts,
          [id]: {
            ...state.posts[id],
            deleted: true
          }
        }
      }
    case EDIT_POST_ACTION :
      return {
        ...state,
        posts: {
          ...state.posts,
          [id]: {
            ...state.posts[id],
            title: title,
            body: body,
          }
        }
      }
    case CLICKED_POST_ID :
      return {
        ...state,
        clickedPostId: id,
      }
    case SET_NUMBER_OF_COMMENTS :
      return {
        ...state,
        posts: {
          ...state.posts,
          [id]: {
            ...state.posts[id],
            numberOfComments: numberOfComments,
          }
        }
      }
    case INCREASE_COMMENTS :
      let commentPlus = numberOfComments + 1
      return {
        ...state,
        posts: {
          ...state.posts,
          [id]: {
            ...state.posts[id],
            numberOfComments: commentPlus
          }
        }
      }
      case DECREASE_COMMENTS :
        let commentMinus = numberOfComments - 1
        return {
          ...state,
          posts: {
            ...state.posts,
            [id]: {
              ...state.posts[id],
              numberOfComments: commentMinus
            }
          }
        }
    default :
      return state
    }
}

function categories (state = {}, action) {
  const { name, path } = action
  switch(action.type) {
    case ADD_CATEGORY :
      return {
        ...state,
        [name]: {
          name,
          path,
        }
      }
    default :
      return state
  }
}

export default combineReducers({
  categories,
  posts,
  changeCategoryFocus,
  comments,
})
