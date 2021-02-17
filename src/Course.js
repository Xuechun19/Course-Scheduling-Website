import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      showModal: false,
      key: props.key,
      course: props.course,
      rating: 0
    }
  }
  getRequisites() {
    var allRequisites = this.state.course.requisites;
    if (allRequisites.length === 0) {
      return "None";
    }
    var requisitesString = "";
    for (let i = 0; i < allRequisites.length; i++) {
      for (let j = 0; j < allRequisites[i].length; j++) {
        if (j === 0) {
          requisitesString = requisitesString.concat("(");
        }
        requisitesString = requisitesString.concat(allRequisites[i][j]);
        if (j !== allRequisites[i].length - 1) {
          requisitesString = requisitesString.concat(" OR ");
        } else {
          requisitesString = requisitesString.concat(")");
        }
      }
      if (i !== allRequisites.length - 1) {
        requisitesString = requisitesString.concat(" AND ");
      }
    }
    return requisitesString;
  }

  setAllKeywords() {
    return this.state.course.keywords.join(", ");
  }
  updateRating(rating) {
    this.setState({ rating: rating })
  }

  render() {
    const course = this.state.course;
    if (this.props.mode === "completed") {
      return (
        
        <div>
          
          <br></br>
          {/* <p style={{ width: 50, height: 50, backgroundColor: 'powderblue'}}>Rate for your taken class</p> */}
          <br></br>

          <h1 style={{ color: "#841584" }}> <b>{course} </b> </h1>
          
          
          <button onClick={() => { this.updateRating(1); this.props.updateRatings(course, 1) }}> 1 </button>
          <button onClick={() => { this.updateRating(2); this.props.updateRatings(course, 2) }}> 2 </button>
          <button onClick={() => { this.updateRating(3); this.props.updateRatings(course, 3) }}> 3 </button>
          <button onClick={() => { this.updateRating(4); this.props.updateRatings(course, 4) }}> 4 </button>
          <button onClick={() => { this.updateRating(5); this.props.updateRatings(course, 5) }}> 5 </button>
          <br></br>        
          <br></br>
          
          <h4> Your rating is <b>{this.state.rating}</b>.</h4>
          <p><b>-----------------------------------------</b></p>
        </div>
        
      )
    }else if (this.props.mode === "recommend") {
      return (
        <div>
          <br></br>
          <h3 style={{ color: "#794c74" }}> <b>({course.number}) {course.name}</b> | ({course.credits} Credits) </h3>
          <p> <b>Subject</b>: {course.subject} </p>
          <p> {course.description} </p>
          <p> <b>Requisites</b>: {this.getRequisites()} </p>
          <p> <b>Keywords</b>: {this.setAllKeywords()} </p>
        </div>
      )
    }
    else{

      return(
          
      <Card style={{width: '33%', marginTop: '5px', marginBottom: '5px'}}>
        <Card.Body>
          <Card.Title>
            <div style={{maxWidth: 300}}>
              {this.props.data.name}
            </div>
            {this.getExpansionButton()}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
          {this.getDescription()}
          <Button variant='dark' onClick={() => this.openModal()}>View sections</Button>
        </Card.Body>
        <Modal show={this.state.showModal} onHide={() => this.closeModal()} centered>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.data.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
           Click Cards Below for More Details {this.getSections()}
          </Modal.Body>
          <Modal.Footer>
            {this.getCourseButton()}
            <Button variant="secondary" onClick={() => this.closeModal()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
        
      )
      
    }
  }
    
  

  getCourseButton() {
    let buttonVariant = 'dark';
    let buttonOnClick = () => this.addCourse();
    let buttonText = 'Add Course';

    if(this.props.courseKey in this.props.cartCourses) {
      buttonVariant = 'outline-dark';
      buttonOnClick = () => this.removeCourse();
      buttonText = 'Remove Course'
    }

    return (
      <Button variant={buttonVariant} onClick={buttonOnClick}>
        {buttonText}
      </Button>
    )
  }

  getSections() {

    let sections = [];
    for (let i =0; i < this.props.data.sections.length; i++){
     
      sections.push (
          <Card key={i}>
            <Accordion.Toggle as={Card.Header} variant="link" eventKey={i} style={{height: 63, display: 'flex', alignItems: 'center'}}>
              {"Section_" + i}
              {this.getSectionButton(i)}              
            </Accordion.Toggle>

            <Accordion.Collapse eventKey={i}>
              {/* <Card.Subtitle style={{fontWeight: "bold", fontSize: 20, color: '#191970'}}>Know More</Card.Subtitle> */}
              <Card.Body>
                Instructor: {JSON.stringify(this.props.data.sections[i].instructor)}
                <br></br>
                Time: {JSON.stringify(this.props.data.sections[i].time)}
                {this.getSubsections(i, this.props.data.sections[i])}
              </Card.Body>
            </Accordion.Collapse>
          
          </Card>
      )
    }

    return (
      <Accordion defaultActiveKey="0">
        {sections}
      </Accordion>
    )
  }

  getSectionButton(section) {
    let buttonVariant = 'dark';
    let buttonOnClick = (e) => this.addSection(e, section);
    let buttonText = 'Add Section';

    if(this.props.courseKey in this.props.cartCourses) {
      if(section in this.props.cartCourses[this.props.courseKey]) {
        buttonVariant = 'outline-dark';
        buttonOnClick = (e) => this.removeSection(e, section);
        buttonText = 'Remove Section';
      }
    }

    return <Button variant={buttonVariant} onClick={buttonOnClick} style={{position: 'absolute', right: 20}}>{buttonText}</Button>
  }

  addCourse() {
    
    this.props.addCartCourse (
      {
        course: this.props.courseKey
        
      }
    );
  }

  removeCourse() {
    this.props.removeCartCourse (
      {
        course: this.props.courseKey
      }
    );
  }

  addSection(e, section) {
    e.stopPropagation();
    this.props.addCartCourse (
      {
        course: this.props.courseKey,
        section: section
      }
    );
  }

  removeSection(e, section) {
    e.stopPropagation();
    this.props.removeCartCourse (
      {
        course: this.props.courseKey,
        section: section
      }
    );
  }

  addSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.addCartCourse (
      {
        course: this.props.courseKey,
        section: section,
        subsection: subsection
      }
    );
  }

  removeSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.removeCartCourse (
      {
        course: this.props.courseKey,
        section: section,
        subsection: subsection
      }
    );

  }

  getSubsections(sectionKey, sectionValue) {
    let subsections = [];

    for (let i =0; i < sectionValue.subsections.length; i++){  
    subsections.push (
        <Card key={i}>
          <Accordion.Toggle as={Card.Header} variant="link" eventKey={i} style={{height: 63, display: 'flex', alignItems: 'center'}}>
           {"Sub_"+i}
            {this.getSubsectionButton(sectionKey, i)}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={i}>
            <Card.Body>
            
              Time: {JSON.stringify(sectionValue.subsections[i].time)}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      )
    }

    return (
      <Accordion defaultActiveKey="0">
        {subsections}
      </Accordion>
    )
  }

  getSubsectionButton(section, subsection) {
    let buttonVariant = 'dark';
    let buttonOnClick = (e) => this.addSubsection(e, section, subsection);
    let buttonText = 'Add Subsection';

    if(this.props.courseKey in this.props.cartCourses) {
      if(section in this.props.cartCourses[this.props.courseKey]) {
        if(this.props.cartCourses[this.props.courseKey][section].indexOf(subsection) > -1) {
          buttonVariant = 'outline-dark';
          buttonOnClick = (e) => this.removeSubsection(e, section, subsection);
          buttonText = 'Remove Subsection';
        }
      }
    }

    return <Button variant={buttonVariant} onClick={buttonOnClick} style={{position: 'absolute', right: 20}}>{buttonText}</Button>
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  setExpanded(value) {
    this.setState({expanded: value});
  }

  getExpansionButton() {
    let buttonText = '▼';
    let buttonOnClick = () => this.setExpanded(true);

    if(this.state.expanded) {
      buttonText = '▲';
      buttonOnClick = () => this.setExpanded(false)
    }

    return (
      <Button variant='outline-dark' style={{width: 25, height: 25, fontSize: 12, padding: 0, position: 'absolute', right: 20, top: 20}} onClick={buttonOnClick}>{buttonText}</Button>
    )
  }

  getDescription() {
    if(this.state.expanded) {
      return (
        <div>
          {this.props.data.description}
        </div>
      )
    }
  }

  getCredits() {
    if(this.props.data.credits === 1)
      return '1 credit';
    else
      return this.props.data.credits + ' credits';
  }
}

export default Course;
