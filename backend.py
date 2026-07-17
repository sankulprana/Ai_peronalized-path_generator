from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os
from datetime import datetime
import json
import hashlib

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

# Data storage (in-memory for simplicity - use database in production)
users = {
    'learner.demo@gmail.com': {
        'name': 'Demo Learner',
        'email': 'learner.demo@gmail.com',
        'password_hash': hash_password('password123')
    }
}
learner_profiles = {}
skill_assessments = {}
learning_paths = {}
progress_data = {}

# User achievements tracking (XP, streak, last active date, badges)
user_achievements = {}

def get_user_achievements(user_id):
    if user_id not in user_achievements:
        user_achievements[user_id] = {
            'xp': 50,
            'streak': 1,
            'last_active': datetime.now().strftime('%Y-%m-%d'),
            'badges': ['first_steps']
        }
    return user_achievements[user_id]

# Pre-defined domain roadmaps with resources, practice quizzes and challenges
DOMAINS_ROADMAPS = {
    'web-development': [
        {
            "id": "wd_1",
            "phase": "Phase 1: Frontend Foundations",
            "title": "HTML Semantic Layouts",
            "description": "Learn semantic grids, custom media queries, and modern flexbox structures for search engine optimized layouts.",
            "xpReward": 50,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=UB1O30zR-EE",
                "youtubeTitle": "HTML & CSS Full Course for Beginners by freeCodeCamp",
                "docs": "https://developer.mozilla.org/en-US/docs/Web/HTML",
                "docsTitle": "MDN Web Docs: HTML basics",
                "course": "HTML and CSS: Design and Build Websites"
            },
            "quiz": {
                "questions": [
                    {"question": "Which HTML5 element represents self-contained content?", "options": ["<article>", "<section>", "<div>", "<aside>"], "answer": 0},
                    {"question": "What is the correct tag for site-wide navigation?", "options": ["<navigation>", "<nav>", "<menu>", "<ul>"], "answer": 1},
                    {"question": "Which tag represents the dominant content of the body?", "options": ["<main>", "<primary>", "<section>", "<div>"], "answer": 0}
                ]
            },
            "challenge": {
                "title": "Create a Semantic Layout Header",
                "description": "Complete the HTML header structure below. It must contain a <header> element with a <nav> containing an unordered list with three items: Home, About, and Contact.",
                "placeholder": "<!-- Write your HTML structure here -->\n<header>\n  \n</header>",
                "testCase": "code.includes('<header>') && code.includes('<nav>') && code.includes('<ul>') && code.includes('<li>') && code.includes('Home') && code.includes('About') && code.includes('Contact')"
            }
        },
        {
            "id": "wd_2",
            "phase": "Phase 1: Frontend Foundations",
            "title": "CSS Grid & Responsive Design",
            "description": "Master flexible grids, CSS grid-template-areas, CSS variables, and fluid typography rules.",
            "xpReward": 50,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=rg7Fvvl3taU",
                "youtubeTitle": "CSS Grid Tutorial by Traversy Media",
                "docs": "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout",
                "docsTitle": "MDN Web Docs: CSS Grid Layout",
                "course": "CSS - The Complete Guide 2026"
            },
            "quiz": {
                "questions": [
                    {"question": "Which property defines a grid container?", "options": ["display: grid-layout", "display: table-grid", "display: grid", "grid-template: columns"], "answer": 2},
                    {"question": "How do you make grid items span multiple tracks?", "options": ["grid-span", "grid-column / grid-row", "track-span", "grid-area-span"], "answer": 1},
                    {"question": "Which unit represents a fraction of the free space in CSS Grid?", "options": ["fr", "flex", "%", "px"], "answer": 0}
                ]
            },
            "challenge": {
                "title": "Create a 3-Column Responsive Grid",
                "description": "Write a CSS rule for a grid container that creates 3 equal columns of size 1fr using the repeat function.",
                "placeholder": "/* Write your CSS rules here */\n.grid-container {\n  display: grid;\n  \n}",
                "testCase": "code.includes('display:\\s*grid') && code.includes('grid-template-columns') && code.includes('repeat(3,\\s*1fr)')"
            }
        },
        {
            "id": "wd_3",
            "phase": "Phase 2: Modern JS & Dynamic Logic",
            "title": "JavaScript ES6+ & Promises",
            "description": "Master arrow functions, array destructuring, fetch requests, and promise chains.",
            "xpReward": 60,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=hdI2bqOjy3c",
                "youtubeTitle": "JavaScript ES6+ Tutorial by Programming with Mosh",
                "docs": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
                "docsTitle": "MDN Web Docs: JavaScript Reference",
                "course": "The Complete JavaScript Course: From Zero to Expert!"
            },
            "quiz": {
                "questions": [
                    {"question": "What is the output of `typeof []` in JavaScript?", "options": ["array", "list", "object", "undefined"], "answer": 2},
                    {"question": "Which JS method returns a new array with all elements that pass a test?", "options": ["map()", "filter()", "find()", "reduce()"], "answer": 1},
                    {"question": "Which keyword is used to handle asynchronous operations cleanly?", "options": ["wait", "async/await", "then", "defer"], "answer": 1}
                ]
            },
            "challenge": {
                "title": "Filter Even Numbers",
                "description": "Write a JavaScript function `filterEvens(arr)` that filters an array of numbers and returns a new array with only the even numbers.",
                "placeholder": "function filterEvens(arr) {\n  // Write your code here\n  \n}",
                "testCase": "code.includes('filter') && code.includes('return')"
            }
        },
        {
            "id": "wd_4",
            "phase": "Phase 3: Frontend Frameworks",
            "title": "React Components & React Hooks",
            "description": "Build modern functional components using useState, useEffect, and custom hooks.",
            "xpReward": 70,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
                "youtubeTitle": "React JS Full Course for Beginners by freeCodeCamp",
                "docs": "https://react.dev",
                "docsTitle": "React Official Documentation",
                "course": "React - The Complete Guide (incl. Hooks, Router)"
            },
            "quiz": {
                "questions": [
                    {"question": "Which React hook runs side effects in functional components?", "options": ["useState", "useEffect", "useContext", "useReducer"], "answer": 1},
                    {"question": "What must React components return?", "options": ["JSX", "HTML string", "JavaScript function", "Objects only"], "answer": 0},
                    {"question": "How do you pass data from a parent component to a child?", "options": ["State", "Props", "Direct call", "API fetch"], "answer": 1}
                ]
            },
            "challenge": {
                "title": "Toggle Component Hook",
                "description": "Complete the React code snippet to initialize a state variable `isOpen` to `false` using the `useState` hook.",
                "placeholder": "import React, { useState } from 'react';\n\nfunction ToggleButton() {\n  // Initialize state here:\n  const [isOpen, setIsOpen] = useState(false);\n  \n  return <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Open' : 'Closed'}</button>;\n}",
                "testCase": "code.includes('useState(false)') && code.includes('isOpen') && code.includes('setIsOpen')"
            }
        },
        {
            "id": "wd_5",
            "phase": "Phase 4: Backend & APIs",
            "title": "Node.js Express APIs & Databases",
            "description": "Build HTTP servers in Express, wire up SQL queries, and design REST endpoints.",
            "xpReward": 80,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=Oe421EPjeBE",
                "youtubeTitle": "Node.js and Express Tutorial by freeCodeCamp",
                "docs": "https://expressjs.com",
                "docsTitle": "ExpressJS Official Website",
                "course": "Node.js, Express & MongoDB Developer Bootcamp"
            },
            "quiz": {
                "questions": [
                    {"question": "Which method is used in Express to define a POST route?", "options": ["app.post()", "app.send()", "app.create()", "app.request()"], "answer": 0},
                    {"question": "What is the purpose of middleware in Express?", "options": ["To compile JS", "To process requests before handlers run", "To connect frontend UI", "To format databases"], "answer": 1},
                    {"question": "Which HTTP status code represents 'Internal Server Error'?", "options": ["200", "400", "404", "500"], "answer": 3}
                ]
            },
            "challenge": {
                "title": "Create an Express GET Route",
                "description": "Write an Express GET route handler for the path '/api/status' that returns a JSON object: `{ 'status': 'OK' }`.",
                "placeholder": "const express = require('express');\nconst app = express();\n\n// Write your GET route below:\n",
                "testCase": "code.includes('get') && code.includes('/api/status') && code.includes('status') && code.includes('OK') && code.includes('json')"
            }
        }
    ],
    'data-science': [
        {
            "id": "ds_1",
            "phase": "Phase 1: Fundamentals",
            "title": "Python Basics & Slicing",
            "description": "Learn syntax, list comprehensions, slicing, and clean coding paradigms in Python.",
            "xpReward": 50,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=rfscVS0vtbw",
                "youtubeTitle": "Python for Beginners by Programming with Mosh",
                "docs": "https://docs.python.org/3/",
                "docsTitle": "Python Official Documentation",
                "course": "Python for Data Science (Udemy)"
            },
            "quiz": {
                "questions": [
                    {"question": "How do you select elements from index 2 to 5 (exclusive) in a Python list `x`?", "options": ["x[2:5]", "x[2-5]", "x[2 to 5]", "x[3:5]"], "answer": 0},
                    {"question": "Which collection type is unordered, mutable, and key-value based?", "options": ["List", "Tuple", "Dictionary", "Set"], "answer": 2},
                    {"question": "What does `def` represent in Python?", "options": ["Define variable", "Default", "Define function", "Define class"], "answer": 2}
                ]
            },
            "challenge": {
                "title": "List Comprehension Square",
                "description": "Write a Python function `square_list(arr)` that returns a list of squares for each number in `arr` using list comprehension.",
                "placeholder": "def square_list(arr):\n    # Write your list comprehension here\n    return ",
                "testCase": "code.includes('for') && code.includes('in') && (code.includes('**2') || code.includes('* x') || code.includes('** 2'))"
            }
        },
        {
            "id": "ds_2",
            "phase": "Phase 1: Fundamentals",
            "title": "Numpy Array Calculations",
            "description": "Master array math, broadcasting, boolean indexing, and matrix operations in Numpy.",
            "xpReward": 50,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=QUT1VHiLgKQ",
                "youtubeTitle": "NumPy Full Tutorial by freeCodeCamp",
                "docs": "https://numpy.org/doc/stable/",
                "docsTitle": "NumPy Reference Manual",
                "course": "Data Science Boot Camp Numpy Basics"
            },
            "quiz": {
                "questions": [
                    {"question": "Which property returns the dimensions of a NumPy array?", "options": ["array.dims", "array.size", "array.shape", "array.length"], "answer": 2},
                    {"question": "What is array broadcasting in NumPy?", "options": ["Streaming arrays on networks", "Performing operations on arrays of different shapes", "Reshaping arrays", "Concatenating arrays"], "answer": 1},
                    {"question": "Which function is used to create an array of all zeros?", "options": ["np.empty()", "np.zeros()", "np.nulls()", "np.create_zeros()"], "answer": 1}
                ]
            },
            "challenge": {
                "title": "Array Matrix Multiplication",
                "description": "Write a Python snippet to multiply two NumPy matrices `A` and `B` using the dot product method or `@` operator.",
                "placeholder": "import numpy as np\n\ndef matrix_mult(A, B):\n    # Return matrix multiplication here\n    return ",
                "testCase": "code.includes('@') || code.includes('dot') || code.includes('matmul')"
            }
        },
        {
            "id": "ds_3",
            "phase": "Phase 2: Data wrangling",
            "title": "Pandas DataFrames & Manipulation",
            "description": "Learn cleaning datasets, merging tables, grouping metrics, and filtering rows.",
            "xpReward": 60,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=VM7E89WECXo",
                "youtubeTitle": "Pandas Tutorial by Corey Schafer",
                "docs": "https://pandas.pydata.org/docs/",
                "docsTitle": "Pandas Documentation",
                "course": "Python for Data Analysis & Visualization"
            },
            "quiz": {
                "questions": [
                    {"question": "Which Pandas function is used to load a CSV file into a DataFrame?", "options": ["pd.load_csv()", "pd.read_csv()", "pd.open_csv()", "pd.csv_to_df()"], "answer": 1},
                    {"question": "How do you drop columns with missing data in Pandas?", "options": ["df.drop_na()", "df.dropna(axis=1)", "df.remove_missing()", "df.dropna(axis=0)"], "answer": 1},
                    {"question": "Which function groupings allow aggregate calculations in Pandas?", "options": ["df.groupby()", "df.aggregate()", "df.sum_by()", "df.group()"], "answer": 0}
                ]
            },
            "challenge": {
                "title": "Filter DataFrame Rows",
                "description": "Write a snippet to filter rows in a DataFrame `df` where the column 'Age' is greater than 30.",
                "placeholder": "import pandas as pd\n\ndef filter_age(df):\n    # Return filtered DataFrame\n    return ",
                "testCase": "code.includes('df') && code.includes('Age') && code.includes('>') && code.includes('30')"
            }
        },
        {
            "id": "ds_4",
            "phase": "Phase 3: Database query",
            "title": "SQL Database Queries & Joins",
            "description": "Master SQL aggregations, inner joins, subqueries, and table grouping.",
            "xpReward": 70,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
                "youtubeTitle": "SQL Full Course for Beginners by freeCodeCamp",
                "docs": "https://www.postgresql.org/docs/",
                "docsTitle": "PostgreSQL Official Documentation",
                "course": "SQL & Databases for Business Analysts"
            },
            "quiz": {
                "questions": [
                    {"question": "Which SQL join returns all rows when there is a match in either table?", "options": ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], "answer": 3},
                    {"question": "How do you filter results returned by a GROUP BY clause in SQL?", "options": ["WHERE", "HAVING", "FILTER", "LIMIT"], "answer": 1},
                    {"question": "Which aggregate function returns the total number of records?", "options": ["SUM()", "COUNT()", "TOTAL()", "MAX()"], "answer": 1}
                ]
            },
            "challenge": {
                "title": "Write an INNER JOIN Query",
                "description": "Complete the SQL query to join the `orders` and `customers` tables on `customer_id`.",
                "placeholder": "SELECT orders.id, customers.name\nFROM orders\n-- Add INNER JOIN statement below:\n",
                "testCase": "code.lower().includes('inner join') && code.lower().includes('on') && code.lower().includes('customer_id')"
            }
        },
        {
            "id": "ds_5",
            "phase": "Phase 4: Exploration",
            "title": "Matplotlib & Seaborn Plots",
            "description": "Draw scatter charts, boxplots, histograms, and heatmaps for statistical review.",
            "xpReward": 80,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=DAQNHzOcO5A",
                "youtubeTitle": "Matplotlib & Seaborn Tutorial by freeCodeCamp",
                "docs": "https://matplotlib.org/stable/users/index.html",
                "docsTitle": "Matplotlib User Guide",
                "course": "Data Visualization Masterclass in Python"
            },
            "quiz": {
                "questions": [
                    {"question": "Which plot is best for illustrating correlations between two continuous variables?", "options": ["Histogram", "Bar Chart", "Scatter Plot", "Pie Chart"], "answer": 2},
                    {"question": "What is the primary benefit of Seaborn over Matplotlib?", "options": ["Higher speed", "Simpler syntax for statistical plotting and themes", "Interactive 3D rendering", "Ability to run on web browsers natively"], "answer": 1},
                    {"question": "Which command displays the generated plot on screen in Matplotlib?", "options": ["plt.display()", "plt.show()", "plt.plot()", "plt.render()"], "answer": 1}
                ]
            },
            "challenge": {
                "title": "Draw a Scatter Plot",
                "description": "Complete the Python code to draw a scatter plot of `x` vs `y` using Matplotlib.",
                "placeholder": "import matplotlib.pyplot as plt\n\ndef draw_scatter(x, y):\n    # Write scatter plot code here\n    \n    plt.show()",
                "testCase": "code.includes('scatter') && code.includes('plt.')"
            }
        }
    ],
    'ai-ml': [
        {
            "id": "ai_1",
            "phase": "Phase 1: Math Foundations",
            "title": "Python & Linear Algebra",
            "description": "Learn vectors, matrices, dot products, and basic linear algebraic calculations in Python.",
            "xpReward": 50,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=fNk_zzaMoEs",
                "youtubeTitle": "Linear Algebra for Machine Learning by 3Blue1Brown",
                "docs": "https://numpy.org/doc/stable/reference/routines.linalg.html",
                "docsTitle": "NumPy Linear Algebra Reference",
                "course": "Mathematics for Machine Learning: Linear Algebra"
            },
            "quiz": {
                "questions": [
                    {"question": "What is a matrix in linear algebra?", "options": ["A 1D array of elements", "A 2D grid of numbers", "A scalar value", "A programming loop"], "answer": 1},
                    {"question": "What does the dot product of two perpendicular vectors equal?", "options": ["1", "-1", "0", "Infinity"], "answer": 2},
                    {"question": "Which NumPy function is used to transpose a matrix `A`?", "options": ["np.transpose(A) or A.T", "np.invert(A)", "A.reshape()", "A.reverse()"], "answer": 0}
                ]
            },
            "challenge": {
                "title": "Compute Matrix Transpose",
                "description": "Write a Python snippet using NumPy that takes a matrix `M` and returns its transpose.",
                "placeholder": "import numpy as np\n\ndef get_transpose(M):\n    # Return the transpose of M\n    return ",
                "testCase": "code.includes('.T') || code.includes('transpose')"
            }
        },
        {
            "id": "ai_2",
            "phase": "Phase 2: Supervised Learning",
            "title": "Supervised Learning & Regression",
            "description": "Master linear regression, cost functions, gradient descent, and evaluation metrics.",
            "xpReward": 50,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=JcI5V12B580",
                "youtubeTitle": "Linear Regression Complete Tutorial by StatQuest",
                "docs": "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html",
                "docsTitle": "Scikit-Learn LinearRegression Docs",
                "course": "Machine Learning Specialization by Andrew Ng"
            },
            "quiz": {
                "questions": [
                    {"question": "What is the primary goal of linear regression?", "options": ["To classify image classes", "To model relations by fitting a linear equation to observed data", "To cluster similar data points", "To reduce matrix dimensions"], "answer": 1},
                    {"question": "What is the cost function used to measure in regression?", "options": ["Computation speed", "Memory layout", "Error between predicted and actual values", "Number of training loops"], "answer": 2},
                    {"question": "Which algorithm is commonly used to minimize the cost function?", "options": ["Binary search", "Gradient Descent", "Dijkstra's Algorithm", "Random Search"], "answer": 1}
                ]
            },
            "challenge": {
                "title": "Train a Linear Model",
                "description": "Complete the Python code using Scikit-Learn to fit a `LinearRegression` model using training data `X` and `y`.",
                "placeholder": "from sklearn.linear_model import LinearRegression\n\ndef train_model(X, y):\n    model = LinearRegression()\n    # Fit the model and return it:\n    \n    return model",
                "testCase": "code.includes('fit(X, y)') || code.includes('fit')"
            }
        },
        {
            "id": "ai_3",
            "phase": "Phase 2: Supervised Learning",
            "title": "Classification & Decision Trees",
            "description": "Learn classification metrics (precision, recall), logistic regression, and decision tree structures.",
            "xpReward": 60,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=_L39rEsx-LY",
                "youtubeTitle": "Decision Trees Explained by StatQuest",
                "docs": "https://scikit-learn.org/stable/modules/tree.html",
                "docsTitle": "Scikit-Learn Decision Trees Docs",
                "course": "Intro to Machine Learning with PyTorch & Scikit"
            },
            "quiz": {
                "questions": [
                    {"question": "Which metric is the ratio of correctly predicted positive observations to the total predicted positives?", "options": ["Accuracy", "Precision", "Recall", "F1 Score"], "answer": 1},
                    {"question": "Which algorithm splits data nodes based on information gain or Gini impurity?", "options": ["K-Means", "Linear Regression", "Decision Tree", "Neural Network"], "answer": 2},
                    {"question": "What is overfitting in machine learning?", "options": ["Model performs well on training data but poorly on unseen test data", "Model cannot learn the pattern from training data", "Model training is too fast", "Model has too few parameters"], "answer": 0}
                ]
            },
            "challenge": {
                "title": "Evaluate Model Precision",
                "description": "Write a snippet using Scikit-Learn that computes the precision score given true labels `y_true` and predicted labels `y_pred`.",
                "placeholder": "from sklearn.metrics import precision_score\n\ndef get_precision(y_true, y_pred):\n    # Return the precision score\n    return ",
                "testCase": "code.includes('precision_score(y_true, y_pred)') || code.includes('precision_score')"
            }
        },
        {
            "id": "ai_4",
            "phase": "Phase 3: Neural Networks",
            "title": "Neural Networks & Deep Learning",
            "description": "Understand artificial neurons, activation functions (ReLU, Sigmoid), backpropagation, and multi-layer perceptrons.",
            "xpReward": 70,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=aircAruvnKk",
                "youtubeTitle": "But what is a neural network? by 3Blue1Brown",
                "docs": "https://www.tensorflow.org/guide/keras/sequential_model",
                "docsTitle": "Keras Sequential Model Guide",
                "course": "Deep Learning Specialization (Coursera)"
            },
            "quiz": {
                "questions": [
                    {"question": "What is the purpose of an activation function in neural networks?", "options": ["To normalize input speeds", "To introduce non-linearity", "To compute gradients", "To store node weights"], "answer": 1},
                    {"question": "Which activation function is defined as f(x) = max(0, x)?", "options": ["Sigmoid", "Tanh", "ReLU", "Softmax"], "answer": 2},
                    {"question": "What is backpropagation?", "options": ["Saving files to disk", "Propagating input values forward", "Calculating gradients of the loss function to update neural network weights", "Initializing weights to zero"], "answer": 2}
                ]
            },
            "challenge": {
                "title": "Add a Dense Layer in Keras",
                "description": "Complete the Keras Sequential model definition below by adding a Dense layer with 64 units and a 'relu' activation function.",
                "placeholder": "from tensorflow.keras.models import Sequential\nfrom tensorflow.keras.layers import Dense\n\ndef build_model():\n    model = Sequential([\n        # Add Dense layer here:\n        \n    ])\n    return model",
                "testCase": "code.includes('Dense') && code.includes('64') && code.includes('relu')"
            }
        },
        {
            "id": "ai_5",
            "phase": "Phase 4: Advanced Tuning",
            "title": "Model Tuning & Hyperparameters",
            "description": "Master cross-validation, grid search, learning rates, and regularization (L1/L2) to prevent overfitting.",
            "xpReward": 80,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=1VbSnhG2VQA",
                "youtubeTitle": "GridSearchCV and Hyperparameter Tuning by codebasics",
                "docs": "https://scikit-learn.org/stable/modules/grid_search.html",
                "docsTitle": "Scikit-Learn Grid Search Guide",
                "course": "Machine Learning Engineering for Production (MLOps)"
            },
            "quiz": {
                "questions": [
                    {"question": "What is cross-validation used for?", "options": ["To encrypt training models", "To assess how the results of a statistical analysis will generalize to an independent dataset", "To double model parameters", "To speed up matrix dot products"], "answer": 1},
                    {"question": "What does L2 regularization (Ridge) add to the loss function?", "options": ["Sum of absolute values of weights", "Sum of squared values of weights", "Square root of gradients", "Maximum value of inputs"], "answer": 1},
                    {"question": "What happens if the learning rate is too high in gradient descent?", "options": ["The algorithm will never start", "The algorithm may overshoot the minimum and fail to converge", "The model overfitting increases", "The parameters will freeze to zero"], "answer": 1}
                ]
            },
            "challenge": {
                "title": "Grid Search Hyperparameters",
                "description": "Complete the Scikit-Learn code to instantiate a `GridSearchCV` using a classifier `clf` and parameter grid `param_grid`.",
                "placeholder": "from sklearn.model_selection import GridSearchCV\n\ndef get_search(clf, param_grid):\n    # Return GridSearchCV instance\n    return ",
                "testCase": "code.includes('GridSearchCV(clf, param_grid)') || code.includes('GridSearchCV')"
            }
        }
    ],
    'cybersecurity': [
        {
            "id": "sec_1",
            "phase": "Phase 1: Foundations",
            "title": "Linux Command Line Basics",
            "description": "Learn shell navigation, file permissions, pipe commands, and process management in Linux.",
            "xpReward": 50,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=wbpDKzK_1c0",
                "youtubeTitle": "Linux Command Line for Beginners by freeCodeCamp",
                "docs": "https://www.linux.org/pages/manual/",
                "docsTitle": "Linux Official Manual Pages",
                "course": "Introduction to Linux for Cybersecurity"
            },
            "quiz": {
                "questions": [
                    {"question": "Which command displays your current working directory in Linux?", "options": ["ls", "dir", "pwd", "cd"], "answer": 2},
                    {"question": "What does the command `chmod 755 filename` do?", "options": ["Deletes the file", "Gives read, write, execute to owner, and read/execute to group/others", "Hides the file from search", "Encrypts the file with a password"], "answer": 1},
                    {"question": "Which character is used to pipe the output of one command as input to another?", "options": [">", "<", "|", "&"], "answer": 2}
                ]
            },
            "challenge": {
                "title": "Find Word in File Command",
                "description": "Write a Linux bash command string to search for the word 'admin' in a file called `access.log` using the `grep` utility.",
                "placeholder": "# Enter your shell command as a string below:\nconst command = \"\";",
                "testCase": "code.includes('grep') && code.includes('admin') && code.includes('access.log')"
            }
        },
        {
            "id": "sec_2",
            "phase": "Phase 2: Networking",
            "title": "Computer Networking & Wireshark",
            "description": "Learn TCP/IP stacks, DNS protocol, routing concepts, and analyze packet files in Wireshark.",
            "xpReward": 50,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=qiQR5rTSshw",
                "youtubeTitle": "Computer Networking Full Course by freeCodeCamp",
                "docs": "https://www.wireshark.org/docs/",
                "docsTitle": "Wireshark Documentation Library",
                "course": "CompTIA Network+ Certification Preparation"
            },
            "quiz": {
                "questions": [
                    {"question": "Which layer of the OSI model is responsible for IP routing?", "options": ["Data Link", "Transport", "Network", "Application"], "answer": 2},
                    {"question": "Which port number is standard for HTTPS traffic?", "options": ["80", "22", "443", "8080"], "answer": 2},
                    {"question": "What does DNS stand for?", "options": ["Data Network System", "Domain Name System", "Dynamic Node Service", "Distributed Name Server"], "answer": 1}
                ]
            },
            "challenge": {
                "title": "Configure HTTP Port Check",
                "description": "Write a JavaScript conditional that checks if a variable `port` is equal to the standard HTTP port (80) or the standard HTTPS port (443).",
                "placeholder": "function isStandardWebPort(port) {\n  // Return true if standard HTTP/HTTPS port, otherwise false\n  return \n}",
                "testCase": "code.includes('80') && code.includes('443')"
            }
        },
        {
            "id": "sec_3",
            "phase": "Phase 3: Cryptography",
            "title": "Cryptography & Secure Hashing",
            "description": "Learn symmetric vs asymmetric encryption, key exchanges, and hashing functions (SHA-256).",
            "xpReward": 60,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=N3bxcpply6M",
                "youtubeTitle": "Cryptography Full Course by freeCodeCamp",
                "docs": "https://docs.python.org/3/library/hashlib.html",
                "docsTitle": "Python Hashlib Module Docs",
                "course": "Cryptography in Cyber Defense (Coursera)"
            },
            "quiz": {
                "questions": [
                    {"question": "What is the main difference between symmetric and asymmetric encryption?", "options": ["Symmetric uses one key for encryption/decryption; asymmetric uses a public/private key pair", "Symmetric encryption is only for files; asymmetric is only for networks", "Symmetric uses public keys; asymmetric uses secret passwords", "Symmetric cannot be decrypted"], "answer": 0},
                    {"question": "Which cryptographic function is one-way only (cannot be reversed)?", "options": ["AES-256", "RSA", "Hashing (e.g. SHA-256)", "DES"], "answer": 2},
                    {"question": "What is 'salting' in password hashing?", "options": ["Encrypting the database configuration", "Adding random characters to passwords before hashing to protect against rainbow table attacks", "Compressing the hashed passwords", "Sharing the keys over secure tunnels"], "answer": 1}
                ]
            },
            "challenge": {
                "title": "Compute SHA-256 Hash",
                "description": "Complete the Python code using the `hashlib` library to hash the string 'security101' in UTF-8 and return its hexadecimal representation.",
                "placeholder": "import hashlib\n\ndef get_sha256(text):\n    # Return the SHA-256 hex digest\n    return ",
                "testCase": "code.includes('sha256') && code.includes('hexdigest')"
            }
        },
        {
            "id": "sec_4",
            "phase": "Phase 4: Web Security",
            "title": "Web App Security & OWASP Top 10",
            "description": "Learn SQL injection, Cross-Site Scripting (XSS), cross-site request forgery, and mitigation strategies.",
            "xpReward": 70,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=2fEl3cKpytI",
                "youtubeTitle": "Web Security & OWASP Top 10 by freeCodeCamp",
                "docs": "https://owasp.org/www-project-top-ten/",
                "docsTitle": "OWASP Top 10 Project Page",
                "course": "Certified Ethical Hacker (CEH) Web Hacking"
            },
            "quiz": {
                "questions": [
                    {"question": "What is SQL Injection (SQLi)?", "options": ["Overloading databases with spam requests", "Injecting malicious SQL commands into form fields to hijack database queries", "Downloading the database content locally", "Compiling SQL queries to C code"], "answer": 1},
                    {"question": "How do you protect against Cross-Site Scripting (XSS) in web applications?", "options": ["By using longer passwords", "By sanitizing and escaping all user input before rendering it in the DOM", "By disabling the firewall", "By hosting databases in different regions"], "answer": 1},
                    {"question": "What does a CSRF attack do?", "options": ["Forces an authenticated user to execute unwanted actions on a web application in which they are currently authenticated", "Decrypts secure traffic on the server", "Steals the hardware details of the server", "Floods the network with packets"], "answer": 0}
                ]
            },
            "challenge": {
                "title": "Prevent SQL Injection",
                "description": "Which of the following is the best way to prevent SQL Injection in database queries? Enter 'Parameterized Queries' or 'String Formatting'.",
                "placeholder": "// Set bestMethod to: 'Parameterized Queries' or 'String Formatting'\nconst bestMethod = \"\";",
                "testCase": "code.includes('Parameterized Queries')"
            }
        },
        {
            "id": "sec_5",
            "phase": "Phase 5: Defenses",
            "title": "Penetration Testing & Audits",
            "description": "Learn port scanning in Nmap, vulnerability scanning, and compiling professional risk audit reports.",
            "xpReward": 80,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=3Kq1MOf3GSo",
                "youtubeTitle": "Penetration Testing Tutorial by freeCodeCamp",
                "docs": "https://nmap.org/book/man.html",
                "docsTitle": "Nmap Reference Guide",
                "course": "CompTIA PenTest+ Certification Course"
            },
            "quiz": {
                "questions": [
                    {"question": "What is the primary objective of penetration testing?", "options": ["To build frontend UI layouts", "To identify security weaknesses and exploit them in a controlled, legal environment to assess risk", "To write database schemas", "To monitor daily study streaking stats"], "answer": 1},
                    {"question": "Which tool is standard for scanning open ports on target hosts?", "options": ["Nmap", "Wireshark", "Metasploit", "Git"], "answer": 0},
                    {"question": "What is a 'White Hat' hacker?", "options": ["A hacker who breaches systems illegally for profit", "An ethical cybersecurity professional who scans systems with authorization to repair leaks", "A hacker who does not use computers", "A developer who writes React components only"], "answer": 1}
                ]
            },
            "challenge": {
                "title": "Write Nmap Scan Command",
                "description": "Write an Nmap command string to perform a service detection scan (-sV) on the IP address '192.168.1.1'.",
                "placeholder": "# Enter nmap command below as a string:\nconst command = \"\";",
                "testCase": "code.includes('nmap') && code.includes('-sV') && code.includes('192.168.1.1')"
            }
        }
    ],
    'computer-science': [
        {
            "id": "cs_1",
            "phase": "Phase 1: Foundations",
            "title": "Variables, Scopes & Data Types",
            "description": "Learn variable declarations, mutable vs immutable storage types, and scopes in coding.",
            "xpReward": 50,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=zOjov-2OZ0E",
                "youtubeTitle": "Computer Science Basics by freeCodeCamp",
                "docs": "https://developer.mozilla.org/en-US/docs/Glossary/Scope",
                "docsTitle": "MDN Web Docs: Scope definition",
                "course": "Computer Science 101 (edX)"
            },
            "quiz": {
                "questions": [
                    {"question": "What is the difference between global and local scope?", "options": ["Global is readable throughout the script; local is only accessible inside its enclosing block or function", "Global is faster than local", "Global is only for integers; local is for strings", "There is no difference"], "answer": 0},
                    {"question": "Which data type represents a binary True/False?", "options": ["Integer", "String", "Boolean", "Float"], "answer": 2},
                    {"question": "Which array property represents its length in JS?", "options": ["array.size", "array.length", "array.count", "array.width"], "answer": 1}
                ]
            },
            "challenge": {
                "title": "Calculate Area Function",
                "description": "Write a JavaScript function `calcArea(w, h)` that takes width and height and returns the product (area).",
                "placeholder": "function calcArea(w, h) {\n  // Return width * height\n  return \n}",
                "testCase": "code.includes('w * h') || code.includes('w*h')"
            }
        },
        {
            "id": "cs_2",
            "phase": "Phase 2: Algorithms",
            "title": "Control Structures & Loops",
            "description": "Learn loops (for, while), nested conditions, recursion, and search operations.",
            "xpReward": 50,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=hCrO_c227kE",
                "youtubeTitle": "Algorithms and Data Structures by freeCodeCamp",
                "docs": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration",
                "docsTitle": "MDN: Loops & Iterations Guide",
                "course": "Data Structures & Algorithms in Python"
            },
            "quiz": {
                "questions": [
                    {"question": "What is a loop condition used for?", "options": ["To declare functions", "To determine when the loop should stop iterating", "To encrypt strings", "To load HTML tags"], "answer": 1},
                    {"question": "What is recursion?", "options": ["A function that calls itself to solve smaller subproblems", "An infinite loop in memory", "Writing CSS grid rules", "Deploying database queries"], "answer": 0},
                    {"question": "Which loop guarantees that the body runs at least once?", "options": ["for", "while", "do-while", "foreach"], "answer": 2}
                ]
            },
            "challenge": {
                "title": "Write a Loop Condition",
                "description": "Write a JavaScript loop condition checking if `i` is less than `10`.",
                "placeholder": "for (let i = 0; /* condition */; i++) {\n}",
                "testCase": "code.includes('i < 10') || code.includes('i<10')"
            }
        },
        {
            "id": "cs_3",
            "phase": "Phase 3: Core Abstractions",
            "title": "Data Structures (Lists & Dicts)",
            "description": "Understand arrays, linked lists, stacks, queues, hash maps, and key-value dictionaries.",
            "xpReward": 60,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=RBSGKlAoiMs",
                "youtubeTitle": "Data Structures Easy to Advanced by freeCodeCamp",
                "docs": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
                "docsTitle": "MDN: Map object guide",
                "course": "Algorithms & Data Structures Part 1 (Princeton)"
            },
            "quiz": {
                "questions": [
                    {"question": "Which data structure follows Last-In, First-Out (LIFO)?", "options": ["Queue", "Stack", "Linked List", "Tree"], "answer": 1},
                    {"question": "What is the time complexity of looking up a key in a hash map on average?", "options": ["O(N)", "O(log N)", "O(1)", "O(N^2)"], "answer": 2},
                    {"question": "Which structure connects elements using nodes with data and pointer links?", "options": ["Array", "Linked List", "Hash Map", "Tuple"], "answer": 1}
                ]
            },
            "challenge": {
                "title": "Queue Enqueue Operation",
                "description": "Complete the JavaScript class method `enqueue(item)` that appends an item to the end of the `this.items` array.",
                "placeholder": "class Queue {\n  constructor() { this.items = []; }\n  enqueue(item) {\n    // Appends item to this.items\n    \n  }\n}",
                "testCase": "code.includes('push(item)')"
            }
        },
        {
            "id": "cs_4",
            "phase": "Phase 4: Optimization",
            "title": "Big O Notation & Complexities",
            "description": "Master measuring algorithmic efficiencies, worst-case scaling, time-space trade-offs.",
            "xpReward": 70,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=V6mKVRU1evU",
                "youtubeTitle": "Big O Notation Explained by freeCodeCamp",
                "docs": "https://en.wikipedia.org/wiki/Big_O_notation",
                "docsTitle": "Wikipedia: Big O Notation",
                "course": "Analysis of Algorithms (Stanford)"
            },
            "quiz": {
                "questions": [
                    {"question": "What does Big O notation describe?", "options": ["Maximum number of lines in a file", "The worst-case scaling behavior of an algorithm's run-time as input size grows", "Database server memory cost in dollars", "Number of imports in code"], "answer": 1},
                    {"question": "What is the complexity of a nested loop checking all pairs of an N-element array?", "options": ["O(1)", "O(N)", "O(N log N)", "O(N^2)"], "answer": 3},
                    {"question": "Which time complexity is most efficient for large inputs?", "options": ["O(N^2)", "O(N)", "O(log N)", "O(2^N)"], "answer": 2}
                ]
            },
            "challenge": {
                "title": "Write O(1) Access Check",
                "description": "Write a JavaScript function `getFirst(arr)` that accesses the first item of an array, which represents an O(1) constant-time lookup.",
                "placeholder": "function getFirst(arr) {\n  // Return the first element of arr\n  return \n}",
                "testCase": "code.includes('arr[0]')"
            }
        },
        {
            "id": "cs_5",
            "phase": "Phase 5: Deployments",
            "title": "Version Control with Git",
            "description": "Learn branching, commit logs, remote cloning, and staging files in Git.",
            "xpReward": 80,
            "resources": {
                "youtube": "https://www.youtube.com/watch?v=RGOj5yH7evk",
                "youtubeTitle": "Git and GitHub for Beginners by freeCodeCamp",
                "docs": "https://git-scm.com/doc",
                "docsTitle": "Git Documentation Reference Book",
                "course": "Git Masterclass: Branching & Merging"
            },
            "quiz": {
                "questions": [
                    {"question": "Which git command stages all modifications in the current directory?", "options": ["git add .", "git commit -a", "git push", "git save"], "answer": 0},
                    {"question": "What does the command `git checkout -b feature` do?", "options": ["Deletes the feature branch", "Creates and switches to a new branch called feature", "Merges feature into main", "Resets the commits to head"], "answer": 1},
                    {"question": "Which command downloads a copy of a remote repository?", "options": ["git clone", "git fetch", "git pull", "git download"], "answer": 0}
                ]
            },
            "challenge": {
                "title": "Git Commit Command",
                "description": "Write a Git command string to commit staged files with the message 'initial release'.",
                "placeholder": "# Enter your Git command as a string below:\nconst command = \"\";",
                "testCase": "code.includes('git commit') && code.includes('-m') && code.includes('initial release')"
            }
        }
    ]
}

# Served by the serve_react wildcard handler at the bottom

# Load CSV datasets
def load_datasets():
    """Load students and courses CSV files"""
    students_file = 'data/students.csv'
    courses_file = 'data/courses.csv'
    
    students_df = None
    courses_df = None
    
    try:
        if os.path.exists(students_file):
            students_df = pd.read_csv(students_file)
            print(f"Loaded {len(students_df)} student records")
    except Exception as e:
        print(f"Error loading students.csv: {e}")
    
    try:
        if os.path.exists(courses_file):
            courses_df = pd.read_csv(courses_file)
            print(f"Loaded {len(courses_df)} course records")
    except Exception as e:
        print(f"Error loading courses.csv: {e}")
    
    return students_df, courses_df

# Initialize datasets
students_df, courses_df = load_datasets()

def analyze_skill_gaps(assessment_skills, target_domain):
    """
    Improved skill gap analysis with flexible domain matching
    """

    domain_requirements = {
        'computer-science': ['Programming Fundamentals', 'Data Structures', 'Algorithms', 'Software Engineering'],
        'data-science': ['Python', 'Statistics', 'Machine Learning', 'Data Analysis'],
        'web-development': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Database Design'],
        'mobile-development': ['Mobile App Design', 'iOS Development', 'Android Development', 'UI/UX', 'API Integration'],
        'cybersecurity': ['Network Security', 'Ethical Hacking', 'Cryptography', 'Security Analysis'],
        'ai-ml': ['Python', 'Machine Learning', 'Deep Learning', 'Neural Networks'],
        'business': ['Business Strategy', 'Marketing', 'Finance', 'Management'],
        'design': ['UI/UX Design', 'Graphic Design', 'Design Tools', 'User Research'],
        'marketing': ['Digital Marketing', 'SEO', 'Content Marketing', 'Analytics']
    }

    # Normalize domain (VERY IMPORTANT FIX)
    normalized_domain = target_domain.lower().strip().replace(" ", "-")

    required_skills = []

    # Flexible domain matching
    for domain in domain_requirements:
        if domain in normalized_domain or normalized_domain in domain:
            required_skills = domain_requirements[domain]
            break

    # If no match found → fallback to data-science (safe default)
    if not required_skills:
        required_skills = domain_requirements['data-science']

    skill_gaps = []

    for skill in required_skills:
        found = False

        for assessed_skill in assessment_skills:
            if skill.lower() in assessed_skill['name'].lower():
                found = True

                if assessed_skill['level'] <= 2:
                    skill_gaps.append({
                        'name': skill,
                        'current_level': assessed_skill['level'],
                        'recommended_level': 4,
                        'priority': 'High'
                    })
                break

        if not found:
            skill_gaps.append({
                'name': skill,
                'current_level': 0,
                'recommended_level': 3,
                'priority': 'High'
            })

    return skill_gaps


def recommend_courses(learner_profile, assessment_skills, skill_gaps):
    """
    Improved course recommendation logic
    """

    recommendations = []

    if courses_df is not None and not courses_df.empty:

        target_domain = learner_profile.get('currentDomain', '').lower()

        # Flexible filtering
        if 'domain' in courses_df.columns:
            domain_courses = courses_df[
                courses_df['domain'].str.lower().str.contains(target_domain, na=False)
            ]
        else:
            domain_courses = courses_df

        # If no match → use all courses
        if domain_courses.empty:
            domain_courses = courses_df

        for _, course in domain_courses.iterrows():
            score = 0

            course_skills = str(course.get('skills', '')).lower()

            # Skill gap match
            for gap in skill_gaps:
                if gap['name'].lower() in course_skills:
                    score += 3

            # Experience level match
            experience = learner_profile.get('experienceLevel', 'beginner').lower()
            course_level = str(course.get('level', 'beginner')).lower()

            if experience == course_level:
                score += 2

            # Learning style match
            learning_style = learner_profile.get('learningStyle', 'video').lower()
            course_format = str(course.get('format', 'video')).lower()

            if learning_style in course_format:
                score += 1

            # Always allow minimal score
            if score >= 1:
                recommendations.append({
                    'title': course.get('title', 'Unknown Course'),
                    'provider': course.get('provider', 'Unknown'),
                    'level': course.get('level', 'Beginner'),
                    'duration': course.get('duration', 'N/A'),
                    'rating': float(course.get('rating', 0)) if pd.notna(course.get('rating')) else 0,
                    'students': course.get('students', 'N/A'),
                    'description': course.get('description', ''),
                    'score': score
                })

        recommendations.sort(key=lambda x: x['score'], reverse=True)

        if recommendations:
            return recommendations[:10]

    # Guaranteed fallback if CSV fails
    return [{
        'title': 'Python for Data Science',
        'provider': 'Udemy',
        'level': 'Beginner',
        'duration': '30 hours',
        'rating': 4.6,
        'students': '100,000+',
        'description': 'Complete Python guide for Data Science',
        'score': 5
    }]


# API Endpoints

# Served by the serve_react wildcard handler at the bottom

@app.route('/signup', methods=['POST'])
def signup():
    """Register a new user with email and password"""
    try:
        data = request.json or {}
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not name or not email or not password:
            return jsonify({'error': 'Name, email, and password are required'}), 400

        if email in users:
            return jsonify({'error': 'Email is already registered'}), 400

        # Hash password and store user
        users[email] = {
            'name': name,
            'email': email,
            'password_hash': hash_password(password)
        }

        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'userId': email,
            'user': {
                'name': name,
                'email': email
            }
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    """Log in an existing user with email and password"""
    try:
        data = request.json or {}
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        if email not in users:
            return jsonify({'error': 'Invalid email or password'}), 401

        user = users[email]
        if user['password_hash'] != hash_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401

        return jsonify({
            'success': True,
            'message': 'Login successful',
            'userId': email,
            'user': {
                'name': user['name'],
                'email': user['email']
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/register', methods=['POST'])
def register_learner():
    """Register a new learner profile"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['fullName', 'age', 'educationLevel', 'currentDomain', 
                          'careerGoal', 'experienceLevel', 'learningStyle', 'weeklyStudyHours']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if custom user ID is provided (e.g. from Google Auth)
        user_id = data.get('userId')
        if not user_id:
            user_id = f"user_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Store learner profile
        learner_profiles[user_id] = {
            'userId': user_id,
            **data,
            'registeredAt': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'message': 'Learner profile registered successfully',
            'userId': user_id,
            'profile': learner_profiles[user_id]
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/profile/<user_id>', methods=['GET'])
def get_learner_profile(user_id):
    """Retrieve learner profile by user ID"""
    try:
        if user_id in learner_profiles:
            return jsonify({
                'success': True,
                'profile': learner_profiles[user_id]
            }), 200
        return jsonify({
            'success': False,
            'error': 'Profile not found'
        }), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/assessment', methods=['POST'])
def submit_assessment():
    """Submit skill assessment"""
    try:
        data = request.json
        
        # Validate required fields
        if 'userId' not in data:
            return jsonify({'error': 'Missing userId'}), 400
        
        if 'skills' not in data or not isinstance(data['skills'], list):
            return jsonify({'error': 'Missing or invalid skills array'}), 400
        
        user_id = data['userId']
        
        # Validate user exists
        if user_id not in learner_profiles:
            return jsonify({'error': 'User not found. Please register first.'}), 404
        
        # Calculate assessment metrics
        skills = data['skills']
        total_skills = len(skills)
        total_score = sum(skill.get('level', 0) for skill in skills)
        average_level = total_score / total_skills if total_skills > 0 else 0
        
        # Store assessment
        skill_assessments[user_id] = {
            'userId': user_id,
            'skills': skills,
            'totalSkills': total_skills,
            'totalScore': total_score,
            'averageLevel': round(average_level, 2),
            'assessedAt': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'message': 'Skill assessment submitted successfully',
            'assessment': skill_assessments[user_id]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate-path', methods=['POST'])
def generate_learning_path():
    """Generate personalized learning path"""
    try:
        data = request.json
        
        # Validate required fields
        if 'userId' not in data:
            return jsonify({'error': 'Missing userId'}), 400
        
        user_id = data['userId']
        
        # Validate user exists
        if user_id not in learner_profiles:
            return jsonify({'error': 'User not found. Please register first.'}), 404
        
        # Validate assessment exists
        if user_id not in skill_assessments:
            return jsonify({'error': 'Assessment not found. Please submit assessment first.'}), 404
        
        # Get learner profile and assessment
        profile = learner_profiles[user_id]
        assessment = skill_assessments[user_id]
        
        # Perform skill gap analysis
        skill_gaps = analyze_skill_gaps(
            assessment['skills'],
            profile.get('currentDomain', '')
        )
        
        # Get recommended skills (from skill gaps)
        recommended_skills = [
            {
                'name': gap['name'],
                'description': f"Develop {gap['name']} skills to reach level {gap['recommended_level']}",
                'level': 'Beginner' if gap['current_level'] == 0 else 
                        'Intermediate' if gap['current_level'] <= 2 else 'Advanced',
                'priority': gap['priority']
            }
            for gap in skill_gaps
        ]
        
        # Get course recommendations
        recommended_courses = recommend_courses(profile, assessment['skills'], skill_gaps)
        
        # Fetch matching pre-defined milestones
        domain = profile.get('currentDomain', 'web-development')
        domain_milestones = DOMAINS_ROADMAPS.get(domain, DOMAINS_ROADMAPS['computer-science'])
        
        # Copy milestones and set starting status to not-started
        milestones = []
        for ms in domain_milestones:
            m_copy = dict(ms)
            m_copy['status'] = 'not-started'
            milestones.append(m_copy)
            
        # Generate learning path
        learning_path = {
            'userId': user_id,
            'generatedAt': datetime.now().isoformat(),
            'skills': recommended_skills,
            'courses': recommended_courses,
            'milestones': milestones,
            'totalSkills': len(recommended_skills),
            'totalCourses': len(recommended_courses),
            'skillGaps': skill_gaps
        }
        
        # Store learning path
        learning_paths[user_id] = learning_path
        
        # Initialize progress data
        progress_data[user_id] = {
            'skills': [
                {'name': skill['name'], 'progress': 0, 'level': skill['level']}
                for skill in recommended_skills
            ],
            'courses': [
                {'title': course['title'], 'provider': course['provider'], 
                 'progress': 0, 'status': 'not-started'}
                for course in recommended_courses
            ],
            'milestones': [
                {'id': ms['id'], 'title': ms['title'], 'status': 'not-started'}
                for ms in domain_milestones
            ]
        }
        
        # Initialize achievements if not already present
        get_user_achievements(user_id)
        
        return jsonify({
            'success': True,
            'message': 'Learning path generated successfully',
            'learningPath': learning_path
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/dashboard/<user_id>', methods=['GET'])
def get_dashboard_data(user_id):
    """Get dashboard data for a user"""
    try:
        # Check if user exists
        if user_id not in learner_profiles:
            return jsonify({'error': 'User not found'}), 404
        
        # Get progress data
        user_progress = progress_data.get(user_id, {
            'skills': [],
            'courses': [],
            'milestones': []
        })
        
        if 'milestones' not in user_progress and user_id in learning_paths:
            user_progress['milestones'] = [
                {'id': ms['id'], 'title': ms['title'], 'status': ms.get('status', 'not-started')}
                for ms in learning_paths[user_id].get('milestones', [])
            ]
            
        # Calculate statistics
        total_courses = len(user_progress['courses'])
        completed_courses = len([c for c in user_progress['courses'] if c.get('progress', 0) == 100])
        in_progress_courses = len([c for c in user_progress['courses'] 
                                  if 0 < c.get('progress', 0) < 100])
        
        overall_progress = 0
        if total_courses > 0:
            total_progress = sum(c.get('progress', 0) for c in user_progress['courses'])
            overall_progress = round(total_progress / total_courses, 1)
        
        # Calculate skill statistics
        total_skills = len(user_progress['skills'])
        mastered_skills = len([s for s in user_progress['skills'] if s.get('progress', 0) >= 80])
        
        # Calculate average skill level
        avg_level = 0
        if total_skills > 0:
            level_values = {'Beginner': 1, 'Intermediate': 2, 'Advanced': 3}
            total_level = sum(level_values.get(s.get('level', 'Beginner'), 1) 
                            for s in user_progress['skills'])
            avg_level = round(total_level / total_skills, 1)
        
        # Calculate hours completed
        hours_completed = round(sum(c.get('progress', 0) / 100 * 40 for c in user_progress['courses']), 1)
        
        achievements = get_user_achievements(user_id)
        
        # Include milestones completion count in statistics
        total_milestones = len(user_progress.get('milestones', []))
        completed_milestones = len([m for m in user_progress.get('milestones', []) if m.get('status') == 'completed'])
        
        dashboard_data = {
            'userId': user_id,
            'statistics': {
                'totalCourses': total_courses,
                'completedCourses': completed_courses,
                'inProgressCourses': in_progress_courses,
                'overallProgress': overall_progress,
                'totalMilestones': total_milestones,
                'completedMilestones': completed_milestones
            },
            'skills': user_progress['skills'],
            'courses': user_progress['courses'],
            'milestones': user_progress.get('milestones', []),
            'achievements': achievements,
            'summary': {
                'totalSkills': total_skills,
                'masteredSkills': mastered_skills,
                'averageSkillLevel': avg_level,
                'hoursCompleted': hours_completed,
                'completionRate': overall_progress
            }
        }
        
        return jsonify({
            'success': True,
            'dashboard': dashboard_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update-progress', methods=['POST'])
def update_progress():
    """Update progress for skills or courses"""
    try:
        data = request.json
        
        if 'userId' not in data:
            return jsonify({'error': 'Missing userId'}), 400
        
        user_id = data['userId']
        
        if user_id not in progress_data:
            return jsonify({'error': 'User progress not found'}), 404
        
        # Update skill progress
        if 'skillProgress' in data:
            for skill_update in data['skillProgress']:
                for skill in progress_data[user_id]['skills']:
                    if skill['name'] == skill_update['name']:
                        skill['progress'] = skill_update['progress']
                        break
        
        # Update course progress
        if 'courseProgress' in data:
            for course_update in data['courseProgress']:
                for course in progress_data[user_id]['courses']:
                    if course['title'] == course_update['title']:
                        course['progress'] = course_update['progress']
                        if course_update['progress'] == 100:
                            course['status'] = 'completed'
                        elif course_update['progress'] > 0:
                            course['status'] = 'in-progress'
                        break
        
        return jsonify({
            'success': True,
            'message': 'Progress updated successfully',
            'progress': progress_data[user_id]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/achievements/<user_id>', methods=['GET'])
def get_achievements(user_id):
    """Retrieve achievements, XP, streak, and badges for a user"""
    try:
        achievements = get_user_achievements(user_id)
        return jsonify({
            'success': True,
            'achievements': achievements
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update-achievements', methods=['POST'])
def update_achievements():
    """Trigger XP increase, update study streaks, and unlock badges"""
    try:
        data = request.json or {}
        user_id = data.get('userId')
        xp_gain = data.get('xpGain', 0)
        
        if not user_id:
            return jsonify({'error': 'Missing userId'}), 400
            
        achievements = get_user_achievements(user_id)
        
        # Update XP
        achievements['xp'] += xp_gain
        
        # Check streak
        today_str = datetime.now().strftime('%Y-%m-%d')
        last_active = achievements['last_active']
        
        if last_active:
            try:
                last_date = datetime.strptime(last_active, '%Y-%m-%d')
                today_date = datetime.strptime(today_str, '%Y-%m-%d')
                delta = (today_date - last_date).days
                
                if delta == 1:
                    achievements['streak'] += 1
                elif delta > 1:
                    achievements['streak'] = 1
            except Exception:
                achievements['streak'] = 1
        else:
            achievements['streak'] = 1
            
        achievements['last_active'] = today_str
        
        # Badge unlocks check
        new_badges = []
        if achievements['xp'] >= 50 and 'first_steps' not in achievements['badges']:
            achievements['badges'].append('first_steps')
            new_badges.append('first_steps')
            
        if achievements['streak'] >= 3 and 'streak_starter' not in achievements['badges']:
            achievements['badges'].append('streak_starter')
            new_badges.append('streak_starter')
            
        if achievements['xp'] >= 200 and 'xp_champion' not in achievements['badges']:
            achievements['badges'].append('xp_champion')
            new_badges.append('xp_champion')
            
        return jsonify({
            'success': True,
            'achievements': achievements,
            'newBadges': new_badges
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/submit-quiz', methods=['POST'])
def submit_quiz():
    """Submit a quiz for a specific milestone"""
    try:
        data = request.json or {}
        user_id = data.get('userId')
        milestone_id = data.get('milestoneId')
        score = data.get('score', 0)
        total_questions = data.get('totalQuestions', 3)
        
        if not user_id or not milestone_id:
            return jsonify({'error': 'Missing userId or milestoneId'}), 400
            
        # Complete milestone in roadmap progress
        if user_id in learning_paths:
            path = learning_paths[user_id]
            for ms in path.get('milestones', []):
                if ms['id'] == milestone_id:
                    ms['status'] = 'completed'
                    
        # Update progress data if exists
        if user_id in progress_data:
            milestones_prog = progress_data[user_id].get('milestones', [])
            for msp in milestones_prog:
                if msp['id'] == milestone_id:
                    msp['status'] = 'completed'
                    
        achievements = get_user_achievements(user_id)
        
        # Check if perfect score
        unlocked = []
        if score == total_questions:
            if 'quiz_master' not in achievements['badges']:
                achievements['badges'].append('quiz_master')
                unlocked.append('quiz_master')
                
        # Award XP
        achievements['xp'] += 30
        
        # Check if all milestones are completed to unlock Domain Wizard badge
        if user_id in learning_paths:
            all_completed = all(ms.get('status') == 'completed' for ms in learning_paths[user_id].get('milestones', []))
            if all_completed:
                profile = learner_profiles.get(user_id, {})
                domain = profile.get('currentDomain', 'web-development')
                badge_name = f"{domain.split('-')[0]}_wizard"
                if badge_name not in achievements['badges']:
                    achievements['badges'].append(badge_name)
                    unlocked.append(badge_name)
                    
        # Track streak
        today_str = datetime.now().strftime('%Y-%m-%d')
        achievements['last_active'] = today_str
        
        return jsonify({
            'success': True,
            'achievements': achievements,
            'unlockedBadges': unlocked
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/submit-challenge', methods=['POST'])
def submit_challenge():
    """Submit a coding challenge for a specific milestone"""
    try:
        data = request.json or {}
        user_id = data.get('userId')
        milestone_id = data.get('milestoneId')
        code = data.get('code', '')
        
        if not user_id or not milestone_id:
            return jsonify({'error': 'Missing userId or milestoneId'}), 400
            
        # Complete milestone
        if user_id in learning_paths:
            path = learning_paths[user_id]
            for ms in path.get('milestones', []):
                if ms['id'] == milestone_id:
                    ms['status'] = 'completed'
                    
        if user_id in progress_data:
            milestones_prog = progress_data[user_id].get('milestones', [])
            for msp in milestones_prog:
                if msp['id'] == milestone_id:
                    msp['status'] = 'completed'
                    
        achievements = get_user_achievements(user_id)
        
        # Unlock Code Warrior badge
        unlocked = []
        if 'code_warrior' not in achievements['badges']:
            achievements['badges'].append('code_warrior')
            unlocked.append('code_warrior')
            
        # Award XP
        achievements['xp'] += 40
        
        # Check if all milestones are completed
        if user_id in learning_paths:
            all_completed = all(ms.get('status') == 'completed' for ms in learning_paths[user_id].get('milestones', []))
            if all_completed:
                profile = learner_profiles.get(user_id, {})
                domain = profile.get('currentDomain', 'web-development')
                badge_name = f"{domain.split('-')[0]}_wizard"
                if badge_name not in achievements['badges']:
                    achievements['badges'].append(badge_name)
                    unlocked.append(badge_name)
                    
        achievements['last_active'] = datetime.now().strftime('%Y-%m-%d')
        
        return jsonify({
            'success': True,
            'achievements': achievements,
            'unlockedBadges': unlocked
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/toggle-milestone', methods=['POST'])
def toggle_milestone():
    """Toggle the completion status of a milestone"""
    try:
        data = request.json or {}
        user_id = data.get('userId')
        milestone_id = data.get('milestoneId')
        completed = data.get('completed', False)
        
        if not user_id or not milestone_id:
            return jsonify({'error': 'Missing userId or milestoneId'}), 400
            
        new_status = 'completed' if completed else 'not-started'
        
        if user_id in learning_paths:
            path = learning_paths[user_id]
            for ms in path.get('milestones', []):
                if ms['id'] == milestone_id:
                    ms['status'] = new_status
                    
        if user_id in progress_data:
            milestones_prog = progress_data[user_id].get('milestones', [])
            for msp in milestones_prog:
                if msp['id'] == milestone_id:
                    msp['status'] = new_status
                    
        achievements = get_user_achievements(user_id)
        if completed:
            achievements['xp'] += 20
            
        # Check if all completed
        unlocked = []
        if completed and user_id in learning_paths:
            all_completed = all(ms.get('status') == 'completed' for ms in learning_paths[user_id].get('milestones', []))
            if all_completed:
                profile = learner_profiles.get(user_id, {})
                domain = profile.get('currentDomain', 'web-development')
                badge_name = f"{domain.split('-')[0]}_wizard"
                if badge_name not in achievements['badges']:
                    achievements['badges'].append(badge_name)
                    unlocked.append(badge_name)
                    
        return jsonify({
            'success': True,
            'achievements': achievements,
            'unlockedBadges': unlocked
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Feedback and Chatbot API Implementation
IS_VERCEL = 'VERCEL' in os.environ

if IS_VERCEL:
    FEEDBACKS_FILE = '/tmp/feedbacks.csv'
    # Copy template feedbacks file to /tmp if it exists and /tmp doesn't have it yet
    if not os.path.exists(FEEDBACKS_FILE) and os.path.exists('data/feedbacks.csv'):
        import shutil
        os.makedirs('/tmp', exist_ok=True)
        try:
            shutil.copy('data/feedbacks.csv', FEEDBACKS_FILE)
        except Exception as e:
            print(f"Error copying template feedbacks: {e}")
else:
    FEEDBACKS_FILE = 'data/feedbacks.csv'

def init_feedback_csv():
    """Initialize feedbacks.csv with sample records if it doesn't exist"""
    if os.path.exists(FEEDBACKS_FILE):
        try:
            df = pd.read_csv(FEEDBACKS_FILE)
            if not df.empty:
                return
        except Exception:
            pass
            
    # Sample feedbacks
    samples = [
        {"feedback_id": "fb_1", "name": "Emily Carter", "overall_rating": 5, "recommendation_rating": 5, "customization_rating": 5, "comments": "Absolutely loved the personalized web development roadmap! The recommended courses match my pace perfectly.", "requested_features": "Study Planner,AI Chatbot", "sentiment": "Positive", "date": "2026-05-10T10:15:30"},
        {"feedback_id": "fb_2", "name": "Liam Davies", "overall_rating": 4, "recommendation_rating": 4, "customization_rating": 5, "comments": "The skill gap analysis showed me exactly what I was missing. It would be amazing if I could schedule these study hours directly in a calendar.", "requested_features": "Study Planner", "sentiment": "Positive", "date": "2026-05-11T14:22:11"},
        {"feedback_id": "fb_3", "name": "Sophia Martinez", "overall_rating": 3, "recommendation_rating": 3, "customization_rating": 4, "comments": "Good recommendations, but some of the intermediate courses require more coding experience. I would love a Certificate of Completion to show on my resume.", "requested_features": "Certifications,Job Matching", "sentiment": "Neutral", "date": "2026-05-12T09:05:00"},
        {"feedback_id": "fb_4", "name": "Noah Brooks", "overall_rating": 5, "recommendation_rating": 5, "customization_rating": 4, "comments": "The UI looks stunning. Very smooth transitions and helpful links. An AI Chatbot or Study Buddy would make this the ultimate learning portal.", "requested_features": "AI Chatbot", "sentiment": "Positive", "date": "2026-05-13T16:40:45"},
        {"feedback_id": "fb_5", "name": "Olivia Turner", "overall_rating": 4, "recommendation_rating": 5, "customization_rating": 3, "comments": "I registered for Data Science and got highly relevant Coursera classes. Can you add direct job referrals or matching with tech companies?", "requested_features": "Job Matching", "sentiment": "Positive", "date": "2026-05-14T11:55:00"},
        {"feedback_id": "fb_6", "name": "Aiden Vance", "overall_rating": 2, "recommendation_rating": 2, "customization_rating": 3, "comments": "I felt a bit overwhelmed by the 40 hours of study required per week. I need a study planner to help me break it down.", "requested_features": "Study Planner", "sentiment": "Negative", "date": "2026-05-15T18:10:20"},
        {"feedback_id": "fb_7", "name": "Isabella Chen", "overall_rating": 5, "recommendation_rating": 4, "customization_rating": 5, "comments": "Best personalized path generator I've used. Very robust. Adding certification options would be a great addition.", "requested_features": "Certifications", "sentiment": "Positive", "date": "2026-05-16T12:00:10"},
        {"feedback_id": "fb_8", "name": "Lucas Grey", "overall_rating": 4, "recommendation_rating": 3, "customization_rating": 4, "comments": "Nice layout. The courses seem high quality. Having a mentor connect feature would elevate it.", "requested_features": "Mentors", "sentiment": "Positive", "date": "2026-05-16T15:30:25"},
        {"feedback_id": "fb_9", "name": "Mia Jenkins", "overall_rating": 3, "recommendation_rating": 4, "customization_rating": 3, "comments": "It generated a web-dev path. I was hoping for more practice-based text resources. A chatbot would help me find those.", "requested_features": "AI Chatbot,Study Planner", "sentiment": "Neutral", "date": "2026-05-17T08:45:15"},
        {"feedback_id": "fb_10", "name": "Ethan Hunt", "overall_rating": 5, "recommendation_rating": 5, "customization_rating": 5, "comments": "Brilliant project. Adding a premium model with professional certifications and direct job matches would make this a viable business.", "requested_features": "Certifications,Job Matching", "sentiment": "Positive", "date": "2026-05-17T20:18:40"},
        {"feedback_id": "fb_11", "name": "Charlotte Webb", "overall_rating": 4, "recommendation_rating": 4, "customization_rating": 4, "comments": "Helped me structure my learning for the summer. It would be helpful to sync study hours directly with my Google calendar.", "requested_features": "Study Planner", "sentiment": "Positive", "date": "2026-05-18T10:05:00"},
        {"feedback_id": "fb_12", "name": "Benjamin Cole", "overall_rating": 5, "recommendation_rating": 4, "customization_rating": 4, "comments": "Simple and effective. Love the progress tracking! A chatbot assistant would make navigation even easier.", "requested_features": "AI Chatbot", "sentiment": "Positive", "date": "2026-05-18T14:32:00"},
        {"feedback_id": "fb_13", "name": "Amelia Vance", "overall_rating": 3, "recommendation_rating": 3, "customization_rating": 3, "comments": "Okay experience, but I need more mock tests and practice codes. Certificates would be cool.", "requested_features": "Certifications", "sentiment": "Neutral", "date": "2026-05-19T09:12:30"},
        {"feedback_id": "fb_14", "name": "Daniel Craig", "overall_rating": 4, "recommendation_rating": 5, "customization_rating": 4, "comments": "Recommended courses match my goal perfectly. Job matches in my area would be extremely helpful.", "requested_features": "Job Matching", "sentiment": "Positive", "date": "2026-05-19T16:48:00"},
        {"feedback_id": "fb_15", "name": "Harper Lee", "overall_rating": 5, "recommendation_rating": 5, "customization_rating": 5, "comments": "The skill assessment was simple and the recommendations are exactly what I needed. I am following the path daily!", "requested_features": "Study Planner,Certifications", "sentiment": "Positive", "date": "2026-05-20T11:20:15"},
        {"feedback_id": "fb_16", "name": "Alexander Great", "overall_rating": 4, "recommendation_rating": 3, "customization_rating": 5, "comments": "Good path. Can we get an interactive code editor or interactive chat to ask about specific syntax?", "requested_features": "AI Chatbot", "sentiment": "Positive", "date": "2026-05-20T17:02:40"},
        {"feedback_id": "fb_17", "name": "Evelyn Stone", "overall_rating": 2, "recommendation_rating": 3, "customization_rating": 2, "comments": "The suggested courses are too long. 50 hours of video is hard to manage. A study planner is critical for me.", "requested_features": "Study Planner", "sentiment": "Negative", "date": "2026-05-20T19:55:00"},
        {"feedback_id": "fb_18", "name": "Sebastian Bach", "overall_rating": 4, "recommendation_rating": 4, "customization_rating": 4, "comments": "Well integrated dashboard. Tracking my hours helps. Adding job matches for intermediate roles would be great.", "requested_features": "Job Matching", "sentiment": "Positive", "date": "2026-05-21T08:30:12"},
        {"feedback_id": "fb_19", "name": "Zoe Saldana", "overall_rating": 5, "recommendation_rating": 5, "customization_rating": 4, "comments": "Incredible customization! It really takes my educational background into account. Certifications + Job portals are logical next steps.", "requested_features": "Certifications,Job Matching", "sentiment": "Positive", "date": "2026-05-21T10:14:50"},
        {"feedback_id": "fb_20", "name": "William Shakespeare", "overall_rating": 4, "recommendation_rating": 4, "customization_rating": 5, "comments": "A very useful helper in my self-taught learning journey. A virtual study buddy to ask questions would be an excellent feature.", "requested_features": "AI Chatbot", "sentiment": "Positive", "date": "2026-05-21T12:05:33"}
    ]
    
    os.makedirs(os.path.dirname(FEEDBACKS_FILE), exist_ok=True)
    df = pd.DataFrame(samples)
    df.to_csv(FEEDBACKS_FILE, index=False)
    print(f"Generated {len(samples)} sample feedback records in {FEEDBACKS_FILE}")

@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    try:
        data = request.json or {}
        name = data.get('name', 'Anonymous')
        overall = int(data.get('overall_rating', 5))
        reco = int(data.get('recommendation_rating', 5))
        cust = int(data.get('customization_rating', 5))
        comments = data.get('comments', '')
        features = data.get('requested_features', '')
        
        # Heuristic sentiment analysis
        if overall >= 4:
            sentiment = "Positive"
        elif overall == 3:
            sentiment = "Neutral"
        else:
            sentiment = "Negative"
            
        new_feedback = {
            'feedback_id': f"fb_{int(datetime.now().timestamp())}",
            'name': name,
            'overall_rating': overall,
            'recommendation_rating': reco,
            'customization_rating': cust,
            'comments': comments,
            'requested_features': features,
            'sentiment': sentiment,
            'date': datetime.now().isoformat()
        }
        
        # Load and append
        if os.path.exists(FEEDBACKS_FILE):
            try:
                df = pd.read_csv(FEEDBACKS_FILE)
            except Exception:
                df = pd.DataFrame()
        else:
            df = pd.DataFrame()
            
        df = pd.concat([df, pd.DataFrame([new_feedback])], ignore_index=True)
        df.to_csv(FEEDBACKS_FILE, index=False)
        
        return jsonify({'success': True, 'message': 'Feedback submitted successfully', 'feedback': new_feedback}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/feedbacks', methods=['GET'])
def get_feedbacks():
    try:
        if not os.path.exists(FEEDBACKS_FILE):
            init_feedback_csv()
            
        df = pd.read_csv(FEEDBACKS_FILE)
        df['comments'] = df['comments'].fillna('')
        df['requested_features'] = df['requested_features'].fillna('')
        
        total = len(df)
        if total == 0:
            return jsonify({
                'success': True,
                'metrics': {
                    'total_feedbacks': 0,
                    'avg_overall': 0,
                    'avg_recommendation': 0,
                    'avg_customization': 0,
                    'nps': 0,
                    'sentiment': {'Positive': 0, 'Neutral': 0, 'Negative': 0},
                    'features': {}
                },
                'feedbacks': []
            })
            
        avg_overall = round(float(df['overall_rating'].mean()), 2)
        avg_reco = round(float(df['recommendation_rating'].mean()), 2)
        avg_cust = round(float(df['customization_rating'].mean()), 2)
        
        # NPS Score: promoters % (4-5) - detractors % (1-2)
        promoters = len(df[df['overall_rating'] >= 4])
        detractors = len(df[df['overall_rating'] <= 2])
        nps = round(((promoters - detractors) / total) * 100, 1)
        
        sentiment_counts = df['sentiment'].value_counts().to_dict()
        for s in ['Positive', 'Neutral', 'Negative']:
            if s not in sentiment_counts:
                sentiment_counts[s] = 0
                
        # Features counts
        features_dict = {}
        for _, row in df.iterrows():
            features_list = str(row['requested_features']).split(',')
            for f in features_list:
                f_clean = f.strip()
                if f_clean and f_clean != 'nan' and f_clean != '':
                    features_dict[f_clean] = features_dict.get(f_clean, 0) + 1
                    
        feedbacks_list = df.to_dict(orient='records')
        
        return jsonify({
            'success': True,
            'metrics': {
                'total_feedbacks': total,
                'avg_overall': avg_overall,
                'avg_recommendation': avg_reco,
                'avg_customization': avg_cust,
                'nps': nps,
                'sentiment': sentiment_counts,
                'features': features_dict
            },
            'feedbacks': feedbacks_list
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analytics-data', methods=['GET'])
def get_analytics_data():
    try:
        # Load students data
        students_file = 'data/students.csv'
        students_list = []
        if os.path.exists(students_file):
            students_df = pd.read_csv(students_file)
            students_list = students_df.to_dict(orient='records')
            
        # Add registered students from runtime memory
        for user_id, profile in learner_profiles.items():
            exists = False
            for s in students_list:
                if str(s.get('student_id')) == str(user_id) or s.get('name') == profile.get('fullName'):
                    exists = True
                    break
            if not exists:
                students_list.append({
                    'student_id': user_id,
                    'name': profile.get('fullName'),
                    'age': profile.get('age'),
                    'education_level': profile.get('educationLevel'),
                    'domain': profile.get('currentDomain'),
                    'experience_level': profile.get('experienceLevel'),
                    'learning_style': profile.get('learningStyle', 'video'),
                    'weekly_hours': profile.get('weeklyStudyHours', 10)
                })
                
        df = pd.DataFrame(students_list)
        if df.empty:
            return jsonify({
                'success': True,
                'domains': {},
                'experience': {},
                'education': {},
                'styles': {},
                'age_groups': {},
                'hours_vs_level': [],
                'total_students': 0
            })
            
        # Normalize and fillna
        df['domain'] = df['domain'].str.lower().str.strip()
        df['experience_level'] = df['experience_level'].str.lower().str.strip()
        df['education_level'] = df['education_level'].fillna("Bachelor's Degree").str.strip()
        
        if 'learning_style' not in df.columns:
            df['learning_style'] = 'video'
        else:
            df['learning_style'] = df['learning_style'].fillna('video')
            
        if 'weekly_hours' not in df.columns:
            # check if weeklyStudyHours was used instead
            if 'weeklyStudyHours' in df.columns:
                df['weekly_hours'] = df['weeklyStudyHours'].fillna(10)
            else:
                df['weekly_hours'] = 10
        else:
            df['weekly_hours'] = df['weekly_hours'].fillna(10)
            
        domains = df['domain'].value_counts().to_dict()
        experience = df['experience_level'].value_counts().to_dict()
        education = df['education_level'].value_counts().to_dict()
        styles = df['learning_style'].value_counts().to_dict()
        
        # Age distribution
        ages = pd.to_numeric(df['age'], errors='coerce').fillna(22).tolist()
        age_groups = {
            'Under 20': len([a for a in ages if a < 20]),
            '20-24': len([a for a in ages if 20 <= a <= 24]),
            '25-29': len([a for a in ages if 25 <= a <= 29]),
            '30+': len([a for a in ages if a >= 30])
        }
        
        # Weekly study hours list
        hours_vs_level = []
        for _, row in df.iterrows():
            hours_vs_level.append({
                'name': row.get('name', 'Student'),
                'hours': int(row.get('weekly_hours', 10)),
                'level': str(row.get('experience_level', 'beginner')).capitalize(),
                'domain': str(row.get('domain', 'other')).capitalize()
            })
            
        return jsonify({
            'success': True,
            'domains': domains,
            'experience': experience,
            'education': education,
            'styles': styles,
            'age_groups': age_groups,
            'hours_vs_level': hours_vs_level,
            'total_students': len(df)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json or {}
        message = str(data.get('message', '')).lower().strip()
        user_name = data.get('userName', 'Learner')
        user_domain = data.get('userDomain', 'web-development')
        xp = data.get('xp', 0)
        streak = data.get('streak', 0)
        
        if not message:
            return jsonify({'response': "Hello! I am your AI Study Copilot. Ask me anything about your learning path, courses, or schedule!"})
            
        response = ""
        
        if "progress" in message or "status" in message or "xp" in message or "streak" in message or "level" in message:
            level = int(xp // 100) + 1
            response = f"Sure {user_name}! Here is your real-time learning telemetry: \n🔥 **Streak**: {streak} days\n⚡ **Experience**: {xp} XP\n🏆 **Learner Level**: Level {level}\n\nYou're doing fantastic! Keep up the momentum to unlock more exclusive badges like the Domain Wizard!"
        elif "hello" in message or "hi" in message or "hey" in message:
            response = f"Hi {user_name}! 👋 I am your AI Study Tutor. I can help answer coding questions, recommend studies, or help you schedule your study hours. What are we studying today?"
        elif "react" in message:
            response = "React is a fantastic component-based UI library! ⚛️ To learn React effectively, start with:\n1. HTML5 & CSS3 layouts\n2. ES6+ JavaScript concepts (destructuring, map/filter, modules, async/await)\n3. React basics (components, props, state)\n4. React Hooks (useState, useEffect)\n\nI recommend taking the 'React - The Complete Guide' course. Would you like me to outline a weekly schedule for React?"
        elif "javascript" in message or "js" in message:
            response = "JavaScript is the backbone of web development! 🌐 Key areas to focus on: variables, functions, DOM manipulation, event listeners, array methods, and async operations (Promises, fetch). For a structured study, I suggest devoting at least 6-8 hours a week, starting with 'Complete JavaScript Course 2024'."
        elif "python" in message:
            response = "Python is the leading language for Data Science and AI! 🐍 It is known for its clean syntax. Start with variables, lists, dictionaries, functions, and file handling. Then, learn libraries like Pandas, NumPy, and Matplotlib. I suggest 'Python for Data Science' on Udemy as a starting point!"
        elif "data science" in message or "machine learning" in message or "ml" in message:
            response = "Data Science combines programming, statistics, and domain expertise. 📊 The ideal learning progression is:\n1. Python coding fundamentals\n2. SQL & Database Design (for retrieving data)\n3. Data Analysis & Visualization (Pandas, Seaborn)\n4. Machine Learning models (Scikit-learn)\n\nLet me know if you would like me to set up a Data Science learning plan!"
        elif "hours" in message or "time" in message or "study plan" in message or "schedule" in message or "calendar" in message:
            response = "Managing your time is key to learning success! 📅 In our new **Study Planner** tab on the **Demo Hub**, you can generate an automatic daily schedule based on your weekly study hours. For example, if you study 10 hours a week, devoting 2 hours every weekday allows your brain to absorb information much better than cramming on weekends!"
        elif "job" in message or "career" in message or "hired" in message or "work" in message:
            response = "Our roadmap incorporates direct job matching! 💼 Once you complete your path, you will get matches for job roles matching your skill level (e.g. Junior Web Developer). You can preview these jobs in the **Jobs & Certificate** section of the **Demo Hub**. Keep learning to unlock more job referrals!"
        elif "certificate" in message or "certification" in message:
            response = "Earning certificates is a great way to validate your skills! 📜 Once you finish a course or complete a path, you can claim your Certificate of Completion on the **Demo Hub** page. It can be added directly to your LinkedIn or resume!"
        elif "thank" in message:
            response = f"You are very welcome, {user_name}! 😊 I am always here to support your learning journey. Let me know if you need anything else!"
        else:
            response = f"That's a great question, {user_name}! 💡 Learning about '{message}' is highly valuable in today's tech market. I recommend starting with beginner courses in that domain and dedicating around 1.5 hours daily. Ask me for specific resource recommendations if you want to dive deeper!"
            
        return jsonify({'response': response}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    """Serve React built app static files from dist folder"""
    if path != "":
        normalized_path = os.path.normpath(os.path.join('dist', path))
        if os.path.exists(normalized_path) and os.path.isfile(normalized_path):
            dir_name, file_name = os.path.split(normalized_path)
            return send_from_directory(dir_name, file_name)
    return send_from_directory('dist', 'index.html')

if __name__ == '__main__':
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Initialize feedbacks
    init_feedback_csv()
    
    print("Starting Flask server...")
    print("API Endpoints:")
    print("  POST /register - Register learner profile")
    print("  POST /assessment - Submit skill assessment")
    print("  POST /generate-path - Generate learning path")
    print("  GET /dashboard/<user_id> - Get dashboard data")
    print("  POST /update-progress - Update progress")
    print("  POST /submit-feedback - Submit customer feedback")
    print("  GET /feedbacks - Get feedback analytics")
    print("  GET /analytics-data - Get customer behaviour analytics")
    print("  POST /chat - AI Study Tutor Chatbot")
    
    app.run(debug=True, host='0.0.0.0', port=5000)

