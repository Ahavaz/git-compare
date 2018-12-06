import React, { Component } from 'react'
import moment from 'moment'
import api from '../../services/api'

import logo from '../../assets/logo.png'

import { Container, Form } from './styles'

import CompareList from '../../components/CompareList'

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

const filterRepository = (repositories, repositoryInput) => repositories.filter(
  repository => repository.full_name.toLowerCase() === repositoryInput.toLowerCase()
)

export default class Main extends Component {
  state = {
    loading: false,
    repositoryError: false,
    repositoryInput: '',
    repositories: []
  }

  componentDidMount() {
    if (!localStorage.repositories) {
      localStorage.repositories = JSON.stringify([])
    }

    this.setState({ repositories: JSON.parse(localStorage.repositories) })
  }

  handleAddRepository = async e => {
    e.preventDefault()

    this.setState({ loading: true })

    const { repositoryInput, repositories } = this.state

    try {
      if (filterRepository(repositories, repositoryInput).length) {
        this.setState({
          repositoryError: true,
          loading: false
        })
      } else {
        const { data: repository } = await api.get(`/repos/${repositoryInput}`)

        repository.name = capitalize(repository.name)
        repository.lastCommit = capitalize(moment(repository.pushed_at).fromNow())

        localStorage.repositories = JSON.stringify([...repositories, repository])

        this.setState(state => ({
          repositoryError: false,
          repositoryInput: '',
          repositories: [...state.repositories, repository]
        }))
      }
    } catch (err) {
      this.setState({ repositoryError: true })
    } finally {
      this.setState({ loading: false })
    }
  }

  handleRefreshRepository = async id => {
    const { repositories } = this.state

    const refreshedRepository = await repositories.reduce(async (arrayPromise, repository) => {
      const array = await arrayPromise

      if (repository.id === id) {
        try {
          const { data } = await api.get(`/repos/${repository.full_name}`)

          data.name = capitalize(data.name)
          data.lastCommit = capitalize(moment(data.pushed_at).fromNow())

          array.push(data)
        } catch (err) {
          // console.error(err)
        }
      } else {
        array.push(repository)
      }
      return array
    }, Promise.resolve([]))

    localStorage.repositories = JSON.stringify(refreshedRepository)

    this.setState({ repositories: refreshedRepository })
  }

  handleRemoveRepository = id => {
    const { repositories } = this.state

    const removedRepository = repositories.filter(repository => repository.id !== id)

    localStorage.repositories = JSON.stringify(removedRepository)

    this.setState({ repositories: removedRepository })
  }

  render() {
    const {
      loading, repositoryError, repositoryInput, repositories
    } = this.state

    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form hasError={repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="usuário/repositório"
            value={repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">{loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}</button>
        </Form>

        <CompareList
          repositories={repositories}
          onRefresh={this.handleRefreshRepository}
          onRemove={this.handleRemoveRepository}
        />
      </Container>
    )
  }
}
