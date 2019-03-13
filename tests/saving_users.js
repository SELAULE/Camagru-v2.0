<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Log In</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- <link rel="stylesheet" type="text/css" media="screen" href="main.css" /> -->
    <!-- <script src="main.js"></script> -->
    <style>
        body{
    background: #0d1521;
    font-family: tahoma;
    color: #989898;
}

#todo-table{
    position: relative;
    width: 95%;
    background: #090d13;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
}

#todo-table form:after{
    margin: 0;
    content: '';
    display: block;
    clear: both;
}

input[type="text"]{
    width: 70%;
    padding: 20px;
    background:#181c22;
    border: 0;
    float: left;
    font-size: 20px;
    color: #989898;
}

button, .google-btn {
    padding: 20px;
    width: 20%;
    float: left;
    background: #23282e;
    text-align: center;
    border: 0;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    font-size: 20px;
}

ul, a{
    list-style-type: none;
    padding: 0;
    margin: 0;
    text-decoration: none;
}
a:active {
    color: #989898;
}

li, a {
    width: 100%;
    box-sizing: border-box;
    font-family: arial;
    font-size: 20px;
    cursor: pointer;
    display: inline;
    letter-spacing: 1px;
}

li:hover, a{
    /* text-decoration: line-through; */
    background: rgba(0,0,0,0.2);
}

nav {
    background: rgba(0,0,0,0.2);
    width: 100%;
    height: 20%;
    padding: 20px;
    box-sizing: border-box;
    font-size: 20px;
    letter-spacing: 1px;
    color: #989898;
}

h1{
    margin-bottom: 0;
    text-indent: -10000px;
}

    </style>
</head>
<body>
    <nav>
        <ul>
            <li><a href="/">Homepage</a></li>
            <li><a href="/auth/login">Log In</a></li>
            <li><a href="/auth/logout">Log out</a></li>
        </ul>
    </nav>

    <header>
        <h1>Log In using...</h1>
    </header>
    <main>
        <a class="google-btn" href="/auth/google">Google+</a>
    </main>
</body>
</html>