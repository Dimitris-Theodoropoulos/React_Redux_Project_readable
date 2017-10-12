const baseUrl = 'http://localhost:3001'

export function getComments (postId) {
  return fetch(`${baseUrl}/posts/${postId}/comments`, { method: 'get',
                                                        headers: {
                                                          'Authorization': 'jim' }}).then((res) => res.json())
}

export function addNewPost (id, timestamp, title, body, category, author) {
  return fetch(`${baseUrl}/posts`, { method: 'post',
                                     headers: { 'Authorization': 'jim',
                                                'Content-Type': 'application/json' },
                                     body: JSON.stringify({ id: id,
                                                            timestamp: timestamp,
                                                            title: `${title}`,
                                                            body: `${body}`,
                                                            category: `${category}`,
                                                            author: `${author}` })})
}

export function getCategories () {
  return fetch(`${baseUrl}/categories`, { method: 'get',
                                          headers: {
                                            'Authorization': 'jim' }}).then((res) => res.json())
}

export function getPosts () {
  return fetch(`${baseUrl}/posts`, { method: 'get',
                                     headers: {
                                       'Authorization': 'jim' }}).then((res) => res.json())
}

export function votePostUp (id) {
  fetch(`${baseUrl}/posts/${id}`, { method: 'post',
                                    headers: {
                                      'Authorization': 'jim',
                                      'Content-Type': 'application/json' },
                                    body: JSON.stringify({ "option":"upVote" })})
}

export function votePostDown (id) {
  fetch(`${baseUrl}/posts/${id}`, { method: 'post',
                                    headers: {
                                      'Authorization': 'jim',
                                      'Content-Type': 'application/json' },
                                    body: JSON.stringify({ "option":"downVote" })})
}

export function deletePost (id) {
  fetch(`${baseUrl}/posts/${id}`, { method: 'delete',
                                    headers: {
                                      'Authorization': 'jim' }})
}

export function editPost (id, title, body) {
  fetch(`${baseUrl}/posts/${id}`, { method: 'put',
                                    headers: { 'Authorization': 'jim',
                                               'Content-Type': 'application/json' },
                                    body: JSON.stringify({ title: `${title}`,
                                                           body: `${body}` })})
}

export function voteCommentUp (id) {
  fetch(`${baseUrl}/comments/${id}`, { method: 'post',
                                       headers: { 'Authorization': 'jim',
                                                   'Content-Type': 'application/json'},
                                       body: JSON.stringify({ 'option': 'upVote' })})
}

export function voteCommentDown (id) {
  fetch(`${baseUrl}/comments/${id}`, { method: 'post',
                                       headers: { 'Authorization': 'jim',
                                                  'Content-Type': 'application/json'},
                                       body: JSON.stringify({ 'option': 'downVote' })})
}

export function addNewComment (id, timestamp, body, author, parentId) {
  fetch(`${baseUrl}/comments`, { method: 'post',
                                 headers: { 'Authorization': 'jim',
                                            'Content-Type': 'application/json'},
                                 body: JSON.stringify({ id: id,
                                                        timestamp: timestamp,
                                                        parentId: parentId,
                                                        body: `${body}`,
                                                        author: `${author}`})})
}

export function editComment (id, timestamp, body) {
  fetch(`${baseUrl}/comments/${id}`, { method: 'put',
                                       headers: { 'Authorization': 'jim',
                                                  'Content-Type': 'application/json' },
                                       body: JSON.stringify({ body: `${body}` })})
}

export function deleteComment (id) {
  fetch(`${baseUrl}/comments/${id}`, { method: 'delete',
                                       headers: { 'Authorization': 'jim' }})
}
