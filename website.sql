
INSERT INTO lecture (id, title, text, module_id) VALUES(1, "<h1>Why using GIT?</h1>","<img class='gitlogo' src='images/gitlogo.jpg'>

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
                    to participate in projects and ask for help.</p>",
                      1);

INSERT INTO lecture (id, title, text, module_id)
    VALUES(
         5, 
        "<h1>Branches</h1>", 
        "
        <figure>

            <img src='../images/branches1.png' alt='Branching example figure'/>
            <figcaption>Figure 1: Branch pointing into the commit’s data history
            </figcaption>    
        </figure> 
        <p>A branch in Git is simply a lightweight movable pointer to one of these commits. The default branch name in Git is master. As you initially make commits, you’re given a master branch that points to the last commit you made. Every time you commit, it moves forward automatically.</p>
                  
        <p>What happens if you create a new branch? Well, doing so creates a new pointer for you to move around. Let’s say you create a new branch called testing. You do this with the git branch command:</p>
        <code>
        $ git branch testing
        </code>

        <p>This creates a new pointer at the same commit you’re currently on (see Figure 1).</p>
                
                <p>How does Git know what branch you’re currently on? It keeps a special pointer called HEAD. Note that this is a lot different than the concept of HEAD in other VCSs you may be used to, such as Subversion or CVS. </p>
                <figure>

                        <img src='../images/branches2.png' alt='Branching example figure'/>
                       <figcaption>Figure 2: HEAD file pointing to the branch you’re on.
                       </figcaption>
                       </figure> 
                <p>In Git, this is a pointer to the local branch you’re currently on. In this case, you’re still on master. The <code>git branch</code> command only created a new branch — it didn’t switch to that branch (see Figure 3).</p>
               
                <p>To switch to an existing branch, you run the git checkout command. Let’s switch to the new testing branch:

                    <code>$ git checkout testing</code>
                    This moves HEAD to point to the testing branch
                    The branch that HEAD points to moves forward with each commit.
                    This is interesting, because now your testing branch has moved forward, but your <code>master</code> branch still points to the commit you were on when you ran <code>git checkout</code> to switch branches. Let’s switch back to the <code>master</code> branch:
                    
                   <code>$ git checkout master</code>  </p>
                   
                   <p>That command did two things. It moved the HEAD pointer back to point to the <code>master</code> branch, and it reverted the files in your working directory back to the snapshot that <code>master</code> points to. This also means the changes you make from this point forward will diverge from an older version of the project. It essentially rewinds the work you’ve done in your testing branch temporarily so you can go in a different direction.</p>
                   <figure>

                        <img src='../images/branches3.png' alt='Branching example figure'/>
                       <figcaption>Figure 3: The branch histories have diverged.
                       </figcaption>
                       </figure>
                   <p>You created and switched to a branch, did some work on it, and then switched back to your main branch and did other work. Both of those changes are isolated in separate branches: you can switch back and forth between the branches and merge (explained in the next lesson) them together when you’re ready. And you did all that with simple <code>branch</code> and <code>checkout</code> commands.</p>",
         "1"
    );
INSERT into lecture (id, title, text, module_id) VALUES(3, "<h1>test</h1>","<img class='gitlogo' src='images/gitlogo.jpg'>

                    <p>Test.</p>

                    ");

