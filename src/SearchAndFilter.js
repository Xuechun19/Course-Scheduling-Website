
class SearchAndFilter {
  searchAndFilter(courses, search, subject, interest_areas, minimumCredits, maximumCredits) {
    var new_courses = []
    for (let i = 0; i < courses.length; i++) {
      var course = courses[i];
      // 1. Search
      // only display courses that have a keyword that contains (or is) the user input from the search bar.
      var containSearch = false;
      for (let j = 0; j < course.keywords.length; j++) {
        var keyword = course.keywords[j];
        if (keyword.includes(search)) {
          containSearch = true;
        }
      }
      // 2. Subject
      // only display courses that match the selected subject
      var isSubject = false;
      if (subject === "All" || course.subject === subject) {
        isSubject = true;
      }
      // 3. Min
      var min = false;
      if (minimumCredits === "" || parseInt(minimumCredits) === NaN || parseInt(minimumCredits) <= parseInt(course.credits)) {
        min = true;
      }
      // 4. Max
      var max = false;
      if (maximumCredits === "" || parseInt(maximumCredits) === NaN || parseInt(maximumCredits) >= parseInt(course.credits)) {
        max = true;
      }
      // 5. Interest Areas
      var isInterestAreas = false;
      if (interest_areas === "All" || course.subject === interest_areas) {
        isInterestAreas = true;
      }
      for (let j = 0; j < course.keywords.length; j++) {
        var keyword = course.keywords[j];
        if (keyword === interest_areas) {
          isInterestAreas = true;
        }
      }
      // filter: 
      if (containSearch && isSubject && min && max && isInterestAreas) {
        new_courses.push(course);
      }
    }
    return new_courses;
  }
}

export default SearchAndFilter;
