INSERT into Lecture (Id, Title,Text) VALUES(1, "<h1>Why using GIT?</h1>"
                    ,"<img class='gitlogo' src='images/gitlogo.jpg'>

                    <p>If you have already worked on a programming project in group, you probably have encountered problems such as modifications by someone,
                    but you don’t know who, or the impossibility to work on the same code at the same time. All these problems can be solved 
                    by a version-control system. And Git is one of it.</p>

                    <h3>What is a version-control system?</h3>

                    <p>A version-control system is a software mainly used by developers. It can track the evolution of a file and keep the old versions of it by storing snapshots of your files. 
                    But this tool differs from a backup software. Indeed, there are a lot of very useful functionality:
                        <ul>
                            <li>They can retain who did every modification and why</li>
                            <li>It is capable to merge the modifications of two users working on the same file at the same time.</li>
                            <li>Short-Term and Long-Term Undo</li>
                            <li>Sandboxing</li>
                        </ul>
                    </p>
                    <p>To sum up, a version-control system can track the evolution of a code, can save every version of the file, and allows developers 
                    to work on the same file at the same time. Today, every development companies require employees to use version control.</p><br>

                    <p>There are a lot of different version-control system, like CVS, SVN or Mercurial. But Git is probably the most powerful of them.
                    There are two kind of version-control : distributed and centralized. A distributed version-control does not use any server.
                    Every developers own their own personal version of a file, and send it to the other as a peer-to-peer. A centralized version-control
                    uses a server where every version of the file is saved, and developers need to connect to the server to see modifications. But 
                    some of the distributed control-version uses a server to send the modification to the rest of the development group. And this is
                    how GIT works.</p>

                    <h3>And what about Git?</h3>

                    <p>Created by Linus Torvalds in 2005, Git is one of the most important version-control systems. Its goals include speed, data integrity
                    and support for distributed, non-linear workflows. CVS and SVN are older, and Git is probably faster and more flexible than the other 
                    version-control system. And GIT is Open Source (you can download and install it for free, we will see this in the next lecture).<br>
                    Moreover, it is possible to work with branches (parallel version of the same project) but the software is more intricate.</p>

                    <table class='CVS'>
                        <tr>
                            <td></td>
                            <td>Maintainer</td>
                            <td>Performance</td>
                            <td>Platforms Supported</td>
                            <td>Cost</td>
                        </tr>
                        <tr>
                            <td>GIT</td>
                            <td>Junio Hamano</td>
                            <td>*****</td>
                            <td>Windows, OS X</td>
                            <td>Free</td>
                        </tr>
                        <tr>
                            <td>CVS</td>
                            <td>CVS Team</td>
                            <td>****</td>
                            <td>Windows, OS X, Unix-Like</td>
                            <td>Free</td>
                        </tr>
                        <tr>
                            <td>Mercurial</td>
                            <td>Matt Mackall</td>
                            <td>***</td>
                            <td>Windows, OS X, Unix-Like</td>
                            <td>Free</td>
                        </tr>
                        <tr>
                            <td>Visual Source Safe</td>
                            <td>Microsoft</td>
                            <td>*****</td>
                            <td>Windows</td>
                            <td>500$ per license</td>
                        </tr>
                        <tr>
                            <td>SVN</td>
                            <td>Apache Software Foundation</td>
                            <td>****</td>
                            <td>Windows, OS X, Unix-Like</td>
                            <td>Free</td>
                        </tr>
                        <figcaption><strong>Comparison of some control-version system</strong></figcaption>
                    </table>

                    <p>Git is a must-have tool in a programming project, it has a lot of game-changing functionalities. A particularity of Git is the 
                    existence of collaborative website such as GitHub. This is a social media for developers, with a huge community. This is an excellent way
                    to participate in projects and ask for help.</p>");

INSERT INTO Lecture(Id, Title, Text) 
    VALUES(
         5, 
        "Branches", 
        "Discover how graph databases can help you manage and query highly connected data. 
        With this practical book, you’ll learn how to design and implement a graph database 
        that brings the power of graphs to bear on a broad range of problem domains. 
        Whether you want to speed up your response to user queries or build a database that 
        can adapt as your business evolves, this book shows you how to apply the schema-free 
        graph model to real-world problems.
        
        This second edition includes new code samples and diagrams, using the latest Neo4j 
        syntax, as well as information on new functionality. Learn how different 
        organizations are using graph databases to outperform their competitors. With this 
        book’s data modeling, query, and code examples, you’ll quickly be able to implement 
        your own solution."
    );


