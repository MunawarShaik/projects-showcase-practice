import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Projects extends Component {
  state = {
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
    activeCategory: '',
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {activeCategory} = this.state
    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${activeCategory}`,
    )
    if (response.ok) {
      const data = await response.json()
      // console.log(data)
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      console.log(updatedData)
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeCategory = event => {
    this.setState({activeCategory: event.target.value}, this.getProjects)
  }

  onClickRetry = () => {
    this.getProjects()
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        onClick={this.onClickRetry}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderProjects = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-list">
        {projectsList.map(eachProject => (
          <li key={eachProject.id} className="project-item">
            <div className="project-card">
              <img
                src={eachProject.imageUrl}
                alt={eachProject.name}
                className="project-image"
              />
              <p className="project-name">{eachProject.name}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderProjectDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjects()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="header-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </div>
        <div className="projects-container">
          <div className="categories-container">
            <select className="select">
              {categoriesList.map(eachCategory => (
                <option
                  value={eachCategory.id}
                  key={eachCategory.id}
                  onChange={this.changeCategory}
                >
                  {eachCategory.displayText}
                </option>
              ))}
            </select>
          </div>
          <div className="projects-view-container">
            {this.renderProjectDetails()}
          </div>
        </div>
      </div>
    )
  }
}

export default Projects
