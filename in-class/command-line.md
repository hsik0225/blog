---
layout: page
title: The Command Line
---

Today we're going to be practicing how to work with the command line! 

### Part 1

Go through [The Command Line](https://info1350.github.io/Intro-CA-SP21/01-Command-Line/01-The-Command-Line.html) from Melanie Walsh, *Introduction to Cultural Analytics & Python* textbook. Stop when you get to the section "Working with Files and Texts." Now try to put into practice what you've learned! Launch the command line on your computer and then use it to complete the following:

- Print the current directory and make sure you are in your home folder. There should be something like /User/yourlogin/ or 
- If for some reason you are not in your home folder, then run `cd ~`
- Show all the folders/files in your home folder.
- Make a new directory in your home folder called `data`
- Wait, that's way too general a name. Use the command line to delete the `data` folder
- Make a new directory in your home folder called `data-a-user-manual`. This is going to be the starting point for your work in this class moving forward.
- Show all the folders/files in your home folder. *Is there now a folder called `data-a-user-manual`?*
- Navigate so that you're inside `data-a-user-manual` folder. 
- Create a new folder inside `data-a-user-manual` called `command-line`.
- Navigate inside `command-line`
- Now navigate back UP one folder to `data-a-user-manual`

Let Professor Blevins know if you're running into any issues!

### Part 2

Continue through [The Command Line](https://info1350.github.io/Intro-CA-SP21/01-Command-Line/01-The-Command-Line.html), starting with  "Working with Files and Texts" and going through to the end. Now try to put into practice what you've learned! Go back to the command line on your computer and then use it to complete the following:

- Navigate to `command-line` folder you created.
- Use the `curl` command to download into your folder the raw text file (ending in .txt) for Harriet Jacobs *Incidents in the Life of a Slave Girl, Written by Herself* from Project Gutenberg: <https://gutenberg.org/ebooks/11030>. 
  - Hint 1: you need to find a URL for the "Plain Text" of this book. Look at Walsh's example of *The Yellow Wallpaper* and see if you can figure out how to do this with a different text.
  - Hint 2: the letter after `curl` is an upper-case o (O) not a zero (0)
- Check to make sure you downloaded the file by showing the contents of your folder
- Rename  the file you just downloaded `jacobs.txt`. Check to make sure it worked by showing the contents of your folder.
- How many **words** are in the text you just downloaded?
- How many **lines** are in the text you just downloaded? 
- Use `grep` command to display: 
  - Every line in your file where Jacobs writes "God"
  - The line number 
  - The word "God" colored in red
- How many times does Jacobs use the word "God"?


