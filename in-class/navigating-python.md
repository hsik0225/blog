---
layout: page
title: Navigating Python
---

First create a new directory within your class folder `data-a-user-manual` called `navigating-python`. Launch Jupyter Labs and create a new Jupyter Notebook in that folder with the filename: `navigating-python.ipynb`. You are going to write some Python code to generate information about the historical figure Lucy Parsons. 

To replicate best coding practices, you're going to use alternating Markdown and Code cells in your Jupyter Notebook. Copy and paste each of the following steps into a new Markdown cell that documents in your own words what you're doing in the following code cell. Then insert a new code cell and write your Python code that completes the task for that step. 

1. Make new variables for the historical figure Lucy Parsons for her first name, last name, birth year, and the state in which she was born - use her [Wikipedia page](https://en.wikipedia.org/wiki/Lucy_Parsons):
  - `first_name`
  - `last_name`
  - `birth_year`
2. Make a new variable `full_name` and assign it a single string value using the variables `first_name` and `last_name`. Add a print statement that writes out a full sentence using `full_name`.
3. How old was Lucy Parsons during the Haymarket affair? Calculate her age and assign it to a new variable `haymarket_age`. End with a full-sentence print statement answering the question that uses `haymarket_age` and an f-string.
4. Lucy Parsons's contemporary and rival, Emma Goldman, also has [a Wikipedia page](https://en.wikipedia.org/wiki/Emma_Goldman). Create variables that capture the number of footnotes for each of their Wikipedia pages. Then write a print statement that compares these two numbers in some way.

*Bonus Practice*:

- Google a common Python function and use it to count how many characters (letters) are in Lucy Parsons' full name.
- Use [Booleans](https://melaniewalsh.github.io/Intro-Cultural-Analytics/02-Python/05-Data-Types.html#:~:text=72%20%25%2010-,Booleans,-%C2%B6) to determine if `first_name` and `birth_year` are the data type.