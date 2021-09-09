---
layout: page
title: Working With Text in Python
---

Launch Jupyter Labs and create a new directory within your class folder `data-a-user-manual` called `working-with-text`. Navigate to that folder and create a new Jupyter Notebook, renaming the filename: `working-with-text.ipynb`. 

Today we'll be working with a single text: a narrative dictated by [Venture Smith](https://en.wikipedia.org/wiki/Venture_Smith), a successful businessman and formerly enslaved man in colonial-era New England. The narrative, *A Narrative of the Life and Adventures of Venture, a Native of Africa: But Resident above Sixty Years in the United States of America, Related by Himself*, is available in several formats online but for the purposes of today I've put it into the primary kind of file you will want to use when working with textual data in Python: a text file (ending in `.txt`). 

* **Download Smith's narrative by clicking on [this link]({{site.baseurl}}/in-class/venture-smith.txt)** (if it opens in your browser without downloading you might need to use File -> Save As). Move the .txt file into your `working-with-text` folder. Take a look at the text file in Jupyter Lab by double-clicking on the file in the left pane.
* In Jupyter Lab, add a code cell and create a new variable called `smith` that assigns the contents of the `venture-smith.txt` file using the `open()` and `read()` functions ([Walsh instructions](https://melaniewalsh.github.io/Intro-Cultural-Analytics/02-Python/07-Files-Character-Encoding.html)).
* In a new code cell, add two lines of code. In the first, just run your new variable `smith` to display its contents. In the second line, use `print()` to display its contents. What is the difference between these two?
* Use `index()` function to show the first character (letter) of Smith's narrative. It should show: `'A'`.
* Use `slice()` to show the first 100 characters (letters) of Smith's narrative. It should show: `'A NARRATIVE OF THE LIFE AND ADVENTURES\n\nOF VENTURE, A NATIVE OF AFRICA,\n\nBut resident above sixty ye'`
* Let's just isolate the title of Smith's narrative. This is comprised of the first 158 characters.  Make a new variable called `smith_title` and assign it the first 158 characters of the text file (since Python starts counting at 0, this means we want to use `smith[0:157]`).
* Use [`string.title()`](https://melaniewalsh.github.io/Intro-Cultural-Analytics/02-Python/06-String-Methods.html#:~:text=uppercase-,string.title(),makes%20the%20string%20titlecase,-string) to reformat the title of Smith's narrative by making the first letter of each word capitalized. Hint: the `string.` in this example is your new variable `smith_title`.
* Notice how your main variable `smith` contains newline characters (`\n`). This is a "hidden" character contained in text files that tells a text editor to show the following text as starting on a new line (like hitting Enter or Return in a Word document). Use [`string.split('delim')`](https://melaniewalsh.github.io/Intro-Cultural-Analytics/02-Python/06-String-Methods.html#:~:text=code%20here-,Split%20Strings%20By%20a%20Delimiter,Explanation,-string.split) to "split" up Smith's narrative into separate lines. What would you use in place of `string.` and `delim` to do this? Assign this new collection of separate lines to a new variable called `smith_lines`.
* The [`len()`](https://www.w3schools.com/python/ref_func_len.asp) function tells you how long something is. In this case, we've created a variable called `smith_lines` containing a list of all the lines from Smith's narrative. Use `len()` and `smith_lines` to show the length of Smith's narrative in terms of the number of lines.


*Bonus Practice*:

- Use `string.split()`, `index()`, and `len()` to:
  - Print the 200th word in Smith's narrative
  - Print the length of the 200th word in Smith's narrative measured by number of characters/letters.
  - Print the length of Smith's narrative measured by number of words