
INSERT INTO lecture (id, title, text, module_id) VALUES(1, "<h1>Why using GIT?</h1>","<img class='gitlogo' src='../images/gitlogo.jpg'>

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
    
INSERT INTO lecture (id, title, text, module_id) VALUES(3, "<h1>How Do We Create A Repository?</h1>","<p>A git repository is a directory that is hidden within the project directory &ndash; it tracks and logs all modifications (commits) that are made to files in the directory by any user that has access to it. Because it creates a history of the versions of the files that have been worked on, it allows us to easily access the files as they were in the different stages in their development when needed. It can be easily identified in the directory folder through its <code>.git/</code> file name.</p>
<p><iframe src='https://www.youtube.com/embed/A-4WltCTVms' width='560' height='315' frameborder='0' allowfullscreen='allowfullscreen'></iframe></p>
<h2>Initialisation of a New Repository</h2>
<p>Before we may create our new repository, we must first navigate to our desired project folder that will both store the repository and provide the files for which version histories will be created. For this, we must us the <code>cd</code> command followed by the directory name/location.</p>
<p>Creating a new repository for our project directory requires the use of the git init command. Entering git init into the terminal effectively creates an new subdirectory labelled <code>.git</code> to which we can add or commit future changes. The command also results in the creation of a new master branch. Note however that if a previous repository was already in place, this command will re-initialise that pre-existing repository.</p>
<p>We now have an empty repository &ndash; to populate it with our chosen files, we must first use the <code>git add</code> command. This command will effectively stage our files in the current directory, preparing them to be committed. Having staged the files, we then use the <code>git status</code> command to confirm that the files are ready to be committed in their current state before we are eventually able to use the <code>git commit</code> command to successfully commit our files to the new repository we created. Note that when using <code>git commit</code>, there are least two flags we must write after the command: <code>-a</code> and <code>-m</code>. <code>-a</code> is the flag that is responsible for committing all of the currently staged files, whereas <code>-m</code> is needed to add a commit message that can typically explain what content in the files has been added/changed/removed. The syntax needed for this line of code is displayed in the following example.</p>
<p><span style='background-color: #99ccff;'><code>$ git commit -am &ldquo;Title change commit&rdquo;</code></span></p>
<p>Creating a new repository will generate a subdirectory containing all relevant metadata pertaining to the files. The metadata incorporates more subdirectories with information about template files, refs and objects all of which will be present in some form in the version history record. The current commit from the user will also be referenced via the generation of a <code>HEAD</code> file.</p>
<p>The actions of the <code>git init</code> command will vary slightly depending on whether the project is already in active development or if a new project is being created. For the former for example, the <code>git init</code> command will create a version history of the project from that point onwards, whilst the latter will result in a new empty subdirectory with all version histories from the start. As a result of this, it is recommended that the <code>git init</code> command is used every time at the start of the project for a full version history record. There is also another consideration we must make if creating a repository for an existing project &ndash; there a risk of committing files or subdirectories to the repository that we may not want in there. For this we must create and commit a <code>.gitignore</code> file(s) that will explicitly tell Git to ignore these files. Such files that we may want Git to ignore include dependency caches for example, which include <code>node_modules</code> if working on a Node.js project.</p>
<h3>In summary&hellip;</h3>
<ul>
<li>A repository is a subdirectory that tracks all commits</li>
<li><code>cd</code> command is used to navigate to desired directory</li>
<li><code>git init</code> command is used to create a repository</li>
<li><code>add</code> command stages files,</li>
<li><code>status</code> command confirms files to be commited</li>
<li><code>commit</code> command commits the files to the repository</li>
<li><code>gitignore.</code>is used to prevent unwanted files in the repository</li>
<li>It is recommended to create a repository at the start of a project</li>
</ul>",1);


