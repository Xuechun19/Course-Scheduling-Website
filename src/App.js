import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      recommendedCourses: [],
      completedCourses: {},
      ratings: [],
      subjects: [],
      cartCourses: []
    };
    this.updateActiveKey = this.updateActiveKey.bind(this)
  }

  updateActiveKey(key) {
    this.setState({ activeKey: key })
  }
  // componentDidMount() {
  //  this.loadInitialState()
  // }

  // async loadInitialState(){
  //   let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
  //   let courseData = await (await fetch(courseURL)).json()


  //   this.setState({allCourses: courseData, filteredCourses: courseData, subjects: this.getSubjects(courseData)});
    
  // }

  componentDidMount() {
    fetch('http://mysqlcs639.cs.wisc.edu:53706/api/react/classes').then(
      res => res.json()
    ).then(data => this.setState({ allCourses: data, filteredCourses: data, cartCourses: [], subjects: this.getSubjects(data) }));
    fetch('http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed').then(
      res => res.json()
    ).then(completedData => { this.setState({ completedCourses: completedData }) });
  }

  setRatings() {
    let ratings = [];
    for (let i = 0; i < this.state.completedCourses.data.length; i++) {
      ratings.push(0);
    }
    this.setState({ ratings: ratings });
  }


  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(let i = 0; i < data.length; i++) {
      if(subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }
  updateRatings(course, rating) {
    if (this.state.ratings.length === 0) {
      this.setRatings();
    }
    let update = this.state.ratings;
    for (let i = 0; i < update.length; i++) {
      if (this.state.completedCourses.data[i] === course) {
        update[i] = rating;
        this.setState({ ratings: update });
        this.updateRecommendedCourses();
        return;
      }
    }
    this.updateRecommendedCourses();
  }
  updateRecommendedCourses() {
    let recommend = [];
    for (let score = 5; score > 0; score--) {
      for (let i = 0; i < this.state.allCourses.length; i++) {
        let course = this.state.allCourses[i];
        var alreadyTook = false;
        for (let j = 0; j < this.state.completedCourses.data.length; j++) {
          if (course.number === this.state.completedCourses.data[j]) {
            alreadyTook = true;
          }
        }
        if (alreadyTook) {
          continue;
        }

        let completedSubjects = this.getCompletedSubjects(this.state.completedCourses.data);
        for (let j = 0; j < completedSubjects.length; j++) {
          if (course.subject === completedSubjects[j] && this.state.ratings[j] === score) {
            recommend.push(course);
          }
        }
      }
    }
    let result = Array.from(new Set(recommend));
    this.setState({ recommendedCourses: result });
  }

  getCompletedSubjects(completedCourses) {
    let completed_Subjects = [];
    // console.log(Object.values(completedCourses))
    for (let i in (completedCourses)) {
      let completedCourse = completedCourses[i];
      for (let j in this.state.allCourses) {
        let course = this.state.allCourses[j]
        if (completedCourse === course.number) {
          completed_Subjects.push(course.subject);
        }
      }
    }
    return completed_Subjects;
  }



  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))// I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {return x.number===data.course})
    if (courseIndex === -1)
    {
      return 
    }
    // console.log("data: ", data)
    // console.log("data 111222: ", data.course);

    if('subsection' in data) {
      if(data.course in this.state.cartCourses) {
        if(data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        }
        else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    }
    else if('section' in data) {
      if(data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      
      
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) { 
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      }
    }
    else {
      newCartCourses[data.course] = {};


      for (let i = 0; i < this.state.allCourses[courseIndex].sections.length; i++){
        newCartCourses[data.course][i] = [];

         for(let c= 0; c < this.state.allCourses[courseIndex].sections[i].subsections.length; c ++){
          newCartCourses[data.course][i].push(this.state.allCourses[courseIndex].sections[i].subsections[c]);
        }

      }


    }
    
  let course1 = this.state.allCourses[courseIndex];
  // console.log("requisite: ", course1.requisites);
  let comListData = this.state.completedCourses.data;
  // console.log("completed: ", comListData);
  // console.log("cs537", course1);

  if(course1.number === "COMP SCI 537"){
    for(let xy = 0; xy<course1.requisites.length; xy++){
      alert("Requisite: " + course1.requisites[xy]);
    }
    
  }



  if(course1.requisites.length === 0) {
    alert("Add successfully!");
  }else if(course1.requisites.length === 1){
    for(let i=0; i<comListData.length; i++){
      // console.log("1111");
      // var compare = course1.requisites.localCompare(comListData[i]);
      if(course1.requisites === comListData[i]){
        alert("Add successfully!");
      }
    }   
  }else {
    let req = course1.requisites;
      let requList = [];
                 
      for(let i = 0; i<req.length; i++){

        for(let j=0; j<comListData.length; j++){
          if(req[i] === comListData[j]){
                continue;
          }else{
            requList.push(req[i]);
            
            
          }
        }        
    }
    console.log("eliminate: ", req);
    if(requList.length === 0){
      for(let u = 0; u<req.length; u++){
        alert("Requisite: " + req[u]);
      }
    }else{
      for(let k=0;k<requList.length;k++){
        alert("Requisite: " + requList[k]);
        // console.log(requList[k]);
        break;
      }     
    }
    
  }

    this.setState({cartCourses: newCartCourses});
       
  }


  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))

    if('subsection' in data) {
      newCartCourses[data.course][data.section].splice(newCartCourses[data.course][data.section].indexOf(data.subsection), 1);
      if(newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else if('section' in data) {
      delete newCartCourses[data.course][data.section];
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else {
      delete newCartCourses[data.course];
    }
    this.setState({cartCourses: newCartCourses});
  }

  getCartData() {
    let cartData = [];

    for(const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === courseKey})

      cartData.push(course);
    }
    return cartData;
  }

  getSubjectOptions() {
    let subjectOptions = [];
    for (const subject of this.state.subjects) {
      subjectOptions.push(<option key={subject}>{subject}</option>);
    }
    return subjectOptions;
  }

  getAllInterestAreas() {
    let interest_areas = [];
    //look at subjects
    let subjects = this.getSubjectOptions();
    for (let i = 0; i < subjects.length; i++) {
      interest_areas.push(subjects[i].key)
    }
    //look at keywords
    for (let i = 0; i < this.state.allCourses.length; i++) {
      let course = this.state.allCourses[i];
      for (let j = 0; j < course.keywords.length; j++) {
        interest_areas.push(course.keywords[j]);
      }
    }
    interest_areas = [...new Set(interest_areas)];
    return interest_areas;
  }

  


  
  render() {

    // console.log("props", this.props);
    // const course = this.state.course;
    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="search" style={{position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white'}}>
          
          <Tab eventKey="search" title="Search" style={{paddingTop: '5vh'}}>
            
            <Sidebar 
            setCourses={(courses) => this.setCourses(courses)} 
            courses={this.state.allCourses} 
            subjects={this.state.subjects} 
            interest_areas={this.getAllInterestAreas()}
            />
            <div style={{marginLeft: '20vw'}}>
              <CourseArea 
              data={this.state.filteredCourses} 
              addCartCourse={(data) => this.addCartCourse(data)} 
              removeCartCourse={(data) => this.removeCartCourse(data)} 
              cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.getCartData()} 
              addCartCourse={(data) => this.addCartCourse(data)} 
              removeCartCourse={(data) => this.removeCartCourse(data)} 
              cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>
          <Tab eventKey="completed" title="Completed Courses" style={{paddingTop: '5vh'}}>
          <div>
              <CourseArea
                data={this.state.completedCourses}
                allData={this.state.allCourses}
                updateRatings={this.updateRatings.bind(this)}
                mode={"completed"} />
          </div>
          </Tab>

          <Tab eventKey="recommend" title="Recommended Courses" style={{paddingTop: '5vh'}}>
          <div>
          <CourseArea
                allCourses={this.state.allCourses}
                data={this.state.recommendedCourses}
                mode={"recommend"} />
          </div>
          </Tab>

        </Tabs>
      </>
    )
  }
}

export default App;
