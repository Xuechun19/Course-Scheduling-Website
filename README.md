
# Course Scheduling Website 

This application uses a limited quantity of modified data from the UW Madison course information database.


# Video Demo of the Website

[Course Website Demo](https://www.youtube.com/watch?v=sNuPt4SoA44&t=16s)

## Course data

The course data is being fetched from `http://mysqlcs639.cs.wisc.edu:53706/api/react/classes` and is formatted as follows:

```
[
    {
        "credits": <number of credits for the course>,
        "description": <course description>,
        "keywords": <1D list of string keywords>,
        "name": <course name>,
        "number": <unique course number>,
        "requisites": <2D list of course requisites>,
        "sections": [
            {
                "instructor": <instructor name>,
                "location": <section location>,
                "subsections": [
                    {
                        "location": <subsection location>,
                        "time": {
                            <weekday>: <time range>, ...
                        },
    					"number": <subsection number>
                    }
                ],
                "time": {
                <weekday>: <time range>, ...
                },
				"number": <section number>
            }, ...
        ],
        "subject": <course subject>
    }, ...
]
```


# Recommender

## Feature 1

<video width="320" height="240" controls>
  <source src="/Users/yangxc/Desktop/demo1.mov" type="video/mp4">
</video>

- Fetch data from server `http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed`. This data details which courses have already been completed.
- Create a new component to display a previously taken course. This component might look somewhat like the Course component, but it will be simpler and won’t have options to add the course to the cart.
- Create a new component to hold the previously taken course components. Make this component accessible as a new tab in the app.
  
## Feature 2

- Create a component for rating a specific course.
- Allow the user to rate courses they have already completed. (You can create the rating component as a child of the completed course component, for instance)

## Feature 3

- Generate a list of interest areas based on the course data (maybe look at subjects and keywords)
- Create a component for the user to filter course results by interest area, using your list of interest areas. (A good place to put this wold be in the Sidebar Component)
- Make this component available to the user.

## Feature 4

- Create a recommender algorithm that takes in the rated courses and interest areas. Use the interest areas of rated courses to recommend courses which have not yet been taken in the interest areas of highly rated completed courses.
- Create a new tab which displays the recommended courses to the user. (Maybe show a few recommended courses or sort all courses by their recommendation score)


## Feature 5

- When adding a course to the cart, design a way to let the user know if they are not able to take the course based off of the requisites and the user's previously taken courses. Even if a student does not meet the requisites to enroll in a course, they should still be able to add it to the cart. 
  
## Feature 6

- If the user is not able to take a course in the cart because the user does not meet the requisites, design a way to show the user the possible course paths to take to be able to take the desired course.

## Feature 7

- Create a way for user to select courses they would like to take in the future from the courses they are currently unable to take in the cart (because of requisites). Factor these courses into the recommendation algorithm, giving a larger bias to the courses needed for the selected interest courses.


---

## Npm packages


**Run `npm install` in the terminal after cloning to automatically install needed npm packages such as react-bootstrap**

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
