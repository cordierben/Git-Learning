
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
                    
INSERT INTO lecture (id, title, text, module_id) VALUES(6,“<h1>Merging</h1>”,
'<p>When working on a project in Git, it is good practice to separate the code into different branches as it is developed. Branching allows different versions of the project to exist simultaneously without the risk of code being overwritten or modified unwantedly. Therefore each developer is able to work freely on different versions of the same project. Eventually however, the project will reach a point where we will want to compile all the code accordingly &ndash; for this, we use the git merge command.</p>
<h2>Preparing to Merge</h2>
<p>There are several steps that are necessary before we may eventually begin to merge. It is necessary to verify that the repository is up-to-date with all recent versions first before commencing. We start by using the git fetch command, followed by typing git branch &ndash;va. The output should contain a line of code reading [Behind 1] which confirms that the master branch has received the new changes. This should then be followed by typing git checkout master, a command which will effectively &lsquo;master&rsquo; the branch that is currently active. After this, we just need to use the git pull command which will bring us to the point where we can now start merging.</p>
<h2>Process of Merging</h2>
<p>We only require the use of one command to effectively merge in Git: git merge. We type git merge, followed the name of the version. For example, if the version of the code was called latest-version, the line of code we would type would read git merge latest-version. Having successfully done this, the commit history will be updated with the addition of a &lsquo;merge commit&rsquo; which will signify that the branch from which we merged is safe to be deleted.</p>
<p>In some cases however, the process may not be successful due to a &lsquo;merge conflict&rsquo;. The steps that need to be taken to effectively resolve merge conflicts is detailed in the following video.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/MzpW-k66XE8"></iframe>
<h3>In summary&hellip;</h3>
<ul>
<li>Branching allows simultaneous development of different versions</li>
<li>Preparing to merge involves git fetch, git branch, git checkout and git pull commands</li>
<li>Merging involves git merge command (followed by version name)</li>
<li>Check that the repository is updated before starting merge</li>
</ul>', 1);
                    

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

INSERT INTO lecture (id, title, text, module_id) VALUES(2,  "<h1>How to install git?</h1>","
<h3>Installing Git</h3> 

<p>Before you start using Git, you have to make it available on your computer. Even if it’s already installed, it’s probably a good idea to update to the latest version.</p>

<h4>Installing on Windows</h4>

<p>There are also a few ways to install Git on Windows. The most official build is available for download on the Git website. Just go to <a href='https://git-scm.com/download/win'>https://git-scm.com/download/win</a> and the download will start automatically. Note that this is a project called Git for Windows, which is separate from Git itself; for more information on it, go to <a href='https://gitforwindows.org'>https://gitforwindows.org</a>. 
<p>To get an automated installation you can use the <a href='https://chocolatey.org/packages/git'>Git Chocolatey package.</a> Note that the Chocolatey package is community maintained.</p>
<p>Another easy way to get Git installed is by installing GitHub Desktop. The installer includes a command line version of Git as well as the GUI. It also works well with PowerShell, and sets up solid credential caching and sane CRLF settings. We’ll learn more about those things a little later, but suffice it to say they’re things you want. You can download this from the <a href='https://desktop.github.com/'>GitHub Desktop website</a>.</p>

<h4>Installing on Linux</h4>

<p>If you want to install the basic Git tools on Linux via a binary installer, you can generally do so through the package management tool that comes with your distribution. If you’re on Fedora (or any closely-related RPM-based distribution, such as RHEL or CentOS), you can use dnf:</p>

<p style= 'background-color:lightgray;'>$ sudo dnf install git-all</p>

<p>If you’re on a Debian-based distribution, such as Ubuntu, try apt:</p>

<p style='background-color:lightgray'>$ sudo apt install git-all</p>

<p>For more options, there are instructions for installing on several different Unix distributions on the Git website, at <a href='https://git-scm.com/download/linux'>https://git-scm.com/download/linux</a>.</p>

<h4>Installing on macOS</h4>

<p>There are several ways to install Git on a Mac. The easiest is probably to install the Xcode Command Line Tools. On Mavericks (10.9) or above you can do this simply by trying to run git from the Terminal the very first time.</p>

<p style='background-color:lightgray'>$ git --version</p>

<p>If you don’t have it installed already, it will prompt you to install it.</p>

<p>If you want a more up to date version, you can also install it via a binary installer. A macOS Git installer is maintained and available for download at the Git website, at <a href='https://git-scm.com/download/mac'>https://git-scm.com/download/mac</a>.
You can also install it as part of the GitHub for macOS install. Their GUI Git tool has an option to install command line tools as well. You can download that tool from the GitHub for macOS website, at <a href='https://desktop.github.com'>https://desktop.github.com</a>.</p>

<h4>Installing from Source</h4>

<p>Some people may instead find it useful to install Git from source, because you’ll get the most recent version. The binary installers tend to be a bit behind, though as Git has matured in recent years, this has made less of a difference.</p>
<p>If you do want to install Git from source, you need to have the following libraries that Git depends on: autotools, curl, zlib, openssl, expat, and libiconv. For example, if you’re on a system that has <code style='background-color: lightgray;'>dnf</code> (such as Fedora) or <code style='background-color: lightgray;'>apt-get</code> (such as a Debian-based system), you can use one of these commands to install the minimal dependencies for compiling and installing the Git binaries:</p>
<p style='background-color:lightgray'>$ sudo dnf install dh-autoreconf curl-devel expat-devel gettext-devel \
  openssl-devel perl-devel zlib-devel
<br>$ sudo apt-get install dh-autoreconf libcurl4-gnutls-dev libexpat1-dev \
  gettext libz-dev libssl-dev</p>

  <p>In order to be able to add the documentation in various formats (doc, html, info), these additional dependencies are required (Note: users of RHEL and RHEL-derivatives like CentOS and Scientific Linux will have to enable the EPEL repository to download the <code style='background-color: lightgray;'>docbook2X</code> package):</p>

  <p style='background-color:lightgray'>$ sudo dnf install asciidoc xmlto docbook2X
<br>$ sudo apt-get install asciidoc xmlto docbook2x</p>

<p>If you’re using a Debian-based distribution (Debian/Ubuntu/Ubuntu-derivatives), you also need the <code style='background-color: lightgray;'>install-info</code> package:</p>

<p style='background-color:lightgray'>$ sudo apt-get install install-info</p>



<p>If you’re using a RPM-based distribution (Fedora/RHEL/RHEL-derivatives), you also need the <code style='background-color: lightgray;'>getopt</code> package (which is already installed on a Debian-based distro):</p>


<p style='background-color:lightgray'>$ sudo dnf install getopt
<br>$ sudo apt-get install getopt</p>


<p>Additionally, if you’re using Fedora/RHEL/RHEL-derivatives, you need to do this</p>


<p style='background-color:lightgray'>$ sudo ln -s /usr/bin/db2x_docbook2texi /usr/bin/docbook2x-texi</p>

<p>due to binary name differences.</p>

<p>When you have all the necessary dependencies, you can go ahead and grab the latest tagged release tarball from several places. You can get it via the kernel.org site, at <a href='https://www.kernel.org/pub/software/scm/git'>https://www.kernel.org/pub/software/scm/git</a>, or the mirror on the GitHub website, at <a href='https://github.com/git/git/releases'>https://github.com/git/git/releases</a>. It’s generally a little clearer what the latest version is on the GitHub page, but the kernel.org page also has release signatures if you want to verify your download.</p>

<p>Then, compile and install:</p>


<p style='background-color:lightgray'>$ tar -zxf git-2.0.0.tar.gz
<br>$ cd git-2.0.0
<br>$ make configure
<br>$ ./configure --prefix=/usr
<br>$ make all doc info
<br>$ sudo make install install-doc install-html install-info</p>

<p>After this is done, you can also get Git via Git itself for updates:</p>


<p style='background-color:lightgray'>$ git clone git://git.kernel.org/pub/scm/git/git.git</p></p>
",1)
