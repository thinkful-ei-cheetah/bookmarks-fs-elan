import React, { Component } from 'react';
import config from '../config';
import BookmarksContext from '../BookmarksContext'

export class EditBookmarkForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      title: '',
      url: '',
      description: '',
      rating: 1
    }
  }

  static contextType = BookmarksContext;

  componentDidMount() {
    const {bookmarkId} = this.props.match.params
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${config.API_KEY}`
      }
    })
    .then(res => {
      if(!res.ok) {
        return res.json().then(error => Promise.reject(error))
      }
      return res.json()
    })
    .then(responseData => {
      this.setState({
        id: responseData.id,
        title: responseData.title,
        url: responseData.url,
        description: responseData.description,
        rating: responseData.rating
      })
    })
    .catch(error => {
      console.error(error)
      this.setState({ error })
    })
  }

  handleChangeTitle = e => {
    this.setState({
      title: e.target.value
    })
  }
  handleChangeUrl = e => {
    this.setState({
      url: e.target.value
    })
  }
  handleChangeDescription = e => {
    this.setState({
      description: e.target.value
    })
  }
  handleChangeRating = e => {
    this.setState({
      rating: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { bookmarkId } = this.props.match.params
    const { id, title, url, description, rating } = this.state
    const newBookmark = { id, title, url, description, rating }
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(),
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${config.API_KEY}`
      }
    })
    .then(res => {
      if(!res.ok)
        return res.json().then(error => {this.setState(error)})
    })
    .then(() => {
      this.resetInputs(newBookmark)
      this.context.updateBookmark(newBookmark)
      this.props.history.push('/')
    })
    .catch(error => {
      console.error(error)
      this.setState({ error })
    })
  }

  resetInputs = (newInputs) => {
    this.setState({
      id: newInputs.id || '',
      title: newInputs.title || '',
      url: newInputs.url || '',
      description: newInputs.description || '',
      rating: newInputs.rating || '',
    })
  }

  handleClickCancel = () => {
    this.props.histoy.push('/')
  }
  render() {
    const { title, url, description, rating, error } = this.state
    return (
      <section className='EditBookmarkForm'>
        <h2>Edit article</h2>
        <form onSubmit={this.handleSubmit}>
        <div className="editBookmark_error">
          {error && <p>{error.message}</p>}
        </div>
        <label htmlFor='title'>Title</label>
        <input
          id='title'
          type='text'
          name='title'
          placeholder='title'
          required
          value={title}
          onChange={this.handleChangeTitle}
          />
        <label htmlFor='url'>URL</label>
        <input
          id='url'
          type='text'
          name='url'
          placeholder='url'
          required
          value={url}
          onChange={this.handleChangeUrl}
          />
        <label htmlFor='title'>Description</label>
        <input
          id='description'
          type='text'
          name='description'
          placeholder='description'
          required
          value={description}
          onChange={this.handleChangeDescription}
          />
        <label htmlFor='rating'>Rating</label>
        <input
          id='rating'
          type='rating'
          name='rating'
          placeholder='rating'
          required
          value={rating}
          onChange={this.handleChangeRating}
          />
          <button onClick={this.handleClickCancel}>Cancel</button>
          <button type="submit">Save</button>
        </form>
      </section>
    )
  }
}

export default EditBookmarkForm
