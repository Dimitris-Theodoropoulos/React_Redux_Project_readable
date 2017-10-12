import { getCategories, getPosts, getComments, addNewPost, votePostUp, votePostDown, deletePost, editPost, voteCommentUp, voteCommentDown, deleteComment, editComment, addNewComment } from '../utils/api'

export const ADD_CATEGORY = 'ADD_CATEGORY'
export const ADD_POST = 'ADD_POST'
export const CHANGE_CATEGORY_FOCUS = 'CHANGE_CATEGORY_FOCUS'
export const VOTE_POST_UP_ACTION = 'VOTE_POST_UP_ACTION'
export const VOTE_POST_DOWN_ACTION = 'VOTE_POST_DOWN_ACTION'
export const SORT_POSTS_BY_ACTION = 'SORT_POSTS_BY_ACTION'
export const DELETE_POST = 'DELETE_POST'
export const EDIT_POST_ACTION = 'EDIT_POST_ACTION'
export const CLICKED_POST_ID = 'CLICKED_POST_ID'
export const ADD_COMMENT = 'ADD_COMMENT'
export const SORT_COMMENTS_BY_ACTION = 'SORT_COMMENTS_BY_ACTION'
export const VOTE_COMMENT_UP_ACTION = 'VOTE_COMMENT_UP_ACTION'
export const VOTE_COMMENT_DOWN_ACTION = 'VOTE_COMMENT_DOWN_ACTION'
export const EDIT_COMMENT_ACTION = 'EDIT_COMMENT_ACTION'
export const DELETE_COMMENT_ACTION = 'DELETE_COMMENT_ACTION'
export const INCREASE_COMMENTS = 'INCREASE_COMMENTS'
export const DECREASE_COMMENTS = 'DECREASE_COMMENTS'
export const SET_NUMBER_OF_COMMENTS = 'SET_NUMBER_OF_COMMENTS'
export const SET_PARENT_DELETED = 'SET_PARENT_DELETED'

//Asynchronous Actions
export function getAllCategories () {
  return dispatch => {
    getCategories().then(res => res.categories.map(category => dispatch(addCategory({ name: category.name, path: category.path }))))
  }
}

export function getAllPosts () {
  return dispatch => {
    getPosts().then(res => res.map(post => dispatch(addPost({ id: post.id, timestamp: post.timestamp, title: post.title, body: post.body, author: post.author, category: post.category, voteScore: post.voteScore, deleted: post.deleted, numberOfComments: 0 }))))
  }
}

export function getAllComments () {
  return dispatch => {
    getPosts().then(res => res.map(post => getComments(post.id).then(result => result.map(comment => dispatch(addComment({
    id: comment.id,
    parentId: comment.parentId,
    timestamp: comment.timestamp,
    body: comment.body,
    author: comment.author,
    voteScore: comment.voteScore,
    deleted: comment.deleted,
    parentDeleted: comment.parentDeleted, }))))))
  }
}

export function addNewPostAsynch (id, timestamp, postTitle, postBody, postCategory, postAuthor) {
  addNewPost(id, timestamp, postTitle, postBody, postCategory, postAuthor)
  return dispatch => {
    dispatch(addPost({ id: id, timestamp: timestamp, title: postTitle, body: postBody, category: postCategory, author: postAuthor, voteScore: 1, deleted: false, numberOfComments: 0 }))
  }
}

export function votePostUpAsynch (id, voteScore) {
  votePostUp(id)
  return dispatch => {
    dispatch(votePostUpAction({ id: id, voteScore: voteScore }))
  }
}

export function votePostDownAsynch (id, voteScore) {
  votePostDown(id)
  return dispatch => {
    dispatch(votePostDownAction({ id: id, voteScore: voteScore }))
  }
}

export function deletePostAsynch (id) {
  return dispatch => {
    getComments(id).then(res => res.map(com => dispatch(parentDeleted({ id: com.id }))))
    deletePost(id)
    dispatch(deletePostAction({ id: id }))
  }
}

export function editPostAsynch (id, title, body) {
  editPost(id, title, body)
  return dispatch => {
    dispatch(editPostAction({ id: id, title: title, body: body }))
  }
}

export function setNumberOfCommentsAsynch () {
  return dispatch => {
    getPosts().then(res => res.map(post => getComments(post.id).then(result => dispatch(setNumberOfComments({ id: post.id, numberOfComments: result.length })))))
  }
}

export function voteCommentUpAsynch (id, voteScore) {
  voteCommentUp(id)
  return dispatch => {
    dispatch(voteCommentUpAction({ id: id, voteScore: voteScore }))
  }
}

export function voteCommentDownAsynch(id, voteScore) {
  voteCommentDown(id)
  return dispatch => {
    dispatch(voteCommentDownAction({ id: id, voteScore: voteScore }))
  }
}

export function deleteCommentAsynch (id) {
  deleteComment(id)
  return dispatch => {
    dispatch(deleteCommentAction({ id: id }))
  }
}

export function editCommentAsynch (id, timestamp, body) {
  editComment(id, timestamp, body)
  return dispatch => {
    dispatch(editCommentAction({ id: id, timestamp: timestamp, body: body }))
  }
}

export function getPostComments (id) {
  return dispatch => {
  getComments(id).then(res => res.map(comment => dispatch(addComment({ id: comment.id,
                                                                                  parentId: comment.parentId,
                                                                                  timestamp: comment.timestamp,
                                                                                  body: comment.body,
                                                                                  author: comment.author,
                                                                                  voteScore: comment.voteScore,
                                                                                  deleted: comment.deleted,
                                                                                  parentDeleted: comment.parentDeleted}))))
                                                                                }
}

export function addCommentAsynch (id, timestamp, body, author, parentId) {
  addNewComment(id, timestamp, body, author, parentId)
  return dispatch => {
    dispatch(addComment({ id: id, parentId: parentId, timestamp: timestamp, body: body, author: author, voteScore: 1, deleted: false, parentDeleted:false }))
  }
}

//Sychronous Actions
export function parentDeleted ({ id }) {
  return {
    type: SET_PARENT_DELETED,
    id,
  }
}

export function setNumberOfComments ({ id, numberOfComments }) {
  return {
    type: SET_NUMBER_OF_COMMENTS,
    id,
    numberOfComments,
  }
}

export function increaseComments ({ id, numberOfComments }) {
  return {
    type: INCREASE_COMMENTS,
    id,
    numberOfComments,
  }
}

export function decreaseComments ({ id, numberOfComments }) {
  return {
    type: DECREASE_COMMENTS,
    id,
    numberOfComments,
  }
}

export function editCommentAction ({ id, timestamp, body }) {
  return {
    type: EDIT_COMMENT_ACTION,
    id,
    timestamp,
    body,
  }
}

export function deleteCommentAction ({ id }) {
  return {
    type: DELETE_COMMENT_ACTION,
    id,
  }
}

export function voteCommentUpAction ({ id, voteScore }) {
  return {
    type: VOTE_COMMENT_UP_ACTION,
    id,
    voteScore,
  }
}

export function voteCommentDownAction ({ id, voteScore }) {
  return {
    type: VOTE_COMMENT_DOWN_ACTION,
    id,
    voteScore,
  }
}

export function sortCommentsByAction ({ sortType }) {
  return {
    type: SORT_COMMENTS_BY_ACTION,
    sortType,
  }
}

export function addComment ({ id, parentId, timestamp, body, author, voteScore, deleted, parentDeleted }) {
  return {
    type: ADD_COMMENT,
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

export function clickedPostId ({ id, author }) {
  return {
    type: CLICKED_POST_ID,
    id,
  }
}

export function addCategory ({ name, path }) {
  return {
    type: ADD_CATEGORY,
    name,
    path,
  }
}

export function editPostAction ({ id, title, body }) {
  return {
    type: EDIT_POST_ACTION,
    id,
    title,
    body,
  }
}

export function addPost ({ id, timestamp, title, body, category, author, voteScore, deleted, numberOfComments }) {
  return {
    type: ADD_POST,
    id,
    timestamp,
    title,
    body,
    author,
    category,
    voteScore,
    deleted,
    numberOfComments,
  }
}

export function changeCategoryFocus (nameOfCategory) {
  return {
    type: CHANGE_CATEGORY_FOCUS,
    nameOfCategory,
  }
}

export function votePostUpAction ({ id, voteScore }) {
  return {
    type: VOTE_POST_UP_ACTION,
    id,
    voteScore,
  }
}

export function votePostDownAction ({ id, voteScore }) {
  return {
    type: VOTE_POST_DOWN_ACTION,
    id,
    voteScore,
  }
}

export function sortPostsByAction ({ sortType }) {
  return {
    type: SORT_POSTS_BY_ACTION,
    sortType,
  }
}

export function deletePostAction ({ id }) {
  return {
    type: DELETE_POST,
    id,
  }
}
