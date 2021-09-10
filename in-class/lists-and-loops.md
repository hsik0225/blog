---
layout: page
title: Lists and Loops
---

### Organizing your work
Launch Jupyter Labs and create a new directory within your class folder `data-a-user-manual` called `lists-and-loops`. Navigate to that folder and create a new Jupyter Notebook, renaming the filename: `lists-and-loops.ipynb`. 

### Get the data
At this point you've worked with narratives authored by four enslaved people: Sojourner Truth, Frederick Douglass, Henry Brown, and Venture Smith. I've collected these into four text files in a folder called `narratives`. Click this link to download a zip file of this folder into `lists-and-loops` [narratives.zip](). In your operating system (outside of Jupyter Lab) unzip the file ([Windows instructions](https://www.hostinger.com/tutorials/how-to-unzip-files#:~:text=The%20Windows%20default%20support%20for%20.zip) and [Mac instructions](https://www.hostinger.com/tutorials/how-to-unzip-files#:~:text=Archive%20Utility%20is%20Mac%E2%80%99s%20built-in%20tool%20that%20handles%20the%20.zip%20format.)). You should now have a folder inside `data-a-user-manual` called `narratives`, inside of which are four `.txt` files.

### Working with files

Working with files and folders is a common task in Python. There is a convenient library that will help you do this called `os` (operating system). This comes pre-installed with Anaconda, but you need to tell Python to load it into your notebook so you can begin using it. 

- To do this, type `import os` in your first code cell and run the cell to load the library.
- To see if it worked, try adding a new code cell and typing `os.getcwd()`. This should show the filepath of your current folder.

### Opening and reading a file

Your end goal is to open and access the text of the four text files inside `narratives`. For now, let's establish how to do that with just one of the files - Sojourner Truth's narrative. 

- How would you `open()` and `read()` her narrative in your notebook? If you need [a reminder on opening and reading files](https://melaniewalsh.github.io/Intro-Cultural-Analytics/02-Python/07-Files-Character-Encoding.html).
- Assign the text of Truth's narrative to a new variable called `truth`. 
- Print the first 100 characters (letters) of her narrative to make sure it worked.

### Opening multiple files

Now that we've established how to open and access one file, the next step is to apply that process to all four files. We could, of course, copy and paste our code four times and adjust it each time to open a different file. But what if we had 400 files? Or 4,000 files? The power of coding comes from being able to scale up these kinds of basic processes, and one way to do this is using a `for loop`. In our case, we're going to first generate a list of the names of our text files and then use a `for loop` to iterate through that list and open the files themselves sequentially.

- The `os` directory has a useful function called `os.listdir()` which tells you the names of all the files inside a folder. In this case, we want to point it at the `narratives` folder. To do so, you put the path of the folder inside the parentheses. In our case, we're already inside the `lists-and-loops` folder, so we can point it to our subfolder by writing: `os.listdir('narratives/')`. 
- This should print out a `list` of filenames: `['truth.txt', 'douglass.txt', 'smith.txt', 'brown.txt']`. Just running the os.listdir() command, however, doesn't store the output anywhere. Create a variable called `file_list` and assign it to `os.listdir('narratives/')`. 
- Display the 2nd item in your `file_list` to make sure it's working.
- Write a `for loop` to go through your `file_list`. To check and see if your loop is working, use a `print()` statement inside your loop that displays the name of the file.
- Take the same structure of code you wrote above when you were *just* opening and loading Truth's narrative, but figure out how you would apply it inside your for loop to each file.

### Storing and working with the contents of our files

Once you've successfully figured out how to loop through your files to open() and read() each of them, the next step is to store their contents in a new list so we can work with the data with subsequent code. The goal is to loop through our files, open and read their contents, and then add their contents to a separate list. [If you need a refresher...](https://melaniewalsh.github.io/Intro-Cultural-Analytics/02-Python/10-Lists-Loops-Part2.html#:~:text=we%20can%20also%20make%20lists%20with%20for%20loops.)

- Copy and paste the same for loop you wrote above to open each file into a new code cell.
- *Before* the for loop starts, you want to create an empty list that you will then be adding the contents of our files into, with each narrative a separate item in our list. Add this line above your for loop: `text_list=[]`
- Inside the for loop, make a new variable called `contents` and assign it the full text from each narrative (using the code you copy and pasted).
- Use `list.append()` to add the `contents` variable to our `text_list`. 
- Check to see if it worked by printing the first item in `text_list` - you should see a ton of text displayed on your screen!
- What if we only wanted our `text_list` to contain Truth, Smith, and Douglass's narratives? How would you use `list.remove()` to take Brown's narrative out of our list?
- Write a `for loop` that goes through `text_list` and prints the length of each narrative as measured by number of characters (letters) in the file.

### Bonus Practice

- Write a `for loop` that prints the length of each narrative as measured by **number of words** and then by the **number of lines**. Hint: use `string.split()`.

