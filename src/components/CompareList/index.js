import React from 'react'
import PropTypes from 'prop-types'

import { Container, Repository } from './styles'

const CompareList = ({ repositories, onRefresh, onRemove }) => (
  <Container>
    {repositories.map(repository => {
      const {
        id, name, owner, forks, open_issues: openIssues, watchers, lastCommit
      } = repository

      return (
        <Repository key={id}>
          <i className="fa fa-refresh" onClick={() => onRefresh(id)} />
          <i className="fa fa-close" onClick={() => onRemove(id)} />
          <header>
            <img src={owner.avatar_url} alt={owner.login} />
            <strong>{name}</strong>
            <small>{owner.login}</small>
          </header>
          <ul>
            <li>
              {watchers}
              {' '}
              <small>stars</small>
            </li>
            <li>
              {forks}
              {' '}
              <small>forks</small>
            </li>
            <li>
              {openIssues}
              {' '}
              <small>issues</small>
            </li>
            <li>
              {lastCommit}
              {' '}
              <small>last commit</small>
            </li>
          </ul>
        </Repository>
      )
    })}
  </Container>
)

CompareList.propTypes = {
  repositories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      owner: PropTypes.shape({
        login: PropTypes.string.isRequired,
        avatar_url: PropTypes.string.isRequired
      }).isRequired,
      forks: PropTypes.number.isRequired,
      open_issues: PropTypes.number.isRequired,
      watchers: PropTypes.number.isRequired,
      lastCommit: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onRefresh: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}

export default CompareList
